const createError = require('http-errors');
const ContactEnquiry = require('../models/ContactEnquiry');
const Notification = require('../models/Notification');

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
      productName: payload.productName || '',
      enquiryType: payload.enquiryType || payload.serviceType || '',
      problemDescription: payload.problemDescription || '',
      serviceType: payload.serviceType || payload.enquiryType || '',
      status: 'new',
      read: false
    });

    const admins = await require('../models/User').find({ role: 'admin' }).lean();
    for (const admin of admins) {
      const isProduce = payload.type === 'produce_enquiry';
      const isVet = payload.type === 'vet_enquiry';
      const isLand = payload.type === 'land_enquiry';

      await Notification.create({
        recipient: admin._id,
        type: isProduce ? 'produce_enquiry' : (isVet ? 'vet_enquiry' : 'land_enquiry'),
        title: isProduce ? 'Produce enquiry received' : (isVet ? 'Vet enquiry received' : 'Land enquiry received'),
        message: `${payload.name} (${payload.email}) submitted a ${isProduce ? 'produce' : (isVet ? 'vet' : 'land')} enquiry${payload.productName ? ` for ${payload.productName}` : (payload.landName ? ` for ${payload.landName}` : '')}.`,
        link: isProduce ? '/deefresh/admin/inquiries' : (isVet ? '/syden/admin/inquiries' : '/deleon/admin/inquiries'),
        read: false,
        data: { enquiryId: doc._id, type: doc.type }
      });
    }

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
