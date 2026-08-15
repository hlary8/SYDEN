const { z } = require('zod');

const commentCreateSchema = z.object({
  targetType: z.enum(['livestock','produce','land']),
  targetId: z.string().min(1),
  content: z.string().min(1).max(2000),
  parentId: z.string().optional()
});

module.exports = { commentCreateSchema };
