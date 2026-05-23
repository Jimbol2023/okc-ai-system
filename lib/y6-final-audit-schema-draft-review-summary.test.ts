import { createY6FinalAuditSchemaDraftReviewSummary } from "./y6-final-audit-schema-draft-review-summary";

describe("Y6F final audit schema draft review summary", () => {
  it("summarizes Y6A-E and keeps all authorization false", () => {
    const result = createY6FinalAuditSchemaDraftReviewSummary();
    expect(result.draftFieldReadiness.phase).toBe("Y6A");
    expect(result.minimizationReadiness.phase).toBe("Y6B");
    expect(result.relationshipBoundaryReadiness.phase).toBe("Y6C");
    expect(result.queryabilityReadiness.phase).toBe("Y6D");
    expect(result.approvalReadiness.phase).toBe("Y6E");
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("preserves lockdown flags and planning-only status", () => {
    const result = createY6FinalAuditSchemaDraftReviewSummary();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceWritten).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.planningOnly).toBe(true);
  });

  it("blocks schema, migration, storage, persistence, audit writing, provider, runtime, and execution requests", () => {
    const result = createY6FinalAuditSchemaDraftReviewSummary({ schemaRequested: true, migrationRequested: true, storageRequested: true, persistenceRequested: true, auditWritingRequested: true, providerRequested: true, runtimeRequested: true, executionRequested: true });
    expect(result.status).toBe("final_audit_schema_draft_review_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema changes remain unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/execution activation remains blocked/);
  });

  it("recommends Y7 as planning-only implementation gate review", () => {
    const result = createY6FinalAuditSchemaDraftReviewSummary();
    expect(result.recommendedNextStep).toBe("Y7 - Audit Schema Implementation Gate Review");
    expect(result.recommendedNextStepPlanningOnly).toBe(true);
    expect(result.y7Justified).toBe(true);
  });
});
