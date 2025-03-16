// backend/src/models/employee.js

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true }, // Ethereum address (user identifier)
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String },
    jobTitle: { type: String },
    hireDate: { type: Date },
    // Add other employee-specific fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);