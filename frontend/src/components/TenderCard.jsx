import React from 'react';

function TenderCard({ tender }) {
  if (!tender) {
    return <p className="text-red-500">Tender data is unavailable.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Tender #{tender?.id ?? 'N/A'}</h3>
      <div className="space-y-2">
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Employer:</strong> {tender?.employer ?? 'Unknown'}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Budget:</strong> {tender?.budget ?? '0'} ETH
        </p>
        <p className="text-gray-700">
          <strong className="font-medium text-gray-900">Deadline:</strong>{' '}
          {tender?.deadline
            ? new Date(tender.deadline * 1000).toLocaleDateString()
            : 'Not specified'}
        </p>
        {tender?.descriptionHash ? (
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
        ) : (
          <p className="text-gray-700 italic">No description available.</p>
        )}
      </div>
    </div>
  );
}

export default TenderCard;
