import { prisma } from "@/lib/prisma";
import { getEnterpriseConnector } from "@/lib/connector-platform";
import { isFeatureEnabled } from "@/lib/feature-flags";
import {
  createUniversalConnectorManifest,
  evaluateUeipGatewayRequest,
  type UniversalConnectorManifest,
  type UeipPolicyDecision,
} from "@/lib/universal-enterprise-integration-platform";
import {
  executeSearchConsoleRead,
  implementedSearchConsoleCapabilities,
  searchConsoleCapabilities,
  UeipSearchConsoleAdapterError,
  type SearchConsoleAdapterInput,
  type SearchConsoleCredential,
  type SearchConsoleNormalizedResult,
} from "@/lib/ueip-search-console-adapter";

export type UeipTrustedEnvironment = "development" | "preview" | "production";
export type UeipExecutionContext = Readonly<{
  traceId: string;
  tenantId: string;
  actorId: string;
  aiEmployee?: string;
  businessModule: string;
  environment: UeipTrustedEnvironment;
  requestOrigin: "authenticated_admin" | "system_cron" | "test";
  requestedAt: string;
}>;

export type UeipCapabilityRequest = Readonly<{
  connectorId: "google_search_console";
  capabilityKey: (typeof searchConsoleCapabilities)[number];
  capabilityVersion: "1.0.0";
  parameters: Omit<SearchConsoleAdapterInput, "capability">;
  freshnessSeconds: number;
  idempotencyKey: string;
}>;

type InstallationRecord = {
  id: string;
  tenantId: string;
  connectorId: string;
  installationState: string;
  configurationState: string;
  authenticationState: string;
  sandboxMode: boolean;
  enabled: boolean;
  enableApprovalStatus: string;
  credentialReferenceId: string | null;
  requiredScopes: unknown;
  grantedScopes: unknown;
  permissionValidation: unknown;
};

type CredentialReferenceRecord = {
  id: string;
  tenantId: string;
  connectorId: string;
  referenceKey: string;
  secretStorageProvider: string;
  rawSecretStored: boolean;
  rawSecretRendered: boolean;
  expiresAt: Date | null;
};

type GatewayDb = {
  connectorInstallationState: { findUnique(args: unknown): Promise<InstallationRecord | null> };
  connectorCredentialReference: { findFirst(args: unknown): Promise<CredentialReferenceRecord | null> };
  ueipGatewayAuditEvent: { create(args: unknown): Promise<{ id: string }>; findMany?(args: unknown): Promise<Array<Record<string, unknown>>>; findFirst?(args: unknown): Promise<Record<string, unknown> | null> };
  enterpriseConnectorHealthEvent: { create(args: unknown): Promise<unknown>; findMany?(args: unknown): Promise<Array<Record<string, unknown>>> };
};

export type UeipGatewayResult =
  | {
      ok: true;
      traceId: string;
      policy: UeipPolicyDecision;
      result: SearchConsoleNormalizedResult;
      auditStatus: "complete";
      providerAttempted: boolean;
      providerCalled: boolean;
      healthStatus: "healthy";
      liveExecutionAllowed: false;
    }
  | {
      ok: false;
      traceId: string;
      policy: UeipPolicyDecision | null;
      errorCode: string;
      message: string;
      dataGaps: string[];
      auditStatus: "complete" | "failed";
      providerAttempted: boolean;
      providerCalled: boolean;
      healthStatus: "blocked" | "degraded" | "unavailable" | "rate_limited";
      liveExecutionAllowed: false;
    };

const POLICY_VERSION = "ueip-runtime-policy-v1";
const REQUIRED_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const SECRET_FIELD_PATTERN = /(secret|token|password|credential|authorization|cookie|session|api[_-]?key|raw|payload|headers?)/i;
const circuitByInstallation = new Map<string, { failures: number; openUntil: number }>();
const rateByTenant = new Map<string, { windowStarted: number; count: number }>();
const resultCache = new Map<string, { expiresAt: number; result: UeipGatewayResult }>();
const inFlight = new Map<string, Promise<UeipGatewayResult>>();

let gatewayDb = prisma as unknown as GatewayDb;
let gatewayFetcher: typeof fetch = fetch;
let trustedEnvironmentOverride: UeipTrustedEnvironment | null = null;

export function setUeipRuntimeDependenciesForTest(input: { db?: GatewayDb; fetcher?: typeof fetch; environment?: UeipTrustedEnvironment }) {
  if (input.db) gatewayDb = input.db;
  if (input.fetcher) gatewayFetcher = input.fetcher;
  if (input.environment) trustedEnvironmentOverride = input.environment;
  return () => {
    gatewayDb = prisma as unknown as GatewayDb;
    gatewayFetcher = fetch;
    trustedEnvironmentOverride = null;
    circuitByInstallation.clear();
    rateByTenant.clear();
    resultCache.clear();
    inFlight.clear();
  };
}

export function getTrustedUeipEnvironment(env: NodeJS.ProcessEnv = process.env): UeipTrustedEnvironment {
  if (env.VERCEL_ENV === "preview") return "preview";
  if (env.VERCEL_ENV === "production" || env.NODE_ENV === "production") return "production";
  return "development";
}

export function createUeipExecutionContext(input: {
  tenantId: string;
  actorId: string;
  aiEmployee?: string;
  businessModule: string;
  requestOrigin: UeipExecutionContext["requestOrigin"];
  now?: Date;
}): UeipExecutionContext {
  return Object.freeze({
    traceId: crypto.randomUUID(),
    tenantId: input.tenantId,
    actorId: input.actorId,
    aiEmployee: input.aiEmployee,
    businessModule: input.businessModule,
    environment: trustedEnvironmentOverride ?? getTrustedUeipEnvironment(),
    requestOrigin: input.requestOrigin,
    requestedAt: (input.now ?? new Date()).toISOString(),
  });
}

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([key]) => !SECRET_FIELD_PATTERN.test(key)).map(([key, item]) => [key, sanitize(item)]));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function searchConsoleManifest(tenantId: string): UniversalConnectorManifest | null {
  const connector = getEnterpriseConnector("google_search_console");
  if (!connector) return null;
  const base = createUniversalConnectorManifest(connector, { supportedTenantIds: [tenantId], compatibleBusinessModules: ["ai_core", "real_estate"] });
  return {
    ...base,
    lifecycleState: "read_only",
    capabilities: implementedSearchConsoleCapabilities.map((capabilityKey) => ({
      capabilityKey,
      providerActionKey: capabilityKey,
      operation: "read" as const,
      risk: "low" as const,
      requiredScopes: [REQUIRED_SCOPE],
      approvalPolicy: "none" as const,
      dataClassification: "internal" as const,
      liveExecutionAllowed: false as const,
    })),
  };
}

async function appendAudit(input: {
  context: UeipExecutionContext;
  request: UeipCapabilityRequest;
  installationId?: string | null;
  stage: string;
  decision: string;
  reasonCodes: string[];
  attemptNumber?: number;
  endpointId?: string;
  latencyMs?: number;
  providerAttempted?: boolean;
  providerCalled?: boolean;
  safeMetadata?: Record<string, unknown>;
}) {
  const previous = gatewayDb.ueipGatewayAuditEvent.findFirst
    ? await gatewayDb.ueipGatewayAuditEvent.findFirst({ where: { traceId: input.context.traceId }, orderBy: { sequenceNumber: "desc" }, select: { sequenceNumber: true, eventDigest: true } })
    : null;
  const sequenceNumber = typeof previous?.sequenceNumber === "number" ? previous.sequenceNumber + 1 : 1;
  const previousEventDigest = typeof previous?.eventDigest === "string" ? previous.eventDigest : null;
  const safeMetadata = sanitize(input.safeMetadata ?? {});
  const eventDigest = await sha256(JSON.stringify({ traceId: input.context.traceId, sequenceNumber, previousEventDigest, stage: input.stage, decision: input.decision, reasonCodes: input.reasonCodes, providerCalled: input.providerCalled ?? false, safeMetadata }));
  return gatewayDb.ueipGatewayAuditEvent.create({
    data: {
      traceId: input.context.traceId,
      tenantId: input.context.tenantId,
      installationId: input.installationId ?? null,
      connectorId: input.request.connectorId,
      capabilityKey: input.request.capabilityKey,
      manifestVersion: "ueip-connector-manifest-v1",
      policyVersion: POLICY_VERSION,
      actorId: input.context.actorId,
      environment: input.context.environment,
      stage: input.stage,
      decision: input.decision,
      attemptNumber: input.attemptNumber ?? 0,
      endpointId: input.endpointId ?? null,
      latencyMs: input.latencyMs ?? null,
      providerAttempted: input.providerAttempted ?? false,
      providerCalled: input.providerCalled ?? false,
      auditComplete: true,
      reasonCodes: input.reasonCodes,
      safeMetadata,
      sequenceNumber,
      previousEventDigest,
      eventDigest,
    },
  });
}

function blockedPolicy(context: UeipExecutionContext, request: UeipCapabilityRequest, reasonCode: string): UeipPolicyDecision {
  return {
    decision: "blocked",
    reasonCodes: [reasonCode],
    connectorId: request.connectorId,
    capabilityKey: request.capabilityKey,
    tenantId: context.tenantId,
    approvalId: null,
    manifestVersion: "ueip-connector-manifest-v1",
    policyVersion: POLICY_VERSION,
    capabilityVersion: request.capabilityVersion,
    installationId: null,
    scopeDecision: reasonCode === "credential_scope_insufficient" ? "insufficient" : "not_evaluated",
    lifecycleDecision: reasonCode === "installation_not_ready" ? "blocked" : "not_evaluated",
    auditRequired: true,
    traceRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function failure(input: {
  context: UeipExecutionContext;
  policy?: UeipPolicyDecision | null;
  code: string;
  message: string;
  auditStatus?: "complete" | "failed";
  providerAttempted?: boolean;
  providerCalled?: boolean;
  healthStatus?: "blocked" | "degraded" | "unavailable" | "rate_limited";
}): UeipGatewayResult {
  return {
    ok: false,
    traceId: input.context.traceId,
    policy: input.policy ?? null,
    errorCode: input.code,
    message: input.message,
    dataGaps: [input.message],
    auditStatus: input.auditStatus ?? "complete",
    providerAttempted: input.providerAttempted ?? false,
    providerCalled: input.providerCalled ?? false,
    healthStatus: input.healthStatus ?? "blocked",
    liveExecutionAllowed: false,
  };
}

function brokerCredential(reference: CredentialReferenceRecord, env: NodeJS.ProcessEnv): SearchConsoleCredential | null {
  if (reference.connectorId !== "google_search_console" || reference.secretStorageProvider !== "environment") return null;
  if (reference.rawSecretStored || reference.rawSecretRendered || (reference.expiresAt && reference.expiresAt.getTime() <= Date.now())) return null;
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const refreshToken = env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim();
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken } : null;
}

function rateAllowed(tenantId: string, now = Date.now()) {
  const existing = rateByTenant.get(tenantId);
  if (!existing || now - existing.windowStarted >= 60_000) {
    rateByTenant.set(tenantId, { windowStarted: now, count: 1 });
    return true;
  }
  if (existing.count >= 20) return false;
  existing.count += 1;
  return true;
}

function fixtureResult(request: UeipCapabilityRequest, now = new Date()): SearchConsoleNormalizedResult {
  return {
    contractVersion: "ueip-search-console-result-v1",
    capability: request.capabilityKey,
    sourceLabel: "ueip:search_console:development_fixture",
    provenance: "Deterministic development fixture; no provider was called.",
    observationWindow: request.parameters.startDate && request.parameters.endDate ? { startDate: request.parameters.startDate, endDate: request.parameters.endDate } : null,
    freshness: now.toISOString(),
    confidence: 20,
    signals: request.capabilityKey === "seo.indexing.summary.read" ? { verdict: "fixture" } : { [request.capabilityKey === "seo.query.performance.read" ? "queries" : "pages"]: [], clicks: 0, impressions: 0 },
    dataGaps: ["Development fixture only; verify against governed Preview data before business use."],
    reliability: { status: "partial", latencyMs: 0, attempts: 0, quotaRemaining: null },
  };
}

async function executeGateway(context: UeipExecutionContext, request: UeipCapabilityRequest, env: NodeJS.ProcessEnv): Promise<UeipGatewayResult> {
  const installation = await gatewayDb.connectorInstallationState.findUnique({ where: { tenantId_connectorId: { tenantId: context.tenantId, connectorId: request.connectorId } } });
  if (!installation || installation.tenantId !== context.tenantId) {
    const policy = blockedPolicy(context, request, "installation_not_found");
    try { await appendAudit({ context, request, stage: "blocked", decision: "blocked", reasonCodes: policy.reasonCodes }); } catch { return failure({ context, policy, code: "audit_unavailable", message: "Gateway audit is unavailable; provider access was blocked.", auditStatus: "failed" }); }
    return failure({ context, policy, code: "installation_not_found", message: "Tenant connector installation is not available." });
  }

  const permission = asRecord(installation.permissionValidation);
  const authorizedSites = asStrings(permission.authorizedSiteUrls);
  const circuit = circuitByInstallation.get(installation.id);
  const grantedScopes = asStrings(installation.grantedScopes);
  const installationReady = installation.enabled && installation.installationState === "enabled" && installation.configurationState === "configured" && installation.authenticationState === "authenticated" && installation.enableApprovalStatus === "approved";
  const siteAuthorized = authorizedSites.includes(request.parameters.siteUrl);
  const flagsReady = isFeatureEnabled("ueip_gateway_enforcement") && isFeatureEnabled("ueip_search_console_runtime") && !isFeatureEnabled("ueip_search_console_rollback");
  const manifest = searchConsoleManifest(context.tenantId);

  let preflightReason: string | null = null;
  if (!installationReady) preflightReason = "installation_not_ready";
  else if (!siteAuthorized) preflightReason = "site_not_authorized";
  else if (circuit && circuit.openUntil > Date.now()) preflightReason = "circuit_open";
  else if (!rateAllowed(context.tenantId)) preflightReason = "tenant_rate_limited";
  else if (!flagsReady) preflightReason = "feature_flag_gate_closed";
  else if (context.environment === "production") preflightReason = "production_pilot_blocked";
  else if (!manifest) preflightReason = "connector_not_registered";

  let policy = preflightReason
    ? blockedPolicy(context, request, preflightReason)
    : evaluateUeipGatewayRequest({
        tenantId: context.tenantId,
        actorId: context.actorId,
        aiEmployee: context.aiEmployee,
        businessModule: context.businessModule,
        connectorId: request.connectorId,
        capabilityKey: request.capabilityKey,
        environment: context.environment,
        credentialScopes: grantedScopes,
        featureFlagsVerified: flagsReady,
        connectorHealth: circuit && circuit.openUntil > Date.now() ? "unavailable" : "healthy",
      }, { manifest: manifest ?? undefined });
  policy = {
    ...policy,
    policyVersion: POLICY_VERSION,
    capabilityVersion: request.capabilityVersion,
    installationId: installation.id,
    scopeDecision: policy.reasonCodes.includes("credential_scope_insufficient") ? "insufficient" : "sufficient",
    lifecycleDecision: installationReady ? "allowed" : "blocked",
  };

  if (policy.decision !== "allow_read_plan") {
    try { await appendAudit({ context, request, installationId: installation.id, stage: "blocked", decision: "blocked", reasonCodes: policy.reasonCodes }); } catch { return failure({ context, policy, code: "audit_unavailable", message: "Gateway audit is unavailable; provider access was blocked.", auditStatus: "failed" }); }
    return failure({ context, policy, code: policy.reasonCodes[0] ?? "policy_blocked", message: "UEIP policy blocked the provider read.", healthStatus: policy.reasonCodes.includes("tenant_rate_limited") ? "rate_limited" : "blocked" });
  }

  try {
    await appendAudit({ context, request, installationId: installation.id, stage: "preflight_allowed", decision: policy.decision, reasonCodes: policy.reasonCodes, safeMetadata: { capabilityVersion: request.capabilityVersion, requestOrigin: context.requestOrigin } });
  } catch {
    return failure({ context, policy, code: "audit_unavailable", message: "Preflight audit could not be persisted; provider access was blocked.", auditStatus: "failed" });
  }

  if (context.environment === "development") {
    const result = fixtureResult(request);
    try { await appendAudit({ context, request, installationId: installation.id, stage: "completed_fixture", decision: "completed", reasonCodes: ["development_fixture"], safeMetadata: { sourceLabel: result.sourceLabel } }); } catch { return failure({ context, policy, code: "completion_audit_failed", message: "Fixture result was quarantined because completion audit failed.", auditStatus: "failed" }); }
    return { ok: true, traceId: context.traceId, policy, result, auditStatus: "complete", providerAttempted: false, providerCalled: false, healthStatus: "healthy", liveExecutionAllowed: false };
  }

  if (!installation.credentialReferenceId) return failure({ context, policy, code: "credential_reference_missing", message: "Tenant credential reference is missing." });
  const reference = await gatewayDb.connectorCredentialReference.findFirst({ where: { id: installation.credentialReferenceId, tenantId: context.tenantId, connectorId: request.connectorId } });
  const credential = reference ? brokerCredential(reference, env) : null;
  if (!reference || reference.tenantId !== context.tenantId || !credential) {
    await appendAudit({ context, request, installationId: installation.id, stage: "credential_blocked", decision: "blocked", reasonCodes: ["credential_unavailable"] }).catch(() => undefined);
    return failure({ context, policy, code: "credential_unavailable", message: "Approved tenant credential material is unavailable." });
  }
  try {
    await appendAudit({ context, request, installationId: installation.id, stage: "credential_resolved", decision: "allowed", reasonCodes: ["credential_reference_verified"] });
    const result = await executeSearchConsoleRead({ request: { capability: request.capabilityKey, ...request.parameters }, credentials: credential, fetcher: gatewayFetcher });
    try {
      await appendAudit({ context, request, installationId: installation.id, stage: "completed", decision: "completed", reasonCodes: ["normalized_result_valid"], attemptNumber: result.reliability.attempts, endpointId: request.capabilityKey === "seo.indexing.summary.read" ? "url_inspection" : "search_analytics", latencyMs: result.reliability.latencyMs, providerAttempted: true, providerCalled: true, safeMetadata: { contractVersion: result.contractVersion, sourceLabel: result.sourceLabel, confidence: result.confidence } });
      await gatewayDb.enterpriseConnectorHealthEvent.create({ data: { tenantId: context.tenantId, connectorId: request.connectorId, healthStatus: "healthy", checkedAt: new Date(), latencyMs: result.reliability.latencyMs, circuitBreakerState: "closed", providerCalled: true, liveExecutionAllowed: false, safeMetadata: { traceId: context.traceId, capabilityKey: request.capabilityKey } } });
    } catch {
      circuitByInstallation.set(installation.id, { failures: 3, openUntil: Date.now() + 60_000 });
      return failure({ context, policy, code: "completion_audit_failed", message: "Provider result was quarantined because completion evidence could not be persisted.", auditStatus: "failed", providerAttempted: true, providerCalled: true, healthStatus: "degraded" });
    }
    circuitByInstallation.delete(installation.id);
    return { ok: true, traceId: context.traceId, policy, result, auditStatus: "complete", providerAttempted: true, providerCalled: true, healthStatus: "healthy", liveExecutionAllowed: false };
  } catch (error) {
    const adapterError = error instanceof UeipSearchConsoleAdapterError ? error : new UeipSearchConsoleAdapterError("provider_unavailable", "Provider read failed safely.", true);
    const current = circuitByInstallation.get(installation.id) ?? { failures: 0, openUntil: 0 };
    const failures = current.failures + 1;
    circuitByInstallation.set(installation.id, { failures, openUntil: failures >= 3 ? Date.now() + 60_000 : 0 });
    await appendAudit({ context, request, installationId: installation.id, stage: adapterError.category, decision: "failed", reasonCodes: [adapterError.category], attemptNumber: adapterError.attempts, providerAttempted: adapterError.providerAttempted, providerCalled: adapterError.providerAttempted }).catch(() => undefined);
    return failure({ context, policy, code: adapterError.category, message: adapterError.message, providerAttempted: adapterError.providerAttempted, providerCalled: adapterError.providerAttempted, healthStatus: adapterError.category === "quota" ? "rate_limited" : adapterError.category === "timeout" ? "degraded" : "unavailable" });
  }
}

export async function runUeipSearchConsoleGateway(input: { context: UeipExecutionContext; request: UeipCapabilityRequest; env?: NodeJS.ProcessEnv }): Promise<UeipGatewayResult> {
  const key = `${input.context.tenantId}:${input.request.idempotencyKey}`;
  const cached = resultCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.result;
  const existing = inFlight.get(key);
  if (existing) return existing;
  const promise = executeGateway(input.context, input.request, input.env ?? process.env).then((result) => {
    if (result.ok) resultCache.set(key, { expiresAt: Date.now() + Math.max(0, input.request.freshnessSeconds) * 1000, result });
    return result;
  }).finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

export async function getUeipSearchConsolePilotHealth(tenantId: string) {
  const attempts = gatewayDb.ueipGatewayAuditEvent.findMany
    ? await gatewayDb.ueipGatewayAuditEvent.findMany({ where: { tenantId, connectorId: "google_search_console" }, orderBy: { createdAt: "desc" }, take: 50, select: { traceId: true, capabilityKey: true, stage: true, decision: true, latencyMs: true, providerCalled: true, reasonCodes: true, sequenceNumber: true, previousEventDigest: true, eventDigest: true, safeMetadata: true, createdAt: true } })
    : [];
  const health = gatewayDb.enterpriseConnectorHealthEvent.findMany
    ? await gatewayDb.enterpriseConnectorHealthEvent.findMany({ where: { tenantId, connectorId: "google_search_console" }, orderBy: { checkedAt: "desc" }, take: 10, select: { healthStatus: true, latencyMs: true, rateLimitRemaining: true, circuitBreakerState: true, checkedAt: true, providerCalled: true } })
    : [];
  const completed = attempts.filter((attempt) => attempt.stage === "completed");
  const blocked = attempts.filter((attempt) => attempt.stage === "blocked");
  return {
    tenantId,
    connectorId: "google_search_console",
    sampleSize: attempts.length,
    completedAttempts: completed.length,
    blockedAttempts: blocked.length,
    auditCompleteness: attempts.length === 0 ? null : 100,
    averageProviderLatencyMs: completed.length === 0 ? null : Math.round(completed.reduce((sum, attempt) => sum + (typeof attempt.latencyMs === "number" ? attempt.latencyMs : 0), 0) / completed.length),
    recentAttempts: attempts,
    recentHealth: health,
    providerCalled: attempts.some((attempt) => attempt.providerCalled === true),
    liveExecutionAllowed: false,
    note: attempts.length === 0 ? "No pilot baseline is available; service targets remain uncommitted." : "Pilot observations are evidence only and do not authorize Production.",
  };
}
