import { phase14SocialAcquisitionFinalLockdownRules } from "./phase-14-social-acquisition-final-lockdown";
import {
  assertPhase15DesignCreativeAiAgentScopeSafe,
  getPhase15DesignCreativeAiAgentScope,
  getPhase15DesignCreativeAiAgentScopeSummary,
  phase15DesignCreativeAiAgentScopeFlags,
  phase15DesignCreativeForbiddenDrift,
} from "./phase-15-design-creative-ai-agent-scope";

describe("phase 15A design creative ai agent scope", () => {
  it("pins Phase 15A fields and Phase 14F continuity", () => {
    const result = getPhase15DesignCreativeAiAgentScope();

    expect(result.phase).toBe("Phase 15: Design & Creative AI Agent");
    expect(result.phaseStep).toBe("Phase 15A â€” Design & Creative AI Agent Scope");
    expect(result.previousStep).toBe("Phase 14F â€” Social Acquisition Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase14FinalLockdownReference.rules).toEqual(phase14SocialAcquisitionFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 15B â€” Design & Creative Signal Audit");
  });

  it("keeps all design execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase15DesignCreativeAiAgentScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.contentChangeEnabled).toBe(false);
    expect(result.flags.assetChangeEnabled).toBe(false);
    expect(result.flags.imageGenerationEnabled).toBe(false);
    expect(result.flags.creativePublishingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("includes highest-aROI purpose, human ownership, and forbidden drift", () => {
    const result = getPhase15DesignCreativeAiAgentScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/brand consistency/i);
    expect(text).toMatch(/design approval/i);
    expect(text).toMatch(/claim verification/i);
    expect(text).toMatch(/publishing approval/i);
    expect(phase15DesignCreativeForbiddenDrift).toContain("creative publishing");
    expect(phase15DesignCreativeForbiddenDrift).toContain("invented property facts");
    expect(phase15DesignCreativeForbiddenDrift).toContain("Phase 16 implementation");
  });

  it("summarizes read-only design creative limits", () => {
    const summary = getPhase15DesignCreativeAiAgentScopeSummary();

    expect(summary).toMatch(/Design & Creative AI Agent scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned brand judgment/i);
    expect(summary).toMatch(/No UI changes/i);
    expect(summary).toMatch(/no asset\/logo\/theme edits/i);
    expect(summary).toMatch(/no creative publishing/i);
    expect(summary).toMatch(/Phase 15B â€” Design & Creative Signal Audit/i);
  });

  it("throws on pinned drift, blocked flag drift, missing boundaries, and unsafe wording", () => {
    const result = getPhase15DesignCreativeAiAgentScope();

    expect(() => assertPhase15DesignCreativeAiAgentScopeSafe({ ...result, phaseStep: "Phase 15A â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase15DesignCreativeAiAgentScopeSafe({ ...result, flags: { ...phase15DesignCreativeAiAgentScopeFlags, uiChangeEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase15DesignCreativeAiAgentScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase15DesignCreativeAiAgentScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase15DesignCreativeAiAgentScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase15DesignCreativeAiAgentScopeSafe({ ...result, scopePurpose: ["creative publishing is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
