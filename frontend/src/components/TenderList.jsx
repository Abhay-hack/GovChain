// frontend/src/components/TenderList.js
import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { fetchTenderDetails } from '../utils/web3';
import TenderCard from './TenderCard';

function TenderList() {
  const { provider } = useContext(WalletContext);
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    const loadTenders = async () => {
      if (provider) {
        try {
          const tenderPromises = [1, 2, 3, 4, 5].map((id) => fetchTenderDetails(provider, id));
          const tenderData = await Promise.all(tenderPromises);
          setTenders(tenderData.filter((t) => t.isOpen));
        } catch (error) {
          console.error('Error loading tenders:', error);
        }
      }
    };
    loadTenders();
  }, [provider]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
        Open Tenders
      </h2>
      {tenders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-12 animate-pulse">
          No open tenders available.
        </p>
      )}
    </div>
  );
}

export default TenderList;