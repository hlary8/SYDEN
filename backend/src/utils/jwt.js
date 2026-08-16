const jwt = require('jsonwebtoken');

const getAccessSecret = () => (
  (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET !== 'replace_with_a_long_random_string')
    ? process.env.JWT_ACCESS_SECRET
    : (process.env.JWT_SECRET || 'dev-access-secret-change-me-in-production')
);

const getRefreshSecret = () => (
  (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET !== 'replace_with_a_different_long_random_string')
    ? process.env.JWT_REFRESH_SECRET
    : (process.env.JWT_SECRET || 'dev-refresh-secret-change-me-in-production')
);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// ADDED: production-safe 30-day token lifecycle for Render and local session continuity.
function generateAccessToken(payload) {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: '30d' });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: '30d' });
}

module.exports = { generateAccessToken, generateRefreshToken, THIRTY_DAYS_MS };
