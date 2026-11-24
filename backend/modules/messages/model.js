const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: 2,
    maxlength: 150,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: 5,
    maxlength: 5000,
  },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
