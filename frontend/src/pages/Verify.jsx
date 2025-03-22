// frontend/src/pages/Verify.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { fetchTenderDetails } from '../utils/web3.js';

function Verify() {
  const [tenderId, setTenderId] = useState('');
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tenderData = await fetchTenderDetails(provider, tenderId);
      setTender(tenderData);
    } catch (error) {
      console.error('Error verifying tender:', error);
      alert('Verification failed.');
      setTender(null); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight transition-all duration-300 hover:text-blue-600">
        Verify Tender
      </h1>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            <div>
              <label htmlFor="tenderId" className="block text-gray-700 font-medium mb-2">
                Tender ID
              </label>
              <input
                type="number"
                id="tenderId"
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                placeholder="Enter Tender ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
        {tender && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Tender Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="font-medium text-gray-900">ID:</strong> {tender.id}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium text-gray-900">Employer:</strong> {tender.employer}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium text-gray-900">Budget:</strong> {tender.budget} ETH
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;