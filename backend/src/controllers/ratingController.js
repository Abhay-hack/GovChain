// backend/src/controllers/ratingController.js

const ratingService = require('../services/ratingService');

async function createRating(req, res) {
  try {
    const { tenderId, vendorAddr, rating, comment } = req.body;
    const createdBy = req.user.address; // Assuming user info is attached by authMiddleware

    const newRating = await ratingService.createRating(
      tenderId,
      vendorAddr,
      rating,
      comment,
      createdBy
    );
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getRatingsForTender(req, res) {
  try {
    const { tenderId } = req.params;
    const ratings = await ratingService.getRatingsForTender(tenderId);
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getRatingById(req, res) {
  try {
    const { ratingId } = req.params;
    const rating = await ratingService.getRatingById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.status(200).json(rating);
  } catch (error) {
    console.error('Get rating by ID error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateRating(req, res) {
  try {
    const { ratingId } = req.params;
    const updatedRating = await ratingService.updateRating(ratingId, req.body);
    if (!updatedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.status(200).json(updatedRating);
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteRating(req, res) {
    try{
        const { ratingId } = req.params;
        const deletedRating = await ratingService.deleteRating(ratingId);
        if (!deletedRating){
            return res.status(404).json({error: "Rating not found"});
        }
        res.status(200).json({message: "Rating deleted successfully"});
    } catch(error){
        console.error("Delete rating error:", error);
        res.status(500).json({error: error.message});
    }
}

async function calculateAverageRatingForVendor(req, res) {
  try {
    const { vendorAddr } = req.params;
    const averageRating = await ratingService.calculateAverageRatingForVendor(vendorAddr);
    res.status(200).json({ averageRating });
  } catch (error) {
    console.error('Calculate average rating error:', error);
    res.status(500).json({ error: error.message });
  }
}

const getVendorRatingForTender = async (req, res) => {
  try {
    const { tenderId, vendorAddr } = req.params;
    const rating = await ratingService.getVendorRatingForTender(tenderId, vendorAddr);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.json(rating);
  } catch (error) {
    console.error('Get vendor rating error:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
};

module.exports = {
  createRating,
  getRatingsForTender,
  getRatingById,
  updateRating,
  deleteRating,
  calculateAverageRatingForVendor,
  getVendorRatingForTender,
};