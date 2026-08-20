import { z } from "zod";

import { evaluateAutonomyPolicy, defaultAutonomyPolicies } from "@/lib/autonomy-policy";
import { evaluateConnectorAction } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot } from "@/lib/feature-flags";
import {
  createPropertyCandidateDuplicateKey,
  normalizePropertyCandidateAddress,
  propertyCandidateInputSchema,
  propertyCandidateSafetyFlags,
  type PropertyCandidateInput,
} from "@/lib/property-candidate-foundation";

export const virtualDfdSafetyFlags = Object.freeze({
  ...propertyCandidateSafetyFlags,
  adSpendMutation: false,
  moneyMovement: false,
  scraping: false,
});

export type VirtualDfdConnectorId = "google_geocoding" | "dealmachine_property_search";
export type VirtualDfdProviderSource = "google_geocode" | "dealmachine_property_search";
export type VirtualDfdCandidateSource = VirtualDfdProviderSource | "virtual_dfd_internal_certification";
export type VirtualDfdDuplicateEntityType = "PropertyCandidate" | "Lead" | "PropertyOpportunity";

export type VirtualDfdCostControls = {
  dailyQueryLimit: number;
  dailyCreditLimit: number;
  dailyDollarLimitCents: number;
  perPropertyCostCents: number;
  queriesUsedToday: number;
  creditsUsedToday: number;
  dollarsUsedTodayCents: number;
  circuitBreaker: "open" | "closed";
};

export type VirtualDfdCandidateDraft = {
  intendedSource: VirtualDfdCandidateSource;
  propertyCandidateInput: PropertyCandidateInput;
  duplicateKey: string;
  duplicateStatus: "unique" | "duplicate_candidate" | "duplicate_existing_lead" | "duplicate_existing_opportunity" | "conflicting_parcel" | "conflicting_address";
  providerCostCents: number;
  creditsUsed: number;
  createsLead: false;
  createsPropertyOpportunity: false;
  createsRevenueTask: false;
  safetyFlags: typeof virtualDfdSafetyFlags;
};

const googleAddressComponentSchema = z.object({
  longText: z.string().optional(),
  shortText: z.string().optional(),
  long_name: z.string().optional(),
  short_name: z.string().optional(),
  types: z.array(z.string()).default([]),
});

export const googleGeocodeResultSchema = z.object({
  placeId: z.string().optional(),
  place_id: z.string().optional(),
  formattedAddress: z.string().optional(),
  formatted_address: z.string().optional(),
  granularity: z.string().optional(),
  types: z.array(z.string()).optional(),
  location: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
  geometry: z.object({ location: z.object({ lat: z.number(), lng: z.number() }) }).optional(),
  addressComponents: z.array(googleAddressComponentSchema).optional(),
  address_components: z.array(googleAddressComponentSchema).optional(),
});

export const dealMachinePropertySchema = z.object({
  id: z.string().optional(),
  property_id: z.string().optional(),
  address: z.string().optional(),
  formatted_address: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  zip_code: z.string().optional(),
  county: z.string().optional(),
  parcel_id: z.string().optional(),
  apn: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  owner_name: z.string().optional(),
  mailing_address: z.string().optional(),
  list_id: z.string().optional(),
  credits_used: z.number().int().nonnegative().optional(),
  provider_cost_cents: z.number().int().nonnegative().optional(),
});

export const defaultVirtualDfdCostControls: Record<VirtualDfdConnectorId, VirtualDfdCostControls> = {
  google_geocoding: {
    dailyQueryLimit: 0,
    dailyCreditLimit: 0,
    dailyDollarLimitCents: 0,
    perPropertyCostCents: 0,
    queriesUsedToday: 0,
    creditsUsedToday: 0,
    dollarsUsedTodayCents: 0,
    circuitBreaker: "open",
  },
  dealmachine_property_search: {
    dailyQueryLimit: 0,
    dailyCreditLimit: 0,
    dailyDollarLimitCents: 0,
    perPropertyCostCents: 0,
    queriesUsedToday: 0,
    creditsUsedToday: 0,
    dollarsUsedTodayCents: 0,
    circuitBreaker: "open",
  },
};

function firstComponent(components: z.infer<typeof googleAddressComponentSchema>[], type: string) {
  const component = components.find((item) => item.types.includes(type));
  return component?.shortText ?? component?.short_name ?? component?.longText ?? component?.long_name ?? "";
}

function classifyDuplicateStatus(input: {
  duplicateKey: string;
  propertyCandidateDuplicateKeys?: string[];
  leadDuplicateKeys?: string[];
  propertyOpportunityDuplicateKeys?: string[];
  conflictingParcelKeys?: string[];
  conflictingAddressKeys?: string[];
}): VirtualDfdCandidateDraft["duplicateStatus"] {
  if (input.conflictingParcelKeys?.includes(input.duplicateKey)) return "conflicting_parcel";
  if (input.conflictingAddressKeys?.includes(input.duplicateKey)) return "conflicting_address";
  if (input.propertyOpportunityDuplicateKeys?.includes(input.duplicateKey)) return "duplicate_existing_opportunity";
  if (input.leadDuplicateKeys?.includes(input.duplicateKey)) return "duplicate_existing_lead";
  if (input.propertyCandidateDuplicateKeys?.includes(input.duplicateKey)) return "duplicate_candidate";
  return "unique";
}

function candidateDraft(input: {
  intendedSource: VirtualDfdCandidateSource;
  candidate: PropertyCandidateInput;
  duplicateKey: string;
  duplicateStatus: VirtualDfdCandidateDraft["duplicateStatus"];
  providerCostCents: number;
  creditsUsed: number;
}): VirtualDfdCandidateDraft {
  return {
    intendedSource: input.intendedSource,
    propertyCandidateInput: input.candidate,
    duplicateKey: input.duplicateKey,
    duplicateStatus: input.duplicateStatus,
    providerCostCents: input.providerCostCents,
    creditsUsed: input.creditsUsed,
    createsLead: false,
    createsPropertyOpportunity: false,
    createsRevenueTask: false,
    safetyFlags: virtualDfdSafetyFlags,
  };
}

export function mapGoogleGeocodeToPropertyCandidateInput(input: {
  requestedAddress: string;
  result: unknown;
  collectedAt: string;
  certificationOnly?: boolean;
  duplicateKeys?: {
    propertyCandidates?: string[];
    leads?: string[];
    propertyOpportunities?: string[];
    conflictingParcels?: string[];
    conflictingAddresses?: string[];
  };
}) {
  const result = googleGeocodeResultSchema.parse(input.result);
  const components = result.addressComponents ?? result.address_components ?? [];
  const propertyAddress = result.formattedAddress ?? result.formatted_address ?? input.requestedAddress;
  const city = firstComponent(components, "locality");
  const state = firstComponent(components, "administrative_area_level_1");
  const zipCode = firstComponent(components, "postal_code");
  const county = firstComponent(components, "administrative_area_level_2");
  const location = result.location ? { latitude: result.location.latitude, longitude: result.location.longitude } : result.geometry?.location ? { latitude: result.geometry.location.lat, longitude: result.geometry.location.lng } : null;
  const duplicateKey = createPropertyCandidateDuplicateKey({ propertyAddress, city, state, zipCode, county, parcelId: "" });
  const intendedSource: VirtualDfdCandidateSource = input.certificationOnly ? "virtual_dfd_internal_certification" : "google_geocode";
  const candidate = propertyCandidateInputSchema.parse({
    source: input.certificationOnly ? "virtual_dfd_internal_certification" : "manual_property_review",
    sourceDetail: "Virtual DFD Google Geocoding candidate preparation. Official API contract only; no Google call was made in this certification.",
    sourceRecordId: result.placeId ?? result.place_id ?? "",
    propertyAddress,
    city,
    state,
    zipCode,
    county,
    latitude: location?.latitude,
    longitude: location?.longitude,
    coordinateSource: location ? "future_google_geocoding" : "",
    providerName: "Google Maps Platform",
    providerRequestId: result.placeId ?? result.place_id ?? "",
    retrievedAt: input.collectedAt,
    costCents: 0,
    creditsUsed: 0,
    confidence: location ? 70 : 45,
    sourceEvidence: {
      intendedSource,
      formattedAddress: propertyAddress,
      placeId: result.placeId ?? result.place_id ?? null,
      granularity: result.granularity ?? null,
      addressComponentsPresent: components.length > 0,
      allowedOutputOnly: ["formatted address", "place ID", "latitude", "longitude", "address components"],
      blockedConclusions: ["vacancy", "distress", "repairs", "ownership", "motivation", "title", "value"],
      providerCalled: false,
      providerCostCents: 0,
      liveExecutionAllowed: false,
    },
    observations: [],
    distressIndicators: [],
  });

  return candidateDraft({
    intendedSource,
    candidate,
    duplicateKey,
    duplicateStatus: classifyDuplicateStatus({
      duplicateKey,
      propertyCandidateDuplicateKeys: input.duplicateKeys?.propertyCandidates,
      leadDuplicateKeys: input.duplicateKeys?.leads,
      propertyOpportunityDuplicateKeys: input.duplicateKeys?.propertyOpportunities,
      conflictingParcelKeys: input.duplicateKeys?.conflictingParcels,
      conflictingAddressKeys: input.duplicateKeys?.conflictingAddresses,
    }),
    providerCostCents: 0,
    creditsUsed: 0,
  });
}

export function mapDealMachinePropertyToPropertyCandidateInput(input: {
  result: unknown;
  collectedAt: string;
  certificationOnly?: boolean;
  duplicateKeys?: {
    propertyCandidates?: string[];
    leads?: string[];
    propertyOpportunities?: string[];
    conflictingParcels?: string[];
    conflictingAddresses?: string[];
  };
}) {
  const result = dealMachinePropertySchema.parse(input.result);
  const propertyAddress = result.formatted_address ?? result.address ?? result.street_address;
  if (!propertyAddress) throw new Error("DealMachine property result is missing a property address.");

  const zipCode = result.zip_code ?? result.zip ?? "";
  const parcelId = result.parcel_id ?? result.apn ?? "";
  const duplicateKey = createPropertyCandidateDuplicateKey({ propertyAddress, city: result.city ?? "", state: result.state ?? "", zipCode, county: result.county ?? "", parcelId });
  const intendedSource: VirtualDfdCandidateSource = input.certificationOnly ? "virtual_dfd_internal_certification" : "dealmachine_property_search";
  const providerCostCents = result.provider_cost_cents ?? 0;
  const creditsUsed = result.credits_used ?? 0;
  const candidate = propertyCandidateInputSchema.parse({
    source: input.certificationOnly ? "virtual_dfd_internal_certification" : "manual_property_review",
    sourceDetail: "Virtual DFD DealMachine candidate preparation. Future bounded provider read only; no DealMachine call was made in this certification.",
    sourceRecordId: result.property_id ?? result.id ?? "",
    propertyAddress,
    city: result.city ?? "",
    state: result.state ?? "",
    zipCode,
    county: result.county ?? "",
    parcelId,
    latitude: result.latitude,
    longitude: result.longitude,
    coordinateSource: typeof result.latitude === "number" && typeof result.longitude === "number" ? "future_dealmachine_property_search" : "",
    ownerName: result.owner_name ?? "",
    mailingAddress: result.mailing_address ?? "",
    providerName: "DealMachine",
    providerRequestId: result.property_id ?? result.id ?? "",
    retrievedAt: input.collectedAt,
    costCents: 0,
    creditsUsed: 0,
    confidence: parcelId ? 72 : 58,
    sourceEvidence: {
      intendedSource,
      providerPropertyId: result.property_id ?? result.id ?? null,
      listId: result.list_id ?? null,
      permittedOwnerMetadataPresent: Boolean(result.owner_name || result.mailing_address),
      providerCostCents,
      creditsUsed,
      blockedWorkflows: ["skip_trace", "direct_mail", "sms", "email", "seller_outreach"],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    observations: [],
    distressIndicators: [],
  });

  return candidateDraft({
    intendedSource,
    candidate,
    duplicateKey,
    duplicateStatus: classifyDuplicateStatus({
      duplicateKey,
      propertyCandidateDuplicateKeys: input.duplicateKeys?.propertyCandidates,
      leadDuplicateKeys: input.duplicateKeys?.leads,
      propertyOpportunityDuplicateKeys: input.duplicateKeys?.propertyOpportunities,
      conflictingParcelKeys: input.duplicateKeys?.conflictingParcels,
      conflictingAddressKeys: input.duplicateKeys?.conflictingAddresses,
    }),
    providerCostCents,
    creditsUsed,
  });
}

export function evaluateVirtualDfdCostGate(input: {
  connectorId: VirtualDfdConnectorId;
  requestedQueries?: number;
  requestedCredits?: number;
  requestedCostCents?: number;
  controls?: VirtualDfdCostControls;
}) {
  const controls = input.controls ?? defaultVirtualDfdCostControls[input.connectorId];
  const requestedQueries = input.requestedQueries ?? 1;
  const requestedCredits = input.requestedCredits ?? requestedQueries;
  const requestedCostCents = input.requestedCostCents ?? requestedCredits * controls.perPropertyCostCents;
  const blockedReasons: string[] = [];

  if (controls.circuitBreaker !== "closed") blockedReasons.push("circuit_breaker_open");
  if (controls.queriesUsedToday + requestedQueries > controls.dailyQueryLimit) blockedReasons.push("daily_query_limit_exceeded");
  if (controls.creditsUsedToday + requestedCredits > controls.dailyCreditLimit) blockedReasons.push("daily_credit_limit_exceeded");
  if (controls.dollarsUsedTodayCents + requestedCostCents > controls.dailyDollarLimitCents) blockedReasons.push("daily_dollar_limit_exceeded");

  return {
    allowed: blockedReasons.length === 0,
    blockedReasons,
    dailyQueryLimit: controls.dailyQueryLimit,
    dailyCreditLimit: controls.dailyCreditLimit,
    dailyDollarLimitCents: controls.dailyDollarLimitCents,
    perPropertyCostCents: controls.perPropertyCostCents,
    creditsUsed: requestedCredits,
    providerCostCents: requestedCostCents,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function evaluateVirtualDfdProviderGate(input: {
  connectorId: VirtualDfdConnectorId;
  actionKey: string;
  requestedQueries?: number;
  requestedCredits?: number;
  requestedCostCents?: number;
  controls?: VirtualDfdCostControls;
}) {
  const connectorPlan = evaluateConnectorAction({ connectorId: input.connectorId, actionKey: input.actionKey, module: "Property Intelligence" });
  const costGate = evaluateVirtualDfdCostGate(input);
  const policy = defaultAutonomyPolicies.find((item) => item.subjectType === "connector" && item.subjectKey === input.connectorId);
  const autonomyDecision = policy
    ? evaluateAutonomyPolicy({ policy, requestedAction: input.actionKey, requestedLevel: 3, evidence: ["tenant_id", "preview_environment", "credential_scope", "feature_flag", "hard_cost_budget", "ueip_audit"] })
    : null;
  const blocked = connectorPlan.decision === "blocked" || connectorPlan.decision === "fallback_required" || !costGate.allowed || autonomyDecision?.decision === "blocked";

  return {
    decision: blocked ? "blocked" : "approval_required",
    reason: blocked ? [connectorPlan.reason, ...(costGate.blockedReasons ?? []), autonomyDecision?.reason].filter(Boolean).join(" ") : "Connector, feature, autonomy, and budget gates require exact approval before any provider read.",
    connectorPlan,
    costGate,
    autonomyDecision,
    providerCalled: false,
    providerWrite: false,
    sent: false,
    published: false,
    outreach: false,
    liveExecutionAllowed: false,
  };
}

export function createVirtualDfdRoiAttribution(input: {
  source: VirtualDfdProviderSource;
  candidateCount: number;
  verifiedCandidateCount: number;
  creditsUsed: number;
  providerCostCents: number;
  certificationRecord?: boolean;
  linkedLeadCount?: number;
  linkedPropertyOpportunityCount?: number;
  realizedRevenueCents?: number | null;
}) {
  const hasRealOutcome = typeof input.realizedRevenueCents === "number";

  return {
    source: input.source,
    providerCostCents: input.providerCostCents,
    creditsUsed: input.creditsUsed,
    candidateCount: input.candidateCount,
    verifiedCandidateCount: input.verifiedCandidateCount,
    futureLeadLinkageCount: input.linkedLeadCount ?? 0,
    futurePropertyOpportunityLinkageCount: input.linkedPropertyOpportunityCount ?? 0,
    excludedFromBusinessRoi: input.certificationRecord === true,
    realizedRevenueCents: hasRealOutcome ? input.realizedRevenueCents : null,
    roiState: hasRealOutcome && input.realizedRevenueCents === 0 ? "ZERO_REVENUE" : hasRealOutcome ? "REAL_OUTCOME_RECORDED" : "INSUFFICIENT_REAL_OUTCOME_DATA",
    fabricatedRoi: false,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createVirtualDfdConnectorFoundationReport() {
  const featureSnapshot = getFeatureFlagSnapshot();

  return {
    architecture: "Google Geocoding and DealMachine prepare existing PropertyCandidate inputs only; human verification is required before any future PropertyOpportunity promotion.",
    existingArchitectureReused: "20260816210000_add_property_candidate_foundation",
    propertyCandidateCostField: "costCents is the canonical stored provider cost field; providerCostCents is used in connector/ROI contracts and persisted in sourceEvidence for future provider reads.",
    dealMachineApiCapabilityConfirmed: "official API quickstart confirms REST API property search, count, credits, fields, filters, lists, exports, and bearer API key auth; account-specific scopes remain blocked until credential review",
    ueipIntegration: ["tenant", "AutonomyPolicy", "connector health", "credential scope", "feature flag", "quota", "cost budget", "kill switch", "audit", "idempotency"],
    authModel: {
      google_geocoding: "api_key_or_oauth_geocode_address_scope_reference_only",
      dealmachine_property_search: "bearer_api_key_reference_only",
    },
    costControls: defaultVirtualDfdCostControls,
    duplicateDoctrine: "parcel:{county}:{parcel} preferred; address fallback through PropertyOpportunity duplicate key helper; duplicates checked against PropertyCandidate, Lead, and PropertyOpportunity; no silent merge.",
    aiEmployeeAssignments: {
      propertySignalAnalyst: "Level 1-2 candidate review and data quality notes",
      dealAnalyst: "Level 1-2 verification packet preparation only",
      revenueOperations: "ROI attribution ledger preparation from real stored outcomes only",
      autonomousOperationsSupervisor: "Policy, budget, and kill-switch monitoring",
    },
    roiAttributionSources: ["google_geocode", "dealmachine_property_search"],
    disabledFlags: featureSnapshot.disabled.filter((flag) => ["connector_property_data", "virtual_dfd_connectors", "google_geocoding_runtime", "dealmachine_property_search_runtime"].includes(flag)),
    safetyState: virtualDfdSafetyFlags,
    previewCertification: "internal_property_candidate_plumbing_only_no_provider_calls",
  };
}

export function getNormalizedAddressForDraft(draft: VirtualDfdCandidateDraft) {
  return normalizePropertyCandidateAddress(draft.propertyCandidateInput);
}
