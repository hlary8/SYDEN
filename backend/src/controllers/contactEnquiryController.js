const createError = require('http-errors');
const ContactEnquiry = require('../models/ContactEnquiry');

async function create(req, res, next) {
  try {
    const payload = req.body || {};
    if (!payload.name || !payload.email) return next(createError(400, 'Name and email are required'));

    const doc = await ContactEnquiry.create({
      type: payload.type || 'land_enquiry',
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      contactMethod: payload.contactMethod || '',
      message: payload.message || '',
      landId: payload.landId || null,
      landName: payload.landName || '',
      animalName: payload.animalName || '',
      problemDescription: payload.problemDescription || '',
      serviceType: payload.serviceType || '',
      status: 'new',
      read: false
    });

    res.status(201).json({ data: doc });
  } catch (err) { next(err); }
}

async function list(req, res, next) {
  try {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    const list = await ContactEnquiry.find(query).sort({ createdAt: -1 });
    res.json({ data: list });
  } catch (err) { next(err); }
}

async function markRead(req, res, next) {
  try {
    const doc = await ContactEnquiry.findByIdAndUpdate(req.params.id, { read: true, status: 'read' }, { new: true });
    if (!doc) return next(createError(404, 'Enquiry not found'));
    res.json({ data: doc });
  } catch (err) { next(err); }
}

module.exports = { create, list, markRead };
