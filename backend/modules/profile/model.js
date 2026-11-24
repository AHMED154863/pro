const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  professionalTitle: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true,
    maxlength: 120,
  },
  professionalSummary: {
    type: String,
    trim: true,
    maxlength: 3000,
  },
  education: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  careerJourney: {
    type: String,
    trim: true,
    maxlength: 3000,
  },
  professionalGoals: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
  },
  linkedInUrl: { type: String, trim: true, maxlength: 500 },
  githubUsername: { type: String, trim: true, maxlength: 100 },
  profileImagePath: { type: String, trim: true, maxlength: 500 },
  cvPath: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
