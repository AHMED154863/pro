const mongoose = require('mongoose');

function sendControllerError(res, error, context) {
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError ||
    error.code === 11000
  ) {
    return res.status(400).json({
      success: false,
      message: 'Request data is invalid',
    });
  }

  console.error(`${context}:`, error);
  return res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred',
  });
}

module.exports = { sendControllerError };
