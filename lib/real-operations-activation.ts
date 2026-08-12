import type { PrismaClient } from "@/generated/prisma";
import type { StoredLead } from "@/lib/leads-storage";
import {
  createExistingLeadEligibilityReport,
  createExistingLeadAdaptationDryRun,
  propertyOpportunitySafetyFlags,
  type PropertyOpportunityLeadAdapterReport,
} from "@/lib/property-opportunity-engine";

export const realOperationsProductionApprovalPhrase =
  "AUTHORIZE_ONE_PRODUCTION_INTERNAL_EXISTING_LEAD_TO_PROPERTY_OPPORTUNITY_ADAPTATION_NO_PROVIDER_NO_OUTREACH" as const;

export const realOperationsSafety = Object.freeze({
  internalOnly: true,
  providerCalled: false,
  sent: false,
  published: false,
  outreach: false,
  scraping: false,
  crmMutated: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
});

export function parseRealOperationsActivationRequest(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false as const, status: 400, error: "Request body must be a JSON object." };
  }
  const value = body as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(value, "tenantId")) {
    return { ok: false as const, status: 400, error: "Tenant is derived from the authenticated session." };
  }
  const mode = value.mode === undefined ? "dry_run" : value.mode;
  if (mode !== "dry_run" && mode !== "execute") {
    return { ok: false as const, status: 400, error: "Mode must be dry_run or execute." };
  }
  return { ok: true as const, mode, confirmation: typeof value.confirmation === "string" ? value.confirmation : null };
}

type ReadinessPrisma = Pick<PrismaClient, "$queryRawUnsafe"> & {
  propertyOpportunity?: {
    count(args: unknown): Promise<number>;
    findMany(args: unknown): Promise<unknown[]>;
  };
  revenueTask?: { findMany(args: unknown): Promise<Array<{ source?: string | null; status?: string | null }>> };
};

type TableRow = { table_name: string };
type MigrationRow = { migration_name: string; finished: boolean; rolled_back: boolean };
type CountRow = { total: number | bigint };

function numberValue(value: number | bigint | undefined) {
  return Number(value ?? 0);
}

export async function inspectRealOperationsPersistence(db: ReadinessPrisma, tenantId: string) {
  try {
    const tables = await db.$queryRawUnsafe<TableRow[]>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_name IN ('Lead','PropertyOpportunity','PropertyOpportunitySavedFilter','RevenueTask','RevenueAuditEvent') ORDER BY table_name`,
    );
    const tableNames = new Set(tables.map((row) => row.table_name));
    const requiredTables = ["Lead", "PropertyOpportunity", "PropertyOpportunitySavedFilter", "RevenueTask", "RevenueAuditEvent"];
    const missingTables = requiredTables.filter((table) => !tableNames.has(table));
    const migrations = await db.$queryRawUnsafe<MigrationRow[]>(
      `SELECT migration_name, finished_at IS NOT NULL AS finished, rolled_back_at IS NOT NULL AS rolled_back FROM "_prisma_migrations" WHERE migration_name = '20260807160000_add_property_opportunity_engine'`,
    );
    const migration = migrations[0] ?? null;
    let opportunityCount = 0;
    let openAcquisitionReviewTasks = 0;

    if (missingTables.length === 0) {
      const opportunities = await db.$queryRawUnsafe<CountRow[]>(
        `SELECT count(*)::int AS total FROM "PropertyOpportunity" WHERE "tenantId" = $1`,
        tenantId,
      );
      const tasks = await db.$queryRawUnsafe<CountRow[]>(
        `SELECT count(*)::int AS total FROM "RevenueTask" WHERE "tenantId" = $1 AND "taskType" = 'property_opportunity_acquisition_review' AND "status" = 'open'`,
        tenantId,
      );
      opportunityCount = numberValue(opportunities[0]?.total);
      openAcquisitionReviewTasks = numberValue(tasks[0]?.total);
    }

    const schemaReady = missingTables.length === 0 && Boolean(migration?.finished && !migration.rolled_back);
    return {
      checked: true,
      schemaReady,
      requiredMigration: "20260807160000_add_property_opportunity_engine",
      migration: migration ? { finished: migration.finished, rolledBack: migration.rolled_back } : null,
      missingTables,
      opportunityCount,
      openAcquisitionReviewTasks,
      reasonCodes: [
        ...missingTables.map((table) => `missing_table:${table}`),
        ...(!migration ? ["migration_ledger_entry_missing"] : []),
        ...(migration && (!migration.finished || migration.rolled_back) ? ["migration_not_cleanly_applied"] : []),
      ],
    };
  } catch {
    return {
      checked: false,
      schemaReady: false,
      requiredMigration: "20260807160000_add_property_opportunity_engine",
      migration: null,
      missingTables: [],
      opportunityCount: 0,
      openAcquisitionReviewTasks: 0,
      reasonCodes: ["production_schema_read_unavailable"],
    };
  }
}

export async function createRealOperationsReadinessReport(input: {
  db: ReadinessPrisma;
  tenantId: string;
  leads: StoredLead[];
  environment?: string;
}) {
  const persistence = await inspectRealOperationsPersistence(input.db, input.tenantId);
  const eligibility = createExistingLeadEligibilityReport(input.leads);
  const eligibleDuplicateKeys = [...new Set(eligibility.records.filter((record) => record.eligible && record.duplicateKey).map((record) => record.duplicateKey as string))];
  const existingOpportunityMatches = persistence.schemaReady && eligibleDuplicateKeys.length > 0 && input.db.propertyOpportunity
    ? await input.db.propertyOpportunity.count({ where: { tenantId: input.tenantId, duplicateKey: { in: eligibleDuplicateKeys } } }).catch(() => 0)
    : 0;
  const existingOpportunities = persistence.schemaReady && input.db.propertyOpportunity
    ? await input.db.propertyOpportunity.findMany({
        where: { tenantId: input.tenantId },
        select: { id: true, tenantId: true, duplicateKey: true, evidence: true, opportunityScore: true },
      }).catch(() => [])
    : [];
  const existingTasks = persistence.schemaReady && input.db.revenueTask
    ? await input.db.revenueTask.findMany({
        where: { tenantId: input.tenantId, taskType: "property_opportunity_acquisition_review" },
        select: { source: true, status: true },
      }).catch(() => [])
    : [];
  const dryRun = createExistingLeadAdaptationDryRun({
    leads: input.leads,
    existingOpportunities: existingOpportunities as Parameters<typeof createExistingLeadAdaptationDryRun>[0]["existingOpportunities"],
    existingTasks,
  });
  const readyForProductionAuthorization =
    input.tenantId === "default" && persistence.schemaReady && eligibility.eligiblePropertyLeads > 0;

  return {
    classification: readyForProductionAuthorization
      ? "REAL_OPERATIONS_DRY_RUN_READY"
      : "REAL_OPERATIONS_DRY_RUN_BLOCKED",
    tenantId: input.tenantId,
    environment: input.environment ?? "unknown",
    persistence,
    inventory: {
      scannedLeads: eligibility.scannedLeads,
      eligiblePropertyLeads: eligibility.eligiblePropertyLeads,
      excludedLeads: eligibility.excludedLeads,
      ambiguousLeads: eligibility.ambiguousLeads,
      duplicateCandidates: eligibility.duplicateCandidates,
      existingOpportunityMatches,
      provenanceCounts: eligibility.provenanceCounts,
      reasonCounts: eligibility.reasonCounts,
    },
    dryRun,
    readyForProductionAuthorization,
    exactApprovalPhrase: readyForProductionAuthorization ? realOperationsProductionApprovalPhrase : null,
    ...realOperationsSafety,
  };
}

export function createRealOperationsExecutiveProjection(report: PropertyOpportunityLeadAdapterReport) {
  const acquisitionDecisionCount = report.streamAudit.highPriorityRecent;
  return {
    morningBriefSignals: acquisitionDecisionCount > 0
      ? [{
          title: "Qualified property opportunities require Acquisition Review",
          summary: `${acquisitionDecisionCount} recent high-priority real property opportunity${acquisitionDecisionCount === 1 ? "" : "s"} require internal acquisition review.`,
          ceoBusinessDecisionRequired: true,
        }]
      : [],
    exceptionInboxItems: [
      ...(report.ambiguousLeads > 0
        ? [{
            type: "ambiguous_lead_provenance",
            summary: `${report.ambiguousLeads} lead record${report.ambiguousLeads === 1 ? " has" : "s have"} ambiguous provenance and remain excluded.`,
            ceoBusinessDecisionRequired: false,
            engineeringRemediationRequired: true,
          }]
        : []),
    ],
    propertyOpportunitySafetyFlags,
    ...realOperationsSafety,
  };
}
