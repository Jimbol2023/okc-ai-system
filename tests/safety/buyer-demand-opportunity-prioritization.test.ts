import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "@/app/api/company/buyer-demand-prioritization/route";
import {
  assertBuyerDemandOpportunityPrioritizationSafety,
  createBuyerDemandOpportunityPrioritization,
} from "@/lib/buyer-demand-opportunity-prioritization";
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

function certification() {
  return createCrossConnectorCertificationPacket({
    tenantId: "tenant-a",
    generatedAt: "2026-07-16T12:00:00.000Z",
    snapshots: [
      snapshot(),
      snapshot({ evidenceHash: "hash-ga4", provider: "Google Analytics", connectorId: "google_analytics", category: "google_analytics_traffic", sourceLabel: "ueip:ga4:readonly", summary: "GA4 traffic evidence is available.", metrics: { sessions: 42, activeUsers: 20, pageViews: 90, keyEvents: 3, topPages: 4 } }),
      snapshot({ evidenceHash: "hash-gbp-performance", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_performance", sourceLabel: "ueip:gbp:performance:readonly", summary: "GBP performance evidence is available.", metrics: { metricSeries: 2, callClicks: 5, directionRequests: 3 } }),
      snapshot({ evidenceHash: "hash-gbp-reviews", provider: "Google Business Profile", connectorId: "google_business_profile", category: "google_business_profile_reviews", sourceLabel: "ueip:gbp:reviews:readonly", summary: "GBP review evidence is available.", metrics: { reviews: 6, reviewRows: 6 } }),
    ],
  });
}

const buyerDemandSignals: BuyerDemandSignals = {
  hotZips: [{ label: "73160", count: 8 }, { label: "73064", count: 5 }],
  hotPriceRanges: [{ label: "$100,000 - $180,000", count: 7 }],
  hotPropertyTypes: [{ label: "single family", count: 9 }],
  byBuyerTier: { A: 2, B: 3, C: 1, D: 0 },
};

test("Sprint 27 combines certified cross-connector context with internal buyer-demand signals", () => {
  const report = createBuyerDemandOpportunityPrioritization({ tenantId: "tenant-a", certification: certification(), buyerDemandSignals, generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.equal(report.schemaVersion, "buyer-demand-opportunity-prioritization-v1");
  assert.equal(report.certificationStatus, "certified");
  assert.ok(report.priorities.some((priority) => priority.category === "page_content_opportunity"));
  assert.ok(report.priorities.some((priority) => priority.category === "buyer_fit_opportunity"));
  assert.ok(report.sourceReferences.some((reference) => reference.includes("buyer-demand:zip:73160")));
  assert.ok(report.priorities.every((priority) => priority.advisoryOnly && priority.requiresHumanReview));
  assert.doesNotThrow(() => assertBuyerDemandOpportunityPrioritizationSafety(report));
});

test("Sprint 27 missing buyer-demand evidence becomes a data-gap opportunity", () => {
  const report = createBuyerDemandOpportunityPrioritization({ tenantId: "tenant-a", certification: certification(), buyerDemandSignals: null, generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.ok(report.dataGaps.some((gap) => gap.includes("buyer-demand")));
  assert.ok(report.priorities.some((priority) => priority.category === "demand_data_gap_opportunity"));
  assert.equal(report.safety.providerCalled, false);
  assert.equal(report.safety.externalApiAllowed, false);
  assert.equal(report.safety.buyerContactAllowed, false);
});

test("Sprint 27 scores are deterministic explainable and manual-review-only", () => {
  const first = createBuyerDemandOpportunityPrioritization({ tenantId: "tenant-a", certification: certification(), buyerDemandSignals, generatedAt: "2026-07-16T12:00:00.000Z" });
  const second = createBuyerDemandOpportunityPrioritization({ tenantId: "tenant-a", certification: certification(), buyerDemandSignals, generatedAt: "2026-07-16T12:00:00.000Z" });
  assert.deepEqual(first.priorities.map((priority) => priority.score), second.priorities.map((priority) => priority.score));
  assert.ok(first.priorities.every((priority) => priority.scoreExplanation.includes("cross-connector confidence")));
  assert.ok(first.priorities.every((priority) => priority.providerCalled === false && priority.liveExecutionAllowed === false));
});

test("Sprint 27 blocks unsafe payloads and execution drift", () => {
  const report = createBuyerDemandOpportunityPrioritization({ tenantId: "tenant-a", certification: certification(), buyerDemandSignals, generatedAt: "2026-07-16T12:00:00.000Z" });
  const serialized = JSON.stringify(report);
  assert.equal(serialized.includes("create_lead"), false);
  assert.equal(serialized.includes("provider_write"), false);
  assert.equal(serialized.includes("deal_blast"), false);
  assert.equal(serialized.includes("buyer_contact"), false);
  assert.equal(report.safety.crmMutationAllowed, false);
  assert.equal(report.safety.matchCreationAllowed, false);
  assert.equal(report.safety.campaignAllowed, false);
});

test("Sprint 27 API requires authentication", async () => {
  const response = await GET(new Request("https://example.test/api/company/buyer-demand-prioritization"));
  assert.equal(response.status, 401);
});
