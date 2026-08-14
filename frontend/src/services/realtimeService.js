// frontend/src/services/realtimeService.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;
  
  // If VITE_API_URL includes a path like '/api/v1', strip it for socket connection
  const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const socketUrl = rawApi.replace(/\/api\/v1\/?$/, '');
  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✓ Connected to real-time server');
  });

  socket.on('disconnect', () => {
    console.log('✗ Disconnected from real-time server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) return initializeSocket();
  return socket;
};

export const joinRoom = (room) => {
  if (socket) socket.emit('joinRoom', room);
};

export const leaveRoom = (room) => {
  if (socket) socket.emit('leaveRoom', room);
};

export const subscribeToLivestockUpdates = (callback) => {
  const s = getSocket();
  s.on('livestock:created', callback);
  s.on('livestock:updated', callback);
  s.on('livestock:deleted', callback);
  joinRoom('livestock');
};

export const subscribeToProduceUpdates = (callback) => {
  const s = getSocket();
  s.on('produce:created', callback);
  s.on('produce:updated', callback);
  s.on('produce:deleted', callback);
  joinRoom('produce');
};

export const subscribeToNewsUpdates = (callback) => {
  const s = getSocket();
  s.on('news:created', callback);
  s.on('news:updated', callback);
  s.on('news:deleted', callback);
  joinRoom('news');
};

export const subscribeToLandUpdates = (callback) => {
  const s = getSocket();
  s.on('land:created', callback);
  s.on('land:updated', callback);
  s.on('land:deleted', callback);
  joinRoom('land');
};

export const unsubscribeFromLivestockUpdates = (callback) => {
  const s = getSocket();
  s.off('livestock:created', callback);
  s.off('livestock:updated', callback);
  s.off('livestock:deleted', callback);
  leaveRoom('livestock');
};

export const unsubscribeFromProduceUpdates = (callback) => {
  const s = getSocket();
  s.off('produce:created', callback);
  s.off('produce:updated', callback);
  s.off('produce:deleted', callback);
  leaveRoom('produce');
};

export const unsubscribeFromNewsUpdates = (callback) => {
  const s = getSocket();
  s.off('news:created', callback);
  s.off('news:updated', callback);
  s.off('news:deleted', callback);
  leaveRoom('news');
};

export const unsubscribeFromLandUpdates = (callback) => {
  const s = getSocket();
  s.off('land:created', callback);
  s.off('land:updated', callback);
  s.off('land:deleted', callback);
  leaveRoom('land');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
