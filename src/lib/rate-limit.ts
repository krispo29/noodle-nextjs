/**
 * Simple in-memory rate limiter
 * Note: For production, use Redis or similar distributed store
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueToken: number; // Max requests per token in the interval
}

/**
 * Rate limiter function
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with success boolean and remaining count
 */
export function rateLimit(identifier: string, config: RateLimitConfig) {
  const now = Date.now();
  const key = identifier;
  
  let entry = rateLimitStore.get(key);
  
  // If no entry or expired, create new one
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.interval,
    };
    rateLimitStore.set(key, entry);
  }
  
  // Increment count
  entry.count++;
  
  // Check if over limit
  const success = entry.count <= config.uniqueToken;
  const remaining = Math.max(0, config.uniqueToken - entry.count);
  
  return {
    success,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Check if rate limit is exceeded for an identifier
 */
export function isRateLimited(identifier: string, config: RateLimitConfig): boolean {
  const result = rateLimit(identifier, config);
  return !result.success;
}

/**
 * Get rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, config: RateLimitConfig) {
  const now = Date.now();
  const key = identifier;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    return {
      remaining: config.uniqueToken,
      resetTime: now + config.interval,
      limited: false,
    };
  }
  
  return {
    remaining: Math.max(0, config.uniqueToken - entry.count),
    resetTime: entry.resetTime,
    limited: entry.count >= config.uniqueToken,
  };
}

// Common rate limit configurations
export const RATE_LIMITS = {
  // Strict: 5 attempts per minute (for login)
  LOGIN: { interval: 60000, uniqueToken: 5 },
  
  // Moderate: 10 attempts per minute (for general API)
  GENERAL: { interval: 60000, uniqueToken: 10 },
  
  // Lenient: 60 attempts per minute (for read operations)
  READ: { interval: 60000, uniqueToken: 60 },
};
