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
  role: z.enum(['user', 'farmer']).optional()
});

const getCookieSettings = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: THIRTY_DAYS_MS
});

// ADDED: production cookie compatibility for Render deployment and 30-day session persistence.
function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('token', accessToken, getCookieSettings());
  res.cookie('refreshToken', refreshToken, getCookieSettings());
}

/**
 * Register new user
 */
async function register(req, res, next) {
  try {
    const parsedSafe = registerSchema.safeParse(req.body);
    if (!parsedSafe.success) {
      const messages = parsedSafe.error.errors.map(e => e.message).join(', ');
      return next(createError(400, `Invalid input: ${messages}`));
    }
    const parsed = parsedSafe.data;
    const existing = await User.findOne({ $or: [{ email: parsed.email }, { username: parsed.username }] });
    if (existing) {
      const conflictField = existing.email === parsed.email ? 'email' : 'username';
      return next(createError(409, `${conflictField} already exists`));
    }
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(parsed.password, saltRounds);
    const role = parsed.role && ['user', 'farmer'].includes(parsed.role) ? parsed.role : 'user';
    const user = await User.create({ username: parsed.username, email: parsed.email, passwordHash, role });
    const payload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar 
      }, 
      accessToken 
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

/**
 * Login and set refresh cookie
 */
async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return next(createError(401, 'Invalid credentials'));
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next(createError(401, 'Invalid credentials'));
    const payload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar 
      }, 
      accessToken 
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Rotate refresh token
 */
async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken || req.cookies.token;
    if (!token) return next(createError(401, 'No refresh token'));
    const payload = jsonwebtoken.verify(token, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me-in-production');
    const user = await User.findById(payload.userId);
    if (!user) return next(createError(401, 'User not found'));
    const newAccess = generateAccessToken({ userId: payload.userId, role: payload.role });
    const newRefresh = generateRefreshToken({ userId: payload.userId, role: payload.role });
    setAuthCookies(res, newAccess, newRefresh);
    res.json({ accessToken: newAccess });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout - clear cookie
 */
async function logout(req, res) {
  res.clearCookie('token', getCookieSettings());
  res.clearCookie('refreshToken', getCookieSettings());
  res.json({ ok: true });
}

/**
 * Return current user (protected by access token expected in header)
 */
async function getMe(req, res, next) {
  try {
    const auth = req.headers.authorization;
    const tokenFromCookie = req.cookies && (req.cookies.token || req.cookies.refreshToken);
    const token = auth ? auth.split(' ')[1] : tokenFromCookie;
    if (!token) return res.status(200).json({ user: null });
    const payload = jsonwebtoken.verify(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me-in-production');
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) return res.status(200).json({ user: null });
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    next(err);
  }
}

/**
 * Update profile (avatar upload handled in controller route via multer)
 */
async function updateProfile(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return next(createError(401, 'Unauthorized'));
    const token = auth.split(' ')[1];
    const payload = jsonwebtoken.verify(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me-in-production');
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.file) updates.avatar = req.file.path || req.file.url;
    const user = await User.findByIdAndUpdate(payload.userId, updates, { new: true }).select('-passwordHash');
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, getMe, updateProfile };
