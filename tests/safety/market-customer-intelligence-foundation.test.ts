import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";
import {
  assertMarketCustomerIntelligenceFoundationSafety,
  createMarketCustomerIntelligenceFoundationReportFromInputs,
  marketCustomerIntelligenceObjectTypes,
} from "@/lib/market-customer-intelligence-foundation";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";

const generatedAt = "2026-07-10T14:00:00.000Z";

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
    sourceLabel: `sprint-10e:${input.connectorId}:${input.category}`,
    provenance: "Sprint 10E read-only test fixture",
    freshness: generatedAt,
    summary: input.summary,
    metrics: { privateMetric: "must not flow" },
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
        summary: "GA4 conversion trend is available as a read-only snapshot.",
      }),
      snapshot({
        connectorId: "google_search_console",
        category: "search_console_performance",
        status: "data_gap",
        summary: "Search Console performance is missing live data.",
        dataGaps: ["Search Console live read is not approved."],
      }),
      snapshot({
        connectorId: "google_business_profile",
        category: "google_business_profile_performance",
        status: "data_gap",
        summary: "GBP performance is not configured for live reads.",
        dataGaps: ["GBP live read is not approved."],
      }),
    ],
    workforce,
    dailyLoop,
    generatedAt,
  });

  return createMarketCustomerIntelligenceFoundationReportFromInputs({
    workforce,
    dailyLoop,
    connectorSignals,
    generatedAt,
  });
}

test("Sprint 10E creates reusable advisory intelligence objects with governance flags", () => {
  const foundation = report();

  assert.equal(foundation.ok, true);
  assert.equal(foundation.sprint, "10E");
  assert.equal(foundation.safety.readOnly, true);
  assert.equal(foundation.safety.advisoryOnly, true);
  assert.equal(foundation.providerCalled, false);
  assert.equal(foundation.liveExecutionAllowed, false);
  assert.ok(foundation.intelligenceObjects.length > 0);
  assert.ok(foundation.intelligenceObjects.every((object) => object.advisoryOnly));
  assert.ok(foundation.intelligenceObjects.every((object) => object.requiresHumanReview));
  assert.ok(foundation.intelligenceObjects.every((object) => object.providerCalled === false));
  assert.ok(foundation.intelligenceObjects.every((object) => marketCustomerIntelligenceObjectTypes.includes(object.objectType)));
  assert.doesNotThrow(() => assertMarketCustomerIntelligenceFoundationSafety(foundation));
});

test("missing GA4 Search Console GBP or CRM data becomes safe data-gap intelligence", () => {
  const foundation = report();
  const dataGapObjects = foundation.intelligenceObjects.filter((object) => object.freshness === "data_gap");

  assert.ok(dataGapObjects.length >= 2);
  assert.ok(dataGapObjects.some((object) => object.sourceLabel.includes("google_search_console")));
  assert.ok(dataGapObjects.some((object) => object.sourceLabel.includes("google_business_profile")));
  assert.ok(foundation.missingDataRegister.length >= 2);
  assert.ok(foundation.missingDataRegister.every((item) => /do not activate providers/i.test(item.safeResolution)));
  assert.equal(foundation.safety.connectorActivationAllowed, false);
  assert.equal(foundation.safety.crmMutationAllowed, false);
});

test("department packets are deterministic and Sprint 11 ready", () => {
  const foundation = report();
  const departments = foundation.departmentPackets.map((packet) => packet.department);

  assert.deepEqual(departments, [
    "CEO Office",
    "AI COO",
    "Lead Generation",
    "Seller Acquisition",
    "SEO",
    "Marketing",
    "Content",
    "Operations",
    "Knowledge / Memory",
    "Approval / Safety",
  ]);
  assert.ok(foundation.departmentPackets.every((packet) => packet.packetType === "department_intelligence_packet"));
  assert.ok(foundation.departmentPackets.every((packet) => /Sprint 10E intelligence/i.test(packet.sprint11ReadinessNote)));
  assert.ok(foundation.departmentPackets.every((packet) => packet.providerCalled === false));
});

test("Sprint 10E does not leak raw payloads secrets endpoints or blocked execution strings", () => {
  const serialized = JSON.stringify(report());

  assert.equal(serialized.includes("must not flow"), false);
  assert.equal(serialized.includes("ya29."), false);
  assert.equal(serialized.includes("GOCSPX-"), false);
  assert.equal(serialized.includes("Bearer "), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("https://www.googleapis.com"), false);
  assert.equal(serialized.includes("analytics.googleapis.com"), false);
  assert.equal(serialized.includes("send_email"), false);
  assert.equal(serialized.includes("send_sms"), false);
  assert.equal(serialized.includes("publish_post"), false);
  assert.equal(serialized.includes("reply_to_review"), false);
  assert.equal(serialized.includes("autonomous_work_order"), false);
});

test("intelligence cannot authorize outreach publishing scraping provider writes CRM mutation or autonomous execution", () => {
  const foundation = report();

  assert.equal(foundation.safety.externalWritesAllowed, false);
  assert.equal(foundation.safety.outreachAllowed, false);
  assert.equal(foundation.safety.publishingAllowed, false);
  assert.equal(foundation.safety.scrapingAllowed, false);
  assert.equal(foundation.safety.autonomousWorkOrdersAllowed, false);
  assert.equal(foundation.safety.memoryPersistenceAllowed, false);
  assert.equal(foundation.safety.kpiPersistenceAllowed, false);
  assert.ok(foundation.advisoryRecommendations.every((recommendation) => !/send_email|send_sms|publish_post|reply_to_review|provider_write|crm_mutation|autonomous_work_order/i.test(recommendation)));
  assert.ok(foundation.advisoryRecommendations.every((recommendation) => !/execution allowed|outreach allowed|publishing allowed|scraping allowed/i.test(recommendation)));
});
