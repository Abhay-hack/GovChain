import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext.jsx';
import { getProfile, updateVendor, getTendersByEmployee } from '../utils/api.js';

function Profile() {
  const { account } = useContext(WalletContext);
  const [userData, setUserData] = useState(null);
  const [certFiles, setCertFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (account) {
        try {
          const profile = await getProfile();
          setUserData(profile);

          // Fetch tenders created by this employee
          if (profile.role === 'employee') {
            const employeeTenders = await getTendersByEmployee(profile.address);
            setTenders(employeeTenders);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [account]);

  const handleFileChange = (e) => {
    setCertFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
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
        vendorAddr: userData.address,
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
    <div className="profile-page min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight transition-all duration-300 hover:text-blue-600">
        Your Profile
      </h1>
      <div className="w-full max-w-md">
        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Loading profile...</p>
        ) : userData || account ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Profile Details
            </h2>
            <div className="space-y-3">
              {userData && (
                <>
                  <p className="text-gray-700">
                    <strong className="font-medium text-gray-900">Name:</strong> {userData.name}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium text-gray-900">Email:</strong> {userData.email}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium text-gray-900">Role:</strong> {userData.role}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium text-gray-900">Address:</strong>{' '}
                    <span className="font-mono text-blue-600">
                      {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
                    </span>
                  </p>
                </>
              )}
              {account && !userData && (
                <p className="text-gray-700">
                  <strong className="font-medium text-gray-900">Wallet Address:</strong>{' '}
                  <span className="font-mono text-blue-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </p>
              )}
            </div>

            {userData && userData.role === 'employee' && (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4 text-center">
                  Your Tenders
                </h3>
                {tenders.length > 0 ? (
                  <ul className="divide-y divide-gray-300">
                    {tenders.map((tender) => (
                      <li key={tender._id} className="py-4">
                        <h4 className="text-lg font-medium text-gray-900">{tender.name}</h4>
                        <p className="text-gray-700">Budget: ₹{tender.budget}</p>
                        <p className="text-gray-700">
                          Deadline: {new Date(tender.deadline * 1000).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">You have not created any tenders yet.</p>
                )}
              </>
            )}

            {userData && userData.role === 'vendor' && (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4 text-center">
                  Update Certificates
                </h3>
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
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Update Certificates'}
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No profile data available. Please log in or connect your wallet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
