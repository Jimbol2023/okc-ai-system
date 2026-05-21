import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledActivationGovernanceSummaryInvariants,
  createR48ControlledActivationGovernanceSummary,
  type R48ControlledActivationGovernanceSummaryInput,
  type R48ControlledActivationGovernanceSummaryResult,
} from "./r48-controlled-activation-governance-summary-contract";

const safeInput: R48ControlledActivationGovernanceSummaryInput = {
  activationPlanStatus: "ready",
  prerequisiteChecklistStatus: "complete",
  riskClassification: "controlled_simulation_only",
  escalationActions: ["continue_simulation_only"],
  humanApprovalGateStatus: "simulation_only_approved",
  finalReadinessGateResult: "simulation_only_ready",
  dryRunExecutionEnvelopeResult: "simulation_only_ready",
  auditEventResult: "recorded_simulation_only",
  auditPersistencePlanResult: "simulation_only_persistence_recommended",
  systemHealth: {
    database: "ok",
    status: "warning",
    readinessReady: true,
  },
  remainingBlockers: [],
  requiredOperatorActions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertExecutionImpossible(result: R48ControlledActivationGovernanceSummaryResult) {
  const invariantCheck = assertR48ControlledActivationGovernanceSummaryInvariants(result);

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

describe("R48 controlled activation governance summary contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48ControlledActivationGovernanceSummary();

    assert.equal(result.finalGovernanceConclusion, "activation_prohibited");
    assert.ok(result.reasonCodes.includes("activation_plan_missing"));
    assert.ok(result.reasonCodes.includes("prerequisite_checklist_missing"));
    assert.ok(result.reasonCodes.includes("risk_classification_missing"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("any prohibited child signal produces activation_prohibited", () => {
    const result = createR48ControlledActivationGovernanceSummary({
      ...safeInput,
      riskClassification: "prohibited",
      escalationActions: ["prohibit_activation"],
      humanApprovalGateStatus: "prohibited",
      finalReadinessGateResult: "prohibited",
      dryRunExecutionEnvelopeResult: "prohibited",
      auditEventResult: "prohibited",
    });

    assert.equal(result.finalGovernanceConclusion, "activation_prohibited");
    assert.ok(result.reasonCodes.includes("risk_classification_prohibited"));
    assert.ok(result.reasonCodes.includes("escalation_prohibited"));
    assert.ok(result.reasonCodes.includes("approval_prohibited"));
    assertExecutionImpossible(result);
  });

  it("blocked child signal produces activation_blocked", () => {
    const result = createR48ControlledActivationGovernanceSummary({
      ...safeInput,
      riskClassification: "blocked",
      humanApprovalGateStatus: "blocked",
      finalReadinessGateResult: "blocked",
      dryRunExecutionEnvelopeResult: "dry_run_rejected",
    });

    assert.equal(result.finalGovernanceConclusion, "activation_blocked");
    assert.ok(result.reasonCodes.includes("risk_classification_blocked"));
    assert.ok(result.reasonCodes.includes("approval_blocked"));
    assert.ok(result.reasonCodes.includes("dry_run_rejected"));
    assertExecutionImpossible(result);
  });

  it("missing approval produces operator_review_required", () => {
    const result = createR48ControlledActivationGovernanceSummary({
      ...safeInput,
      humanApprovalGateStatus: undefined,
    });

    assert.equal(result.finalGovernanceConclusion, "operator_review_required");
    assert.ok(result.reasonCodes.includes("approval_missing"));
    assert.ok(result.requiredOperatorActions.includes("Provide human approval gate result."));
    assertExecutionImpossible(result);
  });

  it("unsafe health produces remediation_required", () => {
    const result = createR48ControlledActivationGovernanceSummary({
      ...safeInput,
      systemHealth: {
        database: "error",
        status: "critical",
        readinessReady: false,
      },
    });

    assert.equal(result.finalGovernanceConclusion, "remediation_required");
    assert.ok(result.reasonCodes.includes("system_health_unsafe"));
    assert.ok(result.reasonCodes.includes("system_readiness_not_ready"));
    assertExecutionImpossible(result);
  });

  it("safe governed simulation produces simulation_only_governed", () => {
    const result = createR48ControlledActivationGovernanceSummary(safeInput);

    assert.equal(result.finalGovernanceConclusion, "simulation_only_governed");
    assert.ok(result.reasonCodes.includes("simulation_only_governance_complete"));
    assertExecutionImpossible(result);
  });

  it("planning-only completion remains non-executable", () => {
    const result = createR48ControlledActivationGovernanceSummary({
      ...safeInput,
      riskClassification: "planning_only",
      escalationActions: ["planning_only_no_execution"],
      humanApprovalGateStatus: "planning_only",
      finalReadinessGateResult: "planning_only_ready",
      dryRunExecutionEnvelopeResult: "planning_only",
      auditEventResult: "recorded_planning_only",
      auditPersistencePlanResult: "persistence_plan_ready",
    });

    assert.equal(result.finalGovernanceConclusion, "planning_only_complete");
    assert.ok(result.reasonCodes.includes("planning_only_governance_complete"));
    assertExecutionImpossible(result);
  });

  it("persistenceAllowedNow is always false", () => {
    const result = createR48ControlledActivationGovernanceSummary({
      ...safeInput,
      persistenceAllowedNow: true,
    });

    assert.equal(result.persistenceAllowedNow, false);
    assert.ok(result.reasonCodes.includes("persistence_not_allowed_now"));
    assertExecutionImpossible(result);
  });

  it("no path allows live execution provider activation or send", () => {
    const inputs: R48ControlledActivationGovernanceSummaryInput[] = [
      {},
      safeInput,
      { ...safeInput, providerActivationAllowed: true },
      { ...safeInput, liveExecutionAllowed: true },
      { ...safeInput, sent: true, providerCalled: true, canSendNow: true },
      { ...safeInput, persistenceAllowedNow: true },
    ];

    for (const input of inputs) {
      assertExecutionImpossible(createR48ControlledActivationGovernanceSummary(input));
    }
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR48ControlledActivationGovernanceSummary(),
      createR48ControlledActivationGovernanceSummary(safeInput),
      createR48ControlledActivationGovernanceSummary({
        ...safeInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        liveTestReady: true,
        persistenceAllowedNow: true,
      }),
    ];

    for (const result of results) {
      assertExecutionImpossible(result);
    }
  });
});
