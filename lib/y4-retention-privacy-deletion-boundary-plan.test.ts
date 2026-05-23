import { createY4RetentionPrivacyDeletionBoundaryPlan } from "./y4-retention-privacy-deletion-boundary-plan";

describe("Y4D retention privacy deletion boundary plan", () => {
  it("plans retention and privacy without implementation", () => {
    const result = createY4RetentionPrivacyDeletionBoundaryPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.immutableGovernanceTracesRequired).toBe(true);
    expect(result.editableNotesSeparateFromAudit).toBe(true);
    expect(result.privacyMinimizationRequired).toBe(true);
    expect(result.implementationCreated).toBe(false);
    expect(result.storageAuthorized).toBe(false);
  });

  it("blocks deletion, export, archive, legal hold, storage, and audit writing implementation", () => {
    const result = createY4RetentionPrivacyDeletionBoundaryPlan({ deletionImplementationRequested: true, exportImplementationRequested: true, archiveImplementationRequested: true, legalHoldImplementationRequested: true, storageRequested: true, auditWriteRequested: true });
    expect(result.status).toBe("retention_privacy_deletion_boundary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/deletion implementation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/legal hold implementation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
  });
});
