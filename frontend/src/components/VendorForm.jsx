// frontend/src/components/VendorForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../contexts/WalletContext.jsx';
import { updateVendor, getProfile } from '../utils/api.js';

function VendorForm() {
  const { account } = useContext(WalletContext);
  const [certFiles, setCertFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getProfile();
        console.log('Logged-in user:', profile);
        setUserAddress(profile.address);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setCertFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!userAddress) {
      alert('Please log in first!');
      return;
    }
    if (certFiles.length === 0) {
      alert('Please select at least one certificate to upload.');
      return;
    }

    setUploading(true);
    try {
      const certHashes = [];
      for (const file of certFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('pinataMetadata', JSON.stringify({ name: file.name }));

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
          },
          body: uploadData,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Pinata upload failed');
        }
        certHashes.push(result.IpfsHash);
      }

      const vendorData = {
        vendorAddr: userAddress, // Use logged-in user's address
        legalCertHash: certHashes.length > 0 ? certHashes[0] : '',
        certHashes: certHashes.slice(1),
      };

      await updateVendor(vendorData);
      alert('Certificates updated successfully!');
      setCertFiles([]);
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Update failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center tracking-tight">
        Update Vendor Certificates
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="certFiles" className="block text-gray-700 font-medium mb-2">
            Certificates
          </label>
          <input
            type="file"
            id="certFiles"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:hover:bg-blue-600"
            disabled={uploading}
          />
          {certFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {certFiles.map((file, index) => (
                <li key={index} className="truncate">{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!account || !userAddress || uploading}
        >
          {uploading ? 'Uploading...' : account ? 'Update Certificates' : 'Connect Wallet to Update'}
        </button>
      </form>
      {userAddress && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Vendor Address: <span className="font-mono text-blue-600">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
        </p>
      )}
    </div>
  );
}

export default VendorForm;