import { createY6AuditSchemaApprovalReadinessReview } from "./y6-audit-schema-approval-readiness-review";

describe("Y6E audit schema approval readiness review", () => {
  it("requires approvals without granting execution or implementation", () => {
    const result = createY6AuditSchemaApprovalReadinessReview();
    expect(result.planningOnly).toBe(true);
    expect(result.approvalsRequired).toContain("governance approval");
    expect(result.approvalsRequired).toContain("legal/compliance review placeholder");
    expect(result.approvalGrantsExecution).toBe(false);
    expect(result.schemaImplementationAuthorized).toBe(false);
  });

  it("blocks approval-as-execution, schema implementation, migrations, storage, audit writing, provider, and runtime", () => {
    const result = createY6AuditSchemaApprovalReadinessReview({ approvalAsExecutionRequested: true, schemaImplementationRequested: true, migrationRequested: true, storageRequested: true, auditWritingRequested: true, providerRequested: true, runtimeRequested: true });
    expect(result.status).toBe("audit_schema_approval_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/approval-as-execution remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/schema implementation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime activation remains blocked/);
  });
});
