import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR51ScreenReaderSemanticHtmlAriaInvariants,
  createR51ScreenReaderSemanticHtmlAriaGovernance,
  type R51ScreenReaderSemanticHtmlAriaGovernanceInput,
  type R51ScreenReaderSemanticHtmlAriaGovernanceResult,
} from "./r51-screen-reader-semantic-html-aria-governance-contract";

const completeInput: R51ScreenReaderSemanticHtmlAriaGovernanceInput = {
  semanticHTMLExpectationsPlanned: true,
  screenReaderReadinessPlanned: true,
  headingHierarchyGovernancePlanned: true,
  landmarkRegionGovernancePlanned: true,
  accessibleNameGovernancePlanned: true,
  accessibleDescriptionGovernancePlanned: true,
  formLabelGovernancePlanned: true,
  accessibleErrorMessagePlanned: true,
  ariaUsageGovernancePlanned: true,
  ariaMisusePreventionPlanned: true,
  statusMessageAnnouncementPlanned: true,
  tableSemanticExpectationsPlanned: true,
  badgeStatusTextAlternativePlanned: true,
  semanticAccessibilityTestingPlanned: true,
  inaccessibleSemanticStructureApproved: false,
  missingHeadingHierarchyApproved: false,
  inaccessibleFormLabelingApproved: false,
  inaccessibleTableSemanticsApproved: false,
  ariaMisuseApproved: false,
  statusBadgeColorOnlyApproved: false,
  runtimeAccessibilityMutationAttempted: false,
  uiRewriteRequested: false,
  advisoryOnly: true,
  simulationOnly: true,
  accessibilityGovernanceOnly: true,
  accessibilityReviewNotes: ["R51C planning scope only."],
  operatorRecommendations: [],
  semanticReviewActions: [],
  ariaReviewActions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertNoExecution(result: R51ScreenReaderSemanticHtmlAriaGovernanceResult) {
  const invariantCheck = assertR51ScreenReaderSemanticHtmlAriaInvariants(result);

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

describe("R51 screen-reader semantic HTML ARIA governance contract", () => {
  it("missing default input fails closed", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance();

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_scope_blocked");
    assert.equal(result.semanticHTMLStatus, "missing");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("semantic_html_expectations_required"));
    assert.ok(result.warningCodes.includes("screen_reader_readiness_required"));
    assertNoExecution(result);
  });

  it("complete semantic and ARIA governance can become planned", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance(completeInput);

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_governance_planned");
    assert.equal(result.semanticHTMLStatus, "planned");
    assert.equal(result.screenReaderReadinessStatus, "planned");
    assert.equal(result.ariaUsageStatus, "planned");
    assert.equal(result.semanticTestingStatus, "planned");
    assertNoExecution(result);
  });

  it("missing semantic screen-reader heading and landmark planning requires review", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      semanticHTMLExpectationsPlanned: false,
      screenReaderReadinessPlanned: false,
      headingHierarchyGovernancePlanned: false,
      landmarkRegionGovernancePlanned: false,
    });

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_review_required");
    assert.ok(result.warningCodes.includes("semantic_html_expectations_required"));
    assert.ok(result.warningCodes.includes("screen_reader_readiness_required"));
    assert.ok(result.warningCodes.includes("heading_hierarchy_required"));
    assert.ok(result.warningCodes.includes("landmark_region_required"));
    assertNoExecution(result);
  });

  it("missing names descriptions forms errors statuses tables badges and tests requires review", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      accessibleNameGovernancePlanned: false,
      accessibleDescriptionGovernancePlanned: false,
      formLabelGovernancePlanned: false,
      accessibleErrorMessagePlanned: false,
      statusMessageAnnouncementPlanned: false,
      tableSemanticExpectationsPlanned: false,
      badgeStatusTextAlternativePlanned: false,
      semanticAccessibilityTestingPlanned: false,
    });

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_review_required");
    assert.ok(result.warningCodes.includes("accessible_name_required"));
    assert.ok(result.warningCodes.includes("accessible_description_required"));
    assert.ok(result.warningCodes.includes("form_label_required"));
    assert.ok(result.warningCodes.includes("error_message_required"));
    assert.ok(result.warningCodes.includes("status_announcement_required"));
    assert.ok(result.warningCodes.includes("table_semantics_required"));
    assert.ok(result.warningCodes.includes("badge_status_text_alternative_required"));
    assert.ok(result.warningCodes.includes("semantic_testing_required"));
    assertNoExecution(result);
  });

  it("missing ARIA usage and misuse prevention planning requires review", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      ariaUsageGovernancePlanned: false,
      ariaMisusePreventionPlanned: false,
    });

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_review_required");
    assert.ok(result.warningCodes.includes("aria_usage_governance_required"));
    assert.ok(result.warningCodes.includes("aria_misuse_prevention_required"));
    assertNoExecution(result);
  });

  it("unsafe semantic and ARIA approvals are prohibited", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      inaccessibleSemanticStructureApproved: true,
      missingHeadingHierarchyApproved: true,
      inaccessibleFormLabelingApproved: true,
      inaccessibleTableSemanticsApproved: true,
      ariaMisuseApproved: true,
      statusBadgeColorOnlyApproved: true,
    });

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_scope_blocked");
    assert.ok(result.warningCodes.includes("inaccessible_semantic_structure_rejected"));
    assert.ok(result.warningCodes.includes("missing_heading_hierarchy_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_form_labeling_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_table_semantics_rejected"));
    assert.ok(result.warningCodes.includes("aria_misuse_rejected"));
    assert.ok(result.warningCodes.includes("status_badge_color_only_rejected"));
    assertNoExecution(result);
  });

  it("runtime accessibility mutation and UI rewrite attempts are prohibited", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      runtimeAccessibilityMutationAttempted: true,
      uiRewriteRequested: true,
    });

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_scope_blocked");
    assert.ok(result.warningCodes.includes("runtime_accessibility_mutation_rejected"));
    assert.ok(result.warningCodes.includes("ui_rewrite_not_allowed"));
    assertNoExecution(result);
  });

  it("advisory simulation and governance-only flags are forced safe", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      advisoryOnly: false,
      simulationOnly: false,
      accessibilityGovernanceOnly: false,
    });

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_scope_blocked");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.accessibilityGovernanceOnly, true);
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("accessibility_governance_only_required"));
    assertNoExecution(result);
  });

  it("execution and persistence flags are rejected and never become true", () => {
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
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

    assert.equal(result.semanticAriaGovernanceStatus, "semantic_aria_scope_blocked");
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assertNoExecution(result);
  });

  it("bounded notes recommendations and review actions are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR51ScreenReaderSemanticHtmlAriaGovernance({
      ...completeInput,
      accessibilityReviewNotes: manyValues,
      operatorRecommendations: manyValues,
      semanticReviewActions: manyValues,
      ariaReviewActions: manyValues,
    });

    assert.equal(result.accessibilityReviewNotes.length, 40);
    assert.equal(result.operatorRecommendations.length, 40);
    assert.equal(result.semanticReviewActions.length, 40);
    assert.equal(result.ariaReviewActions.length, 40);
    assert.ok(result.accessibilityReviewNotes.every((value) => value.length <= 183));
    assert.ok(result.operatorRecommendations.every((value) => value.length <= 183));
    assert.ok(result.semanticReviewActions.every((value) => value.length <= 183));
    assert.ok(result.ariaReviewActions.every((value) => value.length <= 183));
    assertNoExecution(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR51ScreenReaderSemanticHtmlAriaGovernance(),
      createR51ScreenReaderSemanticHtmlAriaGovernance(completeInput),
      createR51ScreenReaderSemanticHtmlAriaGovernance({
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
