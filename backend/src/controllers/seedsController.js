const createError = require('http-errors');
const Seeds = require('../models/Seeds');

/**
 * GET /api/v1/seeds - Get all seeds with pagination
 */
async function getAllSeeds(req, res, next) {
  try {
    const { page = 1, limit = 20, seedType, available } = req.query;
    const query = {};
    
    if (seedType) query.seedType = seedType;
    if (available !== undefined) query.available = available === 'true';
    
    const seeds = await Seeds.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    
    const total = await Seeds.countDocuments(query);
    
    res.json({
      success: true,
      data: seeds,
      pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/seeds/:id - Get single seed by ID
 */
async function getSeedById(req, res, next) {
  try {
    const { id } = req.params;
    const seed = await Seeds.findById(id).populate('createdBy', 'username email');
    if (!seed) return next(createError(404, 'Seed not found'));
    res.json({ success: true, data: seed });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/seeds - Create new seed (Admin only)
 */
async function createSeed(req, res, next) {
  try {
    const {
      name, seedType, variety, description,
      totalBags, countryOfOrigin, isCertified, certificationBody,
      plantingInstructions, germinationDays, daysToMaturity, spacing,
      soilType, waterRequirements, sunlightRequirements,
      expectedYield, seedsPerBag, packetSize,
      coverImage, gallery
    } = req.body;

    if (!name || !seedType) {
      return next(createError(400, 'name and seedType are required'));
    }

    const seed = new Seeds({
      name,
      seedType,
      variety,
      description,
      totalBags: totalBags || 0,
      bagsIssued: 0,
      countryOfOrigin,
      isCertified: isCertified || false,
      certificationBody,
      coverImage,
      gallery: gallery || [],
      plantingInstructions,
      germinationDays,
      daysToMaturity,
      spacing,
      soilType,
      waterRequirements,
      sunlightRequirements,
      expectedYield,
      seedsPerBag,
      packetSize,
      createdBy: req.user._id
    });

    await seed.save();
    await seed.populate('createdBy', 'username email');

    res.status(201).json({ success: true, data: seed });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/seeds/:id - Update seed (Admin only)
 */
async function updateSeed(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Whitelist allowed fields
    const allowed = [
      'name', 'variety', 'description',
      'totalBags', 'bagsIssued',
      'countryOfOrigin', 'isCertified', 'certificationBody',
      'coverImage', 'gallery',
      'plantingInstructions', 'germinationDays', 'daysToMaturity', 'spacing',
      'soilType', 'waterRequirements', 'sunlightRequirements',
      'expectedYield', 'seedsPerBag', 'packetSize'
    ];

    const sanitized = {};
    Object.keys(updates).forEach(key => {
      if (allowed.includes(key)) {
        sanitized[key] = updates[key];
      }
    });

    const seed = await Seeds.findByIdAndUpdate(id, sanitized, { new: true })
      .populate('createdBy', 'username email');

    if (!seed) return next(createError(404, 'Seed not found'));

    res.json({ success: true, data: seed });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/seeds/:id - Delete seed (Admin only)
 */
async function deleteSeed(req, res, next) {
  try {
    const { id } = req.params;
    const seed = await Seeds.findByIdAndDelete(id);
    if (!seed) return next(createError(404, 'Seed not found'));
    res.json({ success: true, message: 'Seed deleted' });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/seeds/:id/issue - Issue bags to farmers
 * Decrements bagsIssued and updates bagsRemaining
 */
async function issueBags(req, res, next) {
  try {
    const { id } = req.params;
    const { quantity, farmerId } = req.body;

    if (!quantity || quantity < 1) {
      return next(createError(400, 'quantity must be at least 1'));
    }

    const seed = await Seeds.findById(id);
    if (!seed) return next(createError(404, 'Seed not found'));

    if (seed.bagsRemaining < quantity) {
      return next(createError(400, `Only ${seed.bagsRemaining} bags remaining`));
    }

    seed.bagsIssued += quantity;
    await seed.save();

    // TODO: Log transaction or create IssuanceRecord if needed

    res.json({ success: true, data: seed });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllSeeds,
  getSeedById,
  createSeed,
  updateSeed,
  deleteSeed,
  issueBags
};
