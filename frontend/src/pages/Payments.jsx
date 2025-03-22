// frontend/src/pages/Payments.jsx
import React from 'react';
import PaymentStatus from '../components/PaymentStatus.jsx';

function Payments() {
  return (
    <div className="payments-page min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight transition-all duration-300 hover:text-blue-600">
        Payments
      </h1>
      <div className="w-full max-w-4xl">
        <PaymentStatus tenderId={1} /> {/* Replace with dynamic tenderId */}
      </div>
    </div>
  );
}

export default Payments;