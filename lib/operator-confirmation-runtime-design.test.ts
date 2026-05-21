import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertOperatorConfirmationRuntimeInvariants,
  createOperatorConfirmationRuntimeDesign,
  type OperatorConfirmationRuntimeInput,
} from "./operator-confirmation-runtime-design";

const runtimeContract: NonNullable<OperatorConfirmationRuntimeInput["runtimeContract"]> = {
  ok: true,
  adapterOnly: true,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  reasonCodes: ["runtime_contract_adapter_only"],
  safetySummary: "Adapter preview only.",
};

describe("operator confirmation runtime design", () => {
  it("validates exact simulated action confirmation without enabling send", () => {
    const result = createOperatorConfirmationRuntimeDesign({
      runtimeContract,
      confirmationRequested: true,
      operatorConfirmed: true,
      operatorId: "operator-1",
      confirmationIntent: "confirm_simulated_live_test_action",
      expectedActionFingerprint: "sms:length-10:message-42",
      confirmationActionFingerprint: "sms:length-10:message-42",
      expectedConfirmationContextId: "context-1",
      confirmationContextId: "context-1",
      confirmationCreatedAtMs: 1000,
      evaluatedAtMs: 2000,
      expiresAfterMs: 5000,
    });

    assert.equal(result.state, "operator_confirmed_simulation_only");
    assert.equal(result.operatorConfirmed, true);
    assert.equal(result.confirmationValid, true);
    assert.equal(result.canProceedToLiveTest, false);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
    assert.ok(result.reasonCodes.includes("operator_confirmation_valid_for_simulation_only"));
    assert.ok(result.reasonCodes.includes("live_execution_not_available"));
  });

  it("fails closed when action fingerprints do not match", () => {
    const result = createOperatorConfirmationRuntimeDesign({
      runtimeContract,
      confirmationRequested: true,
      operatorConfirmed: true,
      confirmationIntent: "confirm_simulated_live_test_action",
      expectedActionFingerprint: "expected-action",
      confirmationActionFingerprint: "different-action",
      confirmationCreatedAtMs: 1000,
      evaluatedAtMs: 2000,
      expiresAfterMs: 5000,
    });

    assert.equal(result.state, "confirmation_mismatch");
    assert.equal(result.confirmationValid, false);
    assert.ok(result.reasonCodes.includes("operator_confirmation_action_mismatch"));
    assert.equal(result.canProceedToLiveTest, false);
  });

  it("fails closed when confirmation is expired", () => {
    const result = createOperatorConfirmationRuntimeDesign({
      runtimeContract,
      confirmationRequested: true,
      operatorConfirmed: true,
      confirmationIntent: "confirm_simulated_live_test_action",
      expectedActionFingerprint: "action",
      confirmationActionFingerprint: "action",
      confirmationCreatedAtMs: 1000,
      evaluatedAtMs: 7001,
      expiresAfterMs: 5000,
    });

    assert.equal(result.state, "confirmation_expired");
    assert.equal(result.confirmationValid, false);
    assert.ok(result.reasonCodes.includes("operator_confirmation_expired"));
    assert.equal(result.canProceedToLiveTest, false);
  });

  it("fails closed when runtime contract is blocked", () => {
    const result = createOperatorConfirmationRuntimeDesign({
      runtimeContract: {
        ...runtimeContract,
        ok: false,
        reasonCodes: ["allowlist_fail_closed"],
      },
      confirmationRequested: true,
      operatorConfirmed: true,
      confirmationIntent: "confirm_simulated_live_test_action",
      expectedActionFingerprint: "action",
      confirmationActionFingerprint: "action",
      confirmationCreatedAtMs: 1000,
      evaluatedAtMs: 2000,
      expiresAfterMs: 5000,
    });

    assert.equal(result.state, "blocked_by_runtime_contract");
    assert.equal(result.confirmationValid, false);
    assert.ok(result.reasonCodes.includes("runtime_contract_blocked"));
    assert.equal(result.canProceedToLiveTest, false);
  });

  it("asserts operator confirmation invariants remain non-executing", () => {
    const result = createOperatorConfirmationRuntimeDesign({
      runtimeContract,
      confirmationRequested: false,
    });
    const invariantCheck = assertOperatorConfirmationRuntimeInvariants(result);

    assert.equal(invariantCheck.passed, true);
    assert.deepEqual(invariantCheck.reasonCodes, []);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
  });
});
