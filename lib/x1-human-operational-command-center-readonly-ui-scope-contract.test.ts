import { createX1HumanOperationalCommandCenterReadonlyUiScopeContract } from "./x1-human-operational-command-center-readonly-ui-scope-contract";

const reviewedInput = { authorizedSurfacesReviewed: true, wordingReviewed: true, forbiddenControlsReviewed: true, accessibilityReviewed: true } as const;

describe("X1D command center read-only UI scope", () => {
  it("authorizes only read-only command center surfaces", () => {
    const result = createX1HumanOperationalCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("x1_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/human-operational-command-center-summary.tsx");
  });

  it("blocks interactive and side-effect controls", () => {
    const result = createX1HumanOperationalCommandCenterReadonlyUiScopeContract({ ...reviewedInput, buttonRequested: true, providerControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x1_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons remain forbidden", "provider controls remain forbidden", "fetch/network remains blocked"]));
  });
});
