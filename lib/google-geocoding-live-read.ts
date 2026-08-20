import { createHash, randomUUID } from "node:crypto";

import { z } from "zod";

import { evaluateAutonomyPolicy, type AutonomyPolicyDefinition } from "@/lib/autonomy-policy";
import { evaluateConnectorAction } from "@/lib/connector-platform";
import { createPropertyCandidateDuplicateKey, normalizePropertyCandidateAddress, propertyCandidateInputSchema, type PropertyCandidateInput } from "@/lib/property-candidate-foundation";
import { googleGeocodeResultSchema, mapGoogleGeocodeToPropertyCandidateInput, type VirtualDfdCostControls } from "@/lib/virtual-dfd-connectors";

export const GOOGLE_GEOCODE_CONNECTOR_ID = "google_geocode";
export const GOOGLE_GEOCODE_ACTION = "provider_read_geocode";
export const GOOGLE_GEOCODE_CAPABILITY = "property.address.geocode.read";

export type GoogleGeocodeResultClassification =
  | "credential_missing"
  | "credential_empty"
  | "policy_denied"
  | "level_denied"
  | "kill_switch_active"
  | "circuit_breaker_open"
  | "zero_budget"
  | "query_budget_exceeded"
  | "dollar_budget_exceeded"
  | "idempotent_duplicate"
  | "provider_timeout"
  | "provider_error"
  | "invalid_input"
  | "candidate_staged";

export type GoogleGeocodeRuntimeConfig = {
  googleGeocodingApiKey?: string;
  providerReadEnabled?: boolean;
  level3Authorized?: boolean;
  killSwitchEnabled?: boolean;
  certificationQueryLimit?: number;
  dailyQueryLimit?: number;
  dailyDollarLimitCents?: number;
  perQueryCostCents?: number;
  maxRetries?: number;
  circuitBreaker?: "open" | "closed";
  providerErrorCount?: number;
  providerErrorThreshold?: number;
  environment?: string;
};

export type GoogleGeocodeActor = {
  tenantId: string;
  actorId: string;
  requestingModule: "Virtual DFD" | "Property Intelligence" | "AI";
};

export type GoogleGeocodeExecutionAttempt = {
  id: string;
  tenantId: string;
  traceId: string;
  idempotencyKey: string;
  connectorId: typeof GOOGLE_GEOCODE_CONNECTOR_ID;
  capabilityKey: typeof GOOGLE_GEOCODE_CAPABILITY;
  actionKey: typeof GOOGLE_GEOCODE_ACTION;
  actorId: string;
  requestingModule: string;
  policyDecision: "allowed" | "blocked";
  reason: string;
  resultClassification: GoogleGeocodeResultClassification;
  queryCount: number;
  costCents: number;
  creditsUsed: number;
  normalizedResult: Record<string, unknown> | null;
  redactionApplied: true;
  providerCalled: boolean;
  providerWrite: false;
  sent: false;
  published: false;
  liveExecutionAllowed: false;
  startedAt: string;
  completedAt: string;
};

export type GoogleGeocodingRuntimeDb = {
  countProviderCallsToday(input: { tenantId: string; connectorId: string; actionKey: string; since: string }): Promise<number>;
  findAttemptByIdempotencyKey(input: { tenantId: string; idempotencyKey: string }): Promise<GoogleGeocodeExecutionAttempt | null>;
  recordExecutionAttempt(input: GoogleGeocodeExecutionAttempt): Promise<GoogleGeocodeExecutionAttempt>;
  findCandidateByDuplicateKey(input: { tenantId: string; duplicateKey: string }): Promise<{ id: string; duplicateKey: string } | null>;
  createPropertyCandidate(input: GoogleGeocodeStagedCandidate): Promise<{ id: string; duplicateStatus: string; reviewStatus: string }>;
};

export type GoogleGeocodeStagedCandidate = {
  id: string;
  tenantId: string;
  propertyCandidateInput: PropertyCandidateInput;
  normalizedAddress: string;
  duplicateKey: string;
  duplicateStatus: "unique" | "duplicate_candidate";
  providerCalled: true;
  providerWrite: false;
  sent: false;
  published: false;
  outreach: false;
  crmMutated: false;
  skipTracePerformed: false;
  directMailSent: false;
  externalExecutionAllowed: false;
  liveExecutionAllowed: false;
};

export type GoogleGeocodeFetch = (url: string, init: { method: "GET"; headers: Record<string, string>; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

const requestSchema = z.object({
  propertyAddress: z.string().trim().min(5).max(300),
  idempotencyKey: z.string().trim().min(8).max(160).optional(),
});

const fallbackDeniedPolicy: AutonomyPolicyDefinition = {
  policyKey: "google-geocode-runtime:default-deny:v1",
  lane: "virtual_dfd_property_discovery",
  subjectType: "connector",
  subjectKey: GOOGLE_GEOCODE_CONNECTOR_ID,
  actionKey: GOOGLE_GEOCODE_ACTION,
  maxAutonomyLevel: 2,
  effect: "deny",
  approvalRequired: true,
  quotaPerDay: 0,
  killSwitchEnabled: true,
  allowedActions: [],
  blockedActions: [GOOGLE_GEOCODE_ACTION],
  requiredEvidence: ["tenant_id", "preview_environment", "credential_scope", "hard_cost_budget", "ueip_audit"],
  escalationRules: ["provider_read_requested"],
  safetyNotes: "Default Google Geocode runtime policy denies provider reads.",
};

export function getGoogleGeocodeRuntimeAutonomyPolicy(config: GoogleGeocodeRuntimeConfig): AutonomyPolicyDefinition {
  const previewAuthorized = config.environment === "preview" && config.providerReadEnabled === true && config.level3Authorized === true && config.killSwitchEnabled === false;

  if (!previewAuthorized) return fallbackDeniedPolicy;

  const quotaPerDay = Math.min(config.dailyQueryLimit ?? 0, config.certificationQueryLimit ?? 0);

  return {
    policyKey: "google-geocode-runtime:preview-level3-bounded-read:v1",
    lane: "virtual_dfd_property_discovery",
    subjectType: "connector",
    subjectKey: GOOGLE_GEOCODE_CONNECTOR_ID,
    actionKey: GOOGLE_GEOCODE_ACTION,
    maxAutonomyLevel: 3,
    effect: "allow",
    approvalRequired: false,
    quotaPerDay,
    killSwitchEnabled: false,
    allowedActions: [GOOGLE_GEOCODE_ACTION],
    blockedActions: ["scrape_google_maps", "infer_distress", "infer_owner_motivation", "create_lead", "create_property_opportunity", "send_sms", "send_email", "direct_mail", "provider_write"],
    requiredEvidence: ["tenant_id", "preview_environment", "credential_scope", "hard_cost_budget", "ueip_audit"],
    escalationRules: ["bounded_preview_provider_read_only"],
    safetyNotes: "Preview-only Level 3 Google Geocode provider-read policy. No provider writes, outreach, Lead, PropertyOpportunity, or RevenueTask creation.",
  };
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function todayStartIso(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)).toISOString();
}

export function createGoogleGeocodeIdempotencyKey(input: { tenantId: string; propertyAddress: string; idempotencyKey?: string }) {
  return input.idempotencyKey?.trim() || sha256(`${input.tenantId}:${GOOGLE_GEOCODE_ACTION}:${input.propertyAddress.trim().toLowerCase().replace(/\s+/g, " ")}`);
}

export function getGoogleGeocodingRuntimeConfig(env: NodeJS.ProcessEnv = process.env): GoogleGeocodeRuntimeConfig {
  const numberValue = (key: string) => {
    const raw = env[key]?.trim();
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
  };

  return {
    googleGeocodingApiKey: env.GOOGLE_GEOCODING_API_KEY,
    providerReadEnabled: env.GOOGLE_GEOCODING_PROVIDER_READ_ENABLED === "true",
    level3Authorized: env.GOOGLE_GEOCODING_LEVEL3_AUTHORIZED === "true",
    killSwitchEnabled: env.GOOGLE_GEOCODING_KILL_SWITCH !== "false",
    certificationQueryLimit: numberValue("GOOGLE_GEOCODING_CERTIFICATION_QUERY_LIMIT"),
    dailyQueryLimit: numberValue("GOOGLE_GEOCODING_DAILY_QUERY_LIMIT"),
    dailyDollarLimitCents: numberValue("GOOGLE_GEOCODING_DAILY_DOLLAR_LIMIT_CENTS"),
    perQueryCostCents: numberValue("GOOGLE_GEOCODING_PER_QUERY_COST_CENTS"),
    maxRetries: numberValue("GOOGLE_GEOCODING_MAX_RETRIES"),
    circuitBreaker: env.GOOGLE_GEOCODING_CIRCUIT_BREAKER === "closed" ? "closed" : "open",
    providerErrorCount: numberValue("GOOGLE_GEOCODING_PROVIDER_ERROR_COUNT"),
    providerErrorThreshold: numberValue("GOOGLE_GEOCODING_PROVIDER_ERROR_THRESHOLD"),
    environment: env.VERCEL_ENV || env.NODE_ENV || "development",
  };
}

export function normalizeGoogleGeocodeProviderResponse(response: unknown) {
  const root = response as { results?: unknown[]; error?: { message?: string }; status?: string };
  const firstResult = Array.isArray(root.results) ? root.results[0] : response;
  const parsed = googleGeocodeResultSchema.safeParse(firstResult);
  if (!parsed.success) throw new Error("google_geocode_invalid_normalized_response");

  const result = parsed.data;
  const location = result.location ? { latitude: result.location.latitude, longitude: result.location.longitude } : result.geometry?.location ? { latitude: result.geometry.location.lat, longitude: result.geometry.location.lng } : null;

  return {
    formattedAddress: result.formattedAddress ?? result.formatted_address ?? "",
    placeId: result.placeId ?? result.place_id ?? "",
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    addressComponents: result.addressComponents ?? result.address_components ?? [],
    locationType: result.granularity ?? null,
    providerStatus: root.status ?? null,
  };
}

function deniedAttempt(input: {
  actor: GoogleGeocodeActor;
  traceId: string;
  idempotencyKey: string;
  startedAt: string;
  classification: GoogleGeocodeResultClassification;
  reason: string;
  normalizedResult?: Record<string, unknown> | null;
}): GoogleGeocodeExecutionAttempt {
  return {
    id: randomUUID(),
    tenantId: input.actor.tenantId,
    traceId: input.traceId,
    idempotencyKey: input.idempotencyKey,
    connectorId: GOOGLE_GEOCODE_CONNECTOR_ID,
    capabilityKey: GOOGLE_GEOCODE_CAPABILITY,
    actionKey: GOOGLE_GEOCODE_ACTION,
    actorId: input.actor.actorId,
    requestingModule: input.actor.requestingModule,
    policyDecision: "blocked",
    reason: input.reason,
    resultClassification: input.classification,
    queryCount: 0,
    costCents: 0,
    creditsUsed: 0,
    normalizedResult: input.normalizedResult ?? null,
    redactionApplied: true,
    providerCalled: false,
    providerWrite: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    startedAt: input.startedAt,
    completedAt: new Date().toISOString(),
  };
}

function allowedAttempt(input: {
  actor: GoogleGeocodeActor;
  traceId: string;
  idempotencyKey: string;
  startedAt: string;
  normalizedResult: Record<string, unknown>;
  queryCount: number;
  costCents: number;
  creditsUsed: number;
  reason: string;
}): GoogleGeocodeExecutionAttempt {
  return {
    id: randomUUID(),
    tenantId: input.actor.tenantId,
    traceId: input.traceId,
    idempotencyKey: input.idempotencyKey,
    connectorId: GOOGLE_GEOCODE_CONNECTOR_ID,
    capabilityKey: GOOGLE_GEOCODE_CAPABILITY,
    actionKey: GOOGLE_GEOCODE_ACTION,
    actorId: input.actor.actorId,
    requestingModule: input.actor.requestingModule,
    policyDecision: "allowed",
    reason: input.reason,
    resultClassification: "candidate_staged",
    queryCount: input.queryCount,
    costCents: input.costCents,
    creditsUsed: input.creditsUsed,
    normalizedResult: input.normalizedResult,
    redactionApplied: true,
    providerCalled: true,
    providerWrite: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    startedAt: input.startedAt,
    completedAt: new Date().toISOString(),
  };
}

function providerFailureAttempt(input: {
  actor: GoogleGeocodeActor;
  traceId: string;
  idempotencyKey: string;
  startedAt: string;
  classification: "provider_timeout" | "provider_error";
  reason: string;
  queryCount: number;
}): GoogleGeocodeExecutionAttempt {
  return {
    id: randomUUID(),
    tenantId: input.actor.tenantId,
    traceId: input.traceId,
    idempotencyKey: input.idempotencyKey,
    connectorId: GOOGLE_GEOCODE_CONNECTOR_ID,
    capabilityKey: GOOGLE_GEOCODE_CAPABILITY,
    actionKey: GOOGLE_GEOCODE_ACTION,
    actorId: input.actor.actorId,
    requestingModule: input.actor.requestingModule,
    policyDecision: "allowed" as const,
    reason: input.reason,
    resultClassification: input.classification,
    queryCount: input.queryCount,
    costCents: 0,
    creditsUsed: 0,
    normalizedResult: { providerError: true },
    redactionApplied: true as const,
    providerCalled: true,
    providerWrite: false as const,
    sent: false as const,
    published: false as const,
    liveExecutionAllowed: false as const,
    startedAt: input.startedAt,
    completedAt: new Date().toISOString(),
  };
}

async function recordDenied(db: GoogleGeocodingRuntimeDb, input: Parameters<typeof deniedAttempt>[0]) {
  return db.recordExecutionAttempt(deniedAttempt(input));
}

export async function runGoogleGeocodeProviderRead(input: {
  actor: GoogleGeocodeActor;
  request: unknown;
  db: GoogleGeocodingRuntimeDb;
  fetchImpl: GoogleGeocodeFetch;
  config?: GoogleGeocodeRuntimeConfig;
  autonomyPolicy?: AutonomyPolicyDefinition;
  now?: Date;
}) {
  const startedAt = (input.now ?? new Date()).toISOString();
  const parsed = requestSchema.safeParse(input.request);
  const propertyAddress = parsed.success ? parsed.data.propertyAddress : "";
  const idempotencyKey = createGoogleGeocodeIdempotencyKey({
    tenantId: input.actor.tenantId,
    propertyAddress: propertyAddress || "invalid-input",
    idempotencyKey: parsed.success ? parsed.data.idempotencyKey : undefined,
  });
  const traceId = sha256(`trace:${idempotencyKey}`);

  if (!parsed.success) {
    return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "invalid_input", reason: "Property address input is invalid." }), candidate: null };
  }

  const prior = await input.db.findAttemptByIdempotencyKey({ tenantId: input.actor.tenantId, idempotencyKey });
  if (prior?.providerCalled) {
    return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId: sha256(`duplicate:${idempotencyKey}:${startedAt}`), idempotencyKey: `${idempotencyKey}:duplicate:${Date.parse(startedAt)}`, startedAt, classification: "idempotent_duplicate", reason: "Idempotent request already has a provider-called attempt.", normalizedResult: { originalTraceId: prior.traceId } }), candidate: null };
  }

  const config = input.config ?? getGoogleGeocodingRuntimeConfig();
  const credential = config.googleGeocodingApiKey?.trim();
  if (config.googleGeocodingApiKey === undefined) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "credential_missing", reason: "GOOGLE_GEOCODING_API_KEY is missing." }), candidate: null };
  if (!credential) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "credential_empty", reason: "GOOGLE_GEOCODING_API_KEY is empty." }), candidate: null };

  const policy = input.autonomyPolicy ?? getGoogleGeocodeRuntimeAutonomyPolicy(config);
  const autonomyDecision = evaluateAutonomyPolicy({
    policy,
    requestedAction: GOOGLE_GEOCODE_ACTION,
    requestedLevel: 3,
    evidence: ["tenant_id", "preview_environment", "credential_scope", "hard_cost_budget", "ueip_audit"],
  });
  if (autonomyDecision.decision !== "allowed_internal") return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "policy_denied", reason: autonomyDecision.reason }), candidate: null };
  if (!config.level3Authorized || !config.providerReadEnabled) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "level_denied", reason: "Level 3 provider read is not explicitly authorized." }), candidate: null };
  if (config.killSwitchEnabled) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "kill_switch_active", reason: "Google Geocoding kill switch is active." }), candidate: null };

  const connectorPlan = evaluateConnectorAction({ connectorId: GOOGLE_GEOCODE_CONNECTOR_ID, actionKey: GOOGLE_GEOCODE_ACTION, module: input.actor.requestingModule });
  if (connectorPlan.decision === "blocked") return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "policy_denied", reason: connectorPlan.reason }), candidate: null };

  const dailyCalls = await input.db.countProviderCallsToday({ tenantId: input.actor.tenantId, connectorId: GOOGLE_GEOCODE_CONNECTOR_ID, actionKey: GOOGLE_GEOCODE_ACTION, since: todayStartIso(input.now) });
  const controls: VirtualDfdCostControls = {
    dailyQueryLimit: Math.min(config.dailyQueryLimit ?? 0, config.certificationQueryLimit ?? 0),
    dailyCreditLimit: Math.min(config.dailyQueryLimit ?? 0, config.certificationQueryLimit ?? 0),
    dailyDollarLimitCents: config.dailyDollarLimitCents ?? 0,
    perPropertyCostCents: config.perQueryCostCents ?? 0,
    queriesUsedToday: dailyCalls,
    creditsUsedToday: dailyCalls,
    dollarsUsedTodayCents: dailyCalls * (config.perQueryCostCents ?? 0),
    circuitBreaker: config.circuitBreaker ?? "open",
  };
  if (controls.circuitBreaker !== "closed") return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "circuit_breaker_open", reason: "Google Geocoding circuit breaker is open." }), candidate: null };
  if (controls.dailyQueryLimit <= 0 || controls.dailyDollarLimitCents <= 0) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "zero_budget", reason: "Google Geocoding provider budget is zero." }), candidate: null };
  if (controls.queriesUsedToday + 1 > controls.dailyQueryLimit) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "query_budget_exceeded", reason: "Google Geocoding query budget is exhausted." }), candidate: null };
  if (controls.dollarsUsedTodayCents + controls.perPropertyCostCents > controls.dailyDollarLimitCents) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "dollar_budget_exceeded", reason: "Google Geocoding dollar budget is exhausted." }), candidate: null };
  if ((config.providerErrorCount ?? 0) >= (config.providerErrorThreshold ?? 1)) return { ok: false, attempt: await recordDenied(input.db, { actor: input.actor, traceId, idempotencyKey, startedAt, classification: "circuit_breaker_open", reason: "Google Geocoding provider error threshold is exhausted." }), candidate: null };

  let providerJson: unknown;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://geocode.googleapis.com/v4/geocode/address/${encodeURIComponent(parsed.data.propertyAddress)}`;
    const response = await input.fetchImpl(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": credential,
        "X-Goog-FieldMask": "results.formattedAddress,results.placeId,results.location,results.addressComponents,results.granularity",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      return { ok: false, attempt: await input.db.recordExecutionAttempt(providerFailureAttempt({ actor: input.actor, traceId, idempotencyKey, startedAt, classification: "provider_error", reason: `Google Geocoding returned HTTP ${response.status}.`, queryCount: 1 })), candidate: null };
    }
    providerJson = await response.json();
  } catch (error) {
    const classification: GoogleGeocodeResultClassification = error instanceof Error && error.name === "AbortError" ? "provider_timeout" : "provider_error";
    return { ok: false, attempt: await input.db.recordExecutionAttempt(providerFailureAttempt({ actor: input.actor, traceId, idempotencyKey, startedAt, classification, reason: classification === "provider_timeout" ? "Google Geocoding provider request timed out." : "Google Geocoding provider request failed.", queryCount: 1 })), candidate: null };
  }

  const normalized = normalizeGoogleGeocodeProviderResponse(providerJson);
  const draft = mapGoogleGeocodeToPropertyCandidateInput({
    requestedAddress: parsed.data.propertyAddress,
    collectedAt: startedAt,
    result: {
      placeId: normalized.placeId,
      formattedAddress: normalized.formattedAddress,
      location: typeof normalized.latitude === "number" && typeof normalized.longitude === "number" ? { latitude: normalized.latitude, longitude: normalized.longitude } : undefined,
      addressComponents: normalized.addressComponents,
      granularity: normalized.locationType ?? undefined,
    },
  });
  const normalizedAddress = normalizePropertyCandidateAddress(draft.propertyCandidateInput);
  const duplicateKey = createPropertyCandidateDuplicateKey(draft.propertyCandidateInput);
  const duplicate = await input.db.findCandidateByDuplicateKey({ tenantId: input.actor.tenantId, duplicateKey });
  const duplicateStatus = duplicate ? "duplicate_candidate" : "unique";
  const candidate = await input.db.createPropertyCandidate({
    id: randomUUID(),
    tenantId: input.actor.tenantId,
    propertyCandidateInput: propertyCandidateInputSchema.parse({
      ...draft.propertyCandidateInput,
      source: "manual_property_review",
      sourceDetail: "Google Geocoding Preview provider-read staged as PropertyCandidate. No Lead, PropertyOpportunity, task, outreach, or provider write was created.",
      costCents: controls.perPropertyCostCents,
      creditsUsed: 1,
      sourceEvidence: {
        ...draft.propertyCandidateInput.sourceEvidence,
        intendedSource: "google_geocode",
        certificationRecord: true,
        excludedFromBusinessRoi: true,
        providerCalled: true,
        providerCostCents: controls.perPropertyCostCents,
        creditsUsed: 1,
      },
    }),
    normalizedAddress,
    duplicateKey,
    duplicateStatus,
    providerCalled: true,
    providerWrite: false,
    sent: false,
    published: false,
    outreach: false,
    crmMutated: false,
    skipTracePerformed: false,
    directMailSent: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  });
  const attempt = await input.db.recordExecutionAttempt(allowedAttempt({
    actor: input.actor,
    traceId,
    idempotencyKey,
    startedAt,
    normalizedResult: {
      formattedAddress: normalized.formattedAddress,
      placeId: normalized.placeId,
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      locationType: normalized.locationType,
      duplicateStatus,
      candidateId: candidate.id,
      prohibitedInferences: [],
    },
    queryCount: 1,
    costCents: controls.perPropertyCostCents,
    creditsUsed: 1,
    reason: "Google Geocoding provider read succeeded and staged one PropertyCandidate.",
  }));

  return { ok: true, attempt, candidate };
}
