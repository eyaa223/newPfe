const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['education', 'health', 'poverty', 'environment', 'children', 'elderly', 'animals', 'other']
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'in_progress', 'completed'],
    default: 'pending'
  },
  requestType: {
    type: String,
    enum: ['financial', 'material', 'volunteer', 'other'],
    required: true
  },
  estimatedAmount: {
    type: Number,
    min: 0
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    city: String,
    country: String
  },
  assignedAssociation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Association'
  },
  reviewNotes: {
    type: String
  },
  reviewDate: {
    type: Date
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for queries
requestSchema.index({ requester: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ assignedAssociation: 1 });

module.exports = mongoose.model('Request', requestSchema);
