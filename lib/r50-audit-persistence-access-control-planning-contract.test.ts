import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR50AuditAccessControlPlanningInvariants,
  createR50AuditPersistenceAccessControlPlan,
  type R50AuditPersistenceAccessControlPlanningInput,
  type R50AuditPersistenceAccessControlPlanningResult,
} from "./r50-audit-persistence-access-control-planning-contract";

const safeInput: R50AuditPersistenceAccessControlPlanningInput = {
  requestedRole: "legal_reviewer",
  requestedViewerAccess: true,
  requestedWriterAccess: true,
  requestedExportAccess: true,
  requestedDeletionAccess: false,
  legalAdminReviewCompleted: true,
  operatorApprovalCompleted: true,
  exportReviewCompleted: true,
  deletionReviewCompleted: true,
  selfApprovedWriteAccess: false,
  unboundedAdminAccessRequested: false,
  advisoryOnly: true,
  simulationOnly: true,
  metadata: {
    recordClass: "governance_audit",
    accessTier: "reviewed",
    reviewed: true,
  },
  reasonCodes: ["future_access_plan_only"],
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

function assertExecutionImpossible(result: R50AuditPersistenceAccessControlPlanningResult) {
  const invariantCheck = assertR50AuditAccessControlPlanningInvariants(result);

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

describe("R50 audit persistence access control planning contract", () => {
  it("missing default input fails closed", () => {
    const result = createR50AuditPersistenceAccessControlPlan();

    assert.equal(result.planStatus, "access_control_blocked");
    assert.equal(result.requestedRole, "missing");
    assert.equal(result.viewerPermissionStatus, "not_requested");
    assert.ok(result.reasonCodes.includes("input_missing"));
    assert.ok(result.reasonCodes.includes("role_missing"));
    assert.ok(result.reasonCodes.includes("operator_approval_required"));
    assertExecutionImpossible(result);
  });

  it("fully reviewed bounded access plan can become future access plan ready", () => {
    const result = createR50AuditPersistenceAccessControlPlan(safeInput);

    assert.equal(result.planStatus, "future_access_plan_ready");
    assert.equal(result.requestedRole, "legal_reviewer");
    assert.equal(result.viewerPermissionStatus, "future_allowed_after_review");
    assert.equal(result.writerPermissionStatus, "future_allowed_after_review");
    assert.equal(result.exportPermissionStatus, "future_allowed_after_review");
    assert.equal(result.deletionPermissionStatus, "not_requested");
    assertExecutionImpossible(result);
  });

  it("unknown roles fail closed", () => {
    const result = createR50AuditPersistenceAccessControlPlan({
      ...safeInput,
      requestedRole: "superuser",
    });

    assert.equal(result.planStatus, "access_control_blocked");
    assert.equal(result.requestedRole, "unknown");
    assert.equal(result.viewerPermissionStatus, "blocked");
    assert.ok(result.reasonCodes.includes("unknown_role_rejected"));
    assertExecutionImpossible(result);
  });

  it("unbounded admin access and self-approved writes fail closed", () => {
    const result = createR50AuditPersistenceAccessControlPlan({
      ...safeInput,
      requestedRole: "admin_reviewer",
      unboundedAdminAccessRequested: true,
      selfApprovedWriteAccess: true,
    });

    assert.equal(result.planStatus, "access_control_blocked");
    assert.ok(result.reasonCodes.includes("unbounded_admin_access_rejected"));
    assert.ok(result.reasonCodes.includes("self_approved_write_rejected"));
    assertExecutionImpossible(result);
  });

  it("export without review and deletion without review require review", () => {
    const result = createR50AuditPersistenceAccessControlPlan({
      ...safeInput,
      requestedRole: "admin_reviewer",
      requestedDeletionAccess: true,
      exportReviewCompleted: false,
      deletionReviewCompleted: false,
    });

    assert.equal(result.planStatus, "access_review_required");
    assert.equal(result.exportPermissionStatus, "requires_review");
    assert.equal(result.deletionPermissionStatus, "requires_review");
    assert.ok(result.reasonCodes.includes("export_review_required"));
    assert.ok(result.reasonCodes.includes("deletion_review_required"));
    assertExecutionImpossible(result);
  });

  it("missing legal admin review or operator approval blocks completion", () => {
    const result = createR50AuditPersistenceAccessControlPlan({
      ...safeInput,
      legalAdminReviewCompleted: false,
      operatorApprovalCompleted: false,
    });

    assert.equal(result.planStatus, "access_review_required");
    assert.equal(result.legalAdminReviewRequired, true);
    assert.equal(result.operatorApprovalRequired, true);
    assert.ok(result.reasonCodes.includes("legal_admin_review_required"));
    assert.ok(result.reasonCodes.includes("operator_approval_required"));
    assertExecutionImpossible(result);
  });

  it("secret metadata provider payload raw phone and raw message are rejected", () => {
    const result = createR50AuditPersistenceAccessControlPlan({
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

    assert.equal(result.planStatus, "access_control_blocked");
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
    const result = createR50AuditPersistenceAccessControlPlan({
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
    const result = createR50AuditPersistenceAccessControlPlan({
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

    assert.equal(result.planStatus, "access_control_blocked");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.rejectedFieldNames.includes("providerActivationAllowed"));
    assert.ok(result.rejectedFieldNames.includes("canSendNow"));
    assertExecutionImpossible(result);
  });

  it("advisory and simulation flags are forced safe", () => {
    const result = createR50AuditPersistenceAccessControlPlan({
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
      createR50AuditPersistenceAccessControlPlan(),
      createR50AuditPersistenceAccessControlPlan(safeInput),
      createR50AuditPersistenceAccessControlPlan({
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
