import {
  createR70ManualOperatorActionCenterScopeContract,
  summarizeR70ManualOperatorActionCenterScope,
} from "./r70-manual-operator-action-center-scope-contract";

const readyInput = {
  manualOperatorDoctrineReviewed: true,
  humanInControlReviewed: true,
  advisoryOnlyReviewed: true,
  revenuePriorityReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R70A manual operator action center scope", () => {
  it("defaults to operator review required", () => {
    const result = createR70ManualOperatorActionCenterScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.executionAllowedNow).toBe(false);
  });

  it("smoke-tests manual action center scope readiness", () => {
    const result = createR70ManualOperatorActionCenterScopeContract(readyInput);
    expect(result.status).toBe("manual_action_center_scope_ready");
    expect(result.allowedConcepts).toContain("manual next action suggestion");
    expect(result.auditBoundary.wording).toContain("audit layer not active yet");
    expect(result.accessibility.noCrampedControls).toBe(true);
  });

  it("pressure-tests execution provider send runtime polling persistence and audit blockers", () => {
    const result = createR70ManualOperatorActionCenterScopeContract({
      ...readyInput,
      executionRequested: true,
      providerRequested: true,
      sendRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      credentialEnvRequested: true,
      fetchNetworkRequested: true,
      campaignRequested: true,
    });
    expect(result.status).toBe("manual_action_center_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "execution remains blocked",
        "provider activation remains blocked",
        "send/call/text/email remains blocked",
        "fetch/network remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("pressure-tests recommendation and revenue priority as advisory only", () => {
    const result = createR70ManualOperatorActionCenterScopeContract({
      ...readyInput,
      revenueExecutionRequested: true,
      recommendationExecutionRequested: true,
    });
    expect(result.status).toBe("manual_action_center_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue priority never grants execution",
        "manual recommendations never grant execution",
      ]),
    );
  });

  it("summarizes manual-first boundaries", () => {
    const result = createR70ManualOperatorActionCenterScopeContract(readyInput);
    expect(summarizeR70ManualOperatorActionCenterScope(result)).toMatch(/advisory-only/i);
  });
});
