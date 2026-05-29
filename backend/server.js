require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, memory } = require('./config/db');

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

app.use(helmet());
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

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('esp32-connect', (data) => {
    const deviceName = data?.device || 'ESP32';
    memory.deviceStatus = memory.deviceStatus || new Map();
    memory.deviceStatus.set(deviceName, { status: 'online', lastSeen: new Date() });
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
    memory.alerts.unshift(alertData);
  });

  socket.on('esp32-disconnect', () => {
    memory.deviceStatus = memory.deviceStatus || new Map();
    memory.deviceStatus.forEach((value, key) => {
      if (value.status === 'online') {
        io.emit('device-status', { device: key, status: 'offline', lastSeen: new Date() });
      }
    });
    memory.deviceStatus.clear();
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  if (!memory.users.find(u => u.username === 'admin')) {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(12);
    memory.users.push({
      username: 'admin',
      password: bcrypt.hashSync('admin123', salt),
      createdAt: new Date(),
    });
    console.log('Default user seeded: admin / admin123');
  }
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready`);
  });
});
