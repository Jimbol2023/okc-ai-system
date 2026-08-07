import type { StoredLead } from "@/lib/leads-storage";
import {
  createPropertyOpportunityDuplicateKey,
  propertyOpportunitySafetyFlags,
  type PropertyOpportunityRecord,
} from "@/lib/property-opportunity-engine";

export type PropertyEvidenceGap =
  | "internal_lead_not_adapted"
  | "property_identity"
  | "owner_identity"
  | "owner_mailing_address"
  | "parcel_county"
  | "map_geocode"
  | "route_planning"
  | "property_characteristics"
  | "distress_validation"
  | "condition_media"
  | "contact_enrichment"
  | "direct_mail_readiness";

export type PropertySourcePriority =
  | "internal_existing_evidence"
  | "manual_dfd"
  | "county_public_records"
  | "county_gis"
  | "maps_geocoding"
  | "licensed_property_data"
  | "licensed_skip_trace"
  | "direct_mail_provider";

export type PropertySourceActivationState =
  | "use_now_internal"
  | "ready_for_manual_research"
  | "ready_for_readonly_connector_planning"
  | "blocked_until_property_qualified"
  | "blocked_until_human_approval";

export type PropertySourcePriorityRecommendation = {
  gap: PropertyEvidenceGap;
  label: string;
  affectedRecords: number;
  sourcePriority: PropertySourcePriority[];
  activationState: PropertySourceActivationState;
  reason: string;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertySourcePriorityMorningBriefSignal = {
  title: string;
  summary: string;
  priority: "High" | "Medium" | "Low";
  evidenceGap: PropertyEvidenceGap;
  affectedRecords: number;
  recommendedAction: string;
  sourcePriority: PropertySourcePriority[];
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertySourcePriorityException = {
  type: "property_source_data_gap" | "provider_activation_blocked" | "opportunity_evidence_access_gap";
  title: string;
  detail: string;
  evidenceGap: PropertyEvidenceGap;
  affectedRecords: number;
  engineeringRemediationRequired: true;
  ceoBusinessDecisionRequired: false;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertyProviderReadinessItem = {
  source: PropertySourcePriority;
  label: string;
  role: string;
  bestUse: string;
  activationState: PropertySourceActivationState;
  requiresSeparateApproval: boolean;
  prohibitedInV1: boolean;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertyProviderSourcePriorityReport = {
  ok: true;
  generatedAt: string;
  title: "Property Provider Readiness And Source Priority Layer";
  summary: string;
  totals: {
    opportunities: number;
    leads: number;
    evidenceGaps: number;
    internalFirstRecommendations: number;
    providerCandidates: number;
    blockedProviderActions: number;
  };
  sourcePriority: PropertySourcePriorityRecommendation[];
  morningBriefSignals: PropertySourcePriorityMorningBriefSignal[];
  exceptionInboxItems: PropertySourcePriorityException[];
  providerReadiness: PropertyProviderReadinessItem[];
  operatingDoctrine: string[];
  exactRecommendedNextImplementation: "IMPLEMENT_COUNTY_RECORD_IMPORT_WORKBENCH_AND_PROVIDER_DECISION_GATE";
  safetyFlags: typeof propertyOpportunitySafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

type SourcePriorityInput = {
  opportunities?: PropertyOpportunityRecord[];
  leads?: StoredLead[];
  generatedAt?: Date;
  opportunityDataAccessIssue?: string | null;
};

const labels: Record<PropertyEvidenceGap, string> = {
  internal_lead_not_adapted: "Existing lead has property evidence but is not yet a PropertyOpportunity",
  property_identity: "Property identity is incomplete",
  owner_identity: "Owner identity is incomplete",
  owner_mailing_address: "Owner mailing address is incomplete",
  parcel_county: "Parcel or county evidence is incomplete",
  map_geocode: "Map/geocode evidence is incomplete",
  route_planning: "Route planning evidence is incomplete",
  property_characteristics: "Property characteristics are incomplete",
  distress_validation: "Distress evidence needs validation",
  condition_media: "Condition photo or observation evidence is incomplete",
  contact_enrichment: "Contact enrichment is premature or approval-gated",
  direct_mail_readiness: "Direct mail readiness is approval-gated",
};

const providerReadiness: PropertyProviderReadinessItem[] = [
  {
    source: "internal_existing_evidence",
    label: "Internal J Capital evidence",
    role: "Use existing lead, DFD, acquisition, and county/import records before any vendor.",
    bestUse: "Create and dedupe PropertyOpportunity records from already persisted evidence.",
    activationState: "use_now_internal",
    requiresSeparateApproval: false,
    prohibitedInV1: false,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "manual_dfd",
    label: "Manual DFD observations",
    role: "Capture pins, visible condition notes, and photo metadata entered by an authenticated user.",
    bestUse: "Validate distress and prioritize field review without GPS surveillance.",
    activationState: "use_now_internal",
    requiresSeparateApproval: false,
    prohibitedInV1: false,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "county_public_records",
    label: "County public records",
    role: "Verify ownership, mailing address, parcel, tax, probate/inherited, and vacancy evidence.",
    bestUse: "Oklahoma-specific property truth after internal records.",
    activationState: "ready_for_manual_research",
    requiresSeparateApproval: false,
    prohibitedInV1: false,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "county_gis",
    label: "County GIS",
    role: "Confirm parcels, geometry, property characteristics, and location context.",
    bestUse: "Fill parcel/map gaps before paying for broad property data.",
    activationState: "ready_for_readonly_connector_planning",
    requiresSeparateApproval: true,
    prohibitedInV1: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "maps_geocoding",
    label: "Maps/geocoding provider",
    role: "Normalize addresses, map pins, and route planning inputs.",
    bestUse: "Map discovery and route planning after persisted records need coordinates.",
    activationState: "ready_for_readonly_connector_planning",
    requiresSeparateApproval: true,
    prohibitedInV1: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "licensed_property_data",
    label: "Licensed property data provider",
    role: "Backfill property characteristics, valuation references, ownership, and tax signals at scale.",
    bestUse: "Use only where internal/county evidence cannot economically close the data gap.",
    activationState: "blocked_until_property_qualified",
    requiresSeparateApproval: true,
    prohibitedInV1: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "licensed_skip_trace",
    label: "Skip trace/contact enrichment provider",
    role: "Find owner contact channels after property value is established.",
    bestUse: "High-value opportunities only, after human-approved enrichment governance.",
    activationState: "blocked_until_human_approval",
    requiresSeparateApproval: true,
    prohibitedInV1: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
  {
    source: "direct_mail_provider",
    label: "Direct mail provider",
    role: "Send approved mail campaigns after evidence, list, copy, and budget approval.",
    bestUse: "Future governed outbound execution, never as V1 readiness.",
    activationState: "blocked_until_human_approval",
    requiresSeparateApproval: true,
    prohibitedInV1: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  },
];

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function countOpportunities(opportunities: PropertyOpportunityRecord[], predicate: (opportunity: PropertyOpportunityRecord) => boolean) {
  return opportunities.filter(predicate).length;
}

function recommendation(
  gap: PropertyEvidenceGap,
  affectedRecords: number,
  sourcePriority: PropertySourcePriority[],
  activationState: PropertySourceActivationState,
  reason: string,
): PropertySourcePriorityRecommendation | null {
  if (affectedRecords <= 0) return null;

  return {
    gap,
    label: labels[gap],
    affectedRecords,
    sourcePriority,
    activationState,
    reason,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

function isProviderSource(source: PropertySourcePriority) {
  return source === "maps_geocoding" || source === "licensed_property_data" || source === "licensed_skip_trace" || source === "direct_mail_provider";
}

function priorityForRecommendation(recommendation: PropertySourcePriorityRecommendation): "High" | "Medium" | "Low" {
  if (recommendation.activationState === "blocked_until_human_approval" || recommendation.activationState === "blocked_until_property_qualified") return "High";
  if (recommendation.affectedRecords >= 3 || recommendation.sourcePriority.some(isProviderSource)) return "Medium";
  return "Low";
}

function actionForRecommendation(recommendation: PropertySourcePriorityRecommendation) {
  switch (recommendation.activationState) {
    case "use_now_internal":
      return "Use internal J Capital evidence or manual DFD capture; do not call providers.";
    case "ready_for_manual_research":
      return "Assign county/public-record research and preserve source provenance.";
    case "ready_for_readonly_connector_planning":
      return "Prepare a read-only connector plan only after separate approval.";
    case "blocked_until_property_qualified":
      return "Keep paid property data blocked until the opportunity is qualified and the data gap is material.";
    case "blocked_until_human_approval":
      return "Keep enrichment, mail, and outbound execution blocked pending separate human approval.";
  }
}

function createMorningBriefSignals(recommendations: PropertySourcePriorityRecommendation[]): PropertySourcePriorityMorningBriefSignal[] {
  return recommendations
    .slice()
    .sort((a, b) => b.affectedRecords - a.affectedRecords || priorityForRecommendation(a).localeCompare(priorityForRecommendation(b)) || a.label.localeCompare(b.label))
    .slice(0, 6)
    .map((item) => ({
      title: item.label,
      summary: `${item.affectedRecords} property record(s) affected. ${item.reason}`,
      priority: priorityForRecommendation(item),
      evidenceGap: item.gap,
      affectedRecords: item.affectedRecords,
      recommendedAction: actionForRecommendation(item),
      sourcePriority: item.sourcePriority,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    }));
}

function createExceptionInboxItems(
  recommendations: PropertySourcePriorityRecommendation[],
  opportunityDataAccessIssue?: string | null,
): PropertySourcePriorityException[] {
  return recommendations
    .filter((item) => item.gap === "property_identity" || item.sourcePriority.some(isProviderSource) || item.activationState.startsWith("blocked_until"))
    .slice(0, 8)
    .map((item) => {
      const providerBlocked = item.activationState === "blocked_until_human_approval" || item.activationState === "blocked_until_property_qualified";
      const evidenceAccessGap = Boolean(opportunityDataAccessIssue) && item.gap === "property_identity";

      return {
        type: evidenceAccessGap ? "opportunity_evidence_access_gap" : providerBlocked ? "provider_activation_blocked" : "property_source_data_gap",
        title: evidenceAccessGap ? "Property opportunity evidence access gap" : providerBlocked ? "Property provider activation remains blocked" : item.label,
        detail: `${item.reason} Recommended source order: ${item.sourcePriority.join(" -> ")}.`,
        evidenceGap: item.gap,
        affectedRecords: item.affectedRecords,
        engineeringRemediationRequired: true,
        ceoBusinessDecisionRequired: false,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      };
    });
}

export function createPropertyProviderSourcePriorityReport(input: SourcePriorityInput = {}): PropertyProviderSourcePriorityReport {
  const opportunities = input.opportunities ?? [];
  const leads = input.leads ?? [];
  const opportunityDuplicateKeys = new Set(opportunities.map((opportunity) => opportunity.duplicateKey));
  const leadPropertyRecords = leads.filter((lead) => hasText(lead.propertyAddress));

  const recommendations = [
    recommendation(
      "internal_lead_not_adapted",
      leadPropertyRecords.filter((lead) => !opportunityDuplicateKeys.has(createPropertyOpportunityDuplicateKey(lead))).length,
      ["internal_existing_evidence", "manual_dfd"],
      "use_now_internal",
      "Existing lead/import records should feed the internal opportunity spine before any vendor is considered.",
    ),
    recommendation(
      "property_identity",
      countOpportunities(opportunities, (opportunity) => !hasText(opportunity.propertyAddress) || !hasText(opportunity.canonicalAddress)),
      ["internal_existing_evidence", "county_public_records", "county_gis", "maps_geocoding", "licensed_property_data"],
      "ready_for_manual_research",
      "Canonical identity must be resolved from persisted or county evidence before enrichment, mail, or outreach.",
    ),
    recommendation(
      "owner_identity",
      countOpportunities(opportunities, (opportunity) => !hasText(opportunity.ownerName)),
      ["internal_existing_evidence", "county_public_records", "licensed_property_data"],
      "ready_for_manual_research",
      "Owner identity should come from internal imports or county records before paid property-data backfill.",
    ),
    recommendation(
      "owner_mailing_address",
      countOpportunities(opportunities, (opportunity) => !hasText(opportunity.mailingAddress)),
      ["internal_existing_evidence", "county_public_records", "licensed_property_data"],
      "ready_for_manual_research",
      "Mailing address is needed for future mail readiness but does not authorize contact.",
    ),
    recommendation(
      "parcel_county",
      countOpportunities(opportunities, (opportunity) => !hasText(opportunity.parcelId) || !hasText(opportunity.county)),
      ["internal_existing_evidence", "county_public_records", "county_gis", "licensed_property_data"],
      "ready_for_manual_research",
      "Parcel and county evidence anchors Oklahoma-specific deduplication and acquisition review.",
    ),
    recommendation(
      "distress_validation",
      countOpportunities(opportunities, (opportunity) => opportunity.distressIndicators.length === 0),
      ["manual_dfd", "county_public_records", "county_gis", "licensed_property_data"],
      "ready_for_manual_research",
      "Distress signals should be validated by observations or public evidence before scoring moves work to acquisitions.",
    ),
    recommendation(
      "condition_media",
      countOpportunities(opportunities, (opportunity) => opportunity.observations.length === 0 || opportunity.photoMetadata.length === 0),
      ["manual_dfd"],
      "use_now_internal",
      "Manual observations and photo metadata improve DFD ranking without GPS surveillance or provider calls.",
    ),
    recommendation(
      "map_geocode",
      countOpportunities(opportunities, (opportunity) => hasText(opportunity.propertyAddress)),
      ["internal_existing_evidence", "maps_geocoding", "county_gis"],
      "ready_for_readonly_connector_planning",
      "Maps should be planned for pin placement and route context only after persisted property records exist.",
    ),
    recommendation(
      "contact_enrichment",
      countOpportunities(opportunities, (opportunity) => opportunity.opportunityPriority === "High" && hasText(opportunity.ownerName)),
      ["licensed_skip_trace"],
      "blocked_until_human_approval",
      "Skip tracing is a future governed adapter for qualified opportunities only; it remains blocked in V1.",
    ),
    recommendation(
      "direct_mail_readiness",
      countOpportunities(opportunities, (opportunity) => opportunity.opportunityPriority === "High" && hasText(opportunity.mailingAddress)),
      ["direct_mail_provider"],
      "blocked_until_human_approval",
      "Direct mail requires separate campaign, copy, budget, compliance, and approval controls.",
    ),
  ].filter((item): item is PropertySourcePriorityRecommendation => item !== null);

  if (input.opportunityDataAccessIssue) {
    recommendations.unshift({
      gap: "property_identity",
      label: "PropertyOpportunity evidence access is incomplete",
      affectedRecords: 1,
      sourcePriority: ["internal_existing_evidence"],
      activationState: "use_now_internal",
      reason: input.opportunityDataAccessIssue,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    });
  }

  const providerCandidates = recommendations.filter((item) => item.sourcePriority.some(isProviderSource)).length;
  const blockedProviderActions = providerReadiness.filter((item) => item.prohibitedInV1 || item.requiresSeparateApproval).length;
  const morningBriefSignals = createMorningBriefSignals(recommendations);
  const exceptionInboxItems = createExceptionInboxItems(recommendations, input.opportunityDataAccessIssue);

  return {
    ok: true,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    title: "Property Provider Readiness And Source Priority Layer",
    summary:
      "Hybrid strategy certified: use J Capital internal evidence and Oklahoma county records first, plan provider adapters only for unresolved high-value gaps, and keep all outbound/enrichment execution approval-gated.",
    totals: {
      opportunities: opportunities.length,
      leads: leads.length,
      evidenceGaps: recommendations.length,
      internalFirstRecommendations: recommendations.filter((item) => item.sourcePriority[0] === "internal_existing_evidence" || item.sourcePriority[0] === "manual_dfd").length,
      providerCandidates,
      blockedProviderActions,
    },
    sourcePriority: recommendations,
    morningBriefSignals,
    exceptionInboxItems,
    providerReadiness,
    operatingDoctrine: [
      "Local audit credentials are not the source of truth for Production opportunity evidence.",
      "Internal persisted evidence and county/public records outrank paid property providers.",
      "Provider readiness never authorizes provider calls, scraping, skip tracing, sending, direct mail, or CRM mutation.",
      "DealMachine is not integrated in V1; provider adapters remain future governed connectors.",
    ],
    exactRecommendedNextImplementation: "IMPLEMENT_COUNTY_RECORD_IMPORT_WORKBENCH_AND_PROVIDER_DECISION_GATE",
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

export function assertPropertyProviderSourcePrioritySafety(report: PropertyProviderSourcePriorityReport) {
  const unsafe =
    report.providerCalled ||
    report.sent ||
    report.published ||
    report.crmMutated ||
    report.liveExecutionAllowed ||
    report.sourcePriority.some((item) => item.providerCalled || item.sent || item.published || item.crmMutated || item.liveExecutionAllowed) ||
    report.morningBriefSignals.some((item) => item.providerCalled || item.sent || item.published || item.crmMutated || item.liveExecutionAllowed) ||
    report.exceptionInboxItems.some((item) => item.providerCalled || item.sent || item.published || item.crmMutated || item.liveExecutionAllowed || item.ceoBusinessDecisionRequired) ||
    report.providerReadiness.some((item) => item.providerCalled || item.sent || item.published || item.crmMutated || item.liveExecutionAllowed);

  if (unsafe) {
    throw new Error("Property provider source priority layer attempted an unsafe external action");
  }
}
