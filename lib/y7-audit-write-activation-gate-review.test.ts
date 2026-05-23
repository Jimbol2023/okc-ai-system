import { createY7AuditWriteActivationGateReview } from "./y7-audit-write-activation-gate-review";

describe("Y7C audit write activation gate review", () => {
  it("keeps audit writing and write paths blocked", () => {
    const result = createY7AuditWriteActivationGateReview();
    expect(result.planningOnly).toBe(true);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.writePathCreationAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.persistenceWritten).toBe(false);
  });

  it("blocks unsafe audit write requests", () => {
    const result = createY7AuditWriteActivationGateReview({ auditWriteRequested: true, writePathRequested: true, approvalAsWriteRequested: true, providerWriteRequested: true, runtimeWriteRequested: true });
    expect(result.status).toBe("audit_write_activation_gate_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime-triggered writes remain blocked/);
  });
});
