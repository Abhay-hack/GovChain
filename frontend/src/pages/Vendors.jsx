import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { User, Mail, MapPin, Loader } from 'lucide-react';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const response = await api.get('/vendors');
        console.log('Vendors fetched:', response.data);
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        alert('Failed to load vendors: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center tracking-tight">
          Registered Vendors
        </h2>
        {vendors.length === 0 ? (
          <p className="text-gray-600 text-center">No vendors registered yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.vendorAddr}
                className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <User className="text-blue-600 w-6 h-6" />
                  <p className="text-gray-700 font-medium">{vendor.name}</p>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <Mail className="text-gray-600 w-5 h-5" />
                  <p className="text-gray-700">{vendor.email}</p>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <MapPin className="text-red-600 w-5 h-5" />
                  <p className="text-gray-700 font-mono text-blue-600">
                    {vendor.vendorAddr.slice(0, 6)}...{vendor.vendorAddr.slice(-4)}
                  </p>
                </div>
              </div> 
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Vendors;
