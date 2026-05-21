import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledLiveTestActivationPlanInvariants,
  createR48ControlledLiveTestActivationPlan,
  type R48ControlledLiveTestActivationPlanInput,
} from "./r48-controlled-live-test-activation-plan";

const safeInput: R48ControlledLiveTestActivationPlanInput = {
  operatorConfirmation: {
    confirmed: true,
    valid: true,
    exactActionMatched: true,
    notExpired: true,
    simulationOnly: true,
  },
  allowlist: {
    allowed: true,
    recipientMatched: true,
    mode: "explicit_allowlist",
  },
  killSwitch: {
    allowed: true,
    killSwitchActive: false,
    emergencyStopActive: false,
  },
  providerBoundary: {
    ok: true,
    providerMode: "disabled",
    providerDisabled: true,
    providerCalled: false,
    sent: false,
  },
  auditPersistence: {
    readyForFuturePersistence: true,
    persistenceExecuted: false,
    dbWriteAttempted: false,
    forbiddenFieldsDetected: [],
  },
  safetyEnvelope: {
    present: true,
    mode: "simulation_only",
    executionBlocked: true,
    providerDisabled: true,
    liveExecutionEnabled: false,
    reasonCodes: ["simulation_only", "provider_disabled", "live_execution_blocked"],
  },
  staticSmoke: {
    passed: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
  },
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
};

describe("R48 controlled live-test activation plan", () => {
  it("fails closed with default missing inputs", () => {
    const result = createR48ControlledLiveTestActivationPlan();

    assert.equal(result.activationPlanned, true);
    assert.equal(result.activationExecuted, false);
    assert.equal(result.providerActivationAllowed, false);
    assert.equal(result.liveExecutionAllowed, false);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.liveTestReady, false);
    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("operator_confirmation_required"));
    assert.ok(result.reasonCodes.includes("static_smoke_required"));
  });

  it("blocks missing operator confirmation", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      operatorConfirmation: {
        confirmed: false,
        valid: false,
        exactActionMatched: false,
        notExpired: true,
        simulationOnly: true,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("operator_confirmation_required"));
  });

  it("blocks kill-switch unsafe state", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      killSwitch: {
        allowed: false,
        killSwitchActive: true,
        emergencyStopActive: false,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("kill_switch_must_be_safe"));
  });

  it("blocks provider boundary unsafe state", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      providerBoundary: {
        ok: false,
        providerMode: "live",
        providerDisabled: false,
        providerCalled: true,
        sent: false,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("provider_boundary_required"));
    assert.equal(result.providerActivationAllowed, false);
  });

  it("blocks audit persistence not ready", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      auditPersistence: {
        readyForFuturePersistence: false,
        persistenceExecuted: true,
        dbWriteAttempted: true,
        forbiddenFieldsDetected: ["providerToken"],
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("audit_persistence_ready_required"));
  });

  it("blocks static smoke failure", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      staticSmoke: {
        passed: false,
        sent: false,
        providerCalled: false,
        canSendNow: false,
        simulationOnly: true,
        liveTestReady: false,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("static_smoke_required"));
  });

  it("blocks sent/providerCalled/canSendNow execution signals", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      sent: true,
      providerCalled: true,
      canSendNow: true,
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
  });

  it("blocks simulationOnly false", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      simulationOnly: false,
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assert.equal(result.simulationOnly, true);
  });

  it("liveTestReady true does not enable execution", () => {
    const result = createR48ControlledLiveTestActivationPlan({
      ...safeInput,
      liveTestReady: true,
      staticSmoke: {
        ...safeInput.staticSmoke,
        liveTestReady: true,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("live_test_ready_does_not_authorize_execution"));
    assert.equal(result.liveTestReady, false);
    assert.equal(result.activationExecuted, false);
    assert.equal(result.providerActivationAllowed, false);
    assert.equal(result.liveExecutionAllowed, false);
  });

  it("reaches planning_ready without allowing activation or execution", () => {
    const result = createR48ControlledLiveTestActivationPlan(safeInput);
    const invariantCheck = assertR48ControlledLiveTestActivationPlanInvariants(result);

    assert.equal(result.readinessLevel, "planning_ready");
    assert.equal(result.activationPlanned, true);
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
    assert.ok(result.reasonCodes.includes("activation_prerequisites_satisfied_for_planning"));
  });
});
