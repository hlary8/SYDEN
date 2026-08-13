const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Connect to MongoDB using MONGO_URI env var.
 */
module.exports = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment');
    return;
  }

  mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error', err.message);
  });
};
