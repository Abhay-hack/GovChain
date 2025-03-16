// backend/src/services/authService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

async function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function verifyToken(token) {
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch(error){
        return null;
    }
}

async function findUserByEmail(email) {
  return User.findOne({ email });
}

async function createUser(userData) {
  const newUser = new User(userData);
  return newUser.save();
}

async function validatePassword(password) {
    // Add your password validation logic here
    // Example: Minimum length, special characters, etc.
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
    }
    // Add more validation rules as needed
    return true;
}

async function validateEmail(email) {
    // Add your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
    return true;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  findUserByEmail,
  createUser,
  validatePassword,
  validateEmail
};