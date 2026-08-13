const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload an image buffer or file path to Cloudinary.
 * @param {string} pathOrBuffer
 * @param {Object} options
 */
async function uploadImage(pathOrBuffer, options = {}) {
  const public_id = options.public_id || `DELEON ENTERPRiSES/${uuidv4()}`;
  const res = await cloudinary.uploader.upload(pathOrBuffer, {
    use_filename: true,
    public_id,
    resource_type: 'image',
    folder: 'DELEON ENTERPRiSES'
  });
  return { url: res.secure_url, publicId: res.public_id }; 
}

/**
 * Delete by public id
 */
async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}

module.exports = { uploadImage, deleteImage };
