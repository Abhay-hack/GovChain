// frontend/src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensures cookies are sent
});

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createVendor = async (vendorData) => {
  const response = await api.post('/vendors/register', vendorData);
  return response.data;
};

export const updateVendor = async (vendorData) => {
  try {
    console.log('Sending update request with cookies');
    console.log('Request URL:', `${API_BASE_URL}/vendors/${vendorData.vendorAddr}`);
    const response = await api.put(`/vendors/${vendorData.vendorAddr}`, vendorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorRating = async (tenderId, vendorAddr) => {
  const response = await api.get(`/ratings/${tenderId}/${vendorAddr}`);
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get('/auth/check');
  return response.data;
};

export const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies if backend uses authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return await response.json();  // ✅ Ensure it parses JSON
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;  // Return null to avoid breaking UI
  }
};


export const getTendersByEmployee = async (employeeAddress) => {
  const response = await fetch(`/api/tenders?createdBy=${employeeAddress}`);
  return response.json();
};

export default api;