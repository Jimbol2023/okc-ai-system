import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR51FormsErrorsTablesDashboardAccessibilityInvariants,
  createR51FormsErrorsTablesDashboardAccessibilityGovernance,
  type R51FormsErrorsTablesDashboardAccessibilityGovernanceInput,
  type R51FormsErrorsTablesDashboardAccessibilityGovernanceResult,
} from "./r51-forms-errors-tables-dashboard-accessibility-governance-contract";

const completeInput: R51FormsErrorsTablesDashboardAccessibilityGovernanceInput = {
  formLabelExpectationsPlanned: true,
  requiredFieldIndicatorExpectationsPlanned: true,
  helperTextAccessibilityPlanned: true,
  validationMessageAccessibilityPlanned: true,
  fieldLevelErrorMessagePlanned: true,
  errorSummaryExpectationsPlanned: true,
  accessibleTableStructurePlanned: true,
  tableHeaderCaptionExpectationsPlanned: true,
  sortableFilterableTableAccessibilityPlanned: true,
  dashboardKPIAccessibilityPlanned: true,
  dashboardCardAccessibilityPlanned: true,
  statusBadgeAccessibilityPlanned: true,
  nonColorOnlyStatusCommunicationPlanned: true,
  accessibilityDashboardTestingReviewPlanned: true,
  inaccessibleFormApproved: false,
  inaccessibleValidationErrorApproved: false,
  inaccessibleTableApproved: false,
  inaccessibleDashboardKPIApproved: false,
  colorOnlyBadgeStatusApproved: false,
  inaccessibleSortableFilterableWorkflowApproved: false,
  inaccessibleErrorSummaryApproved: false,
  runtimeAccessibilityMutationAttempted: false,
  uiRewriteRequested: false,
  advisoryOnly: true,
  simulationOnly: true,
  accessibilityGovernanceOnly: true,
  accessibilityReviewNotes: ["R51D planning scope only."],
  operatorRecommendations: [],
  accessibilityRemediationRecommendations: [],
  accessibilityReviewActions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertNoExecution(result: R51FormsErrorsTablesDashboardAccessibilityGovernanceResult) {
  const invariantCheck = assertR51FormsErrorsTablesDashboardAccessibilityInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveTestReady, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.accessibilityGovernanceOnly, true);
  assert.equal(result.runtimeMutationAllowed, false);
  assert.equal(result.uiRewriteAllowed, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R51 forms errors tables dashboard accessibility governance contract", () => {
  it("missing default input fails closed", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance();

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_scope_blocked");
    assert.equal(result.formLabelStatus, "missing");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("form_label_expectations_required"));
    assert.ok(result.warningCodes.includes("error_summary_required"));
    assertNoExecution(result);
  });

  it("complete forms tables and dashboard governance can become planned", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance(completeInput);

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_governance_planned");
    assert.equal(result.formLabelStatus, "planned");
    assert.equal(result.tableStructureStatus, "planned");
    assert.equal(result.dashboardKPIStatus, "planned");
    assert.equal(result.statusBadgeStatus, "planned");
    assertNoExecution(result);
  });

  it("missing form label helper validation and error planning requires review", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      formLabelExpectationsPlanned: false,
      requiredFieldIndicatorExpectationsPlanned: false,
      helperTextAccessibilityPlanned: false,
      validationMessageAccessibilityPlanned: false,
      fieldLevelErrorMessagePlanned: false,
      errorSummaryExpectationsPlanned: false,
    });

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_review_required");
    assert.ok(result.warningCodes.includes("form_label_expectations_required"));
    assert.ok(result.warningCodes.includes("required_field_indicator_required"));
    assert.ok(result.warningCodes.includes("helper_text_accessibility_required"));
    assert.ok(result.warningCodes.includes("validation_message_accessibility_required"));
    assert.ok(result.warningCodes.includes("field_error_message_required"));
    assert.ok(result.warningCodes.includes("error_summary_required"));
    assertNoExecution(result);
  });

  it("missing table dashboard status and testing planning requires review", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      accessibleTableStructurePlanned: false,
      tableHeaderCaptionExpectationsPlanned: false,
      sortableFilterableTableAccessibilityPlanned: false,
      dashboardKPIAccessibilityPlanned: false,
      dashboardCardAccessibilityPlanned: false,
      statusBadgeAccessibilityPlanned: false,
      nonColorOnlyStatusCommunicationPlanned: false,
      accessibilityDashboardTestingReviewPlanned: false,
    });

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_review_required");
    assert.ok(result.warningCodes.includes("table_structure_required"));
    assert.ok(result.warningCodes.includes("table_header_caption_required"));
    assert.ok(result.warningCodes.includes("sortable_filterable_table_accessibility_required"));
    assert.ok(result.warningCodes.includes("dashboard_kpi_accessibility_required"));
    assert.ok(result.warningCodes.includes("dashboard_card_accessibility_required"));
    assert.ok(result.warningCodes.includes("status_badge_accessibility_required"));
    assert.ok(result.warningCodes.includes("non_color_status_communication_required"));
    assert.ok(result.warningCodes.includes("dashboard_testing_review_required"));
    assertNoExecution(result);
  });

  it("unsafe forms tables dashboard status and error approvals are prohibited", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      inaccessibleFormApproved: true,
      inaccessibleValidationErrorApproved: true,
      inaccessibleTableApproved: true,
      inaccessibleDashboardKPIApproved: true,
      colorOnlyBadgeStatusApproved: true,
      inaccessibleSortableFilterableWorkflowApproved: true,
      inaccessibleErrorSummaryApproved: true,
    });

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_scope_blocked");
    assert.ok(result.warningCodes.includes("inaccessible_form_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_validation_error_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_table_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_dashboard_kpi_rejected"));
    assert.ok(result.warningCodes.includes("color_only_badge_status_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_sort_filter_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_error_summary_rejected"));
    assertNoExecution(result);
  });

  it("runtime accessibility mutation and UI rewrite attempts are prohibited", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      runtimeAccessibilityMutationAttempted: true,
      uiRewriteRequested: true,
    });

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_scope_blocked");
    assert.ok(result.warningCodes.includes("runtime_accessibility_mutation_rejected"));
    assert.ok(result.warningCodes.includes("ui_rewrite_not_allowed"));
    assertNoExecution(result);
  });

  it("advisory simulation and governance-only flags are forced safe", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      advisoryOnly: false,
      simulationOnly: false,
      accessibilityGovernanceOnly: false,
    });

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_scope_blocked");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.accessibilityGovernanceOnly, true);
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("accessibility_governance_only_required"));
    assertNoExecution(result);
  });

  it("execution and persistence flags are rejected and never become true", () => {
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
      persistenceAllowedNow: true,
    });

    assert.equal(result.formsDashboardGovernanceStatus, "forms_dashboard_scope_blocked");
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assertNoExecution(result);
  });

  it("bounded notes recommendations remediation and review actions are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR51FormsErrorsTablesDashboardAccessibilityGovernance({
      ...completeInput,
      accessibilityReviewNotes: manyValues,
      operatorRecommendations: manyValues,
      accessibilityRemediationRecommendations: manyValues,
      accessibilityReviewActions: manyValues,
    });

    assert.equal(result.accessibilityReviewNotes.length, 40);
    assert.equal(result.operatorRecommendations.length, 40);
    assert.equal(result.accessibilityRemediationRecommendations.length, 40);
    assert.equal(result.accessibilityReviewActions.length, 40);
    assert.ok(result.accessibilityReviewNotes.every((value) => value.length <= 183));
    assert.ok(result.operatorRecommendations.every((value) => value.length <= 183));
    assert.ok(result.accessibilityRemediationRecommendations.every((value) => value.length <= 183));
    assert.ok(result.accessibilityReviewActions.every((value) => value.length <= 183));
    assertNoExecution(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR51FormsErrorsTablesDashboardAccessibilityGovernance(),
      createR51FormsErrorsTablesDashboardAccessibilityGovernance(completeInput),
      createR51FormsErrorsTablesDashboardAccessibilityGovernance({
        ...completeInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        advisoryOnly: false,
        simulationOnly: false,
        accessibilityGovernanceOnly: false,
        liveTestReady: true,
        persistenceAllowedNow: true,
      }),
    ];

    for (const result of results) {
      assertNoExecution(result);
    }
  });
});
