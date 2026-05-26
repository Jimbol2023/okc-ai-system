import {
  assertPhase10VirtualD4dIntelligenceScopeSafe,
  getPhase10VirtualD4dIntelligenceScope,
  getPhase10VirtualD4dIntelligenceScopeSummary,
  phase10VirtualD4dForbiddenDrift,
  phase10VirtualD4dIntelligenceScopeFlags,
} from "./phase-10-virtual-d4d-intelligence-scope";
import { phase9LeadDiscoveryFinalLockdownRules } from "./phase-9-lead-discovery-final-lockdown";

describe("phase 10A virtual D4D intelligence scope", () => {
  it("pins Phase 10A fields and Phase 9F continuity", () => {
    const result = getPhase10VirtualD4dIntelligenceScope();

    expect(result.phase).toBe("Phase 10: Virtual Driving for Dollars Intelligence Engine");
    expect(result.phaseStep).toBe("Phase 10A — Virtual Driving for Dollars Intelligence Scope");
    expect(result.previousStep).toBe("Phase 9F — Lead Discovery Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase9FinalLockdownReference.rules).toEqual(phase9LeadDiscoveryFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 10B — Virtual D4D Signal Audit");
  });

  it("keeps all execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase10VirtualD4dIntelligenceScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.mapCrawlingEnabled).toBe(false);
    expect(result.flags.streetViewAutomationEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.flags.ownerContactEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
  });

  it("includes highest-aROI purpose boundaries and forbidden drift", () => {
    const result = getPhase10VirtualD4dIntelligenceScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/neighborhood review/i);
    expect(text).toMatch(/property fact verification/i);
    expect(text).toMatch(/distress-signal verification/i);
    expect(text).toMatch(/legal-source verification/i);
    expect(phase10VirtualD4dForbiddenDrift).toContain("map crawling");
    expect(phase10VirtualD4dForbiddenDrift).toContain("owner contact");
    expect(phase10VirtualD4dForbiddenDrift).toContain("Phase 11 implementation");
  });

  it("summarizes no-map no-scraping no-owner-contact limits", () => {
    const summary = getPhase10VirtualD4dIntelligenceScopeSummary();

    expect(summary).toMatch(/Virtual D4D intelligence scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned neighborhood judgment/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no map crawling/i);
    expect(summary).toMatch(/no Street View automation/i);
    expect(summary).toMatch(/no GPS surveillance/i);
    expect(summary).toMatch(/no owner contact/i);
    expect(summary).toMatch(/Phase 10B — Virtual D4D Signal Audit/i);
  });

  it("throws on pinned drift blocked flag drift missing boundaries and unsafe wording", () => {
    const result = getPhase10VirtualD4dIntelligenceScope();

    expect(() => assertPhase10VirtualD4dIntelligenceScopeSafe({ ...result, phaseStep: "Phase 10A — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase10VirtualD4dIntelligenceScopeSafe({ ...result, flags: { ...phase10VirtualD4dIntelligenceScopeFlags, scrapingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase10VirtualD4dIntelligenceScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase10VirtualD4dIntelligenceScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase10VirtualD4dIntelligenceScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase10VirtualD4dIntelligenceScopeSafe({ ...result, scopePurpose: ["owner contact is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
