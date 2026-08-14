import { prisma } from "@/lib/prisma";
import {
  getInfrastructureHealth,
  type InfrastructureHealthReport,
  type InfrastructureReadinessState,
} from "@/lib/infrastructure-health";

const expectedPreviewNeonProject = "summer-star-72148368";
const expectedPreviewBranch = "vercel-preview";
const expectedPreviewNeonEndpoint = "ep-shiny-glitter-at7sr22n";

type ActorContext = {
  tenantId: string;
  actorId: string;
};

type DatabaseIdentityStatus =
  | "PREVIEW_DATABASE_IDENTITY_CERTIFIED"
  | "PREVIEW_DATABASE_IDENTITY_BLOCKED";

type RuntimePreflightOptions = {
  env?: NodeJS.ProcessEnv;
  requirePreview?: boolean;
  actor?: ActorContext;
  infrastructureReport?: InfrastructureHealthReport;
  databaseIdentityResult?: DatabaseIdentityResult;
  auditEvidenceResult?: AuditEvidenceResult;
  databaseIdentityQuery?: () => Promise<DatabaseIdentityQueryResult>;
};

type DatabaseIdentityResult = {
  certified: boolean;
  status: DatabaseIdentityStatus;
  reasons: string[];
  databaseNameMatches: boolean;
  expectedNeonProjectMatched: boolean;
  diagnostics?: DatabaseIdentityDiagnostics;
};

type ParsedDatabaseUrl = {
  databaseName: string;
  neon: NeonUrlIdentity | null;
};

type NeonUrlIdentity = {
  host: string;
  endpointId: string | null;
  malformed: boolean;
  source: string;
};

type AuditEvidenceResult = {
  available: boolean;
  status: "available" | "blocked";
  requiredTablesPresent: boolean;
};

type DatabaseIdentityQueryResult = {
  observedServerIdentity: string | null;
  observedDatabaseName: string | null;
  observedBranchIdentity: string | null;
};

type DatabaseIdentityDiagnostics = {
  configuredProjectId: string | null;
  configuredEndpointId: string | null;
  observedEndpointId: string | null;
  configuredBranchId: string | null;
  configuredBranchName: string | null;
  configuredDatabaseName: string | null;
  expectedProjectIdentity: typeof expectedPreviewNeonProject;
  expectedEndpointIdentity: typeof expectedPreviewNeonEndpoint;
  projectIdentitySource: string | null;
  endpointIdentitySource: string[];
  projectMatch: boolean;
  endpointMatch: boolean;
  databaseNameMatch: boolean;
  directPooledAgreement: boolean;
  previewDistinctFromProduction: boolean;
  ambiguityDetected: boolean;
  branchEvidenceAvailable: boolean;
  branchMatch: boolean;
};

export type RuntimePreflightCertification = {
  ok: boolean;
  environment: "development" | "preview" | "production";
  tenantId: string;
  actorAuthenticated: boolean;
  vercel: {
    isVercel: boolean;
    environment: string | null;
    deploymentUrlPresent: boolean;
    productionUrlPresent: boolean;
    previewEndpointDiffersFromProduction: boolean;
    commitShaPresent: boolean;
    commitRef: string | null;
    expectedPreviewBranch: typeof expectedPreviewBranch;
  };
  secrets: {
    databaseUrlPresent: boolean;
    directUrlPresent: boolean;
    authSecretPresent: boolean;
    adminEmailPresent: boolean;
    adminPasswordPresent: boolean;
  };
  databaseConnectivity: "ready" | "blocked" | "not_checked";
  databaseIdentity: {
    status: DatabaseIdentityStatus;
    expectedNeonProject: typeof expectedPreviewNeonProject;
    databaseNameMatches: boolean;
    expectedNeonProjectMatched: boolean;
    diagnostics: DatabaseIdentityDiagnostics;
  };
  auditTrail: "available" | "blocked" | "not_checked";
  readinessState: InfrastructureReadinessState;
  providerCalled: boolean;
  liveExecutionAllowed: false;
  blockers: string[];
  warnings: string[];
};

type RuntimePreflightTestOverrides = Omit<RuntimePreflightOptions, "env" | "actor" | "requirePreview">;

let testOverrides: RuntimePreflightTestOverrides | null = null;

export function setRuntimePreflightTestOverridesForTest(overrides: RuntimePreflightTestOverrides | null) {
  testOverrides = overrides;
  return () => {
    testOverrides = null;
  };
}

function hasValue(value: string | undefined) {
  return Boolean(value?.trim());
}

function normalizeNeonProjectId(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();

  return normalized && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) ? normalized : null;
}

function normalizeNeonEndpointId(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();

  return normalized && /^ep-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) ? normalized : null;
}

function normalizeOptionalIdentifier(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();

  return normalized && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) ? normalized : null;
}

function normalizeDatabaseName(value: string | undefined) {
  const normalized = value?.trim();

  return normalized && /^[A-Za-z0-9_]+$/.test(normalized) ? normalized : null;
}

function parseNeonUrlIdentity(host: string, source: string): NeonUrlIdentity | null {
  const normalizedHost = host.toLowerCase();

  if (!normalizedHost.endsWith(".neon.tech")) {
    return null;
  }

  const primaryLabel = normalizedHost.split(".")[0];
  const endpointLabel = primaryLabel.endsWith("-pooler")
    ? primaryLabel.slice(0, -"-pooler".length)
    : primaryLabel;
  const endpointId = normalizeNeonEndpointId(endpointLabel);

  return {
    host: normalizedHost,
    endpointId,
    malformed: !endpointId,
    source,
  };
}

function parseDatabaseUrl(value: string | undefined, source: string): ParsedDatabaseUrl | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return {
      databaseName: url.pathname.replace(/^\//, ""),
      neon: parseNeonUrlIdentity(url.hostname, source),
    };
  } catch {
    return null;
  }
}

function normalizeObservedServerIdentity(value: string | null): NeonUrlIdentity | null {
  const endpointId = normalizeNeonEndpointId(value ?? undefined);
  if (!value || !endpointId) return null;

  return {
    host: "postgresql_server_identity",
    endpointId,
    malformed: false,
    source: "postgresServerIdentity",
  };
}

function getConfiguredPreviewIdentity(env: NodeJS.ProcessEnv) {
  return {
    projectId: normalizeNeonProjectId(env.UEIP_PREVIEW_NEON_PROJECT_ID),
    endpointId: normalizeNeonEndpointId(env.UEIP_PREVIEW_NEON_ENDPOINT_ID),
    branchId: normalizeOptionalIdentifier(env.UEIP_PREVIEW_NEON_BRANCH_ID),
    branchName: normalizeOptionalIdentifier(env.UEIP_PREVIEW_NEON_BRANCH_NAME),
    databaseName: normalizeDatabaseName(env.UEIP_PREVIEW_NEON_DATABASE_NAME),
    productionEndpointId: normalizeNeonEndpointId(env.UEIP_PRODUCTION_NEON_ENDPOINT_ID),
    previewFingerprint: env.UEIP_PREVIEW_FINGERPRINT_V2?.trim() || env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() || null,
    productionFingerprint: env.UEIP_PRODUCTION_FINGERPRINT_V2?.trim() || env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() || null,
  };
}

function evaluateExpectedNeonProjectMatch(
  databaseUrl: ParsedDatabaseUrl | null,
  directUrl: ParsedDatabaseUrl | null,
  env: NodeJS.ProcessEnv,
  queryResult: DatabaseIdentityQueryResult | null,
  databaseNameMatches: boolean,
) {
  const configuredIdentity = getConfiguredPreviewIdentity(env);
  const expectedProjectIdentity: typeof expectedPreviewNeonProject = expectedPreviewNeonProject;
  const expectedEndpointId: typeof expectedPreviewNeonEndpoint = expectedPreviewNeonEndpoint;
  const endpointCandidates = new Map<string, string[]>();
  const malformedExplicitProject =
    hasValue(env.UEIP_PREVIEW_NEON_PROJECT_ID) && !configuredIdentity.projectId;
  const malformedExplicitEndpoint =
    hasValue(env.UEIP_PREVIEW_NEON_ENDPOINT_ID) && !configuredIdentity.endpointId;
  const malformedExplicitBranch =
    (hasValue(env.UEIP_PREVIEW_NEON_BRANCH_ID) && !configuredIdentity.branchId) ||
    (hasValue(env.UEIP_PREVIEW_NEON_BRANCH_NAME) && !configuredIdentity.branchName);
  const malformedExplicitDatabase =
    hasValue(env.UEIP_PREVIEW_NEON_DATABASE_NAME) && !configuredIdentity.databaseName;
  const parsedIdentities = [
    databaseUrl?.neon,
    directUrl?.neon,
    normalizeObservedServerIdentity(queryResult?.observedServerIdentity ?? null),
  ].filter((value): value is NeonUrlIdentity => Boolean(value));

  function addCandidate(candidates: Map<string, string[]>, value: string | null, source: string) {
    if (!value) return;

    candidates.set(value, [...(candidates.get(value) ?? []), source]);
  }

  addCandidate(endpointCandidates, configuredIdentity.endpointId, "UEIP_PREVIEW_NEON_ENDPOINT_ID");

  for (const identity of parsedIdentities) {
    addCandidate(endpointCandidates, identity.endpointId, identity.source);
  }

  const parsedUrlEndpoints = [databaseUrl?.neon?.endpointId, directUrl?.neon?.endpointId].filter((value): value is string => Boolean(value));
  const directPooledAgreement =
    Boolean(databaseNameMatches && configuredIdentity.endpointId) &&
    parsedUrlEndpoints.length === 2 &&
    parsedUrlEndpoints.every((endpointId) => endpointId === configuredIdentity.endpointId);
  const observedEndpointId = queryResult?.observedServerIdentity ?? null;
  const endpointIdValues = new Set(endpointCandidates.keys());
  const malformed = malformedExplicitProject || malformedExplicitEndpoint || malformedExplicitBranch || malformedExplicitDatabase || parsedIdentities.some((identity) => identity.malformed);
  const ambiguous = endpointIdValues.size > 1;
  const normalizedEndpointId = endpointIdValues.size === 1 ? [...endpointIdValues][0] : null;
  const projectMatch = configuredIdentity.projectId === expectedProjectIdentity;
  const endpointMatch =
    Boolean(configuredIdentity.endpointId && observedEndpointId) &&
    configuredIdentity.endpointId === expectedEndpointId &&
    observedEndpointId === configuredIdentity.endpointId &&
    directPooledAgreement;
  const branchEvidenceAvailable = Boolean(configuredIdentity.branchName || configuredIdentity.branchId);
  const branchMatch = configuredIdentity.branchName === expectedPreviewBranch;
  const databaseNameMatch =
    Boolean(configuredIdentity.databaseName && databaseUrl && directUrl) &&
    (databaseUrl?.databaseName ?? null) === configuredIdentity.databaseName &&
    (directUrl?.databaseName ?? null) === configuredIdentity.databaseName &&
    (!queryResult?.observedDatabaseName || queryResult.observedDatabaseName === configuredIdentity.databaseName);
  const previewDistinctFromProduction =
    configuredIdentity.productionEndpointId
      ? configuredIdentity.productionEndpointId !== configuredIdentity.endpointId && configuredIdentity.productionEndpointId !== observedEndpointId
      : Boolean(
          env.VERCEL_URL &&
          env.VERCEL_PROJECT_PRODUCTION_URL &&
          env.VERCEL_URL !== env.VERCEL_PROJECT_PRODUCTION_URL &&
          (
            !configuredIdentity.previewFingerprint ||
            !configuredIdentity.productionFingerprint ||
            configuredIdentity.previewFingerprint !== configuredIdentity.productionFingerprint
          )
        );

  return {
    matched: Boolean(projectMatch && endpointMatch && branchMatch && databaseNameMatch && previewDistinctFromProduction && !malformed && !ambiguous),
    malformed,
    ambiguous,
    hasStructuredEvidence: Boolean(configuredIdentity.projectId && configuredIdentity.endpointId && configuredIdentity.branchName && configuredIdentity.databaseName && endpointCandidates.size > 0),
    diagnostics: {
      configuredProjectId: configuredIdentity.projectId,
      configuredEndpointId: configuredIdentity.endpointId,
      observedEndpointId,
      configuredBranchId: configuredIdentity.branchId,
      configuredBranchName: configuredIdentity.branchName,
      configuredDatabaseName: configuredIdentity.databaseName,
      expectedProjectIdentity,
      expectedEndpointIdentity: expectedEndpointId,
      projectIdentitySource: configuredIdentity.projectId ? "UEIP_PREVIEW_NEON_PROJECT_ID" : null,
      endpointIdentitySource: normalizedEndpointId ? endpointCandidates.get(normalizedEndpointId) ?? [] : [],
      projectMatch,
      endpointMatch,
      databaseNameMatch,
      directPooledAgreement,
      previewDistinctFromProduction,
      ambiguityDetected: ambiguous,
      branchEvidenceAvailable,
      branchMatch,
    },
  };
}

async function checkRuntimeDatabaseIdentity(env: NodeJS.ProcessEnv, identityQuery = runDatabaseIdentityQuery): Promise<DatabaseIdentityResult> {
  const databaseUrl = parseDatabaseUrl(env.DATABASE_URL, "databaseUrlHost");
  const directUrl = parseDatabaseUrl(env.DIRECT_URL, "directUrlHost");
  const reasons: string[] = [];

  if (!databaseUrl) reasons.push("database_url_missing_or_invalid");
  if (!directUrl) reasons.push("direct_url_missing_or_invalid");

  const databaseNameMatches = Boolean(databaseUrl && directUrl && databaseUrl.databaseName === directUrl.databaseName);
  if (!databaseNameMatches) reasons.push("database_url_and_direct_url_database_name_mismatch");

  let queryResult: DatabaseIdentityQueryResult | null = null;
  if (databaseUrl && directUrl && databaseNameMatches) {
    try {
      queryResult = await identityQuery();
    } catch {
      reasons.push("database_identity_query_failed");
    }
  }

  const neonProjectMatch = evaluateExpectedNeonProjectMatch(databaseUrl, directUrl, env, queryResult, databaseNameMatches);
  const expectedNeonProjectMatched = neonProjectMatch.matched;
  if (neonProjectMatch.malformed) reasons.push("preview_neon_identity_malformed");
  if (neonProjectMatch.ambiguous) reasons.push("preview_neon_identity_ambiguous");
  if (!neonProjectMatch.hasStructuredEvidence) reasons.push("preview_neon_identity_missing");
  if (!neonProjectMatch.diagnostics.projectMatch) reasons.push("configured_preview_neon_project_mismatch");
  if (!neonProjectMatch.diagnostics.endpointMatch) reasons.push("configured_preview_neon_endpoint_mismatch");
  if (!neonProjectMatch.diagnostics.branchMatch) reasons.push("configured_preview_neon_branch_mismatch");
  if (!neonProjectMatch.diagnostics.databaseNameMatch) reasons.push("configured_preview_neon_database_mismatch");
  if (!neonProjectMatch.diagnostics.directPooledAgreement) reasons.push("database_url_and_direct_url_endpoint_mismatch");
  if (!neonProjectMatch.diagnostics.previewDistinctFromProduction) reasons.push("preview_neon_identity_not_distinct_from_production");
  if (!expectedNeonProjectMatched) reasons.push("expected_preview_neon_project_not_detected");

  return {
    certified: reasons.length === 0,
    status: reasons.length === 0 ? "PREVIEW_DATABASE_IDENTITY_CERTIFIED" : "PREVIEW_DATABASE_IDENTITY_BLOCKED",
    reasons,
    databaseNameMatches,
    expectedNeonProjectMatched,
    diagnostics: neonProjectMatch.diagnostics,
  };
}

async function runDatabaseIdentityQuery(): Promise<DatabaseIdentityQueryResult> {
  const rows = await prisma.$queryRaw<Array<{
    current_database: string;
    neon_endpoint_id: string | null;
    neon_compute_id: string | null;
    neon_project_id: string | null;
    neon_branch_name: string | null;
  }>>`
    SELECT
      current_database(),
      NULLIF(current_setting('neon.endpoint_id', true), '') AS neon_endpoint_id,
      NULLIF(current_setting('neon.compute_id', true), '') AS neon_compute_id,
      NULLIF(current_setting('neon.project_id', true), '') AS neon_project_id,
      NULLIF(current_setting('neon.branch_name', true), '') AS neon_branch_name
  `;
  const observedServerIdentity =
    normalizeNeonEndpointId(rows[0]?.neon_endpoint_id ?? undefined) ??
    normalizeNeonEndpointId(rows[0]?.neon_compute_id ?? undefined) ??
    (normalizeNeonProjectId(rows[0]?.neon_project_id ?? undefined)
      ? `ep-${normalizeNeonProjectId(rows[0]?.neon_project_id ?? undefined)}`
      : null);

  return {
    observedServerIdentity,
    observedDatabaseName: rows[0]?.current_database ?? null,
    observedBranchIdentity: rows[0]?.neon_branch_name ?? null,
  };
}

async function checkAuditEvidenceAvailability(databaseReady: boolean): Promise<AuditEvidenceResult> {
  if (!databaseReady) {
    return {
      available: false,
      status: "blocked",
      requiredTablesPresent: false,
    };
  }

  try {
    const rows = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = current_schema()
        AND table_name IN ('RevenueAuditEvent', 'AiMemoryEvent', 'UeipGatewayAuditEvent')
    `;
    const tableNames = new Set(rows.map((row) => row.table_name));
    const requiredTablesPresent =
      tableNames.has("RevenueAuditEvent") ||
      tableNames.has("AiMemoryEvent") ||
      tableNames.has("UeipGatewayAuditEvent");

    return {
      available: requiredTablesPresent,
      status: requiredTablesPresent ? "available" : "blocked",
      requiredTablesPresent,
    };
  } catch {
    return {
      available: false,
      status: "blocked",
      requiredTablesPresent: false,
    };
  }
}

function applyRuntimeBlockers(
  readinessState: InfrastructureReadinessState,
  blockers: string[],
): InfrastructureReadinessState {
  return blockers.length > 0 || readinessState === "RUNTIME_BLOCKED" ? "RUNTIME_BLOCKED" : readinessState;
}

function getFallbackDatabaseIdentityDiagnostics(databaseIdentity: DatabaseIdentityResult): DatabaseIdentityDiagnostics {
  return {
    configuredProjectId: databaseIdentity.expectedNeonProjectMatched ? expectedPreviewNeonProject : null,
    configuredEndpointId: null,
    observedEndpointId: null,
    configuredBranchId: null,
    configuredBranchName: null,
    configuredDatabaseName: null,
    expectedProjectIdentity: expectedPreviewNeonProject,
    expectedEndpointIdentity: expectedPreviewNeonEndpoint,
    projectIdentitySource: databaseIdentity.expectedNeonProjectMatched ? "testOverride" : null,
    endpointIdentitySource: [],
    projectMatch: databaseIdentity.expectedNeonProjectMatched,
    endpointMatch: false,
    databaseNameMatch: databaseIdentity.databaseNameMatches,
    directPooledAgreement: false,
    previewDistinctFromProduction: false,
    ambiguityDetected: false,
    branchEvidenceAvailable: false,
    branchMatch: false,
  };
}

export async function runRuntimePreflightCertification(options: RuntimePreflightOptions = {}): Promise<RuntimePreflightCertification> {
  const env = options.env ?? process.env;
  const actor = options.actor ?? { tenantId: "default", actorId: "system:runtime-preflight" };
  const activeOverrides = testOverrides ?? {};
  const report =
    options.infrastructureReport ??
    activeOverrides.infrastructureReport ??
    await getInfrastructureHealth({
      env,
      includeDatabase: true,
      includeSchemaReadiness: true,
      includeOAuth: false,
    });
  const databaseIdentity =
    options.databaseIdentityResult ??
    activeOverrides.databaseIdentityResult ??
    await checkRuntimeDatabaseIdentity(env, options.databaseIdentityQuery ?? activeOverrides.databaseIdentityQuery);
  const auditEvidence =
    options.auditEvidenceResult ??
    activeOverrides.auditEvidenceResult ??
    await checkAuditEvidenceAvailability(report.database.ok === true);
  const blockers = [...report.blockers];

  if (options.requirePreview && env.VERCEL_ENV !== "preview") {
    blockers.push("VERCEL_ENV must be preview for the runtime-preflight certification endpoint.");
  }
  if (options.requirePreview && env.VERCEL !== "1") {
    blockers.push("Preview runtime-preflight must run inside Vercel.");
  }
  if (options.requirePreview && !hasValue(env.VERCEL_GIT_COMMIT_SHA)) {
    blockers.push("Preview runtime-preflight requires an immutable Vercel Git commit SHA.");
  }
  if (!databaseIdentity.certified) {
    blockers.push(...databaseIdentity.reasons.map((reason) => `Preview database identity: ${reason}.`));
  }
  if (!auditEvidence.available) {
    blockers.push("Database-backed audit evidence is unavailable.");
  }

  const previewEndpointDiffersFromProduction =
    hasValue(env.VERCEL_URL) &&
    hasValue(env.VERCEL_PROJECT_PRODUCTION_URL) &&
    env.VERCEL_URL !== env.VERCEL_PROJECT_PRODUCTION_URL;
  if (options.requirePreview && !previewEndpointDiffersFromProduction) {
    blockers.push("Preview endpoint must differ from Production endpoint.");
  }

  return {
    ok: blockers.length === 0 && report.readinessState === "RUNTIME_READY",
    environment: report.environment,
    tenantId: actor.tenantId,
    actorAuthenticated: true,
    vercel: {
      isVercel: env.VERCEL === "1",
      environment: env.VERCEL_ENV ?? null,
      deploymentUrlPresent: hasValue(env.VERCEL_URL),
      productionUrlPresent: hasValue(env.VERCEL_PROJECT_PRODUCTION_URL),
      previewEndpointDiffersFromProduction,
      commitShaPresent: hasValue(env.VERCEL_GIT_COMMIT_SHA),
      commitRef: env.VERCEL_GIT_COMMIT_REF ?? null,
      expectedPreviewBranch,
    },
    secrets: {
      databaseUrlPresent: hasValue(env.DATABASE_URL),
      directUrlPresent: hasValue(env.DIRECT_URL),
      authSecretPresent: hasValue(env.AUTH_SECRET),
      adminEmailPresent: hasValue(env.ADMIN_EMAIL),
      adminPasswordPresent: hasValue(env.ADMIN_PASSWORD),
    },
    databaseConnectivity: report.database.status === "ok" ? "ready" : report.database.status === "error" ? "blocked" : "not_checked",
    databaseIdentity: {
      status: databaseIdentity.status,
      expectedNeonProject: expectedPreviewNeonProject,
      databaseNameMatches: databaseIdentity.databaseNameMatches,
      expectedNeonProjectMatched: databaseIdentity.expectedNeonProjectMatched,
      diagnostics: databaseIdentity.diagnostics ?? getFallbackDatabaseIdentityDiagnostics(databaseIdentity),
    },
    auditTrail: auditEvidence.status,
    readinessState: applyRuntimeBlockers(report.readinessState, blockers),
    providerCalled: report.providerCalled,
    liveExecutionAllowed: false,
    blockers,
    warnings: report.warnings,
  };
}
