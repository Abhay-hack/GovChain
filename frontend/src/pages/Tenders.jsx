import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TenderList from '../components/TenderList.jsx';
import api from '../utils/api.js';
import { PlusCircle } from 'lucide-react';

function Tenders() {
  const [isEmployee, setIsEmployee] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserRole() {
      try {
        const response = await api.get('/auth/profile');
        setIsEmployee(response.data.role === 'employee'); // Check if user is an employee
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }
    checkUserRole();
  }, []);

  return (
    <div className="tenders-page min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight transition-all duration-300 hover:text-blue-600">
        All Tenders
      </h1>

      {isEmployee && (
        <button
          onClick={() => navigate('/create-tender')}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all mb-6"
        >
          <PlusCircle className="w-6 h-6" />
          Create Tender
        </button>
      )}

      <div className="w-full max-w-7xl">
        <TenderList />
      </div>
    </div>
  );
}

export default Tenders;
