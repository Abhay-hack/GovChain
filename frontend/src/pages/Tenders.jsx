// frontend/src/pages/Tenders.jsx
import React from 'react';
import TenderList from '../components/TenderList.jsx';

function Tenders() {
  return (
    <div className="tenders-page min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight transition-all duration-300 hover:text-blue-600">
        All Tenders
      </h1>
      <div className="w-full max-w-7xl">
        <TenderList />
      </div>
    </div>
  );
}

export default Tenders;