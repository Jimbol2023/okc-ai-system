import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import {
  assertConnectorSignalFoundationSafety,
  createConnectorSignalFoundationReportFromInputs,
  normalizeConnectorSnapshotsToSignals,
  routeConnectorSignalsToDepartments,
} from "@/lib/connector-signal-normalization";
import { readOnlyBusinessSafetyFlags, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

const generatedAt = "2026-07-09T16:00:00.000Z";

function snapshot(connectorId: string, category: string, status: string, summary: string, dataGaps: string[] = []): BusinessDataSnapshotRecord {
  return {
    snapshotDate: generatedAt,
    provider: "Google",
    connectorId,
    category,
    status,
    sourceLabel: `test:${connectorId}:${category}`,
    provenance: "test fixture",
    freshness: generatedAt,
    summary,
    metrics: { rawCount: 3 },
    records: [{ private: "must not flow" }],
    dataGaps,
    assumptions: [],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

test("connector snapshots normalize into safe business signals with source labels and freshness", () => {
  const signals = normalizeConnectorSnapshotsToSignals([
    snapshot("gmail", "gmail_inbox", "fresh", "Inbox metadata suggests a seller inquiry."),
    snapshot("google_search_console", "search_console_performance", "partial", "Search page has seller intent impressions."),
  ], generatedAt);

  assert.equal(signals.length, 2);
  assert.equal(signals[0].signalType, "inbound_lead_signal");
  assert.equal(signals[0].freshness, "fresh");
  assert.equal(signals[0].rawPayloadIncluded, false);
  assert.equal(JSON.stringify(signals).includes("must not flow"), false);
});

test("department routing assigns connector signals to AI employees", () => {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const signals = normalizeConnectorSnapshotsToSignals([
    snapshot("gmail", "gmail_inbox", "fresh", "Inbox metadata suggests a seller inquiry."),
    snapshot("google_analytics", "google_analytics_traffic", "partial", "Traffic conversion signal changed."),
  ], generatedAt);
  const routed = routeConnectorSignalsToDepartments(signals, workforce);

  assert.equal(routed[0].department, "Lead Generation");
  assert.ok(routed[0].aiEmployee);
  assert.equal(routed[1].department, "Marketing");
  assert.match(routed[0].approvalRequirement, /CEO approval/i);
});

test("daily work orders receive connector context and memory/KPI readiness remains non-persistent", () => {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const dailyLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt });
  const report = createConnectorSignalFoundationReportFromInputs({
    snapshots: [
      snapshot("gmail", "gmail_inbox", "fresh", "Inbox metadata suggests a seller inquiry."),
      snapshot("google_business_profile", "google_business_profile_performance", "data_gap", "GBP rate limited.", ["rate limit"]),
    ],
    workforce,
    dailyLoop,
    generatedAt,
  });

  assert.equal(assertConnectorSignalFoundationSafety(report), true);
  assert.ok(report.routedSignals.length >= 2);
  assert.ok(report.workOrderContexts.length > 0);
  assert.ok(report.memoryKpiReadiness.length > 0);
  assert.ok(report.memoryKpiReadiness.every((item) => item.persistenceAllowed === false));
  assert.equal(report.safety.memoryWritesAllowed, false);
  assert.equal(report.safety.kpiWritesAllowed, false);
  assert.equal(report.providerCalled, false);
});
