/**
 * Rate limiting middleware.
 * Limits requests per IP for auth and API routes.
 */
const rateLimitStore = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

function getClientKey(req) {
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

export function rateLimiter(options = {}) {
  const windowMs = options.windowMs ?? WINDOW_MS;
  const max = options.max ?? MAX_REQUESTS;

  return (req, res, next) => {
    const key = getClientKey(req);
    const now = Date.now();
    let record = rateLimitStore.get(key);

    if (!record) {
      record = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(key, record);
    }
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }
    record.count += 1;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: { message: 'Too many requests. Try again later.' },
      });
    }
    next();
  };
}

export const authRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });
