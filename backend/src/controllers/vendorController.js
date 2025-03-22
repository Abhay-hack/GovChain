// backend/src/controllers/vendorController.js

const vendorService = require('../services/vendorService');
const cloudinaryService = require('../services/cloudinaryService');
const pinataService = require('../services/pinataService');
const Vendor = require('../models/vendor');
const User = require('../models/userModel');

const registerVendor = async (req, res) => {
  try {
    const { legalCertHash, certHashes } = req.body;
    const vendor = await vendorService.registerVendor(req.user.address, legalCertHash, certHashes);
    res.status(201).send('Vendor registered');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorAddr: req.query.address });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).send('Please provide image data');
    }

    const imageUrl = await cloudinaryService.uploadImageToCloudinary(image);

    const jsonData = {
      imageUrl: imageUrl,
    };

    const cid = await pinataService.uploadJsonToPinata(jsonData);

    await Vendor.findOneAndUpdate(
      { vendorAddr: req.user.address },
      { profileImage: cid },
      { new: true }
    );

    res.status(200).send({
      message: 'Profile image uploaded successfully',
      cid: cid,
      imageUrl: imageUrl,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getVendorProfileFromDB = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorAddr: req.query.address });
    if (!vendor) {
      return res.status(404).send('Vendor not found in Database');
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

async function updateVendor(req, res) {
  try {
    const { vendorAddr } = req.params;
    const { legalCertHash, certHashes } = req.body;

    const updateData = {};
    if (legalCertHash) updateData.legalCertHash = legalCertHash;
    if (certHashes) updateData.certHashes = certHashes;

    const vendor = await Vendor.findOneAndUpdate(
      { vendorAddr },
      { $set: updateData },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor certificates updated', vendor });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ error: error.message });
  }
}

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({});

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ message: 'No vendors found' });
    }

    res.status(200).json(vendors);
  } catch (error) {
    console.error('Error getting all vendors:', error);
    res.status(500).json({ error: error.message });
  }
};

const blacklistVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findOneAndUpdate(
      { vendorAddr: req.user.address },
      { isBlacklisted: true },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor blacklisted successfully', vendor: updatedVendor });
  } catch (error) {
    console.error('Error blacklisting vendor:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerVendor,
  getVendor,
  uploadProfileImage,
  getVendorProfileFromDB,
  updateVendor,
  getAllVendors,
  blacklistVendor,
};