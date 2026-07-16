import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import {
  assertDepartmentOperatingSystemSafety,
  createDepartmentOperatingSystemReportFromInputs,
  departmentMissionStatuses,
} from "@/lib/department-operating-system";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";

const generatedAt = "2026-07-10T16:00:00.000Z";

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
    sourceLabel: `sprint-11:${input.connectorId}:${input.category}`,
    provenance: "Sprint 11 read-only test fixture",
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
        summary: "GA4 conversion trend is available as read-only context.",
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
  const intelligence = createMarketCustomerIntelligenceFoundationReportFromInputs({
    workforce,
    dailyLoop,
    connectorSignals,
    generatedAt,
  });

  return createDepartmentOperatingSystemReportFromInputs({ intelligence, generatedAt });
}

test("Sprint 10E department packets convert into deterministic Sprint 11 missions", () => {
  const operatingSystem = report();

  assert.equal(operatingSystem.ok, true);
  assert.equal(operatingSystem.sprint, "11");
  assert.equal(operatingSystem.missionInputContracts.length, 10);
  assert.equal(operatingSystem.missions.length, operatingSystem.missionInputContracts.length);
  assert.ok(operatingSystem.missions.every((mission) => mission.sourceLabel.startsWith("sprint-10e:")));
  assert.ok(operatingSystem.missions.every((mission) => departmentMissionStatuses.includes(mission.missionStatus)));
  assert.ok(operatingSystem.missions.every((mission) => mission.providerCalled === false));
  assert.doesNotThrow(() => assertDepartmentOperatingSystemSafety(operatingSystem));
});

test("mission queue priority is stable and explainable", () => {
  const operatingSystem = report();
  const scores = operatingSystem.missionQueue.map((item) => item.priorityScore);

  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  assert.deepEqual(operatingSystem.missionQueue.map((item) => item.rank), Array.from({ length: operatingSystem.missionQueue.length }, (_, index) => index + 1));
  assert.ok(operatingSystem.missionQueue.every((item) => /urgency, revenue relevance, confidence/i.test(item.priorityReason)));
  assert.ok(operatingSystem.missionQueue.every((item) => item.advisoryOnly));
});

test("cross-department dependencies never create execution paths", () => {
  const operatingSystem = report();

  assert.ok(operatingSystem.dependencies.length > 0);
  assert.ok(operatingSystem.dependencies.some((dependency) => dependency.toDepartment === "Operations" || dependency.toDepartment === "Approval / Safety"));
  assert.ok(operatingSystem.dependencies.every((dependency) => dependency.providerCalled === false));
  assert.ok(operatingSystem.dependencies.every((dependency) => dependency.liveExecutionAllowed === false));
  assert.ok(operatingSystem.dependencies.every((dependency) => dependency.externalWritesAllowed === false));
  assert.ok(operatingSystem.dependencies.every((dependency) => /do not|only|blocked/i.test(dependency.safeNextAction)));
});

test("executive mission review packets are advisory and cannot become approval-as-execution", () => {
  const operatingSystem = report();

  assert.ok(operatingSystem.executiveMissionReview.length > 0);
  assert.ok(operatingSystem.executiveMissionReview.length <= 5);
  assert.ok(operatingSystem.executiveMissionReview.every((packet) => packet.safeDecisionOptions.includes("review")));
  assert.ok(operatingSystem.executiveMissionReview.every((packet) => packet.approvalAsExecutionAllowed === false));
  assert.ok(operatingSystem.executiveMissionReview.every((packet) => packet.providerCalled === false));
  assert.ok(operatingSystem.safety.approvalAsExecutionAllowed === false);
});

test("department telemetry is read-only non-persistent and no mission authorizes external execution", () => {
  const operatingSystem = report();
  const serialized = JSON.stringify(operatingSystem);

  assert.equal(operatingSystem.telemetry.memoryPersistenceAllowed, false);
  assert.equal(operatingSystem.telemetry.kpiPersistenceAllowed, false);
  assert.equal(operatingSystem.telemetry.outcomePersistenceAllowed, false);
  assert.equal(operatingSystem.safety.autonomousWorkflowsAllowed, false);
  assert.equal(operatingSystem.safety.crmMutationAllowed, false);
  assert.equal(operatingSystem.safety.leadCreationAllowed, false);
  assert.equal(operatingSystem.safety.outreachAllowed, false);
  assert.equal(operatingSystem.safety.publishingAllowed, false);
  assert.equal(operatingSystem.safety.scrapingAllowed, false);
  assert.equal(serialized.includes("must not flow"), false);
  assert.equal(serialized.includes("https://www.googleapis.com"), false);
  assert.equal(serialized.includes("send_email"), false);
  assert.equal(serialized.includes("publish_post"), false);
  assert.equal(serialized.includes("crm_mutation"), false);
  assert.equal(serialized.includes("autonomous_work_order"), false);
});
