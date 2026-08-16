import assert from "node:assert/strict";
import { test } from "node:test";

import type { StoredLead } from "@/lib/leads-storage";
import type { PropertyOpportunityRecord } from "@/lib/property-opportunity-engine";
import { propertyOpportunitySafetyFlags } from "@/lib/property-opportunity-engine";
import {
  assertPropertyProviderSourcePrioritySafety,
  createPropertyProviderSourcePriorityReport,
} from "@/lib/property-provider-source-priority";

function opportunity(overrides: Partial<PropertyOpportunityRecord> = {}): PropertyOpportunityRecord {
  return {
    id: "opportunity-1",
    tenantId: "default",
    canonicalAddress: "123 internal review ave, oklahoma city, ok 73102",
    propertyAddress: "123 Internal Review Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    county: "Oklahoma",
    parcelId: "P-123",
    ownerName: "Test Owner",
    mailingAddress: "PO Box 1, Dallas, TX",
    source: "manual_dfd",
    sourceDetail: "Visible distress.",
    evidence: { sourceLabel: "test" },
    distressIndicators: ["vacant_property", "major_repairs"],
    observations: [{ observedAt: "2026-08-07", note: "Boarded window.", condition: "visible_distress", source: "manual_dfd" }],
    photoMetadata: [{ fileName: "front.jpg", contentType: "image/jpeg", caption: "Front exterior." }],
    opportunityScore: 90,
    opportunityPriority: "High",
    confidence: 90,
    duplicateKey: "parcel:oklahoma:p-123",
    duplicateRisk: false,
    missingEvidence: [],
    recommendedAction: "Create acquisition-review task after approval.",
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    createdBy: "tester",
    createdAt: "2026-08-07T13:00:00.000Z",
    updatedAt: "2026-08-07T13:00:00.000Z",
    ...overrides,
  };
}

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-08-07T13:00:00.000Z",
    firstName: "Test",
    lastName: "Owner",
    email: "",
    phone: "",
    propertyAddress: "456 County Import St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73103",
    ownerName: "County Owner",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "P-456",
    situationDetails: "Tax list import.",
    source: "county_import",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
    distressFlags: {
      taxDelinquent: true,
      inheritedProperty: false,
      vacantProperty: false,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: true,
    },
    opportunityScore: "Medium",
    score: 55,
    priority: "Medium",
    scoreBreakdown: "County import test lead.",
    ...overrides,
  };
}

test("source priority uses internal and county evidence before providers", () => {
  const report = createPropertyProviderSourcePriorityReport({
    opportunities: [opportunity({ ownerName: "", mailingAddress: "", parcelId: "" })],
    leads: [lead()],
    generatedAt: new Date("2026-08-07T14:00:00.000Z"),
  });

  const ownerGap = report.sourcePriority.find((item) => item.gap === "owner_identity");
  const parcelGap = report.sourcePriority.find((item) => item.gap === "parcel_county");

  assert.equal(report.ok, true);
  assert.equal(ownerGap?.sourcePriority[0], "internal_existing_evidence");
  assert.equal(ownerGap?.sourcePriority[1], "county_public_records");
  assert.equal(parcelGap?.sourcePriority[0], "internal_existing_evidence");
  assert.ok(report.morningBriefSignals.some((item) => item.evidenceGap === "owner_identity"));
  assert.ok(report.exceptionInboxItems.every((item) => item.ceoBusinessDecisionRequired === false));
  assert.ok(report.providerReadiness.some((item) => item.source === "licensed_property_data" && item.prohibitedInV1));
  assertPropertyProviderSourcePrioritySafety(report);
});

test("high-value contact enrichment and direct mail remain approval-blocked", () => {
  const report = createPropertyProviderSourcePriorityReport({
    opportunities: [opportunity()],
    generatedAt: new Date("2026-08-07T14:00:00.000Z"),
  });

  const enrichment = report.sourcePriority.find((item) => item.gap === "contact_enrichment");
  const directMail = report.sourcePriority.find((item) => item.gap === "direct_mail_readiness");

  assert.equal(enrichment?.activationState, "blocked_until_human_approval");
  assert.deepEqual(enrichment?.sourcePriority, ["licensed_skip_trace"]);
  assert.equal(directMail?.activationState, "blocked_until_human_approval");
  assert.ok(report.exceptionInboxItems.some((item) => item.type === "provider_activation_blocked"));
  assert.equal(report.providerCalled, false);
  assert.equal(report.sent, false);
  assert.equal(report.published, false);
  assert.equal(report.crmMutated, false);
  assert.equal(report.liveExecutionAllowed, false);
  assertPropertyProviderSourcePrioritySafety(report);
});

test("missing persisted opportunity access fails closed to internal read-only evidence", () => {
  const report = createPropertyProviderSourcePriorityReport({
    leads: [lead()],
    opportunityDataAccessIssue: "PropertyOpportunity persisted evidence is not readable yet.",
    generatedAt: new Date("2026-08-07T14:00:00.000Z"),
  });

  assert.equal(report.sourcePriority[0]?.gap, "property_identity");
  assert.equal(report.sourcePriority[0]?.sourcePriority[0], "internal_existing_evidence");
  assert.equal(report.sourcePriority[0]?.activationState, "use_now_internal");
  assert.equal(report.exceptionInboxItems[0]?.type, "opportunity_evidence_access_gap");
  assert.equal(report.totals.providerCandidates >= 0, true);
  assertPropertyProviderSourcePrioritySafety(report);
});

test("report advertises the next integration without changing safety posture", () => {
  const report = createPropertyProviderSourcePriorityReport({
    opportunities: [opportunity({ observations: [], photoMetadata: [], distressIndicators: [] })],
    generatedAt: new Date("2026-08-07T14:00:00.000Z"),
  });

  assert.equal(report.exactRecommendedNextImplementation, "IMPLEMENT_PREVIEW_ONLY_GEOCODE_PROVIDER_AUTHORIZATION_GATE_AND_WORKBENCH_API_CERTIFICATION");
  assert.ok(report.operatingDoctrine.some((line) => /Preview-only certification lane/.test(line)));
  assert.ok(report.operatingDoctrine.some((line) => /DealMachine is not integrated in V1/.test(line)));
  assert.ok(report.sourcePriority.some((item) => item.gap === "condition_media" && item.sourcePriority[0] === "manual_dfd"));
  assert.ok(report.morningBriefSignals.every((item) => item.providerCalled === false && item.liveExecutionAllowed === false));
  assert.ok(report.exceptionInboxItems.every((item) => item.engineeringRemediationRequired && item.ceoBusinessDecisionRequired === false));
  assert.equal(report.safetyFlags, propertyOpportunitySafetyFlags);
  assertPropertyProviderSourcePrioritySafety(report);
});
