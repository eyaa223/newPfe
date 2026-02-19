const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Association = require('../models/Association');
const User = require('../models/User');
const upload = require('../middleware/upload');

// @route   GET /api/associations
// @desc    Get all associations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, isVerified, isActive, search } = req.query;
    
    let query = {};
    
    if (category) query.categories = category;
    if (isVerified) query.isVerified = isVerified === 'true';
    if (isActive) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const associations = await Association.find(query)
      .populate('adminUsers', 'firstName lastName email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: associations.length,
      associations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching associations',
      error: error.message
    });
  }
});

// @route   GET /api/associations/:id
// @desc    Get association by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const association = await Association.findById(req.params.id)
      .populate('adminUsers', 'firstName lastName email avatar');

    if (!association) {
      return res.status(404).json({
        success: false,
        message: 'Association not found'
      });
    }

    res.json({
      success: true,
      association
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching association',
      error: error.message
    });
  }
});

// @route   POST /api/associations
// @desc    Create new association
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      email,
      phone,
      address,
      website,
      registrationNumber,
      categories
    } = req.body;

    // Check if association already exists
    const existingAssociation = await Association.findOne({
      $or: [{ email }, { registrationNumber }]
    });

    if (existingAssociation) {
      return res.status(400).json({
        success: false,
        message: 'Association with this email or registration number already exists'
      });
    }

    const association = await Association.create({
      name,
      description,
      email,
      phone,
      address,
      website,
      registrationNumber,
      categories,
      adminUsers: [req.user.id]
    });

    // Update user role and link to association
    await User.findByIdAndUpdate(req.user.id, {
      role: 'association',
      associationId: association._id
    });

    res.status(201).json({
      success: true,
      message: 'Association created successfully',
      association
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating association',
      error: error.message
    });
  }
});

// @route   PUT /api/associations/:id
// @desc    Update association
// @access  Private (Association admin)
router.put('/:id', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const association = await Association.findById(req.params.id);

    if (!association) {
      return res.status(404).json({
        success: false,
        message: 'Association not found'
      });
    }

    // Check if user is association admin
    if (req.user.role !== 'admin' && !association.adminUsers.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this association'
      });
    }

    const updatedAssociation = await Association.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Association updated successfully',
      association: updatedAssociation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating association',
      error: error.message
    });
  }
});

// @route   POST /api/associations/:id/logo
// @desc    Upload association logo
// @access  Private (Association admin)
router.post('/:id/logo', protect, authorize('association', 'admin'), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;

    const association = await Association.findByIdAndUpdate(
      req.params.id,
      { logo: logoUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logoUrl,
      association
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading logo',
      error: error.message
    });
  }
});

// @route   PUT /api/associations/:id/verify
// @desc    Verify association
// @access  Private/Admin
router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const association = await Association.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!association) {
      return res.status(404).json({
        success: false,
        message: 'Association not found'
      });
    }

    res.json({
      success: true,
      message: 'Association verified successfully',
      association
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying association',
      error: error.message
    });
  }
});

// @route   DELETE /api/associations/:id
// @desc    Delete association
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const association = await Association.findById(req.params.id);

    if (!association) {
      return res.status(404).json({
        success: false,
        message: 'Association not found'
      });
    }

    await association.deleteOne();

    res.json({
      success: true,
      message: 'Association deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting association',
      error: error.message
    });
  }
});

module.exports = router;
