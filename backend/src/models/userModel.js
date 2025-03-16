// backend/src/models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['vendor', 'employee'],
    required: true,
  },
  address: {
    type: String, // Ethereum address
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);