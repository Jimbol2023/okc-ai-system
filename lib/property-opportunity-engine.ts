import { z } from "zod";

import { getActiveDistressFlags, normalizeDistressFlags, type DistressFlags } from "@/lib/distress-flags";
import type { StoredLead } from "@/lib/leads-storage";
import { createDashboardPropertyRecords } from "@/lib/property-records";

export const propertyOpportunitySafetyFlags = {
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

export const propertyOpportunityFilterKeys = [
  "driving_for_dollars",
  "tax_county",
  "out_of_state",
  "absentee_owner",
  "probate_inherited",
  "vacancy",
  "major_repairs",
  "duplicate_risk",
  "stale_observation",
  "missing_owner_data",
] as const;

export type PropertyOpportunityFilterKey = (typeof propertyOpportunityFilterKeys)[number];
export type PropertyOpportunityPriority = "High" | "Medium" | "Low";
export type PropertyOpportunityExceptionType =
  | "missing_property_identity"
  | "missing_owner_evidence"
  | "duplicate_property_conflict"
  | "unsafe_enrichment_blocked"
  | "high_value_acquisition_review";

export type PropertyOpportunityRecord = {
  id: string;
  tenantId: string;
  canonicalAddress: string;
  propertyAddress: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  county: string | null;
  parcelId: string | null;
  ownerName: string | null;
  mailingAddress: string | null;
  source: string;
  sourceDetail: string | null;
  evidence: unknown;
  distressIndicators: string[];
  observations: PropertyOpportunityObservation[];
  photoMetadata: PropertyOpportunityPhotoMetadata[];
  opportunityScore: number;
  opportunityPriority: PropertyOpportunityPriority;
  confidence: number;
  duplicateKey: string;
  duplicateRisk: boolean;
  missingEvidence: string[];
  recommendedAction: string;
  safetyFlags: typeof propertyOpportunitySafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
  createdBy: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export type PropertyOpportunitySavedFilterRecord = {
  id: string;
  tenantId: string;
  name: string;
  filterKey: PropertyOpportunityFilterKey;
  criteria: Record<string, unknown>;
  safetyFlags: typeof propertyOpportunitySafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
  createdBy: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export type PropertyOpportunityException = {
  type: PropertyOpportunityExceptionType;
  propertyOpportunityId: string;
  title: string;
  detail: string;
  engineeringRemediationRequired: boolean;
  ceoBusinessDecisionRequired: false;
};

export type PropertyOpportunityMorningBriefSignal = {
  propertyOpportunityId: string;
  title: string;
  summary: string;
  priority: PropertyOpportunityPriority;
  opportunityScore: number;
  recommendedAction: string;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertyOpportunitySummary = {
  total: number;
  highPriority: number;
  duplicateRisk: number;
  missingOwnerEvidence: number;
  unsafeFlags: number;
  morningBriefSignals: PropertyOpportunityMorningBriefSignal[];
  exceptionInboxItems: PropertyOpportunityException[];
  safetyFlags: typeof propertyOpportunitySafetyFlags;
};

export type PropertyOpportunitySourceChannel =
  | "manual_dfd"
  | "tax_county"
  | "public_record_import"
  | "inbound_crm"
  | "referral_relationship"
  | "unknown";

export type PropertyOpportunityStreamState = "healthy" | "thin" | "starved" | "needs_cleanup";

export type PropertyOpportunitySourceHealth = {
  channel: PropertyOpportunitySourceChannel;
  count: number;
  highPriority: number;
  duplicateRisk: number;
  missingOwnerEvidence: number;
};

export type PropertyOpportunityStreamAudit = {
  generatedAt: string;
  windowDays: number;
  streamState: PropertyOpportunityStreamState;
  totalOpportunities: number;
  recentOpportunities: number;
  highPriorityRecent: number;
  activeSourceChannels: number;
  sourceHealth: PropertyOpportunitySourceHealth[];
  bottlenecks: string[];
  highestValueImprovement: string;
  exactRecommendedNextImplementation: "IMPLEMENT_EXISTING_LEAD_AND_IMPORT_TO_PROPERTY_OPPORTUNITY_ADAPTER";
  morningBriefLine: string;
  safetyFlags: typeof propertyOpportunitySafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertyOpportunityTaskResult = {
  created: boolean;
  taskId: string | null;
  title: string;
  taskType: "property_opportunity_acquisition_review";
  requiresApproval: true;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export type PropertyOpportunityLeadAdapterReport = {
  scannedLeads: number;
  eligiblePropertyLeads: number;
  realLeads: number;
  excludedLeads: number;
  ambiguousLeads: number;
  createdOpportunities: number;
  updatedOpportunities: number;
  acquisitionReviewTasksCreated: number;
  acquisitionReviewTasksReused: number;
  skippedMissingPropertyAddress: number;
  adaptedOpportunityIds: string[];
  provenanceCounts: Record<LeadProvenanceClassification, number>;
  streamAudit: PropertyOpportunityStreamAudit;
  safetyFlags: typeof propertyOpportunitySafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
};

export const leadProvenanceClassifications = ["real", "synthetic", "test", "demo", "certification", "ambiguous"] as const;
export type LeadProvenanceClassification = (typeof leadProvenanceClassifications)[number];

export type LeadOpportunityEligibility = {
  leadId: string;
  classification: LeadProvenanceClassification;
  eligible: boolean;
  reasonCodes: string[];
  duplicateKey: string | null;
};

export type ExistingLeadAdaptationDryRun = {
  totalLeads: number;
  legitimateRealLeads: number;
  missingPropertyIdentity: number;
  eligibleForAdaptation: number;
  blockedByConsentOrDnc: number;
  blockedByInsufficientEvidence: number;
  duplicatePropertyIdentities: number;
  existingPropertyOpportunities: number;
  opportunitiesAlreadyLinkedToLeads: number;
  existingAcquisitionReviewTasks: number;
  eligibleOpportunitiesAtOrAbove72: number;
  opportunitiesBelowThreshold: number;
  wouldCreateOpportunity: number;
  wouldReuseOrUpdateOpportunity: number;
  wouldCreateAcquisitionReviewTask: number;
  wouldReuseAcquisitionReviewTask: number;
  providerCalled: false;
  sent: false;
  outreach: false;
  published: false;
  crmMutation: false;
  externalExecutionAllowed: false;
  liveExecutionAllowed: false;
};

const realLeadSourcePattern = /(?:^|[_\s-])(website|website_form|referral|manual|manual_dfd|driving_for_dollars|county|county_list|public_record|assessor|treasurer|clerk|crm|inbound|phone_call|google_business_profile|facebook_message|instagram_dm|tiktok|linkedin|offline|door_knocking_offline)(?:$|[_\s-])/i;

export function classifyLeadProvenance(lead: Pick<StoredLead, "id" | "source" | "sourceDetail" | "propertyAddress" | "city" | "state" | "zipCode" | "parcelId" | "county">): LeadOpportunityEligibility {
  const provenance = `${lead.source} ${lead.sourceDetail ?? ""}`.trim().toLowerCase();
  let classification: LeadProvenanceClassification = "ambiguous";

  if (/\bsynthetic\b|pressure[_\s-]?harness/.test(provenance)) classification = "synthetic";
  else if (/\b(?:test|fixture|acceptance)\b/.test(provenance)) classification = "test";
  else if (/\bdemo\b/.test(provenance)) classification = "demo";
  else if (/\bcertification\b|cert[_\s-]?record/.test(provenance)) classification = "certification";
  else if (realLeadSourcePattern.test(` ${provenance} `)) classification = "real";

  const reasonCodes = [
    classification !== "real" ? `provenance_${classification}` : "",
    !lead.propertyAddress.trim() ? "property_address_missing" : "",
  ].filter(Boolean);
  const duplicateKey = lead.propertyAddress.trim()
    ? createPropertyOpportunityDuplicateKey({
        propertyAddress: lead.propertyAddress,
        city: lead.city,
        state: lead.state,
        zipCode: lead.zipCode,
        parcelId: lead.parcelId,
        county: lead.county,
      })
    : null;

  return { leadId: lead.id, classification, eligible: classification === "real" && reasonCodes.length === 0, reasonCodes, duplicateKey };
}

export function createExistingLeadEligibilityReport(leads: StoredLead[]) {
  const records = leads.map(classifyLeadProvenance);
  const duplicateCounts = new Map<string, number>();
  records.forEach((record) => {
    if (record.duplicateKey) duplicateCounts.set(record.duplicateKey, (duplicateCounts.get(record.duplicateKey) ?? 0) + 1);
  });
  const provenanceCounts = Object.fromEntries(leadProvenanceClassifications.map((classification) => [classification, records.filter((record) => record.classification === classification).length])) as Record<LeadProvenanceClassification, number>;

  return {
    scannedLeads: records.length,
    eligiblePropertyLeads: records.filter((record) => record.eligible).length,
    excludedLeads: records.filter((record) => !record.eligible).length,
    ambiguousLeads: provenanceCounts.ambiguous,
    duplicateCandidates: records.filter((record) => record.duplicateKey && (duplicateCounts.get(record.duplicateKey) ?? 0) > 1).length,
    provenanceCounts,
    reasonCounts: records.flatMap((record) => record.reasonCodes).reduce<Record<string, number>>((counts, reason) => ({ ...counts, [reason]: (counts[reason] ?? 0) + 1 }), {}),
    records,
    providerCalled: false as const,
    sent: false as const,
    published: false as const,
    crmMutated: false as const,
    liveExecutionAllowed: false as const,
  };
}

export type PropertyOpportunityDb = {
  propertyOpportunity: {
    findMany(args: unknown): Promise<PropertyOpportunityRecord[]>;
    findFirst(args: unknown): Promise<PropertyOpportunityRecord | null>;
    upsert(args: unknown): Promise<PropertyOpportunityRecord>;
    update(args: unknown): Promise<PropertyOpportunityRecord>;
  };
  propertyOpportunitySavedFilter: {
    findMany(args: unknown): Promise<PropertyOpportunitySavedFilterRecord[]>;
    upsert(args: unknown): Promise<PropertyOpportunitySavedFilterRecord>;
  };
  revenueTask: {
    findFirst(args: unknown): Promise<{ id: string } | null>;
    create(args: unknown): Promise<{ id: string }>;
  };
};

const optionalString = z.string().trim().max(500).optional().default("");
const boundedText = z.string().trim().max(2000).optional().default("");

export const propertyOpportunityObservationSchema = z.object({
  observedAt: z.string().trim().max(80),
  note: z.string().trim().min(1).max(1200),
  condition: z.string().trim().max(120).optional().default("manual_observation"),
  source: z.string().trim().max(120).optional().default("manual_dfd"),
});

export type PropertyOpportunityObservation = z.infer<typeof propertyOpportunityObservationSchema>;

export const propertyOpportunityPhotoMetadataSchema = z.object({
  fileName: z.string().trim().max(240),
  contentType: z.string().trim().max(120).optional().default("image/*"),
  caption: z.string().trim().max(500).optional().default(""),
});

export type PropertyOpportunityPhotoMetadata = z.infer<typeof propertyOpportunityPhotoMetadataSchema>;

export const manualDfdPropertyOpportunitySchema = z.object({
  propertyAddress: z.string().trim().min(3).max(300),
  city: optionalString,
  state: optionalString,
  zipCode: optionalString,
  county: optionalString,
  parcelId: optionalString,
  ownerName: optionalString,
  mailingAddress: optionalString,
  source: z.string().trim().max(120).optional().default("manual_dfd"),
  sourceDetail: boundedText,
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
  observations: z.array(propertyOpportunityObservationSchema).max(12).optional().default([]),
  photoMetadata: z.array(propertyOpportunityPhotoMetadataSchema).max(12).optional().default([]),
  evidence: z.record(z.string(), z.unknown()).optional().default({}),
  unsafeEnrichmentRequested: z.boolean().optional().default(false),
});

export type ManualDfdPropertyOpportunityInput = z.infer<typeof manualDfdPropertyOpportunitySchema>;

export const savedPropertyOpportunityFilterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  filterKey: z.enum(propertyOpportunityFilterKeys),
  criteria: z.record(z.string(), z.unknown()).optional().default({}),
});

export type SavedPropertyOpportunityFilterInput = z.infer<typeof savedPropertyOpportunityFilterSchema>;

function normalizeText(value: string | null | undefined) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function canonicalizeAddress(input: Pick<ManualDfdPropertyOpportunityInput, "propertyAddress" | "city" | "state" | "zipCode">) {
  return [input.propertyAddress, input.city, input.state, input.zipCode]
    .map(normalizeText)
    .filter(Boolean)
    .join(", ")
    .toLowerCase();
}

export function createPropertyOpportunityDuplicateKey(input: Pick<ManualDfdPropertyOpportunityInput, "propertyAddress" | "city" | "state" | "zipCode" | "parcelId" | "county">) {
  const parcel = normalizeText(input.parcelId).toLowerCase();
  const county = normalizeText(input.county).toLowerCase();

  if (parcel) return `parcel:${county || "unknown_county"}:${parcel}`;

  return `address:${canonicalizeAddress(input)}`;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getPriority(score: number): PropertyOpportunityPriority {
  if (score >= 72) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

function getTime(value: Date | string | null | undefined) {
  if (!value) return 0;

  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function classifyPropertyOpportunitySource(opportunity: Pick<PropertyOpportunityRecord, "source" | "sourceDetail" | "evidence">): PropertyOpportunitySourceChannel {
  const evidenceText = typeof opportunity.evidence === "object" && opportunity.evidence !== null ? JSON.stringify(opportunity.evidence) : "";
  const sourceText = `${opportunity.source} ${opportunity.sourceDetail ?? ""} ${evidenceText}`.toLowerCase();

  if (sourceText.includes("dfd") || sourceText.includes("driving")) return "manual_dfd";
  if (sourceText.includes("tax") || sourceText.includes("county") || sourceText.includes("assessor") || sourceText.includes("parcel")) return "tax_county";
  if (sourceText.includes("import") || sourceText.includes("csv") || sourceText.includes("list") || sourceText.includes("public_record")) return "public_record_import";
  if (sourceText.includes("website") || sourceText.includes("web") || sourceText.includes("inbound") || sourceText.includes("crm")) return "inbound_crm";
  if (sourceText.includes("referral") || sourceText.includes("partner")) return "referral_relationship";

  return "unknown";
}

function missingEvidenceFor(input: ManualDfdPropertyOpportunityInput) {
  return [
    !normalizeText(input.propertyAddress) ? "property address" : "",
    !normalizeText(input.parcelId) ? "parcel ID" : "",
    !normalizeText(input.ownerName) && !normalizeText(input.mailingAddress) ? "owner name or mailing address" : "",
    input.observations.length === 0 ? "manual observation" : "",
  ].filter(Boolean);
}

export function scorePropertyOpportunity(input: ManualDfdPropertyOpportunityInput, duplicateRisk = false) {
  const distressFlags = normalizeDistressFlags(input.distressFlags as Partial<DistressFlags>);
  const activeDistressFlags = getActiveDistressFlags(distressFlags);
  const missingEvidence = missingEvidenceFor(input);
  const evidenceCompleteness = clampScore(100 - missingEvidence.length * 14);
  const observationStrength = clampScore(input.observations.length * 16 + input.photoMetadata.length * 6);
  const identityStrength = clampScore((input.parcelId ? 34 : 0) + (input.county ? 14 : 0) + (input.ownerName || input.mailingAddress ? 24 : 0) + 22);
  const distressStrength = clampScore(activeDistressFlags.length * 18);
  const duplicatePenalty = duplicateRisk ? 18 : 0;
  const unsafePenalty = input.unsafeEnrichmentRequested ? 28 : 0;
  const opportunityScore = clampScore(
    distressStrength * 0.36 + evidenceCompleteness * 0.25 + observationStrength * 0.2 + identityStrength * 0.19 - duplicatePenalty - unsafePenalty,
  );

  return {
    opportunityScore,
    opportunityPriority: getPriority(opportunityScore),
    confidence: clampScore(56 + identityStrength * 0.24 + evidenceCompleteness * 0.2 + observationStrength * 0.1 - (duplicateRisk ? 12 : 0)),
    distressIndicators: activeDistressFlags.map((flag) => flag.key),
    missingEvidence,
    recommendedAction:
      opportunityScore >= 72
        ? "Create an approval-required acquisition review task for this property opportunity."
        : missingEvidence.length > 0
          ? "Complete missing property evidence before acquisition review."
          : "Keep in monitored DFD opportunity queue until stronger evidence appears.",
  };
}

function assertPropertyOpportunitySafety(record: {
  providerCalled?: boolean;
  sent?: boolean;
  published?: boolean;
  crmMutated?: boolean;
  liveExecutionAllowed?: boolean;
}) {
  if (record.providerCalled || record.sent || record.published || record.crmMutated || record.liveExecutionAllowed) {
    throw new Error("Property Opportunity Engine safety flags must remain false for provider calls, sends, publishing, CRM mutation, and live execution.");
  }
}

export function assertPropertyOpportunityEngineSafety(result: {
  opportunities?: Array<Partial<PropertyOpportunityRecord>>;
  filters?: Array<Partial<PropertyOpportunitySavedFilterRecord>>;
  summary?: Partial<PropertyOpportunitySummary>;
  task?: Partial<PropertyOpportunityTaskResult>;
}) {
  result.opportunities?.forEach(assertPropertyOpportunitySafety);
  result.filters?.forEach(assertPropertyOpportunitySafety);
  if (result.task) assertPropertyOpportunitySafety(result.task);
  if (result.summary?.safetyFlags !== undefined && result.summary.safetyFlags !== propertyOpportunitySafetyFlags) {
    throw new Error("Property Opportunity Engine summary must expose canonical safety flags.");
  }
}

function mapOpportunity(record: PropertyOpportunityRecord): PropertyOpportunityRecord {
  assertPropertyOpportunitySafety(record);

  return {
    ...record,
    city: record.city ?? null,
    state: record.state ?? null,
    zipCode: record.zipCode ?? null,
    county: record.county ?? null,
    parcelId: record.parcelId ?? null,
    ownerName: record.ownerName ?? null,
    mailingAddress: record.mailingAddress ?? null,
    sourceDetail: record.sourceDetail ?? null,
    distressIndicators: Array.isArray(record.distressIndicators) ? record.distressIndicators : [],
    observations: Array.isArray(record.observations) ? record.observations : [],
    photoMetadata: Array.isArray(record.photoMetadata) ? record.photoMetadata : [],
    missingEvidence: Array.isArray(record.missingEvidence) ? record.missingEvidence : [],
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

export function createPropertyOpportunitySummary(opportunities: PropertyOpportunityRecord[]): PropertyOpportunitySummary {
  const mapped = opportunities.map(mapOpportunity);
  const exceptionInboxItems = mapped.flatMap((opportunity): PropertyOpportunityException[] => {
    const base = {
      propertyOpportunityId: opportunity.id,
      engineeringRemediationRequired: true,
      ceoBusinessDecisionRequired: false as const,
    };
    const exceptions: PropertyOpportunityException[] = [];

    if (!opportunity.canonicalAddress) {
      exceptions.push({ ...base, type: "missing_property_identity", title: "Missing property identity", detail: "Canonical property identity is unavailable." });
    }

    if (opportunity.missingEvidence.includes("owner name or mailing address")) {
      exceptions.push({ ...base, type: "missing_owner_evidence", title: "Missing owner evidence", detail: "Owner name or mailing address is required before acquisition movement." });
    }

    if (opportunity.duplicateRisk) {
      exceptions.push({ ...base, type: "duplicate_property_conflict", title: "Duplicate property conflict", detail: "Duplicate property evidence requires manual reconciliation." });
    }

    if (opportunity.opportunityPriority === "High") {
      exceptions.push({ ...base, type: "high_value_acquisition_review", title: "High-value acquisition review", detail: "High-scoring property opportunity is ready for internal acquisition review." });
    }

    return exceptions;
  });

  return {
    total: mapped.length,
    highPriority: mapped.filter((opportunity) => opportunity.opportunityPriority === "High").length,
    duplicateRisk: mapped.filter((opportunity) => opportunity.duplicateRisk).length,
    missingOwnerEvidence: mapped.filter((opportunity) => opportunity.missingEvidence.includes("owner name or mailing address")).length,
    unsafeFlags: mapped.filter((opportunity) => opportunity.providerCalled || opportunity.sent || opportunity.published || opportunity.crmMutated || opportunity.liveExecutionAllowed).length,
    morningBriefSignals: mapped
      .filter((opportunity) => opportunity.opportunityPriority === "High" || opportunity.missingEvidence.length > 0 || opportunity.duplicateRisk)
      .sort((a, b) => b.opportunityScore - a.opportunityScore || a.propertyAddress.localeCompare(b.propertyAddress))
      .slice(0, 8)
      .map((opportunity) => ({
        propertyOpportunityId: opportunity.id,
        title: opportunity.propertyAddress,
        summary: `${opportunity.opportunityPriority} property opportunity with score ${opportunity.opportunityScore}/100.`,
        priority: opportunity.opportunityPriority,
        opportunityScore: opportunity.opportunityScore,
        recommendedAction: opportunity.recommendedAction,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      })),
    exceptionInboxItems,
    safetyFlags: propertyOpportunitySafetyFlags,
  };
}

export function createPropertyOpportunityStreamAudit(
  opportunities: PropertyOpportunityRecord[],
  options: { generatedAt?: string; windowDays?: number } = {},
): PropertyOpportunityStreamAudit {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const windowDays = options.windowDays ?? 7;
  const cutoff = new Date(generatedAt).getTime() - windowDays * 24 * 60 * 60 * 1000;
  const mapped = opportunities.map(mapOpportunity);
  const recent = mapped.filter((opportunity) => getTime(opportunity.createdAt) >= cutoff);
  const sourceHealth = ([
    "manual_dfd",
    "tax_county",
    "public_record_import",
    "inbound_crm",
    "referral_relationship",
    "unknown",
  ] as const)
    .map((channel) => {
      const channelOpportunities = mapped.filter((opportunity) => classifyPropertyOpportunitySource(opportunity) === channel);

      return {
        channel,
        count: channelOpportunities.length,
        highPriority: channelOpportunities.filter((opportunity) => opportunity.opportunityPriority === "High").length,
        duplicateRisk: channelOpportunities.filter((opportunity) => opportunity.duplicateRisk).length,
        missingOwnerEvidence: channelOpportunities.filter((opportunity) => opportunity.missingEvidence.includes("owner name or mailing address")).length,
      };
    })
    .filter((channel) => channel.count > 0);
  const activeSourceChannels = sourceHealth.filter((channel) => channel.channel !== "unknown").length;
  const highPriorityRecent = recent.filter((opportunity) => opportunity.opportunityPriority === "High").length;
  const missingOwnerEvidence = mapped.filter((opportunity) => opportunity.missingEvidence.includes("owner name or mailing address")).length;
  const duplicateRisk = mapped.filter((opportunity) => opportunity.duplicateRisk).length;
  const unsafeFlags = mapped.filter((opportunity) => opportunity.providerCalled || opportunity.sent || opportunity.published || opportunity.crmMutated || opportunity.liveExecutionAllowed).length;
  const bottlenecks = [
    mapped.length === 0 ? "No persisted property opportunities exist yet." : "",
    recent.length === 0 ? `No property opportunities were created in the last ${windowDays} days.` : "",
    activeSourceChannels < 2 ? "Opportunity stream depends on fewer than two active source channels." : "",
    !sourceHealth.some((channel) => channel.channel === "manual_dfd") ? "Manual DFD observations are not yet producing a dependable opportunity stream." : "",
    !sourceHealth.some((channel) => channel.channel === "tax_county" || channel.channel === "public_record_import") ? "County/public-record imports are not yet producing a dependable opportunity stream." : "",
    highPriorityRecent === 0 ? "No recent high-priority property opportunities are available for acquisition review." : "",
    mapped.length > 0 && missingOwnerEvidence / mapped.length >= 0.35 ? "Owner evidence gaps are high enough to slow acquisition review." : "",
    duplicateRisk > 0 ? "Duplicate property conflicts need cleanup before scaling source volume." : "",
    unsafeFlags > 0 ? "Unsafe action flags are present and must be remediated before relying on the stream." : "",
  ].filter(Boolean);
  const streamState: PropertyOpportunityStreamState =
    unsafeFlags > 0 || (mapped.length > 0 && missingOwnerEvidence / mapped.length >= 0.5)
      ? "needs_cleanup"
      : mapped.length === 0 || recent.length === 0
        ? "starved"
        : activeSourceChannels < 2 || recent.length < 5 || highPriorityRecent === 0
          ? "thin"
          : "healthy";

  return {
    generatedAt,
    windowDays,
    streamState,
    totalOpportunities: mapped.length,
    recentOpportunities: recent.length,
    highPriorityRecent,
    activeSourceChannels,
    sourceHealth,
    bottlenecks,
    highestValueImprovement: "Convert existing property-first leads, imports, and manual DFD observations into PropertyOpportunity records automatically under internal-only safety gates.",
    exactRecommendedNextImplementation: "IMPLEMENT_EXISTING_LEAD_AND_IMPORT_TO_PROPERTY_OPPORTUNITY_ADAPTER",
    morningBriefLine:
      streamState === "healthy"
        ? "Property opportunity stream is healthy enough for AI COO acquisition review."
        : `Property opportunity stream is ${streamState}; ${bottlenecks[0] ?? "increase verified property opportunity intake."}`,
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

export async function listPropertyOpportunities(db: PropertyOpportunityDb, tenantId = "default") {
  const opportunities = (await db.propertyOpportunity.findMany({
    where: { tenantId },
    orderBy: [{ opportunityScore: "desc" }, { createdAt: "desc" }],
  })).map(mapOpportunity);
  const summary = createPropertyOpportunitySummary(opportunities);
  const streamAudit = createPropertyOpportunityStreamAudit(opportunities);

  assertPropertyOpportunityEngineSafety({ opportunities, summary });

  return { opportunities, summary, streamAudit, providerCalled: false as const, sent: false as const, published: false as const, crmMutated: false as const, liveExecutionAllowed: false as const };
}

export async function upsertManualDfdPropertyOpportunity(
  db: PropertyOpportunityDb,
  input: ManualDfdPropertyOpportunityInput,
  context: { tenantId?: string; actorId?: string; duplicateRiskOverride?: boolean } = {},
) {
  const parsed = manualDfdPropertyOpportunitySchema.parse(input);
  const tenantId = context.tenantId ?? "default";
  const duplicateKey = createPropertyOpportunityDuplicateKey(parsed);
  const existing = await db.propertyOpportunity.findFirst({ where: { tenantId, duplicateKey } });
  const duplicateRisk = context.duplicateRiskOverride ?? Boolean(existing);
  const score = scorePropertyOpportunity(parsed, duplicateRisk);

  const opportunity = mapOpportunity(await db.propertyOpportunity.upsert({
    where: { tenantId_duplicateKey: { tenantId, duplicateKey } },
    update: {
      canonicalAddress: canonicalizeAddress(parsed),
      propertyAddress: parsed.propertyAddress,
      city: parsed.city || null,
      state: parsed.state || null,
      zipCode: parsed.zipCode || null,
      county: parsed.county || null,
      parcelId: parsed.parcelId || null,
      ownerName: parsed.ownerName || null,
      mailingAddress: parsed.mailingAddress || null,
      source: parsed.source,
      sourceDetail: parsed.sourceDetail,
      evidence: parsed.evidence,
      distressIndicators: score.distressIndicators,
      observations: parsed.observations,
      photoMetadata: parsed.photoMetadata,
      opportunityScore: score.opportunityScore,
      opportunityPriority: score.opportunityPriority,
      confidence: score.confidence,
      duplicateRisk,
      missingEvidence: score.missingEvidence,
      recommendedAction: score.recommendedAction,
      safetyFlags: propertyOpportunitySafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    },
    create: {
      tenantId,
      canonicalAddress: canonicalizeAddress(parsed),
      propertyAddress: parsed.propertyAddress,
      city: parsed.city || null,
      state: parsed.state || null,
      zipCode: parsed.zipCode || null,
      county: parsed.county || null,
      parcelId: parsed.parcelId || null,
      ownerName: parsed.ownerName || null,
      mailingAddress: parsed.mailingAddress || null,
      source: parsed.source,
      sourceDetail: parsed.sourceDetail || null,
      evidence: parsed.evidence,
      distressIndicators: score.distressIndicators,
      observations: parsed.observations,
      photoMetadata: parsed.photoMetadata,
      opportunityScore: score.opportunityScore,
      opportunityPriority: score.opportunityPriority,
      confidence: score.confidence,
      duplicateKey,
      duplicateRisk: false,
      missingEvidence: score.missingEvidence,
      recommendedAction: score.recommendedAction,
      safetyFlags: propertyOpportunitySafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
      createdBy: context.actorId ?? null,
    },
  }));

  const summary = createPropertyOpportunitySummary([opportunity]);
  assertPropertyOpportunityEngineSafety({ opportunities: [opportunity], summary });

  return {
    opportunity,
    created: !existing,
    summary,
    unsafeEnrichmentBlocked: parsed.unsafeEnrichmentRequested,
    providerCalled: false as const,
    sent: false as const,
    published: false as const,
    crmMutated: false as const,
    liveExecutionAllowed: false as const,
  };
}

function createPropertyOpportunityInputFromLead(lead: StoredLead): ManualDfdPropertyOpportunityInput {
  const [record] = createDashboardPropertyRecords([lead]);
  const sourceLabel = record?.sourceLabel ?? (lead.source || "Existing Lead");
  const signals = record?.signals ?? [];
  const reviewLane = record?.reviewLane ?? "property_review";
  const contactReadiness = record?.contactReadiness ?? "property_only_review";
  const source = record?.source ?? (lead.source || "manual_import");
  const observationNote = [lead.situationDetails, `Adapted from existing lead ${lead.id} for internal property opportunity review.`]
    .filter((value) => value?.trim())
    .join(" ");

  return manualDfdPropertyOpportunitySchema.parse({
    propertyAddress: lead.propertyAddress,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
    county: lead.county,
    parcelId: lead.parcelId,
    ownerName: lead.ownerName,
    mailingAddress: lead.mailingAddress,
    source,
    sourceDetail: `Existing lead adapter. Source: ${sourceLabel}. Review lane: ${reviewLane}. Contact readiness: ${contactReadiness}.`,
    distressFlags: lead.distressFlags,
    observations: [
      {
        observedAt: lead.timestamp,
        note: observationNote || "Existing property lead adapted for internal property opportunity review.",
        condition: signals.length > 0 ? signals.join(",") : "stored_property_record",
        source: "existing_lead_adapter",
      },
    ],
    photoMetadata: [],
    evidence: {
      sourceLabel: "existing_lead_adapter",
      leadId: lead.id,
      provenanceClassification: classifyLeadProvenance(lead).classification,
      originalSource: lead.source,
      originalSourceDetail: lead.sourceDetail ?? null,
      leadCreatedAt: lead.timestamp,
      normalizedSource: source,
      propertyRecordSignals: signals,
      reviewLane,
      contactReadiness,
      leadStatus: lead.status,
      leadPriority: lead.priority,
      leadScore: lead.score,
      doNotContact: Boolean(lead.doNotContact),
      optOutReason: lead.optOutReason ?? null,
      consentStatus: lead.consentStatus ?? "unknown",
      contactPermission: lead.contactPermission ?? "internal_review_only",
      consentSource: lead.consentSource ?? null,
      consentAt: lead.consentAt ?? null,
      requiresHumanApproval: Boolean(lead.requiresHumanApproval),
    },
    unsafeEnrichmentRequested: false,
  });
}

export function createExistingLeadAdaptationDryRun(input: {
  leads: StoredLead[];
  existingOpportunities: PropertyOpportunityRecord[];
  existingTasks: Array<{ source?: string | null; status?: string | null }>;
}): ExistingLeadAdaptationDryRun {
  const eligibility = createExistingLeadEligibilityReport(input.leads);
  const eligibleLeads = input.leads.filter((lead) => eligibility.records.find((record) => record.leadId === lead.id)?.eligible);
  const grouped = new Map<string, Array<{ score: number }>>();

  for (const lead of eligibleLeads) {
    const opportunityInput = createPropertyOpportunityInputFromLead(lead);
    const duplicateKey = createPropertyOpportunityDuplicateKey(opportunityInput);
    const score = scorePropertyOpportunity(opportunityInput).opportunityScore;
    grouped.set(duplicateKey, [...(grouped.get(duplicateKey) ?? []), { score }]);
  }

  const existingByDuplicateKey = new Map(input.existingOpportunities.map((opportunity) => [opportunity.duplicateKey, opportunity]));
  const openTaskSources = new Set(input.existingTasks.filter((task) => task.status === "open").map((task) => task.source).filter((source): source is string => Boolean(source)));
  let wouldCreateOpportunity = 0;
  let wouldReuseOrUpdateOpportunity = 0;
  let eligibleOpportunitiesAtOrAbove72 = 0;
  let opportunitiesBelowThreshold = 0;
  let wouldCreateAcquisitionReviewTask = 0;
  let wouldReuseAcquisitionReviewTask = 0;

  for (const [duplicateKey, candidates] of grouped) {
    const existing = existingByDuplicateKey.get(duplicateKey);
    if (existing) wouldReuseOrUpdateOpportunity += candidates.length;
    else {
      wouldCreateOpportunity += 1;
      wouldReuseOrUpdateOpportunity += Math.max(0, candidates.length - 1);
    }

    const duplicateConflict = candidates.length > 1;
    const projectedScore = candidates.at(-1)?.score ?? existing?.opportunityScore ?? 0;
    if (projectedScore >= 72) {
      eligibleOpportunitiesAtOrAbove72 += 1;
      if (!duplicateConflict) {
        if (existing && openTaskSources.has(`property_opportunity:${existing.id}`)) wouldReuseAcquisitionReviewTask += 1;
        else wouldCreateAcquisitionReviewTask += 1;
      }
    } else opportunitiesBelowThreshold += 1;
  }

  const realLeads = input.leads.filter((lead) => classifyLeadProvenance(lead).classification === "real");
  return {
    totalLeads: input.leads.length,
    legitimateRealLeads: realLeads.length,
    missingPropertyIdentity: eligibility.reasonCounts.property_address_missing ?? 0,
    eligibleForAdaptation: eligibleLeads.length,
    // Internal property analysis performs no contact, so consent/DNC restrictions are preserved but do not block adaptation.
    blockedByConsentOrDnc: 0,
    blockedByInsufficientEvidence: opportunitiesBelowThreshold,
    duplicatePropertyIdentities: [...grouped.values()].filter((records) => records.length > 1).length,
    existingPropertyOpportunities: input.existingOpportunities.length,
    opportunitiesAlreadyLinkedToLeads: input.existingOpportunities.filter((opportunity) => {
      const evidence = opportunity.evidence as Record<string, unknown> | null;
      return typeof evidence?.leadId === "string" && evidence.leadId.length > 0;
    }).length,
    existingAcquisitionReviewTasks: input.existingTasks.length,
    eligibleOpportunitiesAtOrAbove72,
    opportunitiesBelowThreshold,
    wouldCreateOpportunity,
    wouldReuseOrUpdateOpportunity,
    wouldCreateAcquisitionReviewTask,
    wouldReuseAcquisitionReviewTask,
    providerCalled: false,
    sent: false,
    outreach: false,
    published: false,
    crmMutation: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  };
}

export async function adaptExistingLeadsToPropertyOpportunities(
  db: PropertyOpportunityDb,
  leads: StoredLead[],
  context: { tenantId?: string; actorId?: string; generatedAt?: string } = {},
): Promise<PropertyOpportunityLeadAdapterReport> {
  const eligibility = createExistingLeadEligibilityReport(leads);
  const eligibilityByLead = new Map(eligibility.records.map((record) => [record.leadId, record]));
  const eligibleLeads = leads.filter((lead) => eligibilityByLead.get(lead.id)?.eligible === true);
  const duplicateKeyCounts = new Map<string, number>();
  const adaptedInputs = eligibleLeads.map((lead) => createPropertyOpportunityInputFromLead(lead));
  const results = [];
  const taskResults: PropertyOpportunityTaskResult[] = [];

  adaptedInputs.forEach((input) => {
    const duplicateKey = createPropertyOpportunityDuplicateKey(input);
    duplicateKeyCounts.set(duplicateKey, (duplicateKeyCounts.get(duplicateKey) ?? 0) + 1);
  });

  for (const input of adaptedInputs) {
    const result = await upsertManualDfdPropertyOpportunity(db, input, {
      ...context,
      duplicateRiskOverride: (duplicateKeyCounts.get(createPropertyOpportunityDuplicateKey(input)) ?? 0) > 1,
    });
    results.push(result);
    if (
      result.opportunity.opportunityScore >= 72 &&
      result.opportunity.canonicalAddress.length > 0 &&
      !result.opportunity.duplicateRisk &&
      result.opportunity.safetyFlags === propertyOpportunitySafetyFlags
    ) {
      taskResults.push(await createPropertyOpportunityAcquisitionReviewTask(db, result.opportunity.id, context));
    }
  }

  const opportunities = (await db.propertyOpportunity.findMany({
    where: { tenantId: context.tenantId ?? "default" },
    orderBy: [{ opportunityScore: "desc" }, { createdAt: "desc" }],
  })).map(mapOpportunity);
  const streamAudit = createPropertyOpportunityStreamAudit(opportunities, { generatedAt: context.generatedAt });
  const report = {
    scannedLeads: leads.length,
    eligiblePropertyLeads: eligibleLeads.length,
    realLeads: eligibility.provenanceCounts.real,
    excludedLeads: eligibility.excludedLeads,
    ambiguousLeads: eligibility.ambiguousLeads,
    createdOpportunities: results.filter((result) => result.created).length,
    updatedOpportunities: results.filter((result) => !result.created).length,
    acquisitionReviewTasksCreated: taskResults.filter((result) => result.created).length,
    acquisitionReviewTasksReused: taskResults.filter((result) => !result.created).length,
    skippedMissingPropertyAddress: eligibility.reasonCounts.property_address_missing ?? 0,
    adaptedOpportunityIds: results.map((result) => result.opportunity.id),
    provenanceCounts: eligibility.provenanceCounts,
    streamAudit,
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false as const,
    sent: false as const,
    published: false as const,
    crmMutated: false as const,
    liveExecutionAllowed: false as const,
  };

  assertPropertyOpportunityEngineSafety({ opportunities, summary: createPropertyOpportunitySummary(opportunities) });

  return report;
}

export const defaultPropertyOpportunityFilters: SavedPropertyOpportunityFilterInput[] = [
  { name: "Driving for Dollars", filterKey: "driving_for_dollars", criteria: { source: "manual_dfd" } },
  { name: "Tax / County", filterKey: "tax_county", criteria: { distressIndicators: ["taxDelinquent"], sourceIncludes: ["county", "tax"] } },
  { name: "Out-of-State Owner", filterKey: "out_of_state", criteria: { distressIndicators: ["outOfStateOwner"] } },
  { name: "Absentee Owner", filterKey: "absentee_owner", criteria: { ownerMailingAddressDiffers: true } },
  { name: "Probate / Inherited", filterKey: "probate_inherited", criteria: { distressIndicators: ["inheritedProperty"] } },
  { name: "Vacancy", filterKey: "vacancy", criteria: { distressIndicators: ["vacantProperty"] } },
  { name: "Major Repairs", filterKey: "major_repairs", criteria: { distressIndicators: ["majorRepairs"] } },
  { name: "Duplicate Risk", filterKey: "duplicate_risk", criteria: { duplicateRisk: true } },
  { name: "Stale Observation", filterKey: "stale_observation", criteria: { observationOlderThanDays: 21 } },
  { name: "Missing Owner Data", filterKey: "missing_owner_data", criteria: { missingEvidenceIncludes: "owner name or mailing address" } },
];

export async function listPropertyOpportunityFilters(db: PropertyOpportunityDb, tenantId = "default") {
  const existing = await db.propertyOpportunitySavedFilter.findMany({ where: { tenantId }, orderBy: [{ name: "asc" }] });

  if (existing.length > 0) {
    const filters = existing.map((filter) => ({ ...filter, safetyFlags: propertyOpportunitySafetyFlags, providerCalled: false as const, sent: false as const, published: false as const, crmMutated: false as const, liveExecutionAllowed: false as const }));
    assertPropertyOpportunityEngineSafety({ filters });
    return { filters, providerCalled: false as const, sent: false as const, published: false as const, crmMutated: false as const, liveExecutionAllowed: false as const };
  }

  const filters = await Promise.all(defaultPropertyOpportunityFilters.map((filter) => savePropertyOpportunityFilter(db, filter, { tenantId })));

  return { filters: filters.map((result) => result.filter), providerCalled: false as const, sent: false as const, published: false as const, crmMutated: false as const, liveExecutionAllowed: false as const };
}

export async function savePropertyOpportunityFilter(db: PropertyOpportunityDb, input: SavedPropertyOpportunityFilterInput, context: { tenantId?: string; actorId?: string } = {}) {
  const parsed = savedPropertyOpportunityFilterSchema.parse(input);
  const tenantId = context.tenantId ?? "default";
  const filter = await db.propertyOpportunitySavedFilter.upsert({
    where: { tenantId_filterKey: { tenantId, filterKey: parsed.filterKey } },
    update: {
      name: parsed.name,
      criteria: parsed.criteria,
      safetyFlags: propertyOpportunitySafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    },
    create: {
      tenantId,
      name: parsed.name,
      filterKey: parsed.filterKey,
      criteria: parsed.criteria,
      safetyFlags: propertyOpportunitySafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
      createdBy: context.actorId ?? null,
    },
  });
  const safeFilter = { ...filter, safetyFlags: propertyOpportunitySafetyFlags, providerCalled: false as const, sent: false as const, published: false as const, crmMutated: false as const, liveExecutionAllowed: false as const };

  assertPropertyOpportunityEngineSafety({ filters: [safeFilter] });

  return { filter: safeFilter, providerCalled: false as const, sent: false as const, published: false as const, crmMutated: false as const, liveExecutionAllowed: false as const };
}

export async function createPropertyOpportunityAcquisitionReviewTask(db: PropertyOpportunityDb, opportunityId: string, context: { tenantId?: string; actorId?: string } = {}): Promise<PropertyOpportunityTaskResult> {
  const tenantId = context.tenantId ?? "default";
  const opportunity = await db.propertyOpportunity.findFirst({ where: { id: opportunityId, tenantId } });
  if (!opportunity) throw new Error("property_opportunity_not_found");

  const existingTask = await db.revenueTask.findFirst({
    where: {
      tenantId,
      taskType: "property_opportunity_acquisition_review",
      status: "open",
      source: `property_opportunity:${opportunity.id}`,
    },
  });

  if (existingTask) {
    return {
      created: false,
      taskId: existingTask.id,
      title: "Review property opportunity",
      taskType: "property_opportunity_acquisition_review",
      requiresApproval: true,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    };
  }

  const task = await db.revenueTask.create({
    data: {
      tenantId,
      title: `Review property opportunity: ${opportunity.propertyAddress}`,
      taskType: "property_opportunity_acquisition_review",
      priority: opportunity.opportunityPriority,
      status: "open",
      recommendedAction: opportunity.recommendedAction,
      reason: `Property Opportunity Engine score ${opportunity.opportunityScore}/100 with ${opportunity.confidence}/100 confidence. Approval-required internal acquisition review only.`,
      requiresApproval: true,
      source: `property_opportunity:${opportunity.id}`,
      assignedTo: context.actorId ?? "Acquisitions AI",
    },
  });

  return {
    created: true,
    taskId: task.id,
    title: "Review property opportunity",
    taskType: "property_opportunity_acquisition_review",
    requiresApproval: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}
