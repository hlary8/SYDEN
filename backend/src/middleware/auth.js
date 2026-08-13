const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

/**
 * Express middleware to require a valid access token in `Authorization: Bearer` header.
 */
async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return next(createError(401, 'Unauthorized'));
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
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
