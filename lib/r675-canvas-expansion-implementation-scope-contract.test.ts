import {
  createR675CanvasExpansionImplementationScopeContract,
  summarizeR675CanvasExpansionImplementationScope,
} from "./r675-canvas-expansion-implementation-scope-contract";

const readyInput = {
  r675aReviewed: true,
  r675bReviewed: true,
  allowedChangesReviewed: true,
  forbiddenChangesReviewed: true,
  targetSurfacesReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R67.5C canvas expansion implementation scope", () => {
  it("defaults to operator review required without current UI authorization", () => {
    const result = createR675CanvasExpansionImplementationScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
    expect(result.missingReviewAreas).toContain("R67.5A scope");
  });

  it("authorizes only future UI-only canvas and grid changes", () => {
    const result = createR675CanvasExpansionImplementationScopeContract(readyInput);
    expect(result.status).toBe("canvas_implementation_scope_ready");
    expect(result.allowedFutureChanges).toContain("outer dashboard container width refinement");
    expect(result.allowedFutureChanges).toContain("readable line-length preservation");
    expect(result.targetSurfaces).toContain("app/(dashboard)/dashboard/layout.tsx");
  });

  it("blocks forbidden implementation drift under pressure", () => {
    const result = createR675CanvasExpansionImplementationScopeContract({
      ...readyInput,
      implementationRequestedNow: true,
      redesignRequested: true,
      logicChangeRequested: true,
      routeChangeRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      automationRequested: true,
      executionControlRequested: true,
      auditPersistenceRequested: true,
      auditRecordWritingRequested: true,
    });
    expect(result.status).toBe("canvas_implementation_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "R67.5C is scope-only and cannot implement UI now",
        "execution controls are forbidden",
        "audit persistence is forbidden",
        "audit record writing is forbidden",
      ]),
    );
  });

  it("summarizes UI-only boundaries", () => {
    const result = createR675CanvasExpansionImplementationScopeContract(readyInput);
    expect(summarizeR675CanvasExpansionImplementationScope(result)).toMatch(/UI-only dashboard canvas width/i);
  });
});
