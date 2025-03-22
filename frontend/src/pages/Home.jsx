import React, { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import { WalletContext } from '../contexts/WalletContext';

function Home() {
  const { alerts } = useContext(AlertContext);
  const { account, connectWallet } = useContext(WalletContext);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-500 text-white py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-shadow-md">
          Welcome to GovChain
        </h1>
        <p className="text-xl mt-4 italic">A decentralized platform for transparent government tenders.</p>
      </div>

      {alerts.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl font-semibold mb-4">Latest Alerts:</h3>
          <ul className="space-y-4">
            {alerts.map((alert, index) => (
              <li
                key={index}
                className="bg-red-600 text-white p-3 rounded-md shadow-lg hover:bg-red-500 transition duration-300"
              >
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
      {!account && (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-3 px-8 rounded-full shadow-xl transform transition-transform duration-200 hover:scale-105"
        >
          Connect Wallet
        </button>
      )}
      </div>
    </div>
  );
}

export default Home;
