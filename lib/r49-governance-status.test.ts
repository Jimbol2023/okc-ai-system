import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR49GovernanceStatusInvariants,
  createR49GovernanceStatus,
  type R49GovernanceStatusInput,
  type R49GovernanceStatusResult,
} from "./r49-governance-status";

const safeSimulationInput: R49GovernanceStatusInput = {
  status: "simulation_stack_complete",
  conclusion: "Simulation-only governance visibility is complete.",
  remainingBlockers: [],
  requiredOperatorActions: [],
  reasonCodes: ["simulation_stack_complete"],
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

function assertExecutionImpossible(result: R49GovernanceStatusResult) {
  const status = result.governanceStatus;
  const invariantCheck = assertR49GovernanceStatusInvariants(status);

  assert.equal(status.activationExecuted, false);
  assert.equal(status.providerActivationAllowed, false);
  assert.equal(status.liveExecutionAllowed, false);
  assert.equal(status.sent, false);
  assert.equal(status.providerCalled, false);
  assert.equal(status.canSendNow, false);
  assert.equal(status.simulationOnly, true);
  assert.equal(status.liveTestReady, false);
  assert.equal(status.persistenceAllowedNow, false);
  assert.equal(status.advisoryOnly, true);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.reasonCodes, []);
}

describe("R49 governance status helper", () => {
  it("missing default input fails closed", () => {
    const result = createR49GovernanceStatus();

    assert.equal(result.governanceStatus.phase, "R49_read_only_visibility");
    assert.equal(result.governanceStatus.status, "stack_incomplete");
    assert.ok(result.governanceStatus.reasonCodes.includes("governance_status_missing"));
    assert.ok(result.governanceStatus.reasonCodes.includes("simulation_only_required"));
    assert.ok(result.governanceStatus.remainingBlockers.includes("Governance status source is missing."));
    assertExecutionImpossible(result);
  });

  it("prohibited status maps safely", () => {
    const result = createR49GovernanceStatus({
      ...safeSimulationInput,
      status: "activation_prohibited",
      reasonCodes: ["governance_summary_prohibited"],
    });

    assert.equal(result.governanceStatus.status, "activation_prohibited");
    assert.ok(result.governanceStatus.reasonCodes.includes("governance_summary_prohibited"));
    assertExecutionImpossible(result);
  });

  it("blocked remediation and operator review statuses map safely", () => {
    const statuses: R49GovernanceStatusInput["status"][] = [
      "stack_incomplete",
      "remediation_required",
      "operator_review_required",
    ];

    for (const status of statuses) {
      const result = createR49GovernanceStatus({
        ...safeSimulationInput,
        status,
        remainingBlockers: status === "operator_review_required" ? [] : ["Review blocker"],
        requiredOperatorActions: status === "operator_review_required" ? ["Review required"] : [],
      });

      assert.equal(result.governanceStatus.status, status);
      assertExecutionImpossible(result);
    }
  });

  it("safe simulation stack preserves all execution flags false", () => {
    const result = createR49GovernanceStatus(safeSimulationInput);

    assert.equal(result.governanceStatus.status, "simulation_stack_complete");
    assertExecutionImpossible(result);
  });

  it("planning-only status preserves all execution flags false", () => {
    const result = createR49GovernanceStatus({
      ...safeSimulationInput,
      status: "planning_stack_complete",
      conclusion: "Planning-only governance visibility is complete.",
    });

    assert.equal(result.governanceStatus.status, "planning_stack_complete");
    assertExecutionImpossible(result);
  });

  it("status arrays are bounded and sanitized", () => {
    const longValue = ` ${"x".repeat(240)} `;
    const manyValues = Array.from({ length: 80 }, (_, index) => `value_${index}_${longValue}`);
    const result = createR49GovernanceStatus({
      ...safeSimulationInput,
      remainingBlockers: manyValues,
      requiredOperatorActions: manyValues,
      reasonCodes: manyValues,
    });

    assert.equal(result.governanceStatus.remainingBlockers.length, 40);
    assert.equal(result.governanceStatus.requiredOperatorActions.length, 40);
    assert.equal(result.governanceStatus.reasonCodes.length, 40);
    assert.ok(result.governanceStatus.remainingBlockers.every((value) => value.length <= 163));
    assert.ok(result.governanceStatus.requiredOperatorActions.every((value) => value.length <= 163));
    assert.ok(result.governanceStatus.reasonCodes.every((value) => value.length <= 163));
    assertExecutionImpossible(result);
  });

  it("no path returns canSendNow true", () => {
    const inputs: R49GovernanceStatusInput[] = [
      {},
      safeSimulationInput,
      { ...safeSimulationInput, canSendNow: true },
      {
        ...safeSimulationInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        simulationOnly: false,
        liveTestReady: true,
        persistenceAllowedNow: true,
      },
    ];

    for (const input of inputs) {
      assert.equal(createR49GovernanceStatus(input).governanceStatus.canSendNow, false);
      assertExecutionImpossible(createR49GovernanceStatus(input));
    }
  });

  it("hard invariants are preserved in every output", () => {
    const results = [
      createR49GovernanceStatus(),
      createR49GovernanceStatus(safeSimulationInput),
      createR49GovernanceStatus({
        ...safeSimulationInput,
        status: "activation_prohibited",
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        simulationOnly: false,
        liveTestReady: true,
        persistenceAllowedNow: true,
      }),
    ];

    for (const result of results) {
      assertExecutionImpossible(result);
    }
  });
});
