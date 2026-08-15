const rateLimit = require('express-rate-limit');

// General rate limit for all routes: 1000 requests per 15 minutes
const publicLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  skip: (req) => req.path === '/api/v1/auth/login' || req.path === '/api/v1/auth/register'
});

// Strict auth limiter to prevent brute force: 50 attempts per 15 minutes per IP
const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 50,
  message: 'Too many login attempts. Please try again after 15 minutes.'
});

module.exports = { publicLimiter, authLimiter };
