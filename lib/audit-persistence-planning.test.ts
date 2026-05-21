import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertAuditPersistencePlanningInvariants,
  createAuditPersistencePlanning,
} from "./audit-persistence-planning";

describe("audit persistence planning", () => {
  it("creates a safe future persistence preview without executing persistence", () => {
    const result = createAuditPersistencePlanning({
      configuredForFuturePersistence: true,
      eventType: "operator_confirmation_checked",
      actionId: "action-1",
      actionFingerprint: "fingerprint-1",
      leadId: "lead-1",
      dealId: "deal-1",
      operatorConfirmationState: "operator_confirmed_simulation_only",
      runtimeContractState: "adapter_ok",
      simulationOnly: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      reasonCodes: ["operator_confirmation_valid_for_simulation_only"],
      createdAtMs: 12345,
      metadata: {
        adapterOnly: true,
        attempt: 1,
        boundedNote: "safe bounded planning note",
      },
    });

    assert.equal(result.readinessState, "ready_for_future_persistence");
    assert.equal(result.persistencePlanned, true);
    assert.equal(result.persistenceExecuted, false);
    assert.equal(result.dbWriteAttempted, false);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.sent, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.canSendNow, false);
    assert.equal(result.safePayloadPreview?.eventType, "operator_confirmation_checked");
    assert.equal(result.safePayloadPreview?.providerCalled, false);
    assert.deepEqual(result.forbiddenFieldsDetected, []);
  });

  it("fails closed when secret-like fields are present", () => {
    const result = createAuditPersistencePlanning({
      configuredForFuturePersistence: true,
      eventType: "live_test_precheck",
      actionFingerprint: "fingerprint-1",
      simulationOnly: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      metadata: {
        twilioAuthToken: "should-never-store",
      },
    });

    assert.equal(result.readinessState, "blocked_secret_detected");
    assert.equal(result.persistencePlanned, false);
    assert.equal(result.safePayloadPreview, null);
    assert.ok(result.reasonCodes.includes("secret_like_field_detected"));
    assert.deepEqual(result.forbiddenFieldsDetected, ["twilioAuthToken"]);
  });

  it("fails closed when payloads are unbounded", () => {
    const result = createAuditPersistencePlanning({
      configuredForFuturePersistence: true,
      eventType: "live_test_precheck",
      actionFingerprint: "fingerprint-1",
      simulationOnly: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      metadata: {
        boundedNote: "x".repeat(200),
      },
    });

    assert.equal(result.readinessState, "blocked_unbounded_payload");
    assert.equal(result.persistencePlanned, false);
    assert.equal(result.safePayloadPreview, null);
    assert.ok(result.reasonCodes.includes("unbounded_string_detected"));
    assert.deepEqual(result.forbiddenFieldsDetected, ["boundedNote"]);
  });

  it("fails closed when runtime or provider execution flags are true", () => {
    const result = createAuditPersistencePlanning({
      configuredForFuturePersistence: true,
      eventType: "live_test_precheck",
      actionFingerprint: "fingerprint-1",
      simulationOnly: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
    });

    assert.equal(result.persistencePlanned, false);
    assert.equal(result.safePayloadPreview, null);
    assert.ok(result.reasonCodes.includes("runtime_sent_blocked"));
    assert.ok(result.reasonCodes.includes("provider_called_blocked"));
    assert.ok(result.reasonCodes.includes("can_send_now_blocked"));
  });

  it("asserts planning invariants remain non-persisting and non-executing", () => {
    const result = createAuditPersistencePlanning({
      configuredForFuturePersistence: false,
      eventType: "live_test_precheck",
      actionFingerprint: "fingerprint-1",
      simulationOnly: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
    });
    const invariantCheck = assertAuditPersistencePlanningInvariants(result);

    assert.equal(invariantCheck.passed, true);
    assert.deepEqual(invariantCheck.reasonCodes, []);
    assert.equal(result.persistenceExecuted, false);
    assert.equal(result.dbWriteAttempted, false);
    assert.equal(result.simulationOnly, true);
  });
});
