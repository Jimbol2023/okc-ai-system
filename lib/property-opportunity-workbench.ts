import { z } from "zod";

import type { StoredLead } from "@/lib/leads-storage";
import { createDashboardPropertyRecords } from "@/lib/property-records";
import {
  manualDfdPropertyOpportunitySchema,
  propertyOpportunitySafetyFlags,
  scorePropertyOpportunity,
  type ManualDfdPropertyOpportunityInput,
  type PropertyOpportunityRecord,
  type PropertyOpportunitySavedFilterRecord,
} from "@/lib/property-opportunity-engine";
import type { PropertyProviderSourcePriorityReport } from "@/lib/property-provider-source-priority";

export const propertyOpportunityWorkbenchSafetyFlags = {
  internalOnly: true,
  advisoryOnly: true,
  approvalRequired: true,
  providerCalled: false,
  sent: false,
  published: false,
  crmMutated: false,
  liveExecutionAllowed: false,
  scrapingAllowed: false,
  gpsTrackingAllowed: false,
  skipTracingAllowed: false,
  ownerContactAllowed: false,
  directMailAllowed: false,
  externalExecutionAllowed: false,
} as const;

export type PropertyOpportunityWorkbenchCapability =
  | "real_leads"
  | "map_based_property_discovery"
  | "driving_for_dollars_route_tracking"
  | "property_pins_and_notes"
  | "photos_condition_observations"
  | "distress_indicators"
  | "county_ownership_tax_evidence"
  | "owner_mailing_address"
  | "parcel_information"
  | "property_characteristics"
  | "list_builder"
  | "saved_acquisition_filters"
  | "duplicate_suppression"
  | "opportunity_scoring"
  | "dfd_ranking"
  | "acquisition_review_task_creation"
  | "ceo_approval_routing";

export type PropertyOpportunityWorkbenchCapabilityStatus = {
  capability: PropertyOpportunityWorkbenchCapability;
  status: "operational_internal" | "manual_evidence_ready" | "provider_decision_required" | "data_gap";
  detail: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type PropertyMapDiscoveryPin = {
  id: string;
  sourceRecordId: string;
  sourceType: "lead" | "property_opportunity";
  propertyAddress: string;
  ownerName: string | null;
  mailingAddress: string | null;
  county: string | null;
  parcelId: string | null;
  latitude: number | null;
  longitude: number | null;
  geocodeStatus: "manual_coordinates_ready" | "needs_manual_pin" | "needs_geocode_provider_decision";
  notes: string[];
  distressIndicators: string[];
  photoCount: number;
  opportunityScore: number;
  duplicateKey: string | null;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type PropertyDfdRouteTracking = {
  routeId: string;
  routeName: string;
  status: "manual_route_ready" | "needs_manual_route";
  stopCount: number;
  observedStops: number;
  photoStops: number;
  topPropertyAddresses: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
  gpsTrackingAllowed: false;
};

export type CountyEvidenceRow = {
  id: string;
  propertyAddress: string;
  county: string | null;
  parcelId: string | null;
  ownerName: string | null;
  mailingAddress: string | null;
  taxEvidence: string[];
  propertyCharacteristics: Record<string, unknown>;
  evidenceSource: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type PropertyListBuilderSegment = {
  id: string;
  label: string;
  count: number;
  filterKey: string;
  nextInternalAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ProviderDecisionGateItem = {
  source: string;
  allowedNow: boolean;
  decision: "use_internal_now" | "manual_research_allowed" | "preview_certification_available" | "separate_approval_required" | "blocked_until_qualified";
  reason: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type PropertyOpportunityWorkbenchReport = {
  ok: true;
  title: "J Capital Property Opportunity Workbench";
  generatedAt: string;
  summary: string;
  totals: {
    realLeads: number;
    persistedOpportunities: number;
    mapPins: number;
    dfdRoutes: number;
    countyEvidenceRows: number;
    savedFilters: number;
    acquisitionReviewCandidates: number;
  };
  capabilities: PropertyOpportunityWorkbenchCapabilityStatus[];
  mapDiscoveryPins: PropertyMapDiscoveryPin[];
  dfdRouteTracking: PropertyDfdRouteTracking[];
  countyEvidenceRows: CountyEvidenceRow[];
  listBuilderSegments: PropertyListBuilderSegment[];
  dfdRanking: Array<{
    rank: number;
    id: string;
    propertyAddress: string;
    score: number;
    reason: string;
    providerCalled: false;
    liveExecutionAllowed: false;
  }>;
  acquisitionReviewCandidates: Array<{
    propertyOpportunityId: string;
    propertyAddress: string;
    opportunityScore: number;
    approvalRequired: true;
    nextInternalAction: string;
    providerCalled: false;
    liveExecutionAllowed: false;
  }>;
  ceoApprovalRouting: {
    approvalRequiredCount: number;
    ceoBusinessDecisionRequired: false;
    routingSummary: string;
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  providerDecisionGate: ProviderDecisionGateItem[];
  dataGaps: string[];
  exactRecommendedNextImplementation: "IMPLEMENT_PREVIEW_ONLY_GEOCODE_PROVIDER_AUTHORIZATION_GATE_AND_WORKBENCH_API_CERTIFICATION";
  safetyFlags: typeof propertyOpportunityWorkbenchSafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type CountyRecordCsvPreviewRow = CountyRecordImportInput & {
  rowNumber: number;
  importReadiness: "ready" | "blocked_cleanup";
  validationErrors: string[];
  matchedHeaders: string[];
  unmappedHeaders: string[];
  geocodePreviewStatus: "manual_coordinates_present" | "preview_only_geocode_required" | "no_geocode_needed";
  providerCalled: false;
  liveExecutionAllowed: false;
};

const optionalString = z.string().trim().max(500).optional().default("");
const optionalNumber = z.coerce.number().finite().optional();

export const countyRecordImportSchema = z.object({
  propertyAddress: z.string().trim().min(3).max(300),
  city: optionalString,
  state: optionalString,
  zipCode: optionalString,
  county: optionalString,
  parcelId: optionalString,
  ownerName: optionalString,
  mailingAddress: optionalString,
  taxStatus: z.string().trim().max(120).optional().default(""),
  assessedValue: optionalNumber,
  lastSaleDate: z.string().trim().max(80).optional().default(""),
  yearBuilt: optionalNumber,
  squareFeet: optionalNumber,
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  propertyType: z.string().trim().max(160).optional().default(""),
  routeName: z.string().trim().max(160).optional().default(""),
  routeStopNumber: optionalNumber,
  latitude: optionalNumber,
  longitude: optionalNumber,
  notes: z.array(z.string().trim().min(1).max(1200)).max(12).optional().default([]),
  photoMetadata: z.array(z.object({
    fileName: z.string().trim().max(240),
    contentType: z.string().trim().max(120).optional().default("image/*"),
    caption: z.string().trim().max(500).optional().default(""),
  })).max(12).optional().default([]),
  distressFlags: z.object({
    taxDelinquent: z.boolean().optional(),
    inheritedProperty: z.boolean().optional(),
    vacantProperty: z.boolean().optional(),
    foreclosureRisk: z.boolean().optional(),
    majorRepairs: z.boolean().optional(),
    tiredLandlord: z.boolean().optional(),
    urgentTimeline: z.boolean().optional(),
    outOfStateOwner: z.boolean().optional(),
  }).optional().default({}),
});

export type CountyRecordImportInput = z.infer<typeof countyRecordImportSchema>;

const COUNTY_IMPORT_COLUMN_ALIASES: Record<string, keyof CountyRecordImportInput | "note"> = {
  address: "propertyAddress",
  propertyaddress: "propertyAddress",
  situsaddress: "propertyAddress",
  siteaddress: "propertyAddress",
  propertysitusaddress: "propertyAddress",
  streetaddress: "propertyAddress",
  city: "city",
  situscity: "city",
  propertycity: "city",
  state: "state",
  situsstate: "state",
  propertystate: "state",
  zip: "zipCode",
  zipcode: "zipCode",
  situszip: "zipCode",
  propertyzip: "zipCode",
  county: "county",
  propertycounty: "county",
  parcel: "parcelId",
  parcelid: "parcelId",
  apn: "parcelId",
  accountnumber: "parcelId",
  taxaccountnumber: "parcelId",
  owner: "ownerName",
  ownername: "ownerName",
  propertyowner: "ownerName",
  mailingaddress: "mailingAddress",
  mailaddress: "mailingAddress",
  ownermailingaddress: "mailingAddress",
  taxstatus: "taxStatus",
  tax: "taxStatus",
  assessedvalue: "assessedValue",
  assessment: "assessedValue",
  lastsaledate: "lastSaleDate",
  saledate: "lastSaleDate",
  yearbuilt: "yearBuilt",
  squarefeet: "squareFeet",
  sqft: "squareFeet",
  bedrooms: "bedrooms",
  beds: "bedrooms",
  bathrooms: "bathrooms",
  baths: "bathrooms",
  propertytype: "propertyType",
  type: "propertyType",
  routename: "routeName",
  route: "routeName",
  routestopnumber: "routeStopNumber",
  stopnumber: "routeStopNumber",
  latitude: "latitude",
  lat: "latitude",
  longitude: "longitude",
  lng: "longitude",
  lon: "longitude",
  notes: "note",
  note: "note",
  observation: "note",
  condition: "note",
};

function normalizeHeader(header: string) {
  return header.trim().replace(/[\s_-]+/g, "").toLowerCase();
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && inQuotes && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());

  return values;
}

function assignCsvValue(target: Partial<CountyRecordImportInput>, field: keyof CountyRecordImportInput | "note", value: string) {
  if (!value.trim()) return;

  if (field === "note") {
    target.notes = [...(target.notes ?? []), value.trim()];
  } else if (["assessedValue", "yearBuilt", "squareFeet", "bedrooms", "bathrooms", "routeStopNumber", "latitude", "longitude"].includes(field)) {
    const numericValue = Number(value.replace(/[$,\s]/g, ""));
    if (Number.isFinite(numericValue)) {
      (target as Record<string, unknown>)[field] = numericValue;
    }
  } else {
    (target as Record<string, unknown>)[field] = value.trim();
  }
}

export function parseCountyRecordImportCsv(csvText: string): CountyRecordCsvPreviewRow[] {
  const trimmed = csvText.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0] ?? "");
  const matchedHeaders: string[] = [];
  const unmappedHeaders: string[] = [];
  const headerMap = new Map<number, keyof CountyRecordImportInput | "note">();

  headers.forEach((header, index) => {
    const field = COUNTY_IMPORT_COLUMN_ALIASES[normalizeHeader(header)];

    if (field) {
      headerMap.set(index, field);
      matchedHeaders.push(header.trim());
    } else if (header.trim()) {
      unmappedHeaders.push(header.trim());
    }
  });

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const draft: Partial<CountyRecordImportInput> = {};

    values.forEach((value, valueIndex) => {
      const field = headerMap.get(valueIndex);
      if (field) assignCsvValue(draft, field, value);
    });

    const parsed = countyRecordImportSchema.safeParse(draft);
    const row: CountyRecordImportInput = parsed.success
      ? parsed.data
      : {
          propertyAddress: typeof draft.propertyAddress === "string" ? draft.propertyAddress : "",
          city: typeof draft.city === "string" ? draft.city : "",
          state: typeof draft.state === "string" ? draft.state : "",
          zipCode: typeof draft.zipCode === "string" ? draft.zipCode : "",
          county: typeof draft.county === "string" ? draft.county : "",
          parcelId: typeof draft.parcelId === "string" ? draft.parcelId : "",
          ownerName: typeof draft.ownerName === "string" ? draft.ownerName : "",
          mailingAddress: typeof draft.mailingAddress === "string" ? draft.mailingAddress : "",
          taxStatus: typeof draft.taxStatus === "string" ? draft.taxStatus : "",
          assessedValue: typeof draft.assessedValue === "number" ? draft.assessedValue : undefined,
          lastSaleDate: typeof draft.lastSaleDate === "string" ? draft.lastSaleDate : "",
          yearBuilt: typeof draft.yearBuilt === "number" ? draft.yearBuilt : undefined,
          squareFeet: typeof draft.squareFeet === "number" ? draft.squareFeet : undefined,
          bedrooms: typeof draft.bedrooms === "number" ? draft.bedrooms : undefined,
          bathrooms: typeof draft.bathrooms === "number" ? draft.bathrooms : undefined,
          propertyType: typeof draft.propertyType === "string" ? draft.propertyType : "",
          routeName: typeof draft.routeName === "string" ? draft.routeName : "",
          routeStopNumber: typeof draft.routeStopNumber === "number" ? draft.routeStopNumber : undefined,
          latitude: typeof draft.latitude === "number" ? draft.latitude : undefined,
          longitude: typeof draft.longitude === "number" ? draft.longitude : undefined,
          notes: Array.isArray(draft.notes) ? draft.notes : [],
          photoMetadata: Array.isArray(draft.photoMetadata) ? draft.photoMetadata : [],
          distressFlags: typeof draft.distressFlags === "object" && draft.distressFlags !== null ? draft.distressFlags : {},
        };
    const validationErrors = parsed.success ? [] : parsed.error.issues.map((issue) => issue.message);
    const hasManualCoordinates = typeof row.latitude === "number" && typeof row.longitude === "number";

    return {
      ...row,
      rowNumber: index + 2,
      importReadiness: validationErrors.length === 0 ? "ready" : "blocked_cleanup",
      validationErrors,
      matchedHeaders,
      unmappedHeaders,
      geocodePreviewStatus: hasManualCoordinates ? "manual_coordinates_present" : hasText(row.propertyAddress) ? "preview_only_geocode_required" : "no_geocode_needed",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function numberFromEvidence(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function scoreLead(lead: StoredLead) {
  return typeof lead.score === "number" ? lead.score : lead.priority === "High" ? 75 : lead.priority === "Medium" ? 50 : 25;
}

function pinFromOpportunity(opportunity: PropertyOpportunityRecord): PropertyMapDiscoveryPin {
  const evidence = asRecord(opportunity.evidence);
  const mapPin = asRecord(evidence.mapPin);
  const notes = opportunity.observations.map((observation) => observation.note);
  const latitude = numberFromEvidence(mapPin.latitude);
  const longitude = numberFromEvidence(mapPin.longitude);

  return {
    id: `opportunity-pin-${opportunity.id}`,
    sourceRecordId: opportunity.id,
    sourceType: "property_opportunity",
    propertyAddress: opportunity.propertyAddress,
    ownerName: opportunity.ownerName,
    mailingAddress: opportunity.mailingAddress,
    county: opportunity.county,
    parcelId: opportunity.parcelId,
    latitude,
    longitude,
    geocodeStatus: latitude !== null && longitude !== null ? "manual_coordinates_ready" : "needs_geocode_provider_decision",
    notes,
    distressIndicators: opportunity.distressIndicators,
    photoCount: opportunity.photoMetadata.length,
    opportunityScore: opportunity.opportunityScore,
    duplicateKey: opportunity.duplicateKey,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function pinFromLead(lead: StoredLead): PropertyMapDiscoveryPin {
  const record = createDashboardPropertyRecords([lead])[0];
  const score = scoreLead(lead);

  return {
    id: `lead-pin-${lead.id}`,
    sourceRecordId: lead.id,
    sourceType: "lead",
    propertyAddress: lead.propertyAddress,
    ownerName: lead.ownerName || null,
    mailingAddress: lead.mailingAddress || null,
    county: lead.county || null,
    parcelId: lead.parcelId || null,
    latitude: null,
    longitude: null,
    geocodeStatus: hasText(lead.propertyAddress) ? "needs_geocode_provider_decision" : "needs_manual_pin",
    notes: [lead.situationDetails].filter(hasText),
    distressIndicators: record?.signals ?? [],
    photoCount: 0,
    opportunityScore: score,
    duplicateKey: null,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function routeNameForOpportunity(opportunity: PropertyOpportunityRecord) {
  const evidence = asRecord(opportunity.evidence);
  const routeTracking = asRecord(evidence.routeTracking);
  const routeName = routeTracking.routeName;

  if (hasText(routeName)) return String(routeName).trim();
  if (`${opportunity.source} ${opportunity.sourceDetail ?? ""}`.toLowerCase().includes("dfd")) return "Manual DFD Review Route";

  return "";
}

function createDfdRoutes(opportunities: PropertyOpportunityRecord[], pins: PropertyMapDiscoveryPin[]): PropertyDfdRouteTracking[] {
  const grouped = new Map<string, PropertyMapDiscoveryPin[]>();

  for (const opportunity of opportunities) {
    const routeName = routeNameForOpportunity(opportunity);
    if (!routeName) continue;
    const pin = pins.find((item) => item.sourceType === "property_opportunity" && item.sourceRecordId === opportunity.id);
    if (!pin) continue;
    grouped.set(routeName, [...(grouped.get(routeName) ?? []), pin]);
  }

  if (grouped.size === 0 && pins.some((pin) => pin.sourceType === "lead")) {
    grouped.set("Lead Property Review Route", pins.filter((pin) => pin.sourceType === "lead").slice(0, 8));
  }

  return [...grouped.entries()].map(([routeName, routePins]) => ({
    routeId: `route-${routeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "manual"}`,
    routeName,
    status: routePins.some((pin) => pin.notes.length > 0 || pin.photoCount > 0) ? "manual_route_ready" : "needs_manual_route",
    stopCount: routePins.length,
    observedStops: routePins.filter((pin) => pin.notes.length > 0).length,
    photoStops: routePins.filter((pin) => pin.photoCount > 0).length,
    topPropertyAddresses: routePins.slice(0, 5).map((pin) => pin.propertyAddress),
    providerCalled: false,
    liveExecutionAllowed: false,
    gpsTrackingAllowed: false,
  }));
}

function countyEvidenceFromOpportunity(opportunity: PropertyOpportunityRecord): CountyEvidenceRow | null {
  const evidence = asRecord(opportunity.evidence);
  const countyEvidence = asRecord(evidence.countyOwnershipTaxEvidence);
  const propertyCharacteristics = asRecord(evidence.propertyCharacteristics);
  const taxEvidence = [
    hasText(countyEvidence.taxStatus) ? `tax_status:${countyEvidence.taxStatus}` : "",
    hasText(countyEvidence.lastSaleDate) ? `last_sale:${countyEvidence.lastSaleDate}` : "",
    typeof countyEvidence.assessedValue === "number" ? `assessed_value:${countyEvidence.assessedValue}` : "",
    opportunity.distressIndicators.includes("taxDelinquent") ? "distress:tax_delinquent" : "",
  ].filter(Boolean);

  if (!opportunity.county && !opportunity.parcelId && !opportunity.ownerName && !opportunity.mailingAddress && taxEvidence.length === 0) return null;

  return {
    id: `county-evidence-${opportunity.id}`,
    propertyAddress: opportunity.propertyAddress,
    county: opportunity.county,
    parcelId: opportunity.parcelId,
    ownerName: opportunity.ownerName,
    mailingAddress: opportunity.mailingAddress,
    taxEvidence,
    propertyCharacteristics,
    evidenceSource: opportunity.source,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createListBuilderSegments(
  opportunities: PropertyOpportunityRecord[],
  leads: StoredLead[],
  filters: PropertyOpportunitySavedFilterRecord[],
): PropertyListBuilderSegment[] {
  const records = createDashboardPropertyRecords(leads);
  const segments: PropertyListBuilderSegment[] = [
    {
      id: "saved-acquisition-filters",
      label: "Saved acquisition filters",
      count: filters.length,
      filterKey: "saved_acquisition_filters",
      nextInternalAction: "Use saved filters to review and rank persisted opportunities.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      id: "tax-county",
      label: "Tax and county evidence",
      count: opportunities.filter((item) => `${item.source} ${item.sourceDetail ?? ""}`.toLowerCase().includes("county") || item.distressIndicators.includes("taxDelinquent")).length,
      filterKey: "tax_county",
      nextInternalAction: "Prioritize manual county evidence cleanup before paid property data.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      id: "out-of-state",
      label: "Out-of-state and absentee owners",
      count: records.filter((record) => record.signals.includes("out_of_state_owner_signal")).length,
      filterKey: "out_of_state",
      nextInternalAction: "Verify mailing address and owner evidence before acquisition review.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      id: "dfd",
      label: "Driving for Dollars",
      count: opportunities.filter((item) => `${item.source} ${item.sourceDetail ?? ""}`.toLowerCase().includes("dfd")).length + records.filter((record) => record.signals.includes("driving_for_dollars_observation")).length,
      filterKey: "driving_for_dollars",
      nextInternalAction: "Review route observations, notes, and photo metadata.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      id: "missing-owner-data",
      label: "Missing owner data",
      count: opportunities.filter((item) => !hasText(item.ownerName) || !hasText(item.mailingAddress)).length,
      filterKey: "missing_owner_data",
      nextInternalAction: "Assign manual county/public-record owner cleanup.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ];

  return segments.filter((segment) => segment.count > 0 || segment.id === "saved-acquisition-filters");
}

function createProviderDecisionGate(sourcePriority: PropertyProviderSourcePriorityReport): ProviderDecisionGateItem[] {
  return sourcePriority.providerReadiness.map((item) => ({
    source: item.source,
    allowedNow: !item.requiresSeparateApproval && !item.prohibitedInV1,
    decision:
      item.activationState === "use_now_internal"
        ? "use_internal_now"
        : item.activationState === "ready_for_manual_research"
          ? "manual_research_allowed"
          : item.source === "maps_geocoding"
            ? "preview_certification_available"
          : item.activationState === "blocked_until_property_qualified"
            ? "blocked_until_qualified"
            : "separate_approval_required",
    reason: item.source === "maps_geocoding"
      ? `${item.bestUse} Production geocoding, persistence, outreach, and CRM mutation remain blocked.`
      : item.bestUse,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function capability(
  capabilityName: PropertyOpportunityWorkbenchCapability,
  status: PropertyOpportunityWorkbenchCapabilityStatus["status"],
  detail: string,
): PropertyOpportunityWorkbenchCapabilityStatus {
  return {
    capability: capabilityName,
    status,
    detail,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createManualCountyRecordOpportunityInput(input: CountyRecordImportInput): ManualDfdPropertyOpportunityInput {
  const parsed = countyRecordImportSchema.parse(input);
  const taxDelinquent = parsed.distressFlags.taxDelinquent ?? /delinquent|past due|tax sale/i.test(parsed.taxStatus);

  return manualDfdPropertyOpportunitySchema.parse({
    propertyAddress: parsed.propertyAddress,
    city: parsed.city,
    state: parsed.state,
    zipCode: parsed.zipCode,
    county: parsed.county,
    parcelId: parsed.parcelId,
    ownerName: parsed.ownerName,
    mailingAddress: parsed.mailingAddress,
    source: "county_record_import",
    sourceDetail: "Manual county ownership/tax evidence import. No provider call, scraping, skip trace, mail, or outreach.",
    distressFlags: {
      ...parsed.distressFlags,
      taxDelinquent,
    },
    observations: parsed.notes.map((note) => ({
      observedAt: new Date().toISOString(),
      note,
      condition: "county_import_note",
      source: "county_record_import",
    })),
    photoMetadata: parsed.photoMetadata,
    evidence: {
      sourceLabel: "manual_county_record_import",
      countyOwnershipTaxEvidence: {
        taxStatus: parsed.taxStatus,
        assessedValue: parsed.assessedValue,
        lastSaleDate: parsed.lastSaleDate,
      },
      propertyCharacteristics: {
        yearBuilt: parsed.yearBuilt,
        squareFeet: parsed.squareFeet,
        bedrooms: parsed.bedrooms,
        bathrooms: parsed.bathrooms,
        propertyType: parsed.propertyType,
      },
      mapPin: {
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        source: "manual_import",
      },
      routeTracking: {
        routeName: parsed.routeName,
        routeStopNumber: parsed.routeStopNumber,
        gpsTrackingAllowed: false,
      },
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  });
}

export function createPropertyOpportunityWorkbenchReport({
  leads,
  opportunities,
  filters,
  sourcePriority,
  generatedAt = new Date().toISOString(),
  dataAccessGaps = [],
}: {
  leads: StoredLead[];
  opportunities: PropertyOpportunityRecord[];
  filters: PropertyOpportunitySavedFilterRecord[];
  sourcePriority: PropertyProviderSourcePriorityReport;
  generatedAt?: string;
  dataAccessGaps?: string[];
}): PropertyOpportunityWorkbenchReport {
  const leadPins = leads.filter((lead) => hasText(lead.propertyAddress)).map(pinFromLead);
  const opportunityPins = opportunities.map(pinFromOpportunity);
  const pins = [...opportunityPins, ...leadPins].slice(0, 100);
  const routes = createDfdRoutes(opportunities, pins);
  const countyRows = opportunities.map(countyEvidenceFromOpportunity).filter((row): row is CountyEvidenceRow => row !== null);
  const listSegments = createListBuilderSegments(opportunities, leads, filters);
  const acquisitionReviewCandidates = opportunities
    .filter((opportunity) => opportunity.opportunityPriority === "High")
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 8)
    .map((opportunity) => ({
      propertyOpportunityId: opportunity.id,
      propertyAddress: opportunity.propertyAddress,
      opportunityScore: opportunity.opportunityScore,
      approvalRequired: true as const,
      nextInternalAction: "Create approval-required acquisition review task.",
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
    }));
  const dfdRanking = pins
    .slice()
    .sort((a, b) => b.opportunityScore - a.opportunityScore || a.propertyAddress.localeCompare(b.propertyAddress))
    .slice(0, 12)
    .map((pin, index) => ({
      rank: index + 1,
      id: pin.id,
      propertyAddress: pin.propertyAddress,
      score: pin.opportunityScore,
      reason: pin.distressIndicators.length > 0 ? `Distress/evidence signals: ${pin.distressIndicators.join(", ")}` : "Ranked from stored property lead/opportunity evidence.",
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
    }));
  const providerDecisionGate = createProviderDecisionGate(sourcePriority);
  const dataGaps = [
    ...dataAccessGaps,
    leads.length === 0 ? "No real persisted leads are available to the workbench." : "",
    opportunities.length === 0 ? "No persisted PropertyOpportunity records are readable yet; lead-backed map discovery is available." : "",
    pins.some((pin) => pin.geocodeStatus === "needs_geocode_provider_decision") ? "Some property pins need a future geocoding provider decision or manual coordinates." : "",
    routes.length === 0 ? "No DFD route evidence exists yet; manual route names can be supplied through county/DFD imports." : "",
  ].filter(Boolean);

  return {
    ok: true,
    title: "J Capital Property Opportunity Workbench",
    generatedAt,
    summary: `Workbench loaded ${leads.length} real lead(s), ${opportunities.length} persisted opportunity record(s), ${pins.length} map discovery pin(s), and ${routes.length} DFD route(s) without provider calls.`,
    totals: {
      realLeads: leads.length,
      persistedOpportunities: opportunities.length,
      mapPins: pins.length,
      dfdRoutes: routes.length,
      countyEvidenceRows: countyRows.length,
      savedFilters: filters.length,
      acquisitionReviewCandidates: acquisitionReviewCandidates.length,
    },
    capabilities: [
      capability("real_leads", leads.length > 0 ? "operational_internal" : "data_gap", `${leads.length} authenticated persisted lead(s) loaded.`),
      capability("map_based_property_discovery", pins.length > 0 ? "manual_evidence_ready" : "data_gap", `${pins.length} property pin candidate(s) from leads/opportunities; live geocoding remains gated.`),
      capability("driving_for_dollars_route_tracking", routes.length > 0 ? "manual_evidence_ready" : "data_gap", `${routes.length} manual route tracking group(s); GPS surveillance remains disabled.`),
      capability("property_pins_and_notes", pins.some((pin) => pin.notes.length > 0) ? "manual_evidence_ready" : "data_gap", "Pins use stored notes/observations only."),
      capability("photos_condition_observations", pins.some((pin) => pin.photoCount > 0 || pin.notes.length > 0) ? "manual_evidence_ready" : "data_gap", "Photo metadata and condition observations are supported through internal evidence."),
      capability("distress_indicators", pins.some((pin) => pin.distressIndicators.length > 0) ? "operational_internal" : "data_gap", "Distress indicators are generated from stored lead/opportunity flags."),
      capability("county_ownership_tax_evidence", countyRows.length > 0 ? "manual_evidence_ready" : "data_gap", `${countyRows.length} county evidence row(s) available.`),
      capability("owner_mailing_address", pins.some((pin) => hasText(pin.mailingAddress)) ? "manual_evidence_ready" : "data_gap", "Owner mailing addresses are read from persisted records only."),
      capability("parcel_information", pins.some((pin) => hasText(pin.parcelId)) ? "manual_evidence_ready" : "data_gap", "Parcel IDs are read from persisted lead/opportunity records."),
      capability("property_characteristics", countyRows.some((row) => Object.keys(row.propertyCharacteristics).length > 0) ? "manual_evidence_ready" : "data_gap", "Characteristics are captured as county/import evidence JSON."),
      capability("list_builder", listSegments.length > 0 ? "operational_internal" : "data_gap", `${listSegments.length} list builder segment(s) available.`),
      capability("saved_acquisition_filters", filters.length > 0 ? "operational_internal" : "data_gap", `${filters.length} saved acquisition filter(s) available.`),
      capability("duplicate_suppression", "operational_internal", "Duplicate suppression uses canonical parcel/address keys in the Property Opportunity Engine."),
      capability("opportunity_scoring", opportunities.length > 0 ? "operational_internal" : "data_gap", "Opportunity scoring uses internal distress, evidence completeness, observation, identity, and duplicate logic."),
      capability("dfd_ranking", dfdRanking.length > 0 ? "operational_internal" : "data_gap", `${dfdRanking.length} ranked DFD/property item(s) available.`),
      capability("acquisition_review_task_creation", acquisitionReviewCandidates.length > 0 ? "operational_internal" : "data_gap", "High-scoring opportunities can create approval-required internal RevenueTasks."),
      capability("ceo_approval_routing", acquisitionReviewCandidates.length > 0 ? "operational_internal" : "data_gap", "CEO routing surfaces approval-required review candidates without creating a CEO business decision."),
    ],
    mapDiscoveryPins: pins,
    dfdRouteTracking: routes,
    countyEvidenceRows: countyRows,
    listBuilderSegments: listSegments,
    dfdRanking,
    acquisitionReviewCandidates,
    ceoApprovalRouting: {
      approvalRequiredCount: acquisitionReviewCandidates.length,
      ceoBusinessDecisionRequired: false,
      routingSummary:
        acquisitionReviewCandidates.length > 0
          ? `${acquisitionReviewCandidates.length} high-priority acquisition review candidate(s) are ready for internal approval routing.`
          : "No high-priority acquisition review candidates are ready yet.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerDecisionGate,
    dataGaps: [...new Set(dataGaps)],
    exactRecommendedNextImplementation: "IMPLEMENT_PREVIEW_ONLY_GEOCODE_PROVIDER_AUTHORIZATION_GATE_AND_WORKBENCH_API_CERTIFICATION",
    safetyFlags: propertyOpportunityWorkbenchSafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

export function assertPropertyOpportunityWorkbenchSafety(report: PropertyOpportunityWorkbenchReport) {
  const unsafe =
    report.providerCalled ||
    report.sent ||
    report.published ||
    report.crmMutated ||
    report.liveExecutionAllowed ||
    report.mapDiscoveryPins.some((item) => item.providerCalled || item.liveExecutionAllowed) ||
    report.dfdRouteTracking.some((item) => item.providerCalled || item.liveExecutionAllowed || item.gpsTrackingAllowed) ||
    report.countyEvidenceRows.some((item) => item.providerCalled || item.liveExecutionAllowed) ||
    report.listBuilderSegments.some((item) => item.providerCalled || item.liveExecutionAllowed) ||
    report.dfdRanking.some((item) => item.providerCalled || item.liveExecutionAllowed) ||
    report.acquisitionReviewCandidates.some((item) => item.providerCalled || item.liveExecutionAllowed || !item.approvalRequired) ||
    report.ceoApprovalRouting.providerCalled ||
    report.ceoApprovalRouting.liveExecutionAllowed ||
    report.ceoApprovalRouting.ceoBusinessDecisionRequired ||
    report.providerDecisionGate.some((item) => item.providerCalled || item.liveExecutionAllowed || (item.allowedNow && item.decision !== "use_internal_now" && item.decision !== "manual_research_allowed"));

  if (unsafe) {
    throw new Error("Property Opportunity Workbench attempted an unsafe provider, GPS, CRM, outreach, or execution action.");
  }

  if (report.safetyFlags !== propertyOpportunityWorkbenchSafetyFlags && report.safetyFlags !== propertyOpportunitySafetyFlags) {
    throw new Error("Property Opportunity Workbench safety flags must remain canonical.");
  }
}

export function previewCountyRecordImportScore(input: CountyRecordImportInput) {
  const opportunityInput = createManualCountyRecordOpportunityInput(input);
  const score = scorePropertyOpportunity(opportunityInput);

  return {
    opportunityInput,
    score,
    providerCalled: false as const,
    sent: false as const,
    published: false as const,
    crmMutated: false as const,
    liveExecutionAllowed: false as const,
  };
}
