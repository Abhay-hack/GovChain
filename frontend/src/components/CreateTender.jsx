import React, { useState } from 'react';
import api from '../utils/api';

function CreateTender() {
  const [formData, setFormData] = useState({ name: '', description: '', budget: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Tender Name is required' });
      return;
    }
  
    if (formData.budget <= 0) {
      setMessage({ type: 'error', text: 'Budget must be greater than 0' });
      return;
    }
  
    const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000); // Convert date to Unix timestamp (seconds)
  
    if (deadlineTimestamp < Math.floor(Date.now() / 1000)) {
      setMessage({ type: 'error', text: 'Deadline must be a future date' });
      return;
    }
  
    try {
      setLoading(true);
      await api.post('/tender', { ...formData, deadline: deadlineTimestamp });
      setMessage({ type: 'success', text: 'Tender created successfully!' });
      setFormData({ name: '', description: '', budget: '', deadline: '' }); // Reset form
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create tender. Please try again.' });
      console.error('Error creating tender:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Tender</h2>

      {message.text && (
        <p className={`text-sm text-center p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tender Name */}
        <div>
          <label className="block text-gray-700 font-medium">Tender Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter tender name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter tender details..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-gray-700 font-medium">Budget (ETH)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            placeholder="Enter budget"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-gray-700 font-medium">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-3 font-semibold text-white rounded-md transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Tender'}
        </button>
      </form>
    </div>
  );
}

export default CreateTender;
