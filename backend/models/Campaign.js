const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  association: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Association',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['education', 'health', 'poverty', 'environment', 'children', 'elderly', 'animals', 'other']
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  images: [{
    type: String
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  location: {
    city: String,
    country: String
  },
  beneficiariesCount: {
    type: Number,
    default: 0
  },
  donationsCount: {
    type: Number,
    default: 0
  },
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    images: [String]
  }]
}, {
  timestamps: true
});

// Calculate percentage of goal reached
campaignSchema.virtual('progressPercentage').get(function() {
  return this.goalAmount > 0 ? Math.round((this.currentAmount / this.goalAmount) * 100) : 0;
});

// Check if campaign is active
campaignSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.startDate <= now && 
         this.endDate >= now;
});

module.exports = mongoose.model('Campaign', campaignSchema);
