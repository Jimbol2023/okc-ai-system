import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createMarketingPlatformRegistryReport } from "./marketing-platform-registry";

describe("marketing platform registry", () => {
  it("registers every configured marketing platform as manual and approval gated", () => {
    const report = createMarketingPlatformRegistryReport();
    const labels = report.platforms.map((platform) => platform.label);

    assert.deepEqual(labels, [
      "Website",
      "Google Business Profile",
      "Facebook Business",
      "Instagram Business",
      "LinkedIn Company",
      "Pinterest Business",
      "YouTube",
      "X (@JcapitalPG)",
      "TikTok",
    ]);
    assert.ok(report.averageReadinessScore >= 0 && report.averageReadinessScore <= 100);
    assert.equal(report.safety.providerCalled, false);
    assert.equal(report.safety.liveExecutionAllowed, false);
    assert.equal(report.safety.publishingBlocked, true);

    for (const platform of report.platforms) {
      assert.equal(platform.publishingMode, "MANUAL");
      assert.equal(platform.approvalRequired, "CEO APPROVAL REQUIRED");
      assert.equal(platform.manualPublishing, true);
      assert.equal(platform.providerCalled, false);
      assert.equal(platform.liveExecutionAllowed, false);
      assert.equal(platform.oauthStarted, false);
      assert.equal(platform.published, false);
      assert.equal(platform.scheduled, false);
      assert.equal(platform.scraped, false);
      assert.ok(platform.readinessScore >= 0 && platform.readinessScore <= 100);
    }
  });
});
