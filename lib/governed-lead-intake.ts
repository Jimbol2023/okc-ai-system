import { createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/tenant-context";

export const PUBLIC_INTAKE_RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function normalizePublicIntakeSource(input: { referralCode?: string | null; referralSource?: string | null }) {
  return input.referralCode?.trim() ? "website_referral" : input.referralSource?.trim() ? "website_campaign" : "public_seller_website";
}

export function classifyPublicIntakeSpam(input: { honeypot?: string; text: string }) {
  if (input.honeypot?.trim()) return { classification: "rejected_honeypot" as const, accepted: false };
  const marker = /(^|[^a-z0-9])(acceptance|test|synthetic|demo|fixture|sample|seed|seeded)([^a-z0-9]|$)/iu;
  if (marker.test(input.text)) return { classification: "excluded_test_marker" as const, accepted: false };
  return { classification: "accepted_unverified_public_submission" as const, accepted: true };
}

export function publicIntakeFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const agent = request.headers.get("user-agent") ?? "unknown";
  return createHash("sha256").update(`${forwarded}|${agent}`).digest("hex");
}

export async function consumePublicIntakeRateLimit(tenantIdValue: string, fingerprint: string, now = new Date()) {
  const tenantId = requireTenantId(tenantIdValue, "public_intake_rate_limit");
  const windowStart = new Date(Math.floor(now.getTime() / WINDOW_MS) * WINDOW_MS);
  const record = await prisma.publicIntakeRateLimit.upsert({
    where: { tenantId_fingerprint_windowStart: { tenantId, fingerprint, windowStart } },
    create: { tenantId, fingerprint, windowStart, attempts: 1 },
    update: { attempts: { increment: 1 } },
  });
  return { allowed: record.attempts <= PUBLIC_INTAKE_RATE_LIMIT, attempts: record.attempts, windowStart };
}
