const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Association name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  logo: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  website: String,
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true
  },
  categories: [{
    type: String,
    enum: ['education', 'health', 'poverty', 'environment', 'children', 'elderly', 'animals', 'other']
  }],
  adminUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  totalCampaigns: {
    type: Number,
    default: 0
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Association', associationSchema);
