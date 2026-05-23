import { createX1HumanOperationalCommandCenterSafetyFinalLockdownReview } from "./x1-human-operational-command-center-safety-final-lockdown-review";

const reviewedInput = { executionReviewed: true, automationReviewed: true, routingReviewed: true, outreachReviewed: true, contactReviewed: true, providerReviewed: true, runtimeReviewed: true, skipTracingReviewed: true, leadCreationReviewed: true, persistenceReviewed: true, auditWritingReviewed: true, externalApiReviewed: true, fetchNetworkReviewed: true, processEnvReviewed: true, accessibilityReviewed: true, governanceWarningsReviewed: true } as const;

describe("X1F command center safety final lockdown", () => {
  it("clears after all final safety areas are reviewed", () => {
    const result = createX1HumanOperationalCommandCenterSafetyFinalLockdownReview(reviewedInput);
    expect(result.status).toBe("x1_final_lockdown_clear");
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("blocks unsafe requests", () => {
    const result = createX1HumanOperationalCommandCenterSafetyFinalLockdownReview({ ...reviewedInput, executionRequested: true, runtimeRequested: true, auditWritingRequested: true });
    expect(result.status).toBe("x1_final_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["command center cannot execute", "near-close cannot activate runtime jobs", "audit writing remains blocked"]));
  });
});
