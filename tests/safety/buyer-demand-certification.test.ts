import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "@/app/api/company/buyer-demand-certification/route";
import {
  assertBuyerDemandCertificationSafety,
  createBuyerDemandCertificationPacket,
} from "@/lib/buyer-demand-certification";
import { createBuyerDemandOpportunityPrioritization, type BuyerDemandOpportunityPrioritizationV1 } from "@/lib/buyer-demand-opportunity-prioritization";
import { createCrossConnectorCertificationPacket } from "@/lib/cross-connector-certification";
import type { BuyerDemandSignals } from "@/lib/buyer-demand-types";
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

function prioritization(buyerDemandSignals: BuyerDemandSignals | null = {
  hotZips: [{ label: "73160", count: 8 }, { label: "73064", count: 5 }],
  hotPriceRanges: [{ label: "$100,000 - $180,000", count: 7 }],
  hotPropertyTypes: [{ label: "single family", count: 9 }],
  byBuyerTier: { A: 2, B: 3, C: 1, D: 0 },
}) {
  const certification = createCrossConnectorCertificationPacket({
    tenantId: "tenant-a",
    generatedAt: "2026-07-16T12:00:00.000Z",
    snapshots: [
      snapshot(),
      snapshot({ evidenceHash: "hash-ga4", provider: "Google Analytics", connectorId: "google_analytics", category: "google_analytics_traffic", sourceLabel: "ueip:ga4:readonly", summary: "GA4 traffic evidence is available.", metrics: { sessions: 42, activeUsers: 20, pageViews: 90, keyEvents: 3, topPages: 4 } }),
      snapshot({ evidenceHash: "hash-gbp-performance", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_performance", sourceLabel: "ueip:gbp:performance:readonly", summary: "GBP performance evidence is available.", metrics: { metricSeries: 2, callClicks: 5, directionRequests: 3 } }),
      snapshot({ evidenceHash: "hash-gbp-reviews", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_reviews", sourceLabel: "ueip:gbp:reviews:readonly", summary: "GBP review evidence is available.", metrics: { reviews: 6, reviewRows: 6 } }),
    ],
  });
  return createBuyerDemandOpportunityPrioritization({ tenantId: "tenant-a", certification, buyerDemandSignals, generatedAt: "2026-07-16T12:00:00.000Z" });
}

test("Sprint 27A complete prioritization returns certified CEO readiness", () => {
  const packet = createBuyerDemandCertificationPacket({ tenantId: "tenant-a", prioritization: prioritization(), generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(packet.schemaVersion, "buyer-demand-certification-v1");
  assert.equal(packet.certificationStatus, "certified");
  assert.ok(packet.priorityCount > 0);
  assert.ok(packet.topPriority);
  assert.ok(packet.demandAlignmentConfidence.average > 0);
  assert.ok(packet.sourceReferences.some((reference) => reference.includes("sprint-26a:cross-connector-certification")));
  assert.equal(packet.safetyProof.providerReadsPerformed, false);
  assert.equal(packet.safetyProof.crmMutationAllowed, false);
  assert.equal(packet.safetyProof.buyerMatchCreationAllowed, false);
  assert.doesNotThrow(() => assertBuyerDemandCertificationSafety(packet));
});

test("Sprint 27A missing buyer-demand evidence returns partial readiness", () => {
  const packet = createBuyerDemandCertificationPacket({ tenantId: "tenant-a", prioritization: prioritization(null), generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(packet.certificationStatus, "partial");
  assert.ok(packet.missingBuyerDemandEvidence.some((gap) => gap.includes("buyer-demand")));
  assert.equal(packet.providerCalled, false);
  assert.equal(packet.safetyProof.outreachAllowed, false);
});

test("Sprint 27A invalid or empty prioritization returns blocked readiness", () => {
  const invalid = createBuyerDemandCertificationPacket({ tenantId: "tenant-a", prioritization: { schemaVersion: "wrong-contract" }, generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(invalid.certificationStatus, "blocked");
  assert.ok(invalid.readinessFailures.some((failure) => failure.includes("contract")));

  const emptyReport = { ...prioritization(), priorities: [] } satisfies BuyerDemandOpportunityPrioritizationV1;
  const empty = createBuyerDemandCertificationPacket({ tenantId: "tenant-a", prioritization: emptyReport, generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(empty.certificationStatus, "blocked");
  assert.ok(empty.readinessFailures.some((failure) => failure.includes("at least one priority")));
});

test("Sprint 27A rejects cross-tenant certification input", () => {
  assert.throws(
    () => createBuyerDemandCertificationPacket({ tenantId: "tenant-b", prioritization: prioritization(), generatedAt: "2026-07-16T12:00:00.000Z" }),
    /cross_tenant/,
  );
});

test("Sprint 27A rejects unsafe payloads and execution drift", () => {
  const unsafeReport = {
    ...prioritization(),
    sourceReferences: ["https://www.googleapis.com/unsafe"],
  } satisfies BuyerDemandOpportunityPrioritizationV1;
  assert.throws(
    () => createBuyerDemandCertificationPacket({ tenantId: "tenant-a", prioritization: unsafeReport, generatedAt: "2026-07-16T12:00:00.000Z" }),
    /unsafe|exposed/,
  );
});

test("Sprint 27A API requires authentication and remains provider-call-free", async () => {
  const response = await GET(new Request("https://example.test/api/company/buyer-demand-certification"));
  assert.equal(response.status, 401);
  const body = await response.json() as Record<string, unknown>;
  assert.notEqual(body.ok, true);
});
