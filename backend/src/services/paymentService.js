// backend/src/services/paymentService.js
const { web3, paymentContract } = require('./web3Service');

const fundTender = async (tenderId, amount, userAddress) => {
  try {
    const gas = await paymentContract.methods.fundTender(tenderId).estimateGas({ from: userAddress, value: amount });
    const receipt = await paymentContract.methods.fundTender(tenderId).send({ from: userAddress, value: amount, gas });
    return receipt;
  } catch (error) {
    console.error('Error funding tender:', error);
    throw new Error('Failed to fund tender');
  }
};

const getTenderFunds = async (tenderId) => {
  try {
    return await paymentContract.methods.getTenderFunds(tenderId).call();
  } catch (error) {
    console.error('Error getting tender funds:', error);
    throw new Error('Failed to get tender funds');
  }
};

// ... other payment service functions

module.exports = {
  fundTender,
  getTenderFunds,
  // ... other exported functions
};