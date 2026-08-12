import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { securityFingerprint } from "@/lib/security-log";

export type RateLimitPurpose = "public_lead_ip" | "public_lead_duplicate" | "admin_login";

export type RateLimitDecision = {
  allowed: boolean;
  retryAfterSeconds: number;
  count: number;
};

export type SecurityAuditEvent = {
  tenantId: string;
  eventType: string;
  outcome: string;
  identifier?: string;
  requestId?: string | null;
  reasonCodes: string[];
};

export type WebhookReceiptClaim = {
  claimed: boolean;
  tenantId: string;
  provider: string;
  messageIdHash: string;
};

export async function consumeSecurityRateLimit(input: {
  tenantId: string;
  purpose: RateLimitPurpose;
  identifier: string;
  limit: number;
  windowMs: number;
  lockoutMs?: number;
  now?: Date;
}): Promise<RateLimitDecision> {
  const now = input.now ?? new Date();
  const identifierHash = securityFingerprint(`${input.tenantId}:${input.purpose}:${input.identifier}`);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
        const existing = await tx.securityRateBucket.findUnique({
          where: { tenantId_purpose_identifierHash: { tenantId: input.tenantId, purpose: input.purpose, identifierHash } },
        });
        if (existing?.blockedUntil && existing.blockedUntil > now) {
          return { allowed: false, retryAfterSeconds: Math.ceil((existing.blockedUntil.getTime() - now.getTime()) / 1000), count: existing.count };
        }

        const windowExpired = !existing || existing.windowStartedAt.getTime() + input.windowMs <= now.getTime();
        const nextCount = windowExpired ? 1 : existing.count + 1;
        const allowed = nextCount <= input.limit;
        const blockedUntil = allowed ? null : new Date(now.getTime() + (input.lockoutMs ?? input.windowMs));

        await tx.securityRateBucket.upsert({
          where: { tenantId_purpose_identifierHash: { tenantId: input.tenantId, purpose: input.purpose, identifierHash } },
          create: { tenantId: input.tenantId, purpose: input.purpose, identifierHash, count: nextCount, windowStartedAt: now, blockedUntil },
          update: { count: nextCount, windowStartedAt: windowExpired ? now : existing?.windowStartedAt, blockedUntil, updatedAt: now },
        });
        return { allowed, retryAfterSeconds: allowed ? 0 : Math.ceil((blockedUntil!.getTime() - now.getTime()) / 1000), count: nextCount };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      const retryable = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";
      if (!retryable || attempt === 3) throw error;
    }
  }
  throw new Error("security_rate_limit_retry_exhausted");
}

export async function resetSecurityRateLimit(input: { tenantId: string; purpose: RateLimitPurpose; identifier: string }) {
  const identifierHash = securityFingerprint(`${input.tenantId}:${input.purpose}:${input.identifier}`);
  await prisma.securityRateBucket.deleteMany({ where: { tenantId: input.tenantId, purpose: input.purpose, identifierHash } });
}

export async function claimWebhookReceipt(input: { tenantId: string; provider: string; messageId: string; now?: Date }) {
  const messageIdHash = securityFingerprint(`${input.tenantId}:${input.provider}:${input.messageId}`);
  const result = await prisma.webhookReceipt.createMany({
    data: [{ tenantId: input.tenantId, provider: input.provider, messageIdHash, receivedAt: input.now ?? new Date() }],
    skipDuplicates: true,
  });
  return {
    claimed: result.count === 1,
    tenantId: input.tenantId,
    provider: input.provider,
    messageIdHash,
  } satisfies WebhookReceiptClaim;
}

export async function completeWebhookReceipt(receipt: Pick<WebhookReceiptClaim, "tenantId" | "provider" | "messageIdHash">) {
  const { tenantId, provider, messageIdHash } = receipt;
  await prisma.webhookReceipt.update({
    where: { tenantId_provider_messageIdHash: { tenantId, provider, messageIdHash } },
    data: { status: "processed", processedAt: new Date() },
  });
}

export async function releaseWebhookReceipt(receipt: Pick<WebhookReceiptClaim, "tenantId" | "provider" | "messageIdHash">) {
  const { tenantId, provider, messageIdHash } = receipt;
  await prisma.webhookReceipt.deleteMany({ where: { tenantId, provider, messageIdHash, status: "received" } });
}

export async function recordSecurityEvent(input: SecurityAuditEvent) {
  await prisma.securityEvent.create({
    data: {
      tenantId: input.tenantId,
      eventType: input.eventType.slice(0, 100),
      outcome: input.outcome.slice(0, 50),
      identifierHash: input.identifier ? securityFingerprint(input.identifier) : null,
      requestId: input.requestId?.slice(0, 100) || null,
      reasonCodes: input.reasonCodes.slice(0, 20).map((code) => code.slice(0, 80)),
    },
  });
}

export async function revokeSession(tenantId: string, sessionId: string) {
  await prisma.securityEvent.create({
    data: {
      tenantId,
      eventType: "session_revocation",
      outcome: "revoked",
      identifierHash: securityFingerprint(`${tenantId}:session:${sessionId}`),
      reasonCodes: ["logout"],
    },
  });
}

type SessionRevocationLookup = (tenantId: string, sessionId: string) => Promise<boolean>;

const persistedSessionRevocationLookup: SessionRevocationLookup = async (tenantId, sessionId) => Boolean(await prisma.securityEvent.findFirst({
    where: {
      tenantId,
      eventType: "session_revocation",
      identifierHash: securityFingerprint(`${tenantId}:session:${sessionId}`),
    },
    select: { id: true },
  }));

let sessionRevocationLookup = persistedSessionRevocationLookup;

export function setSessionRevocationLookupForTest(lookup: SessionRevocationLookup) {
  sessionRevocationLookup = lookup;
  return () => {
    sessionRevocationLookup = persistedSessionRevocationLookup;
  };
}

export async function isSessionRevoked(tenantId: string, sessionId: string) {
  return sessionRevocationLookup(tenantId, sessionId);
}
