const authService = require('../services/authService');
const Vendor = require('../models/vendor');
const Employee = require('../models/employee');
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

    // Hash the password
    const hashedPassword = await authService.hashPassword(password);

    if (role === 'vendor') {
      const newVendor = new Vendor({
        email: email,
        vendorAddr: address,
        name: name,
        password: hashedPassword,
      });
      await newVendor.save();
      res.status(201).json({ message: 'Vendor signup successful', address: address });
    } else if (role === 'employee') {
      const newEmployee = new Employee({
        email: email,
        address: address,
        name: name,
        password: hashedPassword,
        employeeId: "EMP" + Math.floor(Math.random() * 1000), //generate random employee id.
      });
      await newEmployee.save();
      res.status(201).json({ message: 'Employee signup successful', address: address });
    } else {
      res.status(400).json({message: "Invalid role"});
    }
  } catch (error) {
    console.error('Signup error:', error);
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

    let user, role;
    user = await Vendor.findOne({email: email});
    role = "vendor";

    if(!user){
      user = await Employee.findOne({email: email});
      role = "employee";
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await authService.comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = await authService.generateToken({
      address: user.address,
      role: role,
    });

    res.cookie('authCookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({
      message: 'Login successful',
      role: role,
      address: user.address,
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

module.exports = {
  signup,
  login,
  logout,
};