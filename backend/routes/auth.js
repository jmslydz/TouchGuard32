const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { memory } = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = memory.users.find(u => u.username === username.trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET || 'fallback_dev_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ token, user: { username: user.username } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_dev_secret');
    const user = memory.users.find(u => u.username === decoded.username);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user: { username: user.username } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/seed', async (req, res) => {
  try {
    if (memory.users.find(u => u.username === 'admin')) {
      return res.json({ message: 'Default user already exists' });
    }
    const salt = bcrypt.genSaltSync(12);
    memory.users.push({
      username: 'admin',
      password: bcrypt.hashSync('admin123', salt),
      createdAt: new Date(),
    });
    res.json({ message: 'Default user created: admin / admin123' });
  } catch (error) {
    console.error('Seed error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
