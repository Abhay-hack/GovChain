// frontend/src/pages/Vendors.jsx
import React from 'react';
import VendorForm from '../components/VendorForm.jsx';
import VendorProfile from '../components/VendorProfile.jsx';

function Vendors() {
  return (
    <div className="vendors-page min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight transition-all duration-300 hover:text-blue-600">
        Vendors
      </h1>
      <div className="w-full max-w-4xl space-y-12">
        <VendorForm />
        <VendorProfile vendorAddr="0xExampleVendorAddress" /> 
      </div>
    </div>
  );
}

export default Vendors;