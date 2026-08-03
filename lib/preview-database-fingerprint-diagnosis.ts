import { createHash } from "node:crypto";

import { createDatabaseFingerprint } from "@/lib/preview-live-dry-run-test";
import {
  createLogicalDatabaseUrlProof,
  hasExplicitProductionDatabaseUrl,
  normalizeNeonEndpointId,
} from "@/lib/preview-environment-guard";

type DbMetadata = {
  databaseName: string;
  currentSchema: string;
  currentUser: string;
  serverAddress: string | null;
  serverPort: number | null;
};

export type NeonDatabaseIdentityMetadata = {
  provider: "neon";
  projectId: string;
  branchId: string;
  endpointId: string;
  branchName: string;
  databaseName: string;
  role: string;
  region: string;
  productionProjectId: string | null;
  productionBranchId: string | null;
  productionEndpointId: string | null;
};

export type PreviewDatabaseDiagnosisClassification =
  | "PREVIEW_DATABASE_IDENTITY_CERTIFIED"
  | "PREVIEW_DATABASE_IDENTITY_V2_PENDING_APPROVAL"
  | "PREVIEW_DATABASE_URL_MISMATCH"
  | "PREVIEW_FINGERPRINT_STALE"
  | "FINGERPRINT_ALGORITHM_MISMATCH"
  | "PREVIEW_DATABASE_IDENTITY_UNVERIFIED";

export type PreviewDatabaseFingerprintDiagnosis = {
  activeDatabaseIdentityClassification: "approved_preview_database" | "production_database" | "development_database" | "unknown_database";
  fingerprintAlgorithm: "sha256(databaseName|currentSchema|currentUser|serverAddress|serverPort)";
  fingerprintAlgorithmVersion: "v1";
  activeFingerprintPrefix: string | null;
  configuredPreviewFingerprintPrefix: string | null;
  configuredProductionFingerprintPrefix: string | null;
  v1: {
    algorithm: "sha256(databaseName|currentSchema|currentUser|serverAddress|serverPort)";
    activeFingerprintPrefix: string | null;
    configuredPreviewFingerprintPrefix: string | null;
    configuredProductionFingerprintPrefix: string | null;
    status: "legacy_match" | "legacy_stale" | "legacy_unavailable";
  };
  v2: {
    algorithm: "sha256(provider|projectId|branchId|normalizedEndpointId|databaseName|currentSchema|currentUser)";
    activeFingerprintPrefix: string | null;
    configuredPreviewFingerprintPrefix: string | null;
    configuredProductionFingerprintPrefix: string | null;
    configuredPreviewFingerprintPresent: boolean;
    configuredProductionFingerprintPresent: boolean;
    approvalPhraseRequired: string | null;
    metadataAvailable: boolean;
    branchName: string | null;
    projectIdPrefix: string | null;
    branchIdPrefix: string | null;
    endpointIdPrefix: string | null;
    productionProjectIdPrefix: string | null;
    productionBranchIdPrefix: string | null;
    productionEndpointIdPrefix: string | null;
    previewBranchDiffersFromProduction: boolean | null;
    previewEndpointDiffersFromProduction: boolean | null;
  };
  databaseUrlDirectUrlLogicalDatabaseMatch: boolean | null;
  rootCause: string;
  safeRemediation: "none_required" | "correct_DATABASE_URL" | "approve_preview_v2_fingerprint" | "regenerate_Preview_fingerprint" | "align_fingerprint_algorithm" | "stop_database_identity_unknown";
  diagnostics: {
    metadataReadOnlyQuerySucceeded: boolean;
    databaseUrlPresent: boolean;
    directUrlPresent: boolean;
    databaseUrlLogicalIdPrefix: string | null;
    directUrlLogicalIdPrefix: string | null;
    databaseUrlEndpointIdPrefix: string | null;
    directUrlEndpointIdPrefix: string | null;
    databaseUrlDirectUrlEndpointMatch: boolean | null;
    previewFingerprintConfigured: boolean;
    productionFingerprintConfigured: boolean;
    previewFingerprintV2Configured: boolean;
    productionFingerprintV2Configured: boolean;
    previewProductionFingerprintsDistinct: boolean;
    productionDatabaseUrlVariablePresent: boolean;
    previewEnvironment: boolean;
    previewEnvironmentIdPresent: boolean;
    providerCalled: false;
    migrationsRun: false;
    databaseAltered: false;
    dryRunExecuted: false;
  };
  classification: PreviewDatabaseDiagnosisClassification;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function prefix(value: string | null | undefined) {
  return value ? value.slice(0, 8) : null;
}

export function redactIdentity(value: string | null | undefined) {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  return trimmed.length <= 12 ? `${trimmed.slice(0, 4)}...` : `${trimmed.slice(0, 12)}...${trimmed.slice(-4)}`;
}

function readEnv(env: NodeJS.ProcessEnv, key: string) {
  return env[key]?.trim() || null;
}

export function loadNeonIdentityMetadataFromEnv(env: NodeJS.ProcessEnv): NeonDatabaseIdentityMetadata | null {
  const projectId = readEnv(env, "UEIP_PREVIEW_NEON_PROJECT_ID");
  const branchId = readEnv(env, "UEIP_PREVIEW_NEON_BRANCH_ID");
  const endpointId = readEnv(env, "UEIP_PREVIEW_NEON_ENDPOINT_ID");
  const branchName = readEnv(env, "UEIP_PREVIEW_NEON_BRANCH_NAME");
  const databaseName = readEnv(env, "UEIP_PREVIEW_NEON_DATABASE_NAME");
  const role = readEnv(env, "UEIP_PREVIEW_NEON_ROLE");
  const region = readEnv(env, "UEIP_PREVIEW_NEON_REGION");

  if (!projectId || !branchId || !endpointId || !branchName || !databaseName || !role || !region) {
    return null;
  }

  return {
    provider: "neon",
    projectId,
    branchId,
    endpointId: normalizeNeonEndpointId(endpointId) ?? endpointId,
    branchName,
    databaseName,
    role,
    region,
    productionProjectId: readEnv(env, "UEIP_PRODUCTION_NEON_PROJECT_ID"),
    productionBranchId: readEnv(env, "UEIP_PRODUCTION_NEON_BRANCH_ID"),
    productionEndpointId: normalizeNeonEndpointId(readEnv(env, "UEIP_PRODUCTION_NEON_ENDPOINT_ID")),
  };
}

export function createBranchAwareDatabaseFingerprint(input: {
  identity: NeonDatabaseIdentityMetadata;
  currentSchema: string;
  currentUser: string;
}) {
  return sha256([
    input.identity.provider,
    input.identity.projectId,
    input.identity.branchId,
    normalizeNeonEndpointId(input.identity.endpointId) ?? "unknown-endpoint",
    input.identity.databaseName,
    input.currentSchema,
    input.currentUser,
  ].join("|"));
}

function classify(input: {
  v1ActiveFingerprint: string | null;
  v1PreviewFingerprint: string | null;
  v1ProductionFingerprint: string | null;
  v2ActiveFingerprint: string | null;
  v2PreviewFingerprint: string | null;
  v2ProductionFingerprint: string | null;
  neonIdentity: NeonDatabaseIdentityMetadata | null;
  databaseUrlPresent: boolean;
  directUrlPresent: boolean;
  logicalMatch: boolean | null;
  endpointMatch: boolean | null;
  metadataSucceeded: boolean;
  previewEnvironment: boolean;
  previewEnvironmentIdPresent: boolean;
  productionDatabaseUrlPresent: boolean;
  databaseUrlEndpointId: string | null;
  directUrlEndpointId: string | null;
}) {
  if (!input.previewEnvironment || !input.previewEnvironmentIdPresent) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_IDENTITY_UNVERIFIED" as const,
      rootCause: "Preview identity is incomplete because VERCEL_ENV=preview and UEIP_PREVIEW_ENVIRONMENT_ID are required.",
      safeRemediation: "stop_database_identity_unknown" as const,
    };
  }

  if (!input.databaseUrlPresent || !input.directUrlPresent) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "Preview DATABASE_URL or DIRECT_URL is missing, so Prisma can fall back to a non-Preview database source.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (input.logicalMatch === false || input.endpointMatch === false) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "DATABASE_URL and DIRECT_URL do not point to the same logical Neon database endpoint.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (input.productionDatabaseUrlPresent) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "An explicit Production database URL variable is present in the Preview execution shell.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (!input.metadataSucceeded || !input.v1ActiveFingerprint) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_IDENTITY_UNVERIFIED" as const,
      rootCause: "Database metadata could not be read, so the active database fingerprint could not be computed.",
      safeRemediation: "stop_database_identity_unknown" as const,
    };
  }

  if (!input.neonIdentity || !input.v2ActiveFingerprint) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_IDENTITY_UNVERIFIED" as const,
      rootCause: "Neon branch-aware identity metadata is unavailable, so v2 Preview identity cannot be proven.",
      safeRemediation: "stop_database_identity_unknown" as const,
    };
  }

  if (input.neonIdentity.branchName !== "vercel-preview") {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "The active Neon branch is not the governed vercel-preview branch.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (input.neonIdentity.productionBranchId && input.neonIdentity.branchId === input.neonIdentity.productionBranchId) {
    return {
      activeDatabaseIdentityClassification: "production_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "The active Preview Neon branch matches the configured Production/main branch.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (input.neonIdentity.productionEndpointId && input.neonIdentity.endpointId === input.neonIdentity.productionEndpointId) {
    return {
      activeDatabaseIdentityClassification: "production_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "The active Preview Neon endpoint matches the configured Production/main endpoint.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (input.databaseUrlEndpointId && input.neonIdentity.endpointId !== input.databaseUrlEndpointId) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "DATABASE_URL endpoint identity does not match the configured Neon Preview endpoint metadata.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (input.directUrlEndpointId && input.neonIdentity.endpointId !== input.directUrlEndpointId) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "DIRECT_URL endpoint identity does not match the configured Neon Preview endpoint metadata.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  if (!input.v2PreviewFingerprint) {
    return {
      activeDatabaseIdentityClassification: "unknown_database" as const,
      classification: "PREVIEW_DATABASE_IDENTITY_V2_PENDING_APPROVAL" as const,
      rootCause: "Branch-aware v2 Preview identity was computed, but the approved v2 Preview fingerprint has not been configured.",
      safeRemediation: "approve_preview_v2_fingerprint" as const,
    };
  }

  const v2PreviewProductionDistinct = !input.v2ProductionFingerprint || input.v2PreviewFingerprint !== input.v2ProductionFingerprint;
  if (input.v2ActiveFingerprint === input.v2PreviewFingerprint && v2PreviewProductionDistinct) {
    return {
      activeDatabaseIdentityClassification: "approved_preview_database" as const,
      classification: "PREVIEW_DATABASE_IDENTITY_CERTIFIED" as const,
      rootCause: "The active branch-aware v2 database fingerprint matches the approved Preview v2 fingerprint and differs from Production/main identity.",
      safeRemediation: "none_required" as const,
    };
  }

  if (input.v2ProductionFingerprint && input.v2ActiveFingerprint === input.v2ProductionFingerprint) {
    return {
      activeDatabaseIdentityClassification: "production_database" as const,
      classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
      rootCause: "The active branch-aware v2 fingerprint matches the configured Production v2 fingerprint.",
      safeRemediation: "correct_DATABASE_URL" as const,
    };
  }

  return {
    activeDatabaseIdentityClassification: "unknown_database" as const,
    classification: "PREVIEW_DATABASE_URL_MISMATCH" as const,
    rootCause: "The active branch-aware v2 fingerprint differs from the configured Preview v2 fingerprint.",
    safeRemediation: "correct_DATABASE_URL" as const,
  };
}

export async function loadActiveDbMetadata(): Promise<DbMetadata> {
  const { prisma } = await import("@/lib/prisma");
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

export async function diagnosePreviewDatabaseFingerprint(input: {
  env?: NodeJS.ProcessEnv;
  loadMetadata?: () => Promise<DbMetadata>;
} = {}): Promise<PreviewDatabaseFingerprintDiagnosis> {
  const env = input.env ?? process.env;
  const v1PreviewFingerprint = env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() || null;
  const v1ProductionFingerprint = env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() || null;
  const v2PreviewFingerprint = env.UEIP_PREVIEW_DATABASE_FINGERPRINT_V2?.trim() || null;
  const v2ProductionFingerprint = env.UEIP_PRODUCTION_DATABASE_FINGERPRINT_V2?.trim() || null;
  const databaseUrlProof = createLogicalDatabaseUrlProof(env);
  const neonIdentity = loadNeonIdentityMetadataFromEnv(env);
  let metadata: DbMetadata | null = null;
  let v1ActiveFingerprint: string | null = null;
  let v2ActiveFingerprint: string | null = null;
  let metadataSucceeded = false;

  try {
    metadata = await (input.loadMetadata ?? loadActiveDbMetadata)();
    v1ActiveFingerprint = createDatabaseFingerprint(metadata);
    if (neonIdentity) {
      v2ActiveFingerprint = createBranchAwareDatabaseFingerprint({
        identity: neonIdentity,
        currentSchema: metadata.currentSchema,
        currentUser: metadata.currentUser,
      });
    }
    metadataSucceeded = true;
  } catch {
    metadata = null;
    v1ActiveFingerprint = null;
    v2ActiveFingerprint = null;
    metadataSucceeded = false;
  }

  const decision = classify({
    v1ActiveFingerprint,
    v1PreviewFingerprint,
    v1ProductionFingerprint,
    v2ActiveFingerprint,
    v2PreviewFingerprint,
    v2ProductionFingerprint,
    neonIdentity,
    databaseUrlPresent: databaseUrlProof.databaseUrlPresent,
    directUrlPresent: databaseUrlProof.directUrlPresent,
    logicalMatch: databaseUrlProof.logicalDatabaseMatch,
    endpointMatch: databaseUrlProof.endpointIdentityMatch,
    metadataSucceeded,
    previewEnvironment: env.VERCEL_ENV === "preview",
    previewEnvironmentIdPresent: Boolean(env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim()),
    productionDatabaseUrlPresent: hasExplicitProductionDatabaseUrl(env),
    databaseUrlEndpointId: databaseUrlProof.databaseUrlEndpointId,
    directUrlEndpointId: databaseUrlProof.directUrlEndpointId,
  });
  const approvalPhraseRequired = v2ActiveFingerprint ? `APPROVE_PREVIEW_DATABASE_IDENTITY_V2_${prefix(v2ActiveFingerprint)?.toUpperCase()}` : null;
  const v1ActiveMatchesConfigured = Boolean(v1ActiveFingerprint && v1PreviewFingerprint && v1ActiveFingerprint === v1PreviewFingerprint);

  return {
    activeDatabaseIdentityClassification: decision.activeDatabaseIdentityClassification,
    fingerprintAlgorithm: "sha256(databaseName|currentSchema|currentUser|serverAddress|serverPort)",
    fingerprintAlgorithmVersion: "v1",
    activeFingerprintPrefix: prefix(v1ActiveFingerprint),
    configuredPreviewFingerprintPrefix: prefix(v1PreviewFingerprint),
    configuredProductionFingerprintPrefix: prefix(v1ProductionFingerprint),
    v1: {
      algorithm: "sha256(databaseName|currentSchema|currentUser|serverAddress|serverPort)",
      activeFingerprintPrefix: prefix(v1ActiveFingerprint),
      configuredPreviewFingerprintPrefix: prefix(v1PreviewFingerprint),
      configuredProductionFingerprintPrefix: prefix(v1ProductionFingerprint),
      status: v1ActiveFingerprint ? (v1ActiveMatchesConfigured ? "legacy_match" : "legacy_stale") : "legacy_unavailable",
    },
    v2: {
      algorithm: "sha256(provider|projectId|branchId|normalizedEndpointId|databaseName|currentSchema|currentUser)",
      activeFingerprintPrefix: prefix(v2ActiveFingerprint),
      configuredPreviewFingerprintPrefix: prefix(v2PreviewFingerprint),
      configuredProductionFingerprintPrefix: prefix(v2ProductionFingerprint),
      configuredPreviewFingerprintPresent: Boolean(v2PreviewFingerprint),
      configuredProductionFingerprintPresent: Boolean(v2ProductionFingerprint),
      approvalPhraseRequired,
      metadataAvailable: Boolean(neonIdentity),
      branchName: neonIdentity?.branchName ?? null,
      projectIdPrefix: redactIdentity(neonIdentity?.projectId),
      branchIdPrefix: redactIdentity(neonIdentity?.branchId),
      endpointIdPrefix: redactIdentity(neonIdentity?.endpointId),
      productionProjectIdPrefix: redactIdentity(neonIdentity?.productionProjectId),
      productionBranchIdPrefix: redactIdentity(neonIdentity?.productionBranchId),
      productionEndpointIdPrefix: redactIdentity(neonIdentity?.productionEndpointId),
      previewBranchDiffersFromProduction: neonIdentity?.productionBranchId ? neonIdentity.branchId !== neonIdentity.productionBranchId : null,
      previewEndpointDiffersFromProduction: neonIdentity?.productionEndpointId ? neonIdentity.endpointId !== neonIdentity.productionEndpointId : null,
    },
    databaseUrlDirectUrlLogicalDatabaseMatch: databaseUrlProof.logicalDatabaseMatch,
    rootCause: decision.rootCause,
    safeRemediation: decision.safeRemediation,
    diagnostics: {
      metadataReadOnlyQuerySucceeded: metadataSucceeded,
      databaseUrlPresent: databaseUrlProof.databaseUrlPresent,
      directUrlPresent: databaseUrlProof.directUrlPresent,
      databaseUrlLogicalIdPrefix: databaseUrlProof.databaseUrlLogicalIdPrefix,
      directUrlLogicalIdPrefix: databaseUrlProof.directUrlLogicalIdPrefix,
      databaseUrlEndpointIdPrefix: redactIdentity(databaseUrlProof.databaseUrlEndpointId),
      directUrlEndpointIdPrefix: redactIdentity(databaseUrlProof.directUrlEndpointId),
      databaseUrlDirectUrlEndpointMatch: databaseUrlProof.endpointIdentityMatch,
      previewFingerprintConfigured: Boolean(v1PreviewFingerprint),
      productionFingerprintConfigured: Boolean(v1ProductionFingerprint),
      previewFingerprintV2Configured: Boolean(v2PreviewFingerprint),
      productionFingerprintV2Configured: Boolean(v2ProductionFingerprint),
      previewProductionFingerprintsDistinct: Boolean(v1PreviewFingerprint && v1ProductionFingerprint && v1PreviewFingerprint !== v1ProductionFingerprint),
      productionDatabaseUrlVariablePresent: hasExplicitProductionDatabaseUrl(env),
      previewEnvironment: env.VERCEL_ENV === "preview",
      previewEnvironmentIdPresent: Boolean(env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim()),
      providerCalled: false,
      migrationsRun: false,
      databaseAltered: false,
      dryRunExecuted: false,
    },
    classification: decision.classification,
  };
}
