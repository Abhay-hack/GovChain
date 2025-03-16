// backend/src/controllers/disputeController.js

const disputeService = require('../services/disputeService');

async function createDispute(req, res) {
  try {
    const { tenderId, vendorAddr, disputeDescription, evidenceHashes } = req.body;
    const createdBy = req.user.address; // Assuming user info is attached by authMiddleware

    const newDispute = await disputeService.createDispute(
      tenderId,
      vendorAddr,
      disputeDescription,
      evidenceHashes,
      createdBy
    );
    res.status(201).json(newDispute);
  } catch (error) {
    console.error('Create dispute error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getDisputesForTender(req, res) {
  try {
    const { tenderId } = req.params;
    const disputes = await disputeService.getDisputesForTender(tenderId);
    res.status(200).json(disputes);
  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getDisputeById(req, res) {
  try {
    const { disputeId } = req.params;
    const dispute = await disputeService.getDisputeById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    res.status(200).json(dispute);
  } catch (error) {
    console.error('Get dispute by ID error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateDispute(req, res) {
  try {
    const { disputeId } = req.params;
    const updatedDispute = await disputeService.updateDispute(disputeId, req.body);
    if (!updatedDispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    res.status(200).json(updatedDispute);
  } catch (error) {
    console.error('Update dispute error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteDispute(req, res) {
    try{
        const { disputeId } = req.params;
        const deletedDispute = await disputeService.deleteDispute(disputeId);
        if (!deletedDispute){
            return res.status(404).json({error: "Dispute not found"});
        }
        res.status(200).json({message: "Dispute deleted successfully"});
    } catch(error){
        console.error("Delete dispute error:", error);
        res.status(500).json({error: error.message});
    }
}

module.exports = {
  createDispute,
  getDisputesForTender,
  getDisputeById,
  updateDispute,
  deleteDispute,
};