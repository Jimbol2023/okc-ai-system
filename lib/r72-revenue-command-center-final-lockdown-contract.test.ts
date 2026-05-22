import {
  createR72RevenueCommandCenterFinalLockdownContract,
  summarizeR72RevenueCommandCenterFinalLockdown,
} from "./r72-revenue-command-center-final-lockdown-contract";

const lockedInput = {
  r72aReviewed: true,
  r72bReviewed: true,
  r72cReviewed: true,
  r72dReviewed: true,
  r72eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R72F revenue command center final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR72RevenueCommandCenterFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.revenueCommandLocked).toBe(true);
  });

  it("smoke-tests final revenue command lockdown enforcement", () => {
    const result = createR72RevenueCommandCenterFinalLockdownContract(lockedInput);
    expect(result.status).toBe("revenue_command_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Revenue priority never grants execution.",
        "Revenue opportunity never grants execution.",
        "Revenue score never grants execution.",
        "Near-close never grants execution.",
        "Buyer-ready status never grants outreach.",
        "Overdue follow-up never grants sending.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R73A - Controlled Provider Activation Readiness Scope Contract");
  });

  it("pressure-tests every revenue command signal as blocked", () => {
    const result = createR72RevenueCommandCenterFinalLockdownContract({
      ...lockedInput,
      revenuePriorityExecutionRequested: true,
      revenueOpportunityExecutionRequested: true,
      revenueScoreExecutionRequested: true,
      nearCloseExecutionRequested: true,
      stuckDealExecutionRequested: true,
      buyerReadyOutreachRequested: true,
      overdueFollowUpSendRequested: true,
      urgencyExecutionRequested: true,
      queueExecutionRequested: true,
      readinessExecutionRequested: true,
      approvalExecutionRequested: true,
      providerReadinessExecutionRequested: true,
      simulationExecutionRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("revenue_command_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue priority never grants execution",
        "revenue score never grants execution",
        "buyer-ready status never grants outreach",
        "overdue follow-up never grants sending",
        "audit logging remains inactive",
        "execution remains blocked",
      ]),
    );
  });

  it("summarizes final lockdown", () => {
    const result = createR72RevenueCommandCenterFinalLockdownContract(lockedInput);
    expect(summarizeR72RevenueCommandCenterFinalLockdown(result)).toMatch(/read-only advisory visibility/i);
  });
});
