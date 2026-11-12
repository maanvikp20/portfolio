// Simple in-memory sliding-window rate limiter.
// Best-effort only: on serverless hosts like Vercel each instance keeps its own
// counts, so pair this with a Vercel Firewall rate-limit rule for real protection.
const buckets = new Map();

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return {
      ok: false,
      retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000),
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  // occasional cleanup so the map doesn't grow forever
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return { ok: true };
}

// first entry of x-forwarded-for is the client IP on Vercel
export function getClientIp(req) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}