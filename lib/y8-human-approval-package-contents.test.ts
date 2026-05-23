import { createY8HumanApprovalPackageContents } from "./y8-human-approval-package-contents";

describe("Y8A human approval package contents", () => {
  it("keeps the approval package planning-only and non-authorizing", () => {
    const result = createY8HumanApprovalPackageContents();
    expect(result.planningOnly).toBe(true);
    expect(result.packageContents).toContain("explicit non-authorization statement");
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.approvalGrantsExecution).toBe(false);
  });

  it("blocks implementation, migration, storage, audit write, and execution requests", () => {
    const result = createY8HumanApprovalPackageContents({ schemaImplementationRequested: true, migrationRequested: true, storageRequested: true, auditWriteRequested: true, executionRequested: true });
    expect(result.status).toBe("human_approval_package_contents_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema implementation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/execution remains blocked/);
  });
});
