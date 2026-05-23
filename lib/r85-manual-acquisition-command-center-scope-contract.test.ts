import {
  createR85ManualAcquisitionCommandCenterScopeContract,
  summarizeR85ManualAcquisitionCommandCenterScope,
} from "./r85-manual-acquisition-command-center-scope-contract";

const reviewedInput = {
  manualCommandCenterReviewed: true,
  operatorOversightReviewed: true,
  acquisitionCoordinationReviewed: true,
  humanReviewFirstReviewed: true,
  commandCenterDoesNotExecuteReviewed: true,
  commandCenterDoesNotContactReviewed: true,
  workflowVisibilityReviewed: true,
  acquisitionBottleneckReviewed: true,
  revenueVisibilityReviewed: true,
  escalationVisibilityReviewed: true,
  noProviderReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R85A manual acquisition command center scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR85ManualAcquisitionCommandCenterScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("manual acquisition command-center doctrine");
  });

  it("smoke-tests advisory-only command center scope readiness", () => {
    const result = createR85ManualAcquisitionCommandCenterScopeContract(reviewedInput);
    expect(result.status).toBe("manual_acquisition_command_center_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory command center categories", () => {
    const result = createR85ManualAcquisitionCommandCenterScopeContract(reviewedInput);
    expect(result.advisoryCommandCenterCategories).toEqual(
      expect.arrayContaining(["operator-review-priority", "human-escalation-needed", "workflow-blocked", "revenue-delay-risk", "manual-only-coordination", "governance-review-needed"]),
    );
  });

  it("pressure-tests forbidden command center, provider, sourcing, runtime, and execution paths", () => {
    const result = createR85ManualAcquisitionCommandCenterScopeContract({
      ...reviewedInput,
      executionRequested: true,
      providerRequested: true,
      outreachRequested: true,
      runtimeRequested: true,
      automationRequested: true,
      leadGenerationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      mlsPublicRecordRequested: true,
      fetchNetworkRequested: true,
      processEnvRequested: true,
      prismaWriteRequested: true,
      dbWriteRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("manual_acquisition_command_center_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["command center cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR85ManualAcquisitionCommandCenterScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.commandCenterOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes command center scope", () => {
    const result = createR85ManualAcquisitionCommandCenterScopeContract(reviewedInput);
    expect(summarizeR85ManualAcquisitionCommandCenterScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR85ManualAcquisitionCommandCenterScope(result)).toMatch(/execution remain blocked/i);
  });
});
