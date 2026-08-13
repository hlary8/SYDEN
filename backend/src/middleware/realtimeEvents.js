// backend/src/middleware/realtimeEvents.js

/**
 * Middleware to emit real-time socket events after CRUD operations
 * Usage: app.use(realtimeEvents(io));
 */
module.exports = (io) => {
  return (req, res, next) => {
    // Store io instance in request for use in controllers
    req.io = io;

    // Intercept res.json to emit events after response
    const originalJson = res.json;
    res.json = function(data) {
      // Emit events based on request method and path
      try {
        if (req.method === 'POST' && req.path.includes('/livestock')) {
          io.to('livestock').emit('livestock:created', data.data);
        } else if (req.method === 'PATCH' && req.path.includes('/livestock')) {
          io.to('livestock').emit('livestock:updated', data.data);
        } else if (req.method === 'DELETE' && req.path.includes('/livestock')) {
          io.to('livestock').emit('livestock:deleted', data);
        } else if (req.method === 'POST' && req.path.includes('/produce')) {
          io.to('produce').emit('produce:created', data.data);
        } else if (req.method === 'PATCH' && req.path.includes('/produce')) {
          io.to('produce').emit('produce:updated', data.data);
        } else if (req.method === 'DELETE' && req.path.includes('/produce')) {
          io.to('produce').emit('produce:deleted', data);
        } else if (req.method === 'POST' && req.path.includes('/news')) {
          io.to('news').emit('news:created', data);
        } else if (req.method === 'PATCH' && req.path.includes('/news')) {
          io.to('news').emit('news:updated', data);
        } else if (req.method === 'DELETE' && req.path.includes('/news')) {
          io.to('news').emit('news:deleted', data);
        } else if (req.method === 'POST' && req.path.includes('/lands')) {
          io.to('land').emit('land:created', data.data);
        } else if (req.method === 'PATCH' && req.path.includes('/lands')) {
          io.to('land').emit('land:updated', data.data);
        } else if (req.method === 'DELETE' && req.path.includes('/lands')) {
          io.to('land').emit('land:deleted', data);
        }
      } catch (err) {
        console.error('Error emitting real-time event:', err);
      }

      // Call original json
      return originalJson.call(this, data);
    };

    next();
  };
};
