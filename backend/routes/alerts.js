const express = require('express');
const { memory } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const sorted = [...memory.alerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = sorted.length;
    const start = (page - 1) * limit;
    const alerts = sorted.slice(start, start + limit);
    res.json({ alerts, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    console.error('Get alerts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const sorted = [...memory.alerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ alert: sorted[0] || null });
  } catch (error) {
    console.error('Get latest alert error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const total = memory.alerts.length;
    const touchDetected = memory.alerts.filter(a => a.status === 'Touch Detected').length;
    const buttonPressed = memory.alerts.filter(a => a.status === 'Button Pressed').length;
    const deviceOnline = memory.alerts.filter(a => a.status === 'Device Online').length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAlerts = memory.alerts.filter(a => new Date(a.createdAt) >= today).length;
    res.json({ total, touchDetected, buttonPressed, deviceOnline, todayAlerts });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
