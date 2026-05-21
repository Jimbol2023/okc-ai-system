import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ActivationPrerequisiteChecklistInvariants,
  createR48ActivationPrerequisiteChecklist,
  type R48ActivationPrerequisiteChecklistInput,
  type R48ActivationPrerequisiteChecklistResult,
} from "./r48-activation-prerequisite-checklist-contract";

const completeInput: R48ActivationPrerequisiteChecklistInput = {
  r47FinalReadinessReview: {
    r47Complete: true,
    controlledLiveTestPlanningReady: true,
    liveExecutionReady: false,
    providerActivationAllowed: false,
    routeExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
  },
  r48ActivationPlan: {
    activationPlanned: true,
    readinessLevel: "planning_ready",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    forbiddenActivationConditions: [],
  },
  operatorConfirmationRequired: true,
  allowlistRequired: true,
  killSwitchSafeStateRequired: true,
  providerBoundaryDisabledOrPlannedStateRequired: true,
  auditPersistencePlanningRequired: true,
  staticSmokeContractRequired: true,
  safetyEnvelopeRequired: true,
  forbiddenActivationConditions: [],
};

function assertExecutionAlwaysBlocked(result: R48ActivationPrerequisiteChecklistResult) {
  const invariantCheck = assertR48ActivationPrerequisiteChecklistInvariants(result);

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

describe("R48 activation prerequisite checklist contract", () => {
  it("fails closed with default missing inputs", () => {
    const result = createR48ActivationPrerequisiteChecklist();

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("r47_final_readiness_review_required"));
    assert.ok(result.reasonCodes.includes("r48_activation_plan_required"));
    assert.ok(result.reasonCodes.includes("operator_confirmation_requirement_missing"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing R47 readiness blocks checklist completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      r47FinalReadinessReview: {
        ...completeInput.r47FinalReadinessReview,
        r47Complete: false,
      },
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("r47_final_readiness_review_required"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing activation plan blocks checklist completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      r48ActivationPlan: undefined,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("r48_activation_plan_required"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing operator confirmation requirement blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      operatorConfirmationRequired: false,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("operator_confirmation_requirement_missing"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing allowlist requirement blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      allowlistRequired: false,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("allowlist_requirement_missing"));
    assertExecutionAlwaysBlocked(result);
  });

  it("unsafe kill-switch state blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      killSwitchSafeStateRequired: false,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("kill_switch_safe_state_requirement_missing"));
    assertExecutionAlwaysBlocked(result);
  });

  it("unsafe provider boundary state blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      providerBoundaryDisabledOrPlannedStateRequired: false,
      r48ActivationPlan: {
        ...completeInput.r48ActivationPlan,
        providerActivationAllowed: true,
      },
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("provider_boundary_disabled_or_planned_state_required"));
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing audit persistence plan blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      auditPersistencePlanningRequired: false,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("audit_persistence_planning_required"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing static smoke contract blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      staticSmokeContractRequired: false,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("static_smoke_contract_required"));
    assertExecutionAlwaysBlocked(result);
  });

  it("missing safety envelope blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      safetyEnvelopeRequired: false,
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("safety_envelope_required"));
    assertExecutionAlwaysBlocked(result);
  });

  it("forbidden activation condition blocks completion", () => {
    const result = createR48ActivationPrerequisiteChecklist({
      ...completeInput,
      forbiddenActivationConditions: ["provider_activation_requested"],
    });

    assert.equal(result.activationChecklistComplete, false);
    assert.ok(result.reasonCodes.includes("forbidden_activation_condition_detected"));
    assert.deepEqual(result.forbiddenActivationConditions, ["provider_activation_requested"]);
    assertExecutionAlwaysBlocked(result);
  });

  it("completes checklist only when every prerequisite is present without authorizing activation", () => {
    const result = createR48ActivationPrerequisiteChecklist(completeInput);

    assert.equal(result.activationChecklistComplete, true);
    assert.ok(result.reasonCodes.includes("activation_checklist_complete"));
    assertExecutionAlwaysBlocked(result);
  });
});
