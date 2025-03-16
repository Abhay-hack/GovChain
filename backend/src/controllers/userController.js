// backend/src/controllers/userController.js

const Vendor = require('../models/vendor');
const Employee = require('../models/employee');

async function getUserProfile(req, res) {
  try {
    const { address, role } = req.user;

    let profile;

    if (role === 'vendor') {
      profile = await Vendor.findOne({ vendorAddr: address });
    } else if (role === 'employee') {
      profile = await Employee.findOne({ address: address });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Exclude password from response
    const { password, ...profileWithoutPassword } = profile.toObject();

    res.status(200).json(profileWithoutPassword);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const { address, role } = req.user;
    const updateData = req.body;

    let updatedProfile;

    if (role === 'vendor') {
      updatedProfile = await Vendor.findOneAndUpdate({ vendorAddr: address }, updateData, { new: true });
    } else if (role === 'employee') {
      updatedProfile = await Employee.findOneAndUpdate({ address: address }, updateData, { new: true });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Exclude password from response
    const { password, ...profileWithoutPassword } = updatedProfile.toObject();

    res.status(200).json(profileWithoutPassword);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
};