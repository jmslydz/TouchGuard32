const express = require('express');
const { memory } = require('../config/db');

const router = express.Router();

const VALID_STATUSES = ['Touch Detected', 'Button Pressed', 'Device Online', 'Device Offline', 'Motion Detected'];

router.post('/alert', async (req, res) => {
  try {
    const { device, status, message } = req.body;
    if (!device || !status) {
      return res.status(400).json({ message: 'Device and status required' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const alert = {
      device: device.trim(),
      status,
      message: message || '',
      createdAt: new Date(),
    };
    memory.alerts.unshift(alert);
    const io = req.app.get('io');
    if (io) {
      io.emit('alert', alert);
      io.emit('notification', {
        message: `${alert.device}: ${alert.status}`,
        timestamp: alert.createdAt,
      });
    }
    res.status(201).json({ message: 'Alert recorded', alert });
  } catch (error) {
    console.error('Device alert error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/heartbeat', async (req, res) => {
  try {
    const { device } = req.body;
    if (!device) return res.status(400).json({ message: 'Device name required' });
    const io = req.app.get('io');
    if (io) {
      io.emit('device-status', { device: device.trim(), status: 'online', lastSeen: new Date() });
    }
    res.json({ message: 'Heartbeat received', device: device.trim() });
  } catch (error) {
    console.error('Heartbeat error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
