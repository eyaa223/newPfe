const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Association = require('../models/Association');

// @route   GET /api/donations
// @desc    Get all donations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter based on role
    if (req.user.role === 'user') {
      query.donor = req.user.id;
    } else if (req.user.role === 'association') {
      query.association = req.user.associationId;
    }
    // Admin can see all

    const donations = await Donation.find(query)
      .populate('donor', 'firstName lastName email')
      .populate('campaign', 'title')
      .populate('association', 'name logo')
      .sort('-donationDate');

    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
      error: error.message
    });
  }
});

// @route   GET /api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'firstName lastName email phone')
      .populate('campaign', 'title description')
      .populate('association', 'name logo email');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check authorization
    if (req.user.role === 'user' && donation.donor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this donation'
      });
    }

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donation',
      error: error.message
    });
  }
});

// @route   POST /api/donations
// @desc    Create new donation
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { campaign, amount, paymentMethod, message, isAnonymous } = req.body;

    // Verify campaign exists
    const campaignDoc = await Campaign.findById(campaign);
    if (!campaignDoc) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donation = await Donation.create({
      donor: req.user.id,
      campaign,
      association: campaignDoc.association,
      amount,
      paymentMethod,
      message,
      isAnonymous,
      transactionId,
      paymentStatus: 'completed' // In production, this would be 'pending' until payment is confirmed
    });

    // Update campaign and association amounts
    await Campaign.findByIdAndUpdate(campaign, {
      $inc: { currentAmount: amount, donationsCount: 1 }
    });

    await Association.findByIdAndUpdate(campaignDoc.association, {
      $inc: { totalDonations: amount }
    });

    const populatedDonation = await Donation.findById(donation._id)
      .populate('campaign', 'title')
      .populate('association', 'name logo');

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      donation: populatedDonation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating donation',
      error: error.message
    });
  }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status
// @access  Private (Admin or Association)
router.put('/:id/status', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.paymentStatus = paymentStatus;
    await donation.save();

    res.json({
      success: true,
      message: 'Donation status updated',
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating donation status',
      error: error.message
    });
  }
});

// @route   GET /api/donations/user/:userId
// @desc    Get donations by user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Users can only see their own donations unless admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const donations = await Donation.find({ donor: req.params.userId })
      .populate('campaign', 'title images')
      .populate('association', 'name logo')
      .sort('-donationDate');

    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user donations',
      error: error.message
    });
  }
});

// @route   GET /api/donations/campaign/:campaignId
// @desc    Get donations by campaign
// @access  Public
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const donations = await Donation.find({ 
      campaign: req.params.campaignId,
      paymentStatus: 'completed'
    })
      .populate('donor', 'firstName lastName')
      .sort('-donationDate')
      .limit(20);

    // Hide donor info for anonymous donations
    const filteredDonations = donations.map(donation => {
      if (donation.isAnonymous) {
        return {
          ...donation.toObject(),
          donor: { firstName: 'Anonymous', lastName: 'Donor' }
        };
      }
      return donation;
    });

    res.json({
      success: true,
      count: filteredDonations.length,
      donations: filteredDonations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign donations',
      error: error.message
    });
  }
});

module.exports = router;
