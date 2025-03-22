// frontend/src/components/AdminPanel.jsx
import React, { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext.jsx';
import { blacklistVendor } from '../utils/web3.js'; // Hypothetical Web3 function

function AdminPanel() {
  const { account, provider } = useContext(WalletContext);

  const handleBlacklist = async (vendorAddr) => {
    if (!account || !provider) {
      alert('Please connect your wallet!');
      return;
    }
    try {
      await blacklistVendor(provider, vendorAddr); // Replace with actual contract call
      alert(`Vendor ${vendorAddr} blacklisted successfully!`);
    } catch (error) {
      consolechat.error('Error blacklisting vendor:', error);
      alert('Blacklist failed.');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div>
        <input type="text" placeholder="Vendor Address" id="vendorAddr" />
        <button onClick={() => handleBlacklist(document.getElementById('vendorAddr').value)}>
          Blacklist Vendor
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;