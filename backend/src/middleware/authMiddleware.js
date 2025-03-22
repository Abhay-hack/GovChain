// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendor');
const Employee = require('../models/employee');

async function authMiddleware(req, res, next) {
  try {
    console.log('Request headers:', req.headers);
    console.log('Cookies:', req.cookies);
    const token = req.cookies.authCookie;

    if (!token) {
      console.log('No token provided for:', req.method, req.path);
      return res.status(401).json({ error: 'Authentication failed: No token provided' });
    }

    console.log('Token received:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    let user;
    if (decoded.role === 'vendor') {
      console.log('Searching vendor with vendorAddr:', decoded.address);
      user = await Vendor.findOne({ vendorAddr: decoded.address });
      console.log('Vendor found:', user); // Log result
    } else if (decoded.role === 'employee') {
      console.log('Searching employee with address:', decoded.address);
      user = await Employee.findOne({ address: decoded.address });
      console.log('Employee found:', user);
    } else {
      console.log('Invalid role:', decoded.role);
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    if (!user) {
      console.log('User not found for address:', decoded.address);
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    req.user = {
      address: decoded.address,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    return res.status(401).json({ error: 'Authentication failed: Invalid token' });
  }
}

module.exports = authMiddleware;