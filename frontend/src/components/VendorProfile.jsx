// frontend/src/components/VendorProfile.jsx
import React, { useState, useEffect } from 'react';
import { getVendorRating } from '../utils/api.js';

function VendorProfile({ vendorAddr }) {
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingData = await getVendorRating('507f1f77bcf86cd799439011', vendorAddr);
        setRatings(ratingData);
      } catch (error) {
        console.error('Error fetching vendor ratings:', error);
        setRatings(null);
      }
    };
    if (vendorAddr) fetchRatings();
  }, [vendorAddr]);

  return (
    <div className="vendor-profile">
      <h2>Vendor Profile</h2>
      <p><strong>Address:</strong> {vendorAddr}</p>
      {ratings ? (
        <>
          <p><strong>Rating:</strong> {ratings.rating} / 5</p>
          <p><strong>Comment:</strong> {ratings.comment || 'No comment'}</p>
        </>
      ) : (
        <p>No ratings available.</p>
      )}
    </div>
  );
}

export default VendorProfile;