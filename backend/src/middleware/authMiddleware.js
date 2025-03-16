// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendor');
const Employee = require('../models/employee');

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.authCookie;

    if (!token) {
      return res.status(401).json({ error: 'Authentication failed: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (decoded.role === 'vendor') {
      user = await Vendor.findOne({ vendorAddr: decoded.address });
    } else if (decoded.role === 'employee') {
      user = await Employee.findOne({ address: decoded.address });
    } else {
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    req.user = {
      address: decoded.address,
      role: decoded.role,
    }; // Attach address and role
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed: Invalid token' });
  }
}

module.exports = authMiddleware;