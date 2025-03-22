// backend/src/services/ratingService.js

const Rating = require('../models/ratingModel'); // Assuming you have a Rating model
const Tender = require('../models/tendor'); // Assuming you have a Tender model

async function createRating(tenderId, vendorAddr, rating, comment, createdBy) {
  try {
    // 1. Validate tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      throw new Error('Tender not found.');
    }

    // 2. Validate rating value (e.g., between 1 and 5)
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }

    // 3. Create the rating in the database
    const newRating = new Rating({
      tenderId,
      vendorAddr,
      rating,
      comment,
      createdBy,
    });
    const savedRating = await newRating.save();

    return savedRating;
  } catch (error) {
    console.error('Error creating rating:', error);
    throw error;
  }
}

async function getRatingsForTender(tenderId) {
  try {
    const ratings = await Rating.find({ tenderId });
    return ratings;
  } catch (error) {
    console.error('Error getting ratings for tender:', error);
    throw error;
  }
}

async function getRatingById(ratingId) {
  try {
    const rating = await Rating.findById(ratingId);
    return rating;
  } catch (error) {
    console.error('Error getting rating by ID:', error);
    throw error;
  }
}

async function updateRating(ratingId, updatedData) {
  try {
    //Validate rating value.
    if(updatedData.rating){
      if (updatedData.rating < 1 || updatedData.rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
      }
    }

    const updatedRating = await Rating.findByIdAndUpdate(ratingId, updatedData, { new: true });
    return updatedRating;
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
}

async function deleteRating(ratingId) {
    try{
        const deletedRating = await Rating.findByIdAndDelete(ratingId);
        return deletedRating;
    } catch(error){
        console.error("Error deleting rating:", error);
        throw error;
    }
}

async function calculateAverageRatingForVendor(vendorAddr) {
  try {
    const ratings = await Rating.find({ vendorAddr });
    if (ratings.length === 0) {
      return 0; // No ratings, return 0
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    return averageRating;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw error;
  }
}

const getVendorRatingForTender = async (tenderId, vendorAddr) => {
  const rating = await Rating.findOne({ tenderId, vendorAddr });
  return rating;
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