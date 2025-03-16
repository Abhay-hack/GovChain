// backend/src/controllers/bidController.js

const bidService = require('../services/bidService');

async function createBid(req, res) {
  try {
    const { tenderId, amount, bidDetails } = req.body;
    const vendorAddr = req.user.address; // Assuming user info is attached by authMiddleware

    const newBid = await bidService.createBid(tenderId, vendorAddr, amount, bidDetails);
    res.status(201).json(newBid);
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({ error: error.message }); // Send error message from service
  }
}

async function getBidsForTender(req, res) {
  try {
    const { tenderId } = req.params;
    const bids = await bidService.getBidsForTender(tenderId);

    res.status(200).json(bids);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ error: error.message }); // Send error message from service
  }
}

module.exports = {
  createBid,
  getBidsForTender,
};