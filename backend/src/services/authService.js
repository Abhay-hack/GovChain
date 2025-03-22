// backend/src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Vendor = require('../models/vendor');

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

async function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
}

async function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

async function findUserByEmail(email) {
  let user = await Vendor.findOne({ email });
  if (user) return { user, role: 'vendor' };
  user = await Employee.findOne({ email });
  if (user) return { user, role: 'employee' };
  return null;
}

async function createUser(userData) {
  const { role, ...data } = userData;
  if (role === 'vendor') {
    const newVendor = new Vendor(data);
    return newVendor.save();
  } else if (role === 'employee') {
    const newEmployee = new Employee(data);
    return newEmployee.save();
  } else {
    throw new Error('Invalid role');
  }
}

async function validatePassword(password) {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }
  return true;
}

async function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }
  return true;
}

async function findUserByAddress(address) {
  let user = await Vendor.findOne({ vendorAddr: address });
  if (user) return { user, role: 'vendor' };
  user = await Employee.findOne({ address });
  if (user) return { user, role: 'employee' };
  return null;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  findUserByEmail,
  createUser,
  validatePassword,
  validateEmail,
  findUserByAddress,
};