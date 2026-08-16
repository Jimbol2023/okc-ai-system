import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { GET, setCeoExceptionInboxRouteDepsForTest } from "@/app/api/company/ceo-exception-inbox/route";
import { createSessionToken } from "@/lib/auth";
import { internalOnlySafetyProof } from "@/lib/real-lead-acquisition-review-materializer";

const restores: Array<() => void> = [];
const previous = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, secret: process.env.AUTH_SECRET };

beforeEach(() => {
  process.env.ADMIN_EMAIL = "ceo@example.com";
  process.env.ADMIN_PASSWORD = "local-password";
  process.env.AUTH_SECRET = "local-test-secret-with-sufficient-length";
});

afterEach(() => {
  while (restores.length) restores.pop()?.();
  if (previous.email === undefined) delete process.env.ADMIN_EMAIL; else process.env.ADMIN_EMAIL = previous.email;
  if (previous.password === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous.password;
  if (previous.secret === undefined) delete process.env.AUTH_SECRET; else process.env.AUTH_SECRET = previous.secret;
});

describe("CEO Exception Inbox route", () => {
  it("rejects unauthenticated requests before loading data", async () => {
    let called = false;
    restores.push(setCeoExceptionInboxRouteDepsForTest({ getInbox: async () => { called = true; throw new Error("not called"); } }));
    const response = await GET(new Request("https://example.test/api/company/ceo-exception-inbox"));
    assert.equal(response.status, 401);
    assert.equal(called, false);
  });

  it("derives tenant from the authenticated session and ignores query overrides", async () => {
    const token = await createSessionToken("ceo@example.com", { tenantId: "tenant-alpha" });
    restores.push(setCeoExceptionInboxRouteDepsForTest({
      getInbox: async ({ tenantId }) => ({ generatedAt: now(), tenantId, status: "no_action_required", estimatedReviewMinutes: 0, items: [], excludedCounts: emptyExcluded(), safety: { readOnly: true, authenticatedContextRequired: true, ...internalOnlySafetyProof } }),
    }));
    const response = await GET(new Request("https://example.test/api/company/ceo-exception-inbox?tenantId=tenant-beta", { headers: { cookie: `okcWholesaleAdminSession=${token}` } }));
    const body = await response.json() as { tenantId: string; status: string };
    assert.equal(response.status, 200);
    assert.equal(body.tenantId, "tenant-alpha");
    assert.equal(body.status, "no_action_required");
  });

  it("returns an internal-only fail-closed response", async () => {
    const token = await createSessionToken("ceo@example.com", { tenantId: "tenant-alpha" });
    restores.push(setCeoExceptionInboxRouteDepsForTest({ getInbox: async () => { throw new Error("read failure"); } }));
    const response = await GET(new Request("https://example.test/api/company/ceo-exception-inbox", { headers: { cookie: `okcWholesaleAdminSession=${token}` } }));
    const body = await response.json() as Record<string, unknown>;
    assert.equal(response.status, 500);
    for (const key of ["providerCalled", "outreach", "sent", "published", "scraping", "crmMutation", "externalExecutionAllowed", "liveExecutionAllowed"]) assert.equal(body[key], false, key);
  });
});

function now() { return "2026-08-06T18:00:00.000Z"; }
function emptyExcluded() {
  return { syntheticItemsExcluded: 0, staleDraftsExcluded: 0, historicalAssignmentsExcluded: 0, readinessDirectivesExcluded: 0, legacyCampaignDirectiveExcluded: 0, duplicateDecisionPacketsExcluded: 0, resolvedApprovalsExcluded: 0, reusedTasksExcluded: 0, nonActionableItemsExcluded: 0, reviewBudgetDeferred: 0 };
}
