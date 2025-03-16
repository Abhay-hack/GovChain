// backend/src/models/tender.js
const mongoose = require('mongoose');

const TenderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  employer: { type: String, required: true },
  descriptionHash: { type: String },
  budget: { type: Number },
  deadline: { type: Number },
  requiredCerts: [{ type: String }],
  winner: { type: String },
  isOpen: { type: Boolean },
  milestoneCount: { type: Number },
});

module.exports = mongoose.model('Tender', TenderSchema);