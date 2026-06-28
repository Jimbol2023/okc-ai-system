import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { BusinessIntelligenceReport } from "./business-intelligence";
import { assertExecutiveRecommendationsAreAdvisory, createExecutiveRecommendationsFromBi } from "./executive-recommendations";

function report(overrides: Partial<BusinessIntelligenceReport["summary"]> = {}): BusinessIntelligenceReport {
  return {
    kpis: [],
    channelPerformance: [],
    departmentHealth: [],
    trendCharts: [],
    dataGaps: [],
    safetyFlags: {
      advisoryOnly: true,
      providerCalled: false,
      outreachSent: false,
      crmMutated: false,
      schemaChanged: false,
    },
    summary: {
      totalLeads: 10,
      qualifiedLeads: 6,
      closedLeads: 1,
      followUpsDue: 0,
      offerReadyCount: 0,
      marketingApprovalBacklog: 0,
      financeGapCount: 0,
      closingBlockedCount: 0,
      topChannel: null,
      ...overrides,
    },
  };
}

describe("executive recommendation rules", () => {
  it("generates advisory recommendations from KPI pressure", () => {
    const recommendations = createExecutiveRecommendationsFromBi(
      report({
        followUpsDue: 5,
        offerReadyCount: 3,
        marketingApprovalBacklog: 2,
        financeGapCount: 1,
        closingBlockedCount: 1,
        topChannel: {
          source: "Facebook",
          totalLeads: 6,
          qualifiedLeads: 6,
          closedLeads: 1,
          conversionRate: 17,
          qualifiedShare: 60,
        },
      }),
    );

    assert.ok(recommendations.some((recommendation) => /5 lead\(s\) need manual follow-up/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /Facebook generated 60%/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /3 opportunity/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /2 marketing draft/i.test(recommendation)));
    assertExecutiveRecommendationsAreAdvisory(recommendations);
  });

  it("blocks execution language from advisory recommendations", () => {
    assert.throws(() => assertExecutiveRecommendationsAreAdvisory(["Send now to all sellers."]));
    assert.throws(() => assertExecutiveRecommendationsAreAdvisory(["Call provider for enrichment."]));
    assert.throws(() => assertExecutiveRecommendationsAreAdvisory(["Publish automatically."]));
    assert.throws(() => assertExecutiveRecommendationsAreAdvisory(["Start outreach today."]));
  });
});
