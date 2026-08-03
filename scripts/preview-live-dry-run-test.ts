import { hasExplicitProductionDatabaseUrl, loadPreviewEnvFileStrict } from "@/lib/preview-environment-guard";

function blockedReportForPreviewEnvFile(load: ReturnType<typeof loadPreviewEnvFileStrict>) {
  const runKey = `preview-live-dry-run:${process.env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() || "missing-preview"}:${new Date().toISOString().slice(0, 10)}`;

  return {
    previewIdentity: {
      environment: process.env.VERCEL_ENV ?? null,
      environmentId: process.env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() || null,
      fingerprintConfigured: Boolean(process.env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim()),
      productionFingerprintConfigured: Boolean(process.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim()),
    },
    databaseIsolationProof: {
      activeFingerprint: null,
      expectedPreviewFingerprint: process.env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() || null,
      productionFingerprint: process.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() || null,
      activeMatchesPreview: false,
      activeDiffersFromProduction: false,
      productionDatabaseUrlPresent: hasExplicitProductionDatabaseUrl(process.env),
      productionUnchanged: false,
      databaseUrlProof: {
        databaseUrlPresent: Boolean(process.env.DATABASE_URL?.trim()),
        directUrlPresent: Boolean(process.env.DIRECT_URL?.trim()),
        logicalDatabaseMatch: null,
        databaseUrlLogicalIdPrefix: null,
        directUrlLogicalIdPrefix: null,
      },
      reasons: ["preview_database_url_missing", ...load.missingOrEmptyKeys.map((key) => `${key.toLowerCase()}_missing`)],
    },
    migrationStatusBefore: {
      checked: false,
      ok: false,
      command: "npm exec prisma migrate status --schema prisma/schema.prisma",
      pendingMigrations: [],
      expectedChain: false,
      includesTargetMigration: false,
      rawSummary: "",
      reason: `${load.path} is present but missing required Preview database key(s): ${load.missingOrEmptyKeys.join(", ")}. Preview tooling is blocked to prevent fallback to .env.`,
    },
    migrationStatusAfter: {
      checked: false,
      ok: false,
      command: "npm exec prisma migrate status --schema prisma/schema.prisma",
      pendingMigrations: [],
      expectedChain: false,
      includesTargetMigration: false,
      rawSummary: "",
      reason: "not_reached",
    },
    columnVerification: {
      requiredColumns: ["version", "contractVersion", "evidenceHash", "observationStart", "observationEnd", "traceId", "reliability"],
      observedColumns: [],
      missingColumns: ["version", "contractVersion", "evidenceHash", "observationStart", "observationEnd", "traceId", "reliability"],
      passed: false,
    },
    dashboardReadinessResult: {
      status: "not_checked",
      schemaStatus: "not_checked",
      blocked: true,
      blockers: ["preview_database_url_missing"],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    dryRunResult: {
      runKey,
      attempted: false,
      completed: false,
      blockedReason: "preview_database_url_missing",
      loopTransitionsAttempted: 0,
      auditRecordsRecorded: 0,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecution: false,
      externalExecutionAllowed: false,
    },
    auditResult: {
      runKey,
      lockRecords: 0,
      transitionRecords: 0,
      completeAuditTrace: false,
      duplicateExecution: false,
    },
    safetyProof: {
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
      productionUnchanged: false,
    },
    classification: "PREVIEW_LIVE_DRY_RUN_BLOCKED",
  };
}

async function main() {
  const load = loadPreviewEnvFileStrict();
  if (load.loaded && !load.requiredKeysPresent) {
    console.log(JSON.stringify(blockedReportForPreviewEnvFile(load), null, 2));
    process.exitCode = 1;
    return;
  }

  const { runPreviewLiveDryRunTest } = await import("@/lib/preview-live-dry-run-test");
  const report = await runPreviewLiveDryRunTest();

  console.log(JSON.stringify(report, null, 2));

  if (report.classification !== "PREVIEW_LIVE_DRY_RUN_VERIFIED") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Preview live dry-run test failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
