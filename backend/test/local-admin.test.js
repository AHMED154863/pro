const test = require('node:test');
const assert = require('node:assert/strict');
const { requireLocalAdmin } = require('../middleware/local-admin');
const { startServer } = require('../server');

function saveEnvironment(keys) {
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  return () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  };
}

function runMiddleware(overrides = {}) {
  const response = {
    statusCode: 200,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let nextCalled = false;
  const request = {
    socket: { remoteAddress: '127.0.0.1' },
    hostname: 'localhost',
    get: (name) => (name === 'origin' ? 'http://localhost:4200' : undefined),
    ...overrides,
  };

  requireLocalAdmin(request, response, () => {
    nextCalled = true;
  });

  return { response, nextCalled };
}

test('requires local admin mode to be explicitly enabled', () => {
  const restore = saveEnvironment(['LOCAL_ADMIN_ENABLED', 'NODE_ENV']);
  delete process.env.LOCAL_ADMIN_ENABLED;
  delete process.env.NODE_ENV;

  const { response, nextCalled } = runMiddleware();

  assert.equal(response.statusCode, 404);
  assert.equal(nextCalled, false);
  restore();
});

test('rejects admin requests outside the configured local frontend origin', () => {
  const restore = saveEnvironment(['LOCAL_ADMIN_ENABLED', 'FRONTEND_ORIGIN', 'NODE_ENV']);
  process.env.LOCAL_ADMIN_ENABLED = 'true';
  process.env.FRONTEND_ORIGIN = 'http://localhost:4200';
  delete process.env.NODE_ENV;

  const { response, nextCalled } = runMiddleware({
    socket: { remoteAddress: '192.0.2.10' },
  });

  assert.equal(response.statusCode, 403);
  assert.equal(nextCalled, false);
  restore();
});

test('allows requests from the configured localhost frontend', () => {
  const restore = saveEnvironment(['LOCAL_ADMIN_ENABLED', 'FRONTEND_ORIGIN', 'NODE_ENV']);
  process.env.LOCAL_ADMIN_ENABLED = 'true';
  process.env.FRONTEND_ORIGIN = 'http://localhost:4200';
  delete process.env.NODE_ENV;

  const { response, nextCalled } = runMiddleware();

  assert.equal(response.statusCode, 200);
  assert.equal(nextCalled, true);
  restore();
});

test('disables local admin in production mode', () => {
  const restore = saveEnvironment(['LOCAL_ADMIN_ENABLED', 'NODE_ENV']);
  process.env.LOCAL_ADMIN_ENABLED = 'true';
  process.env.NODE_ENV = 'production';

  const { response, nextCalled } = runMiddleware();

  assert.equal(response.statusCode, 404);
  assert.equal(nextCalled, false);
  restore();
});

test('refuses to start a production server with local admin enabled', async () => {
  const restore = saveEnvironment([
    'LOCAL_ADMIN_ENABLED',
    'NODE_ENV',
    'MONGODB_URI',
    'PORT',
    'FRONTEND_ORIGIN',
  ]);
  process.env.LOCAL_ADMIN_ENABLED = 'true';
  process.env.NODE_ENV = 'production';
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/unused';
  process.env.PORT = '3001';
  process.env.FRONTEND_ORIGIN = 'http://localhost:4200';

  await assert.rejects(startServer(), /Local admin must remain disabled in production/);
  restore();
});
