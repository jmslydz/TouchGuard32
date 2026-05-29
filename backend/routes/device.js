const express = require('express');
const Alert = require('../models/Alert');

const router = express.Router();

const validateAlertPayload = (body) => {
  const { device, status, message } = body;
  if (!device || typeof device !== 'string') return false;
  if (!status || typeof status !== 'string') return false;
  const validStatuses = ['Touch Detected', 'Button Pressed', 'Device Online', 'Device Offline', 'Motion Detected'];
  if (!validStatuses.includes(status)) return false;
  return true;
};

router.post('/alert', async (req, res) => {
  try {
    if (!validateAlertPayload(req.body)) {
      return res.status(400).json({ message: 'Invalid alert payload' });
    }

    const alert = await Alert.create({
      device: req.body.device.trim(),
      status: req.body.status,
      message: req.body.message || '',
    });

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
    if (!device) {
      return res.status(400).json({ message: 'Device name required' });
    }

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
