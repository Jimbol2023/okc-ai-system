import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createExecutiveRecommendations } from "./executive-dashboard";

describe("executive dashboard recommendations", () => {
  it("prioritizes daily revenue and cleanup work without execution", () => {
    const recommendations = createExecutiveRecommendations({
      followUpsDue: 2,
      missingInfoCount: 3,
      offerReadyCount: 1,
      marketingAwaitingApproval: 1,
      canvaAwaitingDesign: 1,
      financeGapCount: 2,
      providerMissingCount: 4,
    });

    assert.ok(recommendations.some((recommendation) => /follow-ups/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /missing seller\/property/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /finance entries/i.test(recommendation)));
    assert.ok(recommendations.every((recommendation) => !/send now|publish now|call provider/i.test(recommendation)));
  });

  it("returns a monitoring recommendation for clean state", () => {
    const recommendations = createExecutiveRecommendations({
      followUpsDue: 0,
      missingInfoCount: 0,
      offerReadyCount: 0,
      marketingAwaitingApproval: 0,
      canvaAwaitingDesign: 0,
      financeGapCount: 0,
      providerMissingCount: 0,
    });

    assert.deepEqual(recommendations, [
      "Monitor new leads, keep source tracking clean, and maintain manual review discipline.",
    ]);
  });
});
