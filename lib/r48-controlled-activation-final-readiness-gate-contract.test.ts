import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledActivationFinalReadinessGateInvariants,
  createR48ControlledActivationFinalReadinessGate,
  type R48ControlledActivationFinalReadinessGateInput,
  type R48ControlledActivationFinalReadinessGateResult,
} from "./r48-controlled-activation-final-readiness-gate-contract";

const safeInput: R48ControlledActivationFinalReadinessGateInput = {
  activationPlan: {
    exists: true,
    ready: true,
    simulationOnly: true,
  },
  prerequisiteChecklist: {
    activationChecklistComplete: true,
  },
  riskClassification: "controlled_simulation_only",
  escalationActions: ["continue_simulation_only"],
  humanApprovalGateStatus: "simulation_only_approved",
  systemHealth: {
    database: "ok",
    status: "warning",
    readinessReady: true,
  },
  providerBoundary: {
    ok: true,
    providerDisabled: true,
    providerCalled: false,
    sent: false,
    activationAllowed: false,
  },
  killSwitch: {
    allowed: true,
    killSwitchActive: false,
    emergencyStopActive: false,
  },
  allowlist: {
    required: true,
    allowed: true,
    recipientMatched: true,
  },
  auditReadiness: {
    ready: true,
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

function assertExecutionImpossible(result: R48ControlledActivationFinalReadinessGateResult) {
  const invariantCheck = assertR48ControlledActivationFinalReadinessGateInvariants(result);

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

describe("R48 controlled activation final readiness gate contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48ControlledActivationFinalReadinessGate();

    assert.equal(result.finalReadinessDecision, "prohibited");
    assert.ok(result.reasonCodes.includes("activation_plan_missing"));
    assert.ok(result.reasonCodes.includes("prerequisite_checklist_missing"));
    assert.ok(result.reasonCodes.includes("risk_classification_missing"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("any attempted execution indicator prohibits", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      activationExecuted: true,
      liveExecutionAllowed: true,
      sent: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.equal(result.finalReadinessDecision, "prohibited");
    assert.ok(result.reasonCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_test_ready_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("provider activation indicator prohibits", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      providerActivationAllowed: true,
      providerCalled: true,
    });

    assert.equal(result.finalReadinessDecision, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("unsafe kill-switch prohibits", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      killSwitch: {
        allowed: false,
        killSwitchActive: true,
        emergencyStopActive: false,
      },
    });

    assert.equal(result.finalReadinessDecision, "prohibited");
    assert.ok(result.reasonCodes.includes("kill_switch_unsafe"));
    assertExecutionImpossible(result);
  });

  it("unsafe provider boundary prohibits", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      providerBoundary: {
        ok: false,
        providerDisabled: false,
        providerCalled: true,
        sent: false,
        activationAllowed: true,
      },
    });

    assert.equal(result.finalReadinessDecision, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_boundary_unsafe"));
    assertExecutionImpossible(result);
  });

  it("failed system health blocks", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      systemHealth: {
        database: "error",
        status: "critical",
        readinessReady: false,
      },
    });

    assert.equal(result.finalReadinessDecision, "blocked");
    assert.ok(result.reasonCodes.includes("system_health_failed"));
    assert.ok(result.reasonCodes.includes("system_readiness_not_ready"));
    assertExecutionImpossible(result);
  });

  it("missing audit readiness blocks", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      auditReadiness: undefined,
    });

    assert.equal(result.finalReadinessDecision, "blocked");
    assert.ok(result.reasonCodes.includes("audit_readiness_missing"));
    assertExecutionImpossible(result);
  });

  it("failed smoke status blocks", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      staticSmoke: {
        ...safeInput.staticSmoke,
        passed: false,
      },
    });

    assert.equal(result.finalReadinessDecision, "blocked");
    assert.ok(result.reasonCodes.includes("static_smoke_failed"));
    assertExecutionImpossible(result);
  });

  it("missing approval requires operator review", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      humanApprovalGateStatus: undefined,
    });

    assert.equal(result.finalReadinessDecision, "operator_review_required");
    assert.ok(result.reasonCodes.includes("human_approval_missing"));
    assertExecutionImpossible(result);
  });

  it("elevated risk requires remediation before readiness", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      riskClassification: "elevated_risk",
      escalationActions: ["require_operator_review", "require_audit_readiness", "continue_simulation_only"],
    });

    assert.equal(result.finalReadinessDecision, "remediation_required");
    assert.ok(result.reasonCodes.includes("risk_classification_elevated"));
    assert.ok(result.reasonCodes.includes("escalation_operator_review_required"));
    assertExecutionImpossible(result);
  });

  it("safest possible state returns simulation_only_ready", () => {
    const result = createR48ControlledActivationFinalReadinessGate(safeInput);

    assert.equal(result.finalReadinessDecision, "simulation_only_ready");
    assert.ok(result.reasonCodes.includes("simulation_only_final_ready"));
    assertExecutionImpossible(result);
  });

  it("safest planning-only state returns planning_only_ready", () => {
    const result = createR48ControlledActivationFinalReadinessGate({
      ...safeInput,
      riskClassification: "planning_only",
      escalationActions: ["planning_only_no_execution"],
      humanApprovalGateStatus: "planning_only",
    });

    assert.equal(result.finalReadinessDecision, "planning_only_ready");
    assert.ok(result.reasonCodes.includes("planning_only_final_ready"));
    assertExecutionImpossible(result);
  });

  it("no path allows live execution", () => {
    const decisions: R48ControlledActivationFinalReadinessGateInput[] = [
      {},
      safeInput,
      { ...safeInput, riskClassification: "planning_only", humanApprovalGateStatus: "planning_only" },
      { ...safeInput, riskClassification: "blocked" },
      { ...safeInput, riskClassification: "prohibited" },
      { ...safeInput, riskClassification: "unsafe" },
      { ...safeInput, riskClassification: "elevated_risk" },
      { ...safeInput, providerActivationAllowed: true },
    ];

    for (const input of decisions) {
      assertExecutionImpossible(createR48ControlledActivationFinalReadinessGate(input));
    }
  });
});
