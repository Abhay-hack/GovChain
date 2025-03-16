// backend/src/services/disputeService.js

const Dispute = require('../models/disputeModel');
const Tender = require('../models/tenderModel'); // Assuming you have a Tender model

async function createDispute(tenderId, vendorAddr, disputeDescription, evidenceHashes, createdBy) {
  try {
    // 1. Validate tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      throw new Error('Tender not found.');
    }

    // 2. Create the dispute in the database
    const newDispute = new Dispute({
      tenderId,
      vendorAddr,
      disputeDescription,
      evidenceHashes,
      createdBy,
    });
    const savedDispute = await newDispute.save();

    return savedDispute;
  } catch (error) {
    console.error('Error creating dispute:', error);
    throw error;
  }
}

async function getDisputesForTender(tenderId) {
  try {
    const disputes = await Dispute.find({ tenderId });
    return disputes;
  } catch (error) {
    console.error('Error getting disputes for tender:', error);
    throw error;
  }
}

async function getDisputeById(disputeId) {
  try {
    const dispute = await Dispute.findById(disputeId);
    return dispute;
  } catch (error) {
    console.error('Error getting dispute by ID:', error);
    throw error;
  }
}

async function updateDispute(disputeId, updatedData) {
  try {
    const updatedDispute = await Dispute.findByIdAndUpdate(disputeId, updatedData, { new: true });
    return updatedDispute;
  } catch (error) {
    console.error('Error updating dispute:', error);
    throw error;
  }
}

async function deleteDispute(disputeId) {
    try{
        const deletedDispute = await Dispute.findByIdAndDelete(disputeId);
        return deletedDispute;
    } catch(error){
        console.error("Error deleting dispute:", error);
        throw error;
    }
}

module.exports = {
  createDispute,
  getDisputesForTender,
  getDisputeById,
  updateDispute,
  deleteDispute,
};