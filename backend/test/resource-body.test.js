const test = require('node:test');
const assert = require('node:assert/strict');
const { getResourceBody } = require('../middleware/resource-body');

test('accepts only the requested resource fields', () => {
  assert.deepEqual(getResourceBody({ title: 'Portfolio' }, ['title', 'summary']), {
    data: { title: 'Portfolio' },
  });
});

test('rejects identity and timestamp fields instead of silently accepting them', () => {
  assert.deepEqual(getResourceBody({ _id: 'forged-id' }, ['title']), {
    error: 'Unsupported field: _id',
  });
});

test('rejects empty and non-object request bodies', () => {
  assert.deepEqual(getResourceBody({}, ['title']), {
    error: 'Request body must contain at least one supported field',
  });
  assert.deepEqual(getResourceBody([], ['title']), {
    error: 'Request body must be an object',
  });
});
