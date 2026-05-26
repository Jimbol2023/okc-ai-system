import { phase9LeadDiscoverySignalFamilies } from "./phase-9-lead-discovery-signal-audit";
import {
  assertPhase9ManualDiscoveryPolicySafe,
  getPhase9ManualDiscoveryPolicy,
  getPhase9ManualDiscoveryPolicySummary,
  phase9LeadDiscoverySummaryStates,
  phase9ManualDiscoveryLanes,
  phase9ManualDiscoveryPolicyFlags,
} from "./phase-9-manual-discovery-policy";

describe("phase 9C manual discovery policy", () => {
  it("pins Phase 9C fields and includes discovery lanes and summary states", () => {
    const result = getPhase9ManualDiscoveryPolicy();

    expect(result.phase).toBe("Phase 9: AI-Assisted Lead Discovery");
    expect(result.phaseStep).toBe("Phase 9C — Manual Lead Discovery Advisory Policy");
    expect(result.previousStep).toBe("Phase 9B — Lead Discovery Signal Audit");
    expect(result.discoveryLanes).toEqual(phase9ManualDiscoveryLanes);
    expect(result.summaryStates).toEqual(phase9LeadDiscoverySummaryStates);
    expect(result.signalReferences).toEqual(phase9LeadDiscoverySignalFamilies);
    expect(result.discoveryLanes).toContain("source_provenance_review");
    expect(result.discoveryLanes).toContain("operator_throughput_review");
    expect(result.summaryStates).toContain("public_record_export_review_only");
  });

  it("blocks lead creation imports scraping skip tracing campaigns and spend increases", () => {
    const result = getPhase9ManualDiscoveryPolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.importMutationEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 9D — Lead Discovery Implementation Scope");
  });

  it("summarizes manual discovery boundaries", () => {
    const summary = getPhase9ManualDiscoveryPolicySummary();

    expect(summary).toMatch(/manual lead discovery lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/legal-source verification/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase9ManualDiscoveryPolicy();

    expect(() => assertPhase9ManualDiscoveryPolicySafe({ ...result, discoveryLanes: phase9ManualDiscoveryLanes.slice(0, -1) as never })).toThrow(/discovery lanes/i);
    expect(() => assertPhase9ManualDiscoveryPolicySafe({ ...result, summaryStates: phase9LeadDiscoverySummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase9ManualDiscoveryPolicySafe({ ...result, signalReferences: phase9LeadDiscoverySignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase9ManualDiscoveryPolicySafe({ ...result, flags: { ...phase9ManualDiscoveryPolicyFlags, leadCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase9ManualDiscoveryPolicySafe({ ...result, policyRules: ["campaign activation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
