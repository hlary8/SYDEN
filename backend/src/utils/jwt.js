const jwt = require('jsonwebtoken');

const ACCESS_SECRET = (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET !== 'replace_with_a_long_random_string')
  ? process.env.JWT_ACCESS_SECRET
  : 'dev-access-secret-change-me-in-production';

const REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET !== 'replace_with_a_different_long_random_string')
  ? process.env.JWT_REFRESH_SECRET
  : 'dev-refresh-secret-change-me-in-production';

/**
 * Generate an access token (short-lived).
 * @param {Object} payload - Claims payload
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

/**
 * Generate a refresh token (longer-lived).
 * @param {Object} payload
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = { generateAccessToken, generateRefreshToken };
