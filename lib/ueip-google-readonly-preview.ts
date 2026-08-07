import { prisma } from "@/lib/prisma";
import { runReadOnlyBusinessSync, type BusinessDataCategory } from "@/lib/read-only-business-connections";
import { createUeipExecutionContext, getTrustedUeipEnvironment } from "@/lib/ueip-runtime-gateway";
import { requireTenantId } from "@/lib/tenant-context";

export const googleReadOnlyPreviewConfirmations = {
  configure: "CONFIGURE_UEIP_GOOGLE_READONLY_PREVIEW",
  authorize: "AUTHORIZE_UEIP_GOOGLE_READONLY_PREVIEW_READS",
  read: "RUN_UEIP_GOOGLE_READONLY_PREVIEW_READS",
  disable: "DISABLE_UEIP_GOOGLE_READONLY_PREVIEW",
  restore: "RESTORE_UEIP_GOOGLE_READONLY_PREVIEW",
} as const;

const connectors = [
  { connectorId: "gmail", category: "gmail_inbox", capabilityKey: "gmail.inbox.metadata.read", scope: "https://www.googleapis.com/auth/gmail.readonly" },
  { connectorId: "google_calendar", category: "google_calendar_events", capabilityKey: "calendar.events.read", scope: "https://www.googleapis.com/auth/calendar.events.readonly" },
  { connectorId: "google_drive", category: "google_drive_documents", capabilityKey: "drive.metadata.read", scope: "https://www.googleapis.com/auth/drive.metadata.readonly" },
  { connectorId: "google_analytics", category: "google_analytics_traffic", capabilityKey: "analytics.page.performance.read", scope: "https://www.googleapis.com/auth/analytics.readonly" },
] as const;

type Actor = { tenantId: string; actorId: string };
let previewDb = prisma;

export function setGoogleReadOnlyPreviewDbForTest(db: typeof prisma) {
  previewDb = db;
  return () => { previewDb = prisma; };
}

function scopeEvidence(env: NodeJS.ProcessEnv) {
  return new Set(`${env.GOOGLE_OAUTH_GRANTED_SCOPES ?? ""} ${env.GOOGLE_GRANTED_SCOPES ?? ""}`.split(/[\s,]+/).map((value) => value.trim()).filter(Boolean));
}

function guard(env: NodeJS.ProcessEnv) {
  const environmentId = env.UEIP_PREVIEW_ENVIRONMENT_ID?.trim() ?? "";
  const previewFingerprint = env.UEIP_PREVIEW_DATABASE_FINGERPRINT?.trim() ?? "";
  const productionFingerprint = env.UEIP_PRODUCTION_DATABASE_FINGERPRINT?.trim() ?? "";
  const granted = scopeEvidence(env);
  const prohibitedScopePresent = [...granted].some((scope) => /gmail\.(?:send|compose|modify)|calendar(?!\.events\.readonly)|drive(?!\.metadata\.readonly)|analytics\.edit|webmasters|business\.manage|youtube|yt-analytics/i.test(scope));
  const reasons: string[] = [];
  if (getTrustedUeipEnvironment(env) !== "preview") reasons.push("trusted_environment_not_preview");
  if (!environmentId) reasons.push("preview_environment_id_missing");
  if (!previewFingerprint) reasons.push("preview_database_fingerprint_missing");
  if (!productionFingerprint) reasons.push("production_database_fingerprint_missing");
  if (previewFingerprint && previewFingerprint === productionFingerprint) reasons.push("preview_database_not_isolated");
  if (!env.GOOGLE_OAUTH_CLIENT_ID?.trim() || !env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() || !env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()) reasons.push("google_oauth_configuration_missing");
  if (!/^\d{4,30}$/.test(env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim() ?? "")) reasons.push("ga4_property_missing_or_invalid");
  for (const connector of connectors) if (!granted.has(connector.scope)) reasons.push(`${connector.connectorId}_readonly_scope_missing`);
  if (prohibitedScopePresent) reasons.push("excluded_or_write_google_scope_present");
  return { ok: reasons.length === 0, reasons, environmentId, previewFingerprint };
}

async function digest(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function nonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifiedIdentity(env: NodeJS.ProcessEnv) {
  const checked = guard(env);
  if (!checked.ok) return { checked, identity: null };
  const identity = await previewDb.ueipEnvironmentIdentity.findUnique({ where: { environmentId: checked.environmentId } });
  if (!identity || identity.environmentType !== "preview" || identity.databaseFingerprint !== checked.previewFingerprint || identity.productionProhibited !== true) {
    checked.reasons.push("preview_identity_not_verified");
    checked.ok = false;
  }
  return { checked, identity };
}

export async function configureGoogleReadOnlyPreview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const tenantId = requireTenantId(input.actor.tenantId, "google_readonly_preview_configure");
  const { checked } = await verifiedIdentity(env);
  if (input.confirmation !== googleReadOnlyPreviewConfirmations.configure || !checked.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== googleReadOnlyPreviewConfirmations.configure ? ["confirmation_phrase_invalid"] : checked.reasons, providerCalled: false, liveExecutionAllowed: false };
  const installationIds = await previewDb.$transaction(async (tx) => {
    const ids: Record<string, string> = {};
    for (const connector of connectors) {
      const credential = await tx.connectorCredentialReference.upsert({ where: { tenantId_referenceKey: { tenantId, referenceKey: `UEIP_${connector.connectorId.toUpperCase()}_PREVIEW_ENVIRONMENT` } }, create: { tenantId, connectorId: connector.connectorId, referenceKey: `UEIP_${connector.connectorId.toUpperCase()}_PREVIEW_ENVIRONMENT`, secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rotationStatus: "operator_managed", rawSecretStored: false, rawSecretRendered: false, createdBy: input.actor.actorId }, update: { connectorId: connector.connectorId, secretStorageProvider: "environment", secretPathReference: "server_allowlisted_google_oauth", rawSecretStored: false, rawSecretRendered: false } });
      const permissionValidation = { quotaPerMinute: 20, circuitState: "closed", previewOnly: true, ...(connector.connectorId === "google_analytics" ? { authorizedPropertyIds: [env.GOOGLE_ANALYTICS_PROPERTY_ID!.trim()] } : {}) };
      const installation = await tx.connectorInstallationState.upsert({ where: { tenantId_connectorId: { tenantId, connectorId: connector.connectorId } }, create: { tenantId, connectorId: connector.connectorId, installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [connector.scope], grantedScopes: [connector.scope], permissionValidation, rollbackVersion: "ueip-google-readonly-v1", providerCalled: false, liveExecutionAllowed: false }, update: { installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: credential.id, requiredScopes: [connector.scope], grantedScopes: [connector.scope], permissionValidation, rollbackVersion: "ueip-google-readonly-v1", providerCalled: false, liveExecutionAllowed: false } });
      ids[connector.connectorId] = installation.id;
      await tx.ueipPilotControlEvent.create({ data: { tenantId, connectorId: connector.connectorId, eventType: "preview_installation_configured", actorId: input.actor.actorId, environment: "preview", decision: "configured", reasonCodes: ["preview_identity_verified", "read_only_scope_pinned", "rollback_control_ready"], safeMetadata: { installationId: installation.id, environmentId: checked.environmentId }, providerCalled: false, liveExecutionAllowed: false } });
    }
    return ids;
  });
  return { status: "ready" as const, installationIds, providerCalled: false, liveExecutionAllowed: false };
}

export async function getGoogleReadOnlyPreviewReadiness(input: { actor: Actor; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const tenantId = requireTenantId(input.actor.tenantId, "google_readonly_preview_readiness");
  const { checked } = await verifiedIdentity(env);
  const records = await previewDb.connectorInstallationState.findMany({ where: { tenantId, connectorId: { in: connectors.map((item) => item.connectorId) } } });
  const reasons = [...checked.reasons];
  for (const connector of connectors) {
    const record = records.find((item) => item.connectorId === connector.connectorId);
    if (!record) reasons.push(`${connector.connectorId}_installation_missing`);
    else if (!record.enabled || record.installationState !== "enabled" || record.authenticationState !== "authenticated" || record.enableApprovalStatus !== "approved") reasons.push(`${connector.connectorId}_installation_not_ready`);
    else if (!Array.isArray(record.grantedScopes) || !record.grantedScopes.includes(connector.scope)) reasons.push(`${connector.connectorId}_installation_scope_missing`);
  }
  return { status: reasons.length === 0 ? "ready" as const : "blocked" as const, reasonCodes: [...new Set(reasons)], connectors: records.map((record) => ({ connectorId: record.connectorId, installationId: record.id, enabled: record.enabled })), productionBlocked: true, providerCalled: false, liveExecutionAllowed: false };
}

export async function authorizeGoogleReadOnlyPreview(input: { actor: Actor; confirmation: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const tenantId = requireTenantId(input.actor.tenantId, "google_readonly_preview_authorize");
  const readiness = await getGoogleReadOnlyPreviewReadiness({ actor: input.actor, env });
  if (input.confirmation !== googleReadOnlyPreviewConfirmations.authorize || readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: input.confirmation !== googleReadOnlyPreviewConfirmations.authorize ? ["confirmation_phrase_invalid"] : readiness.reasonCodes, providerCalled: false, liveExecutionAllowed: false };
  const rawNonce = nonce();
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60_000);
  const authorizationIds: Record<string, string> = {};
  for (const connector of connectors) {
    const nonceHash = await digest(`${rawNonce}:${connector.connectorId}`);
    const authorization = await previewDb.ueipPilotAuthorization.create({ data: { tenantId, connectorId: connector.connectorId, capabilityKey: connector.capabilityKey, environment: "preview", approvingActorId: input.actor.actorId, nonceHash, status: "approved", maximumProviderCalls: 1, providerCallCount: 0, expiresAt } });
    authorizationIds[connector.connectorId] = authorization.id;
  }
  return { status: "authorized" as const, authorizationIds, nonce: rawNonce, expiresAt: expiresAt.toISOString(), maximumProviderCallsPerConnector: 1, providerCalled: false, liveExecutionAllowed: false };
}

export async function runGoogleReadOnlyPreview(input: { actor: Actor; confirmation: string; nonce?: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const tenantId = requireTenantId(input.actor.tenantId, "google_readonly_preview_read");
  if (input.confirmation !== googleReadOnlyPreviewConfirmations.read || !input.nonce) return { status: "blocked" as const, reasonCodes: [input.confirmation !== googleReadOnlyPreviewConfirmations.read ? "confirmation_phrase_invalid" : "authorization_nonce_missing"], providerCalled: false, liveExecutionAllowed: false };
  const now = input.now ?? new Date();
  const authorizations: Array<{ id: string; connectorId: string }> = [];
  for (const connector of connectors) {
    const nonceHash = await digest(`${input.nonce}:${connector.connectorId}`);
    const authorization = await previewDb.ueipPilotAuthorization.findUnique({ where: { nonceHash } });
    if (!authorization || authorization.tenantId !== tenantId || authorization.connectorId !== connector.connectorId || authorization.status !== "approved" || authorization.consumedAt || authorization.expiresAt <= now) return { status: "blocked" as const, reasonCodes: [`${connector.connectorId}_authorization_invalid_expired_or_consumed`], providerCalled: false, liveExecutionAllowed: false };
    authorizations.push(authorization);
  }
  await previewDb.$transaction(authorizations.map((authorization) => previewDb.ueipPilotAuthorization.update({ where: { id: authorization.id }, data: { status: "consumed", consumedAt: now, lockedAt: now } })));
  const context = createUeipExecutionContext({ tenantId, actorId: input.actor.actorId, businessModule: "ai_core", requestOrigin: "authenticated_admin", now });
  const categories = connectors.map((item) => item.category) as BusinessDataCategory[];
  const report = await runReadOnlyBusinessSync(env, context, { categories, allowProviderReads: true, persistDailyBriefing: true });
  const outcomes = connectors.map((connector) => {
    const snapshot = report.snapshots.find((item) => item.connectorId === connector.connectorId);
    return { connectorId: connector.connectorId, category: connector.category, snapshotId: snapshot?.id ?? null, traceId: snapshot?.traceId ?? null, status: snapshot?.status ?? "missing", providerCalled: snapshot?.providerCalled === true, evidenceHash: snapshot?.evidenceHash ?? null };
  });
  await previewDb.$transaction(async (tx) => {
    for (const authorization of authorizations) {
      const outcome = outcomes.find((item) => item.connectorId === authorization.connectorId)!;
      const status = outcome.providerCalled && outcome.status === "fresh" ? "completed" : outcome.providerCalled ? "quarantined" : "locked";
      await tx.ueipPilotAuthorization.update({ where: { id: authorization.id }, data: { status, providerCallCount: outcome.providerCalled ? 1 : 0, traceId: outcome.traceId, resultStatus: status, lockedAt: new Date() } });
      await tx.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId, connectorId: authorization.connectorId } }, data: { enabled: false, installationState: "disabled", enableApprovalStatus: "pilot_locked", providerCalled: outcome.providerCalled, liveExecutionAllowed: false } });
      await tx.ueipPilotControlEvent.create({ data: { tenantId, connectorId: authorization.connectorId, eventType: "preview_pilot_locked", actorId: input.actor.actorId, environment: "preview", decision: status, reasonCodes: [status === "completed" ? "single_use_read_completed" : "single_use_read_not_certified"], safeMetadata: { authorizationId: authorization.id, traceId: outcome.traceId, snapshotId: outcome.snapshotId }, providerCalled: outcome.providerCalled, liveExecutionAllowed: false } });
    }
  });
  const certified = outcomes.every((outcome) => outcome.providerCalled && outcome.status === "fresh" && Boolean(outcome.evidenceHash) && Boolean(outcome.traceId));
  return { status: certified ? "completed" as const : "quarantined" as const, outcomes, morningBrief: report.morningBrief, safety: { providerWrite: false, sent: false, published: false, scraping: false, crmMutation: false, outreach: false, externalExecutionAllowed: false, liveExecutionAllowed: false }, providerCalled: outcomes.some((item) => item.providerCalled), liveExecutionAllowed: false };
}

export async function setGoogleReadOnlyPreviewEnabled(input: { actor: Actor; confirmation: string; action: "disable" | "restore"; env?: NodeJS.ProcessEnv }) {
  const env = input.env ?? process.env;
  const tenantId = requireTenantId(input.actor.tenantId, "google_readonly_preview_rollback");
  const expected = input.action === "disable" ? googleReadOnlyPreviewConfirmations.disable : googleReadOnlyPreviewConfirmations.restore;
  const { checked } = await verifiedIdentity(env);
  if (input.confirmation !== expected || !checked.ok) return { status: "blocked" as const, reasonCodes: input.confirmation !== expected ? ["confirmation_phrase_invalid"] : checked.reasons, providerCalled: false, liveExecutionAllowed: false };
  const enabled = input.action === "restore";
  await previewDb.$transaction(connectors.map((connector) => previewDb.connectorInstallationState.update({ where: { tenantId_connectorId: { tenantId, connectorId: connector.connectorId } }, data: { enabled, installationState: enabled ? "enabled" : "disabled", enableApprovalStatus: enabled ? "approved" : "suspended", providerCalled: false, liveExecutionAllowed: false } })));
  return { status: enabled ? "ready" as const : "disabled" as const, enabled, providerCalled: false, liveExecutionAllowed: false };
}
