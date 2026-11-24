const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: 2,
    maxlength: 150,
  },
  slug: {
    type: String,
    required: [true, 'Project slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 180,
  },
  summary: {
    type: String,
    required: [true, 'Project summary is required'],
    trim: true,
    maxlength: 500,
  },
  overview: { type: String, trim: true, maxlength: 5000 },
  problem: { type: String, trim: true, maxlength: 3000 },
  solution: { type: String, trim: true, maxlength: 3000 },
  features: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  screenshots: { type: [String], default: [] },
  category: { type: String, trim: true, maxlength: 100 },
  featured: { type: Boolean, default: false },
  githubUrl: { type: String, trim: true, maxlength: 500 },
  liveDemoUrl: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
