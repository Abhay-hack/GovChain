// frontend/src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext.jsx';
import { getProfile } from '../utils/api.js'; // Updated import

function Profile() {
  const { account } = useContext(WalletContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (account) {
        try {
          const profile = await getProfile();
          setUserData(profile);
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