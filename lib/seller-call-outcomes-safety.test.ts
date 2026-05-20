import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const repoRoot = process.cwd();
const routeSource = readFileSync(join(repoRoot, "app/api/leads/[leadId]/seller-call-outcomes/route.ts"), "utf8");
const dbSource = readFileSync(join(repoRoot, "lib/seller-call-outcomes-db.ts"), "utf8");

describe("seller call outcome persistence safety", () => {
  it("keeps the route away from provider and automation imports", () => {
    assert.doesNotMatch(routeSource, /twilio|send-sms|automation-agent|mock-outreach|outreach-gating|scheduler|worker/i);
    assert.doesNotMatch(dbSource, /twilio|send-sms|automation-agent|mock-outreach|outreach-gating|scheduler|worker/i);
  });

  it("does not mutate lead execution, approval, DNC, or scheduling fields", () => {
    assert.doesNotMatch(routeSource, /prisma\.lead\.update|approvalStatus|doNotContact|automationStatus|nextFollowUpAt|followUpCount/);
    assert.doesNotMatch(dbSource, /lead\.update|approvalStatus|doNotContact|automationStatus|nextFollowUpAt|followUpCount/);
  });

  it("keeps outcome storage append-only", () => {
    assert.match(dbSource, /sellerCallOutcome.*create/s);
    assert.match(dbSource, /sellerCallOutcome.*findMany/s);
    assert.doesNotMatch(dbSource, /\.update\(|\.upsert\(|\.delete\(|\.deleteMany\(/);
  });

  it("returns no-execution response flags from the API route", () => {
    assert.match(routeSource, /sent:\s*false/);
    assert.match(routeSource, /wouldSend:\s*false/);
    assert.match(routeSource, /automationTriggered:\s*false/);
    assert.match(routeSource, /providerCalled:\s*false/);
  });
});
