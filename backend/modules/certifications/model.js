const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Certification name is required'],
    trim: true,
    maxlength: 200,
  },
  issuer: {
    type: String,
    required: [true, 'Certification issuer is required'],
    trim: true,
    maxlength: 200,
  },
  description: { type: String, trim: true, maxlength: 2000 },
  issuedAt: { type: Date },
  credentialUrl: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
