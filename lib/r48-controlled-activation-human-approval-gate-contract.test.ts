import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledActivationHumanApprovalGateInvariants,
  createR48ControlledActivationHumanApprovalGate,
  type R48ControlledActivationHumanApprovalGateInput,
  type R48ControlledActivationHumanApprovalGateResult,
} from "./r48-controlled-activation-human-approval-gate-contract";

const safeInput: R48ControlledActivationHumanApprovalGateInput = {
  riskClassification: "controlled_simulation_only",
  escalationActions: ["continue_simulation_only"],
  operatorApproval: {
    approved: true,
    approvedAt: "2026-05-21T12:00:00.000Z",
    approverId: "operator-1",
    scope: "controlled_live_test_simulation_only",
    expiresAt: "2026-05-22T12:00:00.000Z",
    evaluatedAt: "2026-05-21T13:00:00.000Z",
    expired: false,
  },
  requiredApprovalScope: "controlled_live_test_simulation_only",
  complianceReview: {
    reviewed: true,
    dncReviewed: true,
    optOutReviewed: true,
    dncBlocked: false,
    optOutBlocked: false,
  },
  killSwitch: {
    allowed: true,
    killSwitchActive: false,
    emergencyStopActive: false,
  },
  allowlist: {
    allowed: true,
    recipientMatched: true,
  },
  providerBoundary: {
    ok: true,
    providerDisabled: true,
    providerCalled: false,
    sent: false,
    activationAllowed: false,
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

function assertExecutionImpossible(result: R48ControlledActivationHumanApprovalGateResult) {
  const invariantCheck = assertR48ControlledActivationHumanApprovalGateInvariants(result);

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

describe("R48 controlled activation human approval gate contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48ControlledActivationHumanApprovalGate();

    assert.equal(result.approvalGateStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("risk_classification_missing"));
    assert.ok(result.reasonCodes.includes("operator_approval_missing"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("blocks approval when operator approval is missing", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      operatorApproval: {
        ...safeInput.operatorApproval,
        approved: false,
      },
    });

    assert.equal(result.approvalGateStatus, "requires_operator_approval");
    assert.ok(result.reasonCodes.includes("operator_approval_missing"));
    assertExecutionImpossible(result);
  });

  it("blocks approval when approval is expired", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      operatorApproval: {
        ...safeInput.operatorApproval,
        expired: true,
      },
    });

    assert.equal(result.approvalGateStatus, "requires_operator_approval");
    assert.ok(result.reasonCodes.includes("approval_expired"));
    assertExecutionImpossible(result);
  });

  it("blocks approval when approval scope is invalid", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      operatorApproval: {
        ...safeInput.operatorApproval,
        scope: "live_provider_activation",
      },
    });

    assert.equal(result.approvalGateStatus, "requires_operator_approval");
    assert.ok(result.reasonCodes.includes("approval_scope_invalid"));
    assertExecutionImpossible(result);
  });

  it("prohibited risk always prohibits", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      riskClassification: "prohibited",
    });

    assert.equal(result.approvalGateStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("risk_classification_prohibited"));
    assertExecutionImpossible(result);
  });

  it("escalation prohibit_activation always prohibits", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      escalationActions: ["prohibit_activation", "require_operator_review"],
    });

    assert.equal(result.approvalGateStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("escalation_prohibit_activation"));
    assertExecutionImpossible(result);
  });

  it("blocks when compliance is not reviewed", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      complianceReview: {
        ...safeInput.complianceReview,
        reviewed: false,
      },
    });

    assert.equal(result.approvalGateStatus, "requires_compliance_review");
    assert.ok(result.reasonCodes.includes("compliance_review_missing"));
    assertExecutionImpossible(result);
  });

  it("unsafe kill-switch prohibits", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      killSwitch: {
        allowed: false,
        killSwitchActive: true,
        emergencyStopActive: false,
      },
    });

    assert.equal(result.approvalGateStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("kill_switch_unsafe"));
    assertExecutionImpossible(result);
  });

  it("unsafe provider boundary prohibits", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      providerBoundary: {
        ok: false,
        providerDisabled: false,
        providerCalled: true,
        sent: false,
        activationAllowed: true,
      },
    });

    assert.equal(result.approvalGateStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_boundary_unsafe"));
    assertExecutionImpossible(result);
  });

  it("attempted execution indicators prohibit", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.equal(result.approvalGateStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_test_ready_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("safest possible controlled simulation state returns simulation_only_approved", () => {
    const result = createR48ControlledActivationHumanApprovalGate(safeInput);

    assert.equal(result.approvalGateStatus, "simulation_only_approved");
    assert.ok(result.reasonCodes.includes("simulation_only_approval_granted"));
    assertExecutionImpossible(result);
  });

  it("safest possible planning-only state remains planning_only", () => {
    const result = createR48ControlledActivationHumanApprovalGate({
      ...safeInput,
      riskClassification: "planning_only",
      escalationActions: ["planning_only_no_execution"],
    });

    assert.equal(result.approvalGateStatus, "planning_only");
    assert.ok(result.reasonCodes.includes("planning_only_no_execution"));
    assertExecutionImpossible(result);
  });

  it("no path allows live execution", () => {
    const states: NonNullable<R48ControlledActivationHumanApprovalGateInput["riskClassification"]>[] = [
      "blocked",
      "prohibited",
      "unsafe",
      "elevated_risk",
      "controlled_simulation_only",
      "planning_only",
    ];

    for (const riskClassification of states) {
      const result = createR48ControlledActivationHumanApprovalGate({
        ...safeInput,
        riskClassification,
      });

      assertExecutionImpossible(result);
    }
  });
});
