/**
 * Redis configuration (optional).
 * Enable when REDIS_URL is set for caching/sessions.
 */
const REDIS_URL = process.env.REDIS_URL;

let client = null;

export async function getRedisClient() {
  if (!REDIS_URL) return null;
  if (client) return client;
  try {
    const { createClient } = await import('redis');
    client = createClient({ url: REDIS_URL });
    client.on('error', (err) => console.error('[Redis]', err.message));
    await client.connect();
    return client;
  } catch (err) {
    console.warn('[Redis] Not configured or connection failed:', err.message);
    return null;
  }
}

export function isRedisEnabled() {
  return Boolean(REDIS_URL);
}
