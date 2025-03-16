require('dotenv').config(); // Removed hardcoded path

console.log("MONGO_URI from config.js:", process.env.MONGO_URI);
console.log("Config.js is loading");

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not set in the environment.");
}

module.exports = {
  network: {
    rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8545', // Ensure this is correct
    chainId: parseInt(process.env.CHAIN_ID || '31337'),
    networkId: parseInt(process.env.NETWORK_ID || '31337'), // Or '11155111' if using Sepolia
  },
  contractAddresses: {
    vendorContract: process.env.VENDOR_CONTRACT_ADDRESS,
    tenderContract: process.env.TENDER_CONTRACT_ADDRESS,
    paymentContract: process.env.PAYMENT_CONTRACT_ADDRESS,
  },
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
  mongoURI: process.env.MONGO_URI,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  ipfs: {
    url: process.env.IPFS_URL || 'http://127.0.0.1:5001',
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
  },
  port: process.env.PORT || 3000, // added port variable.
};