const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Request = require('../models/Request');
const upload = require('../middleware/upload');

// @route   GET /api/requests
// @desc    Get all requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, urgencyLevel } = req.query;
    
    let query = {};
    
    // Filter based on role
    if (req.user.role === 'user') {
      query.requester = req.user.id;
    } else if (req.user.role === 'association') {
      query.$or = [
        { assignedAssociation: req.user.associationId },
        { assignedAssociation: null, status: { $in: ['pending', 'reviewing'] } }
      ];
    }
    // Admin can see all
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;

    const requests = await Request.find(query)
      .populate('requester', 'firstName lastName email phone')
      .populate('assignedAssociation', 'name logo email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message
    });
  }
});

// @route   GET /api/requests/:id
// @desc    Get request by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'firstName lastName email phone address')
      .populate('assignedAssociation', 'name logo email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check authorization
    const isOwner = request.requester._id.toString() === req.user.id;
    const isAssigned = request.assignedAssociation?._id.toString() === req.user.associationId?.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching request',
      error: error.message
    });
  }
});

// @route   POST /api/requests
// @desc    Create new request
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      urgencyLevel,
      requestType,
      estimatedAmount,
      location
    } = req.body;

    const request = await Request.create({
      requester: req.user.id,
      title,
      description,
      category,
      urgencyLevel,
      requestType,
      estimatedAmount,
      location
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating request',
      error: error.message
    });
  }
});

// @route   PUT /api/requests/:id
// @desc    Update request
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Only requester can update their own request (if still pending)
    if (request.requester.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    if (request.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update request that is already being processed'
      });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Request updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating request',
      error: error.message
    });
  }
});

// @route   PUT /api/requests/:id/assign
// @desc    Assign request to association
// @access  Private (Association or Admin)
router.put('/:id/assign', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const associationId = req.user.role === 'admin' ? req.body.associationId : req.user.associationId;

    request.assignedAssociation = associationId;
    request.status = 'reviewing';
    await request.save();

    res.json({
      success: true,
      message: 'Request assigned successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning request',
      error: error.message
    });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status
// @access  Private (Association or Admin)
router.put('/:id/status', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if association is assigned to this request
    if (req.user.role !== 'admin' && request.assignedAssociation?.toString() !== req.user.associationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    request.status = status;
    if (reviewNotes) request.reviewNotes = reviewNotes;
    
    if (status === 'approved' || status === 'rejected') {
      request.reviewDate = Date.now();
    }
    
    if (status === 'completed') {
      request.completionDate = Date.now();
    }

    await request.save();

    res.json({
      success: true,
      message: 'Request status updated successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating request status',
      error: error.message
    });
  }
});

// @route   POST /api/requests/:id/documents
// @desc    Upload request documents
// @access  Private
router.post('/:id/documents', protect, upload.array('documents', 5), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.requester.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const documents = req.files.map(file => ({
      name: file.originalname,
      url: `/uploads/documents/${file.filename}`,
      uploadDate: Date.now()
    }));

    request.documents.push(...documents);
    await request.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading documents',
      error: error.message
    });
  }
});

// @route   DELETE /api/requests/:id
// @desc    Delete request
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Only requester or admin can delete
    if (request.requester.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting request',
      error: error.message
    });
  }
});

module.exports = router;
