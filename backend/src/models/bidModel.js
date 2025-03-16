// backend/src/models/bidModel.js

const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  tenderId: {
    type: Number,
    required: true,
  },
  vendorAddr: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Add other bid-related fields as needed
});

module.exports = mongoose.model('Bid', BidSchema);