import { classifyX1CommandCenterDangerousWording, createX1HumanOperationalCommandCenterDriftRiskAudit } from "./x1-human-operational-command-center-drift-risk-audit";

const reviewedInput = { executionReviewed: true, automationReviewed: true, routingReviewed: true, outreachReviewed: true, contactReviewed: true, providerReviewed: true, runtimeReviewed: true, skipTracingReviewed: true, leadCreationReviewed: true, externalApiReviewed: true, fetchNetworkReviewed: true, persistenceReviewed: true, auditWritingReviewed: true, dangerousWordingReviewed: true, accessibilityReviewed: true } as const;

describe("X1C command center drift risk audit", () => {
  it("clears only after every drift area is reviewed", () => {
    expect(createX1HumanOperationalCommandCenterDriftRiskAudit().status).toBe("operator_review_required");
    expect(createX1HumanOperationalCommandCenterDriftRiskAudit(reviewedInput).status).toBe("x1_drift_audit_clear");
  });

  it("blocks unsafe transitions", () => {
    const result = createX1HumanOperationalCommandCenterDriftRiskAudit({ ...reviewedInput, outreachRequested: true, providerRequested: true, persistenceRequested: true });
    expect(result.status).toBe("x1_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["overdue follow-up cannot trigger outreach", "buyer-ready cannot activate providers", "persistence remains blocked"]));
  });

  it("detects dangerous wording", () => {
    expect(classifyX1CommandCenterDangerousWording("call now")).toBe("dangerous_wording_detected");
    expect(classifyX1CommandCenterDangerousWording("Manual next-best-action visibility only")).toBe("wording_clear");
  });
});
