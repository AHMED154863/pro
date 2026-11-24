const test = require('node:test');
const assert = require('node:assert/strict');
const { getMessageValidationError } = require('../modules/messages/validation');

const validMessage = {
  name: 'Portfolio visitor',
  email: 'visitor@example.com',
  subject: 'Project inquiry',
  message: 'I would like to discuss a project.',
};

test('accepts a complete message with a valid email address', () => {
  assert.equal(getMessageValidationError(validMessage), null);
});

test('rejects a missing required field', () => {
  const { subject, ...message } = validMessage;

  assert.equal(getMessageValidationError(message), 'subject is required');
});

test('rejects an invalid email address', () => {
  assert.equal(
    getMessageValidationError({ ...validMessage, email: 'not-an-email' }),
    'Email must be valid',
  );
});

test('rejects a non-object request body', () => {
  assert.equal(getMessageValidationError(null), 'Request body must be an object');
});
