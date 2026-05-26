import { phase2LeadIntakeFinalLockdownRules } from "./phase-2-lead-intake-final-lockdown";
import {
  assertPhase3LeadPrioritizationEngineScopeSafe,
  getPhase3LeadPrioritizationEngineScope,
  getPhase3LeadPrioritizationEngineScopeSummary,
  phase3LeadPrioritizationEngineScopeFlags,
} from "./phase-3-lead-prioritization-engine-scope";

describe("phase 3A lead prioritization engine scope", () => {
  it("pins Phase 3A scope fields and Phase 2F continuity", () => {
    const result = getPhase3LeadPrioritizationEngineScope();

    expect(result.phase).toBe("Phase 3: Lead Prioritization Engine");
    expect(result.phaseStep).toBe("Phase 3A — Lead Prioritization Engine Scope");
    expect(result.previousStep).toBe("Phase 2F — Lead Intake Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.humanRole).toBe("final_priority_communication_verification_execution_owner");
    expect(result.phase2FinalLockdownReference.rules).toEqual(phase2LeadIntakeFinalLockdownRules);
  });

  it("keeps all execution decisions blocked and hands off only to Phase 3B", () => {
    const result = getPhase3LeadPrioritizationEngineScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.scorePersistenceDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.queueAssignmentDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 3B — Lead Priority Signal Audit");
    expect(result.nextStageRecommendation).toBe("Phase 3B — Lead Priority Signal Audit");
  });

  it("keeps boundaries, forbidden drift, and flags safe", () => {
    const result = getPhase3LeadPrioritizationEngineScope();
    const ai = result.aiOperatorLeverageBoundary.join(" ");
    const human = result.humanOwnershipBoundary.join(" ");
    const drift = result.forbiddenDrift.join(" ");

    expect(ai).toMatch(/do not invent property facts/i);
    expect(ai).toMatch(/do not persist scores/i);
    expect(human).toMatch(/final priority judgment/i);
    expect(human).toMatch(/seller communication/i);
    expect(drift).toMatch(/score persistence/i);
    expect(drift).toMatch(/automated routing/i);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.scopeOnly).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.routingEnabled).toBe(false);
    expect(result.flags.queueAssignmentEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.autonomousLeadCreationEnabled).toBe(false);
    expect(result.flags.phase4ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes advisory scope and blocked execution", () => {
    const summary = getPhase3LeadPrioritizationEngineScopeSummary();

    expect(summary).toMatch(/Phase 3A/i);
    expect(summary).toMatch(/elite read-only advisory lead prioritization scope/i);
    expect(summary).toMatch(/acquisition_roi_per_operator_hour/i);
    expect(summary).toMatch(/No score persistence/i);
    expect(summary).toMatch(/CRM mutation/i);
    expect(summary).toMatch(/routing/i);
    expect(summary).toMatch(/queues/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/Phase 3B — Lead Priority Signal Audit/i);
  });

  it("throws on pinned drift blocked flag drift missing boundaries and unsafe wording", () => {
    const result = getPhase3LeadPrioritizationEngineScope();

    expect(() => assertPhase3LeadPrioritizationEngineScopeSafe({ ...result, phaseStep: "Phase 3B — Lead Priority Signal Audit" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase3LeadPrioritizationEngineScopeSafe({ ...result, flags: { ...phase3LeadPrioritizationEngineScopeFlags, scorePersistenceEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase3LeadPrioritizationEngineScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase3LeadPrioritizationEngineScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase3LeadPrioritizationEngineScopeSafe({ ...result, scopePurpose: ["score persistence is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
