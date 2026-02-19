const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Association = require('../models/Association');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      // Admin stats
      stats = {
        totalUsers: await User.countDocuments(),
        totalAssociations: await Association.countDocuments(),
        verifiedAssociations: await Association.countDocuments({ isVerified: true }),
        totalCampaigns: await Campaign.countDocuments(),
        activeCampaigns: await Campaign.countDocuments({ status: 'active' }),
        totalDonations: await Donation.countDocuments(),
        totalDonationAmount: await Donation.aggregate([
          { $match: { paymentStatus: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        totalRequests: await Request.countDocuments(),
        pendingRequests: await Request.countDocuments({ status: 'pending' })
      };

      // Extract total amount
      stats.totalDonationAmount = stats.totalDonationAmount[0]?.total || 0;

    } else if (req.user.role === 'association') {
      // Association stats
      const campaigns = await Campaign.find({ association: req.user.associationId });
      const campaignIds = campaigns.map(c => c._id);

      stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
        totalDonations: await Donation.countDocuments({ 
          association: req.user.associationId,
          paymentStatus: 'completed'
        }),
        totalDonationAmount: await Donation.aggregate([
          { 
            $match: { 
              association: req.user.associationId,
              paymentStatus: 'completed'
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        totalRequests: await Request.countDocuments({ 
          assignedAssociation: req.user.associationId 
        }),
        pendingRequests: await Request.countDocuments({ 
          assignedAssociation: req.user.associationId,
          status: { $in: ['pending', 'reviewing'] }
        }),
        beneficiariesHelped: campaigns.reduce((sum, c) => sum + c.beneficiariesCount, 0)
      };

      stats.totalDonationAmount = stats.totalDonationAmount[0]?.total || 0;

    } else {
      // User stats
      stats = {
        totalDonations: await Donation.countDocuments({ donor: req.user.id }),
        totalDonationAmount: await Donation.aggregate([
          { 
            $match: { 
              donor: req.user.id,
              paymentStatus: 'completed'
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        totalRequests: await Request.countDocuments({ requester: req.user.id }),
        approvedRequests: await Request.countDocuments({ 
          requester: req.user.id,
          status: 'approved'
        }),
        campaignsSupported: await Donation.distinct('campaign', { 
          donor: req.user.id,
          paymentStatus: 'completed'
        })
      };

      stats.totalDonationAmount = stats.totalDonationAmount[0]?.total || 0;
      stats.campaignsSupported = stats.campaignsSupported.length;
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @route   GET /api/stats/donations/monthly
// @desc    Get monthly donation statistics
// @access  Private (Association or Admin)
router.get('/donations/monthly', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    
    let matchQuery = {
      paymentStatus: 'completed',
      donationDate: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    };

    if (req.user.role === 'association') {
      matchQuery.association = req.user.associationId;
    }

    const monthlyStats = await Donation.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $month: '$donationDate' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      year,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly statistics',
      error: error.message
    });
  }
});

// @route   GET /api/stats/campaigns/performance
// @desc    Get campaign performance statistics
// @access  Private (Association or Admin)
router.get('/campaigns/performance', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'association') {
      query.association = req.user.associationId;
    }

    const campaigns = await Campaign.find(query)
      .select('title goalAmount currentAmount donationsCount status')
      .sort('-currentAmount')
      .limit(10);

    const performanceData = campaigns.map(campaign => ({
      id: campaign._id,
      title: campaign.title,
      goalAmount: campaign.goalAmount,
      currentAmount: campaign.currentAmount,
      percentage: Math.round((campaign.currentAmount / campaign.goalAmount) * 100),
      donationsCount: campaign.donationsCount,
      status: campaign.status
    }));

    res.json({
      success: true,
      campaigns: performanceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign performance',
      error: error.message
    });
  }
});

// @route   GET /api/stats/top-donors
// @desc    Get top donors
// @access  Private (Association or Admin)
router.get('/top-donors', protect, authorize('association', 'admin'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    let matchQuery = { paymentStatus: 'completed', isAnonymous: false };
    
    if (req.user.role === 'association') {
      matchQuery.association = req.user.associationId;
    }

    const topDonors = await Donation.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$donor',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donor'
        }
      },
      { $unwind: '$donor' },
      {
        $project: {
          donorName: { $concat: ['$donor.firstName', ' ', '$donor.lastName'] },
          email: '$donor.email',
          totalAmount: 1,
          donationCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      topDonors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top donors',
      error: error.message
    });
  }
});

module.exports = router;
