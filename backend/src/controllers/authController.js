const bcrypt = require('bcrypt');
const createError = require('http-errors');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const { z } = require('zod');
const { generateAccessToken, generateRefreshToken, THIRTY_DAYS_MS } = require('../utils/jwt');

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'farmer', 'admin']).optional()
});

const getCookieSettings = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: THIRTY_DAYS_MS
});

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('token', accessToken, getCookieSettings());
  res.cookie('refreshToken', refreshToken, getCookieSettings());
}

function serializeUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  };
}

function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret-change-me-in-production';
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-refresh-secret-change-me-in-production';
}

async function register(req, res, next) {
  try {
    const parsedSafe = registerSchema.safeParse(req.body);
    if (!parsedSafe.success) {
      const messages = parsedSafe.error.errors.map(e => e.message).join(', ');
      return next(createError(400, `Invalid input: ${messages}`));
    }

    const parsed = parsedSafe.data;
    const email = parsed.email.toLowerCase();
    const existing = await User.findOne({ $or: [{ email }, { username: parsed.username }] });
    if (existing) {
      const conflictField = existing.email === email ? 'email' : 'username';
      return next(createError(409, `${conflictField} already exists`));
    }

    const role = parsed.role && ['user', 'farmer', 'admin'].includes(parsed.role) ? parsed.role : 'user';
    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const user = await User.create({ username: parsed.username, email, passwordHash, role });

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      token: accessToken,
      accessToken,
      user: serializeUser(user)
    });
  } catch (err) {
    if (err && err.code === 11000) {
      const fields = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
      return next(createError(409, `${fields} already exists`));
    }
    next(err);
  }
}

const loginSchema = z.object({ email: z.string().email(), password: z.string() });

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) return next(createError(401, 'Invalid credentials'));

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next(createError(401, 'Invalid credentials'));

    const payload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.json({
      success: true,
      token: accessToken,
      accessToken,
      user: serializeUser(user)
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken || req.cookies.token;
    if (!token) return next(createError(401, 'No refresh token'));

    const payload = jsonwebtoken.verify(token, getRefreshSecret());
    const user = await User.findById(payload.userId);
    if (!user) return next(createError(401, 'User not found'));

    const newAccess = generateAccessToken({ userId: payload.userId, role: payload.role });
    const newRefresh = generateRefreshToken({ userId: payload.userId, role: payload.role });
    setAuthCookies(res, newAccess, newRefresh);

    return res.json({ success: true, accessToken: newAccess, token: newAccess });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie('token', getCookieSettings());
  res.clearCookie('refreshToken', getCookieSettings());
  return res.json({ ok: true });
}

async function getMe(req, res, next) {
  try {
    if (req.user) {
      return res.status(200).json({ success: true, user: serializeUser(req.user) });
    }

    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jsonwebtoken.verify(token, getAccessSecret());
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: serializeUser(user) });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    console.error('getMe ERROR:', err);
    return res.status(500).json({ success: false, message: err.message || 'Unable to load account' });
  }
}

async function updateProfile(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return next(createError(401, 'Unauthorized'));
    const token = auth.split(' ')[1];
    const payload = jsonwebtoken.verify(token, getAccessSecret());
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.file) updates.avatar = req.file.path || req.file.url;
    const user = await User.findByIdAndUpdate(payload.userId, updates, { new: true }).select('-passwordHash');
    return res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    next(err);
  }
}

module.exports = { register, login, refresh, logout, getMe, updateProfile };
