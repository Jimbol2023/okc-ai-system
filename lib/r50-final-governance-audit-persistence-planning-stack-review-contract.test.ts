import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR50FinalAuditPersistenceStackReviewInvariants,
  createR50FinalGovernanceAuditPersistencePlanningStackReview,
  type R50FinalGovernanceAuditPersistencePlanningStackReviewInput,
  type R50FinalGovernanceAuditPersistencePlanningStackReviewResult,
} from "./r50-final-governance-audit-persistence-planning-stack-review-contract";

const completeInput: R50FinalGovernanceAuditPersistencePlanningStackReviewInput = {
  boundaryPlanningStatus: "planned",
  recordShapeStatus: "future_safe_shape_ready",
  retentionPlanningStatus: "future_retention_plan_ready",
  accessControlStatus: "future_access_plan_ready",
  exportDeletionLegalHoldStatus: "future_export_deletion_plan_ready",
  operatorReviewCompleted: true,
  legalAdminReviewCompleted: true,
  metadataSanitized: true,
  boundedOutputsConfirmed: true,
  unboundedScopesPresent: false,
  unsafeRetentionPresent: false,
  unsafeExportDeletionPresent: false,
  secretsOrRawPayloadsPresent: false,
  providerPayloadPresent: false,
  rawPhonePresent: false,
  rawMessageBodyPresent: false,
  runtimeCapabilityIntroduced: false,
  activationSemanticsIntroduced: false,
  advisoryOnly: true,
  simulationOnly: true,
  warningCodes: ["r50_stack_review"],
  reviewNotes: ["R50 planning stack reviewed."],
  operatorActionRecommendations: [],
  metadata: {
    stack: "r50",
    reviewed: true,
  },
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertExecutionImpossible(result: R50FinalGovernanceAuditPersistencePlanningStackReviewResult) {
  const invariantCheck = assertR50FinalAuditPersistenceStackReviewInvariants(result);

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
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

function assertNoForbiddenPayloadSurvives(value: unknown) {
  const serialized = JSON.stringify(value).toLowerCase();

  assert.equal(serialized.includes("sk_live"), false);
  assert.equal(serialized.includes("database_url=postgres"), false);
  assert.equal(serialized.includes("direct_url=postgres"), false);
  assert.equal(serialized.includes("405-555-1212"), false);
}

describe("R50 final governance audit persistence planning stack review contract", () => {
  it("missing default input fails closed", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview();

    assert.equal(result.governanceReviewStatus, "review_blocked");
    assert.equal(result.consistencyStatus, "inconsistent");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("boundary_planning_missing"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertExecutionImpossible(result);
  });

  it("complete reviewed stack can close R50 planning", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview(completeInput);

    assert.equal(result.governanceReviewStatus, "r50_persistence_planning_complete");
    assert.equal(result.consistencyStatus, "consistent");
    assert.equal(result.boundaryPlanningStatus, "planned");
    assert.equal(result.recordShapeStatus, "future_safe_shape_ready");
    assert.equal(result.retentionPlanningStatus, "future_retention_plan_ready");
    assert.equal(result.accessControlStatus, "future_access_plan_ready");
    assert.equal(result.exportDeletionLegalHoldStatus, "future_export_deletion_plan_ready");
    assertExecutionImpossible(result);
  });

  it("incomplete child layers produce stack incomplete", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      recordShapeStatus: "shape_ready_for_review",
      retentionPlanningStatus: "review_required",
    });

    assert.equal(result.governanceReviewStatus, "stack_incomplete");
    assert.equal(result.consistencyStatus, "needs_review");
    assert.ok(result.warningCodes.includes("record_shape_not_ready"));
    assert.ok(result.warningCodes.includes("retention_planning_not_ready"));
    assertExecutionImpossible(result);
  });

  it("missing legal admin review and operator review stay review gated", () => {
    const legalResult = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      legalAdminReviewCompleted: false,
    });
    const operatorResult = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      operatorReviewCompleted: false,
    });

    assert.equal(legalResult.governanceReviewStatus, "legal_review_required");
    assert.equal(operatorResult.governanceReviewStatus, "operator_review_required");
    assert.ok(legalResult.warningCodes.includes("legal_admin_review_required"));
    assert.ok(operatorResult.warningCodes.includes("operator_review_required"));
    assertExecutionImpossible(legalResult);
    assertExecutionImpossible(operatorResult);
  });

  it("unbounded unsafe or activation-like signals block review", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      unboundedScopesPresent: true,
      unsafeRetentionPresent: true,
      unsafeExportDeletionPresent: true,
      runtimeCapabilityIntroduced: true,
      activationSemanticsIntroduced: true,
    });

    assert.equal(result.governanceReviewStatus, "review_blocked");
    assert.equal(result.consistencyStatus, "inconsistent");
    assert.ok(result.warningCodes.includes("unbounded_scope_rejected"));
    assert.ok(result.warningCodes.includes("unsafe_retention_rejected"));
    assert.ok(result.warningCodes.includes("runtime_capability_rejected"));
    assert.ok(result.warningCodes.includes("activation_semantics_rejected"));
    assertExecutionImpossible(result);
  });

  it("secret raw and provider payload indicators block review and metadata is sanitized", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      secretsOrRawPayloadsPresent: true,
      providerPayloadPresent: true,
      rawPhonePresent: true,
      rawMessageBodyPresent: true,
      metadata: {
        apiKey: "sk_live_123",
        databaseUrl: "DATABASE_URL=postgres://secret",
        phone: "405-555-1212",
      },
    });

    assert.equal(result.governanceReviewStatus, "review_blocked");
    assert.ok(result.warningCodes.includes("secret_or_raw_payload_rejected"));
    assert.ok(result.warningCodes.includes("provider_payload_rejected"));
    assert.ok(result.warningCodes.includes("raw_phone_rejected"));
    assert.ok(result.warningCodes.includes("raw_message_body_rejected"));
    assertNoForbiddenPayloadSurvives(result);
    assertExecutionImpossible(result);
  });

  it("metadata sanitization and bounded output confirmations are required", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      metadataSanitized: false,
      boundedOutputsConfirmed: false,
    });

    assert.equal(result.governanceReviewStatus, "stack_incomplete");
    assert.equal(result.consistencyStatus, "needs_review");
    assert.ok(result.warningCodes.includes("metadata_sanitization_required"));
    assert.ok(result.warningCodes.includes("bounded_output_required"));
    assertExecutionImpossible(result);
  });

  it("bounded warning codes notes and operator recommendations are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      warningCodes: manyValues,
      reviewNotes: manyValues,
      operatorActionRecommendations: manyValues,
      metadata: Object.fromEntries(manyValues.map((value, index) => [`key_${index}`, value])),
    });

    assert.equal(result.warningCodes.length, 40);
    assert.equal(result.reviewNotes.length, 40);
    assert.equal(result.operatorActionRecommendations.length, 40);
    assert.equal(Object.keys(result.sanitizedMetadata).length, 40);
    assert.ok(result.warningCodes.every((value) => value.length <= 183));
    assert.ok(result.reviewNotes.every((value) => value.length <= 183));
    assert.ok(result.operatorActionRecommendations.every((value) => value.length <= 183));
    assertExecutionImpossible(result);
  });

  it("execution enabling flags are rejected and never become true", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
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

    assert.equal(result.governanceReviewStatus, "review_blocked");
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertExecutionImpossible(result);
  });

  it("advisory and simulation flags are forced safe", () => {
    const result = createR50FinalGovernanceAuditPersistencePlanningStackReview({
      ...completeInput,
      advisoryOnly: false,
      simulationOnly: false,
    });

    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR50FinalGovernanceAuditPersistencePlanningStackReview(),
      createR50FinalGovernanceAuditPersistencePlanningStackReview(completeInput),
      createR50FinalGovernanceAuditPersistencePlanningStackReview({
        ...completeInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        advisoryOnly: false,
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
