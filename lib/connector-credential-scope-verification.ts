import {
  assertConnectorActivationGateSafety,
  createConnectorActivationGate,
  type ConnectorActivationGateReport,
  type ConnectorActivationGateRecord,
} from "@/lib/connector-activation-gate";
import { listEnterpriseConnectors, type EnterpriseConnector } from "@/lib/connector-platform";

export type SecretConfigClassification = "configured" | "missing" | "placeholder" | "malformed" | "unknown";
export type ConnectorScopeVerificationStatus = "valid" | "missing" | "unknown";

export type ConnectorCredentialCheck = {
  key: string;
  required: boolean;
  classification: SecretConfigClassification;
  safeLabel: string;
  message: string;
};

export type ConnectorScopeCheck = {
  scope: string;
  required: boolean;
  status: ConnectorScopeVerificationStatus;
  evidenceSource: "local_grant_evidence" | "required_permission" | "not_available";
  message: string;
};

export type ConnectorVerificationChecklistItem = {
  connectorId: string;
  connector: string;
  readinessStatus: ConnectorActivationGateRecord["healthStatus"];
  gateMode: ConnectorActivationGateRecord["mode"];
  credentialChecks: ConnectorCredentialCheck[];
  scopeChecks: ConnectorScopeCheck[];
  missingConfig: string[];
  missingScopes: string[];
  affectedDepartments: string[];
  affectedEmployees: string[];
  nextSafeAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorCredentialScopeVerificationReport = {
  ok: true;
  company: "J Capital Property Group";
  generatedAt: string;
  mode: "local_config_only";
  summary: {
    connectors: number;
    configuredCredentialChecks: number;
    missingCredentialChecks: number;
    placeholderCredentialChecks: number;
    malformedCredentialChecks: number;
    validScopeChecks: number;
    missingScopeChecks: number;
    unknownScopeChecks: number;
  };
  checklist: ConnectorVerificationChecklistItem[];
  safety: {
    readOnly: true;
    localOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    oauthStarted: false;
    credentialsChanged: false;
    rawSecretValuesExposed: false;
    externalProviderWritesAllowed: false;
    level4Unlocked: false;
    level5Unlocked: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorCredentialScopeVerificationInputs = {
  gate: ConnectorActivationGateReport;
  env?: NodeJS.ProcessEnv;
  connectors?: EnterpriseConnector[];
  generatedAt?: string;
};

const googleConnectorIds = [
  "gmail",
  "google_drive",
  "google_calendar",
  "google_search_console",
  "google_analytics",
  "google_business_profile",
  "youtube",
] as const;

const requiredEnvByConnector: Record<(typeof googleConnectorIds)[number], string[]> = {
  gmail: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
  google_drive: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
  google_calendar: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
  google_search_console: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_SEARCH_CONSOLE_SITE_URL"],
  google_analytics: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_ANALYTICS_PROPERTY_ID"],
  google_business_profile: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_BUSINESS_PROFILE_LOCATION_ID"],
  youtube: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "YOUTUBE_CHANNEL_ID"],
};

const requiredScopesByConnector: Record<(typeof googleConnectorIds)[number], string[]> = {
  gmail: ["https://www.googleapis.com/auth/gmail.readonly"],
  google_drive: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
  google_calendar: ["https://www.googleapis.com/auth/calendar.events.readonly"],
  google_search_console: ["https://www.googleapis.com/auth/webmasters.readonly"],
  google_analytics: ["https://www.googleapis.com/auth/analytics.readonly"],
  google_business_profile: ["https://www.googleapis.com/auth/business.manage"],
  youtube: ["https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/yt-analytics.readonly"],
};

const placeholderPattern = /replace-with|your-|example|placeholder|localhost-placeholder|todo|changeme|dummy|sample/i;
const secretLeakPattern = /(ya29\.|GOCSPX-|refresh-token|client-secret|super-secret|private_key|BEGIN PRIVATE KEY)/i;

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function envValue(env: NodeJS.ProcessEnv, key: string) {
  return env[key]?.trim() ?? "";
}

export function classifySecretConfig(key: string, value: string | undefined): SecretConfigClassification {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) return "missing";
  if (placeholderPattern.test(trimmed)) return "placeholder";
  if (key.endsWith("_URL")) {
    try {
      const url = new URL(trimmed);
      return url.protocol === "https:" || url.protocol === "http:" ? "configured" : "malformed";
    } catch {
      return "malformed";
    }
  }
  if (key === "GOOGLE_ANALYTICS_PROPERTY_ID" && !/^\d+$/.test(trimmed)) return "malformed";

  return "configured";
}

function safeLabelForKey(key: string) {
  if (key.includes("SECRET") || key.includes("TOKEN")) return "secret configured by environment";
  if (key.includes("CLIENT_ID")) return "OAuth client id configured by environment";
  if (key.includes("LOCATION_ID")) return "GBP location id configured by environment";
  if (key.includes("PROPERTY_ID")) return "GA4 property id configured by environment";
  if (key.includes("CHANNEL_ID")) return "YouTube channel id configured by environment";
  if (key.includes("SITE_URL")) return "Search Console site URL configured by environment";

  return "configuration key";
}

function credentialMessage(classification: SecretConfigClassification, key: string) {
  if (classification === "configured") return `${key} is present and passed local shape checks.`;
  if (classification === "placeholder") return `${key} looks like a placeholder and cannot be treated as configured.`;
  if (classification === "malformed") return `${key} is present but does not match the expected local shape.`;
  if (classification === "unknown") return `${key} could not be verified locally.`;

  return `${key} is missing.`;
}

function createCredentialChecks(connectorId: (typeof googleConnectorIds)[number], env: NodeJS.ProcessEnv): ConnectorCredentialCheck[] {
  return requiredEnvByConnector[connectorId].map((key) => {
    const classification = classifySecretConfig(key, envValue(env, key));

    return {
      key,
      required: true,
      classification,
      safeLabel: safeLabelForKey(key),
      message: credentialMessage(classification, key),
    };
  });
}

function grantedScopeEvidence(env: NodeJS.ProcessEnv) {
  return uniqueSorted(
    `${envValue(env, "GOOGLE_OAUTH_GRANTED_SCOPES")} ${envValue(env, "GOOGLE_GRANTED_SCOPES")}`
      .split(/[\s,]+/)
      .map((scope) => scope.trim())
      .filter(Boolean),
  );
}

function createScopeChecks(connectorId: (typeof googleConnectorIds)[number], env: NodeJS.ProcessEnv): ConnectorScopeCheck[] {
  const localEvidence = new Set(grantedScopeEvidence(env));

  return requiredScopesByConnector[connectorId].map((scope) => {
    const hasEvidence = localEvidence.has(scope);
    const hasAnyEvidence = localEvidence.size > 0;

    return {
      scope,
      required: true,
      status: hasEvidence ? "valid" : hasAnyEvidence ? "missing" : "unknown",
      evidenceSource: hasEvidence ? "local_grant_evidence" : hasAnyEvidence ? "local_grant_evidence" : "not_available",
      message: hasEvidence
        ? "Required scope appears in local granted-scope evidence."
        : hasAnyEvidence
          ? "Required scope is absent from local granted-scope evidence."
          : "No local granted-scope evidence is configured; scope cannot be verified without a future approved provider check.",
    };
  });
}

function nextSafeAction(input: {
  gateRecord: ConnectorActivationGateRecord;
  missingConfig: string[];
  missingScopes: string[];
}) {
  if (input.missingConfig.length > 0) return `Add or correct local config for: ${input.missingConfig.join(", ")}.`;
  if (input.missingScopes.length > 0) return `Regenerate OAuth consent later with approved read-only scopes: ${input.missingScopes.join(", ")}.`;

  return input.gateRecord.nextSafeAction;
}

function connectorById(connectors: EnterpriseConnector[]) {
  return new Map(connectors.map((connector) => [connector.connectorId, connector]));
}

function createChecklistItem(input: {
  gateRecord: ConnectorActivationGateRecord;
  connector: EnterpriseConnector;
  env: NodeJS.ProcessEnv;
}): ConnectorVerificationChecklistItem {
  const connectorId = input.connector.connectorId as (typeof googleConnectorIds)[number];
  const credentialChecks = createCredentialChecks(connectorId, input.env);
  const scopeChecks = createScopeChecks(connectorId, input.env);
  const missingConfig = credentialChecks
    .filter((check) => check.classification !== "configured")
    .map((check) => check.key);
  const missingScopes = scopeChecks
    .filter((check) => check.status !== "valid")
    .map((check) => check.scope);

  return {
    connectorId,
    connector: input.connector.displayName,
    readinessStatus: input.gateRecord.healthStatus,
    gateMode: input.gateRecord.mode,
    credentialChecks,
    scopeChecks,
    missingConfig,
    missingScopes,
    affectedDepartments: input.gateRecord.affectedDepartments,
    affectedEmployees: input.gateRecord.affectedEmployees,
    nextSafeAction: nextSafeAction({ gateRecord: input.gateRecord, missingConfig, missingScopes }),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createConnectorCredentialScopeVerificationFromInputs(
  input: ConnectorCredentialScopeVerificationInputs,
): ConnectorCredentialScopeVerificationReport {
  assertConnectorActivationGateSafety(input.gate);

  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const connectors = connectorById(input.connectors ?? listEnterpriseConnectors());
  const checklist = input.gate.records
    .filter((record) => googleConnectorIds.includes(record.connectorId as never))
    .map((gateRecord) => {
      const connector = connectors.get(gateRecord.connectorId);
      if (!connector) return null;

      return createChecklistItem({ gateRecord, connector, env: input.env ?? process.env });
    })
    .filter((item): item is ConnectorVerificationChecklistItem => Boolean(item));
  const allCredentialChecks = checklist.flatMap((item) => item.credentialChecks);
  const allScopeChecks = checklist.flatMap((item) => item.scopeChecks);

  return {
    ok: true,
    company: "J Capital Property Group",
    generatedAt,
    mode: "local_config_only",
    summary: {
      connectors: checklist.length,
      configuredCredentialChecks: allCredentialChecks.filter((check) => check.classification === "configured").length,
      missingCredentialChecks: allCredentialChecks.filter((check) => check.classification === "missing").length,
      placeholderCredentialChecks: allCredentialChecks.filter((check) => check.classification === "placeholder").length,
      malformedCredentialChecks: allCredentialChecks.filter((check) => check.classification === "malformed").length,
      validScopeChecks: allScopeChecks.filter((check) => check.status === "valid").length,
      missingScopeChecks: allScopeChecks.filter((check) => check.status === "missing").length,
      unknownScopeChecks: allScopeChecks.filter((check) => check.status === "unknown").length,
    },
    checklist,
    safety: {
      readOnly: true,
      localOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      oauthStarted: false,
      credentialsChanged: false,
      rawSecretValuesExposed: false,
      externalProviderWritesAllowed: false,
      level4Unlocked: false,
      level5Unlocked: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function createConnectorCredentialScopeVerification(): Promise<ConnectorCredentialScopeVerificationReport> {
  const gate = await createConnectorActivationGate();

  return createConnectorCredentialScopeVerificationFromInputs({ gate });
}

export function assertConnectorCredentialScopeVerificationSafety(report: ConnectorCredentialScopeVerificationReport) {
  const serialized = JSON.stringify(report);
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.oauthStarted,
    report.safety.credentialsChanged,
    report.safety.rawSecretValuesExposed,
    report.safety.externalProviderWritesAllowed,
    report.safety.level4Unlocked,
    report.safety.level5Unlocked,
    report.checklist.some((item) => item.providerCalled || item.liveExecutionAllowed),
    secretLeakPattern.test(serialized),
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Connector credential/scope verification safety contract failed.");
  }

  return true;
}
