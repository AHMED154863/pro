const fs = require('node:fs');
const path = require('node:path');
const { connectDatabase } = require('./config/database');
const { isLocalOrigin } = require('./middleware/local-admin');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI must be set in backend/.env');
  }

  const port = Number(process.env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  const localAdminEnabled = process.env.LOCAL_ADMIN_ENABLED === 'true';
  if (localAdminEnabled && process.env.NODE_ENV === 'production') {
    throw new Error('Local admin must remain disabled in production');
  }
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
  if (localAdminEnabled && !isLocalOrigin(frontendOrigin)) {
    throw new Error('FRONTEND_ORIGIN must be a localhost origin when local admin is enabled');
  }

  await connectDatabase(mongoUri);

  const app = require('./app');
  const onListening = () => {
    console.log(`Portfolio API listening on port ${port}`);
  };
  return localAdminEnabled
    ? app.listen(port, '127.0.0.1', onListening)
    : app.listen(port, onListening);
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Backend startup failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { startServer };
