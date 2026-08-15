/**
 * Zod validation middleware factory.
 * Usage: router.post('/', validate(schema), handler)
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      res.status(400).json({ error: err.errors || err.message });
    }
  };
}

module.exports = { validate };
