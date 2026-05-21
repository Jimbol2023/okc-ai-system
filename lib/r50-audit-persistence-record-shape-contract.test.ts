import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR50AuditPersistenceRecordShapeInvariants,
  createR50AuditPersistenceRecordShape,
  type R50AuditPersistenceRecordShapeInput,
  type R50AuditPersistenceRecordShapeResult,
} from "./r50-audit-persistence-record-shape-contract";

const safeInput: R50AuditPersistenceRecordShapeInput = {
  eventType: "controlled_activation_dry_run",
  eventStatus: "recorded_simulation_only",
  decision: "simulation_only_ready",
  governanceStatus: "simulation_stack_complete",
  reasonCodes: ["simulation_only_governed"],
  operatorReviewRequired: false,
  providerBoundaryStatus: "provider_disabled",
  killSwitchStatus: "safe",
  allowlistStatus: "reviewed",
  advisoryOnly: true,
  simulationOnly: true,
  secretRedactionApplied: true,
  createdAt: "2026-05-21T00:00:00.000Z",
  remainingBlockers: [],
  requiredOperatorActions: [],
  metadata: {
    dryRunId: "dry-run-1",
    attemptCount: 1,
    reviewed: true,
  },
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertExecutionImpossible(result: R50AuditPersistenceRecordShapeResult) {
  const invariantCheck = assertR50AuditPersistenceRecordShapeInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveTestReady, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.advisoryOnly, true);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.reasonCodes, []);
}

function assertNoSecretSurvives(value: unknown) {
  const serialized = JSON.stringify(value).toLowerCase();

  assert.equal(serialized.includes("sk_live"), false);
  assert.equal(serialized.includes("database_url=postgres"), false);
  assert.equal(serialized.includes("direct_url=postgres"), false);
  assert.equal(serialized.includes("bearer token"), false);
  assert.equal(serialized.includes("session_token"), false);
}

describe("R50 audit persistence record shape contract", () => {
  it("missing default input fails closed", () => {
    const result = createR50AuditPersistenceRecordShape();

    assert.equal(result.recordStatus, "shape_blocked");
    assert.equal(result.futureStorageTarget, "none");
    assert.ok(result.reasonCodes.includes("input_missing"));
    assert.ok(result.reasonCodes.includes("event_type_missing"));
    assert.ok(result.reasonCodes.includes("decision_missing"));
    assert.ok(result.reasonCodes.includes("advisory_only_required"));
    assertExecutionImpossible(result);
  });

  it("forbidden fields are rejected or redacted", () => {
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      forbiddenFields: {
        apiKey: "sk_live_123",
        rawCookie: "session_token=abc",
      },
      metadata: {
        apiKey: "sk_live_123",
        authHeader: "Bearer token",
        safeField: "safe value",
      },
    });

    assert.equal(result.recordStatus, "shape_ready_for_review");
    assert.ok(result.reasonCodes.includes("forbidden_field_rejected"));
    assert.ok(result.reasonCodes.includes("secret_redaction_applied"));
    assert.ok(result.rejectedFieldNames.includes("[REDACTED]"));
    assert.equal(result.sanitizedMetadata.apiKey, "[REDACTED]");
    assert.equal(result.sanitizedMetadata.authHeader, "[REDACTED]");
    assertNoSecretSurvives(result);
    assertExecutionImpossible(result);
  });

  it("phone-like values are masked", () => {
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      phone: "405-555-1234",
      messageBody: "Call me at 405-555-1234 about the property.",
      metadata: {
        callback: "405.555.9999",
      },
    });

    assert.equal(result.maskedPhoneSuffix, "***-***-1234");
    assert.ok(result.messageSummary?.includes("***-***-1234"));
    assert.equal(result.sanitizedMetadata.callback, "***-***-9999");
    assert.ok(result.reasonCodes.includes("phone_value_masked"));
    assert.equal(JSON.stringify(result).includes("405-555-1234"), false);
    assertExecutionImpossible(result);
  });

  it("bounded arrays are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      reasonCodes: manyValues,
      remainingBlockers: manyValues,
      requiredOperatorActions: manyValues,
      metadata: Object.fromEntries(manyValues.map((value, index) => [`key_${index}`, value])),
    });

    assert.equal(result.reasonCodes.length, 40);
    assert.equal(result.remainingBlockers.length, 40);
    assert.equal(result.requiredOperatorActions.length, 40);
    assert.equal(Object.keys(result.sanitizedMetadata).length, 40);
    assert.ok(result.reasonCodes.every((value) => value.length <= 183));
    assert.ok(result.remainingBlockers.every((value) => value.length <= 183));
    assert.ok(result.requiredOperatorActions.every((value) => value.length <= 183));
    assertExecutionImpossible(result);
  });

  it("advisoryOnly remains true and simulationOnly remains true", () => {
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      advisoryOnly: false,
      simulationOnly: false,
    });

    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.ok(result.reasonCodes.includes("advisory_only_required"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("persistenceAllowedNow remains false", () => {
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      persistenceAllowedNow: true,
    });

    assert.equal(result.persistenceAllowedNow, false);
    assert.ok(result.reasonCodes.includes("persistence_not_allowed_now"));
    assert.ok(result.rejectedFieldNames.includes("persistenceAllowedNow"));
    assertExecutionImpossible(result);
  });

  it("no execution flags or provider activation become true", () => {
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.equal(result.recordStatus, "shape_blocked");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.rejectedFieldNames.includes("providerActivationAllowed"));
    assert.ok(result.rejectedFieldNames.includes("canSendNow"));
    assertExecutionImpossible(result);
  });

  it("no secrets survive shaping", () => {
    const result = createR50AuditPersistenceRecordShape({
      ...safeInput,
      eventType: "DATABASE_URL=postgres://secret",
      reasonCodes: ["DIRECT_URL=postgres://secret"],
      providerBoundaryStatus: "authorization bearer token",
      killSwitchStatus: "safe",
      allowlistStatus: "api_key present",
      messageBody: "password should not persist",
      metadata: {
        databaseUrl: "DATABASE_URL=postgres://secret",
        directUrl: "DIRECT_URL=postgres://secret",
        nested: { token: "abc" },
      },
    });

    assert.equal(result.eventType, "[REDACTED]");
    assert.equal(result.providerBoundaryStatus, "[REDACTED]");
    assert.equal(result.allowlistStatus, "[REDACTED]");
    assert.equal(result.messageSummary, "[REDACTED]");
    assertNoSecretSurvives(result);
    assertExecutionImpossible(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR50AuditPersistenceRecordShape(),
      createR50AuditPersistenceRecordShape(safeInput),
      createR50AuditPersistenceRecordShape({
        ...safeInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        advisoryOnly: false,
        simulationOnly: false,
        liveTestReady: true,
        persistenceAllowedNow: true,
      }),
    ];

    for (const result of results) {
      assertExecutionImpossible(result);
    }
  });
});
