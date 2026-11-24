const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true,
    maxlength: 150,
  },
  title: {
    type: String,
    required: [true, 'Experience title is required'],
    trim: true,
    maxlength: 150,
  },
  description: { type: String, trim: true, maxlength: 3000 },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
