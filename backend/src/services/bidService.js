// backend/src/services/bidService.js

const Bid = require('../models/bidModel');
const Tender = require('../models/tenderModel'); // Assuming you have a Tender model
const web3Service = require('./web3Service'); // Assuming you have web3Service for blockchain interactions

async function createBid(tenderId, vendorAddr, amount, bidDetails) {
  try {
    // 1. Validate tender exists and is active (optional, depends on your logic)
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      throw new Error('Tender not found.');
    }
    // Add more validation checks if needed (e.g., tender status, deadlines)

    // 2. Validate vendor is allowed to bid (optional)
    // You might check if the vendor is blacklisted or meets certain criteria

    // 3. Create bid in the database
    const newBid = new Bid({
      tenderId,
      vendorAddr,
      amount,
      bidDetails,
    });
    const savedBid = await newBid.save();

    // 4. Optionally, interact with smart contract to record bid on blockchain
    // Example:
    // await web3Service.submitBid(tenderId, vendorAddr, amount);

    return savedBid;
  } catch (error) {
    console.error('Error creating bid:', error);
    throw error;
  }
}

async function getBidsForTender(tenderId) {
  try {
    const bids = await Bid.find({ tenderId });
    return bids;
  } catch (error) {
    console.error('Error getting bids for tender:', error);
    throw error;
  }
}

async function getBidById(bidId){
    try{
        const bid = await Bid.findById(bidId);
        return bid;
    } catch (error){
        console.error("Error getting bid by id:", error);
        throw error;
    }
}

async function deleteBid(bidId){
    try{
        const deletedBid = await Bid.findByIdAndDelete(bidId);
        return deletedBid;
    } catch (error){
        console.error("Error deleting bid:", error);
        throw error;
    }
}

async function updateBid(bidId, updatedData){
    try{
        const updatedBid = await Bid.findByIdAndUpdate(bidId, updatedData, {new:true});
        return updatedBid;
    } catch(error){
        console.error("Error updating bid:", error);
        throw error;
    }
}

module.exports = {
  createBid,
  getBidsForTender,
  getBidById,
  deleteBid,
  updateBid,
};