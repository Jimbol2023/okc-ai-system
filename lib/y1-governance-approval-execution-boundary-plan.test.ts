import { createY1GovernanceApprovalExecutionBoundaryPlan } from "./y1-governance-approval-execution-boundary-plan";

describe("Y1C governance approval execution boundary plan", () => {
  it("preserves approval and execution blocking", () => {
    const result = createY1GovernanceApprovalExecutionBoundaryPlan();
    expect(result.approvalGrantsExecution).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.executionAllowed).toBe(false);
  });

  it("blocks approval-as-execution drift", () => {
    const result = createY1GovernanceApprovalExecutionBoundaryPlan({ approvalGrantRequested: true, executionRequested: true });
    expect(result.status).toBe("approval_boundary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/approval does not grant execution/);
  });
});
