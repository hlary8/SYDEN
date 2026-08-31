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
    // Exit so the developer notices the missing configuration during development
    process.exit(1);
  }

  const opts = {
    // connection pool size
    maxPoolSize: 10,
    // Give Atlas more time to select a server (useful on slow networks)
    serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 5000 : 30000,
    // How long to allow initial TCP connection
    connectTimeoutMS: 10000,
    // Keep sockets alive longer
    socketTimeoutMS: 45000,
    // Use IPv4 when DNS returns both v4/v6 (helps in some CI / container networks)
    family: 4
  };

  mongoose.connect(uri, opts).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    // Print full error so it's easier to debug (whitelist, network, credentials)
    console.error('MongoDB connection error', err && err.message ? err.message : err);
    console.error('Please verify `MONGO_URI`, network access (Atlas IP whitelist), and credentials.');
    // Fail fast in dev so the issue is obvious instead of causing cascading 500s
    process.exit(1);
  });
};
