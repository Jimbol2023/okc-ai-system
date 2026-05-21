import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ActivationAuditEventInvariants,
  createR48ControlledActivationAuditEvent,
  type R48ActivationAuditEventInput,
  type R48ActivationAuditEventRecord,
} from "./r48-controlled-activation-audit-event-contract";

const safeInput: R48ActivationAuditEventInput = {
  eventType: "r48_controlled_activation_dry_run",
  eventStatus: "recorded_simulation_only",
  decision: "simulation_only_ready",
  reasonCodes: ["simulation_only_ready"],
  operatorReviewRequired: false,
  providerBoundaryStatus: "safe_disabled",
  killSwitchStatus: "safe",
  allowlistStatus: "matched",
  persistenceRecommended: true,
  createdAt: "2026-05-21T18:00:00.000Z",
  metadata: {
    correlationId: "r48h-correlation-1",
    scenarioId: "r48h-scenario-1",
    operatorId: "operator-1",
  },
  phone: "4055551212",
  messageBody: "Dry run only. Do not send this message to 405-555-1212.",
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
};

function assertExecutionImpossible(result: R48ActivationAuditEventRecord) {
  const invariantCheck = assertR48ActivationAuditEventInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveTestReady, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.reasonCodes, []);
}

describe("R48 controlled activation audit event contract", () => {
  it("creates fail-closed audit event with default missing input", () => {
    const result = createR48ControlledActivationAuditEvent();

    assert.equal(result.eventStatus, "blocked");
    assert.equal(result.decision, "missing");
    assert.equal(result.operatorReviewRequired, true);
    assert.equal(result.persistenceRecommended, false);
    assert.equal(result.createdAtSource, "omitted");
    assert.ok(result.reasonCodes.includes("input_missing"));
    assert.ok(result.reasonCodes.includes("decision_missing"));
    assertExecutionImpossible(result);
  });

  it("represents prohibited decisions clearly", () => {
    const result = createR48ControlledActivationAuditEvent({
      ...safeInput,
      decision: "prohibited",
      eventStatus: undefined,
    });

    assert.equal(result.eventStatus, "prohibited");
    assert.equal(result.decision, "prohibited");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.reasonCodes.includes("decision_prohibited"));
    assertExecutionImpossible(result);
  });

  it("represents blocked decisions clearly", () => {
    const result = createR48ControlledActivationAuditEvent({
      ...safeInput,
      decision: "blocked",
      eventStatus: undefined,
    });

    assert.equal(result.eventStatus, "blocked");
    assert.equal(result.decision, "blocked");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.reasonCodes.includes("decision_blocked"));
    assertExecutionImpossible(result);
  });

  it("safe dry-run event remains simulation-only", () => {
    const result = createR48ControlledActivationAuditEvent(safeInput);

    assert.equal(result.eventStatus, "recorded_simulation_only");
    assert.equal(result.decision, "simulation_only_ready");
    assert.equal(result.persistenceRecommended, true);
    assert.equal(result.secretRedactionApplied, true);
    assert.equal(result.createdAtSource, "provided");
    assertExecutionImpossible(result);
  });

  it("captures attempted execution indicators as prohibited", () => {
    const result = createR48ControlledActivationAuditEvent({
      ...safeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.equal(result.operatorReviewRequired, true);
    assert.equal(result.persistenceRecommended, false);
    assert.ok(result.reasonCodes.includes("attempted_execution_indicator_detected"));
    assert.ok(result.reasonCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_test_ready_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("redacts secret-like fields", () => {
    const result = createR48ControlledActivationAuditEvent({
      ...safeInput,
      eventType: "token-bearing-event",
      metadata: {
        api_key: "secret-value",
        database_url: "postgres://user:pass@example/db",
        safeNote: "ok",
      },
      reasonCodes: ["bearer token should not survive"],
    });

    assert.equal(result.eventType, "[REDACTED]");
    assert.equal(result.sanitizedMetadata.api_key, "[REDACTED]");
    assert.equal(result.sanitizedMetadata.database_url, "[REDACTED]");
    assert.equal(result.sanitizedMetadata.safeNote, "ok");
    assert.ok(result.reasonCodes.includes("[REDACTED]"));
    assert.ok(result.reasonCodes.includes("secret_redaction_applied"));
    assertExecutionImpossible(result);
  });

  it("masks phone-like values if included", () => {
    const result = createR48ControlledActivationAuditEvent({
      ...safeInput,
      phone: "(405) 555-1212",
      metadata: {
        sellerPhone: "405.555.9876",
      },
      messageBody: "Message would have gone to 405-555-1212, but this is dry-run only.",
    });

    assert.equal(result.maskedPhone, "***-***-1212");
    assert.equal(result.sanitizedMetadata.sellerPhone, "***-***-9876");
    assert.ok(result.messageSummary?.includes("***-***-1212"));
    assert.ok(result.reasonCodes.includes("phone_value_masked"));
    assertExecutionImpossible(result);
  });

  it("does not perform DB or write side effects", () => {
    const result = createR48ControlledActivationAuditEvent(safeInput);

    assert.equal(result.persistenceExecuted, false);
    assert.ok(result.reasonCodes.includes("no_db_write_performed"));
    assertExecutionImpossible(result);
  });

  it("preserves hard invariants in every result", () => {
    const inputs: R48ActivationAuditEventInput[] = [
      {},
      safeInput,
      { ...safeInput, decision: "prohibited" },
      { ...safeInput, decision: "blocked" },
      { ...safeInput, decision: "dry_run_rejected" },
      { ...safeInput, activationExecuted: true, sent: true },
      { ...safeInput, simulationOnly: false },
    ];

    for (const input of inputs) {
      assertExecutionImpossible(createR48ControlledActivationAuditEvent(input));
    }
  });
});
