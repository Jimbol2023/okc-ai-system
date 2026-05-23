import { createY7SecurityPrivacyComplianceGateReview } from "./y7-security-privacy-compliance-gate-review";

describe("Y7D security privacy compliance gate review", () => {
  it("keeps security privacy gate unpassed and storage unauthorized", () => {
    const result = createY7SecurityPrivacyComplianceGateReview();
    expect(result.planningOnly).toBe(true);
    expect(result.securityPrivacyGatePassed).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.sensitiveDataStorageAllowed).toBe(false);
    expect(result.credentialStorageAllowed).toBe(false);
  });

  it("blocks sensitive storage and compliance bypass requests", () => {
    const result = createY7SecurityPrivacyComplianceGateReview({ sensitiveDataStorageRequested: true, credentialStorageRequested: true, rawPayloadStorageRequested: true, unreviewedAccessRequested: true, complianceBypassRequested: true });
    expect(result.status).toBe("security_privacy_compliance_gate_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/credential storage remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/compliance bypass remains blocked/);
  });
});
