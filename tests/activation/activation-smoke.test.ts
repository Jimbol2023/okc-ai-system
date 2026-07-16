import assert from "node:assert/strict";
import test from "node:test";

import { decideExecutiveDirective, getCompanyActivationSnapshot } from "@/lib/company-activation";
import { getDepartmentIntelligenceReport } from "@/lib/department-intelligence";

function getSkipReason() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return "Activation smoke tests are blocked in production.";
  }

  if (process.env.ALLOW_MUTATING_DEV_DB_TESTS !== "true") {
    return "Set ALLOW_MUTATING_DEV_DB_TESTS=true to run DB-mutating activation smoke tests.";
  }

  return false;
}

function assertExternalExecutionBlocked(flags: {
  providerCalled: boolean;
  sent?: boolean;
  published?: boolean;
  liveExecutionAllowed: boolean;
}) {
  assert.equal(flags.providerCalled, false);
  assert.equal(flags.sent ?? false, false);
  assert.equal(flags.published ?? false, false);
  assert.equal(flags.liveExecutionAllowed, false);
}

test("Campaign 001 activates the internal company loop without external execution", async () => {
  const skipReason = getSkipReason();

  if (skipReason) {
    console.log(skipReason);
    return;
  }

  const before = await getCompanyActivationSnapshot();

  assert.equal(before.providerCalled, false);
  assert.equal(before.liveExecutionAllowed, false);
  assert.equal(before.directives.length, 4);
  assert.ok(before.directives.some((directive) => directive.id === "campaign-001"));

  const result = await decideExecutiveDirective({
    directiveId: "campaign-001",
    decision: "approve",
    note: "Activation smoke test: internal company loop only.",
    decidedBy: "activation-smoke-test",
  });

  assert.equal(result.ok, true);
  assert.equal(result.resultingStatus, "executive_approved");
  assert.ok(result.assignmentsTotal >= 1);
  assert.ok(result.draftQueueItemsTotal >= 1);
  assertExternalExecutionBlocked(result);
  assert.equal(result.safetyFlags.outreachBlocked, true);
  assert.equal(result.safetyFlags.workflowExecutionBlocked, true);
  assert.equal(result.safetyFlags.scrapingBlocked, true);
  assert.equal(result.safetyFlags.adsBlocked, true);
  assert.equal(result.safetyFlags.emailBlocked, true);
  assert.equal(result.safetyFlags.smsBlocked, true);

  const after = await getCompanyActivationSnapshot();

  assert.ok(after.assignments.some((assignment) => assignment.directiveId === "campaign-001"));
  assert.ok(after.draftQueueItems.some((draft) => draft.directiveId === "campaign-001"));
  assert.equal(after.latestDecision?.decision, "approve");
  assert.equal(after.providerCalled, false);
  assert.equal(after.liveExecutionAllowed, false);

  const intelligence = await getDepartmentIntelligenceReport();

  assert.equal(intelligence.departments.length, 21);
  assert.ok(intelligence.topRecommendations.length > 0);
  assertExternalExecutionBlocked(intelligence.safety);
  assert.equal(intelligence.safety.outreachBlocked, true);
  assert.equal(intelligence.safety.workflowExecutionBlocked, true);
  assert.equal(intelligence.safety.scrapingBlocked, true);
  assert.equal(intelligence.safety.adsBlocked, true);
  assert.equal(intelligence.safety.emailBlocked, true);
  assert.equal(intelligence.safety.smsBlocked, true);
});
