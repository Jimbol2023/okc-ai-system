import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const productionSchemaAlignmentMigration = {
  migrationId: "20260716100000_harden_business_data_snapshots",
  relativePath: "prisma/migrations/20260716100000_harden_business_data_snapshots/migration.sql",
  expectedSha256: "3F667C5DAE5C18063F673ADCE4C05ECE74747571AEDE6D67519FAA79B42D39C1",
  status: "pending_production_execution",
  requiredColumns: ["version", "contractVersion", "evidenceHash", "observationStart", "observationEnd", "traceId", "reliability"],
} as const;
export const productionSchemaAlignmentApprovalPhrase = "APPROVE_PRODUCTION_SCHEMA_ALIGNMENT_20260716100000";

export type ProductionMigrationLedgerState = "absent" | "applied_successfully" | "failed" | "rolled_back" | "unknown";
export type ProductionSchemaAlignmentReadinessState =
  | "ready_to_execute"
  | "already_applied_verify_only"
  | "blocked"
  | "complete"
  | "review_required";
export type ProductionDepartmentVerificationState = "not_checked" | "passed" | "failed";

export type ProductionSchemaAlignmentOperatorEvidence = {
  ledgerState?: ProductionMigrationLedgerState;
  pendingMigrationsInOrder?: string[];
  schemaColumns?: Array<{
    columnName: string;
    dataType: string;
    isNullable: string;
    columnDefault: string | null;
  }>;
  pitrOrBackupEnabled?: boolean;
  latestKnownRecoverablePoint?: string;
  recoveryOwner?: string;
  targetRto?: string;
  targetRpo?: string;
  rollbackDecisionAuthority?: string;
  applicationRollbackPath?: string;
  ceoApprovalPhrase?: string;
  postMigrationLedgerVerified?: boolean;
  readOnlySnapshotSelectVerified?: boolean;
  departmentVerification?: Partial<Record<ProductionSchemaAlignmentDepartmentKey, ProductionDepartmentVerificationState>>;
};

export type ProductionSchemaAlignmentDepartmentKey =
  | "ceo_dashboard"
  | "draft_workspace"
  | "production_dry_run"
  | "search_market_intelligence"
  | "revenue_intelligence"
  | "buyer_demand"
  | "cross_connector_certification"
  | "department_os_morning_brief";

export type ProductionSchemaAlignmentReadinessProof = {
  migration: typeof productionSchemaAlignmentMigration;
  verificationTimestamp: string;
  verifierIdentity: string;
  actualSha256: string | null;
  hashMatchesExpected: boolean;
  approvedHashRecord: {
    locationFound: false;
    status: "not_applicable_no_registry_found";
    note: string;
  };
  readinessState: ProductionSchemaAlignmentReadinessState;
  productionLedger: {
    state: ProductionMigrationLedgerState;
    pendingMigrationsInOrder: string[];
  };
  currentSchema: {
    inspected: boolean;
    requiredColumnsPresent: boolean;
    columns: ProductionSchemaAlignmentOperatorEvidence["schemaColumns"];
  };
  recovery: {
    pitrOrBackupEnabled: boolean;
    latestKnownRecoverablePoint: string | null;
    recoveryOwner: string | null;
    targetRto: string | null;
    targetRpo: string | null;
    rollbackDecisionAuthority: string | null;
    applicationRollbackPath: string | null;
  };
  departmentVerification: Record<ProductionSchemaAlignmentDepartmentKey, ProductionDepartmentVerificationState>;
  readOnlyOperatorCommands: string[];
  proposedExecutionCommand: string;
  requiredCeoApprovalPhrase: typeof productionSchemaAlignmentApprovalPhrase;
  postMigrationVerificationCommands: string[];
  remainingBlockers: string[];
  safety: {
    migrationExecuted: false;
    databaseAltered: false;
    applicationDataWritten: false;
    crmMutationAllowed: false;
    publishingAllowed: false;
    outreachAllowed: false;
    scrapingAllowed: false;
    automationAllowed: false;
    syntheticDataCreationAllowed: false;
    providerCalled: false;
    externalWorkflowRun: false;
    vercelConfigurationChanged: false;
    credentialsExposed: false;
    liveExecutionAllowed: false;
  };
  classification: "READY_FOR_PRODUCTION_SCHEMA_ALIGNMENT" | "PRODUCTION_SCHEMA_ALIGNMENT_BLOCKED";
};

const departmentKeys: ProductionSchemaAlignmentDepartmentKey[] = [
  "ceo_dashboard",
  "draft_workspace",
  "production_dry_run",
  "search_market_intelligence",
  "revenue_intelligence",
  "buyer_demand",
  "cross_connector_certification",
  "department_os_morning_brief",
];

const readOnlyOperatorCommands = [
  "npm.cmd exec prisma migrate status --schema prisma/schema.prisma",
  'psql "$env:DATABASE_URL" -c "SELECT migration_name, started_at, finished_at, rolled_back_at, logs FROM ""_prisma_migrations"" WHERE migration_name = \'20260716100000_harden_business_data_snapshots\';"',
  'psql "$env:DATABASE_URL" -c "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = \'BusinessDataSnapshot\' AND column_name IN (\'version\',\'contractVersion\',\'evidenceHash\',\'observationStart\',\'observationEnd\',\'traceId\',\'reliability\') ORDER BY column_name;"',
  'psql "$env:DATABASE_URL" -c "SELECT migration_name, finished_at, rolled_back_at FROM ""_prisma_migrations"" ORDER BY started_at, migration_name;"',
];

const postMigrationVerificationCommands = [
  readOnlyOperatorCommands[0],
  readOnlyOperatorCommands[1],
  readOnlyOperatorCommands[2],
  'psql "$env:DATABASE_URL" -c "SELECT id, ""tenantId"", version, ""contractVersion"", ""evidenceHash"", ""observationStart"", ""observationEnd"", ""traceId"", reliability FROM ""BusinessDataSnapshot"" LIMIT 1;"',
  'Invoke-WebRequest -Uri "https://jcapitalpropertygroup.com/dashboard" -UseBasicParsing',
  'Invoke-WebRequest -Uri "https://jcapitalpropertygroup.com/dashboard/drafts" -UseBasicParsing',
];

function calculateSha256(relativePath: string) {
  try {
    const contents = readFileSync(join(process.cwd(), relativePath));
    return createHash("sha256").update(contents).digest("hex").toUpperCase();
  } catch {
    return null;
  }
}

function present(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function requiredSchemaColumnsPresent(columns: ProductionSchemaAlignmentOperatorEvidence["schemaColumns"]) {
  const presentColumns = new Set((columns ?? []).map((column) => column.columnName));
  return productionSchemaAlignmentMigration.requiredColumns.every((column) => presentColumns.has(column));
}

function hasUnexpectedPendingMigration(pendingMigrationsInOrder: string[]) {
  const targetIndex = pendingMigrationsInOrder.indexOf(productionSchemaAlignmentMigration.migrationId);

  return targetIndex > 0 || (targetIndex === -1 && pendingMigrationsInOrder.length > 0);
}

function buildDepartmentVerification(
  evidence: ProductionSchemaAlignmentOperatorEvidence,
): Record<ProductionSchemaAlignmentDepartmentKey, ProductionDepartmentVerificationState> {
  return Object.fromEntries(
    departmentKeys.map((key) => [key, evidence.departmentVerification?.[key] ?? "not_checked"]),
  ) as Record<ProductionSchemaAlignmentDepartmentKey, ProductionDepartmentVerificationState>;
}

function allDepartmentsPassed(departmentVerification: Record<ProductionSchemaAlignmentDepartmentKey, ProductionDepartmentVerificationState>) {
  return departmentKeys.every((key) => departmentVerification[key] === "passed");
}

export function createProductionSchemaAlignmentReadinessProof(input: {
  verifierIdentity?: string;
  generatedAt?: Date;
  actualSha256?: string | null;
  operatorEvidence?: ProductionSchemaAlignmentOperatorEvidence;
} = {}): ProductionSchemaAlignmentReadinessProof {
  const actualSha256 = input.actualSha256 ?? calculateSha256(productionSchemaAlignmentMigration.relativePath);
  const hashMatchesExpected = actualSha256 === productionSchemaAlignmentMigration.expectedSha256;
  const evidence = input.operatorEvidence ?? {};
  const schemaInspected = Array.isArray(evidence.schemaColumns);
  const columnsPresent = schemaInspected && requiredSchemaColumnsPresent(evidence.schemaColumns);
  const departmentVerification = buildDepartmentVerification(evidence);
  const recoveryReady =
    evidence.pitrOrBackupEnabled === true &&
    present(evidence.latestKnownRecoverablePoint) &&
    present(evidence.recoveryOwner) &&
    present(evidence.targetRto) &&
    present(evidence.targetRpo) &&
    present(evidence.rollbackDecisionAuthority) &&
    present(evidence.applicationRollbackPath);
  const remainingBlockers: string[] = [];

  if (!hashMatchesExpected) remainingBlockers.push("Migration SHA256 does not match the approved expected hash.");
  if (!evidence.ledgerState || evidence.ledgerState === "unknown") remainingBlockers.push("Production Prisma migration ledger state has not been proven.");
  if (evidence.ledgerState === "failed") remainingBlockers.push("Production Prisma migration ledger reports a failed migration state.");
  if (evidence.ledgerState === "rolled_back") remainingBlockers.push("Production Prisma migration ledger reports the migration was rolled back.");
  if (hasUnexpectedPendingMigration(evidence.pendingMigrationsInOrder ?? [])) remainingBlockers.push("Pending migration chain includes unexpected earlier or unrelated migration work.");
  if (!schemaInspected) remainingBlockers.push("Production information_schema columns have not been inspected.");
  if (schemaInspected && !columnsPresent) remainingBlockers.push("Production BusinessDataSnapshot schema is missing one or more required hardened columns.");
  if (!recoveryReady) remainingBlockers.push("PITR/backup, RTO/RPO, recovery owner, rollback authority, or application rollback path is not fully proven.");
  if (evidence.ceoApprovalPhrase !== productionSchemaAlignmentApprovalPhrase) {
    remainingBlockers.push("Exact CEO approval phrase for Production schema alignment has not been provided.");
  }
  if (evidence.ledgerState === "applied_successfully" && (!evidence.postMigrationLedgerVerified || !evidence.readOnlySnapshotSelectVerified)) {
    remainingBlockers.push("Post-migration ledger and read-only BusinessDataSnapshot select verification are not complete.");
  }
  if (evidence.ledgerState === "applied_successfully" && Object.values(departmentVerification).includes("failed")) {
    remainingBlockers.push("One or more department compatibility checks failed after schema alignment.");
  }

  const readinessState: ProductionSchemaAlignmentReadinessState =
    remainingBlockers.length > 0
      ? evidence.ledgerState === "applied_successfully"
        ? "review_required"
        : "blocked"
      : evidence.ledgerState === "applied_successfully"
        ? allDepartmentsPassed(departmentVerification)
          ? "complete"
          : "already_applied_verify_only"
        : "ready_to_execute";

  return {
    migration: productionSchemaAlignmentMigration,
    verificationTimestamp: (input.generatedAt ?? new Date()).toISOString(),
    verifierIdentity: input.verifierIdentity?.trim() || "codex-readiness-review",
    actualSha256,
    hashMatchesExpected,
    approvedHashRecord: {
      locationFound: false,
      status: "not_applicable_no_registry_found",
      note: "Repository search did not find an approved immutable migration-hash record location; after CEO approval and hash match this is documented as a non-blocking note and no new governance framework is created.",
    },
    readinessState,
    productionLedger: {
      state: evidence.ledgerState ?? "unknown",
      pendingMigrationsInOrder: evidence.pendingMigrationsInOrder ?? [],
    },
    currentSchema: {
      inspected: schemaInspected,
      requiredColumnsPresent: columnsPresent,
      columns: evidence.schemaColumns,
    },
    recovery: {
      pitrOrBackupEnabled: evidence.pitrOrBackupEnabled === true,
      latestKnownRecoverablePoint: evidence.latestKnownRecoverablePoint ?? null,
      recoveryOwner: evidence.recoveryOwner ?? null,
      targetRto: evidence.targetRto ?? null,
      targetRpo: evidence.targetRpo ?? null,
      rollbackDecisionAuthority: evidence.rollbackDecisionAuthority ?? null,
      applicationRollbackPath: evidence.applicationRollbackPath ?? null,
    },
    departmentVerification,
    readOnlyOperatorCommands,
    proposedExecutionCommand: "npm.cmd exec prisma migrate deploy --schema prisma/schema.prisma",
    requiredCeoApprovalPhrase: productionSchemaAlignmentApprovalPhrase,
    postMigrationVerificationCommands,
    remainingBlockers,
    safety: {
      migrationExecuted: false,
      databaseAltered: false,
      applicationDataWritten: false,
      crmMutationAllowed: false,
      publishingAllowed: false,
      outreachAllowed: false,
      scrapingAllowed: false,
      automationAllowed: false,
      syntheticDataCreationAllowed: false,
      providerCalled: false,
      externalWorkflowRun: false,
      vercelConfigurationChanged: false,
      credentialsExposed: false,
      liveExecutionAllowed: false,
    },
    classification: readinessState === "ready_to_execute" || readinessState === "already_applied_verify_only" || readinessState === "complete" ? "READY_FOR_PRODUCTION_SCHEMA_ALIGNMENT" : "PRODUCTION_SCHEMA_ALIGNMENT_BLOCKED",
  };
}
