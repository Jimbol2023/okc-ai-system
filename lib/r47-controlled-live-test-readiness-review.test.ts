import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR47ControlledLiveTestReadinessReviewInvariants,
  createR47ControlledLiveTestReadinessReview,
  r47ControlledLiveTestRequiredPhases,
  type R47ControlledLiveTestPhase,
  type R47ControlledLiveTestReadinessReviewInput,
} from "./r47-controlled-live-test-readiness-review";

function createCompletePhases(): Record<R47ControlledLiveTestPhase, NonNullable<R47ControlledLiveTestReadinessReviewInput["phases"]>[R47ControlledLiveTestPhase]> {
  return Object.fromEntries(
    r47ControlledLiveTestRequiredPhases.map((phase) => [
      phase,
      {
        complete: true,
        sent: false,
        providerCalled: false,
        canSendNow: false,
        simulationOnly: true,
        liveTestReady: false,
        reasonCodes: [`${phase}_complete`],
      },
    ]),
  ) as Record<R47ControlledLiveTestPhase, NonNullable<R47ControlledLiveTestReadinessReviewInput["phases"]>[R47ControlledLiveTestPhase]>;
}

const safeStaticSmoke = {
  passed: true,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
  reasonCodes: ["static_contract_only", "passed_does_not_authorize_live_execution"],
};

describe("R47 controlled live-test readiness review", () => {
  it("fails closed with default missing inputs", () => {
    const result = createR47ControlledLiveTestReadinessReview();

    assert.equal(result.r47Complete, false);
    assert.equal(result.controlledLiveTestPlanningReady, false);
    assert.equal(result.liveExecutionReady, false);
    assert.equal(result.providerActivationAllowed, false);
    assert.equal(result.routeExecutionAllowed, false);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.liveTestReady, false);
    assert.ok(result.reasonCodes.includes("phase_missing"));
    assert.ok(result.reasonCodes.includes("static_smoke_missing"));
  });

  it("marks R47 complete only when every phase and static smoke signal is safe", () => {
    const result = createR47ControlledLiveTestReadinessReview({
      phases: createCompletePhases(),
      staticRouteSafetySmoke: safeStaticSmoke,
    });

    assert.equal(result.r47Complete, true);
    assert.equal(result.controlledLiveTestPlanningReady, true);
    assert.equal(result.liveExecutionReady, false);
    assert.equal(result.providerActivationAllowed, false);
    assert.equal(result.routeExecutionAllowed, false);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.liveTestReady, false);
    assert.equal(result.completedPhases.length, r47ControlledLiveTestRequiredPhases.length);
    assert.deepEqual(result.missingPhases, []);
    assert.ok(result.reasonCodes.includes("planning_stack_complete"));
    assert.ok(result.reasonCodes.includes("controlled_live_test_planning_ready"));
  });

  it("blocks incomplete phases", () => {
    const phases = createCompletePhases();

    phases.R47G_route_readiness_summary_integration = {
      ...phases.R47G_route_readiness_summary_integration,
      complete: false,
    };

    const result = createR47ControlledLiveTestReadinessReview({
      phases,
      staticRouteSafetySmoke: safeStaticSmoke,
    });

    assert.equal(result.r47Complete, false);
    assert.ok(result.reasonCodes.includes("phase_incomplete"));
    assert.ok(result.missingPhases.includes("R47G_route_readiness_summary_integration"));
  });

  it("blocks any phase execution-readiness signal", () => {
    const phases = createCompletePhases();

    phases.R47C_send_route_simulation_integration = {
      ...phases.R47C_send_route_simulation_integration,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
    };

    const result = createR47ControlledLiveTestReadinessReview({
      phases,
      staticRouteSafetySmoke: safeStaticSmoke,
    });

    assert.equal(result.r47Complete, false);
    assert.ok(result.reasonCodes.includes("phase_execution_signal_detected"));
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.liveTestReady, false);
  });

  it("blocks simulationOnly false in a phase", () => {
    const phases = createCompletePhases();

    phases.R47H_route_safety_response_envelope = {
      ...phases.R47H_route_safety_response_envelope,
      simulationOnly: false,
    };

    const result = createR47ControlledLiveTestReadinessReview({
      phases,
      staticRouteSafetySmoke: safeStaticSmoke,
    });

    assert.equal(result.r47Complete, false);
    assert.ok(result.reasonCodes.includes("phase_not_simulation_only"));
    assert.equal(result.simulationOnly, true);
  });

  it("blocks failed static route smoke", () => {
    const result = createR47ControlledLiveTestReadinessReview({
      phases: createCompletePhases(),
      staticRouteSafetySmoke: {
        ...safeStaticSmoke,
        passed: false,
      },
    });

    assert.equal(result.r47Complete, false);
    assert.ok(result.reasonCodes.includes("static_smoke_failed"));
  });

  it("asserts final review invariants", () => {
    const result = createR47ControlledLiveTestReadinessReview({
      phases: createCompletePhases(),
      staticRouteSafetySmoke: safeStaticSmoke,
    });
    const invariantCheck = assertR47ControlledLiveTestReadinessReviewInvariants(result);

    assert.equal(invariantCheck.passed, true);
    assert.deepEqual(invariantCheck.reasonCodes, []);
    assert.equal(result.recommendedNextStep, "R48A_controlled_live_test_activation_plan_planning_only");
  });
});
