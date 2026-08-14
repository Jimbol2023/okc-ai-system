import { prisma } from "@/lib/prisma";

export type RuntimeEnvironment = "development" | "preview" | "production";
export type InfrastructureStatus = "healthy" | "warning" | "blocked";
export type InfrastructureReadinessState =
  | "CONFIGURATION_READY_RUNTIME_NOT_VERIFIED"
  | "CONFIGURATION_WARNING_RUNTIME_NOT_VERIFIED"
  | "CONFIGURATION_BLOCKED_RUNTIME_NOT_VERIFIED"
  | "RUNTIME_READY"
  | "RUNTIME_WARNING"
  | "RUNTIME_BLOCKED";
export type EnvRequirementLevel = "critical" | "connector" | "optional";
export type EnvKeyStatus = "present" | "empty" | "missing" | "placeholder";
export type OAuthErrorType = "missing_configuration" | "provider_rejected" | "network_error";
export type SchemaReadinessStatus = "ready" | "schema_drift_detected" | "database_unavailable" | "not_checked";

export type EnvHealthItem = {
  key: string;
  level: EnvRequirementLevel;
  environments: RuntimeEnvironment[];
  present: boolean;
  empty: boolean;
  length: number;
  status: EnvKeyStatus;
  message: string;
};

export type OAuthReadiness = {
  attempted: boolean;
  ok: boolean;
  status: number | null;
  errorType?: OAuthErrorType;
  providerCalled: boolean;
  liveExecutionAllowed: false;
};

export type ConnectorReadiness = {
  connectorId: string;
  label: string;
  status: "ready" | "missing_configuration" | "oauth_blocked";
  deploymentScope: "department";
  affectedDepartments: string[];
  departmentEnablement: "enabled" | "advisory";
  safeInternalFallbackAvailable: true;
  requiredEnvKeys: string[];
  missingEnvKeys: string[];
  oauthRequired: boolean;
  oauthReady: boolean;
  readOnly: true;
  providerCalled: boolean;
  liveExecutionAllowed: false;
};

export type BusinessDataSnapshotSchemaReadiness = {
  table: "BusinessDataSnapshot";
  status: SchemaReadinessStatus;
  requiredMigration: "20260716100000_harden_business_data_snapshots";
  migrationPath: "prisma/migrations/20260716100000_harden_business_data_snapshots/migration.sql";
  requiredColumns: string[];
  missingColumns: string[];
  pendingMigration: boolean;
  message: string;
  operatorAction: string;
  safety: {
    providerCalled: false;
    liveExecutionAllowed: false;
    externalWritesAllowed: false;
    crmMutationAllowed: false;
    outreachAllowed: false;
    automationAllowed: false;
    migrationApplied: false;
  };
};

export type InfrastructureHealthReport = {
  ok: boolean;
  status: InfrastructureStatus;
  readinessState: InfrastructureReadinessState;
  certificationScope: "configuration" | "runtime";
  environment: RuntimeEnvironment;
  generatedAt: string;
  env: {
    items: EnvHealthItem[];
    missing: string[];
    empty: string[];
    placeholders: string[];
  };
  database: {
    checked: boolean;
    ok: boolean | null;
    status: "ok" | "error" | "not_checked";
  };
  safetyGates: {
    approvedExecutionEnabled: boolean;
    approvedExecutionProductionSmokePassed: boolean;
    approvedExecutionExternalReady: boolean;
    liveExecutionAllowed: false;
  };
  oauth: {
    google: OAuthReadiness;
  };
  connectors: ConnectorReadiness[];
  schemaReadiness: {
    businessDataSnapshot: BusinessDataSnapshotSchemaReadiness;
  };
  auditTrail: {
    checked: boolean;
    status: "available" | "blocked" | "not_checked";
    message: string;
    requiredForOperationalHealth: boolean;
    engineeringException: boolean;
    rawSecretsLogged: false;
  };
  build: {
    nodeEnv: string | null;
    vercelEnv: string | null;
    vercelRegion: string | null;
    commitSha: string | null;
    commitRef: string | null;
  };
  deployment: {
    vercel: boolean;
    url: string | null;
    projectProductionUrl: string | null;
  };
  blockers: string[];
  warnings: string[];
  operatorActions: string[];
  providerCalled: boolean;
  liveExecutionAllowed: false;
};

type EnvRequirement = {
  key: string;
  level: EnvRequirementLevel;
  environments: RuntimeEnvironment[];
  message: string;
};

type InfrastructureHealthOptions = {
  env?: NodeJS.ProcessEnv;
  includeDatabase?: boolean;
  includeSchemaReadiness?: boolean;
  includeOAuth?: boolean;
  fetcher?: typeof fetch;
  businessDataSnapshotColumns?: string[];
  databaseCheckResult?: {
    checked: boolean;
    ok: boolean | null;
    status: "ok" | "error" | "not_checked";
  };
};

const placeholderFragments = [
  "replace-with",
  "your-",
  "PROJECT_ID",
  "USER:PASSWORD",
  "localhost-placeholder",
  "example",
];

const envRequirements: EnvRequirement[] = [
  { key: "DATABASE_URL", level: "critical", environments: ["development", "preview", "production"], message: "Primary database connection string is required." },
  { key: "DIRECT_URL", level: "critical", environments: ["development", "preview", "production"], message: "Direct database connection string is required." },
  { key: "AUTH_SECRET", level: "critical", environments: ["development", "preview", "production"], message: "Admin session signing secret is required." },
  { key: "ADMIN_EMAIL", level: "critical", environments: ["development", "preview", "production"], message: "Admin login email is required." },
  { key: "ADMIN_PASSWORD", level: "critical", environments: ["development", "preview", "production"], message: "Admin login password is required." },
  { key: "GOOGLE_OAUTH_CLIENT_ID", level: "connector", environments: ["preview", "production"], message: "Google OAuth client ID is required for Google connector readiness." },
  { key: "GOOGLE_OAUTH_CLIENT_SECRET", level: "connector", environments: ["preview", "production"], message: "Google OAuth client secret is required for Google connector readiness." },
  { key: "GOOGLE_OAUTH_REFRESH_TOKEN", level: "connector", environments: ["preview", "production"], message: "Google OAuth refresh token is required for Google connector readiness." },
  { key: "GOOGLE_ANALYTICS_PROPERTY_ID", level: "connector", environments: ["preview", "production"], message: "GA4 property ID is required for Analytics connector readiness." },
  { key: "GOOGLE_SEARCH_CONSOLE_SITE_URL", level: "connector", environments: ["preview", "production"], message: "Search Console site URL is required for Search Console connector readiness." },
  { key: "YOUTUBE_CHANNEL_ID", level: "connector", environments: ["preview", "production"], message: "YouTube channel ID is required for YouTube connector readiness." },
  { key: "GOOGLE_BUSINESS_PROFILE_LOCATION_ID", level: "connector", environments: ["preview", "production"], message: "GBP location ID is required for Google Business Profile connector readiness." },
  { key: "CRON_SECRET", level: "optional", environments: ["preview", "production"], message: "Cron secret is required for scheduled internal jobs." },
];

const googleCoreKeys = ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"];
const businessDataSnapshotRequiredMigration = "20260716100000_harden_business_data_snapshots" as const;
const businessDataSnapshotMigrationPath = "prisma/migrations/20260716100000_harden_business_data_snapshots/migration.sql" as const;
const businessDataSnapshotRequiredColumns = [
  "version",
  "contractVersion",
  "evidenceHash",
  "observationStart",
  "observationEnd",
  "traceId",
  "reliability",
];

const connectorDefinitions = [
  {
    connectorId: "google_search_console",
    label: "Google Search Console",
    affectedDepartments: ["Search Intelligence", "SEO", "Content"],
    requiredEnvKeys: [...googleCoreKeys, "GOOGLE_SEARCH_CONSOLE_SITE_URL"],
    oauthRequired: true,
  },
  {
    connectorId: "google_analytics",
    label: "Google Analytics",
    affectedDepartments: ["Marketing Intelligence", "Marketing", "Lead Generation", "SEO"],
    requiredEnvKeys: [...googleCoreKeys, "GOOGLE_ANALYTICS_PROPERTY_ID"],
    oauthRequired: true,
  },
  {
    connectorId: "google_business_profile",
    label: "Google Business Profile",
    affectedDepartments: ["Marketing Intelligence", "Marketing", "SEO"],
    requiredEnvKeys: [...googleCoreKeys, "GOOGLE_BUSINESS_PROFILE_LOCATION_ID"],
    oauthRequired: true,
  },
  {
    connectorId: "youtube",
    label: "YouTube",
    affectedDepartments: ["Content", "Marketing"],
    requiredEnvKeys: [...googleCoreKeys, "YOUTUBE_CHANNEL_ID"],
    oauthRequired: true,
  },
] as const;

function getEnvValue(env: NodeJS.ProcessEnv, key: string) {
  return env[key]?.trim() ?? "";
}

function isTruthyEnv(value: string) {
  return value.toLowerCase() === "true" || value === "1";
}

function hasPlaceholderValue(value: string) {
  return placeholderFragments.some((fragment) => value.includes(fragment));
}

export function getRuntimeEnvironment(env: NodeJS.ProcessEnv = process.env): RuntimeEnvironment {
  if (env.VERCEL_ENV === "production") return "production";
  if (env.VERCEL_ENV === "preview") return "preview";
  return "development";
}

export function evaluateEnvironmentHealth(env: NodeJS.ProcessEnv = process.env, runtime = getRuntimeEnvironment(env)) {
  const items = envRequirements
    .filter((requirement) => requirement.environments.includes(runtime))
    .map<EnvHealthItem>((requirement) => {
      const value = getEnvValue(env, requirement.key);
      const present = value.length > 0;
      const status: EnvKeyStatus = !present
        ? env[requirement.key] === undefined
          ? "missing"
          : "empty"
        : hasPlaceholderValue(value)
          ? "placeholder"
          : "present";

      return {
        key: requirement.key,
        level: requirement.level,
        environments: requirement.environments,
        present,
        empty: status === "empty",
        length: value.length,
        status,
        message: requirement.message,
      };
    });

  return {
    items,
    missing: items.filter((item) => item.status === "missing").map((item) => item.key),
    empty: items.filter((item) => item.status === "empty").map((item) => item.key),
    placeholders: items.filter((item) => item.status === "placeholder").map((item) => item.key),
  };
}

async function checkDatabase(includeDatabase: boolean) {
  if (!includeDatabase) {
    return {
      checked: false,
      ok: null,
      status: "not_checked" as const,
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      checked: true,
      ok: true,
      status: "ok" as const,
    };
  } catch {
    return {
      checked: true,
      ok: false,
      status: "error" as const,
    };
  }
}

function createBusinessDataSnapshotSchemaReadiness(
  status: SchemaReadinessStatus,
  observedColumns: string[] | null,
): BusinessDataSnapshotSchemaReadiness {
  const observed = new Set((observedColumns ?? []).map((column) => column.trim()).filter(Boolean));
  const missingColumns =
    status === "schema_drift_detected"
      ? businessDataSnapshotRequiredColumns.filter((column) => !observed.has(column))
      : [];
  const pendingMigration = status === "schema_drift_detected";
  const operatorAction = pendingMigration
    ? `Apply Prisma migration ${businessDataSnapshotRequiredMigration} through the approved deployment path; do not run providers, sync jobs, outreach, CRM actions, or external automation to resolve schema drift.`
    : status === "ready"
      ? "No BusinessDataSnapshot schema action is required."
      : status === "database_unavailable"
        ? "Restore database connectivity before checking BusinessDataSnapshot schema readiness; no provider action is authorized."
        : "Enable database/schema readiness checks in operator diagnostics before production promotion.";
  const message = pendingMigration
    ? `BusinessDataSnapshot schema drift detected: missing column${missingColumns.length === 1 ? "" : "s"} ${missingColumns.join(", ")}. Pending migration: ${businessDataSnapshotRequiredMigration}.`
    : status === "ready"
      ? `BusinessDataSnapshot hardened schema is aligned with ${businessDataSnapshotRequiredMigration}.`
      : status === "database_unavailable"
        ? "BusinessDataSnapshot schema readiness could not be checked because database connectivity is unavailable."
        : "BusinessDataSnapshot schema readiness was not checked in this diagnostic mode.";

  return {
    table: "BusinessDataSnapshot",
    status,
    requiredMigration: businessDataSnapshotRequiredMigration,
    migrationPath: businessDataSnapshotMigrationPath,
    requiredColumns: [...businessDataSnapshotRequiredColumns],
    missingColumns,
    pendingMigration,
    message,
    operatorAction,
    safety: {
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
      crmMutationAllowed: false,
      outreachAllowed: false,
      automationAllowed: false,
      migrationApplied: false,
    },
  };
}

export function evaluateBusinessDataSnapshotSchemaReadiness(observedColumns: string[]): BusinessDataSnapshotSchemaReadiness {
  const observed = new Set(observedColumns.map((column) => column.trim()).filter(Boolean));
  const missingColumns = businessDataSnapshotRequiredColumns.filter((column) => !observed.has(column));

  return createBusinessDataSnapshotSchemaReadiness(missingColumns.length > 0 ? "schema_drift_detected" : "ready", observedColumns);
}

async function checkBusinessDataSnapshotSchemaReadiness(
  includeSchemaReadiness: boolean,
  database: { checked: boolean; ok: boolean | null },
  providedColumns?: string[],
) {
  if (!includeSchemaReadiness) {
    return createBusinessDataSnapshotSchemaReadiness("not_checked", null);
  }

  if (providedColumns) {
    return evaluateBusinessDataSnapshotSchemaReadiness(providedColumns);
  }

  if (!database.checked || !database.ok) {
    return createBusinessDataSnapshotSchemaReadiness("database_unavailable", null);
  }

  try {
    const rows = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'BusinessDataSnapshot'
    `;

    return evaluateBusinessDataSnapshotSchemaReadiness(rows.map((row) => row.column_name));
  } catch {
    return createBusinessDataSnapshotSchemaReadiness("database_unavailable", null);
  }
}

export async function checkGoogleOAuthReadiness(
  env: NodeJS.ProcessEnv = process.env,
  options: { includeOAuth?: boolean; fetcher?: typeof fetch } = {},
): Promise<OAuthReadiness> {
  if (options.includeOAuth === false) {
    return {
      attempted: false,
      ok: false,
      status: null,
      errorType: "missing_configuration",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const clientId = getEnvValue(env, "GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = getEnvValue(env, "GOOGLE_OAUTH_CLIENT_SECRET");
  const refreshToken = getEnvValue(env, "GOOGLE_OAUTH_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    return {
      attempted: false,
      ok: false,
      status: null,
      errorType: "missing_configuration",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  try {
    const activeFetch = options.fetcher ?? fetch;
    const response = await activeFetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });
    let hasAccessToken = false;

    try {
      const json = (await response.json()) as { access_token?: unknown };
      hasAccessToken = typeof json.access_token === "string" && json.access_token.length > 0;
    } catch {
      hasAccessToken = false;
    }

    return {
      attempted: true,
      ok: response.ok && hasAccessToken,
      status: response.status,
      ...(response.ok && hasAccessToken ? {} : { errorType: "provider_rejected" as const }),
      providerCalled: true,
      liveExecutionAllowed: false,
    };
  } catch {
    return {
      attempted: true,
      ok: false,
      status: null,
      errorType: "network_error",
      providerCalled: true,
      liveExecutionAllowed: false,
    };
  }
}

export function evaluateConnectorReadiness(env: NodeJS.ProcessEnv, oauth: OAuthReadiness): ConnectorReadiness[] {
  return connectorDefinitions.map((definition) => {
    const missingEnvKeys = definition.requiredEnvKeys.filter((key) => !getEnvValue(env, key) || hasPlaceholderValue(getEnvValue(env, key)));
    const oauthReady = definition.oauthRequired ? oauth.ok : true;
    const status: ConnectorReadiness["status"] =
      missingEnvKeys.length > 0 ? "missing_configuration" : oauthReady ? "ready" : "oauth_blocked";

    return {
      connectorId: definition.connectorId,
      label: definition.label,
      status,
      deploymentScope: "department",
      affectedDepartments: [...definition.affectedDepartments],
      departmentEnablement: status === "ready" ? "enabled" : "advisory",
      safeInternalFallbackAvailable: true,
      requiredEnvKeys: [...definition.requiredEnvKeys],
      missingEnvKeys,
      oauthRequired: definition.oauthRequired,
      oauthReady,
      readOnly: true,
      providerCalled: oauth.providerCalled,
      liveExecutionAllowed: false,
    };
  });
}

function createOperatorActions(blockers: string[], warnings: string[]) {
  const messages = [...blockers, ...warnings];
  const actions = new Set<string>();

  messages.forEach((message) => {
    if (message.includes("GOOGLE_SEARCH_CONSOLE_SITE_URL")) {
      actions.add("Add GOOGLE_SEARCH_CONSOLE_SITE_URL in Vercel for environments where Search Console reads should work.");
    }
    if (message.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID")) {
      actions.add("Add GOOGLE_BUSINESS_PROFILE_LOCATION_ID in Vercel for environments where Google Business Profile reads should work.");
    }
    if (message.includes("Database")) {
      actions.add("Verify database runtime credentials and connector health before promotion.");
    }
    if (message.includes("BusinessDataSnapshot schema drift")) {
      actions.add(`Apply Prisma migration ${businessDataSnapshotRequiredMigration} through the approved production deployment path; this is an operator migration action, not a provider or automation action.`);
    }
    if (message.includes("APPROVED_EXECUTION")) {
      actions.add("Keep external execution disabled until the governed smoke approval is complete.");
    }
  });

  if (actions.size === 0) {
    actions.add("Continue monitoring infrastructure health before deployment or credential rotation.");
  }

  return Array.from(actions);
}

function createReadinessState(input: {
  blockers: string[];
  warnings: string[];
  databaseChecked: boolean;
}): InfrastructureReadinessState {
  if (!input.databaseChecked) {
    if (input.blockers.length > 0) return "CONFIGURATION_BLOCKED_RUNTIME_NOT_VERIFIED";
    if (input.warnings.length > 0) return "CONFIGURATION_WARNING_RUNTIME_NOT_VERIFIED";
    return "CONFIGURATION_READY_RUNTIME_NOT_VERIFIED";
  }

  if (input.blockers.length > 0) return "RUNTIME_BLOCKED";
  if (input.warnings.length > 0) return "RUNTIME_WARNING";
  return "RUNTIME_READY";
}

export async function getInfrastructureHealth(options: InfrastructureHealthOptions = {}): Promise<InfrastructureHealthReport> {
  const env = options.env ?? process.env;
  const runtime = getRuntimeEnvironment(env);
  const envHealth = evaluateEnvironmentHealth(env, runtime);
  const safetyGates = {
    approvedExecutionEnabled: isTruthyEnv(getEnvValue(env, "APPROVED_EXECUTION_ENABLED")),
    approvedExecutionProductionSmokePassed: isTruthyEnv(getEnvValue(env, "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED")),
    approvedExecutionExternalReady: false,
    liveExecutionAllowed: false as const,
  };
  safetyGates.approvedExecutionExternalReady = safetyGates.approvedExecutionEnabled && safetyGates.approvedExecutionProductionSmokePassed;

  const [database, googleOAuth] = await Promise.all([
    options.databaseCheckResult ?? checkDatabase(options.includeDatabase ?? true),
    checkGoogleOAuthReadiness(env, {
      includeOAuth: options.includeOAuth ?? true,
      fetcher: options.fetcher,
    }),
  ]);
  const businessDataSnapshotSchema = await checkBusinessDataSnapshotSchemaReadiness(
    options.includeSchemaReadiness ?? options.includeDatabase ?? true,
    database,
    options.businessDataSnapshotColumns,
  );
  const connectors = evaluateConnectorReadiness(env, googleOAuth);
  const blockers: string[] = [];
  const warnings: string[] = [];
  const missingCritical = envHealth.items.filter((item) => item.level === "critical" && item.status !== "present");
  const missingConnector = envHealth.items.filter((item) => item.level === "connector" && item.status !== "present");

  missingCritical.forEach((item) => blockers.push(`${item.key}: ${item.message}`));
  missingConnector.forEach((item) => {
    warnings.push(`${item.key}: ${item.message} The affected connector-backed evidence is advisory; internal department work and company deployment remain allowed.`);
  });

  if (database.checked && !database.ok) {
    blockers.push("Database connectivity check failed.");
  }

  if (businessDataSnapshotSchema.status === "schema_drift_detected") {
    blockers.push(businessDataSnapshotSchema.message);
  }

  if (safetyGates.approvedExecutionEnabled && !safetyGates.approvedExecutionProductionSmokePassed) {
    blockers.push("APPROVED_EXECUTION_ENABLED is true before APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED is true.");
  }

  if (options.includeOAuth && googleOAuth.attempted && !googleOAuth.ok) {
    warnings.push("Google OAuth token exchange failed. Dependent Google connector evidence is advisory until verified; company deployment and internal work remain allowed.");
  }

  const status: InfrastructureStatus = blockers.length > 0 ? "blocked" : warnings.length > 0 ? "warning" : "healthy";
  const readinessState = createReadinessState({
    blockers,
    warnings,
    databaseChecked: database.checked,
  });
  const operatorActions = createOperatorActions(blockers, warnings);

  return {
    ok: blockers.length === 0,
    status,
    readinessState,
    certificationScope: database.checked ? "runtime" : "configuration",
    environment: runtime,
    generatedAt: new Date().toISOString(),
    env: envHealth,
    database,
    safetyGates,
    oauth: {
      google: googleOAuth,
    },
    connectors,
    schemaReadiness: {
      businessDataSnapshot: businessDataSnapshotSchema,
    },
    auditTrail: {
      checked: database.checked,
      status: database.checked ? database.ok ? "available" : "blocked" : "not_checked",
      message: database.checked
        ? database.ok
          ? "Database-backed audit and operating-loop records can be checked by runtime workflows."
          : "Database-backed audit visibility is blocked until database connectivity is restored."
        : "Audit persistence was not checked by this diagnostic mode.",
      requiredForOperationalHealth: database.checked,
      engineeringException: database.checked && !database.ok,
      rawSecretsLogged: false,
    },
    build: {
      nodeEnv: env.NODE_ENV ?? null,
      vercelEnv: env.VERCEL_ENV ?? null,
      vercelRegion: env.VERCEL_REGION ?? null,
      commitSha: env.VERCEL_GIT_COMMIT_SHA ?? null,
      commitRef: env.VERCEL_GIT_COMMIT_REF ?? null,
    },
    deployment: {
      vercel: env.VERCEL === "1",
      url: env.VERCEL_URL ?? null,
      projectProductionUrl: env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
    },
    blockers,
    warnings,
    operatorActions,
    providerCalled: googleOAuth.providerCalled,
    liveExecutionAllowed: false,
  };
}
