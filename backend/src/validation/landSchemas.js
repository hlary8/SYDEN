const { z } = require('zod');

const locationSchema = z.object({
  address: z.string().optional(),
  coordinates: z.array(z.number()).length(2).optional(),
  mapboxId: z.string().optional()
});

const imageSchema = z.object({ url: z.string().url().optional(), publicId: z.string().optional(), caption: z.string().optional() });

const landCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  narrative: z.string().max(500).optional(),
  price: z.number().optional(),
  sizeAcres: z.number().optional(),
  location: locationSchema.optional(),
  features: z.array(z.string()).optional(),
  status: z.enum(['available','pending','sold']).optional()
});

const landUpdateSchema = landCreateSchema.partial();

module.exports = { landCreateSchema, landUpdateSchema };
