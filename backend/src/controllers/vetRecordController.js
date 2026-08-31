const createError = require('http-errors');
const VetRecord = require('../models/VetRecord');
const Livestock = require('../models/Livestock');

// Create vet record. Accepts images as array of { url, publicId } or strings.
async function createRecord(req, res, next) {
  try {
    const payload = req.body || {};
    const animalId = payload.animal || req.params.animalId;
    if (!animalId) return next(createError(400, 'Animal id required'));

    const animal = await Livestock.findById(animalId);
    if (!animal) return next(createError(404, 'Animal not found'));

    const images = Array.isArray(payload.images)
      ? payload.images.slice(0, 3).map(i => (typeof i === 'string' ? { url: i, publicId: '' } : i))
      : [];

    const rec = await VetRecord.create({
      animal: animal._id,
      serviceType: payload.serviceType || 'Check-up',
      dateAdministered: payload.dateAdministered ? new Date(payload.dateAdministered) : new Date(),
      nextDueDate: payload.nextDueDate ? new Date(payload.nextDueDate) : null,
      medicineName: payload.medicineName || '',
      dosage: payload.dosage || '',
      vetName: payload.vetName || (req.user && req.user.username) || 'Syden Vet',
      notes: payload.notes || '',
      images,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json({ data: rec });
  } catch (err) { next(err); }
}

// List records, optionally filter by animal
async function listRecords(req, res, next) {
  try {
    const { animal, page = 1, limit = 100 } = req.query;
    const query = {};
    if (animal) query.animal = animal;
    const recs = await VetRecord.find(query).sort({ dateAdministered: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    res.json({ data: recs });
  } catch (err) { next(err); }
}

async function getRecord(req, res, next) {
  try {
    const rec = await VetRecord.findById(req.params.id);
    if (!rec) return next(createError(404, 'Record not found'));
    res.json({ data: rec });
  } catch (err) { next(err); }
}

async function updateRecord(req, res, next) {
  try {
    const updates = req.body || {};
    updates.updatedAt = new Date();
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.slice(0, 3).map(i => (typeof i === 'string' ? { url: i, publicId: '' } : i));
    }
    const rec = await VetRecord.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!rec) return next(createError(404, 'Record not found'));
    res.json({ data: rec });
  } catch (err) { next(err); }
}

async function deleteRecord(req, res, next) {
  try {
    const rec = await VetRecord.findByIdAndDelete(req.params.id);
    if (!rec) return next(createError(404, 'Record not found'));
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { createRecord, listRecords, getRecord, updateRecord, deleteRecord };
