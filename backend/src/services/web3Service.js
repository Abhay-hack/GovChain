// backend/src/services/web3Service.js
const { Web3 } = require('web3');
const config = require('../config');

const VendorContract = require('../../../contracts/VendorContract.json');
const TenderContract = require('../../../contracts/TendorContract.json'); // Corrected typo
const PaymentContract = require('../../../contracts/PaymentContract.json');

let web3;
let vendorContract;
let tenderContract;
let paymentContract;

async function initializeWeb3() {
    try {
      console.log('Initializing Web3...');
      web3 = new Web3(config.network.rpcUrl);
      console.log('Web3 initialized:', web3);
  
      let networkId = await web3.eth.net.getId();
      networkId = networkId.toString().trim();
  
      console.log('Connected network ID:', networkId);
      console.log('Expected network ID:', config.network.networkId);
  
      if (JSON.stringify(networkId) !== JSON.stringify(config.network.networkId.toString())) {
        throw new Error(
          `Connected to network ${networkId}, expected ${config.network.networkId}`
        );
      }
  
      console.log('Initializing contracts...');
      vendorContract = new web3.eth.Contract(
        VendorContract.abi,
        config.contractAddresses.vendorContract
      );
      tenderContract = new web3.eth.Contract(
        TenderContract.abi,
        config.contractAddresses.tenderContract
      );
      paymentContract = new web3.eth.Contract(
        PaymentContract.abi,
        config.contractAddresses.paymentContract
      );
  
      console.log('Vendor Contract initialized:', vendorContract);
      console.log('Tender Contract initialized:', tenderContract);
      console.log('Payment Contract initialized:', paymentContract);
  
      console.log('Web3 and contracts initialized successfully.');
    } catch (error) {
      console.error('Error initializing Web3:', error);
      throw error;
    }
}


// Initialize on module load
initializeWeb3();

async function getWeb3() {
  if (!web3) {
    await initializeWeb3();
  }
  return web3;
}

async function getVendorContract() {
  if (!vendorContract) {
    await initializeWeb3();
  }
  return vendorContract;
}

async function getTenderContract() {
  if (!tenderContract) {
    await initializeWeb3();
  }
  return tenderContract;
}

async function getPaymentContract() {
  if (!paymentContract) {
    await initializeWeb3();
  }
  return paymentContract;
}

module.exports = {
  web3,
  vendorContract,
  tenderContract,
  paymentContract,
  getWeb3,
  getVendorContract,
  getTenderContract,
  getPaymentContract,
};