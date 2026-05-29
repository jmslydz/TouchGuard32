const express = require('express');
const Alert = require('../models/Alert');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Alert.countDocuments();

    res.json({
      alerts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get alerts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const alert = await Alert.findOne().sort({ createdAt: -1 });
    res.json({ alert });
  } catch (error) {
    console.error('Get latest alert error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const total = await Alert.countDocuments();
    const touchDetected = await Alert.countDocuments({ status: 'Touch Detected' });
    const buttonPressed = await Alert.countDocuments({ status: 'Button Pressed' });
    const deviceOnline = await Alert.countDocuments({ status: 'Device Online' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAlerts = await Alert.countDocuments({ createdAt: { $gte: today } });

    res.json({
      total,
      touchDetected,
      buttonPressed,
      deviceOnline,
      todayAlerts,
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
