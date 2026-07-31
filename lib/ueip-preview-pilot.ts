import { prisma } from "@/lib/prisma";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { createUeipExecutionContext, getTrustedUeipEnvironment, getUeipGa4PilotHealth, getUeipGbpPilotHealth, getUeipSearchConsolePilotHealth, runUeipGa4Gateway, runUeipGbpGateway, runUeipSearchConsoleGateway } from "@/lib/ueip-runtime-gateway";

export const previewInstallConfirmation = "CONFIGURE_UEIP_SEARCH_CONSOLE_PREVIEW";
export const previewReadConfirmation = "RUN_UEIP_SEARCH_CONSOLE_PREVIEW_READ";
export const previewProbeConfirmation = "RUN_UEIP_SEARCH_CONSOLE_BLOCKED_PROBE";
export const previewAuthorizationConfirmation = "AUTHORIZE_UEIP_SEARCH_CONSOLE_PREVIEW_READ";
export const previewRollbackConfirmation = "ROLLBACK_UEIP_SEARCH_CONSOLE_PREVIEW";
export const ga4PreviewInstallConfirmation = "CONFIGURE_UEIP_GA4_PREVIEW";
export const ga4PreviewReadConfirmation = "RUN_UEIP_GA4_PREVIEW_READ";
export const ga4PreviewProbeConfirmation = "RUN_UEIP_GA4_BLOCKED_PROBE";
export const ga4PreviewAuthorizationConfirmation = "AUTHORIZE_UEIP_GA4_PREVIEW_READ";
export const ga4PreviewRollbackConfirmation = "ROLLBACK_UEIP_GA4_PREVIEW";
export const gbpPreviewInstallConfirmation = "CONFIGURE_UEIP_GBP_PREVIEW";
export const gbpPreviewReadConfirmation = "RUN_UEIP_GBP_PREVIEW_READ";
export const gbpPreviewProbeConfirmation = "RUN_UEIP_GBP_BLOCKED_PROBE";
export const gbpPreviewAuthorizationConfirmation = "AUTHORIZE_UEIP_GBP_PREVIEW_READ";
export const gbpPreviewRollbackConfirmation = "ROLLBACK_UEIP_GBP_PREVIEW";

const connectorId = "google_search_console";
const capabilityKey = "seo.page.performance.read";
const requiredScope = "https://www.googleapis.com/auth/webmasters.readonly";
const invalidProbeSite = "https://ueip-blocked-probe.invalid/";
const ga4ConnectorId = "google_analytics";
const ga4CapabilityKey = "analytics.page.performance.read";
const ga4RequiredScope = "https://www.googleapis.com/auth/analytics.readonly";
const invalidProbePropertyId = "999999999999";
const gbpConnectorId = "google_business_profile";
const gbpCapabilityKey = "gbp.performance.read";
const gbpRequiredScope = "https://www.googleapis.com/auth/business.manage";
const invalidProbeLocationName = "locations/ueip-blocked-probe";

type PilotDb = {
  $transaction<T>(callback: (tx: PilotDb) => Promise<T>): Promise<T>;
  ueipEnvironmentIdentity: {
    findUnique(args: unknown): Promise<Record<string, unknown> | null>;
    upsert(args: unknown): Promise<Record<string, unknown>>;
  };
  connectorCredentialReference: {
    upsert(args: unknown): Promise<Record<string, unknown>>;
    findFirst?(args: unknown): Promise<Record<string, unknown> | null>;
  };
  connectorInstallationState: {
    findUnique(args: unknown): Promise<Record<string, unknown> | null>;
    upsert(args: unknown): Promise<Record<string, unknown>>;
    update(args: unknown): Promise<Record<string, unknown>>;
  };
  ueipPilotAuthorization: {
    create(args: unknown): Promise<Record<string, unknown>>;
    findUnique(args: unknown): Promise<Record<string, unknown> | null>;
    update(args: unknown): Promise<Record<string, unknown>>;
    updateMany(args: unknown): Promise<{ count: number }>;
    findMany(args: unknown): Promise<Array<Record<string, unknown>>>;
  };
  ueipPilotControlEvent: {
    create(args: unknown): Promise<Record<string, unknown>>;
    findMany(args: unknown): Promise<Array<Record<string, unknown>>>;
  };
  businessDataSnapshot: { findMany(args: unknown): Promise<Array<Record<string, unknown>>> };
};

let pilotDb = prisma as unknown as PilotDb;

export function setUeipPreviewPilotDbForTest(db: PilotDb) {
  pilotDb = db;
  return () => { pilotDb = prisma as unknown as PilotDb; };
}

type Actor = { tenantId: string; actorId: string };

function safeEnvironment(env: NodeJS.ProcessEnv) {
  return {
    environmentId: env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() ?? "",
    previewFingerprint: env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() ?? "",
    productionFingerprint: env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() ?? "",
    siteUrl: env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() ?? "",
    oauthConfigured: Boolean(env.GOOGLE_OAUTH_CLIENT_ID?.trim() && env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() && env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()),
  };
}

function safeGa4Environment(env: NodeJS.ProcessEnv) {
  return {
    environmentId: env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() ?? "",
    previewFingerprint: env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() ?? "",
    productionFingerprint: env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() ?? "",
    propertyId: env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim() ?? "",
    oauthConfigured: Boolean(env.GOOGLE_OAUTH_CLIENT_ID?.trim() && env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() && env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()),
  };
}

function safeGbpEnvironment(env: NodeJS.ProcessEnv) {
  return {
    environmentId: env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() ?? "",
    previewFingerprint: env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() ?? "",
    productionFingerprint: env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() ?? "",
    locationName: env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID?.trim() ?? "",
    oauthConfigured: Boolean(env.GOOGLE_OAUTH_CLIENT_ID?.trim() && env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() && env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()),
  };
}

function previewGuard(env: NodeJS.ProcessEnv) {
  const config = safeEnvironment(env);
  const reasons: string[] = [];
  if (getTrustedUeipEnvironment(env) !== "preview") reasons.push("trusted_environment_not_preview");
  if (!config.environmentId) reasons.push("preview_environment_id_missing");
  if (!config.previewFingerprint) reasons.push("preview_database_fingerprint_missing");
  if (!config.productionFingerprint) reasons.push("production_database_fingerprint_missing");
  if (config.previewFingerprint && config.previewFingerprint === config.productionFingerprint) reasons.push("preview_database_not_isolated");
  if (!config.siteUrl) reasons.push("search_console_site_missing");
  if (!config.oauthConfigured) reasons.push("google_oauth_configuration_missing");
  return { ok: reasons.length === 0, reasons, config };
}

function ga4PreviewGuard(env: NodeJS.ProcessEnv) {
  const config = safeGa4Environment(env);
  const reasons: string[] = [];
  if (getTrustedUeipEnvironment(env) !== "preview") reasons.push("trusted_environment_not_preview");
  if (!config.environmentId) reasons.push("preview_environment_id_missing");
  if (!config.previewFingerprint) reasons.push("preview_database_fingerprint_missing");
  if (!config.productionFingerprint) reasons.push("production_database_fingerprint_missing");
  if (config.previewFingerprint && config.previewFingerprint === config.productionFingerprint) reasons.push("preview_database_not_isolated");
  if (!/^\d{4,30}$/.test(config.propertyId)) reasons.push("ga4_property_missing_or_invalid");
  if (!config.oauthConfigured) reasons.push("google_oauth_configuration_missing");
  return { ok: reasons.length === 0, reasons, config };
}

function gbpPreviewGuard(env: NodeJS.ProcessEnv) {
  const config = safeGbpEnvironment(env);
  const reasons: string[] = [];
  if (getTrustedUeipEnvironment(env) !== "preview") reasons.push("trusted_environment_not_preview");
  if (!config.environmentId) reasons.push("preview_environment_id_missing");
  if (!config.previewFingerprint) reasons.push("preview_database_fingerprint_missing");
  if (!config.productionFingerprint) reasons.push("production_database_fingerprint_missing");
  if (config.previewFingerprint && config.previewFingerprint === config.productionFingerprint) reasons.push("preview_database_not_isolated");
  if (!/^(?:locations\/)?[A-Za-z0-9_-]+$/.test(config.locationName)) reasons.push("gbp_location_missing_or_invalid");
  if (!config.oauthConfigured) reasons.push("google_oauth_configuration_missing");
  return { ok: reasons.length === 0, reasons, config };
}

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number, now: Date) {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - days);
  return dateOnly(date);
}

const forbiddenEvidenceKey = /(secret|token|password|authorization(?!Id|s)|cookie|api[_-]?key|raw[_-]?(payload|response)|secretPath)/i;

function evidenceIsRedacted(value: unknown): boolean {
  if (Array.isArray(value)) return value.every(evidenceIsRedacted);
  if (!value || typeof value !== "object") return true;
  return Object.entries(value as Record<string, unknown>).every(([key, item]) => !forbiddenEvidenceKey.test(key) && evidenceIsRedacted(item));
}

function verifyAuditChain(events: Array<Record<string, unknown>>) {
  const ordered = [...events].sort((a, b) => Number(a.sequenceNumber ?? 0) - Number(b.sequenceNumber ?? 0));
  if (ordered.length < 3) return false;
  return ordered.every((event, index) => {
    const sequenceNumber = Number(event.sequenceNumber);
    const previousSequenceNumber = Number(ordered[index - 1]?.sequenceNumber);
    return Number.isFinite(sequenceNumber) &&
      typeof event.eventDigest === "string" &&
      (index === 0 || (sequenceNumber === previousSequenceNumber + 1 && event.previousEventDigest === ordered[index - 1].eventDigest));
  });
}

async function controlEvent(db: PilotDb, actor: Actor, env: NodeJS.ProcessEnv, input: { connectorId?: string; eventType: string; decision: string; reasonCodes: string[]; safeMetadata?: Record<string, unknown>; providerCalled?: boolean }) {
  return db.ueipPilotControlEvent.create({ data: { tenantId: actor.tenantId, connectorId: input.connectorId ?? connectorId, eventType: input.eventType, actorId: actor.actorId, environment: getTrustedUeipEnvironment(env), decision: input.decision, reasonCodes: input.reasonCodes, safeMetadata: input.safeMetadata ?? {}, providerCalled: input.providerCalled ?? false, liveExecutionAllowed: false } });
}

export async function configureSearchConsolePreview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = previewGuard(env);
  if (input.confirmation !== previewInstallConfirmation) return { status: "blocked" as const, reasonCodes: ["confirmation_phrase_invalid"], providerCalled: false, liveExecutionAllowed: false };
  if (!guard.ok) return { status: "blocked" as const, reasonCodes: guard.reasons, providerCalled: false, liveExecutionAllowed: false };

  return pilotDb.$transaction(async (tx) => {
    const identity = await tx.ueipEnvironmentIdentity.upsert({
      where: { environmentId: guard.config.environmentId },
      create: { environmentId: guard.config.environmentId, environmentType: "preview", databaseFingerprint: guard.config.previewFingerprint, productionProhibited: true, verifiedBy: input.actor.actorId },
      update: { environmentType: "preview", databaseFingerprint: guard.config.previewFingerprint, productionProhibited: true, verifiedBy: input.actor.actorId, verifiedAt: new Date() },
    });
    if (identity.databaseFingerprint !== guard.config.previewFingerprint || identity.environmentType !== "preview" || identity.productionProhibited !== true) throw new Error("Preview environment identity verification failed.");
    const credential = await tx.connectorCredentialReference.upsert({
      where: { tenantId_referenceKey: { tenantId: input.actor.tenantId, referenceKey: "UEIP_SEARCH_CONSOLE_PREVIEW_ENVIRONMENT" } },
      create: { tenantId: input.actor.tenantId, connectorId, referenceKey: "UEIP_SEARCH_CONSOLE_PREVIEW_ENVIRONMENT", secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rotationStatus: "operator_managed", rawSecretStored: false, rawSecretRendered: false, createdBy: input.actor.actorId },
      update: { connectorId, secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rawSecretStored: false, rawSecretRendered: false },
    });
    const installation = await tx.connectorInstallationState.upsert({
      where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId } },
      create: { tenantId: input.actor.tenantId, connectorId, installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [requiredScope], grantedScopes: [requiredScope], permissionValidation: { authorizedSiteUrls: [guard.config.siteUrl], quotaPerMinute: 20, circuitState: "closed", previewOnly: true }, providerCalled: false, liveExecutionAllowed: false },
      update: { installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [requiredScope], grantedScopes: [requiredScope], permissionValidation: { authorizedSiteUrls: [guard.config.siteUrl], quotaPerMinute: 20, circuitState: "closed", previewOnly: true }, providerCalled: false, liveExecutionAllowed: false },
    });
    await controlEvent(tx, input.actor, env, { eventType: "preview_installation_configured", decision: "configured", reasonCodes: ["preview_identity_verified", "read_only_scope_pinned"], safeMetadata: { environmentId: guard.config.environmentId, installationId: installation.id, siteConfigured: true } });
    return { status: "ready" as const, environmentId: guard.config.environmentId, installationId: String(installation.id), credentialReferenceId: String(credential.id), providerCalled: false, liveExecutionAllowed: false };
  });
}

export async function authorizeSearchConsolePreview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const guard = previewGuard(env);
  if (input.confirmation !== previewAuthorizationConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== previewAuthorizationConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const readiness = await getSearchConsolePreviewReadiness({ actor: input.actor, env });
  if (readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const nonce = randomNonce();
  const nonceHash = await hash(nonce);
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60_000);
  const authorization = await pilotDb.ueipPilotAuthorization.create({ data: { tenantId: input.actor.tenantId, connectorId, capabilityKey, environment: "preview", approvingActorId: input.actor.actorId, nonceHash, status: "approved", maximumProviderCalls: 1, providerCallCount: 0, expiresAt } });
  await controlEvent(pilotDb, input.actor, env, { eventType: "preview_pilot_authorized", decision: "authorized", reasonCodes: ["single_use", "preview_only", "expires_in_10_minutes"], safeMetadata: { authorizationId: authorization.id, expiresAt: expiresAt.toISOString() } });
  return { status: "authorized" as const, authorizationId: String(authorization.id), nonce, expiresAt: expiresAt.toISOString(), maximumProviderCalls: 1, providerCalled: false, liveExecutionAllowed: false };
}

export async function getSearchConsolePreviewReadiness(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = previewGuard(env);
  if (!guard.ok) return { status: "blocked" as const, reasonCodes: guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const identity = await pilotDb.ueipEnvironmentIdentity.findUnique({ where: { environmentId: guard.config.environmentId } });
  const installation = await pilotDb.connectorInstallationState.findUnique({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId } } });
  const events = await pilotDb.ueipPilotControlEvent.findMany({ where: { tenantId: input.actor.tenantId, connectorId }, orderBy: { createdAt: "desc" }, take: 50 });
  const rollbackBlocked = events.some((event) => event.eventType === "rollback_drill_blocked" && event.decision === "passed");
  const rollbackRestored = events.some((event) => event.eventType === "rollback_drill_restored" && event.decision === "passed");
  const reasons: string[] = [];
  if (!identity || identity.databaseFingerprint !== guard.config.previewFingerprint || identity.environmentType !== "preview" || identity.productionProhibited !== true) reasons.push("preview_identity_not_verified");
  if (!installation || installation.tenantId !== input.actor.tenantId) reasons.push("installation_missing");
  if (installation && (!installation.enabled || installation.installationState !== "enabled" || installation.authenticationState !== "authenticated" || installation.enableApprovalStatus !== "approved")) reasons.push("installation_not_ready");
  if (!rollbackBlocked || !rollbackRestored) reasons.push("rollback_drill_incomplete");
  if (!isFeatureEnabled("ueip_gateway_enforcement") || !isFeatureEnabled("ueip_search_console_runtime") || isFeatureEnabled("ueip_search_console_rollback")) reasons.push("ueip_feature_flag_gate_closed");
  return { status: reasons.length === 0 ? "ready" as const : "blocked" as const, reasonCodes: reasons, environmentId: guard.config.environmentId, installationId: installation?.id ?? null, rollbackDrill: { blocked: rollbackBlocked, restored: rollbackRestored }, productionBlocked: true, providerCalled: false, liveExecutionAllowed: false };
}

export async function rollbackSearchConsolePreview(input: { actor: Actor; confirmation: string; action: "drill_disable" | "drill_restore" | "emergency_disable"; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = previewGuard(env);
  if (input.confirmation !== previewRollbackConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== previewRollbackConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const enabled = input.action === "drill_restore";
  const installation = await pilotDb.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId } }, data: { enabled, installationState: enabled ? "enabled" : "disabled", enableApprovalStatus: enabled ? "approved" : "suspended", providerCalled: false, liveExecutionAllowed: false } });
  const eventType = input.action === "drill_disable" ? "rollback_drill_blocked" : input.action === "drill_restore" ? "rollback_drill_restored" : "emergency_rollback";
  await controlEvent(pilotDb, input.actor, env, { eventType, decision: input.action === "emergency_disable" ? "rolled_back" : "passed", reasonCodes: [input.action], safeMetadata: { installationId: installation.id, enabled } });
  return { status: input.action === "emergency_disable" ? "rolled_back" as const : "ready" as const, action: input.action, enabled, providerCalled: false, liveExecutionAllowed: false };
}

export async function runSearchConsolePreviewPilot(input: { actor: Actor; confirmation: string; operation: "read" | "blocked_probe"; nonce?: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const guard = previewGuard(env);
  const expectedConfirmation = input.operation === "read" ? previewReadConfirmation : previewProbeConfirmation;
  if (input.confirmation !== expectedConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== expectedConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const now = input.now ?? new Date();
  let authorization: Record<string, unknown> | null = null;
  if (input.operation === "read") {
    if (!input.nonce) return { status: "blocked" as const, reasonCodes: ["authorization_nonce_missing"], providerCalled: false, liveExecutionAllowed: false };
    const nonceHash = await hash(input.nonce);
    authorization = await pilotDb.ueipPilotAuthorization.findUnique({ where: { nonceHash } });
    if (authorization?.consumedAt) return { status: "locked" as const, authorizationId: authorization.id, traceId: authorization.traceId ?? null, resultStatus: authorization.resultStatus ?? "locked", providerCalled: Number(authorization.providerCallCount ?? 0) > 0, liveExecutionAllowed: false };
    const consumed = await pilotDb.ueipPilotAuthorization.updateMany({ where: { nonceHash, tenantId: input.actor.tenantId, connectorId, capabilityKey, environment: "preview", status: "approved", consumedAt: null, expiresAt: { gt: now }, maximumProviderCalls: 1, providerCallCount: 0 }, data: { status: "consumed", consumedAt: now, lockedAt: now } });
    if (consumed.count !== 1) return { status: "blocked" as const, reasonCodes: ["authorization_invalid_expired_or_consumed"], providerCalled: false, liveExecutionAllowed: false };
  }

  const readiness = await getSearchConsolePreviewReadiness({ actor: input.actor, env });
  if (readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const siteUrl = input.operation === "blocked_probe" ? invalidProbeSite : guard.config.siteUrl;
  const context = createUeipExecutionContext({ tenantId: input.actor.tenantId, actorId: input.actor.actorId, businessModule: "ai_core", requestOrigin: "authenticated_admin", now });
  const endDate = daysAgo(3, now);
  const startDate = daysAgo(7, new Date(`${endDate}T00:00:00.000Z`));
  const result = await runUeipSearchConsoleGateway({ context, request: { connectorId, capabilityKey, capabilityVersion: "1.0.0", parameters: { siteUrl, startDate, endDate, rowLimit: 10 }, freshnessSeconds: 0, idempotencyKey: input.operation === "read" ? `preview-pilot:${authorization?.id}` : `blocked-probe:${context.traceId}` }, env });

  if (input.operation === "blocked_probe") {
    const passed = !result.ok && result.errorCode === "site_not_authorized" && !result.providerAttempted && !result.providerCalled;
    await controlEvent(pilotDb, input.actor, env, { eventType: "blocked_site_probe", decision: passed ? "passed" : "failed", reasonCodes: passed ? ["site_not_authorized", "no_provider_attempt"] : ["blocked_probe_invariant_failed"], safeMetadata: { traceId: result.traceId } });
    return { status: passed ? "completed" as const : "quarantined" as const, operation: input.operation, traceId: result.traceId, providerAttempted: result.providerAttempted, providerCalled: result.providerCalled, productionBlocked: true, liveExecutionAllowed: false };
  }

  const providerCallCount = result.providerCalled ? 1 : 0;
  const finalStatus = result.ok ? "completed" : result.providerCalled ? "quarantined" : "locked";
  await pilotDb.$transaction(async (tx) => {
    await tx.ueipPilotAuthorization.update({ where: { id: authorization!.id }, data: { status: finalStatus, providerCallCount, traceId: result.traceId, resultStatus: finalStatus, lockedAt: new Date() } });
    await tx.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId } }, data: { enabled: false, installationState: "disabled", enableApprovalStatus: "pilot_locked", providerCalled: result.providerCalled, liveExecutionAllowed: false } });
    await controlEvent(tx, input.actor, env, { eventType: "preview_pilot_locked", decision: finalStatus, reasonCodes: [result.ok ? "single_use_read_completed" : result.errorCode], safeMetadata: { authorizationId: authorization!.id, traceId: result.traceId, providerCallCount }, providerCalled: result.providerCalled });
  });
  return { status: finalStatus as "completed" | "quarantined" | "locked", operation: input.operation, authorizationId: authorization!.id, traceId: result.traceId, result: result.ok ? result.result : null, dataGaps: result.ok ? result.result.dataGaps : result.dataGaps, providerAttempted: result.providerAttempted, providerCalled: result.providerCalled, productionBlocked: true, liveExecutionAllowed: false };
}

export async function getSearchConsolePreviewCloseout(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const readiness = await getSearchConsolePreviewReadiness({ actor: input.actor, env });
  const authorizations = await pilotDb.ueipPilotAuthorization.findMany({ where: { tenantId: input.actor.tenantId, connectorId }, orderBy: { createdAt: "desc" }, take: 20 });
  const events = await pilotDb.ueipPilotControlEvent.findMany({ where: { tenantId: input.actor.tenantId, connectorId }, orderBy: { createdAt: "asc" }, take: 100 });
  const health = await getUeipSearchConsolePilotHealth(input.actor.tenantId);
  const successful = authorizations.find((authorization) => authorization.status === "completed" && authorization.providerCallCount === 1);
  const blockedProbe = events.find((event) => event.eventType === "blocked_site_probe" && event.decision === "passed");
  const providerCallCount = authorizations.reduce((sum, authorization) => sum + Number(authorization.providerCallCount ?? 0), 0);
  const successfulTraceEvents = successful?.traceId ? health.recentAttempts.filter((event) => event.traceId === successful.traceId) : [];
  const auditChainVerified = verifyAuditChain(successfulTraceEvents);
  const expectedStagesPresent = ["preflight_allowed", "credential_resolved", "completed"].every((stage) => successfulTraceEvents.some((event) => event.stage === stage));
  const secretScanPassed = evidenceIsRedacted({ authorizations, events, health });
  const certified = Boolean(successful && blockedProbe && providerCallCount === 1 && health.auditCompleteness === 100 && auditChainVerified && expectedStagesPresent && secretScanPassed);
  return { status: certified ? "preview_pilot_verified" as const : "pilot_incomplete" as const, readiness, providerCallCount, successfulTraceId: successful?.traceId ?? null, blockedProbeRecorded: Boolean(blockedProbe), auditChainVerified, expectedStagesPresent, secretScanPassed, health, productionBlocked: true, pilotLocked: authorizations.some((authorization) => authorization.lockedAt), providerCalled: providerCallCount > 0, liveExecutionAllowed: false };
}

export async function configureGa4Preview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = ga4PreviewGuard(env);
  if (input.confirmation !== ga4PreviewInstallConfirmation) return { status: "blocked" as const, reasonCodes: ["confirmation_phrase_invalid"], providerCalled: false, liveExecutionAllowed: false };
  if (!guard.ok) return { status: "blocked" as const, reasonCodes: guard.reasons, providerCalled: false, liveExecutionAllowed: false };

  return pilotDb.$transaction(async (tx) => {
    const identity = await tx.ueipEnvironmentIdentity.upsert({
      where: { environmentId: guard.config.environmentId },
      create: { environmentId: guard.config.environmentId, environmentType: "preview", databaseFingerprint: guard.config.previewFingerprint, productionProhibited: true, verifiedBy: input.actor.actorId },
      update: { environmentType: "preview", databaseFingerprint: guard.config.previewFingerprint, productionProhibited: true, verifiedBy: input.actor.actorId, verifiedAt: new Date() },
    });
    if (identity.databaseFingerprint !== guard.config.previewFingerprint || identity.environmentType !== "preview" || identity.productionProhibited !== true) throw new Error("Preview environment identity verification failed.");
    const credential = await tx.connectorCredentialReference.upsert({
      where: { tenantId_referenceKey: { tenantId: input.actor.tenantId, referenceKey: "UEIP_GA4_PREVIEW_ENVIRONMENT" } },
      create: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId, referenceKey: "UEIP_GA4_PREVIEW_ENVIRONMENT", secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rotationStatus: "operator_managed", rawSecretStored: false, rawSecretRendered: false, createdBy: input.actor.actorId },
      update: { connectorId: ga4ConnectorId, secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rawSecretStored: false, rawSecretRendered: false },
    });
    const installation = await tx.connectorInstallationState.upsert({
      where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId } },
      create: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId, installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [ga4RequiredScope], grantedScopes: [ga4RequiredScope], permissionValidation: { authorizedPropertyIds: [guard.config.propertyId], quotaPerMinute: 20, circuitState: "closed", previewOnly: true }, providerCalled: false, liveExecutionAllowed: false },
      update: { installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [ga4RequiredScope], grantedScopes: [ga4RequiredScope], permissionValidation: { authorizedPropertyIds: [guard.config.propertyId], quotaPerMinute: 20, circuitState: "closed", previewOnly: true }, providerCalled: false, liveExecutionAllowed: false },
    });
    await controlEvent(tx, input.actor, env, { connectorId: ga4ConnectorId, eventType: "preview_installation_configured", decision: "configured", reasonCodes: ["preview_identity_verified", "read_only_scope_pinned", "ga4_property_pinned"], safeMetadata: { environmentId: guard.config.environmentId, installationId: installation.id, propertyConfigured: true } });
    return { status: "ready" as const, environmentId: guard.config.environmentId, installationId: String(installation.id), credentialReferenceId: String(credential.id), propertyConfigured: true, providerCalled: false, liveExecutionAllowed: false };
  });
}

export async function getGa4PreviewReadiness(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = ga4PreviewGuard(env);
  if (!guard.ok) return { status: "blocked" as const, reasonCodes: guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const identity = await pilotDb.ueipEnvironmentIdentity.findUnique({ where: { environmentId: guard.config.environmentId } });
  const installation = await pilotDb.connectorInstallationState.findUnique({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId } } });
  const credential = installation?.credentialReferenceId && pilotDb.connectorCredentialReference.findFirst
    ? await pilotDb.connectorCredentialReference.findFirst({ where: { id: installation.credentialReferenceId, tenantId: input.actor.tenantId, connectorId: ga4ConnectorId } })
    : null;
  const events = await pilotDb.ueipPilotControlEvent.findMany({ where: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId }, orderBy: { createdAt: "desc" }, take: 50 });
  const rollbackBlocked = events.some((event) => event.eventType === "rollback_drill_blocked" && event.decision === "passed");
  const rollbackRestored = events.some((event) => event.eventType === "rollback_drill_restored" && event.decision === "passed");
  const grantedScopes = Array.isArray(installation?.grantedScopes) ? installation.grantedScopes.filter((scope): scope is string => typeof scope === "string") : [];
  const permission = installation?.permissionValidation && typeof installation.permissionValidation === "object" && !Array.isArray(installation.permissionValidation) ? installation.permissionValidation as Record<string, unknown> : {};
  const authorizedPropertyIds = Array.isArray(permission.authorizedPropertyIds) ? permission.authorizedPropertyIds.filter((id): id is string => typeof id === "string") : [];
  const credentialVerified = Boolean(credential && credential.tenantId === input.actor.tenantId && credential.connectorId === ga4ConnectorId && credential.secretStorageProvider === "environment" && credential.rawSecretStored !== true && credential.rawSecretRendered !== true);
  const reasons: string[] = [];
  if (!identity || identity.databaseFingerprint !== guard.config.previewFingerprint || identity.environmentType !== "preview" || identity.productionProhibited !== true) reasons.push("preview_identity_not_verified");
  if (!installation || installation.tenantId !== input.actor.tenantId) reasons.push("installation_missing");
  if (installation && (!installation.enabled || installation.installationState !== "enabled" || installation.authenticationState !== "authenticated" || installation.enableApprovalStatus !== "approved" || installation.sandboxMode !== true)) reasons.push("installation_not_ready");
  if (!credentialVerified) reasons.push("credential_reference_not_verified");
  if (!grantedScopes.includes(ga4RequiredScope)) reasons.push("analytics_readonly_scope_missing");
  if (!authorizedPropertyIds.includes(guard.config.propertyId)) reasons.push("ga4_property_not_authorized");
  if (!rollbackBlocked || !rollbackRestored) reasons.push("rollback_drill_incomplete");
  if (!isFeatureEnabled("ueip_gateway_enforcement") || !isFeatureEnabled("ueip_ga4_runtime")) reasons.push("ueip_feature_flag_gate_closed");
  return { status: reasons.length === 0 ? "ready" as const : "blocked" as const, reasonCodes: reasons, environmentId: guard.config.environmentId, installationId: installation?.id ?? null, credentialReferenceVerified: credentialVerified, scopeVerified: grantedScopes.includes(ga4RequiredScope), propertyAuthorized: authorizedPropertyIds.includes(guard.config.propertyId), rollbackDrill: { blocked: rollbackBlocked, restored: rollbackRestored }, productionBlocked: true, providerCalled: false, liveExecutionAllowed: false };
}

export async function rollbackGa4Preview(input: { actor: Actor; confirmation: string; action: "drill_disable" | "drill_restore" | "emergency_disable"; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = ga4PreviewGuard(env);
  if (input.confirmation !== ga4PreviewRollbackConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== ga4PreviewRollbackConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const enabled = input.action === "drill_restore";
  const installation = await pilotDb.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId } }, data: { enabled, installationState: enabled ? "enabled" : "disabled", enableApprovalStatus: enabled ? "approved" : "suspended", providerCalled: false, liveExecutionAllowed: false } });
  const eventType = input.action === "drill_disable" ? "rollback_drill_blocked" : input.action === "drill_restore" ? "rollback_drill_restored" : "emergency_rollback";
  await controlEvent(pilotDb, input.actor, env, { connectorId: ga4ConnectorId, eventType, decision: input.action === "emergency_disable" ? "rolled_back" : "passed", reasonCodes: [input.action], safeMetadata: { installationId: installation.id, enabled } });
  return { status: input.action === "emergency_disable" ? "rolled_back" as const : "ready" as const, action: input.action, enabled, providerCalled: false, liveExecutionAllowed: false };
}

export async function authorizeGa4Preview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const guard = ga4PreviewGuard(env);
  if (input.confirmation !== ga4PreviewAuthorizationConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== ga4PreviewAuthorizationConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const readiness = await getGa4PreviewReadiness({ actor: input.actor, env });
  if (readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const nonce = randomNonce();
  const nonceHash = await hash(nonce);
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60_000);
  const authorization = await pilotDb.ueipPilotAuthorization.create({ data: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId, capabilityKey: ga4CapabilityKey, environment: "preview", approvingActorId: input.actor.actorId, nonceHash, status: "approved", maximumProviderCalls: 1, providerCallCount: 0, expiresAt } });
  await controlEvent(pilotDb, input.actor, env, { connectorId: ga4ConnectorId, eventType: "preview_pilot_authorized", decision: "authorized", reasonCodes: ["single_use", "preview_only", "expires_in_10_minutes"], safeMetadata: { authorizationId: authorization.id, expiresAt: expiresAt.toISOString(), capabilityKey: ga4CapabilityKey } });
  return { status: "authorized" as const, authorizationId: String(authorization.id), nonce, expiresAt: expiresAt.toISOString(), maximumProviderCalls: 1, providerCalled: false, liveExecutionAllowed: false };
}

export async function runGa4PreviewPilot(input: { actor: Actor; confirmation: string; operation: "read" | "blocked_probe"; nonce?: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const guard = ga4PreviewGuard(env);
  const expectedConfirmation = input.operation === "read" ? ga4PreviewReadConfirmation : ga4PreviewProbeConfirmation;
  if (input.confirmation !== expectedConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== expectedConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const now = input.now ?? new Date();
  let authorization: Record<string, unknown> | null = null;
  if (input.operation === "read") {
    if (!input.nonce) return { status: "blocked" as const, reasonCodes: ["authorization_nonce_missing"], providerCalled: false, liveExecutionAllowed: false };
    const nonceHash = await hash(input.nonce);
    authorization = await pilotDb.ueipPilotAuthorization.findUnique({ where: { nonceHash } });
    if (authorization?.consumedAt) return { status: "locked" as const, authorizationId: authorization.id, traceId: authorization.traceId ?? null, resultStatus: authorization.resultStatus ?? "locked", providerCalled: Number(authorization.providerCallCount ?? 0) > 0, liveExecutionAllowed: false };
    const consumed = await pilotDb.ueipPilotAuthorization.updateMany({ where: { nonceHash, tenantId: input.actor.tenantId, connectorId: ga4ConnectorId, capabilityKey: ga4CapabilityKey, environment: "preview", status: "approved", consumedAt: null, expiresAt: { gt: now }, maximumProviderCalls: 1, providerCallCount: 0 }, data: { status: "consumed", consumedAt: now, lockedAt: now } });
    if (consumed.count !== 1) return { status: "blocked" as const, reasonCodes: ["authorization_invalid_expired_or_consumed"], providerCalled: false, liveExecutionAllowed: false };
  }

  const readiness = await getGa4PreviewReadiness({ actor: input.actor, env });
  if (readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const propertyId = input.operation === "blocked_probe" ? invalidProbePropertyId : guard.config.propertyId;
  const context = createUeipExecutionContext({ tenantId: input.actor.tenantId, actorId: input.actor.actorId, businessModule: "ai_core", requestOrigin: "authenticated_admin", now });
  const endDate = daysAgo(3, now);
  const startDate = daysAgo(7, new Date(`${endDate}T00:00:00.000Z`));
  const result = await runUeipGa4Gateway({ context, request: { connectorId: ga4ConnectorId, capabilityKey: ga4CapabilityKey, capabilityVersion: "1.0.0", parameters: { propertyId, startDate, endDate, rowLimit: 10 }, freshnessSeconds: 0, idempotencyKey: input.operation === "read" ? `ga4-preview-pilot:${authorization?.id}` : `ga4-blocked-probe:${context.traceId}` }, env });

  if (input.operation === "blocked_probe") {
    const passed = !result.ok && result.errorCode === "property_not_authorized" && !result.providerAttempted && !result.providerCalled;
    await controlEvent(pilotDb, input.actor, env, { connectorId: ga4ConnectorId, eventType: "blocked_property_probe", decision: passed ? "passed" : "failed", reasonCodes: passed ? ["property_not_authorized", "no_provider_attempt"] : ["blocked_probe_invariant_failed"], safeMetadata: { traceId: result.traceId } });
    return { status: passed ? "completed" as const : "quarantined" as const, operation: input.operation, traceId: result.traceId, providerAttempted: result.providerAttempted, providerCalled: result.providerCalled, productionBlocked: true, liveExecutionAllowed: false };
  }

  const providerCallCount = result.providerCalled ? 1 : 0;
  const finalStatus = result.ok ? "completed" : result.providerCalled ? "quarantined" : "locked";
  const evidenceHash = result.ok ? await hash(JSON.stringify(result.result)) : null;
  await pilotDb.$transaction(async (tx) => {
    await tx.ueipPilotAuthorization.update({ where: { id: authorization!.id }, data: { status: finalStatus, providerCallCount, traceId: result.traceId, resultStatus: finalStatus, lockedAt: new Date() } });
    await tx.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId } }, data: { enabled: false, installationState: "disabled", enableApprovalStatus: "pilot_locked", providerCalled: result.providerCalled, liveExecutionAllowed: false } });
    await controlEvent(tx, input.actor, env, { connectorId: ga4ConnectorId, eventType: "preview_pilot_locked", decision: finalStatus, reasonCodes: [result.ok ? "single_use_read_completed" : result.errorCode], safeMetadata: { authorizationId: authorization!.id, traceId: result.traceId, providerCallCount, evidenceHash, contractVersion: result.ok ? result.result.contractVersion : null }, providerCalled: result.providerCalled });
  });
  return { status: finalStatus as "completed" | "quarantined" | "locked", operation: input.operation, authorizationId: authorization!.id, traceId: result.traceId, evidenceHash, result: result.ok ? result.result : null, dataGaps: result.ok ? result.result.dataGaps : result.dataGaps, providerAttempted: result.providerAttempted, providerCalled: result.providerCalled, productionBlocked: true, liveExecutionAllowed: false };
}

export async function getGa4PreviewCloseout(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const readiness = await getGa4PreviewReadiness({ actor: input.actor, env });
  const authorizations = await pilotDb.ueipPilotAuthorization.findMany({ where: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId }, orderBy: { createdAt: "desc" }, take: 20 });
  const events = await pilotDb.ueipPilotControlEvent.findMany({ where: { tenantId: input.actor.tenantId, connectorId: ga4ConnectorId }, orderBy: { createdAt: "asc" }, take: 100 });
  const health = await getUeipGa4PilotHealth(input.actor.tenantId);
  const successful = authorizations.find((authorization) => authorization.status === "completed" && authorization.providerCallCount === 1);
  const blockedProbe = events.find((event) => event.eventType === "blocked_property_probe" && event.decision === "passed");
  const providerCallCount = authorizations.reduce((sum, authorization) => sum + Number(authorization.providerCallCount ?? 0), 0);
  const successfulTraceEvents = successful?.traceId ? health.recentAttempts.filter((event) => event.traceId === successful.traceId) : [];
  const completedEvent = successfulTraceEvents.find((event) => event.stage === "completed");
  const auditChainVerified = verifyAuditChain(successfulTraceEvents);
  const expectedStagesPresent = ["preflight_allowed", "credential_resolved", "completed"].every((stage) => successfulTraceEvents.some((event) => event.stage === stage));
  const secretScanPassed = evidenceIsRedacted({ authorizations, events, health });
  const normalizedContractVerified = completedEvent?.safeMetadata && typeof completedEvent.safeMetadata === "object" && (completedEvent.safeMetadata as Record<string, unknown>).contractVersion === "ueip-ga4-result-v1";
  const dataGaps = [
    ...("reasonCodes" in readiness ? readiness.reasonCodes.map((reason) => `Readiness gap: ${reason}`) : []),
    ...(!successful ? ["No completed GA4 Preview read has been reviewed."] : []),
    ...(!blockedProbe ? ["Blocked GA4 property probe has not passed."] : []),
    ...(providerCallCount !== 1 ? [`GA4 provider call count must equal one; observed ${providerCallCount}.`] : []),
    ...(!auditChainVerified ? ["GA4 audit chain has not been verified."] : []),
    ...(!normalizedContractVerified ? ["GA4 normalized result contract has not been verified in completion evidence."] : []),
  ];
  const certified = Boolean(successful && blockedProbe && providerCallCount === 1 && health.auditCompleteness === 100 && auditChainVerified && expectedStagesPresent && secretScanPassed && normalizedContractVerified);
  return { status: certified ? "preview_pilot_verified" as const : "pilot_incomplete" as const, readiness, providerCallCount, successfulTraceId: successful?.traceId ?? null, evidenceHash: completedEvent?.eventDigest ?? null, dataGaps, blockedProbeRecorded: Boolean(blockedProbe), auditChainVerified, expectedStagesPresent, secretScanPassed, normalizedContractVerified, health, productionBlocked: true, pilotLocked: authorizations.some((authorization) => authorization.lockedAt), providerCalled: providerCallCount > 0, liveExecutionAllowed: false, ceoApprovalRequired: true };
}

export async function getGa4PreviewOperationsPacket(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const readiness = await getGa4PreviewReadiness(input);
  const closeout = await getGa4PreviewCloseout(input);
  const steps = [
    { id: "preview_installation", label: "Preview installation", status: closeout.readiness.installationId ? "complete" : "blocked", confirmation: ga4PreviewInstallConfirmation },
    { id: "rollback_disable", label: "Rollback disable drill", status: closeout.readiness.rollbackDrill?.blocked ? "complete" : "blocked", confirmation: ga4PreviewRollbackConfirmation },
    { id: "rollback_restore", label: "Rollback restore drill", status: closeout.readiness.rollbackDrill?.restored ? "complete" : "blocked", confirmation: ga4PreviewRollbackConfirmation },
    { id: "authorization", label: "Single-use Preview authorization", status: readiness.status === "ready" ? "ready" : "blocked", confirmation: ga4PreviewAuthorizationConfirmation },
    { id: "blocked_probe", label: "Blocked property probe", status: closeout.blockedProbeRecorded ? "complete" : "blocked", confirmation: ga4PreviewProbeConfirmation },
    { id: "preview_read", label: "One governed Preview read", status: closeout.successfulTraceId ? "complete" : "blocked", confirmation: ga4PreviewReadConfirmation },
    { id: "closeout", label: "CEO closeout review", status: closeout.status === "preview_pilot_verified" ? "ready" : "blocked", confirmation: "CEO_REVIEW_REQUIRED" },
  ];
  return {
    packetVersion: "ga4-preview-operations-packet-v1",
    connectorId: ga4ConnectorId,
    generatedAt: new Date().toISOString(),
    readinessStatus: readiness.status,
    closeoutStatus: closeout.status,
    scopeVerified: "scopeVerified" in readiness ? readiness.scopeVerified : false,
    credentialReferenceVerified: "credentialReferenceVerified" in readiness ? readiness.credentialReferenceVerified : false,
    propertyAuthorized: "propertyAuthorized" in readiness ? readiness.propertyAuthorized : false,
    rollbackDrill: "rollbackDrill" in readiness ? readiness.rollbackDrill : { blocked: false, restored: false },
    authorizationStatus: readiness.status === "ready" ? "ready_for_single_use_nonce" : "blocked",
    pilotLocked: closeout.pilotLocked,
    evidenceHash: closeout.evidenceHash,
    traceId: closeout.successfulTraceId,
    dataGaps: closeout.dataGaps,
    steps,
    safetyFlags: { providerCalled: false, liveExecutionAllowed: false, crmMutated: false, published: false, outreachCreated: false, automationCreated: false },
    ceoApprovalRequired: true,
  };
}

export async function configureGbpPreview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = gbpPreviewGuard(env);
  if (input.confirmation !== gbpPreviewInstallConfirmation) return { status: "blocked" as const, reasonCodes: ["confirmation_phrase_invalid"], providerCalled: false, liveExecutionAllowed: false };
  if (!guard.ok) return { status: "blocked" as const, reasonCodes: guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  return pilotDb.$transaction(async (tx) => {
    const identity = await tx.ueipEnvironmentIdentity.upsert({
      where: { environmentId: guard.config.environmentId },
      create: { environmentId: guard.config.environmentId, environmentType: "preview", databaseFingerprint: guard.config.previewFingerprint, productionProhibited: true, verifiedBy: input.actor.actorId },
      update: { environmentType: "preview", databaseFingerprint: guard.config.previewFingerprint, productionProhibited: true, verifiedBy: input.actor.actorId, verifiedAt: new Date() },
    });
    if (identity.databaseFingerprint !== guard.config.previewFingerprint || identity.environmentType !== "preview" || identity.productionProhibited !== true) throw new Error("Preview environment identity verification failed.");
    const credential = await tx.connectorCredentialReference.upsert({
      where: { tenantId_referenceKey: { tenantId: input.actor.tenantId, referenceKey: "UEIP_GBP_PREVIEW_ENVIRONMENT" } },
      create: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId, referenceKey: "UEIP_GBP_PREVIEW_ENVIRONMENT", secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rotationStatus: "operator_managed", rawSecretStored: false, rawSecretRendered: false, createdBy: input.actor.actorId },
      update: { connectorId: gbpConnectorId, secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rawSecretStored: false, rawSecretRendered: false },
    });
    const installation = await tx.connectorInstallationState.upsert({
      where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId } },
      create: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId, installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [gbpRequiredScope], grantedScopes: [gbpRequiredScope], permissionValidation: { authorizedLocationNames: [guard.config.locationName], quotaPerMinute: 20, circuitState: "closed", previewOnly: true }, providerCalled: false, liveExecutionAllowed: false },
      update: { installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [gbpRequiredScope], grantedScopes: [gbpRequiredScope], permissionValidation: { authorizedLocationNames: [guard.config.locationName], quotaPerMinute: 20, circuitState: "closed", previewOnly: true }, providerCalled: false, liveExecutionAllowed: false },
    });
    await controlEvent(tx, input.actor, env, { connectorId: gbpConnectorId, eventType: "preview_installation_configured", decision: "configured", reasonCodes: ["preview_identity_verified", "business_manage_scope_pinned", "gbp_location_pinned"], safeMetadata: { environmentId: guard.config.environmentId, installationId: installation.id, locationConfigured: true } });
    return { status: "ready" as const, environmentId: guard.config.environmentId, installationId: String(installation.id), credentialReferenceId: String(credential.id), locationConfigured: true, providerCalled: false, liveExecutionAllowed: false };
  });
}

export async function getGbpPreviewReadiness(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = gbpPreviewGuard(env);
  if (!guard.ok) return { status: "blocked" as const, reasonCodes: guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const identity = await pilotDb.ueipEnvironmentIdentity.findUnique({ where: { environmentId: guard.config.environmentId } });
  const installation = await pilotDb.connectorInstallationState.findUnique({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId } } });
  const credential = installation?.credentialReferenceId && pilotDb.connectorCredentialReference.findFirst ? await pilotDb.connectorCredentialReference.findFirst({ where: { id: installation.credentialReferenceId, tenantId: input.actor.tenantId, connectorId: gbpConnectorId } }) : null;
  const events = await pilotDb.ueipPilotControlEvent.findMany({ where: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId }, orderBy: { createdAt: "desc" }, take: 50 });
  const rollbackBlocked = events.some((event) => event.eventType === "rollback_drill_blocked" && event.decision === "passed");
  const rollbackRestored = events.some((event) => event.eventType === "rollback_drill_restored" && event.decision === "passed");
  const grantedScopes = Array.isArray(installation?.grantedScopes) ? installation.grantedScopes.filter((scope): scope is string => typeof scope === "string") : [];
  const permission = installation?.permissionValidation && typeof installation.permissionValidation === "object" && !Array.isArray(installation.permissionValidation) ? installation.permissionValidation as Record<string, unknown> : {};
  const authorizedLocationNames = Array.isArray(permission.authorizedLocationNames) ? permission.authorizedLocationNames.filter((id): id is string => typeof id === "string") : [];
  const credentialVerified = Boolean(credential && credential.tenantId === input.actor.tenantId && credential.connectorId === gbpConnectorId && credential.secretStorageProvider === "environment" && credential.rawSecretStored !== true && credential.rawSecretRendered !== true);
  const reasons: string[] = [];
  if (!identity || identity.databaseFingerprint !== guard.config.previewFingerprint || identity.environmentType !== "preview" || identity.productionProhibited !== true) reasons.push("preview_identity_not_verified");
  if (!installation || installation.tenantId !== input.actor.tenantId) reasons.push("installation_missing");
  if (installation && (!installation.enabled || installation.installationState !== "enabled" || installation.authenticationState !== "authenticated" || installation.enableApprovalStatus !== "approved" || installation.sandboxMode !== true)) reasons.push("installation_not_ready");
  if (!credentialVerified) reasons.push("credential_reference_not_verified");
  if (!grantedScopes.includes(gbpRequiredScope)) reasons.push("business_manage_scope_missing");
  if (!authorizedLocationNames.includes(guard.config.locationName)) reasons.push("gbp_location_not_authorized");
  if (!rollbackBlocked || !rollbackRestored) reasons.push("rollback_drill_incomplete");
  if (!isFeatureEnabled("ueip_gateway_enforcement") || !isFeatureEnabled("ueip_gbp_runtime")) reasons.push("ueip_feature_flag_gate_closed");
  return { status: reasons.length === 0 ? "ready" as const : "blocked" as const, reasonCodes: reasons, environmentId: guard.config.environmentId, installationId: installation?.id ?? null, credentialReferenceVerified: credentialVerified, scopeVerified: grantedScopes.includes(gbpRequiredScope), locationAuthorized: authorizedLocationNames.includes(guard.config.locationName), rollbackDrill: { blocked: rollbackBlocked, restored: rollbackRestored }, productionBlocked: true, providerCalled: false, liveExecutionAllowed: false };
}

export async function rollbackGbpPreview(input: { actor: Actor; confirmation: string; action: "drill_disable" | "drill_restore" | "emergency_disable"; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const guard = gbpPreviewGuard(env);
  if (input.confirmation !== gbpPreviewRollbackConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== gbpPreviewRollbackConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const enabled = input.action === "drill_restore";
  const installation = await pilotDb.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId } }, data: { enabled, installationState: enabled ? "enabled" : "disabled", enableApprovalStatus: enabled ? "approved" : "suspended", providerCalled: false, liveExecutionAllowed: false } });
  const eventType = input.action === "drill_disable" ? "rollback_drill_blocked" : input.action === "drill_restore" ? "rollback_drill_restored" : "emergency_rollback";
  await controlEvent(pilotDb, input.actor, env, { connectorId: gbpConnectorId, eventType, decision: input.action === "emergency_disable" ? "rolled_back" : "passed", reasonCodes: [input.action], safeMetadata: { installationId: installation.id, enabled } });
  return { status: input.action === "emergency_disable" ? "rolled_back" as const : "ready" as const, action: input.action, enabled, providerCalled: false, liveExecutionAllowed: false };
}

export async function authorizeGbpPreview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const guard = gbpPreviewGuard(env);
  if (input.confirmation !== gbpPreviewAuthorizationConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== gbpPreviewAuthorizationConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const readiness = await getGbpPreviewReadiness({ actor: input.actor, env });
  if (readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const nonce = randomNonce();
  const nonceHash = await hash(nonce);
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60_000);
  const authorization = await pilotDb.ueipPilotAuthorization.create({ data: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId, capabilityKey: gbpCapabilityKey, environment: "preview", approvingActorId: input.actor.actorId, nonceHash, status: "approved", maximumProviderCalls: 1, providerCallCount: 0, expiresAt } });
  await controlEvent(pilotDb, input.actor, env, { connectorId: gbpConnectorId, eventType: "preview_pilot_authorized", decision: "authorized", reasonCodes: ["single_use", "preview_only", "expires_in_10_minutes"], safeMetadata: { authorizationId: authorization.id, expiresAt: expiresAt.toISOString(), capabilityKey: gbpCapabilityKey } });
  return { status: "authorized" as const, authorizationId: String(authorization.id), nonce, expiresAt: expiresAt.toISOString(), maximumProviderCalls: 1, providerCalled: false, liveExecutionAllowed: false };
}

export async function runGbpPreviewPilot(input: { actor: Actor; confirmation: string; operation: "read" | "blocked_probe"; nonce?: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const guard = gbpPreviewGuard(env);
  const expectedConfirmation = input.operation === "read" ? gbpPreviewReadConfirmation : gbpPreviewProbeConfirmation;
  if (input.confirmation !== expectedConfirmation || !guard.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== expectedConfirmation ? ["confirmation_phrase_invalid"] : guard.reasons, providerCalled: false, liveExecutionAllowed: false };
  const now = input.now ?? new Date();
  let authorization: Record<string, unknown> | null = null;
  if (input.operation === "read") {
    if (!input.nonce) return { status: "blocked" as const, reasonCodes: ["authorization_nonce_missing"], providerCalled: false, liveExecutionAllowed: false };
    const nonceHash = await hash(input.nonce);
    authorization = await pilotDb.ueipPilotAuthorization.findUnique({ where: { nonceHash } });
    if (authorization?.consumedAt) return { status: "locked" as const, authorizationId: authorization.id, traceId: authorization.traceId ?? null, resultStatus: authorization.resultStatus ?? "locked", providerCalled: Number(authorization.providerCallCount ?? 0) > 0, liveExecutionAllowed: false };
    const consumed = await pilotDb.ueipPilotAuthorization.updateMany({ where: { nonceHash, tenantId: input.actor.tenantId, connectorId: gbpConnectorId, capabilityKey: gbpCapabilityKey, environment: "preview", status: "approved", consumedAt: null, expiresAt: { gt: now }, maximumProviderCalls: 1, providerCallCount: 0 }, data: { status: "consumed", consumedAt: now, lockedAt: now } });
    if (consumed.count !== 1) return { status: "blocked" as const, reasonCodes: ["authorization_invalid_expired_or_consumed"], providerCalled: false, liveExecutionAllowed: false };
  }
  const readiness = await getGbpPreviewReadiness({ actor: input.actor, env });
  if (readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const locationName = input.operation === "blocked_probe" ? invalidProbeLocationName : guard.config.locationName;
  const context = createUeipExecutionContext({ tenantId: input.actor.tenantId, actorId: input.actor.actorId, businessModule: "ai_core", requestOrigin: "authenticated_admin", now });
  const endDate = daysAgo(3, now);
  const startDate = daysAgo(7, new Date(`${endDate}T00:00:00.000Z`));
  const result = await runUeipGbpGateway({ context, request: { connectorId: gbpConnectorId, capabilityKey: gbpCapabilityKey, capabilityVersion: "1.0.0", parameters: { locationName, startDate, endDate, rowLimit: 10 }, freshnessSeconds: 0, idempotencyKey: input.operation === "read" ? `gbp-preview-pilot:${authorization?.id}` : `gbp-blocked-probe:${context.traceId}` }, env });
  if (input.operation === "blocked_probe") {
    const passed = !result.ok && result.errorCode === "location_not_authorized" && !result.providerAttempted && !result.providerCalled;
    await controlEvent(pilotDb, input.actor, env, { connectorId: gbpConnectorId, eventType: "blocked_location_probe", decision: passed ? "passed" : "failed", reasonCodes: passed ? ["location_not_authorized", "no_provider_attempt"] : ["blocked_probe_invariant_failed"], safeMetadata: { traceId: result.traceId } });
    return { status: passed ? "completed" as const : "quarantined" as const, operation: input.operation, traceId: result.traceId, providerAttempted: result.providerAttempted, providerCalled: result.providerCalled, productionBlocked: true, liveExecutionAllowed: false };
  }
  const providerCallCount = result.providerCalled ? 1 : 0;
  const finalStatus = result.ok ? "completed" : result.providerCalled ? "quarantined" : "locked";
  const evidenceHash = result.ok ? await hash(JSON.stringify(result.result)) : null;
  await pilotDb.$transaction(async (tx) => {
    await tx.ueipPilotAuthorization.update({ where: { id: authorization!.id }, data: { status: finalStatus, providerCallCount, traceId: result.traceId, resultStatus: finalStatus, lockedAt: new Date() } });
    await tx.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId } }, data: { enabled: false, installationState: "disabled", enableApprovalStatus: "pilot_locked", providerCalled: result.providerCalled, liveExecutionAllowed: false } });
    await controlEvent(tx, input.actor, env, { connectorId: gbpConnectorId, eventType: "preview_pilot_locked", decision: finalStatus, reasonCodes: [result.ok ? "single_use_read_completed" : result.errorCode], safeMetadata: { authorizationId: authorization!.id, traceId: result.traceId, providerCallCount, evidenceHash, contractVersion: result.ok ? result.result.contractVersion : null }, providerCalled: result.providerCalled });
  });
  return { status: finalStatus as "completed" | "quarantined" | "locked", operation: input.operation, authorizationId: authorization!.id, traceId: result.traceId, evidenceHash, result: result.ok ? result.result : null, dataGaps: result.ok ? result.result.dataGaps : result.dataGaps, providerAttempted: result.providerAttempted, providerCalled: result.providerCalled, productionBlocked: true, liveExecutionAllowed: false };
}

export async function getGbpPreviewCloseout(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const readiness = await getGbpPreviewReadiness({ actor: input.actor, env });
  const authorizations = await pilotDb.ueipPilotAuthorization.findMany({ where: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId }, orderBy: { createdAt: "desc" }, take: 20 });
  const events = await pilotDb.ueipPilotControlEvent.findMany({ where: { tenantId: input.actor.tenantId, connectorId: gbpConnectorId }, orderBy: { createdAt: "asc" }, take: 100 });
  const health = await getUeipGbpPilotHealth(input.actor.tenantId);
  const successful = authorizations.find((authorization) => authorization.status === "completed" && authorization.providerCallCount === 1);
  const blockedProbe = events.find((event) => event.eventType === "blocked_location_probe" && event.decision === "passed");
  const providerCallCount = authorizations.reduce((sum, authorization) => sum + Number(authorization.providerCallCount ?? 0), 0);
  const successfulTraceEvents = successful?.traceId ? health.recentAttempts.filter((event) => event.traceId === successful.traceId) : [];
  const completedEvent = successfulTraceEvents.find((event) => event.stage === "completed");
  const auditChainVerified = verifyAuditChain(successfulTraceEvents);
  const expectedStagesPresent = ["preflight_allowed", "credential_resolved", "completed"].every((stage) => successfulTraceEvents.some((event) => event.stage === stage));
  const secretScanPassed = evidenceIsRedacted({ authorizations, events, health });
  const normalizedContractVerified = completedEvent?.safeMetadata && typeof completedEvent.safeMetadata === "object" && (completedEvent.safeMetadata as Record<string, unknown>).contractVersion === "ueip-gbp-result-v1";
  const dataGaps = [
    ...("reasonCodes" in readiness ? readiness.reasonCodes.map((reason) => `Readiness gap: ${reason}`) : []),
    ...(!successful ? ["No completed GBP Preview read has been reviewed."] : []),
    ...(!blockedProbe ? ["Blocked GBP location probe has not passed."] : []),
    ...(providerCallCount !== 1 ? [`GBP provider call count must equal one; observed ${providerCallCount}.`] : []),
    ...(!auditChainVerified ? ["GBP audit chain has not been verified."] : []),
    ...(!normalizedContractVerified ? ["GBP normalized result contract has not been verified in completion evidence."] : []),
  ];
  const certified = Boolean(successful && blockedProbe && providerCallCount === 1 && health.auditCompleteness === 100 && auditChainVerified && expectedStagesPresent && secretScanPassed && normalizedContractVerified);
  return { status: certified ? "preview_pilot_verified" as const : "pilot_incomplete" as const, readiness, providerCallCount, successfulTraceId: successful?.traceId ?? null, evidenceHash: completedEvent?.eventDigest ?? null, dataGaps, blockedProbeRecorded: Boolean(blockedProbe), auditChainVerified, expectedStagesPresent, secretScanPassed, normalizedContractVerified, health, productionBlocked: true, pilotLocked: authorizations.some((authorization) => authorization.lockedAt), providerCalled: providerCallCount > 0, liveExecutionAllowed: false, ceoApprovalRequired: true };
}
