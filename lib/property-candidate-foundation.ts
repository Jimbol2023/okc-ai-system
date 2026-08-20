import { z } from "zod";

import type { StoredLead } from "@/lib/leads-storage";
import {
  createPropertyOpportunityDuplicateKey,
  manualDfdPropertyOpportunitySchema,
  scorePropertyOpportunity,
  type ManualDfdPropertyOpportunityInput,
  type PropertyOpportunityDb,
  type PropertyOpportunityRecord,
} from "@/lib/property-opportunity-engine";

export type CountyRecordImportInput = {
  propertyAddress: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  parcelId?: string;
  ownerName?: string;
  mailingAddress?: string;
  distressFlags?: Record<string, boolean>;
  taxStatus?: string;
  assessedValue?: string;
  lastSaleDate?: string;
  yearBuilt?: string;
  squareFeet?: string;
  bedrooms?: string;
  bathrooms?: string;
  propertyType?: string;
  latitude?: number;
  longitude?: number;
  notes?: string[];
  photoMetadata?: Array<Record<string, unknown>>;
  routeName?: string;
  routeStopNumber?: number;
};

export const propertyCandidateSafetyFlags = {
  providerCalled: false,
  providerWrite: false,
  sent: false,
  published: false,
  outreach: false,
  crmMutated: false,
  skipTracePerformed: false,
  directMailSent: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
} as const;

export const enabledPropertyCandidateSources = ["manual_virtual_dfd", "county_import", "manual_property_review", "virtual_dfd_internal_certification"] as const;
export const reservedPropertyCandidateSources = ["google_geocode", "google_street_view", "dealmachine_property_search", "public_record_provider"] as const;

export type PropertyCandidateSource = (typeof enabledPropertyCandidateSources)[number];
export type ReservedPropertyCandidateSource = (typeof reservedPropertyCandidateSources)[number];
export type PropertyCandidateReviewStatus = "new" | "needs_verification" | "verified_candidate" | "rejected" | "promoted";
export type PropertyCandidateDuplicateStatus =
  | "unique"
  | "duplicate_candidate"
  | "duplicate_existing_lead"
  | "duplicate_existing_opportunity"
  | "conflicting_parcel"
  | "conflicting_address"
  | "needs_human_resolution";

export type PropertyCandidateAuditAction =
  | "candidate_created"
  | "candidate_reviewed"
  | "candidate_verified"
  | "candidate_rejected"
  | "candidate_duplicate_detected"
  | "candidate_promotion_requested"
  | "candidate_promoted"
  | "candidate_promotion_blocked";

export type PropertyCandidateRecord = {
  id: string;
  tenantId: string;
  source: PropertyCandidateSource;
  sourceDetail: string | null;
  sourceRecordId: string | null;
  propertyAddress: string;
  normalizedAddress: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  county: string | null;
  parcelId: string | null;
  latitude: number | null;
  longitude: number | null;
  coordinateSource: string | null;
  ownerName: string | null;
  mailingAddress: string | null;
  sourceEvidence: unknown;
  observations: unknown;
  distressIndicators: string[];
  confidence: number;
  duplicateKey: string;
  duplicateStatus: PropertyCandidateDuplicateStatus;
  providerName: string | null;
  providerRequestId: string | null;
  retrievedAt: Date | string | null;
  costCents: number;
  creditsUsed: number;
  reviewStatus: PropertyCandidateReviewStatus;
  createdBy: string | null;
  providerCalled: false;
  providerWrite: false;
  sent: false;
  published: false;
  outreach: false;
  crmMutated: false;
  skipTracePerformed: false;
  directMailSent: false;
  externalExecutionAllowed: false;
  liveExecutionAllowed: false;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PropertyCandidateDuplicateInput = Pick<
  PropertyCandidateRecord,
  "tenantId" | "normalizedAddress" | "county" | "parcelId" | "duplicateKey"
>;

export type PropertyCandidateDb = {
  propertyCandidate: {
    findMany(args: { where?: { tenantId?: string } }): Promise<PropertyCandidateRecord[]>;
    findFirst(args: { where?: { id?: string; tenantId?: string; duplicateKey?: string } }): Promise<PropertyCandidateRecord | null>;
    create(args: { data: Omit<PropertyCandidateRecord, "id" | "createdAt" | "updatedAt"> }): Promise<PropertyCandidateRecord>;
    update(args: { where: { id: string; tenantId: string }; data: Partial<PropertyCandidateRecord> }): Promise<PropertyCandidateRecord>;
  };
  lead: {
    findFirst(args: { where?: { tenantId?: string; propertyAddress?: string } }): Promise<Pick<StoredLead, "id" | "propertyAddress" | "source"> | null>;
    create?(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  };
  propertyOpportunity: {
    findFirst(args: { where?: { tenantId?: string; duplicateKey?: string; propertyAddress?: string } }): Promise<Pick<PropertyOpportunityRecord, "id" | "duplicateKey" | "propertyAddress" | "parcelId" | "county"> | null>;
  };
  revenueAuditEvent?: {
    create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  };
};

const optionalText = z.string().trim().max(500).optional().default("");
const optionalNumber = z.coerce.number().finite().optional();

export const propertyCandidateInputSchema = z.object({
  source: z.enum(enabledPropertyCandidateSources),
  sourceDetail: z.string().trim().max(2000).optional().default(""),
  sourceRecordId: optionalText,
  propertyAddress: z.string().trim().min(3).max(300),
  city: optionalText,
  state: optionalText,
  zipCode: optionalText,
  county: optionalText,
  parcelId: optionalText,
  latitude: optionalNumber,
  longitude: optionalNumber,
  coordinateSource: optionalText,
  ownerName: optionalText,
  mailingAddress: optionalText,
  sourceEvidence: z.record(z.string(), z.unknown()).optional().default({}),
  observations: z.array(z.record(z.string(), z.unknown())).max(24).optional().default([]),
  distressIndicators: z.array(z.string().trim().min(1).max(80)).max(20).optional().default([]),
  confidence: z.coerce.number().int().min(0).max(100).optional().default(50),
  providerName: optionalText,
  providerRequestId: optionalText,
  retrievedAt: z.string().datetime().optional(),
  costCents: z.coerce.number().int().min(0).optional().default(0),
  creditsUsed: z.coerce.number().int().min(0).optional().default(0),
});

export type PropertyCandidateInput = z.infer<typeof propertyCandidateInputSchema>;

export const propertyCandidateReviewSchema = z.object({
  reviewStatus: z.enum(["new", "needs_verification", "verified_candidate", "rejected", "promoted"]),
  reason: z.string().trim().max(800).optional().default(""),
});

export const propertyCandidatePromotionSchema = z.object({
  path: z.enum(["property_only", "seller_provenance"]),
  sellerProvenance: z.record(z.string(), z.unknown()).optional().default({}),
});

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizePropertyCandidateAddress(input: Pick<PropertyCandidateInput, "propertyAddress" | "city" | "state" | "zipCode">) {
  return [input.propertyAddress, input.city, input.state, input.zipCode]
    .map((value) => value?.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join(", ")
    .toLowerCase();
}

function sanitizeNullable(value: string | null | undefined) {
  return hasText(value) ? value.trim() : null;
}

function safeJsonArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapCandidate(record: PropertyCandidateRecord): PropertyCandidateRecord {
  assertPropertyCandidateSafety(record);

  return {
    ...record,
    sourceDetail: record.sourceDetail ?? null,
    sourceRecordId: record.sourceRecordId ?? null,
    city: record.city ?? null,
    state: record.state ?? null,
    zipCode: record.zipCode ?? null,
    county: record.county ?? null,
    parcelId: record.parcelId ?? null,
    latitude: typeof record.latitude === "number" ? record.latitude : null,
    longitude: typeof record.longitude === "number" ? record.longitude : null,
    coordinateSource: record.coordinateSource ?? null,
    ownerName: record.ownerName ?? null,
    mailingAddress: record.mailingAddress ?? null,
    distressIndicators: safeJsonArray(record.distressIndicators),
    providerName: record.providerName ?? null,
    providerRequestId: record.providerRequestId ?? null,
    retrievedAt: record.retrievedAt ?? null,
    costCents: record.costCents ?? 0,
    creditsUsed: record.creditsUsed ?? 0,
    createdBy: record.createdBy ?? null,
    providerCalled: false,
    providerWrite: false,
    sent: false,
    published: false,
    outreach: false,
    crmMutated: false,
    skipTracePerformed: false,
    directMailSent: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  };
}

export function assertPropertyCandidateSafety(record: Partial<PropertyCandidateRecord>) {
  if (
    record.providerCalled ||
    record.providerWrite ||
    record.sent ||
    record.published ||
    record.outreach ||
    record.crmMutated ||
    record.skipTracePerformed ||
    record.directMailSent ||
    record.externalExecutionAllowed ||
    record.liveExecutionAllowed
  ) {
    throw new Error("PropertyCandidate must remain internal-only with provider, outreach, CRM, skip trace, direct mail, external execution, and live execution disabled.");
  }
}

export function assertPropertyCandidateSourceAllowed(source: PropertyCandidateSource | ReservedPropertyCandidateSource) {
  if ((reservedPropertyCandidateSources as readonly string[]).includes(source)) {
    throw new Error(`property_candidate_source_reserved:${source}`);
  }
  if (!(enabledPropertyCandidateSources as readonly string[]).includes(source)) {
    throw new Error(`property_candidate_source_not_enabled:${source}`);
  }
}

export function createPropertyCandidateDuplicateKey(input: Pick<PropertyCandidateInput, "propertyAddress" | "city" | "state" | "zipCode" | "parcelId" | "county">) {
  return createPropertyOpportunityDuplicateKey(input);
}

export function classifyPropertyCandidateDuplicate(input: {
  candidate: PropertyCandidateDuplicateInput;
  existingCandidates: PropertyCandidateDuplicateInput[];
  existingLead: Pick<StoredLead, "id"> | null;
  existingOpportunity: Pick<PropertyOpportunityRecord, "id"> | null;
}): PropertyCandidateDuplicateStatus {
  const sameKeyCandidates = input.existingCandidates.filter((candidate) => candidate.duplicateKey === input.candidate.duplicateKey);
  if (sameKeyCandidates.length > 0) return "duplicate_candidate";

  const parcel = input.candidate.parcelId?.trim().toLowerCase();
  const address = input.candidate.normalizedAddress;
  const conflictingParcel = input.existingCandidates.some((candidate) => {
    const existingParcel = candidate.parcelId?.trim().toLowerCase();
    return Boolean(parcel && existingParcel && parcel === existingParcel && candidate.normalizedAddress !== address);
  });
  if (conflictingParcel) return "conflicting_parcel";

  const conflictingAddress = input.existingCandidates.some((candidate) => {
    const existingParcel = candidate.parcelId?.trim().toLowerCase();
    return Boolean(address && candidate.normalizedAddress === address && parcel && existingParcel && parcel !== existingParcel);
  });
  if (conflictingAddress) return "conflicting_address";

  if (input.existingLead) return "duplicate_existing_lead";
  if (input.existingOpportunity) return "duplicate_existing_opportunity";

  return "unique";
}

function evidenceCompleteness(input: {
  propertyAddress?: string | null;
  parcelId?: string | null;
  county?: string | null;
  ownerName?: string | null;
  mailingAddress?: string | null;
  observations?: unknown[] | unknown;
  distressIndicators?: string[];
}) {
  const observations = Array.isArray(input.observations) ? input.observations : [];
  const checks = [
    hasText(input.propertyAddress),
    hasText(input.parcelId),
    hasText(input.county),
    hasText(input.ownerName) || hasText(input.mailingAddress),
    observations.length > 0,
    (input.distressIndicators ?? []).length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function sourceReliability(source: PropertyCandidateSource) {
  if (source === "county_import") return 82;
  if (source === "manual_virtual_dfd") return 72;
  return 64;
}

export function rankPropertyCandidate(candidate: PropertyCandidateRecord, generatedAt = new Date().toISOString()) {
  const freshnessAge = Math.max(0, new Date(generatedAt).getTime() - new Date(candidate.createdAt).getTime());
  const freshness = Math.max(0, 100 - Math.floor(freshnessAge / (1000 * 60 * 60 * 24 * 7)) * 12);
  const duplicatePenalty = candidate.duplicateStatus === "unique" ? 0 : candidate.duplicateStatus.startsWith("conflicting") ? 38 : 24;
  const completeness = evidenceCompleteness(candidate);
  const distress = Math.min(100, candidate.distressIndicators.length * 28);

  return Math.max(0, Math.min(100, Math.round(completeness * 0.34 + distress * 0.24 + sourceReliability(candidate.source) * 0.22 + freshness * 0.2 - duplicatePenalty)));
}

function recommendedCandidateAction(candidate: PropertyCandidateRecord) {
  if (candidate.duplicateStatus !== "unique") return "Resolve duplicate or identity conflict before verification or promotion.";
  if (candidate.reviewStatus === "verified_candidate") return "Request explicit governed promotion if evidence is complete.";
  if (candidate.reviewStatus === "rejected") return "Keep rejected with audit trail; do not merge or promote.";
  if (candidate.distressIndicators.length === 0) return "Verify distress evidence before promotion.";
  return "Review source evidence and mark verified only after human verification.";
}

export function createPropertyCandidateQueue(candidates: PropertyCandidateRecord[], generatedAt = new Date().toISOString()) {
  const mapped = candidates.map(mapCandidate);
  const duplicateOrConflict = mapped.filter((candidate) => candidate.duplicateStatus !== "unique");

  return {
    totals: {
      new: mapped.filter((candidate) => candidate.reviewStatus === "new").length,
      needsVerification: mapped.filter((candidate) => candidate.reviewStatus === "needs_verification").length,
      verified: mapped.filter((candidate) => candidate.reviewStatus === "verified_candidate").length,
      duplicateOrConflict: duplicateOrConflict.length,
      rejected: mapped.filter((candidate) => candidate.reviewStatus === "rejected").length,
      promoted: mapped.filter((candidate) => candidate.reviewStatus === "promoted").length,
    },
    ranked: mapped
      .map((candidate) => ({
        candidate,
        rankScore: rankPropertyCandidate(candidate, generatedAt),
        evidenceCompleteness: evidenceCompleteness(candidate),
        recommendedInternalAction: recommendedCandidateAction(candidate),
        providerCalled: false as const,
        liveExecutionAllowed: false as const,
      }))
      .sort((a, b) => b.rankScore - a.rankScore || a.candidate.propertyAddress.localeCompare(b.candidate.propertyAddress)),
    safetyFlags: propertyCandidateSafetyFlags,
    providerCalled: false as const,
    providerWrite: false as const,
    sent: false as const,
    published: false as const,
    outreach: false as const,
    crmMutated: false as const,
    skipTracePerformed: false as const,
    directMailSent: false as const,
    externalExecutionAllowed: false as const,
    liveExecutionAllowed: false as const,
  };
}

async function auditCandidate(db: PropertyCandidateDb, input: {
  tenantId: string;
  actorId?: string | null;
  action: PropertyCandidateAuditAction;
  targetId?: string | null;
  result?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!db.revenueAuditEvent) return null;

  return db.revenueAuditEvent.create({
    data: {
      tenantId: input.tenantId,
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: "PropertyCandidate",
      targetId: input.targetId ?? null,
      source: "property_candidate_foundation",
      result: input.result ?? "success",
      safeMetadata: {
        source: input.metadata?.source ?? null,
        reviewStatus: input.metadata?.reviewStatus ?? null,
        duplicateStatus: input.metadata?.duplicateStatus ?? null,
        promotionPath: input.metadata?.promotionPath ?? null,
        providerCalled: false,
        providerWrite: false,
        outreach: false,
        skipTracePerformed: false,
        directMailSent: false,
        externalExecutionAllowed: false,
      },
    },
  });
}

export async function createPropertyCandidate(
  db: PropertyCandidateDb,
  input: PropertyCandidateInput,
  context: { tenantId?: string; actorId?: string | null } = {},
) {
  const parsed = propertyCandidateInputSchema.parse(input);
  assertPropertyCandidateSourceAllowed(parsed.source);
  const tenantId = context.tenantId ?? "default";
  const normalizedAddress = normalizePropertyCandidateAddress(parsed);
  const duplicateKey = createPropertyCandidateDuplicateKey(parsed);
  const existingCandidates = await db.propertyCandidate.findMany({ where: { tenantId } });
  const [existingLead, existingOpportunity] = await Promise.all([
    db.lead.findFirst({ where: { tenantId, propertyAddress: parsed.propertyAddress } }),
    db.propertyOpportunity.findFirst({ where: { tenantId, duplicateKey } }),
  ]);
  const duplicateStatus = classifyPropertyCandidateDuplicate({
    candidate: {
      tenantId,
      normalizedAddress,
      county: sanitizeNullable(parsed.county),
      parcelId: sanitizeNullable(parsed.parcelId),
      duplicateKey,
    },
    existingCandidates,
    existingLead,
    existingOpportunity,
  });
  const reviewStatus: PropertyCandidateReviewStatus = duplicateStatus === "unique" ? "new" : "needs_verification";

  const candidate = mapCandidate(await db.propertyCandidate.create({
    data: {
      tenantId,
      source: parsed.source,
      sourceDetail: sanitizeNullable(parsed.sourceDetail),
      sourceRecordId: sanitizeNullable(parsed.sourceRecordId),
      propertyAddress: parsed.propertyAddress,
      normalizedAddress,
      city: sanitizeNullable(parsed.city),
      state: sanitizeNullable(parsed.state),
      zipCode: sanitizeNullable(parsed.zipCode),
      county: sanitizeNullable(parsed.county),
      parcelId: sanitizeNullable(parsed.parcelId),
      latitude: typeof parsed.latitude === "number" ? parsed.latitude : null,
      longitude: typeof parsed.longitude === "number" ? parsed.longitude : null,
      coordinateSource: sanitizeNullable(parsed.coordinateSource),
      ownerName: sanitizeNullable(parsed.ownerName),
      mailingAddress: sanitizeNullable(parsed.mailingAddress),
      sourceEvidence: parsed.sourceEvidence,
      observations: parsed.observations,
      distressIndicators: parsed.distressIndicators,
      confidence: parsed.confidence,
      duplicateKey,
      duplicateStatus,
      providerName: sanitizeNullable(parsed.providerName),
      providerRequestId: sanitizeNullable(parsed.providerRequestId),
      retrievedAt: parsed.retrievedAt ?? null,
      costCents: parsed.costCents,
      creditsUsed: parsed.creditsUsed,
      reviewStatus,
      createdBy: context.actorId ?? null,
      ...propertyCandidateSafetyFlags,
    },
  }));

  await auditCandidate(db, {
    tenantId,
    actorId: context.actorId,
    action: "candidate_created",
    targetId: candidate.id,
    metadata: { source: candidate.source, reviewStatus: candidate.reviewStatus, duplicateStatus: candidate.duplicateStatus },
  });

  if (duplicateStatus !== "unique") {
    await auditCandidate(db, {
      tenantId,
      actorId: context.actorId,
      action: "candidate_duplicate_detected",
      targetId: candidate.id,
      metadata: { source: candidate.source, reviewStatus: candidate.reviewStatus, duplicateStatus: candidate.duplicateStatus },
    });
  }

  return {
    candidate,
    duplicateStatus,
    queue: createPropertyCandidateQueue([candidate]),
    providerCalled: false as const,
    providerWrite: false as const,
    sent: false as const,
    published: false as const,
    outreach: false as const,
    crmMutated: false as const,
    skipTracePerformed: false as const,
    directMailSent: false as const,
    externalExecutionAllowed: false as const,
    liveExecutionAllowed: false as const,
  };
}

export function createPropertyCandidateInputFromManualDfd(input: ManualDfdPropertyOpportunityInput): PropertyCandidateInput {
  const parsed = manualDfdPropertyOpportunitySchema.parse(input);
  const scored = scorePropertyOpportunity(parsed);

  return propertyCandidateInputSchema.parse({
    source: "manual_virtual_dfd",
    sourceDetail: parsed.sourceDetail || "Manual Virtual DFD property discovery evidence.",
    propertyAddress: parsed.propertyAddress,
    city: parsed.city,
    state: parsed.state,
    zipCode: parsed.zipCode,
    county: parsed.county,
    parcelId: parsed.parcelId,
    ownerName: parsed.ownerName,
    mailingAddress: parsed.mailingAddress,
    sourceEvidence: {
      sourceLabel: "manual_virtual_dfd",
      originalSource: parsed.source,
      evidence: parsed.evidence,
      photoMetadata: parsed.photoMetadata,
      providerCalled: false,
      outreach: false,
    },
    observations: parsed.observations,
    distressIndicators: scored.distressIndicators,
    confidence: scored.confidence,
    costCents: 0,
    creditsUsed: 0,
  });
}

export function createPropertyCandidateInputFromCountyRecord(input: CountyRecordImportInput): PropertyCandidateInput {
  const countyRecord = input;
  const taxDelinquent = Boolean(countyRecord.distressFlags?.taxDelinquent) || /delinquent|past due|tax sale/i.test(countyRecord.taxStatus ?? "");
  const opportunityInput = manualDfdPropertyOpportunitySchema.parse({
    propertyAddress: countyRecord.propertyAddress,
    city: countyRecord.city,
    state: countyRecord.state,
    zipCode: countyRecord.zipCode,
    county: countyRecord.county,
    parcelId: countyRecord.parcelId,
    ownerName: countyRecord.ownerName,
    mailingAddress: countyRecord.mailingAddress,
    source: "county_record_import",
    sourceDetail: "Manual county/workbench evidence import staged as PropertyCandidate.",
    distressFlags: {
      ...countyRecord.distressFlags,
      taxDelinquent,
    },
    observations: (countyRecord.notes ?? []).map((note) => ({
      observedAt: new Date().toISOString(),
      note,
      condition: "county_import_note",
      source: "county_record_import",
    })),
    photoMetadata: countyRecord.photoMetadata ?? [],
    evidence: {
      sourceLabel: "manual_county_record_import",
      countyOwnershipTaxEvidence: {
        taxStatus: countyRecord.taxStatus,
        assessedValue: countyRecord.assessedValue,
        lastSaleDate: countyRecord.lastSaleDate,
      },
      propertyCharacteristics: {
        yearBuilt: countyRecord.yearBuilt,
        squareFeet: countyRecord.squareFeet,
        bedrooms: countyRecord.bedrooms,
        bathrooms: countyRecord.bathrooms,
        propertyType: countyRecord.propertyType,
      },
      mapPin: {
        latitude: countyRecord.latitude,
        longitude: countyRecord.longitude,
        source: "manual_import",
      },
      routeTracking: {
        routeName: countyRecord.routeName,
        routeStopNumber: countyRecord.routeStopNumber,
        gpsTrackingAllowed: false,
      },
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  });
  const scored = scorePropertyOpportunity(opportunityInput);

  return propertyCandidateInputSchema.parse({
    source: "county_import",
    sourceDetail: "Manual county/workbench evidence staged as PropertyCandidate. No provider call, scraping, skip trace, direct mail, outreach, Lead creation, or PropertyOpportunity creation.",
    propertyAddress: countyRecord.propertyAddress,
    city: countyRecord.city,
    state: countyRecord.state,
    zipCode: countyRecord.zipCode,
    county: countyRecord.county,
    parcelId: countyRecord.parcelId,
    latitude: countyRecord.latitude,
    longitude: countyRecord.longitude,
    coordinateSource: typeof countyRecord.latitude === "number" && typeof countyRecord.longitude === "number" ? "manual_import" : "",
    ownerName: countyRecord.ownerName,
    mailingAddress: countyRecord.mailingAddress,
    sourceEvidence: opportunityInput.evidence as Record<string, unknown>,
    observations: opportunityInput.observations,
    distressIndicators: scored.distressIndicators,
    confidence: scored.confidence,
    costCents: 0,
    creditsUsed: 0,
  });
}

export async function listPropertyCandidates(db: PropertyCandidateDb, tenantId = "default") {
  const candidates = (await db.propertyCandidate.findMany({ where: { tenantId } })).map(mapCandidate);
  const queue = createPropertyCandidateQueue(candidates);

  return {
    candidates,
    queue,
    providerCalled: false as const,
    providerWrite: false as const,
    sent: false as const,
    published: false as const,
    outreach: false as const,
    crmMutated: false as const,
    skipTracePerformed: false as const,
    directMailSent: false as const,
    externalExecutionAllowed: false as const,
    liveExecutionAllowed: false as const,
  };
}

export async function reviewPropertyCandidate(
  db: PropertyCandidateDb,
  candidateId: string,
  input: z.infer<typeof propertyCandidateReviewSchema>,
  context: { tenantId?: string; actorId?: string | null } = {},
) {
  const parsed = propertyCandidateReviewSchema.parse(input);
  const tenantId = context.tenantId ?? "default";
  const candidate = await db.propertyCandidate.findFirst({ where: { id: candidateId, tenantId } });
  if (!candidate) throw new Error("property_candidate_not_found");
  if (candidate.duplicateStatus !== "unique" && parsed.reviewStatus === "verified_candidate") {
    throw new Error("property_candidate_duplicate_resolution_required");
  }

  const updated = mapCandidate(await db.propertyCandidate.update({
    where: { id: candidateId, tenantId },
    data: { reviewStatus: parsed.reviewStatus },
  }));
  const action: PropertyCandidateAuditAction =
    parsed.reviewStatus === "verified_candidate" ? "candidate_verified" : parsed.reviewStatus === "rejected" ? "candidate_rejected" : "candidate_reviewed";

  await auditCandidate(db, {
    tenantId,
    actorId: context.actorId,
    action,
    targetId: updated.id,
    metadata: { source: updated.source, reviewStatus: updated.reviewStatus, duplicateStatus: updated.duplicateStatus },
  });

  return { candidate: updated, providerCalled: false as const, providerWrite: false as const, outreach: false as const, externalExecutionAllowed: false as const, liveExecutionAllowed: false as const };
}

function candidateToOpportunityInput(candidate: PropertyCandidateRecord): ManualDfdPropertyOpportunityInput {
  return manualDfdPropertyOpportunitySchema.parse({
    propertyAddress: candidate.propertyAddress,
    city: candidate.city ?? "",
    state: candidate.state ?? "",
    zipCode: candidate.zipCode ?? "",
    county: candidate.county ?? "",
    parcelId: candidate.parcelId ?? "",
    ownerName: candidate.ownerName ?? "",
    mailingAddress: candidate.mailingAddress ?? "",
    source: `property_candidate_${candidate.source}`,
    sourceDetail: `Verified PropertyCandidate ${candidate.id} promoted through explicit governed property-only path.`,
    distressFlags: Object.fromEntries(candidate.distressIndicators.map((indicator) => [indicator, true])),
    observations: Array.isArray(candidate.observations) ? candidate.observations : [],
    photoMetadata: [],
    evidence: {
      propertyCandidateId: candidate.id,
      sourceEvidence: candidate.sourceEvidence,
      duplicateStatus: candidate.duplicateStatus,
      verifiedPromotion: true,
      providerCalled: false,
      outreach: false,
    },
    unsafeEnrichmentRequested: false,
  });
}

export async function promotePropertyCandidate(
  candidateDb: PropertyCandidateDb,
  opportunityDb: PropertyOpportunityDb,
  candidateId: string,
  input: z.infer<typeof propertyCandidatePromotionSchema>,
  context: { tenantId?: string; actorId?: string | null } = {},
) {
  const parsed = propertyCandidatePromotionSchema.parse(input);
  const tenantId = context.tenantId ?? "default";
  await auditCandidate(candidateDb, { tenantId, actorId: context.actorId, action: "candidate_promotion_requested", targetId: candidateId, metadata: { promotionPath: parsed.path } });
  const candidate = await candidateDb.propertyCandidate.findFirst({ where: { id: candidateId, tenantId } });

  if (!candidate || candidate.reviewStatus !== "verified_candidate" || candidate.duplicateStatus !== "unique") {
    await auditCandidate(candidateDb, {
      tenantId,
      actorId: context.actorId,
      action: "candidate_promotion_blocked",
      targetId: candidateId,
      result: "blocked",
      metadata: { promotionPath: parsed.path, reviewStatus: candidate?.reviewStatus ?? null, duplicateStatus: candidate?.duplicateStatus ?? null },
    });
    throw new Error("property_candidate_promotion_requires_verified_unique_candidate");
  }

  if (parsed.path === "seller_provenance" && !hasText(String(parsed.sellerProvenance.provenanceType ?? ""))) {
    await auditCandidate(candidateDb, { tenantId, actorId: context.actorId, action: "candidate_promotion_blocked", targetId: candidateId, result: "blocked", metadata: { promotionPath: parsed.path } });
    throw new Error("seller_provenance_required_for_lead_promotion");
  }

  let promotedTarget: { targetType: "PropertyOpportunity" | "Lead"; targetId: string | null };
  if (parsed.path === "property_only") {
    const result = await import("@/lib/property-opportunity-engine").then(({ upsertManualDfdPropertyOpportunity }) =>
      upsertManualDfdPropertyOpportunity(opportunityDb, candidateToOpportunityInput(mapCandidate(candidate)), { tenantId, actorId: context.actorId ?? undefined }),
    );
    promotedTarget = { targetType: "PropertyOpportunity", targetId: result.opportunity.id };
  } else {
    if (!candidateDb.lead.create) throw new Error("lead_promotion_adapter_unavailable");
    const lead = await candidateDb.lead.create({
      data: {
        tenantId,
        name: "Verified seller provenance",
        phone: "",
        propertyAddress: candidate.propertyAddress,
        source: `property_candidate:${candidate.source}`,
        status: "new",
        score: 0,
        priority: "Low",
        notes: "Created only after explicit seller-provenance promotion. Existing Lead-to-PropertyOpportunity adapter remains responsible for opportunity conversion.",
        payload: JSON.stringify({
          propertyCandidateId: candidate.id,
          sellerProvenance: parsed.sellerProvenance,
          providerCalled: false,
          outreach: false,
        }),
      },
    });
    promotedTarget = { targetType: "Lead", targetId: lead.id };
  }

  const updated = mapCandidate(await candidateDb.propertyCandidate.update({
    where: { id: candidateId, tenantId },
    data: { reviewStatus: "promoted" },
  }));
  await auditCandidate(candidateDb, {
    tenantId,
    actorId: context.actorId,
    action: "candidate_promoted",
    targetId: candidateId,
    metadata: { promotionPath: parsed.path, reviewStatus: updated.reviewStatus, duplicateStatus: updated.duplicateStatus },
  });

  return {
    candidate: updated,
    promotedTarget,
    providerCalled: false as const,
    providerWrite: false as const,
    sent: false as const,
    published: false as const,
    outreach: false as const,
    crmMutated: false as const,
    skipTracePerformed: false as const,
    directMailSent: false as const,
    externalExecutionAllowed: false as const,
    liveExecutionAllowed: false as const,
  };
}
