import assert from "node:assert/strict";
import test from "node:test";
import { executeSearchConsoleRead, UeipSearchConsoleAdapterError } from "../../lib/ueip-search-console-adapter";
import { createSearchMarketIntelligencePacket, createSearchMarketObservationWindows, evaluateSearchMarketMateriality } from "../../lib/search-market-intelligence";
import { readOnlyBusinessSafetyFlags, type BusinessDataSnapshotRecord } from "../../lib/read-only-business-connections";

function snapshot(overrides: Partial<BusinessDataSnapshotRecord> = {}): BusinessDataSnapshotRecord {
  return { tenantId: "tenant-a", version: 1, contractVersion: "business-data-snapshot-v1", evidenceHash: "hash-a", snapshotDate: "2026-07-12T00:00:00.000Z", provider: "Google", connectorId: "google_search_console", category: "search_console_performance", status: "fresh", sourceLabel: "ueip:gsc:test", provenance: "Normalized fake adapter evidence.", freshness: "2026-07-12T00:00:00.000Z", summary: "A verified search observation is available.", metrics: { impressions: 100, clicks: 5 }, records: [{ dimension: "seller question" }], dataGaps: [], assumptions: [], safetyFlags: readOnlyBusinessSafetyFlags, providerCalled: false, sent: false, published: false, crmMutated: false, liveExecutionAllowed: false, ...overrides };
}

test("default Search Console windows use complete bounded 28-day cohorts", () => {
  assert.deepEqual(createSearchMarketObservationWindows(new Date("2026-07-15T12:00:00.000Z")), { current: { startDate: "2026-06-15", endDate: "2026-07-12" }, comparison: { startDate: "2026-05-18", endDate: "2026-06-14" } });
});

test("materiality requires state, cohort, or bounded metric movement", () => {
  assert.equal(evaluateSearchMarketMateriality([snapshot()], []).material, true);
  assert.equal(evaluateSearchMarketMateriality([snapshot()], [snapshot()]).material, false);
  const changed = evaluateSearchMarketMateriality([snapshot({ metrics: { impressions: 130, clicks: 8 } })], [snapshot()]);
  assert.equal(changed.material, true);
  assert.ok(changed.reasons.includes("impressions_material_change"));
  assert.ok(changed.reasons.includes("clicks_material_change"));
});

test("packet assembly rejects cross-tenant evidence and performs no provider or external action", () => {
  assert.throws(() => createSearchMarketIntelligencePacket({ tenantId: "tenant-a", packetKind: "monday", snapshots: [snapshot({ tenantId: "tenant-b" })] }), /cross_tenant_search_evidence_blocked/);
  const packet = createSearchMarketIntelligencePacket({ tenantId: "tenant-a", packetKind: "monday", snapshots: [snapshot()], now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(packet.deliverables.length, 6);
  assert.equal(packet.topCeoDecisions.length, 1);
  assert.ok(packet.dataGaps.some((gap) => gap.includes("GA4")));
  assert.ok(packet.dataGaps.some((gap) => gap.includes("Business Profile")));
  assert.equal(packet.providerCalledByAssembly, false);
  assert.equal(packet.externalWritesAllowed, false);
  assert.equal(packet.liveExecutionAllowed, false);
});

test("Search Console query read validates dates before calling provider", async () => {
  let called = false;
  await assert.rejects(() => executeSearchConsoleRead({ request: { capability: "seo.query.performance.read", siteUrl: "https://example.com/" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => { called = true; return new Response(); }, now: new Date("2026-07-15T12:00:00.000Z") }), (error: unknown) => error instanceof UeipSearchConsoleAdapterError && error.category === "invalid_request" && !error.providerAttempted);
  assert.equal(called, false);
});

test("Search Console query read returns bounded normalized query evidence", async () => {
  const responses = [new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }), new Response(JSON.stringify({ rows: [{ keys: ["sell inherited house"], clicks: 3, impressions: 40, ctr: 0.075, position: 7 }] }), { status: 200, headers: { "content-type": "application/json" } })];
  const result = await executeSearchConsoleRead({ request: { capability: "seo.query.performance.read", siteUrl: "sc-domain:example.com", startDate: "2026-06-15", endDate: "2026-07-12", rowLimit: 10 }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => responses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(result.capability, "seo.query.performance.read");
  assert.equal((result.signals.queries as unknown[]).length, 1);
  assert.equal(result.reliability.attempts, 1);
});
