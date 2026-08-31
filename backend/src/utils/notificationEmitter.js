function emitNotification(app, recipientId, notification) {
  try {
    if (!app || !app.get) return;
    const io = app.get('io');
    if (!io) return;
    const room = `user:${recipientId}`;
    io.to(room).emit('notification:new', notification);
  } catch (err) {
    console.warn('notification emit failed', err && err.message ? err.message : err);
  }
}

module.exports = { emitNotification };
