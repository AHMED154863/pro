const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: {
      values: ['Frontend', 'Backend', 'Database', 'Programming Languages', 'Tools & Technologies'],
      message: 'Skill category is not supported',
    },
  },
  proficiency: { type: Number, min: 0, max: 100 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
