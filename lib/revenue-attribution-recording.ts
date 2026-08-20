import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createAttributionChainKey,
  createSourceSpendIdempotencyKey,
  revenueAttributionAuditActions,
  revenueAttributionLedgerSafety,
  revenueAttributionLedgerVersion,
  type AppointmentOutcomeKind,
  type ContractOutcomeKind,
  type RevenueDataQualityStatus,
} from "@/lib/revenue-attribution-ledger";
import { logRevenueAuditEvent, sanitizeAuditMetadata } from "@/lib/revenue-spine";

const dataQualitySchema = z.enum(["VERIFIED", "PARTIAL", "ESTIMATED", "INSUFFICIENT_DATA", "CONFLICT", "UNKNOWN"]);
const sourceText = z.string().trim().min(1).max(160);
const optionalText = z.string().trim().max(240).optional().nullable();
const evidenceSchema = z.record(z.string(), z.unknown()).default({});
const nonNegativeInt = z.number().int().min(0);

export const sourceSpendRecordingSchema = z.object({
  kind: z.literal("source_spend"),
  idempotencyKey: z.string().trim().min(6).max(240).optional(),
  source: sourceText,
  campaign: optionalText,
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  providerFeesCents: nonNegativeInt.default(0),
  mailSpendCents: nonNegativeInt.default(0),
  adSpendCents: nonNegativeInt.default(0),
  otherSpendCents: nonNegativeInt.default(0),
  creditsConsumed: nonNegativeInt.default(0),
  currency: z.string().trim().length(3).default("USD"),
  evidenceSource: sourceText,
  verificationStatus: dataQualitySchema.default("PARTIAL"),
  businessContext: z.enum(["real_business", "test", "certification"]).default("real_business"),
  isTestRecord: z.boolean().default(false),
});

export const leadOutcomeRecordingSchema = z.object({
  kind: z.literal("lead_outcome"),
  idempotencyKey: z.string().trim().min(6).max(240).optional(),
  leadId: sourceText,
  propertyCandidateId: optionalText,
  propertyOpportunityId: optionalText,
  outcome: z.enum(["qualified", "disqualified", "human_review_required", "appointment_scheduled", "appointment_completed", "no_show", "offer_prepared", "contract_pending", "contract_signed", "lost", "closed"]),
  occurredAt: z.coerce.date(),
  evidence: evidenceSchema,
  sourceType: sourceText,
  sourceDetail: sourceText,
  campaignId: optionalText,
  referralCode: optionalText,
  landingPage: optionalText,
  verificationStatus: dataQualitySchema.default("PARTIAL"),
  businessOutcomeEventId: optionalText,
  businessContext: z.enum(["real_business", "test", "certification"]).default("real_business"),
  isTestRecord: z.boolean().default(false),
});

export const appointmentOutcomeRecordingSchema = z.object({
  kind: z.literal("appointment_outcome"),
  idempotencyKey: z.string().trim().min(6).max(240).optional(),
  leadId: sourceText,
  propertyOpportunityId: optionalText,
  appointmentReference: sourceText,
  scheduledAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  outcome: z.enum(["scheduled", "completed", "cancelled", "no_show"]),
  evidence: evidenceSchema,
  sourceType: sourceText,
  sourceDetail: sourceText,
  campaignId: optionalText,
  referralCode: optionalText,
  landingPage: optionalText,
  verificationStatus: dataQualitySchema.default("PARTIAL"),
  businessOutcomeEventId: optionalText,
  businessContext: z.enum(["real_business", "test", "certification"]).default("real_business"),
  isTestRecord: z.boolean().default(false),
});

export const contractOutcomeRecordingSchema = z.object({
  kind: z.literal("contract_outcome"),
  idempotencyKey: z.string().trim().min(6).max(240).optional(),
  leadId: sourceText,
  propertyOpportunityId: optionalText,
  contractReference: sourceText,
  outcome: z.enum(["prepared", "review_pending", "signed", "cancelled", "failed"]),
  signedAt: z.coerce.date().optional().nullable(),
  expectedValueCents: nonNegativeInt.optional().nullable(),
  evidence: evidenceSchema,
  sourceType: sourceText,
  sourceDetail: sourceText,
  campaignId: optionalText,
  referralCode: optionalText,
  landingPage: optionalText,
  verificationStatus: dataQualitySchema.default("PARTIAL"),
  businessOutcomeEventId: optionalText,
  businessContext: z.enum(["real_business", "test", "certification"]).default("real_business"),
  isTestRecord: z.boolean().default(false),
});

export const closedRevenueRecordingSchema = z.object({
  kind: z.literal("closed_revenue"),
  idempotencyKey: z.string().trim().min(6).max(240).optional(),
  leadId: optionalText,
  propertyOpportunityId: optionalText,
  contractReference: optionalText,
  closingReference: sourceText,
  revenueType: z.enum(["assignment_fee", "wholesale_spread", "referral_fee", "other_governed_real_estate_revenue"]),
  grossRevenueCents: z.number().int().positive(),
  directCostCents: nonNegativeInt.default(0),
  netRevenueCents: z.number().int(),
  closedAt: z.coerce.date(),
  verificationSource: sourceText,
  financeEntryId: optionalText,
  businessOutcomeEventId: optionalText,
  sourceType: sourceText,
  sourceDetail: sourceText,
  campaignId: optionalText,
  referralCode: optionalText,
  landingPage: optionalText,
  verificationStatus: z.literal("VERIFIED"),
  businessContext: z.enum(["real_business", "test", "certification"]).default("real_business"),
  isTestRecord: z.boolean().default(false),
  projectedRevenue: z.boolean().optional().default(false),
});

export const revenueRecordingRequestSchema = z.discriminatedUnion("kind", [
  sourceSpendRecordingSchema,
  leadOutcomeRecordingSchema,
  appointmentOutcomeRecordingSchema,
  contractOutcomeRecordingSchema,
  closedRevenueRecordingSchema,
]);

export const correctionRecordingSchema = z.object({
  targetType: z.enum(["source_spend", "lead_outcome", "appointment_outcome", "contract_outcome", "closed_revenue"]),
  targetId: sourceText,
  correctionReason: z.string().trim().min(8).max(1000),
});

export type RevenueRecordingRequest = z.infer<typeof revenueRecordingRequestSchema>;
export type CorrectionRecordingRequest = z.infer<typeof correctionRecordingSchema>;

export type RevenueRecordingContext = {
  tenantId: string;
  actorId: string;
  role: "ceo_admin" | "revenue_operations_ai" | "finance_role" | "deal_analyst_ai";
};

export type LedgerWriteDb = {
  raw<T>(query: string, ...values: unknown[]): Promise<T[]>;
  audit(input: Parameters<typeof logRevenueAuditEvent>[0]): Promise<unknown>;
};

export const revenueOutcomePermissionModel = [
  { role: "Marketing Director AI", permissions: ["read_source_performance", "prepare_recommendations"], canWrite: false },
  { role: "Revenue Operations AI", permissions: ["prepare_lead_outcomes", "prepare_appointment_outcomes"], canWrite: false },
  { role: "Finance role", permissions: ["review_financial_evidence", "prepare_closed_revenue"], canWrite: false },
  { role: "Deal Analyst AI", permissions: ["prepare_contract_outcomes"], canWrite: false },
  { role: "CEO/admin", permissions: ["record_verified_internal_outcomes", "approve_corrections"], canWrite: true },
  { role: "Autonomous Operations Supervisor AI", permissions: ["read_monitor_escalate"], canWrite: false },
] as const;

function hasOwnTenantId(value: unknown) {
  return Boolean(value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "tenantId"));
}

export function assertNoTenantOverride(payload: unknown) {
  if (!payload || typeof payload !== "object") return true;
  const record = payload as { tenantId?: unknown; record?: unknown; correction?: unknown };

  if (hasOwnTenantId(record) || hasOwnTenantId(record.record) || hasOwnTenantId(record.correction)) {
    throw new Error("tenant_override_denied");
  }

  return true;
}

const appointmentMap: Record<"scheduled" | "completed" | "cancelled" | "no_show", AppointmentOutcomeKind> = {
  scheduled: "appointmentScheduled",
  completed: "appointmentCompleted",
  cancelled: "appointmentCancelled",
  no_show: "appointmentNoShow",
};

const contractMap: Record<"prepared" | "review_pending" | "signed" | "cancelled" | "failed", ContractOutcomeKind> = {
  prepared: "contractPrepared",
  review_pending: "contractSentForReview",
  signed: "contractSigned",
  cancelled: "contractCancelled",
  failed: "contractFailed",
};

function inputJson(value: unknown) {
  return JSON.stringify(value ?? {});
}

function requireWritePermission(context: RevenueRecordingContext, kind: RevenueRecordingRequest["kind"] | "correction") {
  if (context.role !== "ceo_admin") {
    throw new Error(`unauthorized_ledger_write:${kind}`);
  }
}

function cleanNullable(value: string | null | undefined) {
  return value?.trim() || null;
}

function businessContext(input: { businessContext?: string; isTestRecord?: boolean }) {
  if (input.isTestRecord) return { businessContext: input.businessContext === "real_business" ? "test" : input.businessContext ?? "test", isTestRecord: true };
  return { businessContext: input.businessContext ?? "real_business", isTestRecord: input.businessContext === "test" || input.businessContext === "certification" };
}

function createDefaultDb(): LedgerWriteDb {
  return {
    async raw<T>(query: string, ...values: unknown[]) {
      return prisma.$queryRawUnsafe<T[]>(query, ...values);
    },
    audit: logRevenueAuditEvent,
  };
}

async function assertLeadBelongsToTenant(db: LedgerWriteDb, tenantId: string, leadId: string) {
  const rows = await db.raw<{ id: string }>(
    `SELECT "id" FROM "Lead" WHERE "id" = $1 AND EXISTS (
      SELECT 1 FROM "RevenueLeadSource" WHERE "RevenueLeadSource"."leadId" = "Lead"."id" AND "RevenueLeadSource"."tenantId" = $2
    ) LIMIT 1`,
    leadId,
    tenantId,
  );
  if (rows.length === 0) throw new Error("lead_not_found_for_tenant");
}

async function assertPropertyOpportunityBelongsToTenant(db: LedgerWriteDb, tenantId: string, propertyOpportunityId: string | null | undefined) {
  if (!propertyOpportunityId) return;
  const rows = await db.raw<{ id: string }>(`SELECT "id" FROM "PropertyOpportunity" WHERE "id" = $1 AND "tenantId" = $2 LIMIT 1`, propertyOpportunityId, tenantId);
  if (rows.length === 0) throw new Error("property_opportunity_not_found_for_tenant");
}

async function writeAudit(db: LedgerWriteDb, input: {
  tenantId: string;
  actorId: string;
  action: (typeof revenueAttributionAuditActions)[number];
  targetType: string;
  targetId?: string | null;
  metadata: Record<string, unknown>;
}) {
  await db.audit({
    tenantId: input.tenantId,
    actorId: input.actorId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId ?? null,
    source: revenueAttributionLedgerVersion,
    metadata: sanitizeAuditMetadata({
      ...input.metadata,
      ...revenueAttributionLedgerSafety,
    }),
  });
}

async function upsertAttributionChain(db: LedgerWriteDb, input: {
  tenantId: string;
  actorId: string;
  chainKey: string;
  sourceType: string;
  sourceDetail: string;
  campaignId?: string | null;
  referralCode?: string | null;
  landingPage?: string | null;
  leadId?: string | null;
  propertyCandidateId?: string | null;
  propertyOpportunityId?: string | null;
  appointmentReference?: string | null;
  contractReference?: string | null;
  closingReference?: string | null;
  financeEntryId?: string | null;
  businessOutcomeEventId?: string | null;
  dataQualityStatus: RevenueDataQualityStatus;
}) {
  const rows = await db.raw<{ id: string }>(
    `INSERT INTO "RevenueAttributionChain" (
      "id", "tenantId", "chainKey", "sourceType", "sourceDetail", "campaignId", "referralCode", "landingPage",
      "leadId", "propertyCandidateId", "propertyOpportunityId", "appointmentReference", "contractReference", "closingReference",
      "financeEntryId", "businessOutcomeEventId", "dataQualityStatus", "evidenceSource", "createdBy", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT ("tenantId", "chainKey") DO UPDATE SET
      "sourceType" = "RevenueAttributionChain"."sourceType",
      "sourceDetail" = "RevenueAttributionChain"."sourceDetail",
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "id"`,
    input.tenantId,
    input.chainKey,
    input.sourceType,
    input.sourceDetail,
    cleanNullable(input.campaignId),
    cleanNullable(input.referralCode),
    cleanNullable(input.landingPage),
    cleanNullable(input.leadId),
    cleanNullable(input.propertyCandidateId),
    cleanNullable(input.propertyOpportunityId),
    cleanNullable(input.appointmentReference),
    cleanNullable(input.contractReference),
    cleanNullable(input.closingReference),
    cleanNullable(input.financeEntryId),
    cleanNullable(input.businessOutcomeEventId),
    input.dataQualityStatus,
    revenueAttributionLedgerVersion,
    input.actorId,
  );
  await writeAudit(db, {
    tenantId: input.tenantId,
    actorId: input.actorId,
    action: "attribution_link_created",
    targetType: "RevenueAttributionChain",
    targetId: rows[0]?.id ?? input.chainKey,
    metadata: {
      chainKey: input.chainKey,
      sourceType: input.sourceType,
      sourceDetail: input.sourceDetail,
      campaignId: input.campaignId ?? null,
      referralCode: input.referralCode ?? null,
      dataQualityStatus: input.dataQualityStatus,
    },
  });
  return rows[0]?.id ?? null;
}

async function upsertMaterialBusinessOutcome(db: LedgerWriteDb, input: {
  tenantId: string;
  leadId?: string | null;
  sourceType: string;
  sourceId?: string | null;
  actionKey: "appointment_completed" | "contract_signed" | "deal_closed";
  expectedOutcome: string;
  actualOutcome: string;
  nextRecommendation: string;
  revenueImpactEstimate?: string | null;
  metadata: Record<string, unknown>;
}) {
  const outcomeKey = `${input.actionKey}:${input.sourceId ?? input.leadId ?? "unknown"}`;
  const rows = await db.raw<{ id: string }>(
    `INSERT INTO "BusinessOutcomeEvent" (
      "id", "tenantId", "outcomeKey", "sourceType", "sourceId", "leadId", "actionKey", "expectedOutcome",
      "actualOutcome", "kpiAffected", "revenueImpactEstimate", "confidence", "nextRecommendation", "safeMetadata",
      "providerCalled", "sent", "published", "liveExecutionAllowed", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
      $8, $9::jsonb, $10, 80, $11, $12::jsonb,
      false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT ("tenantId", "outcomeKey") DO UPDATE SET
      "actualOutcome" = EXCLUDED."actualOutcome",
      "safeMetadata" = EXCLUDED."safeMetadata",
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "id"`,
    input.tenantId,
    outcomeKey,
    input.sourceType,
    cleanNullable(input.sourceId),
    cleanNullable(input.leadId),
    input.actionKey,
    input.expectedOutcome,
    input.actualOutcome,
    JSON.stringify(["revenue_attribution", "pipeline_conversion"]),
    input.revenueImpactEstimate ?? null,
    input.nextRecommendation,
    JSON.stringify(sanitizeAuditMetadata(input.metadata)),
  );
  return rows[0]?.id ?? null;
}

export async function recordRevenueLedgerEvent(
  request: RevenueRecordingRequest,
  context: RevenueRecordingContext,
  db: LedgerWriteDb = createDefaultDb(),
) {
  requireWritePermission(context, request.kind);

  if (request.kind === "source_spend") {
    if (request.periodEnd < request.periodStart) throw new Error("invalid_spend_period");
    const spendCents = request.providerFeesCents + request.mailSpendCents + request.adSpendCents + request.otherSpendCents;
    const idempotencyKey = request.idempotencyKey ?? createSourceSpendIdempotencyKey({
      tenantId: context.tenantId,
      source: request.source,
      campaign: request.campaign,
      periodStart: request.periodStart,
      periodEnd: request.periodEnd,
      evidenceSource: request.evidenceSource,
    });
    const flags = businessContext(request);
    const rows = await db.raw<{ id: string }>(
      `INSERT INTO "SourceSpend" (
        "id", "tenantId", "idempotencyKey", "source", "campaign", "periodStart", "periodEnd", "spendCents", "creditsConsumed",
        "providerFeesCents", "mailSpendCents", "adSpendCents", "otherSpendCents", "currency", "recordedBy", "evidenceSource",
        "verificationStatus", "businessContext", "isTestRecord", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT ("tenantId", "idempotencyKey") DO UPDATE SET "updatedAt" = "SourceSpend"."updatedAt"
      RETURNING "id"`,
      context.tenantId,
      idempotencyKey,
      request.source,
      cleanNullable(request.campaign),
      request.periodStart,
      request.periodEnd,
      spendCents,
      request.creditsConsumed,
      request.providerFeesCents,
      request.mailSpendCents,
      request.adSpendCents,
      request.otherSpendCents,
      request.currency,
      context.actorId,
      request.evidenceSource,
      request.verificationStatus,
      flags.businessContext,
      flags.isTestRecord,
    );
    await writeAudit(db, {
      tenantId: context.tenantId,
      actorId: context.actorId,
      action: "source_spend_recorded",
      targetType: "SourceSpend",
      targetId: rows[0]?.id ?? idempotencyKey,
      metadata: { source: request.source, campaign: request.campaign ?? null, spendCents, idempotencyKey, verificationStatus: request.verificationStatus },
    });
    return { ok: true, kind: request.kind, id: rows[0]?.id ?? null, idempotencyKey, providerCalled: false as const, liveExecutionAllowed: false as const };
  }

  if (request.kind === "lead_outcome") {
    await assertLeadBelongsToTenant(db, context.tenantId, request.leadId);
    await assertPropertyOpportunityBelongsToTenant(db, context.tenantId, request.propertyOpportunityId);
    const idempotencyKey = request.idempotencyKey ?? `lead:${request.leadId}:${request.outcome}:${request.occurredAt.toISOString()}`;
    const chainKey = createAttributionChainKey({ ...request, tenantId: context.tenantId, leadId: request.leadId, propertyOpportunityId: request.propertyOpportunityId });
    await upsertAttributionChain(db, { ...request, tenantId: context.tenantId, actorId: context.actorId, chainKey, dataQualityStatus: request.verificationStatus });
    const flags = businessContext(request);
    const rows = await db.raw<{ id: string }>(
      `INSERT INTO "LeadOutcomeEvent" (
        "id", "tenantId", "idempotencyKey", "leadId", "propertyCandidateId", "propertyOpportunityId", "outcome", "occurredAt",
        "actorId", "evidence", "sourceType", "sourceDetail", "campaignId", "referralCode", "landingPage", "attributionChainKey",
        "businessOutcomeEventId", "verificationStatus", "businessContext", "isTestRecord", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
        $8, $9::jsonb, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT ("tenantId", "idempotencyKey") DO UPDATE SET "updatedAt" = "LeadOutcomeEvent"."updatedAt"
      RETURNING "id"`,
      context.tenantId,
      idempotencyKey,
      request.leadId,
      cleanNullable(request.propertyCandidateId),
      cleanNullable(request.propertyOpportunityId),
      request.outcome,
      request.occurredAt,
      context.actorId,
      inputJson(request.evidence),
      request.sourceType,
      request.sourceDetail,
      cleanNullable(request.campaignId),
      cleanNullable(request.referralCode),
      cleanNullable(request.landingPage),
      chainKey,
      cleanNullable(request.businessOutcomeEventId),
      request.verificationStatus,
      flags.businessContext,
      flags.isTestRecord,
    );
    await writeAudit(db, { tenantId: context.tenantId, actorId: context.actorId, action: "lead_outcome_recorded", targetType: "LeadOutcomeEvent", targetId: rows[0]?.id ?? idempotencyKey, metadata: { leadId: request.leadId, outcome: request.outcome, idempotencyKey, chainKey } });
    return { ok: true, kind: request.kind, id: rows[0]?.id ?? null, idempotencyKey, attributionChainKey: chainKey, providerCalled: false as const, liveExecutionAllowed: false as const };
  }

  if (request.kind === "appointment_outcome") {
    await assertLeadBelongsToTenant(db, context.tenantId, request.leadId);
    await assertPropertyOpportunityBelongsToTenant(db, context.tenantId, request.propertyOpportunityId);
    const outcome = appointmentMap[request.outcome];
    const materialOutcomeId = outcome === "appointmentCompleted"
      ? await upsertMaterialBusinessOutcome(db, {
          tenantId: context.tenantId,
          leadId: request.leadId,
          sourceType: "appointment_outcome",
          sourceId: request.appointmentReference,
          actionKey: "appointment_completed",
          expectedOutcome: "Appointment completed with seller or authorized party.",
          actualOutcome: "appointment_completed",
          nextRecommendation: "Review contract or offer readiness if evidence supports it.",
          metadata: { appointmentReference: request.appointmentReference, propertyOpportunityId: request.propertyOpportunityId ?? null },
        })
      : null;
    const idempotencyKey = request.idempotencyKey ?? `appointment:${request.appointmentReference}:${outcome}`;
    const chainKey = createAttributionChainKey({ ...request, tenantId: context.tenantId, leadId: request.leadId, propertyOpportunityId: request.propertyOpportunityId, appointmentReference: request.appointmentReference });
    await upsertAttributionChain(db, { ...request, tenantId: context.tenantId, actorId: context.actorId, chainKey, appointmentReference: request.appointmentReference, businessOutcomeEventId: request.businessOutcomeEventId ?? materialOutcomeId, dataQualityStatus: request.verificationStatus });
    const flags = businessContext(request);
    const rows = await db.raw<{ id: string }>(
      `INSERT INTO "AppointmentOutcomeEvent" (
        "id", "tenantId", "idempotencyKey", "leadId", "propertyOpportunityId", "appointmentReference", "scheduledAt", "completedAt",
        "outcome", "actorId", "evidence", "sourceType", "sourceDetail", "campaignId", "referralCode", "landingPage",
        "attributionChainKey", "businessOutcomeEventId", "verificationStatus", "businessContext", "isTestRecord", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10::jsonb, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT ("tenantId", "idempotencyKey") DO UPDATE SET "updatedAt" = "AppointmentOutcomeEvent"."updatedAt"
      RETURNING "id"`,
      context.tenantId,
      idempotencyKey,
      request.leadId,
      cleanNullable(request.propertyOpportunityId),
      request.appointmentReference,
      request.scheduledAt ?? null,
      request.completedAt ?? null,
      outcome,
      context.actorId,
      inputJson(request.evidence),
      request.sourceType,
      request.sourceDetail,
      cleanNullable(request.campaignId),
      cleanNullable(request.referralCode),
      cleanNullable(request.landingPage),
      chainKey,
      cleanNullable(request.businessOutcomeEventId ?? materialOutcomeId),
      request.verificationStatus,
      flags.businessContext,
      flags.isTestRecord,
    );
    await writeAudit(db, { tenantId: context.tenantId, actorId: context.actorId, action: "appointment_outcome_recorded", targetType: "AppointmentOutcomeEvent", targetId: rows[0]?.id ?? idempotencyKey, metadata: { leadId: request.leadId, appointmentReference: request.appointmentReference, outcome, idempotencyKey, businessOutcomeEventId: materialOutcomeId } });
    return { ok: true, kind: request.kind, id: rows[0]?.id ?? null, idempotencyKey, attributionChainKey: chainKey, businessOutcomeEventId: materialOutcomeId, providerCalled: false as const, liveExecutionAllowed: false as const };
  }

  if (request.kind === "contract_outcome") {
    await assertLeadBelongsToTenant(db, context.tenantId, request.leadId);
    await assertPropertyOpportunityBelongsToTenant(db, context.tenantId, request.propertyOpportunityId);
    const outcome = contractMap[request.outcome];
    const materialOutcomeId = outcome === "contractSigned"
      ? await upsertMaterialBusinessOutcome(db, {
          tenantId: context.tenantId,
          leadId: request.leadId,
          sourceType: "contract_outcome",
          sourceId: request.contractReference,
          actionKey: "contract_signed",
          expectedOutcome: "Contract signed after human verification.",
          actualOutcome: "contract_signed",
          nextRecommendation: "Review closing readiness and finance evidence.",
          revenueImpactEstimate: request.expectedValueCents ? "expected_value_present_not_realized_revenue" : null,
          metadata: { contractReference: request.contractReference, expectedValueCents: request.expectedValueCents ?? null },
        })
      : null;
    const idempotencyKey = request.idempotencyKey ?? `contract:${request.contractReference}:${outcome}`;
    const chainKey = createAttributionChainKey({ ...request, tenantId: context.tenantId, leadId: request.leadId, propertyOpportunityId: request.propertyOpportunityId, contractReference: request.contractReference });
    await upsertAttributionChain(db, { ...request, tenantId: context.tenantId, actorId: context.actorId, chainKey, contractReference: request.contractReference, businessOutcomeEventId: request.businessOutcomeEventId ?? materialOutcomeId, dataQualityStatus: request.verificationStatus });
    const flags = businessContext(request);
    const rows = await db.raw<{ id: string }>(
      `INSERT INTO "ContractOutcomeEvent" (
        "id", "tenantId", "idempotencyKey", "leadId", "propertyOpportunityId", "contractReference", "outcome", "signedAt",
        "expectedValueCents", "actorId", "evidence", "sourceType", "sourceDetail", "campaignId", "referralCode", "landingPage",
        "attributionChainKey", "businessOutcomeEventId", "verificationStatus", "businessContext", "isTestRecord", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10::jsonb, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT ("tenantId", "idempotencyKey") DO UPDATE SET "updatedAt" = "ContractOutcomeEvent"."updatedAt"
      RETURNING "id"`,
      context.tenantId,
      idempotencyKey,
      request.leadId,
      cleanNullable(request.propertyOpportunityId),
      request.contractReference,
      outcome,
      request.signedAt ?? null,
      request.expectedValueCents ?? null,
      context.actorId,
      inputJson(request.evidence),
      request.sourceType,
      request.sourceDetail,
      cleanNullable(request.campaignId),
      cleanNullable(request.referralCode),
      cleanNullable(request.landingPage),
      chainKey,
      cleanNullable(request.businessOutcomeEventId ?? materialOutcomeId),
      request.verificationStatus,
      flags.businessContext,
      flags.isTestRecord,
    );
    await writeAudit(db, { tenantId: context.tenantId, actorId: context.actorId, action: "contract_outcome_recorded", targetType: "ContractOutcomeEvent", targetId: rows[0]?.id ?? idempotencyKey, metadata: { leadId: request.leadId, contractReference: request.contractReference, outcome, idempotencyKey, businessOutcomeEventId: materialOutcomeId } });
    return { ok: true, kind: request.kind, id: rows[0]?.id ?? null, idempotencyKey, attributionChainKey: chainKey, businessOutcomeEventId: materialOutcomeId, providerCalled: false as const, liveExecutionAllowed: false as const };
  }

  if (request.projectedRevenue) throw new Error("projected_revenue_cannot_be_recorded_as_realized");
  if (request.netRevenueCents !== request.grossRevenueCents - request.directCostCents) throw new Error("net_revenue_must_equal_gross_minus_direct_cost");
  if (request.leadId) await assertLeadBelongsToTenant(db, context.tenantId, request.leadId);
  await assertPropertyOpportunityBelongsToTenant(db, context.tenantId, request.propertyOpportunityId);
  const materialOutcomeId = await upsertMaterialBusinessOutcome(db, {
    tenantId: context.tenantId,
    leadId: request.leadId,
    sourceType: "closed_revenue_outcome",
    sourceId: request.closingReference,
    actionKey: "deal_closed",
    expectedOutcome: "Verified real estate revenue closed.",
    actualOutcome: "deal_closed",
    nextRecommendation: "Include this verified realized revenue in source ROI reporting.",
    revenueImpactEstimate: "verified_realized_revenue_recorded_in_closed_revenue_outcome",
    metadata: { closingReference: request.closingReference, revenueType: request.revenueType, financeEntryId: request.financeEntryId ?? null },
  });
  const idempotencyKey = request.idempotencyKey ?? `closed-revenue:${request.closingReference}:${request.revenueType}`;
  const chainKey = createAttributionChainKey({ ...request, tenantId: context.tenantId, leadId: request.leadId, propertyOpportunityId: request.propertyOpportunityId, contractReference: request.contractReference, closingReference: request.closingReference });
  await upsertAttributionChain(db, { ...request, tenantId: context.tenantId, actorId: context.actorId, chainKey, businessOutcomeEventId: request.businessOutcomeEventId ?? materialOutcomeId, dataQualityStatus: "VERIFIED" });
  const flags = businessContext(request);
  const rows = await db.raw<{ id: string }>(
    `INSERT INTO "ClosedRevenueOutcomeEvent" (
      "id", "tenantId", "idempotencyKey", "leadId", "propertyOpportunityId", "contractReference", "closingReference", "revenueType",
      "grossRevenueCents", "directCostCents", "netRevenueCents", "closedAt", "verificationSource", "financeEntryId", "businessOutcomeEventId",
      "sourceType", "sourceDetail", "campaignId", "referralCode", "landingPage", "attributionChainKey", "verificationStatus",
      "businessContext", "isTestRecord", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, 'VERIFIED',
      $21, $22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT ("tenantId", "idempotencyKey") DO UPDATE SET "updatedAt" = "ClosedRevenueOutcomeEvent"."updatedAt"
    RETURNING "id"`,
    context.tenantId,
    idempotencyKey,
    cleanNullable(request.leadId),
    cleanNullable(request.propertyOpportunityId),
    cleanNullable(request.contractReference),
    request.closingReference,
    request.revenueType,
    request.grossRevenueCents,
    request.directCostCents,
    request.netRevenueCents,
    request.closedAt,
    request.verificationSource,
    cleanNullable(request.financeEntryId),
    cleanNullable(request.businessOutcomeEventId ?? materialOutcomeId),
    request.sourceType,
    request.sourceDetail,
    cleanNullable(request.campaignId),
    cleanNullable(request.referralCode),
    cleanNullable(request.landingPage),
    chainKey,
    flags.businessContext,
    flags.isTestRecord,
  );
  await writeAudit(db, { tenantId: context.tenantId, actorId: context.actorId, action: "closed_revenue_recorded", targetType: "ClosedRevenueOutcomeEvent", targetId: rows[0]?.id ?? idempotencyKey, metadata: { leadId: request.leadId ?? null, closingReference: request.closingReference, revenueType: request.revenueType, idempotencyKey, financeEntryId: request.financeEntryId ?? null, businessOutcomeEventId: materialOutcomeId } });
  return { ok: true, kind: request.kind, id: rows[0]?.id ?? null, idempotencyKey, attributionChainKey: chainKey, businessOutcomeEventId: materialOutcomeId, providerCalled: false as const, liveExecutionAllowed: false as const };
}

const correctionTable: Record<CorrectionRecordingRequest["targetType"], string> = {
  source_spend: "SourceSpend",
  lead_outcome: "LeadOutcomeEvent",
  appointment_outcome: "AppointmentOutcomeEvent",
  contract_outcome: "ContractOutcomeEvent",
  closed_revenue: "ClosedRevenueOutcomeEvent",
};

export async function recordRevenueLedgerCorrection(
  request: CorrectionRecordingRequest,
  context: RevenueRecordingContext,
  db: LedgerWriteDb = createDefaultDb(),
) {
  requireWritePermission(context, "correction");
  const table = correctionTable[request.targetType];
  const rows = await db.raw<{ id: string }>(
    `UPDATE "${table}"
     SET "correctedById" = $1, "correctionReason" = $2, "updatedAt" = CURRENT_TIMESTAMP
     WHERE "id" = $3 AND "tenantId" = $4
     RETURNING "id"`,
    context.actorId,
    request.correctionReason,
    request.targetId,
    context.tenantId,
  );
  if (rows.length === 0) throw new Error("correction_target_not_found_for_tenant");
  await writeAudit(db, { tenantId: context.tenantId, actorId: context.actorId, action: "outcome_corrected", targetType: table, targetId: request.targetId, metadata: { correctionReason: request.correctionReason } });
  return { ok: true, targetType: request.targetType, targetId: request.targetId, providerCalled: false as const, liveExecutionAllowed: false as const };
}

export type SpeedToLeadInput = {
  leadId: string;
  priority?: "High" | "Medium" | "Low" | string | null;
  leadReceivedAt?: Date | string | null;
  firstInternalReviewAt?: Date | string | null;
  firstHumanContactAt?: Date | string | null;
  appointmentScheduledAt?: Date | string | null;
  now?: Date | string | null;
};

function millis(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

export function calculateSpeedToLead(input: SpeedToLeadInput) {
  const received = millis(input.leadReceivedAt);
  const review = millis(input.firstInternalReviewAt);
  const contact = millis(input.firstHumanContactAt);
  const appointment = millis(input.appointmentScheduledAt);
  const now = millis(input.now) ?? Date.now();
  const timeToInternalReviewMinutes = received && review ? Math.round((review - received) / 60_000) : null;
  const timeToFirstContactMinutes = received && contact ? Math.round((contact - received) / 60_000) : null;
  const timeToAppointmentMinutes = received && appointment ? Math.round((appointment - received) / 60_000) : null;
  const ageMinutes = received ? Math.round((now - received) / 60_000) : null;
  const slaClassification =
    !received ? "UNKNOWN"
    : input.priority === "High" && timeToInternalReviewMinutes !== null && timeToInternalReviewMinutes <= 5 ? "HOT_LEAD_UNDER_5_MINUTES"
    : timeToFirstContactMinutes === null ? "NO_CONTACT_EVIDENCE"
    : input.priority === "Medium" && timeToFirstContactMinutes <= 24 * 60 ? "WARM_LEAD_SAME_DAY"
    : ageMinutes !== null && ageMinutes > 24 * 60 ? "OVERDUE"
    : "UNKNOWN";

  return {
    leadId: input.leadId,
    timeToInternalReviewMinutes,
    timeToFirstContactMinutes,
    timeToAppointmentMinutes,
    slaClassification,
    providerCalled: false as const,
    sent: false as const,
    published: false as const,
    liveExecutionAllowed: false as const,
  };
}
