import {
  assertPhase17ManualSecurityReviewPolicySafe,
  getPhase17ManualSecurityReviewPolicy,
  getPhase17ManualSecurityReviewPolicySummary,
  phase17ManualSecurityReviewLanes,
  phase17ManualSecurityReviewPolicyFlags,
  phase17SecuritySummaryStates,
} from "./phase-17-manual-security-review-policy";

describe("phase 17C manual security review policy", () => {
  it("pins Phase 17C fields and includes all lanes and summary states", () => {
    const result = getPhase17ManualSecurityReviewPolicy();

    expect(result.phaseStep).toBe("Phase 17C â€” Manual Security Review Advisory Policy");
    expect(result.previousStep).toBe("Phase 17B â€” Security Signal Audit");
    expect(result.securityReviewLanes).toEqual(phase17ManualSecurityReviewLanes);
    expect(result.summaryStates).toEqual(phase17SecuritySummaryStates);
    expect(result.recommendedNextExactStep).toBe("Phase 17D â€” Security Implementation Scope");
  });

  it("blocks scans exploits network credential reads mutations remediation audit writing and go-live", () => {
    const result = getPhase17ManualSecurityReviewPolicy();
    const text = [result.policyRules, result.stopRules].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/scans/i);
    expect(text).toMatch(/exploits/i);
    expect(text).toMatch(/network calls/i);
    expect(text).toMatch(/credential reads/i);
    expect(text).toMatch(/audit writing/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes the manual policy", () => {
    const summary = getPhase17ManualSecurityReviewPolicySummary();

    expect(summary).toMatch(/manual security review lanes/i);
    expect(summary).toMatch(/human-owned security judgment/i);
    expect(summary).toMatch(/vulnerability triage/i);
    expect(summary).toMatch(/pentest authorization/i);
    expect(summary).toMatch(/Phase 17D â€” Security Implementation Scope/i);
  });

  it("throws on lane drift, state drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase17ManualSecurityReviewPolicy();

    expect(() => assertPhase17ManualSecurityReviewPolicySafe({ ...result, securityReviewLanes: [] as never })).toThrow(/lanes/i);
    expect(() => assertPhase17ManualSecurityReviewPolicySafe({ ...result, summaryStates: [] as never })).toThrow(/summary states/i);
    expect(() => assertPhase17ManualSecurityReviewPolicySafe({ ...result, flags: { ...phase17ManualSecurityReviewPolicyFlags, scannerEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase17ManualSecurityReviewPolicySafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase17ManualSecurityReviewPolicySafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase17ManualSecurityReviewPolicySafe({ ...result, policyRules: ["scans are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
