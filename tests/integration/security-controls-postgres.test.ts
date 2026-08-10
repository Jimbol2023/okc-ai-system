import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";

import { prisma } from "@/lib/prisma";
import { claimWebhookReceipt, completeWebhookReceipt, consumeSecurityRateLimit, releaseWebhookReceipt } from "@/lib/security-controls";

const tenantA = "phase1-integration-tenant-a";
const tenantB = "phase1-integration-tenant-b";

beforeEach(async () => {
  await prisma.webhookReceipt.deleteMany({ where: { tenantId: { in: [tenantA, tenantB] } } });
  await prisma.securityRateBucket.deleteMany({ where: { tenantId: { in: [tenantA, tenantB] } } });
});

after(async () => {
  await prisma.webhookReceipt.deleteMany({ where: { tenantId: { in: [tenantA, tenantB] } } });
  await prisma.securityRateBucket.deleteMany({ where: { tenantId: { in: [tenantA, tenantB] } } });
  await prisma.$disconnect();
});

test("durable rate limiting is tenant scoped and persists its block", async () => {
  const input = { purpose: "admin_login" as const, identifier: "same", limit: 2, windowMs: 60_000 };
  assert.equal((await consumeSecurityRateLimit({ tenantId: tenantA, ...input })).allowed, true);
  assert.equal((await consumeSecurityRateLimit({ tenantId: tenantA, ...input })).allowed, true);
  assert.equal((await consumeSecurityRateLimit({ tenantId: tenantA, ...input })).allowed, false);
  assert.equal((await consumeSecurityRateLimit({ tenantId: tenantB, ...input })).allowed, true);
});

test("webhook receipts isolate identical provider message ids by tenant", async () => {
  const first = await claimWebhookReceipt({ tenantId: tenantA, provider: "twilio", messageId: "SM_same" });
  assert.equal(first.claimed, true);
  assert.equal((await claimWebhookReceipt({ tenantId: tenantA, provider: "twilio", messageId: "SM_same" })).claimed, false);
  const otherTenant = await claimWebhookReceipt({ tenantId: tenantB, provider: "twilio", messageId: "SM_same" });
  assert.equal(otherTenant.claimed, true);
  await completeWebhookReceipt(first);
  await releaseWebhookReceipt(otherTenant);
  assert.equal(await prisma.webhookReceipt.count({ where: { tenantId: tenantA, status: "processed" } }), 1);
  assert.equal(await prisma.webhookReceipt.count({ where: { tenantId: tenantB } }), 0);
});
