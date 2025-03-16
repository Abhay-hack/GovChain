// backend/src/models/payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenderId: {
    type: String,
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
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'released', 'penalty'],
    default: 'pending',
  },
  // Add other relevant payment fields as needed
});

module.exports = mongoose.model('Payment', paymentSchema);