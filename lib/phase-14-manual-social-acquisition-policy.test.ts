import {
  assertPhase14ManualSocialAcquisitionPolicySafe,
  getPhase14ManualSocialAcquisitionPolicy,
  getPhase14ManualSocialAcquisitionPolicySummary,
  phase14ManualSocialAcquisitionLanes,
  phase14ManualSocialAcquisitionPolicyFlags,
  phase14SocialAcquisitionSummaryStates,
} from "./phase-14-manual-social-acquisition-policy";

describe("phase 14C manual social acquisition policy", () => {
  it("pins Phase 14C fields and includes all lanes and summary states", () => {
    const result = getPhase14ManualSocialAcquisitionPolicy();

    expect(result.phaseStep).toBe("Phase 14C â€” Manual Social Acquisition Advisory Policy");
    expect(result.previousStep).toBe("Phase 14B â€” Social Acquisition Signal Audit");
    expect(result.socialAcquisitionLanes).toEqual(phase14ManualSocialAcquisitionLanes);
    expect(result.summaryStates).toEqual(phase14SocialAcquisitionSummaryStates);
    expect(result.recommendedNextExactStep).toBe("Phase 14D â€” Social Acquisition Implementation Scope");
  });

  it("blocks provider activation, pixels, tracking, campaigns, lead import, CRM mutation, outreach, spend, and go-live", () => {
    const result = getPhase14ManualSocialAcquisitionPolicy();
    const text = [result.policyRules, result.stopRules].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/provider activation/i);
    expect(text).toMatch(/pixel installation/i);
    expect(text).toMatch(/campaign creation/i);
    expect(text).toMatch(/lead import/i);
    expect(text).toMatch(/CRM mutation/i);
    expect(text).toMatch(/spend increases/i);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the manual policy", () => {
    const summary = getPhase14ManualSocialAcquisitionPolicySummary();

    expect(summary).toMatch(/manual social acquisition lanes/i);
    expect(summary).toMatch(/human-owned channel strategy/i);
    expect(summary).toMatch(/ad claim approval/i);
    expect(summary).toMatch(/creative approval/i);
    expect(summary).toMatch(/audience approval/i);
    expect(summary).toMatch(/Phase 14D â€” Social Acquisition Implementation Scope/i);
  });

  it("throws on lane drift, state drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase14ManualSocialAcquisitionPolicy();

    expect(() => assertPhase14ManualSocialAcquisitionPolicySafe({ ...result, socialAcquisitionLanes: [] as never })).toThrow(/lanes/i);
    expect(() => assertPhase14ManualSocialAcquisitionPolicySafe({ ...result, summaryStates: [] as never })).toThrow(/summary states/i);
    expect(() => assertPhase14ManualSocialAcquisitionPolicySafe({ ...result, flags: { ...phase14ManualSocialAcquisitionPolicyFlags, leadImportEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase14ManualSocialAcquisitionPolicySafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase14ManualSocialAcquisitionPolicySafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase14ManualSocialAcquisitionPolicySafe({ ...result, policyRules: ["campaign creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
