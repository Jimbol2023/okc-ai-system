import assert from "node:assert/strict";
import test from "node:test";

import type { BusinessIntelligenceReport } from "@/lib/business-intelligence";
import { calculateExecutiveRecommendationConfidence, createExecutiveLearningRecommendations } from "@/lib/executive-learning";

const emptyReport: BusinessIntelligenceReport = {
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
    totalLeads: 0,
    qualifiedLeads: 0,
    closedLeads: 0,
    followUpsDue: 0,
    offerReadyCount: 0,
    marketingApprovalBacklog: 0,
    financeGapCount: 0,
    closingBlockedCount: 0,
    topChannel: null,
  },
};

test("calculateExecutiveRecommendationConfidence honors sample size", () => {
  assert.deepEqual(calculateExecutiveRecommendationConfidence({ sampleSize: 0, positiveSignals: 0 }), {
    confidenceLabel: "low",
    confidenceScore: 0,
  });

  assert.equal(calculateExecutiveRecommendationConfidence({ sampleSize: 8, positiveSignals: 5 }).confidenceLabel, "medium");
  assert.equal(calculateExecutiveRecommendationConfidence({ sampleSize: 20, positiveSignals: 18 }).confidenceLabel, "high");
});

test("createExecutiveLearningRecommendations stays advisory and links relevant knowledge", () => {
  const recommendations = createExecutiveLearningRecommendations({
    report: {
      ...emptyReport,
      summary: {
        ...emptyReport.summary,
        totalLeads: 10,
        qualifiedLeads: 7,
        followUpsDue: 3,
        topChannel: {
          source: "Facebook",
          totalLeads: 10,
          qualifiedLeads: 7,
          closedLeads: 1,
          conversionRate: 10,
          qualifiedShare: 70,
        },
      },
    },
    memoryEvents: [
      {
        eventType: "follow_up_completed",
        source: "lead_status_update",
        approvalDecision: null,
        outcome: "contacted",
        metadata: null,
        createdAt: new Date(),
      },
    ],
    knowledgeItems: [],
  });

  const text = recommendations.map((recommendation) => `${recommendation.summary} ${recommendation.reason}`).join(" ");

  assert.match(text, /follow-up/i);
  assert.doesNotMatch(text, /send now|call provider|publish automatically|start outreach/i);
  assert.ok(recommendations.some((recommendation) => recommendation.knowledgeLinks.length > 0));
});
