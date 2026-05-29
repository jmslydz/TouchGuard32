const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  device: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
    default: 'ESP32',
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    trim: true,
    enum: ['Touch Detected', 'Button Pressed', 'Device Online', 'Device Offline', 'Motion Detected'],
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
