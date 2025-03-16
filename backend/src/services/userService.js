// backend/src/services/userService.js

const User = require('../models/userModel'); // Assuming you have a User model
const bcrypt = require('bcrypt');

async function createUser(userData) {
  try {
    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...rest, password: hashedPassword });
    return await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

async function updateUser(userId, updatedData) {
  try {
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    return await User.findByIdAndUpdate(userId, updatedData, { new: true });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    return await User.findByIdAndDelete(userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    return await User.find();
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
};