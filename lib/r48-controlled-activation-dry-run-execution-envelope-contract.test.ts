import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR48ControlledActivationDryRunExecutionEnvelopeInvariants,
  createR48ControlledActivationDryRunExecutionEnvelope,
  type R48ControlledActivationDryRunExecutionEnvelopeInput,
  type R48ControlledActivationDryRunExecutionEnvelopeResult,
} from "./r48-controlled-activation-dry-run-execution-envelope-contract";

const safeInput: R48ControlledActivationDryRunExecutionEnvelopeInput = {
  scenario: {
    scenarioId: "r48g-scenario-1",
    scenarioName: "Controlled activation dry-run",
    requestedBy: "operator-1",
    requestedScope: "controlled_activation_dry_run_simulation_only",
    simulationOnly: true,
  },
  readinessGateDecision: "simulation_only_ready",
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
  auditMetadata: {
    eventType: "r48g_dry_run_requested",
    correlationId: "r48g-correlation-1",
    operatorId: "operator-1",
    scenarioId: "r48g-scenario-1",
    containsSecrets: false,
    secretFieldNames: [],
    metadataWriteAttempted: false,
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

function assertExecutionImpossible(result: R48ControlledActivationDryRunExecutionEnvelopeResult) {
  const invariantCheck = assertR48ControlledActivationDryRunExecutionEnvelopeInvariants(result);

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

function assertLiveActionsProhibited(result: R48ControlledActivationDryRunExecutionEnvelopeResult) {
  assert.ok(result.prohibitedLiveActions.includes("execute_activation"));
  assert.ok(result.prohibitedLiveActions.includes("enable_provider"));
  assert.ok(result.prohibitedLiveActions.includes("call_provider"));
  assert.ok(result.prohibitedLiveActions.includes("send_sms"));
  assert.ok(result.prohibitedLiveActions.includes("send_email"));
  assert.ok(result.prohibitedLiveActions.includes("enable_live_execution"));
}

describe("R48 controlled activation dry-run execution envelope contract", () => {
  it("fails closed with default missing input", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope();

    assert.equal(result.dryRunEnvelopeStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("scenario_missing"));
    assert.ok(result.reasonCodes.includes("readiness_decision_missing"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertLiveActionsProhibited(result);
    assertExecutionImpossible(result);
  });

  it("prohibited readiness decision rejects dry-run", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      readinessGateDecision: "prohibited",
    });

    assert.equal(result.dryRunEnvelopeStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("readiness_decision_prohibited"));
    assertExecutionImpossible(result);
  });

  it("blocked readiness decision rejects dry-run", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      readinessGateDecision: "blocked",
    });

    assert.equal(result.dryRunEnvelopeStatus, "dry_run_rejected");
    assert.ok(result.reasonCodes.includes("readiness_decision_blocked"));
    assertExecutionImpossible(result);
  });

  it("attempted execution indicators prohibit", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      activationExecuted: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.equal(result.dryRunEnvelopeStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_test_ready_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("provider live and send indicators prohibit", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
    });

    assert.equal(result.dryRunEnvelopeStatus, "prohibited");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("sent_must_be_false"));
    assert.ok(result.reasonCodes.includes("provider_called_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("unsafe provider boundary rejects dry-run", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      providerBoundary: {
        ok: false,
        providerDisabled: false,
        providerCalled: true,
        sent: false,
        activationAllowed: true,
      },
    });

    assert.equal(result.dryRunEnvelopeStatus, "dry_run_rejected");
    assert.equal(result.providerBoundaryStatus, "unsafe");
    assert.ok(result.reasonCodes.includes("provider_boundary_unsafe"));
    assertExecutionImpossible(result);
  });

  it("unsafe kill-switch rejects dry-run", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      killSwitch: {
        allowed: false,
        killSwitchActive: true,
        emergencyStopActive: false,
      },
    });

    assert.equal(result.dryRunEnvelopeStatus, "dry_run_rejected");
    assert.equal(result.killSwitchStatus, "unsafe");
    assert.ok(result.reasonCodes.includes("kill_switch_unsafe"));
    assertExecutionImpossible(result);
  });

  it("missing allowlist rejects dry-run", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      allowlist: {
        required: true,
        allowed: false,
        recipientMatched: false,
      },
    });

    assert.equal(result.dryRunEnvelopeStatus, "dry_run_rejected");
    assert.equal(result.allowlistStatus, "missing_or_mismatch");
    assert.ok(result.reasonCodes.includes("allowlist_missing_or_mismatch"));
    assertExecutionImpossible(result);
  });

  it("audit metadata remains non-secret", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      auditMetadata: {
        eventType: "r48g_dry_run_requested",
        correlationId: "api_key_should_not_be_here",
        operatorId: "operator-1",
        scenarioId: "r48g-scenario-1",
        containsSecrets: true,
        secretFieldNames: ["api_key"],
        metadataWriteAttempted: true,
      },
    });

    assert.equal(result.dryRunEnvelopeStatus, "dry_run_rejected");
    assert.equal(result.futureAuditEventMetadata.containsSecrets, false);
    assert.equal(result.futureAuditEventMetadata.metadataWriteAttempted, false);
    assert.equal(result.futureAuditEventMetadata.correlationId, "redacted_secret_like_value");
    assert.ok(result.reasonCodes.includes("audit_metadata_secret_detected"));
    assertExecutionImpossible(result);
  });

  it("safe state returns simulation_only_ready", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope(safeInput);

    assert.equal(result.dryRunEnvelopeStatus, "simulation_only_ready");
    assert.equal(result.finalSimulationOnlyOutcome, "ready");
    assert.ok(result.allowedDryRunActions.includes("simulate_provider_boundary"));
    assert.ok(result.reasonCodes.includes("simulation_only_ready"));
    assertLiveActionsProhibited(result);
    assertExecutionImpossible(result);
  });

  it("planning-only state returns planning_only", () => {
    const result = createR48ControlledActivationDryRunExecutionEnvelope({
      ...safeInput,
      readinessGateDecision: "planning_only_ready",
    });

    assert.equal(result.dryRunEnvelopeStatus, "planning_only");
    assert.equal(result.finalSimulationOnlyOutcome, "planning_only");
    assert.ok(result.allowedDryRunActions.includes("continue_planning_only"));
    assertExecutionImpossible(result);
  });

  it("no path allows provider activation live execution or send", () => {
    const inputs: R48ControlledActivationDryRunExecutionEnvelopeInput[] = [
      {},
      safeInput,
      { ...safeInput, readinessGateDecision: "planning_only_ready" },
      { ...safeInput, readinessGateDecision: "blocked" },
      { ...safeInput, readinessGateDecision: "prohibited" },
      { ...safeInput, providerActivationAllowed: true, sent: true },
    ];

    for (const input of inputs) {
      const result = createR48ControlledActivationDryRunExecutionEnvelope(input);

      assertLiveActionsProhibited(result);
      assertExecutionImpossible(result);
    }
  });
});
