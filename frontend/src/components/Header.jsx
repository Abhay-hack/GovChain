// frontend/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isAuthenticated, handleLogout }) {
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-2xl font-bold tracking-tight transition-all duration-300 hover:text-blue-200">
        <Link to={isAuthenticated ? "/home" : "/"}>GovChain</Link>
      </h2>
      {isAuthenticated && (
        <nav className="flex items-center space-x-6 md:space-x-10">
          <Link 
            to="/home" 
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/tenders" 
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Tenders
          </Link>
          <Link 
            to="/vendors" 
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Vendors
          </Link>
          <Link 
            to="/payments" 
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Payments
          </Link>
          <Link 
            to="/verify" 
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Verify
          </Link>
          <Link 
            to="/profile" 
            className="text-lg font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Profile
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}

export default Header;