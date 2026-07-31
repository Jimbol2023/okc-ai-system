import assert from "node:assert/strict";
import test from "node:test";

import { createCrossConnectorIntelligenceReport } from "@/lib/cross-connector-intelligence";
import { readOnlyBusinessSafetyFlags, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

function snapshot(overrides: Partial<BusinessDataSnapshotRecord> = {}): BusinessDataSnapshotRecord {
  return {
    tenantId: "tenant-a",
    version: 1,
    contractVersion: "business-data-snapshot-v1",
    evidenceHash: "hash-search-console",
    snapshotDate: "2026-07-15T00:00:00.000Z",
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_performance",
    status: "fresh",
    sourceLabel: "ueip:gsc:search_analytics:readonly",
    provenance: "Normalized connector evidence.",
    freshness: "2026-07-15T00:00:00.000Z",
    summary: "Search evidence is available.",
    metrics: { impressions: 100, clicks: 8 },
    records: [{ query: "sell inherited house okc", clicks: 4 }],
    dataGaps: [],
    assumptions: [],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    ...overrides,
  };
}

function completeSnapshots() {
  return [
    snapshot(),
    snapshot({ evidenceHash: "hash-ga4", provider: "Google Analytics", connectorId: "google_analytics", category: "google_analytics_traffic", sourceLabel: "ueip:ga4:page_performance:readonly", summary: "GA4 traffic evidence is available.", metrics: { sessions: 42, activeUsers: 20, pageViews: 90, keyEvents: 3, topPages: 4 }, records: [{ page: "/moore", sessions: 12 }] }),
    snapshot({ evidenceHash: "hash-gbp-performance", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_performance", sourceLabel: "ueip:gbp:performance:readonly", summary: "GBP performance evidence is available.", metrics: { metricSeries: 2, callClicks: 5, directionRequests: 3 }, records: [{ metric: "callClicks", total: 5 }] }),
    snapshot({ evidenceHash: "hash-gbp-reviews", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_reviews", sourceLabel: "ueip:gbp:reviews:readonly", summary: "GBP review evidence is available.", metrics: { reviews: 6, reviewRows: 6 }, records: [{ reviewId: "r1", starRating: "FIVE" }] }),
  ];
}

test("Sprint 26 combines Search Console GA4 and GBP into an advisory funnel chain", () => {
  const report = createCrossConnectorIntelligenceReport({ tenantId: "tenant-a", snapshots: completeSnapshots(), generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(report.schemaVersion, "cross-connector-intelligence-v1");
  assert.equal(report.foundUsSignals.length, 1);
  assert.equal(report.visitedPageSignals.length, 1);
  assert.equal(report.engagementSignals.length, 1);
  assert.equal(report.exitOrDropoffSignals.length, 1);
  assert.equal(report.localTrustSignals.length, 2);
  assert.ok(report.highestBusinessOpportunities.some((opportunity) => opportunity.title.includes("search demand")));
  assert.ok(report.highestBusinessOpportunities.every((opportunity) => opportunity.advisoryOnly && opportunity.requiresHumanReview));
  assert.equal(report.providerCalled, false);
  assert.equal(report.safety.crmMutationAllowed, false);
  assert.equal(report.safety.outreachAllowed, false);
  assert.equal(report.safety.publishingAllowed, false);
  assert.equal(report.safety.taskCreationAllowed, false);
  assert.equal(report.safety.approvalsCreationAllowed, false);
});

test("Sprint 26 missing connector evidence becomes data gaps without authorizing reads or actions", () => {
  const report = createCrossConnectorIntelligenceReport({ tenantId: "tenant-a", snapshots: [snapshot()], generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.ok(report.dataGaps.some((gap) => gap.includes("google_analytics_traffic")));
  assert.ok(report.dataGaps.some((gap) => gap.includes("google_business_profile_performance")));
  assert.ok(report.highestBusinessOpportunities.some((opportunity) => opportunity.opportunityType === "data_quality_opportunity"));
  assert.equal(report.safety.providerCalled, false);
  assert.equal(report.safety.automationAllowed, false);
});

test("Sprint 26 rejects cross-tenant and invalid evidence contracts", () => {
  assert.throws(() => createCrossConnectorIntelligenceReport({ tenantId: "tenant-a", snapshots: completeSnapshots().map((item, index) => index === 0 ? { ...item, tenantId: "tenant-b" } : item) }), /cross_tenant/);
  assert.throws(() => createCrossConnectorIntelligenceReport({ tenantId: "tenant-a", snapshots: completeSnapshots().map((item, index) => index === 0 ? { ...item, evidenceHash: "" } : item) }), /contract_invalid/);
});

test("Sprint 26 blocks raw payloads secrets provider URLs and forbidden action phrases", () => {
  assert.throws(
    () => createCrossConnectorIntelligenceReport({ tenantId: "tenant-a", snapshots: completeSnapshots().map((item, index) => index === 1 ? { ...item, summary: "raw https://www.googleapis.com payload and provider_write instruction" } : item) }),
    /unsafe provider/,
  );
});
