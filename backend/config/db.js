const mongoose = require('mongoose');

const memory = {
  alerts: [],
  users: [],
  online: false,
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI — using in-memory store (data resets on restart)');
    memory.online = true;
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
    memory.online = false;
  } catch (err) {
    console.error('MongoDB error:', err.message);
    console.log('Falling back to in-memory store');
    memory.online = true;
  }
};

module.exports = { connectDB, memory };
