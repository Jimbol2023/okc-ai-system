import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/tenant-context";
import { executeTwilioDiagnosticRead, twilioDiagnosticCapabilities, TwilioDiagnosticError, type TwilioDiagnosticCapability, type TwilioDiagnosticCredential } from "@/lib/twilio-diagnostic-adapter";

export const twilioPreviewAuthorizationPhrase = "AUTHORIZE_EXACTLY_ONE_PREVIEW_ONLY_TWILIO_READ_ONLY_DIAGNOSTIC_PROVIDER_CALL";
export const twilioPreviewReadPhrase = "RUN_EXACTLY_ONE_PREVIEW_ONLY_TWILIO_READ_ONLY_DIAGNOSTIC_PROVIDER_CALL";
export const twilioDiagnosticSafety = Object.freeze({ providerWrite: false, sent: false, published: false, outreach: false, scraping: false, crmMutation: false, externalExecutionAllowed: false, liveExecutionAllowed: false });

type Actor = Readonly<{ tenantId: string; actorId: string }>;
type Db = typeof prisma;
let db: Db = prisma;
let fetcher: typeof fetch = fetch;
const rate = new Map<string, { startedAt: number; count: number }>();
const circuit = new Map<string, { failures: number; openUntil: number }>();

export function setTwilioDiagnosticDependenciesForTest(input: { db?: Db; fetcher?: typeof fetch }) {
  if (input.db) db = input.db;
  if (input.fetcher) fetcher = input.fetcher;
  return () => { db = prisma; fetcher = fetch; rate.clear(); circuit.clear(); };
}

function environment(env: NodeJS.ProcessEnv) {
  if (env.VERCEL_ENV === "preview") return "preview";
  if (env.VERCEL_ENV === "production" || env.NODE_ENV === "production") return "production";
  return "development";
}

function credentialsConfigured(env: NodeJS.ProcessEnv) {
  return Boolean(env.TWILIO_DIAGNOSTIC_ACCOUNT_SID?.trim() && env.TWILIO_DIAGNOSTIC_API_KEY_SID?.trim() && env.TWILIO_DIAGNOSTIC_API_KEY_SECRET?.trim());
}

function configuredTenant(env: NodeJS.ProcessEnv) {
  return env.TWILIO_DIAGNOSTIC_TENANT_ID?.trim() ?? "";
}

function enabled(env: NodeJS.ProcessEnv) {
  return env.TWILIO_DIAGNOSTIC_ENABLED?.trim().toLowerCase() === "true";
}

function safeReadiness(actor: Actor, env: NodeJS.ProcessEnv) {
  const tenantId = requireTenantId(actor.tenantId, "twilio_diagnostic_session");
  const reasons: string[] = [];
  if (!enabled(env)) reasons.push("diagnostic_kill_switch_closed");
  if (!credentialsConfigured(env)) reasons.push("diagnostic_credential_unavailable");
  if (configuredTenant(env) !== tenantId) reasons.push("diagnostic_tenant_mismatch");
  if (environment(env) !== "preview") reasons.push("preview_environment_required");
  return { tenantId, connectorId: "twilio", environment: environment(env), status: reasons.length ? "blocked" : "ready", reasonCodes: reasons, capabilities: twilioDiagnosticCapabilities, credentialModel: "twilio_restricted_api_key", credentialsConfigured: credentialsConfigured(env), providerCalled: false, ...twilioDiagnosticSafety } as const;
}

export async function getTwilioDiagnosticReadiness(actor: Actor, env: NodeJS.ProcessEnv = process.env) {
  const readiness = safeReadiness(actor, env);
  const installation = await db.connectorInstallationState.findUnique({ where: { tenantId_connectorId: { tenantId: readiness.tenantId, connectorId: "twilio" } }, select: { installationState: true, configurationState: true, authenticationState: true, enabled: true, enableApprovalStatus: true, requiredScopes: true, grantedScopes: true, providerCalled: true, liveExecutionAllowed: true } });
  const installationReady = Boolean(installation?.enabled && installation.installationState === "enabled" && installation.configurationState === "configured" && installation.authenticationState === "authenticated" && installation.enableApprovalStatus === "approved");
  return { ...readiness, installationReady, installation: installation ? { ...installation, providerCalled: Boolean(installation.providerCalled), liveExecutionAllowed: false } : null, status: readiness.status === "ready" && installationReady ? "ready" : "blocked", reasonCodes: [...readiness.reasonCodes, ...(!installationReady ? ["installation_not_ready"] : [])], ceoBusinessDecisionRequired: false };
}

async function digest(value: string) {
  const data = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(data), byte => byte.toString(16).padStart(2, "0")).join("");
}

function nonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function authorizeTwilioDiagnosticPreview(input: { actor: Actor; capability: TwilioDiagnosticCapability; confirmation: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const readiness = await getTwilioDiagnosticReadiness(input.actor, env);
  if (input.confirmation !== twilioPreviewAuthorizationPhrase || readiness.status !== "ready") return { status: "blocked" as const, reasonCodes: input.confirmation !== twilioPreviewAuthorizationPhrase ? ["exact_confirmation_required"] : readiness.reasonCodes, providerCalled: false, ...twilioDiagnosticSafety };
  if (!(twilioDiagnosticCapabilities as readonly string[]).includes(input.capability)) return { status: "blocked" as const, reasonCodes: ["capability_not_allowed"], providerCalled: false, ...twilioDiagnosticSafety };
  const rawNonce = nonce();
  const expiresAt = new Date((input.now ?? new Date()).getTime() + 10 * 60_000);
  const authorization = await db.ueipPilotAuthorization.create({ data: { tenantId: input.actor.tenantId, connectorId: "twilio", capabilityKey: input.capability, environment: "preview", approvingActorId: input.actor.actorId, nonceHash: await digest(rawNonce), status: "approved", maximumProviderCalls: 1, providerCallCount: 0, expiresAt } });
  return { status: "authorized" as const, authorizationId: authorization.id, nonce: rawNonce, capability: input.capability, expiresAt: expiresAt.toISOString(), maximumProviderCalls: 1, providerCalled: false, ...twilioDiagnosticSafety };
}

function rateAllowed(tenantId: string, now: number) {
  const value = rate.get(tenantId);
  if (!value || now - value.startedAt >= 60_000) { rate.set(tenantId, { startedAt: now, count: 1 }); return true; }
  if (value.count >= 3) return false;
  value.count += 1;
  return true;
}

async function audit(input: { traceId: string; actor: Actor; capability: string; stage: string; decision: string; reasonCodes: string[]; providerCalled?: boolean; safeMetadata?: Record<string, unknown> }) {
  const prior = await db.ueipGatewayAuditEvent.findFirst({ where: { traceId: input.traceId }, orderBy: { sequenceNumber: "desc" }, select: { sequenceNumber: true, eventDigest: true } });
  const sequenceNumber = (prior?.sequenceNumber ?? 0) + 1;
  const previousEventDigest = prior?.eventDigest ?? null;
  const eventDigest = await digest(JSON.stringify({ traceId: input.traceId, sequenceNumber, previousEventDigest, stage: input.stage, decision: input.decision, reasonCodes: input.reasonCodes, providerCalled: input.providerCalled ?? false, safeMetadata: input.safeMetadata ?? {} }));
  return db.ueipGatewayAuditEvent.create({ data: { traceId: input.traceId, tenantId: input.actor.tenantId, connectorId: "twilio", capabilityKey: input.capability, manifestVersion: "twilio-diagnostic-manifest-v1", policyVersion: "twilio-diagnostic-policy-v1", actorId: input.actor.actorId, environment: "preview", stage: input.stage, decision: input.decision, providerAttempted: input.providerCalled ?? false, providerCalled: input.providerCalled ?? false, auditComplete: true, reasonCodes: input.reasonCodes, safeMetadata: input.safeMetadata ?? {}, sequenceNumber, previousEventDigest, eventDigest } });
}

export async function runTwilioDiagnosticPreviewRead(input: { actor: Actor; capability: TwilioDiagnosticCapability; confirmation: string; nonce?: string; phoneNumberSid?: string; env?: NodeJS.ProcessEnv; now?: Date }) {
  const env = input.env ?? process.env;
  const now = input.now ?? new Date();
  const traceId = crypto.randomUUID();
  const readiness = await getTwilioDiagnosticReadiness(input.actor, env);
  const block = async (reason: string) => { await audit({ traceId, actor: input.actor, capability: input.capability, stage: "blocked", decision: "blocked", reasonCodes: [reason] }).catch(() => undefined); return { status: "blocked" as const, traceId, reasonCodes: [reason], providerCalled: false, ...twilioDiagnosticSafety }; };
  if (input.confirmation !== twilioPreviewReadPhrase) return block("exact_confirmation_required");
  if (readiness.status !== "ready") return block(readiness.reasonCodes[0] ?? "readiness_blocked");
  if (!input.nonce) return block("authorization_nonce_missing");
  if (!rateAllowed(input.actor.tenantId, now.getTime())) return block("tenant_rate_limited");
  const open = circuit.get(input.actor.tenantId);
  if (open && open.openUntil > now.getTime()) return block("circuit_open");
  const nonceHash = await digest(input.nonce);
  const authorization = await db.ueipPilotAuthorization.findUnique({ where: { nonceHash } });
  if (authorization?.consumedAt) return { status: "locked" as const, traceId: authorization.traceId ?? traceId, reasonCodes: ["authorization_already_consumed"], providerCalled: Number(authorization.providerCallCount) > 0, ...twilioDiagnosticSafety };
  const consumed = await db.ueipPilotAuthorization.updateMany({ where: { nonceHash, tenantId: input.actor.tenantId, connectorId: "twilio", capabilityKey: input.capability, environment: "preview", status: "approved", consumedAt: null, expiresAt: { gt: now }, maximumProviderCalls: 1, providerCallCount: 0 }, data: { status: "consumed", consumedAt: now, lockedAt: now, traceId } });
  if (consumed.count !== 1) return block("authorization_invalid_expired_or_consumed");
  try {
    await audit({ traceId, actor: input.actor, capability: input.capability, stage: "preflight_allowed", decision: "allow_read", reasonCodes: ["single_use_authorization_consumed"] });
    const reference = await db.connectorCredentialReference.findFirst({ where: { tenantId: input.actor.tenantId, connectorId: "twilio", referenceKey: "twilio_diagnostic_restricted_api_key", rawSecretStored: false, rawSecretRendered: false } });
    if (!reference) return block("credential_reference_unavailable");
    await audit({ traceId, actor: input.actor, capability: input.capability, stage: "credential_resolved", decision: "allowed", reasonCodes: ["environment_broker_reference_verified"] });
    const credential: TwilioDiagnosticCredential = { accountSid: env.TWILIO_DIAGNOSTIC_ACCOUNT_SID?.trim() ?? "", apiKeySid: env.TWILIO_DIAGNOSTIC_API_KEY_SID?.trim() ?? "", apiKeySecret: env.TWILIO_DIAGNOSTIC_API_KEY_SECRET?.trim() ?? "" };
    const evidence = await executeTwilioDiagnosticRead({ capability: input.capability, phoneNumberSid: input.phoneNumberSid }, credential, fetcher);
    await audit({ traceId, actor: input.actor, capability: input.capability, stage: "completed", decision: "completed", reasonCodes: ["normalized_evidence_only"], providerCalled: true, safeMetadata: { contractVersion: "twilio-diagnostic-evidence-v1" } });
    await db.ueipPilotAuthorization.update({ where: { nonceHash }, data: { providerCallCount: 1, resultStatus: "completed" } });
    await db.enterpriseConnectorHealthEvent.create({ data: { tenantId: input.actor.tenantId, connectorId: "twilio", healthStatus: "healthy", checkedAt: now, circuitBreakerState: "closed", providerCalled: true, liveExecutionAllowed: false, safeMetadata: { traceId, capability: input.capability } } });
    await db.businessDataSnapshot.create({ data: { tenantId: input.actor.tenantId, snapshotDate: now, provider: "Twilio", connectorId: "twilio", category: "twilio_diagnostic", status: "fresh", sourceLabel: "ueip:twilio:preview_diagnostic", provenance: "Single-use Preview-only Twilio read normalized through the governed diagnostic connector.", freshness: now.toISOString(), summary: `Twilio ${input.capability} diagnostic evidence captured.`, metrics: {}, records: [evidence], dataGaps: [], assumptions: ["Diagnostic evidence only; no provider write or messaging authorization."], safetyFlags: { ...twilioDiagnosticSafety, providerCalled: true }, providerCalled: true, sent: false, published: false, crmMutated: false, liveExecutionAllowed: false, traceId } });
    circuit.delete(input.actor.tenantId);
    return { status: "completed" as const, traceId, capability: input.capability, evidence, providerCalled: true, ...twilioDiagnosticSafety };
  } catch (error) {
    const failures = (circuit.get(input.actor.tenantId)?.failures ?? 0) + 1;
    circuit.set(input.actor.tenantId, { failures, openUntil: failures >= 3 ? now.getTime() + 60_000 : 0 });
    const code = error instanceof TwilioDiagnosticError ? error.code : "provider_error";
    const called = error instanceof TwilioDiagnosticError && error.providerAttempted;
    await audit({ traceId, actor: input.actor, capability: input.capability, stage: "failed", decision: "failed", reasonCodes: [code], providerCalled: called }).catch(() => undefined);
    await db.ueipPilotAuthorization.update({ where: { nonceHash }, data: { providerCallCount: called ? 1 : 0, resultStatus: code } }).catch(() => undefined);
    return { status: "failed" as const, traceId, reasonCodes: [code], providerCalled: called, ...twilioDiagnosticSafety };
  }
}

export function projectTwilioDiagnosticExceptions(snapshot: { status: string; records: unknown; dataGaps: unknown }) {
  const gaps = Array.isArray(snapshot.dataGaps) ? snapshot.dataGaps.filter((item): item is string => typeof item === "string") : [];
  const records = Array.isArray(snapshot.records) ? snapshot.records : [];
  return gaps.concat(records.flatMap(record => {
    if (!record || typeof record !== "object") return [];
    const value = record as Record<string, unknown>;
    const account = value.account as Record<string, unknown> | undefined;
    const inbound = value.inbound as Record<string, unknown> | undefined;
    const exceptions: string[] = [];
    if (account?.type === "Trial") exceptions.push("Twilio account remains on trial.");
    if (value.configured === false || inbound?.smsUrl === "") exceptions.push("Twilio inbound webhook is not configured.");
    return exceptions;
  })).slice(0, 5).map(summary => ({ connectorId: "twilio", summary, ceoBusinessDecisionRequired: false, providerCalled: false, ...twilioDiagnosticSafety }));
}
