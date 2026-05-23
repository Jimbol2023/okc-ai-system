import { createY3MinimumViableAuditMemoryPlan } from "./y3-minimum-viable-audit-memory-plan";

describe("Y3A minimum viable audit memory plan", () => {
  it("defaults to planning-only audit memory with strict lockdown flags", () => {
    const result = createY3MinimumViableAuditMemoryPlan();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceWritten).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.planningOnly).toBe(true);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.persistenceWritten).toBe(false);
  });

  it("requires operator review until all audit memory areas are reviewed", () => {
    const result = createY3MinimumViableAuditMemoryPlan();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("future event labels");
  });

  it("blocks persistence, audit writing, schema, provider, runtime, and send requests", () => {
    const result = createY3MinimumViableAuditMemoryPlan({ dbWriteRequested: true, auditWriteRequested: true, schemaChangeRequested: true, migrationRequested: true, providerRequested: true, runtimeRequested: true, sendRequested: true });
    expect(result.status).toBe("minimum_viable_audit_memory_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/DB writes remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
  });

  it("classifies step improvement review without including scoped violations", () => {
    const result = createY3MinimumViableAuditMemoryPlan();
    expect(result.stepImprovementReview.requiredBeforeImplementation).toContain("minimize stored data");
    expect(result.stepImprovementReview.safeToIncludeNow).toContain("improve governance traceability");
    expect(result.stepImprovementReview.doNotIncludeBecauseScopeViolation).toContain("DB writes");
  });
});
