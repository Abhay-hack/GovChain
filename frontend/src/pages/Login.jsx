// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log('Login response:', response); // Debug
      setIsAuthenticated(true);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data.error || 'Unknown error'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-md shadow-md hover:shadow-lg hover:opacity-90 transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Need an account? <Link to="/" className="text-green-300 hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;