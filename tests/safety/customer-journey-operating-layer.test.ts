import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import {
  assertCustomerJourneyOperatingLayerSafety,
  createCustomerJourneyOperatingLayerReportFromInputs,
  customerJourneyStages,
} from "@/lib/customer-journey-operating-layer";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import { createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import { enterpriseOpportunityGovernanceFlags, type EnterpriseOpportunity } from "@/lib/enterprise-opportunity-contract";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";
import { createRevenueIntelligenceOpportunityEngineReportFromInputs } from "@/lib/revenue-intelligence-opportunity-engine";

const generatedAt = "2026-07-10T19:00:00.000Z";

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
    sourceLabel: `sprint-13:${input.connectorId}:${input.category}`,
    provenance: "Sprint 13 read-only test fixture",
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

function revenueEngine() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const dailyLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt });
  const connectorSignals = createConnectorSignalFoundationReportFromInputs({
    snapshots: [
      snapshot({
        connectorId: "google_analytics",
        category: "google_analytics_traffic",
        status: "partial",
        summary: "Marketing journey demand is visible as read-only context.",
      }),
      snapshot({
        connectorId: "google_search_console",
        category: "search_console_performance",
        status: "partial",
        summary: "Seller search intent is visible as read-only context.",
      }),
      snapshot({
        connectorId: "google_business_profile",
        category: "google_business_profile_performance",
        status: "data_gap",
        summary: "GBP live journey data remains unavailable.",
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

function customerJourneyReport(extra: EnterpriseOpportunity[] = []) {
  const engine = revenueEngine();

  return createCustomerJourneyOperatingLayerReportFromInputs({
    enterpriseOpportunities: [...engine.enterpriseOpportunities, ...extra],
    generatedAt,
  });
}

function manualOpportunity(input: Partial<EnterpriseOpportunity> = {}): EnterpriseOpportunity {
  return {
    id: input.id ?? "enterprise-manual-closing-follow-up",
    version: "enterprise-opportunity-v1",
    sourceDepartment: input.sourceDepartment ?? "CRM",
    ownerDepartment: input.ownerDepartment ?? "CRM",
    type: input.type ?? "customer_journey",
    title: input.title ?? "Customer completed closing follow-up opportunity",
    estimatedValue: input.estimatedValue ?? 72,
    confidenceScore: input.confidenceScore ?? 75,
    priority: input.priority ?? "high",
    evidence: input.evidence ?? ["Customer completed closing but no follow-up opportunity exists."],
    missingData: input.missingData ?? [],
    recommendedActions: input.recommendedActions ?? ["Prepare internal follow-up review."],
    requiredApprovals: input.requiredApprovals ?? ["Human opportunity review"],
    status: input.status ?? "identified",
    nextInternalStep: input.nextInternalStep ?? "Prepare internal follow-up review.",
    sourceLabels: input.sourceLabels ?? ["manual:sprint-13-test"],
    createdFrom: input.createdFrom ?? {
      system: "manual-import",
      sourceId: "manual-closing-follow-up",
      sourceVersion: "test-v1",
    },
    governanceFlags: input.governanceFlags ?? enterpriseOpportunityGovernanceFlags,
  };
}

test("only valid enterprise-opportunity-v1 inputs become journeys", () => {
  const invalid = {
    ...manualOpportunity({ id: "bad-opportunity" }),
    version: "legacy-opportunity",
  } as unknown as EnterpriseOpportunity;
  const report = customerJourneyReport([invalid]);

  assert.equal(report.ok, true);
  assert.equal(report.sprint, "13");
  assert.ok(report.intakeGate.some((item) => item.opportunityId === "bad-opportunity" && !item.accepted && item.classification === "blocked"));
  assert.equal(report.journeys.some((journey) => journey.sourceOpportunityIds.includes("bad-opportunity")), false);
  assert.doesNotThrow(() => assertCustomerJourneyOperatingLayerSafety(report));
});

test("every Enterprise Opportunity maps to a journey stage not-customer-facing classification or coverage gap", () => {
  const notCustomerFacing = manualOpportunity({
    id: "enterprise-compliance-review",
    type: "compliance",
    title: "Internal compliance opportunity",
  });
  const report = customerJourneyReport([notCustomerFacing]);

  assert.equal(report.stageMappings.length, report.intakeGate.length);
  assert.ok(report.stageMappings.every((mapping) => ["mapped_to_journey", "not_customer_facing", "coverage_gap", "blocked"].includes(mapping.classification)));
  assert.ok(report.stageMappings.filter((mapping) => mapping.classification === "mapped_to_journey").every((mapping) => mapping.stages.every((stage) => customerJourneyStages.includes(stage))));
  assert.ok(report.stageMappings.some((mapping) => mapping.opportunityId === "enterprise-compliance-review" && mapping.classification === "not_customer_facing"));
});

test("journey state mapping is deterministic and includes advanced lifecycle stages", () => {
  const referral = manualOpportunity({
    id: "enterprise-referral-opportunity",
    type: "marketing",
    title: "Referral opportunity identified",
    evidence: ["Referral opportunity identified."],
    recommendedActions: ["Prepare internal referral review."],
  });
  const first = customerJourneyReport([manualOpportunity(), referral]);
  const second = customerJourneyReport([manualOpportunity(), referral]);

  assert.deepEqual(first.stageMappings, second.stageMappings);
  assert.ok(first.journeys.some((journey) => journey.currentStage === "follow_up_opportunity"));
  assert.ok(first.journeys.some((journey) => journey.currentStage === "referral_opportunity"));
});

test("department ownership is stable and explainable", () => {
  const report = customerJourneyReport();

  assert.ok(report.departmentResponsibilityMatrix.length > 0);
  assert.ok(report.departmentResponsibilityMatrix.every((item) => item.ownerDepartment));
  assert.ok(report.departmentResponsibilityMatrix.every((item) => item.responsibilityReason.includes(item.ownerDepartment)));
  assert.ok(report.departmentResponsibilityMatrix.every((item) => item.advisoryOnly));
  assert.ok(report.funnelIntelligence.departmentOwnership.length > 0);
});

test("advisory touchpoint plans never create outreach CRM writes leads providers publishing scraping persistence or execution", () => {
  const report = customerJourneyReport([manualOpportunity()]);
  const serialized = JSON.stringify(report);

  assert.ok(report.advisoryTouchpointPlans.length > 0);
  assert.ok(report.advisoryTouchpointPlans.every((plan) => plan.internalOnly));
  assert.ok(report.advisoryTouchpointPlans.every((plan) => plan.sendAllowed === false));
  assert.ok(report.advisoryTouchpointPlans.every((plan) => plan.crmWriteAllowed === false));
  assert.ok(report.advisoryTouchpointPlans.every((plan) => plan.leadCreationAllowed === false));
  assert.ok(report.advisoryTouchpointPlans.every((plan) => plan.providerCalled === false));
  assert.equal(serialized.includes("must not flow"), false);
  assert.equal(serialized.includes("https://www.googleapis.com"), false);
  assert.equal(serialized.includes("send_email"), false);
  assert.equal(serialized.includes("publish_post"), false);
  assert.equal(serialized.includes("crm_mutation"), false);
  assert.equal(serialized.includes("create_lead"), false);
});

test("funnel intelligence surfaces progression drop-offs bottlenecks coverage and ownership", () => {
  const report = customerJourneyReport();

  assert.ok(report.funnelIntelligence.progression.length > 0);
  assert.ok(Array.isArray(report.funnelIntelligence.dropOffPoints));
  assert.ok(Array.isArray(report.funnelIntelligence.bottlenecks));
  assert.ok(Array.isArray(report.funnelIntelligence.missingDataPatterns));
  assert.equal(report.funnelIntelligence.opportunityCoverage.totalOpportunities, report.intakeGate.length);
  assert.ok(report.funnelIntelligence.opportunityCoverage.mappedToJourney > 0);
  assert.ok(report.funnelIntelligence.departmentOwnership.length > 0);
});

test("executive customer journey brief remains CEO-facing and advisory only", () => {
  const report = customerJourneyReport([manualOpportunity()]);
  const brief = report.executiveCustomerJourneyBrief;

  assert.equal(brief.briefVersion, "sprint-13g-v1");
  assert.ok(brief.journeysThatMatterToday.length > 0);
  assert.ok(Array.isArray(brief.stalledJourneys));
  assert.ok(Array.isArray(brief.opportunitiesWithoutJourneyCoverage));
  assert.ok(brief.followUpOrReferralOpportunities.length > 0);
  assert.ok(brief.departmentsOwningNextSteps.length > 0);
  assert.equal(brief.requiresHumanReview, true);
  assert.equal(brief.advisoryOnly, true);
  assert.equal(brief.providerCalled, false);
  assert.equal(brief.approvalAsExecutionAllowed, false);
});

test("journey telemetry is read-only and non-persistent", () => {
  const report = customerJourneyReport();

  assert.equal(report.telemetry.telemetryVersion, "sprint-13h-v1");
  assert.equal(report.telemetry.journeyVolume, report.journeys.length);
  assert.ok(report.telemetry.stageDistribution.length > 0);
  assert.ok(report.telemetry.averageTimeInStageLabels.every((label) => /not persisted/i.test(label)));
  assert.equal(report.telemetry.memoryPersistenceAllowed, false);
  assert.equal(report.telemetry.kpiPersistenceAllowed, false);
  assert.equal(report.telemetry.providerCalled, false);
  assert.equal(report.telemetry.liveExecutionAllowed, false);
  assert.doesNotThrow(() => assertCustomerJourneyOperatingLayerSafety(report));
});
