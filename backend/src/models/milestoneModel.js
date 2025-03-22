// backend/src/models/milestoneModel.js
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  tenderId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Tender model
    ref: 'Tender', // Matches the model name in tender.js
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Number, // Assuming this is a timestamp or similar
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);