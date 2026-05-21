import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertLiveTestReadinessSummaryInvariants,
  createLiveTestReadinessSummary,
  type LiveTestReadinessSummaryInput,
} from "./live-test-readiness-summary-contract";

const safeInput: LiveTestReadinessSummaryInput = {
  runtimeContract: {
    ok: true,
    adapterOnly: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    reasonCodes: ["runtime_contract_adapter_only"],
  },
  operatorConfirmation: {
    operatorConfirmed: true,
    confirmationValid: true,
    state: "operator_confirmed_simulation_only",
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    reasonCodes: ["operator_confirmation_valid_for_simulation_only"],
  },
  auditPersistence: {
    persistencePlanned: true,
    persistenceExecuted: false,
    dbWriteAttempted: false,
    readinessState: "ready_for_future_persistence",
    forbiddenFieldsDetected: [],
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    reasonCodes: ["safe_for_future_persistence_preview"],
  },
  executionPolicy: {
    allowed: true,
    mode: "future_live_test",
    sent: false,
    providerCalled: false,
    dncBlocked: false,
    requiresHumanApproval: false,
    reasonCodes: ["future_live_test_allowed"],
  },
  providerBoundary: {
    ok: true,
    providerMode: "mock",
    sent: false,
    providerCalled: false,
    reasonCodes: ["mock_provider_default"],
  },
  approvalStatus: "approved_for_outreach",
  doNotContact: false,
  optOutReason: null,
  allowlistAllowed: true,
  killSwitchAllowed: true,
  killSwitchActive: false,
  emergencyStopActive: false,
  simulationOnly: true,
};

describe("live test readiness summary contract", () => {
  it("fails closed with default missing inputs", () => {
    const result = createLiveTestReadinessSummary();

    assert.equal(result.readinessLevel, "blocked");
    assert.equal(result.liveTestReady, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.simulationOnly, true);
    assert.ok(result.reasonCodes.includes("runtime_contract_missing"));
    assert.ok(result.reasonCodes.includes("operator_confirmation_missing"));
    assert.ok(result.reasonCodes.includes("audit_persistence_missing"));
  });

  it("lets kill-switch blocked state dominate readiness", () => {
    const result = createLiveTestReadinessSummary({
      ...safeInput,
      killSwitchAllowed: false,
      killSwitchActive: true,
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("kill_switch_blocked"));
    assert.ok(result.blockingFactors.some((factor) => /Kill-switch/i.test(factor)));
    assert.equal(result.liveTestReady, false);
  });

  it("blocks provider-called and sent states", () => {
    const result = createLiveTestReadinessSummary({
      ...safeInput,
      runtimeContract: {
        ...safeInput.runtimeContract,
        sent: true,
        providerCalled: true,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
  });

  it("blocks simulationOnly false", () => {
    const result = createLiveTestReadinessSummary({
      ...safeInput,
      simulationOnly: false,
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assert.equal(result.simulationOnly, true);
  });

  it("blocks missing operator confirmation", () => {
    const result = createLiveTestReadinessSummary({
      ...safeInput,
      operatorConfirmation: {
        ...safeInput.operatorConfirmation,
        confirmationValid: false,
        operatorConfirmed: false,
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("operator_confirmation_invalid"));
    assert.ok(result.requiredNextHumanActions.some((action) => /Confirm/i.test(action)));
  });

  it("blocks unsafe audit persistence planning", () => {
    const result = createLiveTestReadinessSummary({
      ...safeInput,
      auditPersistence: {
        ...safeInput.auditPersistence,
        readinessState: "blocked_secret_detected",
        forbiddenFieldsDetected: ["twilioAuthToken"],
      },
    });

    assert.equal(result.readinessLevel, "blocked");
    assert.ok(result.reasonCodes.includes("audit_persistence_unsafe"));
    assert.equal(result.liveTestReady, false);
  });

  it("caps fully safe state at simulation_ready, never liveTestReady", () => {
    const result = createLiveTestReadinessSummary(safeInput);

    assert.equal(result.readinessLevel, "simulation_ready");
    assert.equal(result.liveTestReady, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.simulationOnly, true);
    assert.ok(result.reasonCodes.includes("simulation_ready_only"));
    assert.ok(result.reasonCodes.includes("live_test_not_authorized"));
  });

  it("asserts output invariants in all cases", () => {
    const result = createLiveTestReadinessSummary({
      ...safeInput,
      providerBoundary: {
        ...safeInput.providerBoundary,
        providerCalled: true,
      },
    });
    const invariantCheck = assertLiveTestReadinessSummaryInvariants(result);

    assert.equal(invariantCheck.passed, true);
    assert.deepEqual(invariantCheck.reasonCodes, []);
    assert.equal(result.liveTestReady, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.providerCalled, false);
  });
});
