// backend/src/controllers/milestoneController.js

const milestoneService = require('../services/milestoneService');

async function createMilestone(req, res) {
  try {
    const { tenderId, milestoneName, description, dueDate } = req.body;
    const createdBy = req.user.address; // Assuming user info is attached by authMiddleware

    const newMilestone = await milestoneService.createMilestone(
      tenderId,
      milestoneName,
      description,
      dueDate,
      createdBy
    );
    res.status(201).json(newMilestone);
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getMilestonesForTender(req, res) {
  try {
    const { tenderId } = req.params;
    const milestones = await milestoneService.getMilestonesForTender(tenderId);
    res.status(200).json(milestones);
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getMilestoneById(req, res) {
  try {
    const { milestoneId } = req.params;
    const milestone = await milestoneService.getMilestoneById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.status(200).json(milestone);
  } catch (error) {
    console.error('Get milestone by ID error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateMilestone(req, res) {
  try {
    const { milestoneId } = req.params;
    const updatedMilestone = await milestoneService.updateMilestone(milestoneId, req.body);
    if (!updatedMilestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.status(200).json(updatedMilestone);
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteMilestone(req, res) {
    try{
        const { milestoneId } = req.params;
        const deletedMilestone = await milestoneService.deleteMilestone(milestoneId);
        if (!deletedMilestone){
            return res.status(404).json({error: "Milestone not found"});
        }
        res.status(200).json({message: "Milestone deleted successfully"});
    } catch(error){
        console.error("Delete milestone error:", error);
        res.status(500).json({error: error.message});
    }
}

module.exports = {
  createMilestone,
  getMilestonesForTender,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};