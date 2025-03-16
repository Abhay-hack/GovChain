// backend/src/services/tenderService.js
const Web3 = require('web3');
console.log("tendorService.js: Web3 import test", typeof Web3);
const { getTenderContract } = require('./web3Service');
const config = require("../config");
const Tender = require('../models/tendor');

const createTender = async (address, descriptionHash, budget, deadline, requiredCerts, userAddress) => {
  try {
    const tenderContract = await getTenderContract();
    const tenderCount = await tenderContract.methods.getTenderCount().call();
    const tenderId = parseInt(tenderCount);

    const tender = new Tender({
      id: tenderId,
      employer: address,
      descriptionHash: descriptionHash,
      budget: budget,
      deadline: deadline,
      requiredCerts: requiredCerts,
      winner: null,
      isOpen: true,
      milestoneCount: 0,
    });

    await tender.save();
    return tender;
  } catch (error) {
    console.error('Error creating tender:', error);
    throw new Error('Failed to create tender: ' + error.message);
  }
};
const getTender = async (tenderId) => {
  try {
    const tenderContract = await getTenderContract(); // Use the getter
    const tenderData = await tenderContract.methods.getTender(tenderId).call();
    return tenderData;
  } catch (error) {
    console.error('Error getting tender:', error);
    throw new Error('Failed to get tender: ' + error.message); // Include error message
  }
};

const getTenderFromDatabase = async (tenderId) => {
  try {
    const tender = await Tender.findOne({ id: tenderId });
    if (!tender) {
      throw new Error('Tender not found in database.');
    }
    return tender;
  } catch (error) {
    console.error('Error getting tender from database:', error);
    throw new Error('Failed to get tender from database: ' + error.message);
  }
};

// ... other tender service functions

module.exports = {
  createTender,
  getTender,
  getTenderFromDatabase,
  // ... other exported functions
};