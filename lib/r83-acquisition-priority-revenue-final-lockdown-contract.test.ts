import {
  createR83AcquisitionPriorityRevenueFinalLockdownContract,
  summarizeR83AcquisitionPriorityRevenueFinalLockdown,
} from "./r83-acquisition-priority-revenue-final-lockdown-contract";

const reviewedInput = {
  r83aReviewed: true,
  r83bReviewed: true,
  r83cReviewed: true,
  r83dReviewed: true,
  r83eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R83F acquisition priority revenue final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR83AcquisitionPriorityRevenueFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.acquisitionPriorityRevenueLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Priority scores never execute.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR83AcquisitionPriorityRevenueFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("acquisition_priority_revenue_lockdown_enforced");
    expect(result.phase).toBe("R83F");
    expect(result.nextPhase).toBe("R84 - Controlled Acquisition Workflow Intelligence");
  });

  it("preserves all non-execution flags", () => {
    const result = createR83AcquisitionPriorityRevenueFinalLockdownContract(reviewedInput);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.pollingAllowed).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.executionAllowed).toBe(false);
  });

  it("pressure-tests every forbidden request as blocked", () => {
    const result = createR83AcquisitionPriorityRevenueFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      outreachRequested: true,
      providerActivationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("acquisition_priority_revenue_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "priority scores never execute",
        "revenue scores never trigger outreach",
        "urgency never activates providers",
        "lead decay never triggers scraping",
        "blocked leads never trigger skip tracing",
        "confidence scores never create leads",
        "external API calls remain blocked",
        "fetch/network behavior remains blocked",
        "runtime remains blocked",
        "polling remains blocked",
        "persistence remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR83AcquisitionPriorityRevenueFinalLockdownContract(reviewedInput);
    expect(summarizeR83AcquisitionPriorityRevenueFinalLockdown(result)).toMatch(/priority scores never execute/i);
    expect(summarizeR83AcquisitionPriorityRevenueFinalLockdown(result)).toMatch(/urgency never activates providers/i);
    expect(summarizeR83AcquisitionPriorityRevenueFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});
