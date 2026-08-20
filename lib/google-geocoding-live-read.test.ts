import assert from "node:assert/strict";
import { test } from "node:test";

import type { AutonomyPolicyDefinition } from "@/lib/autonomy-policy";
import {
  GOOGLE_GEOCODE_ACTION,
  GOOGLE_GEOCODE_CONNECTOR_ID,
  createGoogleGeocodeIdempotencyKey,
  getGoogleGeocodeRuntimeAutonomyPolicy,
  normalizeGoogleGeocodeProviderResponse,
  runGoogleGeocodeProviderRead,
  type GoogleGeocodeExecutionAttempt,
  type GoogleGeocodingRuntimeDb,
  type GoogleGeocodeRuntimeConfig,
} from "@/lib/google-geocoding-live-read";
import type { GoogleGeocodeStagedCandidate } from "@/lib/google-geocoding-live-read";

const actor = { tenantId: "tenant-alpha", actorId: "tester", requestingModule: "Virtual DFD" as const };

const allowPolicy: AutonomyPolicyDefinition = {
  policyKey: "google-geocode-test-allow",
  lane: "virtual_dfd_property_discovery",
  subjectType: "connector",
  subjectKey: GOOGLE_GEOCODE_CONNECTOR_ID,
  actionKey: GOOGLE_GEOCODE_ACTION,
  maxAutonomyLevel: 3,
  effect: "allow",
  approvalRequired: false,
  quotaPerDay: 3,
  killSwitchEnabled: false,
  allowedActions: [GOOGLE_GEOCODE_ACTION],
  blockedActions: [],
  requiredEvidence: ["tenant_id", "preview_environment", "credential_scope", "hard_cost_budget", "ueip_audit"],
  escalationRules: [],
  safetyNotes: "Test policy only.",
};

function enabledConfig(overrides: Partial<GoogleGeocodeRuntimeConfig> = {}): GoogleGeocodeRuntimeConfig {
  return {
    googleGeocodingApiKey: "test-key-not-real",
    providerReadEnabled: true,
    level3Authorized: true,
    killSwitchEnabled: false,
    certificationQueryLimit: 3,
    dailyQueryLimit: 3,
    dailyDollarLimitCents: 100,
    perQueryCostCents: 1,
    maxRetries: 0,
    circuitBreaker: "closed",
    providerErrorCount: 0,
    providerErrorThreshold: 3,
    environment: "preview",
    ...overrides,
  };
}

function createMockDb(seed: { providerCallsToday?: number; duplicateCandidate?: boolean; priorAttempt?: GoogleGeocodeExecutionAttempt | null } = {}): GoogleGeocodingRuntimeDb & {
  attempts: GoogleGeocodeExecutionAttempt[];
  candidates: GoogleGeocodeStagedCandidate[];
  leads: unknown[];
  opportunities: unknown[];
  tasks: unknown[];
} {
  const attempts: GoogleGeocodeExecutionAttempt[] = seed.priorAttempt ? [seed.priorAttempt] : [];
  const candidates: GoogleGeocodeStagedCandidate[] = [];

  return {
    attempts,
    candidates,
    leads: [],
    opportunities: [],
    tasks: [],
    async countProviderCallsToday() {
      return seed.providerCallsToday ?? attempts.filter((attempt) => attempt.providerCalled).length;
    },
    async findAttemptByIdempotencyKey(input) {
      return attempts.find((attempt) => attempt.tenantId === input.tenantId && attempt.idempotencyKey === input.idempotencyKey) ?? null;
    },
    async recordExecutionAttempt(input) {
      attempts.push(input);
      return input;
    },
    async findCandidateByDuplicateKey() {
      return seed.duplicateCandidate ? { id: "candidate-existing", duplicateKey: "duplicate" } : null;
    },
    async createPropertyCandidate(input) {
      candidates.push(input);
      return { id: input.id, duplicateStatus: input.duplicateStatus, reviewStatus: input.duplicateStatus === "unique" ? "new" : "needs_verification" };
    },
  };
}

function okFetch() {
  return async (url: string, init: { headers: Record<string, string> }) => {
    assert.ok(url.startsWith("https://geocode.googleapis.com/v4/geocode/address/"));
    assert.equal(init.headers["X-Goog-Api-Key"], "test-key-not-real");
    assert.ok(init.headers["X-Goog-FieldMask"].includes("results.formattedAddress"));

    return {
      ok: true,
      status: 200,
      async json() {
        return {
          results: [
            {
              formattedAddress: "100 Test Ave, Oklahoma City, OK 73102, USA",
              placeId: "place-123",
              location: { latitude: 35.4676, longitude: -97.5164 },
              granularity: "ROOFTOP",
              addressComponents: [
                { longText: "Oklahoma City", shortText: "Oklahoma City", types: ["locality"] },
                { longText: "Oklahoma", shortText: "OK", types: ["administrative_area_level_1"] },
                { longText: "73102", shortText: "73102", types: ["postal_code"] },
              ],
            },
          ],
        };
      },
    };
  };
}

async function expectBlocked(classification: string, config: Partial<GoogleGeocodeRuntimeConfig> = {}, options: { policy?: AutonomyPolicyDefinition; request?: unknown; db?: ReturnType<typeof createMockDb> } = {}) {
  let providerCalls = 0;
  const result = await runGoogleGeocodeProviderRead({
    actor,
    request: options.request ?? { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: `test-${classification}` },
    db: options.db ?? createMockDb(),
    config: enabledConfig(config),
    autonomyPolicy: options.policy ?? allowPolicy,
    fetchImpl: async () => {
      providerCalls += 1;
      return okFetch()("unused", { headers: { "X-Goog-Api-Key": "test-key-not-real", "X-Goog-FieldMask": "" } });
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.attempt.resultClassification, classification);
  assert.equal(result.attempt.providerCalled, false);
  assert.equal(providerCalls, 0);
}

test("credential gates fail closed for missing and empty GOOGLE_GEOCODING_API_KEY", async () => {
  await expectBlocked("credential_missing", { googleGeocodingApiKey: undefined });
  await expectBlocked("credential_empty", { googleGeocodingApiKey: "   " });
});

test("policy, Level 2, kill switch, zero budget, and budget exhaustion block before provider call", async () => {
  await expectBlocked("policy_denied", {}, { policy: { ...allowPolicy, effect: "deny" } });
  await expectBlocked("policy_denied", {}, { policy: { ...allowPolicy, approvalRequired: true } });
  await expectBlocked("level_denied", { level3Authorized: false });
  await expectBlocked("kill_switch_active", { killSwitchEnabled: true });
  await expectBlocked("zero_budget", { dailyQueryLimit: 0, certificationQueryLimit: 0, dailyDollarLimitCents: 0 });
  await expectBlocked("query_budget_exceeded", {}, { db: createMockDb({ providerCallsToday: 3 }) });
  await expectBlocked("dollar_budget_exceeded", { perQueryCostCents: 101 });
  await expectBlocked("circuit_breaker_open", { circuitBreaker: "open" });
});

test("runtime policy is default closed and opens only for bounded Preview Level 3 provider-read", async () => {
  assert.equal(getGoogleGeocodeRuntimeAutonomyPolicy(enabledConfig({ environment: "production" })).effect, "deny");
  assert.equal(getGoogleGeocodeRuntimeAutonomyPolicy(enabledConfig({ providerReadEnabled: false })).effect, "deny");
  assert.equal(getGoogleGeocodeRuntimeAutonomyPolicy(enabledConfig()).effect, "allow");

  const db = createMockDb();
  const result = await runGoogleGeocodeProviderRead({
    actor,
    request: { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "runtime-policy-allow" },
    db,
    config: enabledConfig(),
    fetchImpl: okFetch(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.attempt.policyDecision, "allowed");
  assert.equal(result.attempt.providerCalled, true);
});

test("provider timeout and provider error record truthful denied attempts", async () => {
  let providerErrorCalls = 0;
  const providerErrorResult = await runGoogleGeocodeProviderRead({
    actor,
    request: { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "provider-error" },
    db: createMockDb(),
    config: enabledConfig(),
    autonomyPolicy: allowPolicy,
    fetchImpl: async () => {
      providerErrorCalls += 1;
      return { ok: false, status: 500, async json() { return {}; } };
    },
  });
  const timeoutDb = createMockDb();
  let timeoutCalls = 0;
  const timeoutResult = await runGoogleGeocodeProviderRead({
    actor,
    request: { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "provider-timeout" },
    db: timeoutDb,
    config: enabledConfig(),
    autonomyPolicy: allowPolicy,
    fetchImpl: async () => {
      timeoutCalls += 1;
      throw Object.assign(new Error("aborted"), { name: "AbortError" });
    },
  });

  assert.equal(providerErrorResult.attempt.resultClassification, "provider_error");
  assert.equal(providerErrorResult.attempt.providerCalled, true);
  assert.equal(providerErrorResult.attempt.queryCount, 1);
  assert.equal(providerErrorCalls, 1);
  assert.equal(timeoutResult.attempt.resultClassification, "provider_timeout");
  assert.equal(timeoutResult.attempt.providerCalled, true);
  assert.equal(timeoutCalls, 1);
});

test("valid mocked provider response stages one PropertyCandidate and records providerCalled truth", async () => {
  const db = createMockDb();
  const result = await runGoogleGeocodeProviderRead({
    actor,
    request: { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "valid-geocode" },
    db,
    config: enabledConfig(),
    autonomyPolicy: allowPolicy,
    fetchImpl: okFetch(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.attempt.connectorId, GOOGLE_GEOCODE_CONNECTOR_ID);
  assert.equal(result.attempt.actionKey, GOOGLE_GEOCODE_ACTION);
  assert.equal(result.attempt.providerCalled, true);
  assert.equal(result.attempt.providerWrite, false);
  assert.equal(result.attempt.queryCount, 1);
  assert.equal(result.attempt.costCents, 1);
  assert.equal(db.candidates.length, 1);
  assert.equal(db.candidates[0].propertyCandidateInput.sourceEvidence.providerCalled, true);
  assert.equal(db.candidates[0].propertyCandidateInput.sourceEvidence.excludedFromBusinessRoi, true);
  assert.deepEqual(result.attempt.normalizedResult?.prohibitedInferences, []);
  assert.equal(db.leads.length, 0);
  assert.equal(db.opportunities.length, 0);
  assert.equal(db.tasks.length, 0);
});

test("same idempotency key does not generate unlimited provider calls", async () => {
  const idempotencyKey = createGoogleGeocodeIdempotencyKey({ tenantId: actor.tenantId, propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "repeat-key" });
  const prior: GoogleGeocodeExecutionAttempt = {
    id: "attempt-1",
    tenantId: actor.tenantId,
    traceId: "trace-1",
    idempotencyKey,
    connectorId: GOOGLE_GEOCODE_CONNECTOR_ID,
    capabilityKey: "property.address.geocode.read",
    actionKey: GOOGLE_GEOCODE_ACTION,
    actorId: actor.actorId,
    requestingModule: actor.requestingModule,
    policyDecision: "allowed",
    reason: "prior",
    resultClassification: "candidate_staged",
    queryCount: 1,
    costCents: 1,
    creditsUsed: 1,
    normalizedResult: {},
    redactionApplied: true,
    providerCalled: true,
    providerWrite: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    startedAt: "2026-08-20T00:00:00.000Z",
    completedAt: "2026-08-20T00:00:01.000Z",
  };

  await expectBlocked("idempotent_duplicate", {}, { db: createMockDb({ priorAttempt: prior }), request: { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "repeat-key" } });
});

test("duplicate candidate is classified explicitly without silent merge", async () => {
  const db = createMockDb({ duplicateCandidate: true });
  const result = await runGoogleGeocodeProviderRead({
    actor,
    request: { propertyAddress: "100 Test Ave Oklahoma City OK", idempotencyKey: "duplicate-candidate" },
    db,
    config: enabledConfig(),
    autonomyPolicy: allowPolicy,
    fetchImpl: okFetch(),
  });

  assert.equal(result.ok, true);
  assert.equal(db.candidates[0].duplicateStatus, "duplicate_candidate");
  assert.equal(result.candidate?.duplicateStatus, "duplicate_candidate");
});

test("normalizer exposes allowed geocode fields only", () => {
  const normalized = normalizeGoogleGeocodeProviderResponse({
    results: [{ formattedAddress: "A", placeId: "P", location: { latitude: 1, longitude: 2 }, addressComponents: [], granularity: "ROOFTOP", ownerName: "must not pass" }],
  });

  assert.deepEqual(Object.keys(normalized).sort(), ["addressComponents", "formattedAddress", "latitude", "locationType", "longitude", "placeId", "providerStatus"].sort());
});
