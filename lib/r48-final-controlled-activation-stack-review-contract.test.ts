import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48FinalControlledActivationStackReviewInvariants,
  createR48FinalControlledActivationStackReview,
  type R48FinalControlledActivationStackReviewInput,
  type R48FinalControlledActivationStackReviewResult,
} from "./r48-final-controlled-activation-stack-review-contract";

const completeSimulationInput: R48FinalControlledActivationStackReviewInput = {
  r48aActivationPlan: "complete",
  r48bPrerequisiteChecklist: "complete",
  r48cRiskClassification: "complete",
  r48dEscalationMatrix: "complete",
  r48eHumanApprovalGate: "complete",
  r48fFinalReadinessGate: "complete",
  r48gDryRunExecutionEnvelope: "complete",
  r48hAuditEventContract: "complete",
  r48iAuditPersistencePlan: "complete",
  r48jGovernanceSummary: "complete",
  governanceConclusion: "simulation_only_governed",
  systemHealth: {
    database: "ok",
    status: "warning",
    readinessReady: true,
  },
  stagingDbReadiness: {
    connected: true,
    migrationsApplied: true,
    tablesReady: true,
    schemaMismatchDetected: false,
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

function assertExecutionImpossible(result: R48FinalControlledActivationStackReviewResult) {
  const invariantCheck = assertR48FinalControlledActivationStackReviewInvariants(result);

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

describe("R48 final controlled activation stack review contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48FinalControlledActivationStackReview();

    assert.equal(result.finalStackReviewOutcome, "stack_incomplete");
    assert.ok(result.reasonCodes.includes("r48a_activation_plan_missing"));
    assert.ok(result.reasonCodes.includes("r48j_governance_summary_missing"));
    assert.ok(result.reasonCodes.includes("system_health_missing"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("any prohibited governance summary yields activation_prohibited", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      governanceConclusion: "activation_prohibited",
    });

    assert.equal(result.finalStackReviewOutcome, "activation_prohibited");
    assert.ok(result.reasonCodes.includes("governance_summary_prohibited"));
    assertExecutionImpossible(result);
  });

  it("incomplete child layers yield stack_incomplete", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      r48fFinalReadinessGate: "blocked",
      r48gDryRunExecutionEnvelope: "missing",
    });

    assert.equal(result.finalStackReviewOutcome, "stack_incomplete");
    assert.ok(result.reasonCodes.includes("child_layer_incomplete"));
    assert.ok(result.reasonCodes.includes("r48g_dry_run_envelope_missing"));
    assertExecutionImpossible(result);
  });

  it("unsafe system readiness yields remediation_required", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      systemHealth: {
        database: "error",
        status: "critical",
        readinessReady: false,
      },
    });

    assert.equal(result.finalStackReviewOutcome, "remediation_required");
    assert.ok(result.reasonCodes.includes("system_health_unsafe"));
    assertExecutionImpossible(result);
  });

  it("unsafe staging DB readiness yields remediation_required", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      stagingDbReadiness: {
        connected: true,
        migrationsApplied: false,
        tablesReady: true,
        schemaMismatchDetected: true,
      },
    });

    assert.equal(result.finalStackReviewOutcome, "remediation_required");
    assert.equal(result.stagingDbReady, false);
    assert.ok(result.reasonCodes.includes("staging_db_readiness_unsafe"));
    assertExecutionImpossible(result);
  });

  it("missing operator review yields operator_review_required", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      governanceConclusion: "operator_review_required",
    });

    assert.equal(result.finalStackReviewOutcome, "operator_review_required");
    assert.ok(result.reasonCodes.includes("operator_review_required"));
    assertExecutionImpossible(result);
  });

  it("complete simulation-only stack yields simulation_stack_complete", () => {
    const result = createR48FinalControlledActivationStackReview(completeSimulationInput);

    assert.equal(result.finalStackReviewOutcome, "simulation_stack_complete");
    assert.ok(result.reasonCodes.includes("simulation_stack_complete"));
    assertExecutionImpossible(result);
  });

  it("planning-only stack yields planning_stack_complete", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      governanceConclusion: "planning_only_complete",
    });

    assert.equal(result.finalStackReviewOutcome, "planning_stack_complete");
    assert.ok(result.reasonCodes.includes("planning_stack_complete"));
    assertExecutionImpossible(result);
  });

  it("persistenceAllowedNow is always false", () => {
    const result = createR48FinalControlledActivationStackReview({
      ...completeSimulationInput,
      persistenceAllowedNow: true,
    });

    assert.equal(result.persistenceAllowedNow, false);
    assert.ok(result.reasonCodes.includes("persistence_not_allowed_now"));
    assertExecutionImpossible(result);
  });

  it("no path allows live execution provider activation or send", () => {
    const inputs: R48FinalControlledActivationStackReviewInput[] = [
      {},
      completeSimulationInput,
      { ...completeSimulationInput, providerActivationAllowed: true },
      { ...completeSimulationInput, liveExecutionAllowed: true },
      { ...completeSimulationInput, sent: true, providerCalled: true, canSendNow: true },
      { ...completeSimulationInput, persistenceAllowedNow: true },
    ];

    for (const input of inputs) {
      assertExecutionImpossible(createR48FinalControlledActivationStackReview(input));
    }
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR48FinalControlledActivationStackReview(),
      createR48FinalControlledActivationStackReview(completeSimulationInput),
      createR48FinalControlledActivationStackReview({
        ...completeSimulationInput,
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
