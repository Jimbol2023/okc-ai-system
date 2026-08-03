import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

import { prisma } from "@/lib/prisma";
import { getInfrastructureHealth } from "@/lib/infrastructure-health";
import { runProductionDryRun, type ProductionDryRunReport } from "@/lib/production-dry-run";
import { createLogicalDatabaseUrlProof, hasExplicitProductionDatabaseUrl, type LogicalDatabaseUrlProof } from "@/lib/preview-environment-guard";

export const previewLiveDryRunTargetMigration = "20260716100000_harden_business_data_snapshots";
export const previewSchemaAlignmentApprovalPhrase = "APPROVE_PREVIEW_SCHEMA_ALIGNMENT_20260716100000";
export const previewSchemaAlignmentApprovalEnvKey = "CEO_PREVIEW_SCHEMA_ALIGNMENT_APPROVAL";
export const previewLiveDryRunRequiredColumns = [
  "version",
  "contractVersion",
  "evidenceHash",
  "observationStart",
  "observationEnd",
  "traceId",
  "reliability",
] as const;
export const previewLiveDryRunExpectedTransitions = 11;

export type PreviewLiveDryRunClassification = "PREVIEW_LIVE_DRY_RUN_VERIFIED" | "PREVIEW_LIVE_DRY_RUN_BLOCKED";

export type PreviewLiveDryRunReport = {
  previewIdentity: {
    environment: string | null;
    environmentId: string | null;
    fingerprintConfigured: boolean;
    productionFingerprintConfigured: boolean;
  };
  databaseIsolationProof: {
    activeFingerprint: string | null;
    expectedPreviewFingerprint: string | null;
    productionFingerprint: string | null;
    activeMatchesPreview: boolean;
    activeDiffersFromProduction: boolean;
    productionDatabaseUrlPresent: boolean;
    productionUnchanged: boolean;
    databaseUrlProof: LogicalDatabaseUrlProof;
    reasons: string[];
  };
  migrationStatusBefore: MigrationStatusProof;
  migrationStatusAfter: MigrationStatusProof;
  columnVerification: {
    requiredColumns: string[];
    observedColumns: string[];
    missingColumns: string[];
    passed: boolean;
  };
  dashboardReadinessResult: {
    status: string;
    schemaStatus: string;
    blocked: boolean;
    blockers: string[];
    providerCalled: boolean;
    liveExecutionAllowed: false;
  };
  dryRunResult: {
    runKey: string;
    attempted: boolean;
    completed: boolean;
    blockedReason: string | null;
    loopTransitionsAttempted: number;
    auditRecordsRecorded: number;
    providerCalled: boolean;
    sent: boolean;
    published: boolean;
    liveExecution: boolean;
    externalExecutionAllowed: boolean;
  };
  auditResult: {
    runKey: string;
    lockRecords: number;
    transitionRecords: number;
    completeAuditTrace: boolean;
    duplicateExecution: boolean;
  };
  safetyProof: {
    providerCalled: false;
    sent: false;
    published: false;
    liveExecution: false;
    externalExecutionAllowed: false;
    crmMutation: false;
    outreach: false;
    scraping: false;
    paidActions: false;
    recurringAutomation: false;
    syntheticLeads: false;
    productionUnchanged: boolean;
  };
  classification: PreviewLiveDryRunClassification;
};

export type MigrationStatusProof = {
  checked: boolean;
  ok: boolean;
  command: string;
  pendingMigrations: string[];
  expectedChain: boolean;
  includesTargetMigration: boolean;
  rawSummary: string;
  reason: string | null;
};

type DbMetadata = {
  databaseName: string;
  currentSchema: string;
  currentUser: string;
  serverAddress: string | null;
  serverPort: number | null;
};

export type PreviewLiveDryRunServices = {
  env?: NodeJS.ProcessEnv;
  now?: () => Date;
  listMigrationIds?: () => string[];
  runCommand?: (command: string, args: string[]) => Promise<{ ok: boolean; stdout: string; stderr: string; code: number | null }>;
  loadDbMetadata?: () => Promise<DbMetadata>;
  loadAppliedMigrations?: () => Promise<string[]>;
  loadBusinessDataSnapshotColumns?: () => Promise<string[]>;
  getDashboardReadiness?: () => Promise<Awaited<ReturnType<typeof getInfrastructureHealth>>>;
  countRunAuditRecords?: (runKey: string) => Promise<{ lockRecords: number; transitionRecords: number }>;
  createRunLock?: (runKey: string) => Promise<void>;
  runDryRun?: (runKey: string) => Promise<ProductionDryRunReport>;
};

type StopState = {
  before?: MigrationStatusProof;
  after?: MigrationStatusProof;
  columns?: PreviewLiveDryRunReport["columnVerification"];
  dashboard?: PreviewLiveDryRunReport["dashboardReadinessResult"];
  dryRun?: PreviewLiveDryRunReport["dryRunResult"];
  audit?: PreviewLiveDryRunReport["auditResult"];
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createDatabaseFingerprint(metadata: DbMetadata) {
  return sha256(
    [
      metadata.databaseName,
      metadata.currentSchema,
      metadata.currentUser,
      metadata.serverAddress ?? "unknown-host",
      String(metadata.serverPort ?? "unknown-port"),
    ].join("|"),
  );
}

function redactCommandOutput(output: string) {
  return output
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted-database-url]")
    .replace(/(password|token|secret|authorization)=\S+/gi, "$1=[redacted]")
    .slice(0, 4000);
}

function emptyMigrationProof(command: string, reason: string): MigrationStatusProof {
  return {
    checked: false,
    ok: false,
    command,
    pendingMigrations: [],
    expectedChain: false,
    includesTargetMigration: false,
    rawSummary: "",
    reason,
  };
}

function listRepoMigrationIds() {
  return readdirSync(join(process.cwd(), "prisma", "migrations"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function npmExecutable() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

export function computePendingMigrationChain(repoMigrations: string[], appliedMigrations: string[]) {
  const applied = new Set(appliedMigrations);
  return repoMigrations.filter((migration) => !applied.has(migration));
}

export function evaluateMigrationChain(pendingMigrations: string[]) {
  const includesTargetMigration = pendingMigrations.includes(previewLiveDryRunTargetMigration);
  const targetIndex = pendingMigrations.indexOf(previewLiveDryRunTargetMigration);
  const expectedChain = includesTargetMigration && targetIndex === 0;
  return { includesTargetMigration, expectedChain };
}

function createMigrationProof(input: {
  command: string;
  commandOk: boolean;
  stdout: string;
  stderr: string;
  pendingMigrations: string[];
}): MigrationStatusProof {
  const chain = evaluateMigrationChain(input.pendingMigrations);
  const reason = !input.commandOk
    ? "prisma_migrate_status_failed"
    : !chain.includesTargetMigration && input.pendingMigrations.length > 0
      ? "target_migration_not_pending"
      : !chain.expectedChain && input.pendingMigrations.length > 0
        ? "unexpected_pending_migration_chain"
        : null;

  return {
    checked: true,
    ok: input.commandOk && (input.pendingMigrations.length === 0 || chain.expectedChain),
    command: input.command,
    pendingMigrations: input.pendingMigrations,
    expectedChain: input.pendingMigrations.length === 0 ? true : chain.expectedChain,
    includesTargetMigration: chain.includesTargetMigration,
    rawSummary: redactCommandOutput(`${input.stdout}\n${input.stderr}`.trim()),
    reason,
  };
}

export function evaluatePreviewIsolation(input: {
  env: NodeJS.ProcessEnv;
  activeFingerprint: string | null;
}) {
  const environment = input.env.VERCEL_ENV ?? null;
  const environmentId = input.env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() || null;
  const expectedPreviewFingerprint = input.env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() || null;
  const productionFingerprint = input.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() || null;
  const productionDatabaseUrlPresent = hasExplicitProductionDatabaseUrl(input.env);
  const databaseUrlProof = createLogicalDatabaseUrlProof(input.env);
  const reasons: string[] = [];

  if (environment !== "preview") reasons.push("vercel_env_not_preview");
  if (!environmentId) reasons.push("preview_environment_id_missing");
  if (!databaseUrlProof.databaseUrlPresent) reasons.push("database_url_missing");
  if (!databaseUrlProof.directUrlPresent) reasons.push("direct_url_missing");
  if (databaseUrlProof.logicalDatabaseMatch === false) reasons.push("database_url_direct_url_mismatch");
  if (!expectedPreviewFingerprint) reasons.push("preview_database_fingerprint_missing");
  if (!productionFingerprint) reasons.push("production_database_fingerprint_missing");
  if (!input.activeFingerprint) reasons.push("active_database_fingerprint_missing");
  if (input.activeFingerprint && expectedPreviewFingerprint && input.activeFingerprint !== expectedPreviewFingerprint) {
    reasons.push("active_database_fingerprint_mismatch");
  }
  if (expectedPreviewFingerprint && productionFingerprint && expectedPreviewFingerprint === productionFingerprint) {
    reasons.push("preview_database_not_isolated");
  }
  if (input.activeFingerprint && productionFingerprint && input.activeFingerprint === productionFingerprint) {
    reasons.push("active_database_matches_production");
  }
  if (productionDatabaseUrlPresent) reasons.push("production_database_url_present");

  return {
    previewIdentity: {
      environment,
      environmentId,
      fingerprintConfigured: Boolean(expectedPreviewFingerprint),
      productionFingerprintConfigured: Boolean(productionFingerprint),
    },
    databaseIsolationProof: {
      activeFingerprint: input.activeFingerprint,
      expectedPreviewFingerprint,
      productionFingerprint,
      activeMatchesPreview: Boolean(input.activeFingerprint && expectedPreviewFingerprint && input.activeFingerprint === expectedPreviewFingerprint),
      activeDiffersFromProduction: Boolean(input.activeFingerprint && productionFingerprint && input.activeFingerprint !== productionFingerprint),
      productionDatabaseUrlPresent,
      productionUnchanged: Boolean(input.activeFingerprint && productionFingerprint && input.activeFingerprint !== productionFingerprint && !productionDatabaseUrlPresent),
      databaseUrlProof,
      reasons,
    },
  };
}

export function verifyBusinessDataSnapshotColumns(observedColumns: string[]) {
  const observed = new Set(observedColumns);
  const missingColumns = previewLiveDryRunRequiredColumns.filter((column) => !observed.has(column));
  return {
    requiredColumns: [...previewLiveDryRunRequiredColumns],
    observedColumns: [...observedColumns].sort(),
    missingColumns,
    passed: missingColumns.length === 0,
  };
}

function createSafetyProof(productionUnchanged: boolean): PreviewLiveDryRunReport["safetyProof"] {
  return {
    providerCalled: false,
    sent: false,
    published: false,
    liveExecution: false,
    externalExecutionAllowed: false,
    crmMutation: false,
    outreach: false,
    scraping: false,
    paidActions: false,
    recurringAutomation: false,
    syntheticLeads: false,
    productionUnchanged,
  };
}

function createBlockedReport(input: {
  previewIdentity: PreviewLiveDryRunReport["previewIdentity"];
  databaseIsolationProof: PreviewLiveDryRunReport["databaseIsolationProof"];
  runKey: string;
  reason: string;
  state?: StopState;
}): PreviewLiveDryRunReport {
  const migrationStatusBefore = input.state?.before ?? emptyMigrationProof("npm exec prisma migrate status --schema prisma/schema.prisma", input.reason);
  const migrationStatusAfter = input.state?.after ?? emptyMigrationProof("npm exec prisma migrate status --schema prisma/schema.prisma", "not_reached");
  const columnVerification = input.state?.columns ?? {
    requiredColumns: [...previewLiveDryRunRequiredColumns],
    observedColumns: [],
    missingColumns: [...previewLiveDryRunRequiredColumns],
    passed: false,
  };
  const dashboardReadinessResult = input.state?.dashboard ?? {
    status: "not_checked",
    schemaStatus: "not_checked",
    blocked: true,
    blockers: [input.reason],
    providerCalled: false,
    liveExecutionAllowed: false as const,
  };
  const dryRunResult = input.state?.dryRun ?? {
    runKey: input.runKey,
    attempted: false,
    completed: false,
    blockedReason: input.reason,
    loopTransitionsAttempted: 0,
    auditRecordsRecorded: 0,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecution: false,
    externalExecutionAllowed: false,
  };
  const auditResult = input.state?.audit ?? {
    runKey: input.runKey,
    lockRecords: 0,
    transitionRecords: 0,
    completeAuditTrace: false,
    duplicateExecution: false,
  };

  return {
    previewIdentity: input.previewIdentity,
    databaseIsolationProof: input.databaseIsolationProof,
    migrationStatusBefore,
    migrationStatusAfter,
    columnVerification,
    dashboardReadinessResult,
    dryRunResult,
    auditResult,
    safetyProof: createSafetyProof(input.databaseIsolationProof.productionUnchanged),
    classification: "PREVIEW_LIVE_DRY_RUN_BLOCKED",
  };
}

async function runShellCommand(command: string, args: string[]) {
  return new Promise<{ ok: boolean; stdout: string; stderr: string; code: number | null }>((resolve) => {
    const child = spawn(command, args, { cwd: process.cwd(), env: process.env, shell: false });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => { stdout += String(chunk); });
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("close", (code) => resolve({ ok: code === 0, stdout, stderr, code }));
    child.on("error", (error) => resolve({ ok: false, stdout, stderr: error.message, code: null }));
  });
}

async function defaultLoadDbMetadata(): Promise<DbMetadata> {
  const rows = await prisma.$queryRaw<Array<{
    database_name: string;
    current_schema: string;
    current_user_name: string;
    server_address: string | null;
    server_port: number | null;
  }>>`
    SELECT
      current_database() AS database_name,
      current_schema() AS current_schema,
      current_user AS current_user_name,
      inet_server_addr()::text AS server_address,
      inet_server_port() AS server_port
  `;
  const row = rows[0];
  if (!row) throw new Error("database_metadata_unavailable");
  return {
    databaseName: row.database_name,
    currentSchema: row.current_schema,
    currentUser: row.current_user_name,
    serverAddress: row.server_address,
    serverPort: row.server_port,
  };
}

async function defaultLoadAppliedMigrations() {
  const rows = await prisma.$queryRaw<Array<{ migration_name: string }>>`
    SELECT migration_name
    FROM "_prisma_migrations"
    WHERE finished_at IS NOT NULL
      AND rolled_back_at IS NULL
    ORDER BY started_at, migration_name
  `;
  return rows.map((row) => row.migration_name);
}

async function defaultLoadBusinessDataSnapshotColumns() {
  const rows = await prisma.$queryRaw<Array<{ column_name: string }>>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'BusinessDataSnapshot'
  `;
  return rows.map((row) => row.column_name);
}

async function defaultCountRunAuditRecords(runKey: string) {
  const lockRecords = await prisma.revenueAuditEvent.count({
    where: {
      tenantId: "default",
      requestId: runKey,
      action: "preview_live_dry_run.lock",
    },
  });
  const transitionRecords = await prisma.revenueAuditEvent.count({
    where: {
      tenantId: "default",
      targetType: "ProductionDryRun",
      targetId: runKey,
    },
  });
  return { lockRecords, transitionRecords };
}

async function defaultCreateRunLock(runKey: string) {
  await prisma.revenueAuditEvent.create({
    data: {
      tenantId: "default",
      actorId: "operator",
      action: "preview_live_dry_run.lock",
      targetType: "PreviewLiveDryRun",
      targetId: runKey,
      requestId: runKey,
      source: "preview_live_dry_run_test",
      result: "locked",
      safeMetadata: {
        runKey,
        previewOnly: true,
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    },
  });
}

async function defaultRunDryRun(runKey: string) {
  return runProductionDryRun({
    env: {
      ...process.env,
      VERCEL_ENV: "preview",
      APPROVED_EXECUTION_ENABLED: "false",
      APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED: "false",
    },
    recordTrace: async (input) => {
      const { recordOperatingLoopTraceFailClosed } = await import("@/lib/operating-loop-trace");
      return recordOperatingLoopTraceFailClosed({
        ...input,
        traceId: runKey,
        entityId: runKey,
        idempotencyKey: `${runKey}:${input.sourceStep}->${input.targetStep}`,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      });
    },
  });
}

async function loadMigrationProof(services: Required<Pick<PreviewLiveDryRunServices, "runCommand" | "listMigrationIds" | "loadAppliedMigrations">>) {
  const npm = npmExecutable();
  const command = `${npm} exec prisma migrate status --schema prisma/schema.prisma`;
  const [status, repoMigrations, appliedMigrations] = await Promise.all([
    services.runCommand(npm, ["exec", "prisma", "migrate", "status", "--schema", "prisma/schema.prisma"]),
    Promise.resolve(services.listMigrationIds()),
    services.loadAppliedMigrations(),
  ]);

  return createMigrationProof({
    command,
    commandOk: status.ok,
    stdout: status.stdout,
    stderr: status.stderr,
    pendingMigrations: computePendingMigrationChain(repoMigrations, appliedMigrations),
  });
}

export async function runPreviewLiveDryRunTest(services: PreviewLiveDryRunServices = {}): Promise<PreviewLiveDryRunReport> {
  const env = services.env ?? process.env;
  const now = services.now?.() ?? new Date();
  const runKey = `preview-live-dry-run:${env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() || "missing-preview"}:${now.toISOString().slice(0, 10)}`;
  const runCommand = services.runCommand ?? runShellCommand;
  const listMigrationIds = services.listMigrationIds ?? listRepoMigrationIds;
  const loadAppliedMigrations = services.loadAppliedMigrations ?? defaultLoadAppliedMigrations;
  let activeFingerprint: string | null = null;

  try {
    activeFingerprint = createDatabaseFingerprint(await (services.loadDbMetadata ?? defaultLoadDbMetadata)());
  } catch {
    activeFingerprint = null;
  }

  const identity = evaluatePreviewIsolation({ env, activeFingerprint });
  if (identity.databaseIsolationProof.reasons.length > 0) {
    return createBlockedReport({
      ...identity,
      runKey,
      reason: identity.databaseIsolationProof.reasons[0],
    });
  }

  const migrationServices = { runCommand, listMigrationIds, loadAppliedMigrations };
  const migrationStatusBefore = await loadMigrationProof(migrationServices);
  if (!migrationStatusBefore.ok || (migrationStatusBefore.pendingMigrations.length > 0 && !migrationStatusBefore.includesTargetMigration)) {
    return createBlockedReport({
      ...identity,
      runKey,
      reason: migrationStatusBefore.reason ?? "target_migration_not_pending",
      state: { before: migrationStatusBefore },
    });
  }

  if (migrationStatusBefore.pendingMigrations.length > 0) {
    if (env[previewSchemaAlignmentApprovalEnvKey]?.trim() !== previewSchemaAlignmentApprovalPhrase) {
      return createBlockedReport({
        ...identity,
        runKey,
        reason: "preview_schema_alignment_ceo_approval_missing",
        state: { before: migrationStatusBefore },
      });
    }

    const deploy = await runCommand(npmExecutable(), ["exec", "prisma", "migrate", "deploy", "--schema", "prisma/schema.prisma"]);
    if (!deploy.ok) {
      return createBlockedReport({
        ...identity,
        runKey,
        reason: "prisma_migrate_deploy_failed",
        state: {
          before: migrationStatusBefore,
          after: emptyMigrationProof("npm.cmd exec prisma migrate deploy --schema prisma/schema.prisma", redactCommandOutput(deploy.stderr || deploy.stdout)),
        },
      });
    }
  }

  const migrationStatusAfter = await loadMigrationProof(migrationServices);
  const observedColumns = await (services.loadBusinessDataSnapshotColumns ?? defaultLoadBusinessDataSnapshotColumns)();
  const columnVerification = verifyBusinessDataSnapshotColumns(observedColumns);
  if (!columnVerification.passed) {
    return createBlockedReport({
      ...identity,
      runKey,
      reason: "business_data_snapshot_columns_missing",
      state: { before: migrationStatusBefore, after: migrationStatusAfter, columns: columnVerification },
    });
  }

  const infrastructure = await (services.getDashboardReadiness ?? (() => getInfrastructureHealth({ includeDatabase: true, includeSchemaReadiness: true, includeOAuth: false })))();
  const dashboardReadinessResult = {
    status: infrastructure.status,
    schemaStatus: infrastructure.schemaReadiness.businessDataSnapshot.status,
    blocked: infrastructure.status === "blocked" || infrastructure.schemaReadiness.businessDataSnapshot.status !== "ready",
    blockers: infrastructure.blockers,
    providerCalled: false,
    liveExecutionAllowed: false as const,
  };
  if (dashboardReadinessResult.blocked) {
    return createBlockedReport({
      ...identity,
      runKey,
      reason: "dashboard_readiness_blocked",
      state: { before: migrationStatusBefore, after: migrationStatusAfter, columns: columnVerification, dashboard: dashboardReadinessResult },
    });
  }

  const countRunAuditRecords = services.countRunAuditRecords ?? defaultCountRunAuditRecords;
  const beforeAudit = await countRunAuditRecords(runKey);
  if (beforeAudit.lockRecords > 0 || beforeAudit.transitionRecords > 0) {
    return createBlockedReport({
      ...identity,
      runKey,
      reason: "duplicate_dry_run_detected",
      state: {
        before: migrationStatusBefore,
        after: migrationStatusAfter,
        columns: columnVerification,
        dashboard: dashboardReadinessResult,
        audit: {
          runKey,
          ...beforeAudit,
          completeAuditTrace: false,
          duplicateExecution: true,
        },
      },
    });
  }

  await (services.createRunLock ?? defaultCreateRunLock)(runKey);
  const dryRun = await (services.runDryRun ?? defaultRunDryRun)(runKey);
  const afterAudit = await countRunAuditRecords(runKey);
  const loopTransitionsAttempted = dryRun.loopSteps.length;
  const auditRecordsRecorded = dryRun.auditProof.traceRecordsRecorded;
  const safetyOk =
    !dryRun.providerCalled &&
    !dryRun.sent &&
    !dryRun.published &&
    !dryRun.liveExecutionAllowed &&
    !dryRun.workflowStarted &&
    loopTransitionsAttempted === previewLiveDryRunExpectedTransitions &&
    auditRecordsRecorded === previewLiveDryRunExpectedTransitions;
  const auditResult = {
    runKey,
    lockRecords: afterAudit.lockRecords,
    transitionRecords: afterAudit.transitionRecords,
    completeAuditTrace: afterAudit.lockRecords === 1 && afterAudit.transitionRecords === previewLiveDryRunExpectedTransitions && auditRecordsRecorded === previewLiveDryRunExpectedTransitions,
    duplicateExecution: afterAudit.lockRecords !== 1 || afterAudit.transitionRecords !== previewLiveDryRunExpectedTransitions,
  };
  const dryRunResult = {
    runKey,
    attempted: true,
    completed: safetyOk && auditResult.completeAuditTrace && !auditResult.duplicateExecution,
    blockedReason: safetyOk ? null : "dry_run_safety_or_audit_invariant_failed",
    loopTransitionsAttempted,
    auditRecordsRecorded,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecution: false,
    externalExecutionAllowed: false,
  };
  const verified = dryRunResult.completed && auditResult.completeAuditTrace && !auditResult.duplicateExecution && identity.databaseIsolationProof.productionUnchanged;

  return {
    previewIdentity: identity.previewIdentity,
    databaseIsolationProof: identity.databaseIsolationProof,
    migrationStatusBefore,
    migrationStatusAfter,
    columnVerification,
    dashboardReadinessResult,
    dryRunResult,
    auditResult,
    safetyProof: createSafetyProof(identity.databaseIsolationProof.productionUnchanged),
    classification: verified ? "PREVIEW_LIVE_DRY_RUN_VERIFIED" : "PREVIEW_LIVE_DRY_RUN_BLOCKED",
  };
}
