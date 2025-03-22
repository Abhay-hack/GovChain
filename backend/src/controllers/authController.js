// backend/src/controllers/authController.js
const authService = require('../services/authService');
const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('vendor', 'employee').required(),
  address: Joi.string().required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function signup(req, res) {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, role, address, name } = value;

    await authService.validateEmail(email);
    await authService.validatePassword(password);

    const hashedPassword = await authService.hashPassword(password);

    let userData = { email, password: hashedPassword, name };
    if (role === 'vendor') {
      userData.vendorAddr = address;
    } else if (role === 'employee') {
      userData.address = address;
      userData.employeeId = "EMP" + Math.floor(Math.random() * 1000);
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await authService.createUser({ ...userData, role });
    res.status(201).json({ message: `${role} signup successful`, address: user.address || user.vendorAddr });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Address already registered' });
    }
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    const userResult = await authService.findUserByEmail(email);
    if (!userResult) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { user, role } = userResult;

    const passwordMatch = await authService.comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = await authService.generateToken({
      address: user.address || user.vendorAddr,
      role,
    });

    res.cookie('authCookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });

    res.status(200).json({
      message: 'Login successful',
      role,
      address: user.address || user.vendorAddr,
      token, // Add token to response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  res.clearCookie('authCookie');
  res.status(200).json({ message: 'Logged out' });
}

async function checkAuth(req, res) {
  try {
    const token = req.cookies.authCookie;
    console.log('Checking authCookie:', token ? 'Present' : 'Missing');
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }

    const decoded = await authService.verifyToken(token);
    console.log('Token decoded:', decoded);
    if (decoded) {
      return res.status(200).json({ isAuthenticated: true });
    }
    return res.status(401).json({ isAuthenticated: false });
  } catch (error) {
    console.error('Check auth error:', error.message);
    return res.status(401).json({ isAuthenticated: false });
  }
}

async function getProfile(req, res) {
  try {
    const token = req.cookies.authCookie;
    console.log('Fetching profile with authCookie:', token ? 'Present' : 'Missing');
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = await authService.verifyToken(token);
    console.log('Token decoded:', decoded);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userResult = await authService.findUserByAddress(decoded.address);
    if (!userResult) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { user, role } = userResult;
    res.status(200).json({
      name: user.name,
      email: user.email,
      role,
      address: user.address || user.vendorAddr,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  getProfile,
};