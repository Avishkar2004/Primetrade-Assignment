/**
 * Redis caching middleware (optional).
 * Use when REDIS_URL is set. Caches GET responses by key.
 */
import { getRedisClient } from '../config/redis.js';

const DEFAULT_TTL = 60; // seconds

export function redisCache(options = {}) {
  const ttl = options.ttl ?? DEFAULT_TTL;
  const keyFn = options.key || ((req) => req.originalUrl || req.url);

  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    const redis = await getRedisClient();
    if (!redis) return next();

    const key = `cache:${keyFn(req)}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      // continue without cache
    }

    const originalJson = res.json.bind(res);
    res.json = function (body) {
      redis.setEx(key, ttl, JSON.stringify(body)).catch(() => {});
      return originalJson(body);
    };
    next();
  };
}
