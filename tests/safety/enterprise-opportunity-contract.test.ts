import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import { createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import {
  assertEnterpriseOpportunityContractSafety,
  determineEnterpriseOpportunityStatus,
  enterpriseOpportunityStatuses,
  enterpriseOpportunityTypes,
} from "@/lib/enterprise-opportunity-contract";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";
import { createRevenueIntelligenceOpportunityEngineReportFromInputs } from "@/lib/revenue-intelligence-opportunity-engine";

const generatedAt = "2026-07-10T18:00:00.000Z";

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
    sourceLabel: `sprint-12f:${input.connectorId}:${input.category}`,
    provenance: "Sprint 12F read-only test fixture",
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

function report() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const dailyLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt });
  const connectorSignals = createConnectorSignalFoundationReportFromInputs({
    snapshots: [
      snapshot({
        connectorId: "google_analytics",
        category: "google_analytics_traffic",
        status: "partial",
        summary: "Marketing demand is visible as read-only context.",
      }),
      snapshot({
        connectorId: "google_search_console",
        category: "search_console_performance",
        status: "partial",
        summary: "Search intent data is visible as read-only context.",
      }),
      snapshot({
        connectorId: "google_business_profile",
        category: "google_business_profile_performance",
        status: "data_gap",
        summary: "GBP live read remains unavailable.",
        dataGaps: ["GBP read-only connector is not active."],
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

test("Sprint 12 opportunities map into the Enterprise Opportunity Contract", () => {
  const engine = report();

  assert.equal(engine.enterpriseOpportunities.length, engine.opportunities.length);
  assert.ok(engine.enterpriseOpportunities.every((opportunity) => opportunity.version === "enterprise-opportunity-v1"));
  assert.ok(engine.enterpriseOpportunities.every((opportunity) => opportunity.id.startsWith("enterprise-")));
  assert.ok(engine.enterpriseOpportunities.every((opportunity) => enterpriseOpportunityTypes.includes(opportunity.type)));
  assert.ok(engine.enterpriseOpportunities.every((opportunity) => enterpriseOpportunityStatuses.includes(opportunity.status)));
  assert.ok(engine.enterpriseOpportunities.every((opportunity) => opportunity.createdFrom.system === "sprint-12-revenue-intelligence"));
  assert.doesNotThrow(() => assertEnterpriseOpportunityContractSafety(engine.enterpriseOpportunities));
});

test("enterprise opportunity status defaults are deterministic", () => {
  assert.equal(determineEnterpriseOpportunityStatus({
    missingData: ["missing source"],
    dataCompleteness: 80,
    governanceRisk: 10,
    estimatedValue: 50,
    bottleneckSeverity: 10,
    priority: "medium",
  }), "needs_data");
  assert.equal(determineEnterpriseOpportunityStatus({
    missingData: [],
    dataCompleteness: 90,
    governanceRisk: 20,
    estimatedValue: 90,
    bottleneckSeverity: 10,
    priority: "high",
  }), "needs_ceo_review");
  assert.equal(determineEnterpriseOpportunityStatus({
    missingData: [],
    dataCompleteness: 70,
    governanceRisk: 70,
    estimatedValue: 40,
    bottleneckSeverity: 10,
    priority: "low",
  }), "under_review");
  assert.equal(determineEnterpriseOpportunityStatus({
    missingData: [],
    dataCompleteness: 90,
    governanceRisk: 90,
    estimatedValue: 40,
    bottleneckSeverity: 10,
    priority: "low",
  }), "blocked");
});

test("enterprise opportunities preserve governance flags across departments", () => {
  const opportunities = report().enterpriseOpportunities;

  assert.ok(opportunities.some((opportunity) => opportunity.sourceDepartment !== opportunity.ownerDepartment || opportunity.sourceDepartment === opportunity.ownerDepartment));
  assert.ok(opportunities.every((opportunity) => opportunity.governanceFlags.requiresHumanReview));
  assert.ok(opportunities.every((opportunity) => opportunity.governanceFlags.advisoryOnly));
  assert.ok(opportunities.every((opportunity) => opportunity.governanceFlags.providerCalled === false));
  assert.ok(opportunities.every((opportunity) => opportunity.governanceFlags.liveExecutionAllowed === false));
  assert.ok(opportunities.every((opportunity) => opportunity.governanceFlags.externalWritesAllowed === false));
  assert.ok(opportunities.every((opportunity) => opportunity.governanceFlags.approvalAsExecutionAllowed === false));
});

test("required approvals are descriptive and do not create execution authority", () => {
  const opportunities = report().enterpriseOpportunities;

  assert.ok(opportunities.every((opportunity) => opportunity.requiredApprovals.includes("Human opportunity review")));
  assert.ok(opportunities.some((opportunity) => opportunity.requiredApprovals.includes("Data completeness review") || opportunity.requiredApprovals.includes("CEO opportunity review")));
  assert.ok(opportunities.every((opportunity) => opportunity.recommendedActions.length > 0));
  assert.ok(opportunities.every((opportunity) => opportunity.nextInternalStep.length > 0));
  assert.ok(opportunities.every((opportunity) => opportunity.status !== "approved_for_internal_work"));
});

test("Enterprise Opportunity Contract cannot authorize external execution or leak provider details", () => {
  const opportunities = report().enterpriseOpportunities;
  const serialized = JSON.stringify(opportunities);

  assert.equal(serialized.includes("must not flow"), false);
  assert.equal(serialized.includes("https://www.googleapis.com"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("send_email"), false);
  assert.equal(serialized.includes("publish_post"), false);
  assert.equal(serialized.includes("provider_write"), false);
  assert.equal(serialized.includes("crm_mutation"), false);
  assert.equal(serialized.includes("create_lead"), false);
  assert.doesNotThrow(() => assertEnterpriseOpportunityContractSafety(opportunities));
});
