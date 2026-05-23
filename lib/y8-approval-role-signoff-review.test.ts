import { createY8ApprovalRoleSignoffReview } from "./y8-approval-role-signoff-review";

describe("Y8B approval role signoff review", () => {
  it("requires multiple approval roles without granting execution", () => {
    const result = createY8ApprovalRoleSignoffReview();
    expect(result.planningOnly).toBe(true);
    expect(result.approvalRoles).toContain("privacy reviewer");
    expect(result.singleApproverAllowed).toBe(false);
    expect(result.approvalGrantsExecution).toBe(false);
  });

  it("blocks approval bypass and implementation requests", () => {
    const result = createY8ApprovalRoleSignoffReview({ singleApproverRequested: true, approvalBypassRequested: true, approvalAsExecutionRequested: true, schemaImplementationRequested: true });
    expect(result.status).toBe("approval_role_signoff_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/approval bypass remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/approval-as-execution remains blocked/);
  });
});
