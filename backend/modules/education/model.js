const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true,
    maxlength: 200,
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true,
    maxlength: 150,
  },
  fieldOfStudy: { type: String, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000 },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
