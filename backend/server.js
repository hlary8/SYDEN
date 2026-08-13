const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { publicLimiter } = require('./src/middleware/rateLimiters');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

require('./src/config/db')();

const authRoutes = require('./src/routes/auth');
const landRoutes = require('./src/routes/lands');
const livestockRoutes = require('./src/routes/livestock');
const commentRoutes = require('./src/routes/comments');
const userRoutes = require('./src/routes/users');
const produceRoutes = require('./src/routes/produce');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload');
const newsRoutes = require('./src/routes/news');
const { errorHandler } = require('./src/middleware/errorHandler');
const realtimeEvents = require('./src/middleware/realtimeEvents');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
});

app.set('io', io);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use(publicLimiter);
app.use(realtimeEvents(io));

app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/lands', landRoutes);
app.use('/api/v1/livestock', livestockRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/produce', produceRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/news', newsRoutes);

app.get('/', (req, res) => res.json({ ok: true, name: 'DELEON ENTERPRiSES Ecosystem API' }));

// Health check for containers / orchestrators
app.get('/api/v1/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO with real-time updates enabled`);
});

io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);
  
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`  → ${socket.id} joined room: ${room}`);
  });
  
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`  → ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

