import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR62BuyerDispositionOperationalReadonlyUiImplementationScopeInvariants,
  createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract,
  summarizeR62BuyerDispositionOperationalReadonlyUiImplementationScope,
  type R62ReadonlyUiImplementationScopeInput,
  type R62ReadonlyUiImplementationScopeResult,
} from "./r62-buyer-disposition-operational-intelligence-readonly-ui-implementation-scope-contract";

const readyInput: R62ReadonlyUiImplementationScopeInput = {
  r62bUiScopeAuditReviewed: true,
  futureSurfacesReviewed: true,
  readOnlyDataReviewed: true,
  displaySectionsReviewed: true,
  priorityOrderingReviewed: true,
  staleDealPackageDisplayReviewed: true,
  assignmentReadinessDisplayReviewed: true,
  buyerEngagementDemandMismatchDisplayReviewed: true,
  workloadPriorityDisplayReviewed: true,
  safeCopyReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  dangerousPatternsReviewed: true,
  operatorReviewCompleted: true,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  uiImplementationAllowedNow: false,
};

function assertSafety(result: R62ReadonlyUiImplementationScopeResult) {
  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.approvalGrantsExecution, false);
  assert.equal(result.uiImplementationAllowedNow, false);
  assert.deepEqual(result.safetyFlags, {
    readOnly: true,
    advisoryOnly: true,
    simulationOnly: true,
    providerCalled: false,
    sent: false,
    persistenceAllowedNow: false,
    pollingAllowed: false,
    runtimeActivationAllowed: false,
    providerActivationAllowed: false,
    approvalGrantsExecution: false,
    uiImplementationAllowedNow: false,
  });
  assert.equal(assertR62BuyerDispositionOperationalReadonlyUiImplementationScopeInvariants(result).passed, true);
}

test("R62C defaults to operator review with hard-closed safety flags", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract();

  assert.equal(result.phase, "R62C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r62c_readonly_ui_implementation_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r62b_ui_scope_audit_required"));
  assertSafety(result);
});

test("R62C defines existing dashboard as the only allowed future surface", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);

  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedFutureUiSurface.surface, "existing_dashboard");
  assert.equal(result.allowedFutureUiSurface.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(
    result.allowedFutureUiSurface.futureComponentAllowed,
    "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx",
  );
  assert.equal(result.allowedFutureUiSurface.routeChangesAllowed, false);
  assert.equal(result.allowedFutureUiSurface.redesignAllowed, false);
  assert.equal(result.allowedFutureUiSurface.implementationAllowedNow, false);
  assertSafety(result);
});

test("R62C defines forbidden UI surfaces and execution controls", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);

  assert.ok(result.forbiddenUiSurfaces.includes("new_buyer_outreach_console"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_campaign_tab"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_provider_twilio_console"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_execution_queue"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_automation_agent_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_send_approval_workflow_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_autonomous_matching_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_route_without_explicit_authorization"));
  assert.ok(result.forbiddenExecutionControls.includes("send to buyers"));
  assert.ok(result.forbiddenExecutionControls.includes("buyer communication execution"));
  assert.ok(result.forbiddenExecutionControls.includes("AI negotiates automatically"));
  assertSafety(result);
});

test("R62C defines allowed read-only operational data concepts", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);
  const concepts = result.allowedReadOnlyOperationalDataConcepts.map((item) => item.concept);
  const boundaries = result.allowedReadOnlyOperationalDataConcepts.map((item) => item.displayBoundary).join(" ");

  assert.ok(concepts.includes("buyer_response_probability_review"));
  assert.ok(concepts.includes("buyer_engagement_quality_review"));
  assert.ok(concepts.includes("assignment_readiness_review"));
  assert.ok(concepts.includes("buyer_package_completeness_review"));
  assert.ok(concepts.includes("stale_buyer_package"));
  assert.ok(concepts.includes("stale_deal_visibility"));
  assert.ok(concepts.includes("buyer_demand_mismatch"));
  assert.ok(concepts.includes("high_likelihood_assignment_review"));
  assert.ok(concepts.includes("disposition_workload_priority"));
  assert.match(boundaries, /does not mean send/i);
  assert.match(boundaries, /no autonomous buyer matching/i);
  assertSafety(result);
});

test("R62C defines governance-stop-first ordering", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);

  assert.deepEqual(
    result.priorityOrderingDisplayRules.map((rule) => rule.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  );
  assert.equal(result.priorityOrderingDisplayRules[0]?.section, "governance_stop_signals");
  assert.equal(result.priorityOrderingDisplayRules[1]?.section, "revenue_priority_disposition_review");
  assert.match(result.governanceStopFirstDisplayRules.join(" "), /must render before all buyer disposition/i);
  assert.match(result.governanceStopFirstDisplayRules.join(" "), /outrank revenue priority/i);
  assertSafety(result);
});

test("R62C defines stale-deal and package display boundaries", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);
  const rules = result.staleDealPackageDisplayRules.join(" ");

  assert.match(rules, /Stale buyer package may appear only as read-only/i);
  assert.match(rules, /Stale deal visibility may appear only as manual disposition review/i);
  assert.match(rules, /without inventing property facts/i);
  assert.match(rules, /cannot release, share, send/i);
  assertSafety(result);
});

test("R62C defines assignment-readiness display boundaries", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);
  const rules = result.assignmentReadinessDisplayRules.join(" ");

  assert.match(rules, /Assignment-readiness review needed/i);
  assert.match(rules, /High-likelihood assignment review/i);
  assert.match(rules, /cannot become an execution queue/i);
  assert.match(rules, /High assignment probability does not mean send/i);
  assertSafety(result);
});

test("R62C defines buyer engagement and demand mismatch display boundaries", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);
  const rules = result.buyerEngagementDemandMismatchDisplayRules.join(" ");

  assert.match(rules, /Buyer response probability review/i);
  assert.match(rules, /Buyer engagement review needed/i);
  assert.match(rules, /does not authorize contact/i);
  assert.match(rules, /Buyer demand mismatch/i);
  assert.match(rules, /cannot imply autonomous buyer matching/i);
  assertSafety(result);
});

test("R62C defines workload priority, bottleneck, and safe copy rules", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);

  assert.match(result.workloadPriorityDisplayRules.join(" "), /Revenue-priority disposition review/i);
  assert.match(result.workloadPriorityDisplayRules.join(" "), /not assign work, mutate tasks, poll, persist, or execute/i);
  assert.match(result.dispositionBottleneckDisplayRules.join(" "), /Blocked disposition must remain a review-only stop signal/i);
  assert.ok(result.safeCopyRules.includes("Manual disposition review recommended"));
  assert.ok(result.safeCopyRules.includes("Disposition priority label is advisory only"));
  assert.ok(result.safeCopyRules.includes("Review buyer context before taking action"));
  assert.ok(result.safeCopyRules.includes("High assignment probability does not mean send"));
  assertSafety(result);
});

test("R62C defines accessibility and no-execution boundaries", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(readyInput);
  const accessibility = result.accessibilityRules.join(" ");
  const boundaries = result.noExecutionBoundaries.join(" ");

  assert.match(accessibility, /semantic region with a stable heading/i);
  assert.match(accessibility, /semantic headings for each read-only/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /text-based and never depend on color alone/i);
  assert.match(accessibility, /Do not move focus, require motion, auto-refresh, poll/i);
  assert.match(boundaries, /No UI implementation, dashboard page change/i);
  assert.match(boundaries, /No email, SMS, buyer outreach/i);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms/i);
  assertSafety(result);
});

test("R62C rejects UI, dashboard, route, provider, sending, outreach, persistence, and automation requests", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    dashboardPageComponentChangeRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    buyerCommunicationExecutionRequested: true,
    campaignLaunchRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousMatchingRequested: true,
    autonomousBuyerOutreachRequested: true,
    autonomousNegotiationRequested: true,
    autoAssignmentWorkflowRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("dashboard_page_component_change_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("buyer_communication_execution_rejected"));
  assert.ok(result.warningCodes.includes("campaign_launch_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_matching_rejected"));
  assert.ok(result.warningCodes.includes("auto_assignment_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R62C rejects unsafe flags while preserving safe output flags", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract({
    ...readyInput,
    readOnly: false,
    advisoryOnly: false,
    simulationOnly: false,
    providerCalled: true,
    sent: true,
    persistenceAllowedNow: true,
    pollingAllowed: true,
    runtimeActivationAllowed: true,
    providerActivationAllowed: true,
    uiImplementationAllowedNow: true,
  });

  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("advisory_only_required"));
  assert.ok(result.warningCodes.includes("simulation_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
  assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
  assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
  assertSafety(result);
});

test("R62C summary is bounded and points to read-only UI implementation", () => {
  const result = createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract({
    ...readyInput,
    extraScopeNotes: ["R62C note".repeat(100)],
  });
  const summary = summarizeR62BuyerDispositionOperationalReadonlyUiImplementationScope(result);

  assert.equal(
    result.nextSuggestedPhase,
    "R62D - Buyer Disposition Operational Intelligence Read-Only UI Implementation",
  );
  assert.ok(summary.length <= 903);
  assert.match(summary, /existing dashboard placement only/i);
  assert.match(summary, /cannot authorize UI implementation/i);
  assertSafety(result);
});
