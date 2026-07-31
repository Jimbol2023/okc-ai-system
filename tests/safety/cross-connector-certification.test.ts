import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "@/app/api/company/cross-connector-certification/route";
import { createCrossConnectorCertificationPacket } from "@/lib/cross-connector-certification";
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
    sourceLabel: "ueip:gsc:readonly",
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
    snapshot({ evidenceHash: "hash-ga4", provider: "Google Analytics", connectorId: "google_analytics", category: "google_analytics_traffic", sourceLabel: "ueip:ga4:readonly", summary: "GA4 traffic evidence is available.", metrics: { sessions: 42, activeUsers: 20, pageViews: 90, keyEvents: 3, topPages: 4 } }),
    snapshot({ evidenceHash: "hash-gbp-performance", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_performance", sourceLabel: "ueip:gbp:performance:readonly", summary: "GBP performance evidence is available.", metrics: { metricSeries: 2, callClicks: 5, directionRequests: 3 } }),
    snapshot({ evidenceHash: "hash-gbp-reviews", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_reviews", sourceLabel: "ueip:gbp:reviews:readonly", summary: "GBP review evidence is available.", metrics: { reviews: 6, reviewRows: 6 } }),
  ];
}

test("Sprint 26A certification packet includes full chain hashes confidence gaps and safety proof", () => {
  const packet = createCrossConnectorCertificationPacket({ tenantId: "tenant-a", snapshots: completeSnapshots(), generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(packet.schemaVersion, "cross-connector-certification-v1");
  assert.equal(packet.certificationStatus, "certified");
  assert.equal(packet.evidenceChain.length, 5);
  assert.ok(packet.evidenceHashCount >= 4);
  assert.ok(packet.evidenceChain.every((stage) => stage.confidence >= 0));
  assert.equal(packet.readinessFailures.length, 0);
  assert.equal(packet.safetyProof.providerReadsPerformed, false);
  assert.equal(packet.safetyProof.crmMutationAllowed, false);
  assert.equal(packet.safetyProof.taskCreationAllowed, false);
  assert.equal(packet.safetyProof.approvalCreationAllowed, false);
});

test("Sprint 26A missing connector evidence returns partial readiness with data gaps", () => {
  const packet = createCrossConnectorCertificationPacket({ tenantId: "tenant-a", snapshots: [snapshot()], generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(packet.certificationStatus, "partial");
  assert.ok(packet.readinessFailures.some((failure) => failure.includes("GA4") || failure.includes("google_analytics")));
  assert.ok(packet.evidenceChain.some((stage) => stage.signalCount === 0));
  assert.equal(packet.providerCalled, false);
});

test("Sprint 26A blocks unsafe payloads secrets provider URLs and forbidden action phrases", () => {
  assert.throws(
    () => createCrossConnectorCertificationPacket({ tenantId: "tenant-a", snapshots: completeSnapshots().map((item, index) => index === 1 ? { ...item, summary: "unsafe https://www.googleapis.com provider_write" } : item) }),
    /unsafe provider|unsafe/,
  );
});

test("Sprint 26A API requires authentication and remains provider-call-free", async () => {
  const response = await GET(new Request("https://example.test/api/company/cross-connector-certification"));
  assert.equal(response.status, 401);
  const body = await response.json() as Record<string, unknown>;
  assert.notEqual(body.ok, true);
});
