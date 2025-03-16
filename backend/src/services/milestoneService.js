// backend/src/services/milestoneService.js

const Milestone = require('../models/milestoneModel');
const Tender = require('../models/tenderModel'); // Assuming you have a Tender model

async function createMilestone(tenderId, milestoneName, description, dueDate, createdBy) {
  try {
    // 1. Validate tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      throw new Error('Tender not found.');
    }

    // 2. Create the milestone in the database
    const newMilestone = new Milestone({
      tenderId,
      milestoneName,
      description,
      dueDate,
      createdBy,
    });
    const savedMilestone = await newMilestone.save();

    return savedMilestone;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
}

async function getMilestonesForTender(tenderId) {
  try {
    const milestones = await Milestone.find({ tenderId });
    return milestones;
  } catch (error) {
    console.error('Error getting milestones for tender:', error);
    throw error;
  }
}

async function getMilestoneById(milestoneId) {
  try {
    const milestone = await Milestone.findById(milestoneId);
    return milestone;
  } catch (error) {
    console.error('Error getting milestone by ID:', error);
    throw error;
  }
}

async function updateMilestone(milestoneId, updatedData) {
  try {
    const updatedMilestone = await Milestone.findByIdAndUpdate(milestoneId, updatedData, { new: true });
    return updatedMilestone;
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
}

async function deleteMilestone(milestoneId) {
    try{
        const deletedMilestone = await Milestone.findByIdAndDelete(milestoneId);
        return deletedMilestone;
    } catch(error){
        console.error("Error deleting milestone:", error);
        throw error;
    }
}

module.exports = {
  createMilestone,
  getMilestonesForTender,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};