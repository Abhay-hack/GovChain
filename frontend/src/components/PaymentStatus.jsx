// frontend/src/components/PaymentStatus.jsx
import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext.jsx';
import { getPaymentStatus } from '../utils/web3.js'; // Hypothetical Web3 function

function PaymentStatus({ tenderId }) {
  const { provider } = useContext(WalletContext);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (provider) {
        try {
          const paymentStatus = await getPaymentStatus(provider, tenderId); // Replace with actual logic
          setStatus(paymentStatus);
        } catch (error) {
          console.error('Error fetching payment status:', error);
          setStatus(null); // Reset status on error
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // No provider, stop loading
      }
    };
    fetchStatus();
  }, [provider, tenderId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-500 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Payment Status for Tender #{tenderId}
      </h3>
      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">Loading payment status...</p>
      ) : status ? (
        <div className="space-y-3">
          <p className="text-gray-700 text-center">
            <strong className="font-medium text-gray-900">Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                status.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status.completed ? 'Completed' : 'Pending'}
            </span>
          </p>
          {/* Add more fields from status if available */}
          {/* Example: <p><strong>Amount:</strong> {status.amount} ETH</p> */}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No payment status available for Tender #{tenderId}.
        </p>
      )}
    </div>
  );
}

export default PaymentStatus;