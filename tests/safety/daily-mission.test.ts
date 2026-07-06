import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { dailyMissionSafetyFlags } from "@/lib/daily-mission";

describe("Daily Mission safety", () => {
  it("keeps canonical mission safety flags closed", () => {
    assert.equal(dailyMissionSafetyFlags.providerCalled, false);
    assert.equal(dailyMissionSafetyFlags.liveExecutionAllowed, false);
    assert.equal(dailyMissionSafetyFlags.published, false);
    assert.equal(dailyMissionSafetyFlags.sent, false);
    assert.equal(dailyMissionSafetyFlags.workflowStarted, false);
    assert.equal(dailyMissionSafetyFlags.outreachBlocked, true);
    assert.equal(dailyMissionSafetyFlags.scrapingBlocked, true);
    assert.equal(dailyMissionSafetyFlags.adsBlocked, true);
    assert.equal(dailyMissionSafetyFlags.emailBlocked, true);
    assert.equal(dailyMissionSafetyFlags.smsBlocked, true);
    assert.equal(dailyMissionSafetyFlags.crmMutationBlocked, true);
  });

  it("does not import external execution paths", () => {
    const source = readFileSync("lib/daily-mission.ts", "utf8");

    assert.doesNotMatch(source, /send-sms|twilio|publish-assist|createSocialExecutionPlan|mock-outreach|outreach-gating/i);
    assert.doesNotMatch(source, /fetch\(|providerFetch|refreshAccessToken/i);
  });
});
