import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledActivationAuditPersistencePlanInvariants,
  createR48ControlledActivationAuditPersistencePlan,
  type R48AuditPersistenceEventSignal,
  type R48ControlledActivationAuditPersistencePlanResult,
} from "./r48-controlled-activation-audit-persistence-plan-contract";

const safeAuditEvent: R48AuditPersistenceEventSignal = {
  eventType: "r48_controlled_activation_dry_run",
  eventStatus: "recorded_simulation_only",
  decision: "simulation_only_ready",
  reasonCodes: ["simulation_only_ready", "secret_redaction_applied"],
  operatorReviewRequired: false,
  secretRedactionApplied: true,
  persistenceRecommended: true,
  persistenceExecuted: false,
  sanitizedMetadata: {
    correlationId: "r48i-correlation-1",
    scenarioId: "r48i-scenario-1",
    operatorId: "operator-1",
  },
  createdAtSource: "provided",
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
};

const safeInput = {
  auditEvent: safeAuditEvent,
  schemaReviewed: true,
  retentionPolicyDefined: true,
  failureHandlingDefined: true,
  secretRedactionReviewed: true,
  operatorReviewCompleted: true,
};

function assertExecutionImpossible(result: R48ControlledActivationAuditPersistencePlanResult) {
  const invariantCheck = assertR48ControlledActivationAuditPersistencePlanInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveTestReady, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.reasonCodes, []);
}

describe("R48 controlled activation audit persistence plan contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48ControlledActivationAuditPersistencePlan();

    assert.equal(result.planStatus, "not_persistable");
    assert.equal(result.persistenceRecommended, false);
    assert.equal(result.persistenceAllowedNow, false);
    assert.equal(result.storageTarget, "none");
    assert.ok(result.reasonCodes.includes("event_missing"));
    assertExecutionImpossible(result);
  });

  it("unsafe non-redacted event is not persistable", () => {
    const result = createR48ControlledActivationAuditPersistencePlan({
      ...safeInput,
      auditEvent: {
        ...safeAuditEvent,
        simulationOnly: false,
        sent: true,
        persistenceExecuted: true,
        secretRedactionApplied: false,
      },
    });

    assert.equal(result.planStatus, "not_persistable");
    assert.ok(result.reasonCodes.includes("event_not_simulation_only"));
    assert.ok(result.reasonCodes.includes("event_invariants_unsafe"));
    assert.ok(result.reasonCodes.includes("event_secret_redaction_missing"));
    assertExecutionImpossible(result);
  });

  it("secret redaction missing blocks persistence", () => {
    const result = createR48ControlledActivationAuditPersistencePlan({
      ...safeInput,
      auditEvent: {
        ...safeAuditEvent,
        secretRedactionApplied: false,
      },
    });

    assert.equal(result.planStatus, "persistence_blocked");
    assert.equal(result.requiresSecretRedaction, true);
    assert.ok(result.reasonCodes.includes("event_secret_redaction_missing"));
    assertExecutionImpossible(result);
  });

  it("prohibited event can be recommended for future audit but not persisted now", () => {
    const result = createR48ControlledActivationAuditPersistencePlan({
      ...safeInput,
      auditEvent: {
        ...safeAuditEvent,
        eventStatus: "prohibited",
        decision: "prohibited",
        persistenceRecommended: true,
      },
    });

    assert.equal(result.planStatus, "persistence_plan_ready");
    assert.equal(result.persistenceRecommended, true);
    assert.equal(result.persistenceAllowedNow, false);
    assert.equal(result.storageTarget, "future_audit_log");
    assert.ok(result.reasonCodes.includes("event_status_prohibited"));
    assertExecutionImpossible(result);
  });

  it("blocked event can be recommended for future audit but not persisted now", () => {
    const result = createR48ControlledActivationAuditPersistencePlan({
      ...safeInput,
      auditEvent: {
        ...safeAuditEvent,
        eventStatus: "blocked",
        decision: "blocked",
        persistenceRecommended: true,
      },
    });

    assert.equal(result.planStatus, "persistence_plan_ready");
    assert.equal(result.persistenceAllowedNow, false);
    assert.ok(result.reasonCodes.includes("event_status_blocked"));
    assertExecutionImpossible(result);
  });

  it("safe dry-run event can produce persistence plan ready", () => {
    const result = createR48ControlledActivationAuditPersistencePlan({
      ...safeInput,
      auditEvent: {
        ...safeAuditEvent,
        eventStatus: "recorded_planning_only",
        decision: "planning_only",
      },
    });

    assert.equal(result.planStatus, "persistence_plan_ready");
    assert.equal(result.persistenceRecommended, true);
    assert.equal(result.storageTarget, "future_audit_log");
    assert.ok(result.reasonCodes.includes("persistence_plan_ready"));
    assertExecutionImpossible(result);
  });

  it("safe simulation-only dry-run recommends simulation-only persistence", () => {
    const result = createR48ControlledActivationAuditPersistencePlan(safeInput);

    assert.equal(result.planStatus, "simulation_only_persistence_recommended");
    assert.equal(result.persistenceRecommended, true);
    assert.equal(result.persistenceAllowedNow, false);
    assert.ok(result.reasonCodes.includes("future_audit_persistence_recommended"));
    assertExecutionImpossible(result);
  });

  it("persistenceAllowedNow is always false", () => {
    const results = [
      createR48ControlledActivationAuditPersistencePlan(),
      createR48ControlledActivationAuditPersistencePlan(safeInput),
      createR48ControlledActivationAuditPersistencePlan({
        ...safeInput,
        auditEvent: {
          ...safeAuditEvent,
          eventStatus: "rejected",
          decision: "dry_run_rejected",
        },
      }),
    ];

    for (const result of results) {
      assert.equal(result.persistenceAllowedNow, false);
      assertExecutionImpossible(result);
    }
  });

  it("does not perform DB or write side effects", () => {
    const result = createR48ControlledActivationAuditPersistencePlan(safeInput);

    assert.equal(result.persistenceAllowedNow, false);
    assert.ok(result.reasonCodes.includes("persistence_not_allowed_now"));
    assertExecutionImpossible(result);
  });

  it("preserves hard invariants in every result", () => {
    const results = [
      createR48ControlledActivationAuditPersistencePlan(),
      createR48ControlledActivationAuditPersistencePlan(safeInput),
      createR48ControlledActivationAuditPersistencePlan({
        ...safeInput,
        auditEvent: {
          ...safeAuditEvent,
          activationExecuted: true,
          providerActivationAllowed: true,
          liveExecutionAllowed: true,
          sent: true,
          providerCalled: true,
          canSendNow: true,
          liveTestReady: true,
        },
      }),
    ];

    for (const result of results) {
      assertExecutionImpossible(result);
    }
  });
});
