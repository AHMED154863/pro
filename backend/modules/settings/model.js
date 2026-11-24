const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Setting key is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
  },
  value: {
    type: String,
    required: [true, 'Setting value is required'],
    trim: true,
    maxlength: 2000,
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
