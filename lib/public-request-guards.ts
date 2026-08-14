import { securityFingerprint } from "@/lib/security-log";

const buckets = new Map<string, { count: number; windowStartedAt: number; blockedUntil: number }>();

export function getRequestIp(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

export async function readBoundedJsonBody(request: Request, maxBytes: number) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { ok: false as const, status: 415, reason: "unsupported_content_type" };
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false as const, status: 413, reason: "payload_too_large" };
  }

  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return { ok: false as const, status: 413, reason: "payload_too_large" };
  }

  try {
    return { ok: true as const, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, status: 400, reason: "invalid_json" };
  }
}

export function consumeInMemoryPublicRateLimit(input: {
  tenantId: string;
  purpose: string;
  identifier: string;
  limit: number;
  windowMs: number;
  nowMs?: number;
}) {
  const now = input.nowMs ?? Date.now();
  const key = securityFingerprint(`${input.tenantId}:${input.purpose}:${input.identifier}`);
  const existing = buckets.get(key);

  if (existing?.blockedUntil && existing.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.blockedUntil - now) / 1000),
      count: existing.count,
    };
  }

  const windowExpired = !existing || existing.windowStartedAt + input.windowMs <= now;
  const next = {
    count: windowExpired ? 1 : existing.count + 1,
    windowStartedAt: windowExpired ? now : existing.windowStartedAt,
    blockedUntil: 0,
  };
  const allowed = next.count <= input.limit;
  if (!allowed) next.blockedUntil = now + input.windowMs;
  buckets.set(key, next);

  return {
    allowed,
    retryAfterSeconds: allowed ? 0 : Math.ceil(input.windowMs / 1000),
    count: next.count,
  };
}

export function resetPublicRateLimitForTest() {
  buckets.clear();
}
