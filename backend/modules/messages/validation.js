const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requiredFields = ['name', 'email', 'subject', 'message'];

function getMessageValidationError(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be an object';
  }

  for (const field of requiredFields) {
    if (typeof body[field] !== 'string' || body[field].trim().length === 0) {
      return `${field} is required`;
    }
  }

  if (!emailPattern.test(body.email.trim())) {
    return 'Email must be valid';
  }

  return null;
}

function validateMessage(req, res, next) {
  const validationError = getMessageValidationError(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  return next();
}

module.exports = { getMessageValidationError, validateMessage };
