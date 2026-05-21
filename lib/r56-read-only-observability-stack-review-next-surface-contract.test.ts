import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR56ReadOnlyObservabilityStackReviewInvariants,
  createR56ReadOnlyObservabilityStackReviewNextSurfaceContract,
  type R56ReadOnlyObservabilityStackReviewInput,
  type R56ReadOnlyObservabilityStackReviewResult,
} from "./r56-read-only-observability-stack-review-next-surface-contract";

const readyInput: R56ReadOnlyObservabilityStackReviewInput = {
  r53DashboardReviewed: true,
  r54LeadDetailReviewed: true,
  r55ApprovalQueueReviewed: true,
  governanceDriftReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
  approvalPermissionRiskReviewed: true,
  runtimeProviderPollingPersistenceRiskReviewed: true,
  uiImplementationRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  approvalGrantsExecution: false,
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
  uiImplementationAllowedNow: false,
};

function assertSafety(result: R56ReadOnlyObservabilityStackReviewResult) {
  const invariantCheck = assertR56ReadOnlyObservabilityStackReviewInvariants(result);

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
  assert.equal(result.uiImplementationAllowedNow, false);
  assert.equal(result.approvalGrantsExecution, false);
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
    uiImplementationAllowedNow: false,
    approvalGrantsExecution: false,
  });
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R56 read-only observability stack review next-surface contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract();

    assert.equal(result.stackStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r53_review_required"));
    assert.ok(result.warningCodes.includes("r54_review_required"));
    assert.ok(result.warningCodes.includes("r55_review_required"));
    assert.ok(result.warningCodes.includes("governance_drift_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("approval_permission_review_required"));
    assert.ok(result.warningCodes.includes("runtime_risk_review_required"));
    assertSafety(result);
  });

  it("reviews the locked R53 R54 and R55 observability surfaces", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(readyInput);

    assert.deepEqual(result.reviewedSurfaces, [
      "dashboard_revenue_metrics",
      "lead_detail_observability",
      "approval_queue_observability",
    ]);
    assert.match(result.governanceDriftFindings.join(" "), /R53 dashboard metrics remain read-only/i);
    assert.match(result.governanceDriftFindings.join(" "), /R54 lead detail observability remains advisory/i);
    assert.match(result.governanceDriftFindings.join(" "), /R55 approval queue observability remains elevated-risk/i);
    assertSafety(result);
  });

  it("recommends manual revenue workday summary as the safest next surface", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(readyInput);

    assert.equal(result.stackStatus, "next_surface_plan_ready");
    assert.equal(result.recommendedNextSurface, "manual_revenue_workday_summary");
    assert.equal(result.candidateRankings[0].surface, "manual_revenue_workday_summary");
    assert.equal(result.candidateRankings[0].recommendation, "recommended_next");
    assert.match(result.recommendationReasons.join(" "), /far from approval controls/i);
    assert.match(result.nextSuggestedPhase, /R56B/i);
    assertSafety(result);
  });

  it("ranks candidate surfaces with deterministic safety criteria", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(readyInput);
    const surfaces = result.candidateRankings.map((candidate) => candidate.surface);

    assert.ok(surfaces.includes("closing_pipeline_observability"));
    assert.ok(surfaces.includes("buyer_disposition_observability"));
    assert.ok(surfaces.includes("follow_up_readiness_observability"));
    assert.ok(surfaces.includes("manual_revenue_workday_summary"));
    assert.ok(surfaces.includes("deal_readiness_observability"));
    assert.ok(surfaces.includes("do_not_expand_yet"));
    assert.ok(result.candidateRankings.every((candidate, index) => candidate.rank === index + 1));
    assert.ok(result.candidateRankings.every((candidate) => candidate.totalScore > 0));
    assertSafety(result);
  });

  it("blocks dangerous observability and approval semantics", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(readyInput);

    assert.ok(result.blockedPatterns.includes("Start Automation"));
    assert.ok(result.blockedPatterns.includes("Send SMS"));
    assert.ok(result.blockedPatterns.includes("Send Email"));
    assert.ok(result.blockedPatterns.includes("Auto Follow-Up"));
    assert.ok(result.blockedPatterns.includes("Activate Provider"));
    assert.ok(result.blockedPatterns.includes("Run Campaign"));
    assert.ok(result.blockedPatterns.includes("AI Autopilot"));
    assert.ok(result.blockedPatterns.includes("Override Governance"));
    assert.ok(result.blockedPatterns.includes("Persist Metrics"));
    assert.ok(result.blockedPatterns.includes("Approve and Send"));
    assert.ok(result.blockedPatterns.includes("Bulk Approve"));
    assert.ok(result.blockedPatterns.includes("ready to send"));
    assert.ok(result.blockedPatterns.includes("send after approval"));
    assert.ok(result.blockedPatterns.includes("queue execution"));
    assert.ok(result.blockedPatterns.includes("auto release"));
    assert.ok(result.blockedPatterns.includes("bulk send"));
    assert.ok(result.blockedPatterns.includes("approval grants execution"));
    assertSafety(result);
  });

  it("preserves required safety copy and accessibility consistency", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(readyInput);
    const copy = result.requiredSafetyCopy.join(" ");
    const accessibility = result.accessibilityConsistencyFindings.join(" ");

    assert.match(copy, /read-only and advisory-only/i);
    assert.match(copy, /do not send messages/i);
    assert.match(copy, /Human review remains required/i);
    assert.match(copy, /do-not-proceed signals/i);
    assert.match(accessibility, /semantic headings/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /focus movement/i);
    assert.match(accessibility, /auto-refresh/i);
    assertSafety(result);
  });

  it("locks implementation boundaries and does not authorize UI now", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(readyInput);

    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noNewSurfacesNow, true);
    assert.equal(result.implementationBoundaries.noApprovalBehaviorChanges, true);
    assert.equal(result.implementationBoundaries.noNewRoutes, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noProviderControls, true);
    assert.equal(result.implementationBoundaries.noRuntimeExecution, true);
    assert.equal(result.implementationBoundaries.noAutomationAgent, true);
    assert.equal(result.implementationBoundaries.noBulkActions, true);
    assert.equal(result.implementationBoundaries.futureWorkRequiresScopeContractFirst, true);
    assert.equal(result.implementationBoundaries.futureUiRequiresSeparateAuthorization, true);
    assertSafety(result);
  });

  it("blocks runtime provider sending polling persistence UI and approval execution requests", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract({
      ...readyInput,
      uiImplementationRequested: true,
      routeChangeRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      approvalGrantsExecution: true,
    });

    assert.equal(result.stackStatus, "stack_review_blocked");
    assert.equal(result.recommendedNextSurface, "do_not_expand_yet");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
    assertSafety(result);
  });

  it("blocks unsafe invariant inputs while preserving hard output invariants", () => {
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract({
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
      uiImplementationAllowedNow: true,
      approvalGrantsExecution: true,
    });

    assert.equal(result.stackStatus, "stack_review_blocked");
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
    assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
    assertSafety(result);
  });

  it("bounds review notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r56_stack_note_${index}_${"x".repeat(220)}`);
    const result = createR56ReadOnlyObservabilityStackReviewNextSurfaceContract({
      ...readyInput,
      extraReviewNotes: notes,
    });

    assert.equal(result.reviewNotes.length, 40);
    assert.ok(result.reviewNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
