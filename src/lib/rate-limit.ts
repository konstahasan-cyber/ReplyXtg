/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough for a single Node instance and for the demo. For serverless or
 * multi-instance production deployments replace the store with Redis/Upstash
 * (the `RateLimitStore` shape stays the same).
 */

type Bucket = number[];

export interface RateLimitStore {
  hit(key: string, windowMs: number, now: number): number;
}

class MemoryStore implements RateLimitStore {
  private buckets = new Map<string, Bucket>();

  hit(key: string, windowMs: number, now: number) {
    const bucket = (this.buckets.get(key) ?? []).filter((t) => now - t < windowMs);
    bucket.push(now);
    this.buckets.set(key, bucket);
    if (this.buckets.size > 5000) this.prune(windowMs, now);
    return bucket.length;
  }

  private prune(windowMs: number, now: number) {
    for (const [k, v] of this.buckets) if (!v.some((t) => now - t < windowMs)) this.buckets.delete(k);
  }
}

const store: RateLimitStore = new MemoryStore();

export const leadLimits = [
  { windowMs: 60_000, max: 5 },
  { windowMs: 60 * 60_000, max: 20 },
];

export function rateLimit(key: string, limits = leadLimits, now = Date.now()) {
  for (const { windowMs, max } of limits) {
    const count = store.hit(`${key}:${windowMs}`, windowMs, now);
    if (count > max) return { ok: false as const, retryAfter: Math.ceil(windowMs / 1000) };
  }
  return { ok: true as const };
}
