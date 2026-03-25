// Simple in-memory rate limiter — no external dependencies
const hits = new Map<string, number[]>()

// Clean old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of hits) {
    const valid = timestamps.filter((t) => now - t < 60_000)
    if (valid.length === 0) hits.delete(key)
    else hits.set(key, valid)
  }
}, 300_000)

/**
 * Check if a request should be rate limited.
 * @param key - unique identifier (e.g. IP + endpoint)
 * @param limit - max requests allowed in the window
 * @param windowMs - time window in milliseconds (default 60s)
 * @returns { limited: boolean, remaining: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000
): { limited: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs)

  if (timestamps.length >= limit) {
    hits.set(key, timestamps)
    return { limited: true, remaining: 0 }
  }

  timestamps.push(now)
  hits.set(key, timestamps)
  return { limited: false, remaining: limit - timestamps.length }
}
