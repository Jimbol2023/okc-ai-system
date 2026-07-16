import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { listEnterpriseConnectors } from "@/lib/connector-platform";
import { createCustomerJourneyOperatingLayerReportFromInputs } from "@/lib/customer-journey-operating-layer";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import { createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import {
  assertExecutiveIntelligencePlatformSafety,
  createExecutiveIntelligencePlatformReportFromInputs,
  executiveDecisionBoundaryClassifications,
  executiveDecisionQueueStatuses,
} from "@/lib/executive-intelligence-platform";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";
import { createRevenueIntelligenceOpportunityEngineReportFromInputs } from "@/lib/revenue-intelligence-opportunity-engine";

const generatedAt = "2026-07-10T20:00:00.000Z";

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
    sourceLabel: `sprint-14:${input.connectorId}:${input.category}`,
    provenance: "Sprint 14 read-only test fixture",
    freshness: generatedAt,
    summary: input.summary,
    metrics: { authorization: "must not flow" },
    records: [{ endpoint: "must not flow" }],
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

function executiveReport() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const dailyRevenueLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt });
  const connectorSignals = createConnectorSignalFoundationReportFromInputs({
    snapshots: [
      snapshot({
        connectorId: "google_analytics",
        category: "google_analytics_traffic",
        status: "partial",
        summary: "GA4 marketing performance is available as read-only executive context.",
      }),
      snapshot({
        connectorId: "google_search_console",
        category: "search_console_performance",
        status: "partial",
        summary: "Search Console seller-intent data is available as read-only executive context.",
      }),
      snapshot({
        connectorId: "google_business_profile",
        category: "google_business_profile_performance",
        status: "data_gap",
        summary: "GBP local trust signals remain a connector data gap.",
        dataGaps: ["GBP live read remains unauthorized."],
      }),
    ],
    workforce,
    dailyLoop: dailyRevenueLoop,
    generatedAt,
  });
  const marketCustomerIntelligence = createMarketCustomerIntelligenceFoundationReportFromInputs({
    workforce,
    dailyLoop: dailyRevenueLoop,
    connectorSignals,
    generatedAt,
  });
  const departmentOperatingSystem = createDepartmentOperatingSystemReportFromInputs({
    intelligence: marketCustomerIntelligence,
    generatedAt,
  });
  const revenueIntelligence = createRevenueIntelligenceOpportunityEngineReportFromInputs({
    departmentOperatingSystem,
    marketCustomerIntelligence,
    generatedAt,
  });
  const customerJourney = createCustomerJourneyOperatingLayerReportFromInputs({
    enterpriseOpportunities: revenueIntelligence.enterpriseOpportunities,
    generatedAt,
  });

  return createExecutiveIntelligencePlatformReportFromInputs({
    revenueIntelligence,
    customerJourney,
    departmentOperatingSystem,
    marketCustomerIntelligence,
    dailyRevenueLoop,
    connectors: listEnterpriseConnectors(),
    generatedAt,
  });
}

test("Sprint 14 aggregates upstream advisory signals into one executive intelligence packet", () => {
  const report = executiveReport();

  assert.equal(report.ok, true);
  assert.equal(report.sprint, "14");
  assert.equal(report.executiveIntelligencePacket.executiveQuestion, "CEO, what are today's highest-impact decisions?");
  assert.ok(report.executiveIntelligencePacket.sourceTraceability.includes("sprint-12:revenue-intelligence"));
  assert.ok(report.executiveIntelligencePacket.sourceTraceability.includes("sprint-13:customer-journey"));
  assert.ok(report.executiveIntelligencePacket.topRevenueOpportunities.length > 0);
  assert.ok(report.executiveIntelligencePacket.topCustomerJourneys.length > 0);
  assert.doesNotThrow(() => assertExecutiveIntelligencePlatformSafety(report));
});

test("every recommendation receives a decision-boundary classification", () => {
  const report = executiveReport();

  assert.ok(report.decisionRecommendations.length > 0);
  assert.equal(report.decisionBoundaryGate.length, report.decisionRecommendations.length);
  assert.ok(report.decisionBoundaryGate.every((item) => executiveDecisionBoundaryClassifications.includes(item.classification)));
  assert.ok(report.decisionBoundaryGate.every((item) => item.advisoryOnly));
  assert.ok(report.decisionBoundaryGate.every((item) => item.providerCalled === false));
});

test("connector capability intelligence is read-only and cannot activate providers", () => {
  const report = executiveReport();
  const connectors = report.connectorCapabilityIntelligence;
  const serialized = JSON.stringify(connectors);

  assert.ok(connectors.length > 0);
  assert.ok(connectors.some((item) => item.connectorId === "google_analytics" || item.connectorId === "google_search_console"));
  assert.ok(connectors.every((item) => item.connectorActivationAllowed === false));
  assert.ok(connectors.every((item) => item.providerCalled === false));
  assert.ok(connectors.every((item) => item.liveExecutionAllowed === false));
  assert.equal(serialized.includes("https://www.googleapis.com"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("must not flow"), false);
});

test("CEO briefing includes opportunities journey risks KPIs missing data connector gaps evidence and required decisions", () => {
  const report = executiveReport();
  const briefing = report.ceoBriefing;

  assert.equal(briefing.briefingVersion, "sprint-14c-v1");
  assert.ok(briefing.executiveSummary.includes("highest-impact") || briefing.executiveSummary.includes("CEO decisions"));
  assert.ok(briefing.revenueOpportunities.length > 0);
  assert.ok(Array.isArray(briefing.customerJourneyRisks));
  assert.ok(Array.isArray(briefing.departmentPerformance));
  assert.ok(Array.isArray(briefing.requiredCeoDecisions));
  assert.ok(Array.isArray(briefing.evidence));
  assert.ok(Array.isArray(briefing.missingData));
  assert.ok(Array.isArray(briefing.connectorDataGaps));
  assert.equal(briefing.advisoryOnly, true);
  assert.equal(report.executiveKpis.kpiVersion, "sprint-14d-v1");
});

test("priority ranking is deterministic and explainable", () => {
  const first = executiveReport().priorityQueue;
  const second = executiveReport().priorityQueue;

  assert.deepEqual(first, second);
  assert.deepEqual(first.map((item) => item.rank), Array.from({ length: first.length }, (_, index) => index + 1));
  assert.deepEqual(first.map((item) => item.totalScore), first.map((item) => item.totalScore).sort((a, b) => b - a));
  assert.ok(first.every((item) => item.explanation.includes("Score")));
});

test("decision queue statuses remain advisory and auditable", () => {
  const report = executiveReport();

  assert.equal(report.executiveDecisionQueue.length, report.decisionRecommendations.length);
  assert.ok(report.executiveDecisionQueue.every((item) => executiveDecisionQueueStatuses.includes(item.status)));
  assert.ok(report.executiveDecisionQueue.every((item) => item.auditLabel === "advisory_decision_queue_no_execution"));
  assert.ok(report.executiveDecisionQueue.every((item) => item.executionRecordCreated === false));
  assert.ok(report.executiveDecisionQueue.every((item) => item.providerCalled === false));
});

test("department directive drafts do not create tasks approvals CRM writes providers or outreach", () => {
  const report = executiveReport();

  assert.ok(report.departmentDirectiveDrafts.length > 0);
  assert.ok(report.departmentDirectiveDrafts.every((item) => item.directive.includes(item.department)));
  assert.ok(report.departmentDirectiveDrafts.every((item) => item.taskCreated === false));
  assert.ok(report.departmentDirectiveDrafts.every((item) => item.approvalCreated === false));
  assert.ok(report.departmentDirectiveDrafts.every((item) => item.crmWriteAllowed === false));
  assert.ok(report.departmentDirectiveDrafts.every((item) => item.providerCalled === false));
});

test("dashboard API visibility model exposes no execution controls", () => {
  const report = executiveReport();
  const serialized = JSON.stringify(report);

  assert.equal(report.safety.connectorActivationAllowed, false);
  assert.equal(report.safety.approvalAsExecutionAllowed, false);
  assert.equal(report.safety.crmMutationAllowed, false);
  assert.equal(report.safety.outreachAllowed, false);
  assert.equal(serialized.includes("send_email"), false);
  assert.equal(serialized.includes("publish_post"), false);
  assert.equal(serialized.includes("crm_mutation"), false);
  assert.equal(serialized.includes("create_lead"), false);
  assert.equal(serialized.includes("provider_write"), false);
});

test("executive telemetry is read-only and non-persistent", () => {
  const report = executiveReport();
  const telemetry = report.telemetry;

  assert.equal(telemetry.telemetryVersion, "sprint-14k-v1");
  assert.equal(telemetry.ceoAttentionItems, report.decisionRecommendations.length);
  assert.ok(telemetry.decisionCategories.length > 0);
  assert.ok(Array.isArray(telemetry.departmentsNeedingReview));
  assert.equal(telemetry.memoryPersistenceAllowed, false);
  assert.equal(telemetry.kpiPersistenceAllowed, false);
  assert.equal(telemetry.providerCalled, false);
  assert.equal(telemetry.liveExecutionAllowed, false);
  assert.doesNotThrow(() => assertExecutiveIntelligencePlatformSafety(report));
});
