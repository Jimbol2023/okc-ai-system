import { createY9FinalAuthorizationEvidenceReview } from "./y9-final-authorization-evidence-review";

describe("Y9A final authorization evidence review", () => {
  it("keeps authorization evidence review non-authorizing", () => {
    const result = createY9FinalAuthorizationEvidenceReview();
    expect(result.planningOnly).toBe(true);
    expect(result.evidenceAreas).toContain("explicit authorization absence");
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.executionAllowed).toBe(false);
  });

  it("blocks authorization requests", () => {
    const result = createY9FinalAuthorizationEvidenceReview({ schemaAuthorizationRequested: true, migrationAuthorizationRequested: true, storageAuthorizationRequested: true, auditWriteAuthorizationRequested: true, executionAuthorizationRequested: true });
    expect(result.status).toBe("final_authorization_evidence_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema authorization remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/execution authorization remains blocked/);
  });
});
