const crypto = require('node:crypto');
const path = require('node:path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const cvMimeTypes = new Set(['application/pdf']);

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extensionByMimeType = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
    };
    callback(null, `${crypto.randomUUID()}${extensionByMimeType[file.mimetype]}`);
  },
});

function createUpload(fieldName, allowedMimeTypes, errorMessage) {
  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        return callback(new Error(errorMessage));
      }

      return callback(null, true);
    },
  }).single(fieldName);
}

module.exports = {
  uploadProfileImage: createUpload(
    'image',
    imageMimeTypes,
    'Only JPEG, PNG, and WebP images are allowed',
  ),
  uploadCv: createUpload('cv', cvMimeTypes, 'Only PDF files are allowed'),
};
