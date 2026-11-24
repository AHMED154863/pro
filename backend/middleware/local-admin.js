const localHostnames = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

function isLoopbackAddress(address) {
  return address === '::1' || address === '127.0.0.1' || address === '::ffff:127.0.0.1';
}

function isLocalOrigin(origin) {
  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.protocol === 'http:' && localHostnames.has(parsedOrigin.hostname);
  } catch {
    return false;
  }
}

function requireLocalAdmin(req, res, next) {
  if (process.env.LOCAL_ADMIN_ENABLED !== 'true' || process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  }

  const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
  if (
    !isLoopbackAddress(req.socket.remoteAddress) ||
    !localHostnames.has(req.hostname) ||
    !isLocalOrigin(allowedOrigin) ||
    req.get('origin') !== allowedOrigin
  ) {
    return res.status(403).json({
      success: false,
      message: 'Local admin access is available only from the configured local frontend',
    });
  }

  return next();
}

module.exports = { isLoopbackAddress, isLocalOrigin, requireLocalAdmin };
