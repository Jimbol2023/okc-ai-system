import { hasExplicitProductionDatabaseUrl, loadPreviewEnvFileStrict } from "@/lib/preview-environment-guard";

function blockForPreviewEnvFile(load: ReturnType<typeof loadPreviewEnvFileStrict>) {
  return {
    activeDatabaseIdentityClassification: "unknown_database",
    fingerprintAlgorithm: "sha256(databaseName|currentSchema|currentUser|serverAddress|serverPort)",
    activeFingerprintPrefix: null,
    configuredPreviewFingerprintPrefix: process.env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.slice(0, 8) || null,
    configuredProductionFingerprintPrefix: process.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.slice(0, 8) || null,
    databaseUrlDirectUrlLogicalDatabaseMatch: null,
    rootCause: `${load.path} is present but missing required Preview database key(s): ${load.missingOrEmptyKeys.join(", ")}. Preview tooling is blocked to prevent fallback to .env.`,
    safeRemediation: "correct_DATABASE_URL",
    diagnostics: {
      metadataReadOnlyQuerySucceeded: false,
      databaseUrlPresent: Boolean(process.env.DATABASE_URL?.trim()),
      directUrlPresent: Boolean(process.env.DIRECT_URL?.trim()),
      databaseUrlLogicalIdPrefix: null,
      directUrlLogicalIdPrefix: null,
      previewFingerprintConfigured: Boolean(process.env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim()),
      productionFingerprintConfigured: Boolean(process.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim()),
      previewProductionFingerprintsDistinct: Boolean(
        process.env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() &&
        process.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() &&
        process.env.UEIP_PREVIEW_DATABASE_FINGERPRINT !== process.env.UEIP_PRODUCTION_DATABASE_FINGERPRINT,
      ),
      productionDatabaseUrlVariablePresent: hasExplicitProductionDatabaseUrl(process.env),
      previewEnvironment: process.env.VERCEL_ENV === "preview",
      previewEnvironmentIdPresent: Boolean(process.env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim()),
      providerCalled: false,
      migrationsRun: false,
      databaseAltered: false,
      dryRunExecuted: false,
    },
    classification: "PREVIEW_DATABASE_URL_MISMATCH",
  };
}

async function main() {
  const load = loadPreviewEnvFileStrict();
  if (load.loaded && !load.requiredKeysPresent) {
    process.stdout.write(`${JSON.stringify(blockForPreviewEnvFile(load), null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const { diagnosePreviewDatabaseFingerprint } = await import("@/lib/preview-database-fingerprint-diagnosis");
  const report = await diagnosePreviewDatabaseFingerprint();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (report.classification !== "PREVIEW_DATABASE_IDENTITY_CERTIFIED") {
    process.exitCode = 1;
  }
}

void main().finally(async () => {
  if (!process.env.DATABASE_URL?.trim()) return;
  const { prisma } = await import("@/lib/prisma");
  await prisma.$disconnect();
});
