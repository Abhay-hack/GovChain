// backend/src/models/vendor.js

const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    vendorAddr: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    legalCertHash: { type: String },
    certHashes: [{ type: String }],
    workload: { type: Number, default: 0, min: 0, max: 100 },
    isBlacklisted: { type: Boolean, default: false },
    profileImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', VendorSchema);