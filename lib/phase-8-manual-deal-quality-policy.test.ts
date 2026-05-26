import { phase8DealQualitySignalFamilies } from "./phase-8-deal-quality-signal-audit";
import {
  assertPhase8ManualDealQualityPolicySafe,
  getPhase8ManualDealQualityPolicy,
  getPhase8ManualDealQualityPolicySummary,
  phase8DealQualityReviewLanes,
  phase8DealQualitySummaryStates,
  phase8ManualDealQualityPolicyFlags,
} from "./phase-8-manual-deal-quality-policy";

describe("phase 8C manual deal quality policy", () => {
  it("pins Phase 8C fields and includes deal-quality lanes and summary states", () => {
    const result = getPhase8ManualDealQualityPolicy();

    expect(result.phase).toBe("Phase 8: Deal Quality Intelligence");
    expect(result.phaseStep).toBe("Phase 8C — Manual Deal Quality Review Policy");
    expect(result.previousStep).toBe("Phase 8B — Deal Quality Signal Audit");
    expect(result.dealQualityReviewLanes).toEqual(phase8DealQualityReviewLanes);
    expect(result.summaryStates).toEqual(phase8DealQualitySummaryStates);
    expect(result.signalReferences).toEqual(phase8DealQualitySignalFamilies);
    expect(result.dealQualityReviewLanes).toContain("valuation_confidence_review");
    expect(result.dealQualityReviewLanes).toContain("buyer_fit_review");
    expect(result.summaryStates).toContain("spread_assumption_only");
  });

  it("blocks fact invention persistence mutation offers contracts outreach and closing execution", () => {
    const result = getPhase8ManualDealQualityPolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.propertyFactInventionEnabled).toBe(false);
    expect(result.flags.dealScorePersistenceEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.contractGenerationEnabled).toBe(false);
    expect(result.flags.closingExecutionEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 8D — Deal Quality Intelligence Implementation Scope");
  });

  it("summarizes manual deal-quality boundaries", () => {
    const summary = getPhase8ManualDealQualityPolicySummary();

    expect(summary).toMatch(/manual deal-quality lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/property fact verification/i);
    expect(summary).toMatch(/valuation judgment/i);
    expect(summary).toMatch(/No invented property facts/i);
    expect(summary).toMatch(/no offer or contract generation/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase8ManualDealQualityPolicy();

    expect(() => assertPhase8ManualDealQualityPolicySafe({ ...result, dealQualityReviewLanes: phase8DealQualityReviewLanes.slice(0, -1) as never })).toThrow(/deal-quality review lanes/i);
    expect(() => assertPhase8ManualDealQualityPolicySafe({ ...result, summaryStates: phase8DealQualitySummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase8ManualDealQualityPolicySafe({ ...result, signalReferences: phase8DealQualitySignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase8ManualDealQualityPolicySafe({ ...result, flags: { ...phase8ManualDealQualityPolicyFlags, offerGenerationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase8ManualDealQualityPolicySafe({ ...result, policyRules: ["contract generation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
