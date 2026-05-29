require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const deviceRoutes = require('./routes/device');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set('io', io);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/device', deviceRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const deviceStatus = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('esp32-connect', (data) => {
    const deviceName = data?.device || 'ESP32';
    deviceStatus.set(deviceName, { status: 'online', lastSeen: new Date() });
    io.emit('device-status', { device: deviceName, status: 'online', lastSeen: new Date() });
    console.log(`ESP32 connected: ${deviceName}`);
  });

  socket.on('esp32-alert', (data) => {
    const alertData = {
      device: data?.device || 'ESP32',
      status: data?.status || 'Touch Detected',
      message: data?.message || '',
      createdAt: new Date(),
    };

    io.emit('alert', alertData);
    io.emit('notification', {
      message: `${alertData.device}: ${alertData.status}`,
      timestamp: alertData.createdAt,
    });

    const Alert = require('./models/Alert');
    Alert.create(alertData).catch((err) => console.error('DB save error:', err.message));
  });

  socket.on('esp32-disconnect', () => {
    deviceStatus.forEach((value, key) => {
      if (value.status === 'online') {
        io.emit('device-status', { device: key, status: 'offline', lastSeen: new Date() });
      }
    });
    deviceStatus.clear();
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

const seedDefaultUser = async () => {
  try {
    const User = require('./models/User');
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      await User.create({ username: 'admin', password: 'admin123' });
      console.log('Default user seeded: admin / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

connectDB().then(async () => {
  await seedDefaultUser();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready`);
  });
});
