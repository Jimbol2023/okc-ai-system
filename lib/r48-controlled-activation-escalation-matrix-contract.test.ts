import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledActivationEscalationMatrixInvariants,
  createR48ControlledActivationEscalationMatrix,
  type R48ControlledActivationEscalationMatrixInput,
  type R48ControlledActivationEscalationMatrixResult,
} from "./r48-controlled-activation-escalation-matrix-contract";

const safePlanningInput: R48ControlledActivationEscalationMatrixInput = {
  riskState: "planning_only",
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
};

function assertExecutionImpossible(result: R48ControlledActivationEscalationMatrixResult) {
  const invariantCheck = assertR48ControlledActivationEscalationMatrixInvariants(result);

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

describe("R48 controlled activation escalation matrix contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48ControlledActivationEscalationMatrix();

    assert.ok(result.escalationActions.includes("prohibit_activation"));
    assert.ok(result.escalationActions.includes("require_operator_review"));
    assert.ok(result.reasonCodes.includes("risk_state_missing"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("escalates prohibited risk to prohibit activation", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      riskState: "prohibited",
    });

    assert.ok(result.escalationActions.includes("prohibit_activation"));
    assert.ok(result.reasonCodes.includes("risk_state_prohibited"));
    assertExecutionImpossible(result);
  });

  it("escalates blocked risk to remediation and operator review", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      riskState: "blocked",
    });

    assert.ok(result.escalationActions.includes("require_operator_review"));
    assert.ok(result.escalationActions.includes("require_safety_remediation"));
    assert.ok(result.reasonCodes.includes("risk_state_blocked"));
    assertExecutionImpossible(result);
  });

  it("keeps elevated risk away from live readiness", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      riskState: "elevated_risk",
    });

    assert.ok(result.escalationActions.includes("require_operator_review"));
    assert.ok(result.escalationActions.includes("require_audit_readiness"));
    assert.ok(result.escalationActions.includes("continue_simulation_only"));
    assert.equal(result.liveTestReady, false);
    assert.equal(result.liveExecutionAllowed, false);
    assertExecutionImpossible(result);
  });

  it("keeps controlled simulation only in simulation-only governance", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      riskState: "controlled_simulation_only",
    });

    assert.ok(result.escalationActions.includes("continue_simulation_only"));
    assert.ok(result.escalationActions.includes("planning_only_no_execution"));
    assert.ok(result.reasonCodes.includes("risk_state_controlled_simulation_only"));
    assertExecutionImpossible(result);
  });

  it("keeps planning only non-executable", () => {
    const result = createR48ControlledActivationEscalationMatrix(safePlanningInput);

    assert.deepEqual(result.escalationActions, ["planning_only_no_execution"]);
    assert.ok(result.reasonCodes.includes("risk_state_planning_only"));
    assertExecutionImpossible(result);
  });

  it("escalates unsafe risk to prohibit activation and safety remediation", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      riskState: "unsafe",
    });

    assert.ok(result.escalationActions.includes("prohibit_activation"));
    assert.ok(result.escalationActions.includes("require_safety_remediation"));
    assert.ok(result.reasonCodes.includes("risk_state_unsafe"));
    assertExecutionImpossible(result);
  });

  it("maps explicit governance requirements to actions", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      operatorReviewRequired: true,
      safetyRemediationRequired: true,
      auditReadinessRequired: true,
      staticSmokePassRequired: true,
      providerBoundaryReviewRequired: true,
    });

    assert.ok(result.escalationActions.includes("require_operator_review"));
    assert.ok(result.escalationActions.includes("require_safety_remediation"));
    assert.ok(result.escalationActions.includes("require_audit_readiness"));
    assert.ok(result.escalationActions.includes("require_static_smoke_pass"));
    assert.ok(result.escalationActions.includes("require_provider_boundary_review"));
    assertExecutionImpossible(result);
  });

  it("attempted execution indicators always escalate to prohibit activation", () => {
    const result = createR48ControlledActivationEscalationMatrix({
      ...safePlanningInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.ok(result.escalationActions.includes("prohibit_activation"));
    assert.ok(result.escalationActions.includes("require_provider_boundary_review"));
    assert.ok(result.reasonCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_test_ready_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("no path allows provider activation or live execution", () => {
    const riskStates: NonNullable<R48ControlledActivationEscalationMatrixInput["riskState"]>[] = [
      "blocked",
      "prohibited",
      "unsafe",
      "elevated_risk",
      "controlled_simulation_only",
      "planning_only",
    ];

    for (const riskState of riskStates) {
      const result = createR48ControlledActivationEscalationMatrix({
        ...safePlanningInput,
        riskState,
      });

      assertExecutionImpossible(result);
    }
  });
});
