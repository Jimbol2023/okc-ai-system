import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR50ExportDeletionLegalHoldPlanningInvariants,
  createR50AuditPersistenceExportDeletionLegalHoldPlan,
  type R50AuditPersistenceExportDeletionLegalHoldPlanningInput,
  type R50AuditPersistenceExportDeletionLegalHoldPlanningResult,
} from "./r50-audit-persistence-export-deletion-legal-hold-planning-contract";

const safeInput: R50AuditPersistenceExportDeletionLegalHoldPlanningInput = {
  exportRequested: true,
  deletionRequested: true,
  rollbackRequested: true,
  legalHoldRequested: true,
  permanentLegalHoldRequested: false,
  preservationLockRequested: true,
  exportReviewCompleted: true,
  deletionReviewCompleted: true,
  rollbackReviewCompleted: true,
  legalAdminReviewCompleted: true,
  operatorApprovalCompleted: true,
  permanentLegalHoldGovernanceReviewCompleted: false,
  preservationLockReviewCompleted: true,
  exportScope: ["governance_event_summary", "reason_codes"],
  deletionScope: ["future_audit_record_stub"],
  rollbackScope: ["future_audit_record_stub"],
  advisoryOnly: true,
  simulationOnly: true,
  metadata: {
    recordClass: "governance_audit",
    legalReviewTier: "standard",
    reviewed: true,
  },
  reasonCodes: ["future_export_deletion_plan_only"],
  requiredOperatorActions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertExecutionImpossible(result: R50AuditPersistenceExportDeletionLegalHoldPlanningResult) {
  const invariantCheck = assertR50ExportDeletionLegalHoldPlanningInvariants(result);

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
  assert.deepEqual(invariantCheck.reasonCodes, []);
}

function assertNoForbiddenPayloadSurvives(value: unknown) {
  const serialized = JSON.stringify(value).toLowerCase();

  assert.equal(serialized.includes("sk_live"), false);
  assert.equal(serialized.includes("database_url=postgres"), false);
  assert.equal(serialized.includes("direct_url=postgres"), false);
  assert.equal(serialized.includes("405-555-1212"), false);
  assert.equal(serialized.includes("full seller message"), false);
}

describe("R50 audit persistence export deletion legal hold planning contract", () => {
  it("missing default input fails closed", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan();

    assert.equal(result.planStatus, "export_deletion_blocked");
    assert.equal(result.exportReviewStatus, "not_requested");
    assert.equal(result.legalHoldStatus, "not_requested");
    assert.ok(result.reasonCodes.includes("input_missing"));
    assert.ok(result.reasonCodes.includes("operator_approval_required"));
    assertExecutionImpossible(result);
  });

  it("fully reviewed bounded plan can become future export deletion plan ready", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan(safeInput);

    assert.equal(result.planStatus, "future_export_deletion_plan_ready");
    assert.equal(result.exportReviewStatus, "reviewed");
    assert.equal(result.deletionReviewStatus, "reviewed");
    assert.equal(result.rollbackReviewStatus, "reviewed");
    assert.equal(result.legalHoldStatus, "temporary_hold_reviewed");
    assert.equal(result.preservationLockStatus, "reviewed");
    assert.equal(result.exportScopeStatus, "bounded");
    assertExecutionImpossible(result);
  });

  it("export deletion and rollback without review require review", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      exportReviewCompleted: false,
      deletionReviewCompleted: false,
      rollbackReviewCompleted: false,
    });

    assert.equal(result.planStatus, "legal_review_required");
    assert.equal(result.exportReviewStatus, "review_required");
    assert.equal(result.deletionReviewStatus, "review_required");
    assert.equal(result.rollbackReviewStatus, "review_required");
    assert.ok(result.reasonCodes.includes("export_review_required"));
    assert.ok(result.reasonCodes.includes("deletion_review_required"));
    assert.ok(result.reasonCodes.includes("rollback_review_required"));
    assertExecutionImpossible(result);
  });

  it("permanent legal hold requires governance review", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      permanentLegalHoldRequested: true,
      permanentLegalHoldGovernanceReviewCompleted: false,
    });

    assert.equal(result.planStatus, "legal_review_required");
    assert.equal(result.legalHoldStatus, "permanent_hold_review_required");
    assert.equal(result.legalAdminReviewRequired, true);
    assert.ok(result.reasonCodes.includes("permanent_legal_hold_review_required"));
    assertExecutionImpossible(result);
  });

  it("unbounded export deletion and rollback scopes fail closed", () => {
    const manyValues = Array.from({ length: 30 }, (_, index) => `scope_${index}`);
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      exportScope: [],
      deletionScope: manyValues,
      rollbackScope: ["405-555-1212"],
    });

    assert.equal(result.planStatus, "export_deletion_blocked");
    assert.equal(result.exportScopeStatus, "unbounded_rejected");
    assert.equal(result.deletionScopeStatus, "unbounded_rejected");
    assert.equal(result.rollbackScopeStatus, "unbounded_rejected");
    assert.ok(result.reasonCodes.includes("unbounded_export_scope_rejected"));
    assert.ok(result.reasonCodes.includes("unbounded_deletion_scope_rejected"));
    assert.ok(result.reasonCodes.includes("unbounded_rollback_scope_rejected"));
    assertExecutionImpossible(result);
  });

  it("preservation lock requires review", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      preservationLockReviewCompleted: false,
    });

    assert.equal(result.planStatus, "legal_review_required");
    assert.equal(result.preservationLockStatus, "review_required");
    assert.ok(result.reasonCodes.includes("preservation_lock_review_required"));
    assertExecutionImpossible(result);
  });

  it("missing legal admin review or operator approval blocks completion", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      legalAdminReviewCompleted: false,
      operatorApprovalCompleted: false,
    });

    assert.equal(result.planStatus, "legal_review_required");
    assert.equal(result.legalAdminReviewRequired, true);
    assert.equal(result.operatorApprovalRequired, true);
    assert.ok(result.reasonCodes.includes("legal_admin_review_required"));
    assert.ok(result.reasonCodes.includes("operator_approval_required"));
    assertExecutionImpossible(result);
  });

  it("secret metadata provider payload raw phone and raw message are rejected", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      metadata: {
        apiKey: "sk_live_123",
        databaseUrl: "DATABASE_URL=postgres://secret",
        callback: "405-555-1212",
      },
      providerPayload: { provider: "raw" },
      rawPhone: "405-555-1212",
      rawMessageBody: "full seller message should not persist",
    });

    assert.equal(result.planStatus, "export_deletion_blocked");
    assert.ok(result.reasonCodes.includes("secret_bearing_metadata_rejected"));
    assert.ok(result.reasonCodes.includes("provider_payload_rejected"));
    assert.ok(result.reasonCodes.includes("raw_phone_rejected"));
    assert.ok(result.reasonCodes.includes("raw_message_body_rejected"));
    assert.ok(result.rejectedFieldNames.includes("providerPayload"));
    assert.ok(result.rejectedFieldNames.includes("rawPhone"));
    assert.ok(result.rejectedFieldNames.includes("rawMessageBody"));
    assertNoForbiddenPayloadSurvives(result);
    assertExecutionImpossible(result);
  });

  it("bounded reason codes operator actions and metadata are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      reasonCodes: manyValues,
      requiredOperatorActions: manyValues,
      metadata: Object.fromEntries(manyValues.map((value, index) => [`key_${index}`, value])),
    });

    assert.equal(result.reasonCodes.length, 40);
    assert.equal(result.requiredOperatorActions.length, 40);
    assert.equal(Object.keys(result.sanitizedMetadata).length, 40);
    assert.ok(result.reasonCodes.every((value) => value.length <= 183));
    assert.ok(result.requiredOperatorActions.every((value) => value.length <= 183));
    assertExecutionImpossible(result);
  });

  it("execution enabling flags are rejected and never become true", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
      persistenceAllowedNow: true,
    });

    assert.equal(result.planStatus, "export_deletion_blocked");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.rejectedFieldNames.includes("providerActivationAllowed"));
    assert.ok(result.rejectedFieldNames.includes("canSendNow"));
    assertExecutionImpossible(result);
  });

  it("advisory and simulation flags are forced safe", () => {
    const result = createR50AuditPersistenceExportDeletionLegalHoldPlan({
      ...safeInput,
      advisoryOnly: false,
      simulationOnly: false,
    });

    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.ok(result.reasonCodes.includes("advisory_only_required"));
    assert.ok(result.reasonCodes.includes("simulation_only_required"));
    assertExecutionImpossible(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR50AuditPersistenceExportDeletionLegalHoldPlan(),
      createR50AuditPersistenceExportDeletionLegalHoldPlan(safeInput),
      createR50AuditPersistenceExportDeletionLegalHoldPlan({
        ...safeInput,
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
