const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Campaign = require('../models/Campaign');
const Association = require('../models/Association');
const upload = require('../middleware/upload');

// @route   GET /api/campaigns
// @desc    Get all campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, isUrgent, association, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (isUrgent) query.isUrgent = isUrgent === 'true';
    if (association) query.association = association;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const campaigns = await Campaign.find(query)
      .populate('association', 'name logo email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: campaigns.length,
      campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('association', 'name logo email phone address');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign',
      error: error.message
    });
  }
});

// @route   POST /api/campaigns
// @desc    Create new campaign
// @access  Private (Association)
router.post('/', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      goalAmount,
      startDate,
      endDate,
      isUrgent,
      location
    } = req.body;

    // Get user's association
    let associationId = req.user.associationId;
    
    // If admin, they can specify which association
    if (req.user.role === 'admin' && req.body.association) {
      associationId = req.body.association;
    }

    if (!associationId) {
      return res.status(400).json({
        success: false,
        message: 'No association found for this user'
      });
    }

    const campaign = await Campaign.create({
      title,
      description,
      association: associationId,
      category,
      goalAmount,
      startDate,
      endDate,
      isUrgent,
      location
    });

    // Update association's campaign count
    await Association.findByIdAndUpdate(associationId, {
      $inc: { totalCampaigns: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating campaign',
      error: error.message
    });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update campaign
// @access  Private (Association admin)
router.put('/:id', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if user owns this campaign
    if (req.user.role !== 'admin' && campaign.association.toString() !== req.user.associationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('association');

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign: updatedCampaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating campaign',
      error: error.message
    });
  }
});

// @route   POST /api/campaigns/:id/images
// @desc    Upload campaign images
// @access  Private (Association)
router.post('/:id/images', protect, authorize('association', 'admin'), upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const imageUrls = req.files.map(file => `/uploads/campaigns/${file.filename}`);

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      imageUrls,
      campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// @route   POST /api/campaigns/:id/updates
// @desc    Add campaign update
// @access  Private (Association)
router.post('/:id/updates', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const { title, content } = req.body;

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    campaign.updates.push({ title, content });
    await campaign.save();

    res.json({
      success: true,
      message: 'Update added successfully',
      campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding update',
      error: error.message
    });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete campaign
// @access  Private (Association admin or Admin)
router.delete('/:id', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && campaign.association.toString() !== req.user.associationId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this campaign'
      });
    }

    await campaign.deleteOne();

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting campaign',
      error: error.message
    });
  }
});

module.exports = router;
