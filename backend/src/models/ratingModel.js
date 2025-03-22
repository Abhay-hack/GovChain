// D:\GovChain\backend\src\models\ratingModel.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true,
  },
  vendorAddr: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;