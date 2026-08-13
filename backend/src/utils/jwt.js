const jwt = require('jsonwebtoken');

/**
 * Generate an access token (short-lived).
 * @param {Object} payload - Claims payload
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

/**
 * Generate a refresh token (longer-lived).
 * @param {Object} payload
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = { generateAccessToken, generateRefreshToken };
