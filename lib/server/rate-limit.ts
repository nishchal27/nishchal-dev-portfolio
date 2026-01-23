// Server-side rate limiting for AI API endpoints
// IP-based rate limiting with in-memory storage

interface RateLimitEntry {
  hourly: number[];
  daily: number[];
  lastCleanup: number;
}

class ServerRateLimiter {
  private entries: Map<string, RateLimitEntry> = new Map();
  private readonly hourlyLimit: number;
  private readonly dailyLimit: number;
  private readonly hourlyWindowMs = 60 * 60 * 1000; // 1 hour
  private readonly dailyWindowMs = 24 * 60 * 60 * 1000; // 24 hours
  private readonly cleanupIntervalMs = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const hourlyLimit = parseInt(
      process.env.RATE_LIMIT_REQUESTS_PER_HOUR || "20",
      10
    );
    const dailyLimit = parseInt(
      process.env.RATE_LIMIT_REQUESTS_PER_DAY || "100",
      10
    );

    this.hourlyLimit = hourlyLimit;
    this.dailyLimit = dailyLimit;

    // Start cleanup interval
    setInterval(() => this.cleanup(), this.cleanupIntervalMs);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.entries.entries()) {
      // Clean old timestamps
      const hourlyCutoff = now - this.hourlyWindowMs;
      const dailyCutoff = now - this.dailyWindowMs;

      entry.hourly = entry.hourly.filter((time) => time > hourlyCutoff);
      entry.daily = entry.daily.filter((time) => time > dailyCutoff);

      // Remove entry if both arrays are empty
      if (entry.hourly.length === 0 && entry.daily.length === 0) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.entries.delete(key));
  }

  private getEntry(ip: string): RateLimitEntry {
    if (!this.entries.has(ip)) {
      this.entries.set(ip, {
        hourly: [],
        daily: [],
        lastCleanup: Date.now(),
      });
    }
    return this.entries.get(ip)!;
  }

  canMakeRequest(ip: string): { allowed: boolean; reason?: string } {
    const now = Date.now();
    const entry = this.getEntry(ip);

    // Clean old timestamps for this entry
    const hourlyCutoff = now - this.hourlyWindowMs;
    const dailyCutoff = now - this.dailyWindowMs;

    entry.hourly = entry.hourly.filter((time) => time > hourlyCutoff);
    entry.daily = entry.daily.filter((time) => time > dailyCutoff);

    // Check hourly limit
    if (entry.hourly.length >= this.hourlyLimit) {
      const oldestRequest = Math.min(...entry.hourly);
      const retryAfter = Math.ceil(
        (hourlyCutoff + this.hourlyWindowMs - now) / 1000
      );
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.hourlyLimit} requests per hour. Retry after ${retryAfter} seconds.`,
      };
    }

    // Check daily limit
    if (entry.daily.length >= this.dailyLimit) {
      const oldestRequest = Math.min(...entry.daily);
      const retryAfter = Math.ceil(
        (dailyCutoff + this.dailyWindowMs - now) / 1000
      );
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.dailyLimit} requests per day. Retry after ${retryAfter} seconds.`,
      };
    }

    // Record this request
    entry.hourly.push(now);
    entry.daily.push(now);

    return { allowed: true };
  }

  getRemainingRequests(ip: string): { hourly: number; daily: number } {
    const entry = this.getEntry(ip);
    const now = Date.now();

    const hourlyCutoff = now - this.hourlyWindowMs;
    const dailyCutoff = now - this.dailyWindowMs;

    entry.hourly = entry.hourly.filter((time) => time > hourlyCutoff);
    entry.daily = entry.daily.filter((time) => time > dailyCutoff);

    return {
      hourly: Math.max(0, this.hourlyLimit - entry.hourly.length),
      daily: Math.max(0, this.dailyLimit - entry.daily.length),
    };
  }
}

export const serverRateLimiter = new ServerRateLimiter();

export function getClientIP(request: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback (won't work in production but useful for local dev)
  return "unknown";
}
