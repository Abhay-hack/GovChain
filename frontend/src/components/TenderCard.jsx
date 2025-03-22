// frontend/src/components/TenderCard.js
import React from 'react';

function TenderCard({ tender }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Tender #{tender.id}</h3>
      <div className="space-y-2">
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Employer:</strong> {tender.employer}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Budget:</strong> {tender.budget} ETH
        </p>
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Deadline:</strong>{' '}
          {new Date(tender.deadline * 1000).toLocaleDateString()}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Description:</strong>{' '}
          <a
            href={`https://ipfs.io/ipfs/${tender.descriptionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
          >
            View on IPFS
          </a>
        </p>
      </div>
    </div>
  );
}

export default TenderCard;