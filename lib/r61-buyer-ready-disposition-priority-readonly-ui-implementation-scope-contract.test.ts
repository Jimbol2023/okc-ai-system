import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR61BuyerReadyDispositionUiImplementationScopeInvariants,
  createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract,
  summarizeR61BuyerReadyDispositionUiImplementationScope,
  type R61UiImplementationScopeInput,
  type R61UiImplementationScopeResult,
} from "./r61-buyer-ready-disposition-priority-readonly-ui-implementation-scope-contract";

const readyInput: R61UiImplementationScopeInput = {
  r61bUiScopeReviewed: true,
  futureSurfacesReviewed: true,
  readOnlyDataReviewed: true,
  displaySectionsReviewed: true,
  priorityOrderingReviewed: true,
  packagePrepDisplayReviewed: true,
  buyerFitDisplayReviewed: true,
  demandAlignmentDisplayReviewed: true,
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

function assertSafety(result: R61UiImplementationScopeResult) {
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
  assert.equal(assertR61BuyerReadyDispositionUiImplementationScopeInvariants(result).passed, true);
}

test("R61C defaults to operator review with hard-closed safety flags", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract();

  assert.equal(result.phase, "R61C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r61c_readonly_ui_implementation_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r61b_ui_scope_review_required"));
  assertSafety(result);
});

test("R61C defines allowed future surface without allowing implementation now", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedFutureUiSurface.surface, "existing_dashboard");
  assert.equal(result.allowedFutureUiSurface.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(
    result.allowedFutureUiSurface.futureComponentAllowed,
    "components/dashboard/buyer-ready-disposition-priority-summary.tsx",
  );
  assert.equal(result.allowedFutureUiSurface.routeChangesAllowed, false);
  assert.equal(result.allowedFutureUiSurface.redesignAllowed, false);
  assert.equal(result.allowedFutureUiSurface.implementationAllowedNow, false);
  assertSafety(result);
});

test("R61C defines forbidden UI surfaces and controls", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.ok(result.forbiddenUiSurfaces.includes("new_buyer_outreach_console"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_campaign_tab"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_provider_twilio_console"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_execution_queue"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_automation_agent_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_send_approval_workflow_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_autonomous_matching_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("new_route_without_explicit_authorization"));
  assert.ok(result.forbiddenExecutionControls.includes("send to buyers"));
  assert.ok(result.forbiddenExecutionControls.includes("activate buyer outreach"));
  assert.ok(result.forbiddenExecutionControls.includes("provider activation"));
  assertSafety(result);
});

test("R61C defines allowed read-only buyer-ready data concepts", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);
  const concepts = result.allowedReadOnlyBuyerReadyDataConcepts.map((item) => item.concept);
  const boundaries = result.allowedReadOnlyBuyerReadyDataConcepts.map((item) => item.displayBoundary).join(" ");

  assert.ok(concepts.includes("buyer_ready_disposition_priority"));
  assert.ok(concepts.includes("near_buyer_ready_review"));
  assert.ok(concepts.includes("ready_to_package_deal"));
  assert.ok(concepts.includes("incomplete_buyer_package"));
  assert.ok(concepts.includes("buyer_fit_review_needed"));
  assert.ok(concepts.includes("buyer_demand_alignment_review"));
  assert.ok(concepts.includes("blocked_buyer_disposition"));
  assert.ok(concepts.includes("governance_stop_signals"));
  assert.match(boundaries, /buyer-ready does not mean send/i);
  assert.match(boundaries, /no package release or buyer outreach/i);
  assertSafety(result);
});

test("R61C defines priority ordering and governance-stop-first rules", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.deepEqual(
    result.priorityOrderingDisplayRules.map((rule) => rule.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  );
  assert.equal(result.priorityOrderingDisplayRules[0]?.section, "governance_stop_signals");
  assert.equal(result.priorityOrderingDisplayRules[1]?.section, "buyer_ready_disposition_priority");
  assert.equal(result.priorityOrderingDisplayRules[2]?.section, "near_buyer_ready_review");
  assert.match(result.governanceStopFirstDisplayRules.join(" "), /must render before buyer-ready/i);
  assert.match(result.governanceStopFirstDisplayRules.join(" "), /outrank buyer-readiness/i);
  assertSafety(result);
});

test("R61C defines package-prep display rules", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);
  const rules = result.packagePrepDisplayRules.join(" ");

  assert.match(rules, /Package-prep priority may appear only as read-only manual guidance/i);
  assert.match(rules, /Ready-to-package does not release, share, send/i);
  assert.match(rules, /Missing assignment, title, photos, repair, ARV, rent, or strategy data/i);
  assert.match(rules, /must not invent property facts/i);
  assertSafety(result);
});

test("R61C defines buyer-fit and demand-alignment display rules", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);
  const buyerFit = result.buyerFitReviewDisplayRules.join(" ");
  const demand = result.demandAlignmentDisplayRules.join(" ");

  assert.match(buyerFit, /Buyer-fit review needed may appear only as a manual review label/i);
  assert.match(buyerFit, /strategy, property type, price band, area, repair, ARV, rent/i);
  assert.match(buyerFit, /must not imply buyer-ready-to-contact/i);
  assert.match(demand, /Buyer demand alignment review may appear only as advisory prioritization/i);
  assert.match(demand, /cannot launch buyer campaigns/i);
  assertSafety(result);
});

test("R61C defines bottleneck, blocked disposition, and safe copy rules", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.match(result.dispositionBottleneckDisplayRules.join(" "), /Disposition bottleneck may show package, fit, data/i);
  assert.match(result.dispositionBottleneckDisplayRules.join(" "), /cannot assign work, mutate tasks/i);
  assert.match(result.blockedDispositionDisplayRules.join(" "), /Blocked buyer disposition must remain review-only/i);
  assert.match(result.blockedDispositionDisplayRules.join(" "), /cannot become approve-and-send/i);
  assert.ok(result.safeCopyRules.includes("Manual disposition review recommended"));
  assert.ok(result.safeCopyRules.includes("Buyer-ready label is advisory only"));
  assert.ok(result.safeCopyRules.includes("Review buyer package before taking action"));
  assert.ok(result.safeCopyRules.includes("Buyer-ready does not mean send"));
  assertSafety(result);
});

test("R61C defines accessibility and no-execution boundaries", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(readyInput);
  const accessibility = result.accessibilityRules.join(" ");
  const boundaries = result.noExecutionBoundaries.join(" ");

  assert.match(accessibility, /semantic section and stable heading/i);
  assert.match(accessibility, /semantic headings for each buyer disposition priority section/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /text-based and never depend on color alone/i);
  assert.match(accessibility, /Do not move focus, require motion, auto-refresh, poll/i);
  assert.match(boundaries, /No email, SMS, buyer outreach/i);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms/i);
  assert.match(boundaries, /No dashboard\/page\/component changes, routes, new fetches/i);
  assertSafety(result);
});

test("R61C rejects UI, dashboard, route, provider, sending, outreach, persistence, and automation requests", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    dashboardPageComponentChangeRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousBuyerOutreachRequested: true,
    autonomousNegotiationRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("dashboard_page_component_change_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("email_sms_sending_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_buyer_outreach_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_negotiation_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R61C rejects unsafe flags while preserving safe output flags", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract({
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

test("R61C summary is bounded and points to the future implementation phase", () => {
  const result = createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract({
    ...readyInput,
    extraScopeNotes: ["R61C note".repeat(100)],
  });
  const summary = summarizeR61BuyerReadyDispositionUiImplementationScope(result);

  assert.equal(result.nextSuggestedPhase, "R61D - Buyer-Ready Disposition Priority Intelligence Read-Only UI Implementation");
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assert.match(summary, /email, SMS, buyer outreach/i);
  assertSafety(result);
});
