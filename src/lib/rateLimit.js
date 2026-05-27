const rateLimitMap = new Map();

// Run periodic cleanup every 5 minutes to avoid memory accumulation
let cleanupInterval;
if (typeof global !== 'undefined' && !global._rateLimitInterval) {
  global._rateLimitInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000); // 5 minutes
}

/**
 * Checks if a request from an IP has exceeded the rate limit.
 * @param {string} ip Client IP Address
 * @param {number} limit Request threshold
 * @param {number} windowMs Window duration in milliseconds (default: 60,000ms / 1 min)
 * @returns {object} Rate limit result
 */
export function checkRateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  // If no previous requests or if window expired, start a new window
  if (!clientData || clientData.resetTime < now) {
    const resetTime = now + windowMs;
    const newData = {
      count: 1,
      resetTime,
    };
    rateLimitMap.set(ip, newData);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil(resetTime / 1000), // UNIX timestamp in seconds
    };
  }

  // If request limit already reached
  if (clientData.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(clientData.resetTime / 1000),
    };
  }

  // Increment query count
  clientData.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - clientData.count,
    reset: Math.ceil(clientData.resetTime / 1000),
  };
}
