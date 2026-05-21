import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR50RetentionExpiryPlanningInvariants,
  createR50AuditPersistenceRetentionExpiryPlan,
  type R50RetentionExpiryPlanningInput,
  type R50RetentionExpiryPlanningResult,
} from "./r50-audit-persistence-retention-expiry-planning-contract";

const safeInput: R50RetentionExpiryPlanningInput = {
  retentionWindowDays: 365,
  permanentRetentionRequested: false,
  explicitFutureGovernanceReview: false,
  expiryPolicyDefined: true,
  deletionRollbackReviewed: true,
  operatorReviewCompleted: true,
  advisoryOnly: true,
  simulationOnly: true,
  metadata: {
    recordClass: "governance_audit",
    retentionTier: "standard",
    reviewed: true,
  },
  reasonCodes: ["future_retention_plan_only"],
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

function assertExecutionImpossible(result: R50RetentionExpiryPlanningResult) {
  const invariantCheck = assertR50RetentionExpiryPlanningInvariants(result);

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

describe("R50 audit persistence retention expiry planning contract", () => {
  it("missing default input fails closed", () => {
    const result = createR50AuditPersistenceRetentionExpiryPlan();

    assert.equal(result.planStatus, "retention_blocked");
    assert.equal(result.retentionPolicyStatus, "missing");
    assert.equal(result.expiryPolicyStatus, "missing");
    assert.ok(result.reasonCodes.includes("input_missing"));
    assert.ok(result.reasonCodes.includes("retention_policy_missing"));
    assert.ok(result.reasonCodes.includes("operator_review_required"));
    assertExecutionImpossible(result);
  });

  it("bounded retention with full review can produce future retention plan ready", () => {
    const result = createR50AuditPersistenceRetentionExpiryPlan(safeInput);

    assert.equal(result.planStatus, "future_retention_plan_ready");
    assert.equal(result.retentionPolicyStatus, "bounded");
    assert.equal(result.retentionWindowDays, 365);
    assert.equal(result.expiryPolicyStatus, "defined");
    assert.equal(result.deletionRollbackReviewStatus, "reviewed");
    assertExecutionImpossible(result);
  });

  it("unbounded or excessive retention fails closed", () => {
    const results = [
      createR50AuditPersistenceRetentionExpiryPlan({ ...safeInput, retentionWindowDays: 0 }),
      createR50AuditPersistenceRetentionExpiryPlan({ ...safeInput, retentionWindowDays: 2556 }),
    ];

    for (const result of results) {
      assert.equal(result.planStatus, "retention_blocked");
      assert.equal(result.retentionPolicyStatus, "unbounded_rejected");
      assertExecutionImpossible(result);
    }
  });

  it("permanent retention requires explicit future governance review", () => {
    const blocked = createR50AuditPersistenceRetentionExpiryPlan({
      ...safeInput,
      retentionWindowDays: null,
      permanentRetentionRequested: true,
      explicitFutureGovernanceReview: false,
    });
    const reviewed = createR50AuditPersistenceRetentionExpiryPlan({
      ...safeInput,
      retentionWindowDays: null,
      permanentRetentionRequested: true,
      explicitFutureGovernanceReview: true,
    });

    assert.equal(blocked.planStatus, "retention_blocked");
    assert.equal(blocked.retentionPolicyStatus, "unbounded_rejected");
    assert.equal(reviewed.planStatus, "review_required");
    assert.equal(reviewed.retentionPolicyStatus, "permanent_review_required");
    assert.equal(reviewed.requiresOperatorReview, true);
    assertExecutionImpossible(blocked);
    assertExecutionImpossible(reviewed);
  });

  it("missing expiry deletion rollback or operator review blocks completion", () => {
    const result = createR50AuditPersistenceRetentionExpiryPlan({
      ...safeInput,
      expiryPolicyDefined: false,
      deletionRollbackReviewed: false,
      operatorReviewCompleted: false,
    });

    assert.equal(result.planStatus, "review_required");
    assert.equal(result.expiryPolicyStatus, "missing");
    assert.notEqual(result.deletionRollbackReviewStatus, "reviewed");
    assert.equal(result.requiresOperatorReview, true);
    assert.equal(result.requiresExpiryPolicy, true);
    assert.equal(result.requiresDeletionRollbackReview, true);
    assertExecutionImpossible(result);
  });

  it("secret metadata provider payload raw phone and raw message are rejected", () => {
    const result = createR50AuditPersistenceRetentionExpiryPlan({
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

    assert.equal(result.planStatus, "retention_blocked");
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

  it("bounded reason codes and operator actions are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR50AuditPersistenceRetentionExpiryPlan({
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
    const result = createR50AuditPersistenceRetentionExpiryPlan({
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

    assert.equal(result.planStatus, "retention_blocked");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.rejectedFieldNames.includes("providerActivationAllowed"));
    assert.ok(result.rejectedFieldNames.includes("canSendNow"));
    assertExecutionImpossible(result);
  });

  it("advisory and simulation flags are forced safe", () => {
    const result = createR50AuditPersistenceRetentionExpiryPlan({
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
      createR50AuditPersistenceRetentionExpiryPlan(),
      createR50AuditPersistenceRetentionExpiryPlan(safeInput),
      createR50AuditPersistenceRetentionExpiryPlan({
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
