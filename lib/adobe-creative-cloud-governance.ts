import { evaluateConnectorAction, getEnterpriseConnector } from "@/lib/connector-platform";

export type AdobeConnectorId = "adobe_express" | "adobe_firefly" | "adobe_creative_cloud_assets" | "adobe_acrobat";
export type AdobeReadinessState = "not_configured" | "preview_ready" | "credential_verified" | "provider_available" | "blocked";
export type AdobeActionIntent =
  | "prepare_adobe_express_brief"
  | "prepare_firefly_prompt"
  | "verify_firefly_credential"
  | "read_adobe_express_projects"
  | "read_adobe_asset_metadata"
  | "prepare_pdf_workflow"
  | "create_asset"
  | "publish_asset"
  | "paid_generation";

export type AdobeSafetyProof = {
  providerCalled: false;
  providerWrites: false;
  publishing: false;
  externalDelivery: false;
  paidActions: false;
  assetCreation: false;
  scraping: false;
  crmMutation: false;
  outreach: false;
  recurringAutomation: false;
  liveExecutionAllowed: false;
};

export type AdobeAuditEvent = {
  eventType: "adobe_governed_action_review";
  connectorId: AdobeConnectorId;
  actionIntent: AdobeActionIntent;
  decision: "internal_preparation_allowed" | "preview_probe_allowed" | "blocked";
  reasonCodes: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AdobeGovernanceReport = {
  ok: boolean;
  connectorFamily: "adobe_creative_cloud";
  environment: string | null;
  readinessState: AdobeReadinessState;
  connectors: Array<{
    connectorId: AdobeConnectorId;
    registered: boolean;
    healthStatus: string | null;
    lifecycleState: string | null;
    providerCalled: false;
    liveExecutionAllowed: false;
  }>;
  environmentContract: {
    requiredVariables: string[];
    optionalVariables: string[];
    presentVariables: string[];
    missingRequiredVariables: string[];
    unsafeVariables: string[];
    secretsExposed: false;
  };
  scopeVerification: {
    allowedScopes: string[];
    requiredScopes: string[];
    missingScopes: string[];
    approved: boolean;
  };
  previewCredentialProbe: {
    allowed: boolean;
    reasonCodes: string[];
    providerCalled: false;
    generationEndpointCalled: false;
    assetCreated: false;
    published: false;
    paidAction: false;
  };
  safetyProof: AdobeSafetyProof;
  auditEvents: AdobeAuditEvent[];
  classification: "ADOBE_GOVERNED_READINESS_READY" | "ADOBE_GOVERNED_READINESS_BLOCKED";
};

export type AdobeCredentialProbeResult = {
  ok: boolean;
  connectorFamily: "adobe_creative_cloud";
  environment: string | null;
  tokenEndpoint: "https://ims-na1.adobelogin.com/ims/token/v3";
  requestMethod: "POST";
  contentType: "application/x-www-form-urlencoded";
  credentialFlow: "oauth_server_to_server_client_credentials";
  preflight: {
    allowed: boolean;
    reasonCodes: string[];
    providerCalled: boolean;
    liveExecutionAllowed: false;
  };
  tokenVerification: {
    attempted: boolean;
    providerCalled: boolean;
    tokenReceived: boolean;
    tokenType: string | null;
    expiresInSeconds: number | null;
    tokenRedacted: "[REDACTED]" | null;
    statusCode: number | null;
    errorCode: string | null;
  };
  scopeVerification: AdobeGovernanceReport["scopeVerification"];
  safetyProof: AdobeSafetyProof & {
    credentialProviderCalled: boolean;
    generationEndpointCalled: false;
    expressEndpointCalled: false;
    assetEndpointCalled: false;
    acrobatEndpointCalled: false;
  };
  auditEvents: AdobeAuditEvent[];
  classification: "ADOBE_PREVIEW_CREDENTIAL_PROBE_VERIFIED" | "ADOBE_PREVIEW_CREDENTIAL_PROBE_BLOCKED";
};

type AdobeFetch = (
  url: string,
  init: {
    method: "POST";
    headers: { "Content-Type": "application/x-www-form-urlencoded" };
    body: URLSearchParams;
  },
) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}>;

const adobeConnectorIds: AdobeConnectorId[] = ["adobe_express", "adobe_firefly", "adobe_creative_cloud_assets", "adobe_acrobat"];
const requiredAdobeEnv = ["ADOBE_CLIENT_ID", "ADOBE_CLIENT_SECRET", "ADOBE_ORG_ID", "ADOBE_ALLOWED_SCOPES"] as const;
const optionalAdobeEnv = ["ADOBE_TECHNICAL_ACCOUNT_ID", "ADOBE_PRIVATE_KEY", "ADOBE_PROVIDER_CALLS_ALLOWED", "ADOBE_PUBLISHING_ALLOWED", "ADOBE_CREDENTIAL_VERIFIED", "ADOBE_PROVIDER_AVAILABLE"] as const;
const unsafeAdobeEnv = ["ADOBE_ACCESS_TOKEN", "ADOBE_REFRESH_TOKEN", "ADOBE_LIVE_EXECUTION_ALLOWED", "ADOBE_PUBLISHING_ALLOWED"];
const requiredPreviewScopes = ["adobe.express.brief.prepare", "adobe.firefly.prompt.prepare", "adobe.assets.metadata.read"];
const blockedActionIntents: AdobeActionIntent[] = ["create_asset", "publish_asset", "paid_generation"];
export const adobeTokenEndpoint = "https://ims-na1.adobelogin.com/ims/token/v3";

export const adobeSafetyProof: AdobeSafetyProof = {
  providerCalled: false,
  providerWrites: false,
  publishing: false,
  externalDelivery: false,
  paidActions: false,
  assetCreation: false,
  scraping: false,
  crmMutation: false,
  outreach: false,
  recurringAutomation: false,
  liveExecutionAllowed: false,
};

function present(name: string, env: NodeJS.ProcessEnv) {
  return typeof env[name] === "string" && env[name]!.trim().length > 0;
}

function parseScopes(value: string | undefined) {
  return (value ?? "")
    .split(/[,\s]+/)
    .map((scope) => scope.trim())
    .filter(Boolean)
    .sort();
}

function normalizeScopeParameter(value: string | undefined) {
  return parseScopes(value).join(",");
}

function unsafeVariables(env: NodeJS.ProcessEnv) {
  return unsafeAdobeEnv.filter((name) => {
    if (!present(name, env)) return false;
    if (name === "ADOBE_PUBLISHING_ALLOWED") return env[name]?.toLowerCase() === "true";
    if (name === "ADOBE_LIVE_EXECUTION_ALLOWED") return env[name]?.toLowerCase() === "true";
    return true;
  });
}

export function redactAdobeValue(name: string, value: string | undefined) {
  if (!value) return null;
  if (/SECRET|TOKEN|PRIVATE_KEY|PASSWORD|AUTHORIZATION/i.test(name)) return "[REDACTED]";
  if (value.length <= 8) return `${value.slice(0, 2)}...`;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export function createAdobeAuditEvent(input: {
  connectorId: AdobeConnectorId;
  actionIntent: AdobeActionIntent;
  decision: AdobeAuditEvent["decision"];
  reasonCodes: string[];
}): AdobeAuditEvent {
  return {
    eventType: "adobe_governed_action_review",
    connectorId: input.connectorId,
    actionIntent: input.actionIntent,
    decision: input.decision,
    reasonCodes: input.reasonCodes,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function evaluateAdobeAction(input: {
  connectorId: AdobeConnectorId;
  actionIntent: AdobeActionIntent;
  env?: NodeJS.ProcessEnv;
}): { allowed: boolean; auditEvent: AdobeAuditEvent; providerCalled: false; liveExecutionAllowed: false } {
  const env = input.env ?? process.env;
  const plan = evaluateConnectorAction({ connectorId: input.connectorId, actionKey: input.actionIntent, module: "AI Creative Growth Studio" });
  const reasonCodes: string[] = [];

  if (blockedActionIntents.includes(input.actionIntent)) reasonCodes.push("adobe_external_or_paid_action_blocked");
  if (env.VERCEL_ENV === "production") reasonCodes.push("production_adobe_execution_blocked");
  if (env.ADOBE_PROVIDER_CALLS_ALLOWED?.toLowerCase() === "true" && env.VERCEL_ENV !== "preview") reasonCodes.push("provider_calls_require_preview");
  if (env.ADOBE_PUBLISHING_ALLOWED?.toLowerCase() === "true") reasonCodes.push("adobe_publishing_forbidden_v1");
  if (plan.decision === "blocked" || plan.decision === "fallback_required") reasonCodes.push("connector_policy_blocked");

  const allowed = reasonCodes.length === 0 && plan.decision !== "blocked" && !blockedActionIntents.includes(input.actionIntent);
  return {
    allowed,
    auditEvent: createAdobeAuditEvent({
      connectorId: input.connectorId,
      actionIntent: input.actionIntent,
      decision: allowed ? "internal_preparation_allowed" : "blocked",
      reasonCodes: reasonCodes.length > 0 ? reasonCodes : ["internal_preparation_only"],
    }),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function assertAdobePreviewPilotNotDuplicate(runKey: string, existingRunKeys: string[]) {
  if (existingRunKeys.includes(runKey)) {
    return {
      ok: false,
      runKey,
      reason: "duplicate_adobe_preview_pilot_blocked",
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
    };
  }
  return {
    ok: true,
    runKey,
    reason: "single_use_adobe_preview_pilot_key_available",
    providerCalled: false as const,
    liveExecutionAllowed: false as const,
  };
}

export function createAdobeGovernanceReport(env: NodeJS.ProcessEnv = process.env): AdobeGovernanceReport {
  const environment = env.VERCEL_ENV ?? null;
  const presentVariables = [...requiredAdobeEnv, ...optionalAdobeEnv].filter((name) => present(name, env)).sort();
  const missingRequiredVariables = requiredAdobeEnv.filter((name) => !present(name, env));
  const unsafe = unsafeVariables(env);
  const allowedScopes = parseScopes(env.ADOBE_ALLOWED_SCOPES);
  const missingScopes = requiredPreviewScopes.filter((scope) => !allowedScopes.includes(scope));
  const production = environment === "production";
  const preview = environment === "preview";
  const providerCallsAllowed = env.ADOBE_PROVIDER_CALLS_ALLOWED?.toLowerCase() === "true";
  const credentialVerified = env.ADOBE_CREDENTIAL_VERIFIED?.toLowerCase() === "true";
  const providerAvailable = env.ADOBE_PROVIDER_AVAILABLE?.toLowerCase() === "true";
  const configured = missingRequiredVariables.length === 0;
  const scopesApproved = missingScopes.length === 0;
  const probeAllowed = preview && configured && scopesApproved && providerCallsAllowed && unsafe.length === 0;
  const reasonCodes = [
    ...(preview ? [] : ["preview_environment_required"]),
    ...(production ? ["production_environment_rejected"] : []),
    ...(configured ? [] : ["adobe_required_configuration_missing"]),
    ...(scopesApproved ? [] : ["adobe_scope_approval_incomplete"]),
    ...(providerCallsAllowed ? [] : ["adobe_provider_calls_disabled"]),
    ...unsafe.map((name) => `unsafe_adobe_env:${name}`),
  ];
  const readinessState: AdobeReadinessState = unsafe.length > 0 || production
    ? "blocked"
    : !configured
      ? "not_configured"
      : providerAvailable && credentialVerified && probeAllowed
        ? "provider_available"
        : credentialVerified && probeAllowed
          ? "credential_verified"
          : "preview_ready";
  const auditEvents = [
    createAdobeAuditEvent({
      connectorId: "adobe_firefly",
      actionIntent: "verify_firefly_credential",
      decision: probeAllowed ? "preview_probe_allowed" : "blocked",
      reasonCodes: reasonCodes.length > 0 ? reasonCodes : ["preview_probe_environment_contract_satisfied"],
    }),
  ];
  const ok = probeAllowed && (readinessState === "credential_verified" || readinessState === "provider_available");

  return {
    ok,
    connectorFamily: "adobe_creative_cloud",
    environment,
    readinessState,
    connectors: adobeConnectorIds.map((connectorId) => {
      const connector = getEnterpriseConnector(connectorId);
      return {
        connectorId,
        registered: Boolean(connector),
        healthStatus: connector?.healthStatus ?? null,
        lifecycleState: connector?.lifecycleState ?? null,
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }),
    environmentContract: {
      requiredVariables: [...requiredAdobeEnv],
      optionalVariables: [...optionalAdobeEnv],
      presentVariables,
      missingRequiredVariables,
      unsafeVariables: unsafe,
      secretsExposed: false,
    },
    scopeVerification: {
      allowedScopes,
      requiredScopes: requiredPreviewScopes,
      missingScopes,
      approved: scopesApproved,
    },
    previewCredentialProbe: {
      allowed: probeAllowed,
      reasonCodes: reasonCodes.length > 0 ? reasonCodes : ["preview_probe_environment_contract_satisfied"],
      providerCalled: false,
      generationEndpointCalled: false,
      assetCreated: false,
      published: false,
      paidAction: false,
    },
    safetyProof: adobeSafetyProof,
    auditEvents,
    classification: ok ? "ADOBE_GOVERNED_READINESS_READY" : "ADOBE_GOVERNED_READINESS_BLOCKED",
  };
}

export async function runAdobePreviewCredentialProbe(input: {
  env?: NodeJS.ProcessEnv;
  fetcher?: AdobeFetch;
} = {}): Promise<AdobeCredentialProbeResult> {
  const env = input.env ?? process.env;
  const fetcher = input.fetcher ?? (globalThis.fetch as unknown as AdobeFetch | undefined);
  const readiness = createAdobeGovernanceReport(env);
  const reasonCodes = [
    ...readiness.previewCredentialProbe.reasonCodes,
    ...(fetcher ? [] : ["fetch_unavailable"]),
  ].filter((reason, index, all) => all.indexOf(reason) === index);
  const preflightAllowed = readiness.previewCredentialProbe.allowed && Boolean(fetcher);
  const baseSafety: AdobeCredentialProbeResult["safetyProof"] = {
    ...adobeSafetyProof,
    credentialProviderCalled: false,
    generationEndpointCalled: false,
    expressEndpointCalled: false,
    assetEndpointCalled: false,
    acrobatEndpointCalled: false,
  };
  const blockedResult = (extraReasonCodes: string[] = []): AdobeCredentialProbeResult => ({
    ok: false,
    connectorFamily: "adobe_creative_cloud",
    environment: env.VERCEL_ENV ?? null,
    tokenEndpoint: adobeTokenEndpoint,
    requestMethod: "POST",
    contentType: "application/x-www-form-urlencoded",
    credentialFlow: "oauth_server_to_server_client_credentials",
    preflight: {
      allowed: false,
      reasonCodes: [...reasonCodes, ...extraReasonCodes].filter((reason, index, all) => all.indexOf(reason) === index),
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    tokenVerification: {
      attempted: false,
      providerCalled: false,
      tokenReceived: false,
      tokenType: null,
      expiresInSeconds: null,
      tokenRedacted: null,
      statusCode: null,
      errorCode: null,
    },
    scopeVerification: readiness.scopeVerification,
    safetyProof: baseSafety,
    auditEvents: [
      createAdobeAuditEvent({
        connectorId: "adobe_firefly",
        actionIntent: "verify_firefly_credential",
        decision: "blocked",
        reasonCodes: [...reasonCodes, ...extraReasonCodes].filter((reason, index, all) => all.indexOf(reason) === index),
      }),
    ],
    classification: "ADOBE_PREVIEW_CREDENTIAL_PROBE_BLOCKED",
  });

  if (!preflightAllowed || !fetcher) return blockedResult();

  const body = new URLSearchParams({
    client_id: env.ADOBE_CLIENT_ID!,
    client_secret: env.ADOBE_CLIENT_SECRET!,
    grant_type: "client_credentials",
    scope: normalizeScopeParameter(env.ADOBE_ALLOWED_SCOPES),
  });

  try {
    const response = await fetcher(adobeTokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const payload = await response.json().catch(async () => ({ error: await response.text().catch(() => "unparseable_adobe_response") }));
    const data = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    const tokenReceived = typeof data.access_token === "string" && data.access_token.length > 0;
    const tokenType = typeof data.token_type === "string" ? data.token_type : null;
    const expiresInSeconds = typeof data.expires_in === "number" ? data.expires_in : null;
    const errorCode = typeof data.error === "string" ? data.error : response.ok ? null : "adobe_token_request_failed";
    const ok = response.ok && tokenReceived;

    return {
      ok,
      connectorFamily: "adobe_creative_cloud",
      environment: env.VERCEL_ENV ?? null,
      tokenEndpoint: adobeTokenEndpoint,
      requestMethod: "POST",
      contentType: "application/x-www-form-urlencoded",
      credentialFlow: "oauth_server_to_server_client_credentials",
      preflight: {
        allowed: true,
        reasonCodes: ["preview_probe_environment_contract_satisfied"],
        providerCalled: true,
        liveExecutionAllowed: false,
      },
      tokenVerification: {
        attempted: true,
        providerCalled: true,
        tokenReceived,
        tokenType,
        expiresInSeconds,
        tokenRedacted: tokenReceived ? "[REDACTED]" : null,
        statusCode: response.status,
        errorCode,
      },
      scopeVerification: readiness.scopeVerification,
      safetyProof: {
        ...baseSafety,
        credentialProviderCalled: true,
      },
      auditEvents: [
        createAdobeAuditEvent({
          connectorId: "adobe_firefly",
          actionIntent: "verify_firefly_credential",
          decision: ok ? "preview_probe_allowed" : "blocked",
          reasonCodes: ok ? ["adobe_oauth_token_verified_without_generation"] : [errorCode ?? "adobe_token_missing"],
        }),
      ],
      classification: ok ? "ADOBE_PREVIEW_CREDENTIAL_PROBE_VERIFIED" : "ADOBE_PREVIEW_CREDENTIAL_PROBE_BLOCKED",
    };
  } catch {
    return {
      ...blockedResult(["adobe_token_request_error"]),
      preflight: {
        allowed: true,
        reasonCodes: ["preview_probe_environment_contract_satisfied"],
        providerCalled: true,
        liveExecutionAllowed: false,
      },
      tokenVerification: {
        attempted: true,
        providerCalled: true,
        tokenReceived: false,
        tokenType: null,
        expiresInSeconds: null,
        tokenRedacted: null,
        statusCode: null,
        errorCode: "adobe_token_request_error",
      },
      safetyProof: {
        ...baseSafety,
        credentialProviderCalled: true,
      },
    };
  }
}
