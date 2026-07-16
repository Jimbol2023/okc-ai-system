import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import { createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";
import {
  assertRevenueIntelligenceOpportunityEngineSafety,
  createRevenueIntelligenceOpportunityEngineReportFromInputs,
  revenueOpportunityTypes,
} from "@/lib/revenue-intelligence-opportunity-engine";

const generatedAt = "2026-07-10T17:00:00.000Z";

function snapshot(input: {
  connectorId: string;
  category: BusinessDataCategory;
  status: BusinessSnapshotStatus;
  summary: string;
  dataGaps?: string[];
}): BusinessDataSnapshotRecord {
  return {
    snapshotDate: generatedAt,
    provider: "Google",
    connectorId: input.connectorId,
    category: input.category,
    status: input.status,
    sourceLabel: `sprint-12:${input.connectorId}:${input.category}`,
    provenance: "Sprint 12 read-only test fixture",
    freshness: generatedAt,
    summary: input.summary,
    metrics: { rawSecret: "must not flow" },
    records: [{ rawPayload: "must not flow" }],
    dataGaps: input.dataGaps ?? [],
    assumptions: [],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

function report() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const dailyLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt });
  const connectorSignals = createConnectorSignalFoundationReportFromInputs({
    snapshots: [
      snapshot({
        connectorId: "google_analytics",
        category: "google_analytics_traffic",
        status: "partial",
        summary: "GA4 conversion trend is visible as read-only context.",
      }),
      snapshot({
        connectorId: "google_search_console",
        category: "search_console_performance",
        status: "partial",
        summary: "Search Console seller intent query group is visible as read-only context.",
      }),
      snapshot({
        connectorId: "google_business_profile",
        category: "google_business_profile_performance",
        status: "data_gap",
        summary: "GBP live performance remains unavailable.",
        dataGaps: ["GBP live read is not approved."],
      }),
    ],
    workforce,
    dailyLoop,
    generatedAt,
  });
  const marketCustomerIntelligence = createMarketCustomerIntelligenceFoundationReportFromInputs({
    workforce,
    dailyLoop,
    connectorSignals,
    generatedAt,
  });
  const departmentOperatingSystem = createDepartmentOperatingSystemReportFromInputs({
    intelligence: marketCustomerIntelligence,
    generatedAt,
  });

  return createRevenueIntelligenceOpportunityEngineReportFromInputs({
    departmentOperatingSystem,
    marketCustomerIntelligence,
    generatedAt,
  });
}

test("Sprint 11 missions and telemetry convert into advisory revenue opportunities", () => {
  const engine = report();

  assert.equal(engine.ok, true);
  assert.equal(engine.sprint, "12");
  assert.ok(engine.opportunities.length >= 10);
  assert.ok(engine.opportunities.every((opportunity) => opportunity.opportunityVersion === "sprint-12a-v1"));
  assert.ok(engine.opportunities.every((opportunity) => revenueOpportunityTypes.includes(opportunity.opportunityType)));
  assert.ok(engine.opportunities.every((opportunity) => opportunity.sourceLabels.length > 0));
  assert.ok(engine.opportunities.every((opportunity) => opportunity.advisoryOnly));
  assert.ok(engine.opportunities.every((opportunity) => opportunity.providerCalled === false));
  assert.doesNotThrow(() => assertRevenueIntelligenceOpportunityEngineSafety(engine));
});

test("opportunity scoring is deterministic transparent and explainable", () => {
  const engine = report();
  const scores = engine.opportunities.map((opportunity) => opportunity.score.totalScore);
  const repeatedScores = report().opportunities.map((opportunity) => opportunity.score.totalScore);

  assert.deepEqual(scores, repeatedScores);
  assert.ok(engine.opportunities.every((opportunity) => opportunity.score.explanation.includes("expected value")));
  assert.ok(engine.opportunities.every((opportunity) => opportunity.score.totalScore >= 0 && opportunity.score.totalScore <= 100));
  assert.ok(engine.opportunities.every((opportunity) => opportunity.expectedValue >= 0 && opportunity.expectedValue <= 100));
});

test("prioritization ranks by expected business impact and feasibility", () => {
  const engine = report();
  const scores = engine.prioritizedQueue.map((item) => item.totalScore);

  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  assert.deepEqual(engine.prioritizedQueue.map((item) => item.rank), Array.from({ length: engine.prioritizedQueue.length }, (_, index) => index + 1));
  assert.ok(engine.prioritizedQueue.some((item) => item.bestRiskReward));
  assert.ok(engine.prioritizedQueue.every((item) => item.nextInternalStep));
  assert.ok(engine.prioritizedQueue.every((item) => item.advisoryOnly));
});

test("executive revenue brief surfaces top opportunities risks bottlenecks departments and missing data", () => {
  const brief = report().executiveRevenueBrief;

  assert.equal(brief.briefVersion, "sprint-12d-v1");
  assert.ok(brief.topFiveOpportunities.length > 0);
  assert.ok(brief.topFiveOpportunities.length <= 5);
  assert.equal(brief.enterpriseOpportunityContract.contractVersion, "enterprise-opportunity-v1");
  assert.ok(brief.enterpriseOpportunityContract.topOpportunityStatuses.length > 0);
  assert.ok(brief.enterpriseOpportunityContract.requiredApprovalLabels.includes("Human opportunity review"));
  assert.equal(brief.enterpriseOpportunityContract.opportunityLifecycleAdvisoryOnly, true);
  assert.equal(brief.enterpriseOpportunityContract.approvalAsExecutionAllowed, false);
  assert.ok(brief.recommendedInternalDecisions.length > 0);
  assert.ok(Array.isArray(brief.revenueRisks));
  assert.ok(Array.isArray(brief.bottlenecks));
  assert.ok(Array.isArray(brief.departmentsNeedingAttention));
  assert.ok(Array.isArray(brief.missingDataBlockingRevenue));
  assert.equal(brief.approvalAsExecutionAllowed, false);
  assert.equal(brief.providerCalled, false);
});

test("closed-loop learning remains advisory and non-persistent", () => {
  const learning = report().closedLoopLearning;

  assert.equal(learning.learningVersion, "sprint-12e-v1");
  assert.equal(learning.memoryPersistenceAllowed, false);
  assert.equal(learning.kpiPersistenceAllowed, false);
  assert.equal(learning.automationAllowed, false);
  assert.equal(learning.providerCalled, false);
  assert.ok(learning.recommendationQualityNotes.every((note) => /advisory|governance|quality/i.test(note)));
});

test("Sprint 12 cannot authorize external execution or leak raw provider details", () => {
  const engine = report();
  const serialized = JSON.stringify(engine);

  assert.equal(engine.safety.providerCalled, false);
  assert.equal(engine.safety.liveExecutionAllowed, false);
  assert.equal(engine.safety.externalWritesAllowed, false);
  assert.equal(engine.safety.crmMutationAllowed, false);
  assert.equal(engine.safety.leadCreationAllowed, false);
  assert.equal(engine.safety.outreachAllowed, false);
  assert.equal(engine.safety.publishingAllowed, false);
  assert.equal(engine.safety.scrapingAllowed, false);
  assert.equal(engine.safety.memoryPersistenceAllowed, false);
  assert.equal(engine.safety.kpiPersistenceAllowed, false);
  assert.equal(engine.safety.approvalAsExecutionAllowed, false);
  assert.equal(serialized.includes("must not flow"), false);
  assert.equal(serialized.includes("https://www.googleapis.com"), false);
  assert.equal(serialized.includes("send_email"), false);
  assert.equal(serialized.includes("publish_post"), false);
  assert.equal(serialized.includes("provider_write"), false);
  assert.equal(serialized.includes("crm_mutation"), false);
  assert.equal(serialized.includes("create_lead"), false);
});
