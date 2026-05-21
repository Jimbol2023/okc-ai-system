import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertSendSmsRouteSafetySmokeInvariants,
  createSendSmsRouteSafetySmokeContract,
} from "./send-sms-route-safety-smoke-contract";

const safeStaticInput = {
  routeSnapshotProvided: true,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
  providerExecutionBlocked: true,
  twilioActivationAbsent: true,
  envSecretReadsAbsent: true,
  fetchNetworkCallsAbsent: true,
  dbPrismaMutationAbsent: true,
  automationCycleActivationAbsent: true,
  safetyEnvelope: {
    present: true,
    mode: "simulation_only",
    executionBlocked: true,
    providerDisabled: true,
    liveExecutionEnabled: false,
    reasonCodes: ["simulation_only", "provider_disabled", "live_execution_blocked"],
  },
  validationErrorPathsPreserveInvariants: true,
  liveExecutionBranchAbsent: true,
};

describe("send-sms route safety smoke contract", () => {
  it("fails closed with default missing inputs", () => {
    const result = createSendSmsRouteSafetySmokeContract();

    assert.equal(result.passed, false);
    assert.equal(result.route, "send-sms");
    assert.equal(result.smokeLevel, "static_contract");
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.liveTestReady, false);
    assert.ok(result.reasonCodes.includes("route_snapshot_missing"));
    assert.ok(result.reasonCodes.includes("safety_envelope_missing"));
  });

  it("fails if providerCalled true is supplied", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      providerCalled: true,
    });

    assert.equal(result.passed, false);
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assert.equal(result.providerCalled, false);
  });

  it("fails if sent true is supplied", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      sent: true,
    });

    assert.equal(result.passed, false);
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.equal(result.sent, false);
  });

  it("fails if simulationOnly false is supplied", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      simulationOnly: false,
    });

    assert.equal(result.passed, false);
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assert.equal(result.simulationOnly, true);
  });

  it("fails if liveTestReady true is supplied", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      liveTestReady: true,
    });

    assert.equal(result.passed, false);
    assert.ok(result.reasonCodes.includes("live_test_ready_must_be_false"));
    assert.equal(result.liveTestReady, false);
  });

  it("fails if canSendNow true is supplied", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      canSendNow: true,
    });

    assert.equal(result.passed, false);
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.equal(result.canSendNow, false);
  });

  it("fails if the safety envelope is missing", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      safetyEnvelope: undefined,
    });

    assert.equal(result.passed, false);
    assert.ok(result.reasonCodes.includes("safety_envelope_missing"));
  });

  it("passes only as a simulation/static contract", () => {
    const result = createSendSmsRouteSafetySmokeContract(safeStaticInput);

    assert.equal(result.passed, true);
    assert.equal(result.smokeLevel, "static_contract");
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.liveTestReady, false);
    assert.ok(result.reasonCodes.includes("static_contract_only"));
    assert.ok(result.reasonCodes.includes("passed_does_not_authorize_live_execution"));
  });

  it("asserts output invariants even when the static smoke fails", () => {
    const result = createSendSmsRouteSafetySmokeContract({
      ...safeStaticInput,
      liveExecutionBranchAbsent: false,
    });
    const invariantCheck = assertSendSmsRouteSafetySmokeInvariants(result);

    assert.equal(result.passed, false);
    assert.equal(invariantCheck.passed, true);
    assert.deepEqual(invariantCheck.reasonCodes, []);
    assert.ok(result.reasonCodes.includes("live_execution_branch_detected"));
  });
});
