import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ActivationRiskClassificationInvariants,
  createR48ActivationRiskClassification,
  type R48ActivationRiskClassificationInput,
  type R48ActivationRiskClassificationResult,
} from "./r48-activation-risk-classification-contract";

const safeInput: R48ActivationRiskClassificationInput = {
  operatorConfirmation: {
    required: true,
    confirmed: true,
    valid: true,
    exactActionMatched: true,
    notExpired: true,
    simulationOnly: true,
  },
  allowlist: {
    required: true,
    allowed: true,
    recipientMatched: true,
  },
  killSwitch: {
    allowed: true,
    killSwitchActive: false,
    emergencyStopActive: false,
  },
  providerBoundary: {
    ok: true,
    providerDisabled: true,
    providerMode: "disabled",
    providerCalled: false,
    sent: false,
    activationAllowed: false,
  },
  auditPersistence: {
    readyForFuturePersistence: true,
    persistenceExecuted: false,
    dbWriteAttempted: false,
    forbiddenFieldsDetected: [],
  },
  staticSmoke: {
    present: true,
    passed: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
  },
  safetyEnvelope: {
    present: true,
    mode: "simulation_only",
    executionBlocked: true,
    providerDisabled: true,
    liveExecutionEnabled: false,
  },
  forbiddenActivationConditions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
};

function assertExecutionImpossible(result: R48ActivationRiskClassificationResult) {
  const invariantCheck = assertR48ActivationRiskClassificationInvariants(result);

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

describe("R48 activation risk classification contract", () => {
  it("fails closed with default missing inputs", () => {
    const result = createR48ActivationRiskClassification();

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assert.ok(result.reasonCodes.includes("operator_confirmation_missing"));
    assert.ok(result.reasonCodes.includes("allowlist_missing"));
    assertExecutionImpossible(result);
  });

  it("classifies attempted provider activation as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      providerActivationAllowed: true,
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("classifies sent true as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      sent: true,
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("classifies providerCalled true as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      providerCalled: true,
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("classifies canSendNow true as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      canSendNow: true,
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("classifies simulationOnly false as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      simulationOnly: false,
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("classifies missing operator confirmation as blocked", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      operatorConfirmation: undefined,
    });

    assert.equal(result.riskClassification, "blocked");
    assert.ok(result.reasonCodes.includes("operator_confirmation_missing"));
    assertExecutionImpossible(result);
  });

  it("classifies unsafe kill-switch state as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      killSwitch: {
        allowed: false,
        killSwitchActive: true,
        emergencyStopActive: false,
      },
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("kill_switch_unsafe"));
    assertExecutionImpossible(result);
  });

  it("classifies unsafe provider boundary as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      providerBoundary: {
        ok: false,
        providerDisabled: false,
        providerMode: "live",
        providerCalled: true,
        sent: false,
        activationAllowed: true,
      },
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_boundary_unsafe"));
    assertExecutionImpossible(result);
  });

  it("classifies missing audit persistence readiness as elevated risk", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      auditPersistence: undefined,
    });

    assert.equal(result.riskClassification, "elevated_risk");
    assert.ok(result.reasonCodes.includes("audit_persistence_missing"));
    assertExecutionImpossible(result);
  });

  it("classifies static smoke failure as blocked", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      staticSmoke: {
        ...safeInput.staticSmoke,
        passed: false,
      },
    });

    assert.equal(result.riskClassification, "blocked");
    assert.ok(result.reasonCodes.includes("static_smoke_failed"));
    assertExecutionImpossible(result);
  });

  it("classifies forbidden activation condition as prohibited", () => {
    const result = createR48ActivationRiskClassification({
      ...safeInput,
      forbiddenActivationConditions: ["live_provider_activation_requested"],
    });

    assert.equal(result.riskClassification, "prohibited");
    assert.ok(result.reasonCodes.includes("forbidden_activation_condition_detected"));
    assert.deepEqual(result.forbiddenActivationConditions, ["live_provider_activation_requested"]);
    assertExecutionImpossible(result);
  });

  it("classifies fully safe state as controlled simulation only without enabling live execution", () => {
    const result = createR48ActivationRiskClassification(safeInput);

    assert.equal(result.riskClassification, "controlled_simulation_only");
    assert.ok(result.reasonCodes.includes("controlled_simulation_only_classification"));
    assertExecutionImpossible(result);
  });
});
