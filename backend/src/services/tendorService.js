const Web3 = require('web3');
console.log("tendorService.js: Web3 import test", typeof Web3);
const { getTenderContract } = require('./web3Service');

const Tender = require('../models/tendor');

const createTender = async (address, descriptionHash, budget, deadline, requiredCerts, userAddress) => {
  try {
    const tenderContract = await getTenderContract();

    console.log("\ud83d\udce2 Sending createTender transaction to Blockchain...");

    const gasEstimate = await tenderContract.methods.createTender(
      descriptionHash, 
      budget, 
      deadline, 
      requiredCerts
    ).estimateGas({ from: userAddress });

    const tx = await tenderContract.methods.createTender(
      descriptionHash, 
      budget, 
      deadline, 
      requiredCerts
    ).send({ from: userAddress, gas: gasEstimate });

    console.log("\u2705 Tender Created on Blockchain - TX Hash:", tx.transactionHash);

    // Retrieve tender ID from blockchain
    const tenderCount = await tenderContract.methods.getTenderCount().call();
    const tenderId = parseInt(tenderCount) - 1;

    // Save tender to MongoDB
    const tender = new Tender({
      id: tenderId,
      employer: address,
      descriptionHash,
      budget,
      deadline,
      requiredCerts,
      winner: null,
      isOpen: true,
      milestoneCount: 0,
    });

    await tender.save();
    console.log("\u2705 Tender stored in MongoDB with ID:", tenderId);

    return tender;
  } catch (error) {
    console.error("\u274c Error creating tender:", error);
    throw new Error("Failed to create tender: " + error.message);
  }
};

const getTender = async (tenderId) => {
  try {
    const tenderContract = await getTenderContract();
    const tenderData = await tenderContract.methods.getTender(tenderId).call();
    return tenderData;
  } catch (error) {
    console.error('Error getting tender:', error);
    throw new Error('Failed to get tender: ' + error.message);
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

module.exports = {
  createTender,
  getTender,
  getTenderFromDatabase,
};
