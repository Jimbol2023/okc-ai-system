import { createY9FinalHumanAuthorizationBoundaryReview } from "./y9-final-human-authorization-boundary-review";

describe("Y9C final human authorization boundary review", () => {
  it("keeps human approval advisory and non-executing", () => {
    const result = createY9FinalHumanAuthorizationBoundaryReview();
    expect(result.planningOnly).toBe(true);
    expect(result.authorizationBoundaries).toContain("approval does not execute");
    expect(result.approvalGrantsExecution).toBe(false);
    expect(result.schemaChangesAuthorized).toBe(false);
  });

  it("blocks approval-as-action requests", () => {
    const result = createY9FinalHumanAuthorizationBoundaryReview({ approvalAsExecutionRequested: true, approvalAsSchemaEditRequested: true, approvalAsMigrationRequested: true, approvalAsStorageRequested: true, approvalAsProviderRequested: true, approvalAsRuntimeRequested: true });
    expect(result.status).toBe("final_human_authorization_boundary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/approval-as-execution remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/approval-as-runtime remains blocked/);
  });
});
