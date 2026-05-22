import {
  createR71ControlledHumanOutreachWorkflowScopeContract,
  summarizeR71ControlledHumanOutreachWorkflowScope,
} from "./r71-controlled-human-outreach-workflow-scope-contract";

const readyInput = {
  controlledOutreachDoctrineReviewed: true,
  humanInControlReviewed: true,
  advisoryOnlyReviewed: true,
  providerIsolationReviewed: true,
  noContactBoundaryReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R71A controlled human outreach workflow scope", () => {
  it("defaults to operator review required", () => {
    const result = createR71ControlledHumanOutreachWorkflowScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.outreachAuthorizedNow).toBe(false);
  });

  it("smoke-tests controlled outreach scope readiness", () => {
    const result = createR71ControlledHumanOutreachWorkflowScopeContract(readyInput);
    expect(result.status).toBe("controlled_outreach_scope_ready");
    expect(result.allowedConcepts).toContain("message preparation review only");
    expect(result.auditBoundary.wording).toContain("audit layer not active yet");
    expect(result.accessibility.noCrampedControls).toBe(true);
  });

  it("pressure-tests outreach sending contact provider and campaign blockers", () => {
    const result = createR71ControlledHumanOutreachWorkflowScopeContract({
      ...readyInput,
      outreachRequested: true,
      sendRequested: true,
      callRequested: true,
      textRequested: true,
      emailRequested: true,
      providerRequested: true,
      providerClientRequested: true,
      campaignRequested: true,
    });
    expect(result.status).toBe("controlled_outreach_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["outreach activation remains blocked", "sending remains blocked", "calling remains blocked", "provider activation remains blocked"]));
  });

  it("pressure-tests env fetch runtime polling persistence and audit blockers", () => {
    const result = createR71ControlledHumanOutreachWorkflowScopeContract({
      ...readyInput,
      envReadRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("controlled_outreach_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["provider env reads remain blocked", "fetch/network remains blocked", "audit writing remains blocked"]));
  });

  it("summarizes controlled outreach boundaries", () => {
    const result = createR71ControlledHumanOutreachWorkflowScopeContract(readyInput);
    expect(summarizeR71ControlledHumanOutreachWorkflowScope(result)).toMatch(/planning-only/i);
  });
});
