/**
 * Centralized error handler middleware.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
