import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR54ReadOnlyObservabilityExpansionPlanInvariants,
  createR54ReadOnlyObservabilityExpansionPlanContract,
  type R54ReadOnlyObservabilityExpansionPlanInput,
  type R54ReadOnlyObservabilityExpansionPlanResult,
} from "./r54-read-only-observability-expansion-plan-contract";

const readyInput: R54ReadOnlyObservabilityExpansionPlanInput = {
  candidateSurfacesReviewed: true,
  safetyBoundariesReviewed: true,
  accessibilityExpectationsReviewed: true,
  operatorReviewCompleted: true,
  uiExpansionRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  advisoryConvertedToPermission: false,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  liveExecutionAllowed: false,
  providerActivationAllowed: false,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
};

function assertSafety(result: R54ReadOnlyObservabilityExpansionPlanResult) {
  const invariantCheck = assertR54ReadOnlyObservabilityExpansionPlanInvariants(result);

  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.deepEqual(result.safetyFlags, {
    readOnly: true,
    advisoryOnly: true,
    simulationOnly: true,
    liveExecutionAllowed: false,
    providerActivationAllowed: false,
    providerCalled: false,
    sent: false,
    persistenceAllowedNow: false,
    pollingAllowed: false,
    runtimeActivationAllowed: false,
  });
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R54 read-only observability expansion plan contract", () => {
  it("missing default input fails closed and requires operator review", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract();

    assert.equal(result.planStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("candidate_review_required"));
    assert.ok(result.warningCodes.includes("safety_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertSafety(result);
  });

  it("recommends lead detail as the safest next observability surface", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract(readyInput);

    assert.equal(result.planStatus, "observability_expansion_plan_ready");
    assert.equal(result.recommendedSurface, "lead_detail_observability");
    assert.equal(result.candidateRankings[0].surface, "lead_detail_observability");
    assert.match(result.reasons.join(" "), /point-of-work/i);
    assertSafety(result);
  });

  it("ranks candidate surfaces deterministically with all required candidates", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract(readyInput);

    assert.deepEqual(
      result.candidateRankings.map((candidate) => candidate.surface),
      ["lead_detail_observability", "revenue_operations_summary_contract", "approval_queue_observability"],
    );
    assert.deepEqual(
      result.candidateRankings.map((candidate) => candidate.rank),
      [1, 2, 3],
    );
    assert.ok(result.candidateRankings[0].totalScore > result.candidateRankings[1].totalScore);
    assert.ok(result.candidateRankings[1].totalScore > result.candidateRankings[2].totalScore);
    assertSafety(result);
  });

  it("captures why approval queue observability is not first", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract(readyInput);
    const approvalQueue = result.candidateRankings.find(
      (candidate) => candidate.surface === "approval_queue_observability",
    );

    assert.ok(approvalQueue);
    assert.match(approvalQueue.reasons.join(" "), /approval controls/i);
    assert.match(approvalQueue.reasons.join(" "), /permission/i);
    assert.ok(approvalQueue.blockedPatterns.includes("approve-and-send wording"));
    assertSafety(result);
  });

  it("defines allowed and blocked patterns for future read-only expansion", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract(readyInput);

    assert.ok(result.allowedPatterns.includes("read-only metric cards"));
    assert.ok(result.allowedPatterns.includes("in-memory input summaries"));
    assert.ok(result.blockedPatterns.includes("send controls"));
    assert.ok(result.blockedPatterns.includes("approval means send"));
    assert.ok(result.blockedPatterns.includes("automation is ready"));
    assert.ok(result.blockedPatterns.includes("runtime activation is ready"));
    assert.ok(result.blockedPatterns.includes("provider activation is allowed"));
    assert.ok(result.blockedPatterns.includes("persistence is allowed"));
    assert.ok(result.blockedPatterns.includes("polling is allowed"));
    assertSafety(result);
  });

  it("preserves accessibility expectations for the next slice", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract(readyInput);
    const expectations = result.accessibilityExpectations.join(" ");

    assert.match(expectations, /semantic headings/i);
    assert.match(expectations, /color alone/i);
    assert.match(expectations, /keyboard order/i);
    assert.match(expectations, /motion/i);
    assert.match(expectations, /screen-reader-friendly/i);
    assertSafety(result);
  });

  it("blocks UI expansion route runtime provider sending automation polling persistence and permission requests", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract({
      ...readyInput,
      uiExpansionRequested: true,
      routeChangeRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      advisoryConvertedToPermission: true,
    });

    assert.equal(result.planStatus, "observability_expansion_blocked");
    assert.ok(result.warningCodes.includes("ui_expansion_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assertSafety(result);
  });

  it("blocks unsafe safety flag inputs while preserving output invariants", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract({
      ...readyInput,
      readOnly: false,
      advisoryOnly: false,
      simulationOnly: false,
      liveExecutionAllowed: true,
      providerActivationAllowed: true,
      providerCalled: true,
      sent: true,
      persistenceAllowedNow: true,
      pollingAllowed: true,
      runtimeActivationAllowed: true,
    });

    assert.equal(result.planStatus, "observability_expansion_blocked");
    assert.ok(result.warningCodes.includes("read_only_required"));
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assert.ok(result.warningCodes.includes("polling_not_allowed"));
    assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
    assertSafety(result);
  });

  it("sets the next suggested phase without implementing UI expansion", () => {
    const result = createR54ReadOnlyObservabilityExpansionPlanContract(readyInput);

    assert.equal(
      result.nextSuggestedPhase,
      "R54B — Lead Detail Read-Only Observability Scope Contract, without UI implementation or runtime activation.",
    );
    assertSafety(result);
  });

  it("bounds operator notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r54_observability_note_${index}_${"x".repeat(220)}`);
    const result = createR54ReadOnlyObservabilityExpansionPlanContract({
      ...readyInput,
      extraPlanningNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
