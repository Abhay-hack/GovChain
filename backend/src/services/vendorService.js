// backend/src/services/vendorService.js
const { web3, vendorContract } = require('./web3Service');
const Vendor = require('../models/vendor');

const registerVendor = async (address, legalCertHash, certHashes, userAddress) => {
  try {
    // Check if the vendor already exists in the database
    const existingVendor = await Vendor.findOne({ vendorAddr: address });
    if (existingVendor) {
      throw new Error('Vendor already registered.');
    }

    const gas = await vendorContract.methods
      .registerVendor(legalCertHash, certHashes)
      .estimateGas({ from: userAddress });

    const tx = await vendorContract.methods
      .registerVendor(legalCertHash, certHashes)
      .send({ from: userAddress, gas });

    const vendor = new Vendor({
      vendorAddr: address,
      legalCertHash: legalCertHash,
      certHashes: certHashes,
      workload: 0,
      isBlacklisted: false,
    });

    await vendor.save();

    return { vendor, tx };
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw new Error('Failed to register vendor: ' + error.message);
  }
};

const getVendor = async (address) => {
  try {
    const vendorData = await vendorContract.methods.getVendor(address).call();
    return vendorData;
  } catch (error) {
    console.error('Error getting vendor:', error);
    throw new Error('Failed to get vendor: ' + error.message);
  }
};

const getVendorFromDatabase = async (address) => {
    try{
        const vendor = await Vendor.findOne({vendorAddr: address});
        if(!vendor){
            throw new Error("Vendor not found in database.");
        }
        return vendor;
    } catch (error){
        console.error("Error getting vendor from database:", error);
        throw new Error("Failed to get vendor from database: " + error.message);
    }
}

// ... other vendor service functions

module.exports = {
  registerVendor,
  getVendor,
  getVendorFromDatabase,
  // ... other exported functions
};