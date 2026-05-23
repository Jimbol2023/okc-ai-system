import { createX1HumanOperationalCommandCenterScopeContract } from "./x1-human-operational-command-center-scope-contract";

const reviewedInput = { scopeReviewed: true, dailyFocusReviewed: true, manualNextBestActionReviewed: true, noExecutionReviewed: true, noContactReviewed: true, noRoutingReviewed: true, noLeadCreationReviewed: true, noProviderReviewed: true, noRuntimeReviewed: true, noPersistenceReviewed: true, noAuditWritingReviewed: true, accessibilityReviewed: true, deterministicInvariantsReviewed: true, failClosedReviewed: true } as const;

describe("X1A human operational command center scope contract", () => {
  it("requires operator review by default", () => {
    const result = createX1HumanOperationalCommandCenterScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("human operational command center doctrine");
  });

  it("allows only advisory command center scope after review", () => {
    const result = createX1HumanOperationalCommandCenterScopeContract(reviewedInput);
    expect(result.status).toBe("x1_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.categories).toContain("manual-next-best-action-review");
  });

  it("blocks execution, routing, contact, providers, persistence, and audit writing", () => {
    const result = createX1HumanOperationalCommandCenterScopeContract({ ...reviewedInput, executionRequested: true, routingRequested: true, contactRequested: true, providerRequested: true, persistenceRequested: true, auditWritingRequested: true });
    expect(result.status).toBe("x1_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["command center cannot execute", "command center cannot route work", "command center cannot contact sellers or buyers"]));
  });
});
