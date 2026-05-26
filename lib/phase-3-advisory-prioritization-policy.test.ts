import { phase3PrioritySignalFamilies } from "./phase-3-lead-priority-signal-audit";
import {
  assertPhase3AdvisoryPrioritizationPolicySafe,
  getPhase3AdvisoryPrioritizationPolicy,
  getPhase3AdvisoryPrioritizationPolicySummary,
  phase3AdvisoryPrioritizationPolicyFlags,
  phase3AdvisoryPriorityLanes,
} from "./phase-3-advisory-prioritization-policy";

describe("phase 3C advisory prioritization policy", () => {
  it("pins Phase 3C fields and defines all advisory priority lanes", () => {
    const result = getPhase3AdvisoryPrioritizationPolicy();

    expect(result.phase).toBe("Phase 3: Lead Prioritization Engine");
    expect(result.phaseStep).toBe("Phase 3C — Advisory Prioritization Policy");
    expect(result.previousStep).toBe("Phase 3B — Lead Priority Signal Audit");
    expect(result.phaseDecision).toBe("advisory_policy_only");
    expect(result.advisoryPriorityLanes).toEqual([
      "stop_first",
      "data_quality_review",
      "contact_safety_review",
      "work_first",
      "follow_up_priority",
      "seller_reply_review",
      "high_intent_review",
      "nurture_monitor",
      "defer_low_priority",
    ]);
    expect(result.signalReferences).toEqual(phase3PrioritySignalFamilies);
  });

  it("blocks hidden scoring routing queues and execution", () => {
    const result = getPhase3AdvisoryPrioritizationPolicy();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.hiddenScoringDecision).toBe("not_authorized");
    expect(result.scorePersistenceDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.queueAssignmentDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 3D — Prioritization Engine Implementation Scope");
    expect(result.policyRules.join(" ")).toMatch(/human review only/i);
    expect(result.policyRules.join(" ")).toMatch(/No hidden scoring/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not persist scores/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final prioritization judgment/i);
    expect(result.flags.policyOnly).toBe(true);
    expect(result.flags.hiddenScoringEnabled).toBe(false);
  });

  it("summarizes advisory lanes and blocked execution", () => {
    const summary = getPhase3AdvisoryPrioritizationPolicySummary();

    expect(summary).toMatch(/Phase 3C/i);
    expect(summary).toMatch(/stop_first/i);
    expect(summary).toMatch(/seller_reply_review/i);
    expect(summary).toMatch(/No hidden scoring/i);
    expect(summary).toMatch(/score persistence/i);
    expect(summary).toMatch(/Phase 3D — Prioritization Engine Implementation Scope/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase3AdvisoryPrioritizationPolicy();

    expect(() => assertPhase3AdvisoryPrioritizationPolicySafe({ ...result, advisoryPriorityLanes: phase3AdvisoryPriorityLanes.slice(0, -1) })).toThrow(/priority lanes/i);
    expect(() => assertPhase3AdvisoryPrioritizationPolicySafe({ ...result, signalReferences: phase3PrioritySignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase3AdvisoryPrioritizationPolicySafe({ ...result, flags: { ...phase3AdvisoryPrioritizationPolicyFlags, hiddenScoringEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase3AdvisoryPrioritizationPolicySafe({ ...result, policyRules: ["hidden scoring is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
