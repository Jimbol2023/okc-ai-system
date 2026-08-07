import assert from "node:assert/strict";
import { test } from "node:test";

import type { StoredLead } from "@/lib/leads-storage";
import {
  propertyOpportunitySafetyFlags,
  type PropertyOpportunityRecord,
  type PropertyOpportunitySavedFilterRecord,
} from "@/lib/property-opportunity-engine";
import { createPropertyProviderSourcePriorityReport } from "@/lib/property-provider-source-priority";
import {
  assertPropertyOpportunityWorkbenchSafety,
  createManualCountyRecordOpportunityInput,
  createPropertyOpportunityWorkbenchReport,
  parseCountyRecordImportCsv,
  previewCountyRecordImportScore,
} from "@/lib/property-opportunity-workbench";

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-08-07T13:00:00.000Z",
    firstName: "Test",
    lastName: "Owner",
    email: "",
    phone: "",
    propertyAddress: "123 Real Lead Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Test Owner",
    mailingAddress: "PO Box 1, Dallas, TX",
    county: "Oklahoma",
    parcelId: "P-123",
    situationDetails: "Real lead with DFD note and tax issue.",
    source: "driving_for_dollars",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
    distressFlags: {
      taxDelinquent: true,
      inheritedProperty: false,
      vacantProperty: true,
      foreclosureRisk: false,
      majorRepairs: true,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: true,
    },
    opportunityScore: "High",
    score: 82,
    priority: "High",
    scoreBreakdown: "Workbench test lead.",
    ...overrides,
  };
}

function opportunity(overrides: Partial<PropertyOpportunityRecord> = {}): PropertyOpportunityRecord {
  return {
    id: "opportunity-1",
    tenantId: "default",
    canonicalAddress: "123 real lead ave, oklahoma city, ok 73102",
    propertyAddress: "123 Real Lead Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    county: "Oklahoma",
    parcelId: "P-123",
    ownerName: "Test Owner",
    mailingAddress: "PO Box 1, Dallas, TX",
    source: "county_record_import",
    sourceDetail: "Manual DFD county import.",
    evidence: {
      countyOwnershipTaxEvidence: { taxStatus: "delinquent", assessedValue: 125000, lastSaleDate: "2021-04-01" },
      propertyCharacteristics: { yearBuilt: 1958, squareFeet: 1100, bedrooms: 3, bathrooms: 1 },
      mapPin: { latitude: 35.4676, longitude: -97.5164, source: "manual_import" },
      routeTracking: { routeName: "South OKC DFD", routeStopNumber: 2, gpsTrackingAllowed: false },
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    distressIndicators: ["taxDelinquent", "vacantProperty", "majorRepairs"],
    observations: [{ observedAt: "2026-08-07", note: "Peeling paint and overgrown yard.", condition: "visible_distress", source: "manual_dfd" }],
    photoMetadata: [{ fileName: "front.jpg", contentType: "image/jpeg", caption: "Front exterior." }],
    opportunityScore: 88,
    opportunityPriority: "High",
    confidence: 86,
    duplicateKey: "parcel:oklahoma:p-123",
    duplicateRisk: false,
    missingEvidence: [],
    recommendedAction: "Create an approval-required acquisition review task for this property opportunity.",
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

function filter(overrides: Partial<PropertyOpportunitySavedFilterRecord> = {}): PropertyOpportunitySavedFilterRecord {
  return {
    id: "filter-1",
    tenantId: "default",
    name: "Tax County",
    filterKey: "tax_county",
    criteria: { source: "county_record_import" },
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

test("workbench loads real leads, map discovery, DFD routes, county evidence, filters, ranking, and approval routing", () => {
  const leads = [lead()];
  const opportunities = [opportunity()];
  const filters = [filter()];
  const sourcePriority = createPropertyProviderSourcePriorityReport({ leads, opportunities, generatedAt: new Date("2026-08-07T14:00:00.000Z") });
  const report = createPropertyOpportunityWorkbenchReport({
    leads,
    opportunities,
    filters,
    sourcePriority,
    generatedAt: "2026-08-07T14:00:00.000Z",
  });

  assert.equal(report.totals.realLeads, 1);
  assert.equal(report.totals.persistedOpportunities, 1);
  assert.equal(report.mapDiscoveryPins.some((pin) => pin.geocodeStatus === "manual_coordinates_ready"), true);
  assert.equal(report.dfdRouteTracking[0]?.routeName, "South OKC DFD");
  assert.equal(report.countyEvidenceRows[0]?.parcelId, "P-123");
  assert.equal(report.listBuilderSegments.some((segment) => segment.filterKey === "tax_county"), true);
  assert.equal(report.dfdRanking[0]?.rank, 1);
  assert.equal(report.acquisitionReviewCandidates[0]?.approvalRequired, true);
  assert.equal(report.ceoApprovalRouting.ceoBusinessDecisionRequired, false);
  assertPropertyOpportunityWorkbenchSafety(report);
});

test("county import maps ownership tax characteristics route and pin evidence without provider calls", () => {
  const input = createManualCountyRecordOpportunityInput({
    propertyAddress: "456 County Import St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73103",
    county: "Oklahoma",
    parcelId: "P-456",
    ownerName: "County Owner",
    mailingAddress: "PO Box 456, Edmond, OK",
    taxStatus: "delinquent",
    assessedValue: 99000,
    yearBuilt: 1962,
    squareFeet: 1040,
    bedrooms: 3,
    bathrooms: 1,
    propertyType: "single_family",
    routeName: "North OKC DFD",
    routeStopNumber: 3,
    latitude: 35.5,
    longitude: -97.5,
    notes: ["County tax list matched a vacant-looking property."],
    photoMetadata: [{ fileName: "side.jpg", contentType: "image/jpeg", caption: "Side exterior." }],
  });
  const preview = previewCountyRecordImportScore(input);

  assert.equal(input.source, "county_record_import");
  assert.equal(input.distressFlags.taxDelinquent, true);
  assert.equal(preview.providerCalled, false);
  assert.equal(preview.crmMutated, false);
  assert.ok(preview.score.opportunityScore > 0);
  assert.equal((input.evidence as { routeTracking?: { gpsTrackingAllowed?: boolean } }).routeTracking?.gpsTrackingAllowed, false);
});

test("provider decision gate keeps maps geocoding property data skip trace and direct mail blocked", () => {
  const report = createPropertyOpportunityWorkbenchReport({
    leads: [lead()],
    opportunities: [opportunity({ evidence: {}, photoMetadata: [] })],
    filters: [],
    sourcePriority: createPropertyProviderSourcePriorityReport({ leads: [lead()], opportunities: [opportunity()] }),
  });
  const blocked = report.providerDecisionGate.filter((item) => !item.allowedNow);

  assert.ok(blocked.some((item) => item.source === "maps_geocoding"));
  assert.ok(blocked.some((item) => item.source === "licensed_property_data"));
  assert.ok(blocked.some((item) => item.source === "licensed_skip_trace"));
  assert.ok(blocked.some((item) => item.source === "direct_mail_provider"));
  assert.equal(blocked.every((item) => item.providerCalled === false && item.liveExecutionAllowed === false), true);
  assertPropertyOpportunityWorkbenchSafety(report);
});

test("lead-only workbench still fetches real lead-backed pins and fails closed for provider geocoding", () => {
  const leads = [lead({ id: "lead-only", parcelId: "" })];
  const sourcePriority = createPropertyProviderSourcePriorityReport({ leads, opportunities: [] });
  const report = createPropertyOpportunityWorkbenchReport({
    leads,
    opportunities: [],
    filters: [],
    sourcePriority,
    dataAccessGaps: ["PropertyOpportunity persisted evidence is not readable yet."],
  });

  assert.equal(report.totals.realLeads, 1);
  assert.equal(report.totals.persistedOpportunities, 0);
  assert.equal(report.mapDiscoveryPins[0]?.sourceType, "lead");
  assert.equal(report.mapDiscoveryPins[0]?.geocodeStatus, "needs_geocode_provider_decision");
  assert.ok(report.dataGaps.some((gap) => /persisted evidence/i.test(gap)));
  assertPropertyOpportunityWorkbenchSafety(report);
});

test("county CSV parser previews importable rows with manual coordinates and no provider geocode call", () => {
  const csv = [
    "Owner Name,Situs Address,County,APN,Tax Status,Latitude,Longitude,Route,Notes",
    "\"CSV Owner\",\"789 CSV Ave\",Oklahoma,P-789,delinquent,35.5,-97.5,\"CSV DFD\",\"Boarded window, overgrown yard\"",
  ].join("\n");
  const [row] = parseCountyRecordImportCsv(csv);

  assert.equal(row?.propertyAddress, "789 CSV Ave");
  assert.equal(row?.ownerName, "CSV Owner");
  assert.equal(row?.parcelId, "P-789");
  assert.equal(row?.latitude, 35.5);
  assert.equal(row?.longitude, -97.5);
  assert.equal(row?.geocodePreviewStatus, "manual_coordinates_present");
  assert.equal(row?.providerCalled, false);
  assert.equal(row?.liveExecutionAllowed, false);
});

test("county CSV parser blocks cleanup rows and marks geocode preview-only when coordinates are missing", () => {
  const rows = parseCountyRecordImportCsv(["Owner Name,Situs Address,County,APN", "Missing Address Owner,,Oklahoma,P-000", "Needs Geocode,101 Needs Pin Ave,Oklahoma,P-101"].join("\n"));

  assert.equal(rows[0]?.importReadiness, "blocked_cleanup");
  assert.ok(rows[0]?.validationErrors.length);
  assert.equal(rows[1]?.importReadiness, "ready");
  assert.equal(rows[1]?.geocodePreviewStatus, "preview_only_geocode_required");
  assert.equal(rows.every((row) => row.providerCalled === false && row.liveExecutionAllowed === false), true);
});
