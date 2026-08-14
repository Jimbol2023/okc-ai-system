import { prisma } from "@/lib/prisma";
import {
  getInfrastructureHealth,
  type InfrastructureHealthReport,
  type InfrastructureReadinessState,
} from "@/lib/infrastructure-health";

const expectedPreviewNeonProject = "summer-star-72148368";
const expectedPreviewBranch = "vercel-preview";

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
};

type DatabaseIdentityResult = {
  certified: boolean;
  status: DatabaseIdentityStatus;
  reasons: string[];
  databaseNameMatches: boolean;
  expectedNeonProjectMatched: boolean;
};

type AuditEvidenceResult = {
  available: boolean;
  status: "available" | "blocked";
  requiredTablesPresent: boolean;
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

function parseDatabaseUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return {
      databaseName: url.pathname.replace(/^\//, ""),
    };
  } catch {
    return null;
  }
}

function containsExpectedPreviewProject(value: string | undefined) {
  return Boolean(value?.toLowerCase().includes(expectedPreviewNeonProject));
}

async function checkRuntimeDatabaseIdentity(env: NodeJS.ProcessEnv): Promise<DatabaseIdentityResult> {
  const databaseUrl = parseDatabaseUrl(env.DATABASE_URL);
  const directUrl = parseDatabaseUrl(env.DIRECT_URL);
  const reasons: string[] = [];

  if (!databaseUrl) reasons.push("database_url_missing_or_invalid");
  if (!directUrl) reasons.push("direct_url_missing_or_invalid");

  const databaseNameMatches = Boolean(databaseUrl && directUrl && databaseUrl.databaseName === directUrl.databaseName);
  if (!databaseNameMatches) reasons.push("database_url_and_direct_url_database_name_mismatch");

  const expectedNeonProjectMatched =
    containsExpectedPreviewProject(env.DATABASE_URL) ||
    containsExpectedPreviewProject(env.DIRECT_URL) ||
    env.NEON_PROJECT_ID === expectedPreviewNeonProject ||
    env.NEON_PROJECT_NAME === expectedPreviewNeonProject;
  if (!expectedNeonProjectMatched) reasons.push("expected_preview_neon_project_not_detected");

  if (reasons.length === 0) {
    try {
      await prisma.$queryRaw<Array<{ current_database: string; current_user: string }>>`
        SELECT current_database(), current_user
      `;
    } catch {
      reasons.push("database_identity_query_failed");
    }
  }

  return {
    certified: reasons.length === 0,
    status: reasons.length === 0 ? "PREVIEW_DATABASE_IDENTITY_CERTIFIED" : "PREVIEW_DATABASE_IDENTITY_BLOCKED",
    reasons,
    databaseNameMatches,
    expectedNeonProjectMatched,
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
    await checkRuntimeDatabaseIdentity(env);
  const auditEvidence =
    options.auditEvidenceResult ??
    activeOverrides.auditEvidenceResult ??
    await checkAuditEvidenceAvailability(report.database.ok === true);
  const blockers = [...report.blockers];

  if (options.requirePreview && env.VERCEL_ENV !== "preview") {
    blockers.push("VERCEL_ENV must be preview for the runtime-preflight certification endpoint.");
  }
  if (options.requirePreview && env.VERCEL_GIT_COMMIT_REF !== expectedPreviewBranch) {
    blockers.push(`Preview runtime-preflight must run from ${expectedPreviewBranch}.`);
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
    },
    auditTrail: auditEvidence.status,
    readinessState: applyRuntimeBlockers(report.readinessState, blockers),
    providerCalled: report.providerCalled,
    liveExecutionAllowed: false,
    blockers,
    warnings: report.warnings,
  };
}
