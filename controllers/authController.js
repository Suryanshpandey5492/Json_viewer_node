const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);
    res.json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    // User not found
    if (!user) {
      return res.status(401).json({ message: 'Username not found' });
    }

    // Incorrect password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token if login is successful
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
