import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computePendingMigrationChain,
  createDatabaseFingerprint,
  evaluatePreviewIsolation,
  previewLiveDryRunExpectedTransitions,
  previewSchemaAlignmentApprovalEnvKey,
  previewSchemaAlignmentApprovalPhrase,
  previewLiveDryRunTargetMigration,
  runPreviewLiveDryRunTest,
  type PreviewLiveDryRunServices,
  verifyBusinessDataSnapshotColumns,
} from "./preview-live-dry-run-test";
import type { ProductionDryRunReport } from "./production-dry-run";

const metadata = {
  databaseName: "jcapital_preview",
  currentSchema: "public",
  currentUser: "preview_user",
  serverAddress: "10.0.0.20",
  serverPort: 5432,
};
const previewFingerprint = createDatabaseFingerprint(metadata);
const baseEnv = {
  VERCEL_ENV: "preview",
  UEIP_PREVIEW_ENVIRONMENT_ID: "preview-test",
  UEIP_PREVIEW_DATABASE_FINGERPRINT: previewFingerprint,
  UEIP_PRODUCTION_DATABASE_FINGERPRINT: "production-fingerprint",
  [previewSchemaAlignmentApprovalEnvKey]: previewSchemaAlignmentApprovalPhrase,
  DATABASE_URL: "postgresql://preview_user:secret@preview.example.test/jcapital_preview",
  DIRECT_URL: "postgresql://preview_user:other-secret@preview.example.test/jcapital_preview",
} as NodeJS.ProcessEnv;
const allMigrations = [
  "20260715120000_add_professional_case_runtime",
  previewLiveDryRunTargetMigration,
];
const hardenedColumns = [
  "id",
  "tenantId",
  "snapshotDate",
  "version",
  "contractVersion",
  "evidenceHash",
  "observationStart",
  "observationEnd",
  "traceId",
  "reliability",
];

function dryRunReport(): ProductionDryRunReport {
  return {
    ok: true,
    traceId: "preview-live-dry-run:preview-test:2026-07-31",
    generatedAt: "2026-07-31T12:00:00.000Z",
    summary: "Preview dry run complete.",
    loopSteps: Array.from({ length: previewLiveDryRunExpectedTransitions }, (_, index) => ({
      sourceStep: "morning_brief",
      targetStep: "daily_mission",
      status: index === 6 ? "blocked" : "completed",
      evidence: "internal evidence only",
      sourceLabel: "preview_live_dry_run_test",
      auditRecorded: true,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    })) as ProductionDryRunReport["loopSteps"],
    businessWorkProduced: {
      morningBriefItems: 1,
      dailyMissionRevenuePriorities: 1,
      dfdPropertyPriorities: 0,
      aiCooAssignments: 1,
      departmentWorkOrders: 1,
      draftWorkspaceItems: 1,
      approvalQueueItems: 1,
      sourceLabels: ["preview_live_dry_run_test"],
    },
    ceoApprovalProof: {
      draftsVisible: 1,
      approvalsVisible: 1,
      canApproveRejectDraftWork: true,
      canReviewApprovalQueue: true,
      approvalSourceLabels: ["preview_live_dry_run_test"],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    approvedExecutionValidation: {
      status: "blocked",
      approvedExecutionEnabled: false,
      productionSmokePassed: true,
      externalActionsBlocked: true,
      internalCrmTaskValidation: "exact_approved_action_required",
      blockedReason: "Preview dry run is validation-only.",
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    auditProof: {
      traceRecordsAttempted: previewLiveDryRunExpectedTransitions,
      traceRecordsRecorded: previewLiveDryRunExpectedTransitions,
      failedClosed: false,
      sourceLabel: "preview_live_dry_run_test",
    },
    memoryEligibility: {
      eligible: true,
      memoryWritten: false,
      eventType: "production_dry_run_completed",
      source: "production_dry_run",
      reason: "eligible but not written",
      sanitizedMetadataKeys: [],
    },
    businessOutcomePlaceholder: {
      status: "outcome_pending",
      sourceLabel: "preview_live_dry_run_test",
      evidence: ["internal only"],
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    tomorrowRecommendations: [],
    remainingProductionBlockers: [],
    safetyFlags: {
      readOnly: true,
      providerCalled: false,
      sent: false,
      published: false,
      workflowStarted: false,
      liveExecutionAllowed: false,
      outreachBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      crmMutationBlocked: true,
      externalWritesBlocked: true,
    },
    providerCalled: false,
    sent: false,
    published: false,
    workflowStarted: false,
    liveExecutionAllowed: false,
  };
}

function dashboardReady() {
  return {
    status: "healthy",
    blockers: [],
    providerCalled: false,
    liveExecutionAllowed: false,
    schemaReadiness: {
      businessDataSnapshot: {
        status: "ready",
      },
    },
  } as never;
}

function createServices(overrides: Partial<PreviewLiveDryRunServices> = {}) {
  let applied = ["20260715120000_add_professional_case_runtime"];
  let lockRecords = 0;
  let transitionRecords = 0;
  const commands: string[] = [];

  return {
    services: {
      env: baseEnv,
      now: () => new Date("2026-07-31T12:00:00.000Z"),
      listMigrationIds: () => allMigrations,
      loadDbMetadata: async () => metadata,
      loadAppliedMigrations: async () => applied,
      loadBusinessDataSnapshotColumns: async () => hardenedColumns,
      getDashboardReadiness: async () => dashboardReady(),
      countRunAuditRecords: async () => ({ lockRecords, transitionRecords }),
      createRunLock: async () => { lockRecords += 1; },
      runDryRun: async () => {
        transitionRecords = previewLiveDryRunExpectedTransitions;
        return dryRunReport();
      },
      runCommand: async (command: string, args: string[]) => {
        commands.push([command, ...args].join(" "));
        if (args.includes("deploy")) applied = allMigrations;
        return { ok: true, stdout: "ok", stderr: "", code: 0 };
      },
      ...overrides,
    },
    commands,
  };
}

describe("Preview live dry-run test", () => {
  it("rejects Production and missing Preview identity before migration", async () => {
    const production = createServices({ env: { ...baseEnv, VERCEL_ENV: "production" } as NodeJS.ProcessEnv });
    const missingIdentity = createServices({ env: { ...baseEnv, UEIP_PREVIEW_ENVIRONMENT_ID: "" } as NodeJS.ProcessEnv });

    assert.equal((await runPreviewLiveDryRunTest(production.services)).classification, "PREVIEW_LIVE_DRY_RUN_BLOCKED");
    assert.ok((await runPreviewLiveDryRunTest(production.services)).databaseIsolationProof.reasons.includes("vercel_env_not_preview"));
    assert.ok((await runPreviewLiveDryRunTest(missingIdentity.services)).databaseIsolationProof.reasons.includes("preview_environment_id_missing"));
    assert.equal(production.commands.length, 0);
  });

  it("rejects shared fingerprints active fingerprint mismatch and production URL variables", () => {
    const shared = evaluatePreviewIsolation({
      env: { ...baseEnv, UEIP_PRODUCTION_DATABASE_FINGERPRINT: previewFingerprint },
      activeFingerprint: previewFingerprint,
    });
    const mismatch = evaluatePreviewIsolation({
      env: baseEnv,
      activeFingerprint: "other-preview-fingerprint",
    });
    const productionUrl = evaluatePreviewIsolation({
      env: { ...baseEnv, PRODUCTION_DATABASE_URL: "postgresql://user:password@production/db" },
      activeFingerprint: previewFingerprint,
    });
    const namedProductionUrl = evaluatePreviewIsolation({
      env: { ...baseEnv, PROD_READONLY_DATABASE_URL: "postgresql://user:password@production/db" },
      activeFingerprint: previewFingerprint,
    });

    assert.ok(shared.databaseIsolationProof.reasons.includes("preview_database_not_isolated"));
    assert.ok(shared.databaseIsolationProof.reasons.includes("active_database_matches_production"));
    assert.ok(mismatch.databaseIsolationProof.reasons.includes("active_database_fingerprint_mismatch"));
    assert.ok(productionUrl.databaseIsolationProof.reasons.includes("production_database_url_present"));
    assert.ok(namedProductionUrl.databaseIsolationProof.reasons.includes("production_database_url_present"));
  });

  it("rejects missing or mismatched Preview database URLs before migration", () => {
    const missingUrls = evaluatePreviewIsolation({
      env: { ...baseEnv, DATABASE_URL: "", DIRECT_URL: "" },
      activeFingerprint: previewFingerprint,
    });
    const mismatchedUrls = evaluatePreviewIsolation({
      env: {
        ...baseEnv,
        DATABASE_URL: "postgresql://preview_user:secret@preview.example.test/jcapital_preview",
        DIRECT_URL: "postgresql://preview_user:secret@dev.example.test/jcapital_development",
      },
      activeFingerprint: previewFingerprint,
    });

    assert.ok(missingUrls.databaseIsolationProof.reasons.includes("database_url_missing"));
    assert.ok(missingUrls.databaseIsolationProof.reasons.includes("direct_url_missing"));
    assert.ok(mismatchedUrls.databaseIsolationProof.reasons.includes("database_url_direct_url_mismatch"));
    assert.equal(mismatchedUrls.databaseIsolationProof.databaseUrlProof.logicalDatabaseMatch, false);
  });

  it("computes the pending chain and blocks unexpected earlier migrations", async () => {
    assert.deepEqual(computePendingMigrationChain(allMigrations, ["20260715120000_add_professional_case_runtime"]), [previewLiveDryRunTargetMigration]);
    const state = createServices({
      loadAppliedMigrations: async () => [],
    });

    const report = await runPreviewLiveDryRunTest(state.services);

    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_BLOCKED");
    assert.equal(report.migrationStatusBefore.reason, "unexpected_pending_migration_chain");
    assert.equal(state.commands.some((command) => command.includes("migrate deploy")), false);
  });

  it("blocks the Preview migration when the exact CEO approval phrase is missing", async () => {
    const state = createServices({
      env: {
        ...baseEnv,
        [previewSchemaAlignmentApprovalEnvKey]: "",
      } as NodeJS.ProcessEnv,
    });
    const report = await runPreviewLiveDryRunTest(state.services);

    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_BLOCKED");
    assert.equal(report.migrationStatusBefore.reason, null);
    assert.equal(report.dryRunResult.blockedReason, "preview_schema_alignment_ceo_approval_missing");
    assert.equal(state.commands.some((command) => command.includes("migrate deploy")), false);
  });

  it("allows the expected target migration chain verifies columns and emits verified classification", async () => {
    const state = createServices();
    const report = await runPreviewLiveDryRunTest(state.services);

    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_VERIFIED");
    assert.equal(report.migrationStatusBefore.includesTargetMigration, true);
    assert.equal(report.migrationStatusBefore.expectedChain, true);
    assert.equal(report.columnVerification.passed, true);
    assert.equal(report.dryRunResult.completed, true);
    assert.equal(report.auditResult.completeAuditTrace, true);
    assert.equal(report.safetyProof.providerCalled, false);
    assert.equal(report.safetyProof.productionUnchanged, true);
    assert.equal(state.commands.filter((command) => command.includes("migrate deploy")).length, 1);
  });

  it("allows already-applied Preview schema without reapplying migrations", async () => {
    const state = createServices({
      loadAppliedMigrations: async () => allMigrations,
    });
    const report = await runPreviewLiveDryRunTest(state.services);

    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_VERIFIED");
    assert.deepEqual(report.migrationStatusBefore.pendingMigrations, []);
    assert.equal(state.commands.some((command) => command.includes("migrate deploy")), false);
  });

  it("blocks when required BusinessDataSnapshot columns are missing", async () => {
    const verification = verifyBusinessDataSnapshotColumns(hardenedColumns.filter((column) => column !== "traceId"));
    const state = createServices({
      loadBusinessDataSnapshotColumns: async () => hardenedColumns.filter((column) => column !== "traceId"),
    });
    const report = await runPreviewLiveDryRunTest(state.services);

    assert.equal(verification.passed, false);
    assert.deepEqual(verification.missingColumns, ["traceId"]);
    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_BLOCKED");
    assert.deepEqual(report.columnVerification.missingColumns, ["traceId"]);
  });

  it("blocks duplicate dry-run execution before calling the simulation", async () => {
    let dryRunCalled = false;
    const state = createServices({
      countRunAuditRecords: async () => ({ lockRecords: 1, transitionRecords: 0 }),
      runDryRun: async () => {
        dryRunCalled = true;
        return dryRunReport();
      },
    });
    const report = await runPreviewLiveDryRunTest(state.services);

    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_BLOCKED");
    assert.equal(report.auditResult.duplicateExecution, true);
    assert.equal(dryRunCalled, false);
  });

  it("blocks incomplete audit traces and redacts unsafe output", async () => {
    const state = createServices({
      runCommand: async (command, args) => {
        if (args.includes("deploy")) return { ok: true, stdout: "deployed", stderr: "", code: 0 };
        return {
          ok: true,
          stdout: "postgresql://user:password@production.example/db token=secret",
          stderr: "",
          code: 0,
        };
      },
      runDryRun: async () => {
        const report = dryRunReport();
        return { ...report, auditProof: { ...report.auditProof, traceRecordsRecorded: 10 } };
      },
      countRunAuditRecords: async () => ({ lockRecords: 1, transitionRecords: 10 }),
    });
    const report = await runPreviewLiveDryRunTest(state.services);
    const serialized = JSON.stringify(report);
    const classifications = serialized.match(/PREVIEW_LIVE_DRY_RUN_(?:VERIFIED|BLOCKED)/g) ?? [];

    assert.equal(report.classification, "PREVIEW_LIVE_DRY_RUN_BLOCKED");
    assert.equal(report.auditResult.completeAuditTrace, false);
    assert.equal(serialized.includes("postgresql://"), false);
    assert.equal(serialized.includes("password@production"), false);
    assert.equal(serialized.includes("token=secret"), false);
    assert.equal(classifications.length, 1);
  });
});
