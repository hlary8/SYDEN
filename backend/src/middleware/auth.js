const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

/**
 * Express middleware to require a valid access token from cookies or Authorization header.
 */
async function requireAuth(req, res, next) {
  try {
    let token;
    
    // Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) return next(createError(401, 'Unauthorized'));
    
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret-change-me-in-production';
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.userId);
    if (!user) return next(createError(401, 'Unauthorized'));
    req.user = user;
    next();
  } catch (err) {
    next(createError(401, 'Invalid token'));
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return next(createError(401, 'Unauthorized'));
    if (req.user.role !== role && req.user.role !== 'admin') return next(createError(403, 'Forbidden'));
    next();
  };
}

function requireAdmin(req, res, next) {
  if (!req.user) return next(createError(401, 'Unauthorized'));
  if (req.user.role !== 'admin') return next(createError(403, 'Access denied. Admins only.'));
  next();
}

module.exports = { requireAuth, requireRole, requireAdmin };
