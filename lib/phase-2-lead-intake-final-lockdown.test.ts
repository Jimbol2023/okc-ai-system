import {
  phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose,
  phase2LeadIntakeMinimalImplementationGateLaneDetails,
  phase2LeadIntakeMinimalImplementationGateLanes,
} from "./phase-2-lead-intake-minimal-implementation-gate";
import {
  assertPhase2LeadIntakeFinalLockdownSafe,
  getPhase2LeadIntakeFinalLockdown,
  getPhase2LeadIntakeFinalLockdownSummary,
  phase2LeadIntakeFinalLockdownFlags,
} from "./phase-2-lead-intake-final-lockdown";

describe("phase 2 lead intake final lockdown", () => {
  it("keeps all pinned Phase 2F fields unchanged", () => {
    const result = getPhase2LeadIntakeFinalLockdown();

    expect(result.phase).toBe("Phase 2: Lead Intake & Simple CRM");
    expect(result.phaseStep).toBe("Phase 2F — Lead Intake Final Lockdown");
    expect(result.previousStep).toBe("Phase 2E — Lead Intake Minimal Implementation Gate");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.phaseDecision).toBe("final_lockdown_only");
  });

  it("keeps decisions blocked and hands off only to Phase 3", () => {
    const result = getPhase2LeadIntakeFinalLockdown();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.runtimeDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 3 — Lead Prioritization Engine");
    expect(result.nextStageRecommendation).toBe("Phase 3 — Lead Prioritization Engine");
  });

  it("preserves Phase 2E references and final lockdown rules", () => {
    const result = getPhase2LeadIntakeFinalLockdown();

    expect(result.phase2eGateReferences.gateLanes).toEqual(phase2LeadIntakeMinimalImplementationGateLanes);
    expect(result.phase2eGateReferences.gateLaneDetails).toEqual(phase2LeadIntakeMinimalImplementationGateLaneDetails);
    expect(result.phase2eGateReferences.highestAroiPurpose).toEqual(phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose);
    expect(result.finalLockdownRules.join(" ")).toMatch(/final lockdown only/i);
    expect(result.finalLockdownRules.join(" ")).toMatch(/no implementation execution/i);
    expect(result.finalLockdownRules.join(" ")).toMatch(/Phase 3 — Lead Prioritization Engine/i);
  });

  it("keeps AI and human boundaries safe", () => {
    const result = getPhase2LeadIntakeFinalLockdown();
    const ai = result.aiOperatorLeverageBoundary.join(" ");
    const human = result.humanOwnershipBoundary.join(" ");
    const drift = result.forbiddenDrift.join(" ");

    expect(ai).toMatch(/summarize Phase 2 closeout for human review only/i);
    expect(ai).toMatch(/do not approve Phase 3 implementation/i);
    expect(ai).toMatch(/do not authorize go-live/i);
    expect(human).toMatch(/Phase 2 closeout approval/i);
    expect(human).toMatch(/Phase 3 transition approval/i);
    expect(human).toMatch(/CRM approval/i);
    expect(drift).toMatch(/schema edits/i);
    expect(drift).toMatch(/autonomous lead creation/i);
    expect(drift).toMatch(/go-live/i);
  });

  it("keeps lockdown flags enforced and blocked flags false", () => {
    const flags = getPhase2LeadIntakeFinalLockdown().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.finalLockdownOnly).toBe(true);
    expect(flags.phase2PlanningOnly).toBe(true);
    expect(flags.operatorLeverageOnly).toBe(true);
    expect(flags.phase2LockdownEnforced).toBe(true);
    expect(flags.implementationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.communicationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.schemaChangeEnabled).toBe(false);
    expect(flags.formChangeEnabled).toBe(false);
    expect(flags.apiChangeEnabled).toBe(false);
    expect(flags.storageMutationEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.autonomousLeadCreationEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.sellerOutreachEnabled).toBe(false);
    expect(flags.phase3ImplementationEnabled).toBe(false);
    expect(flags.phase3TransitionApproved).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown and next stage", () => {
    const summary = getPhase2LeadIntakeFinalLockdownSummary();

    expect(summary).toMatch(/Phase 2F/i);
    expect(summary).toMatch(/Phase 2 final lockdown only/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned Phase 2 closeout/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no Phase 3 implementation/i);
    expect(summary).toMatch(/Phase 3 — Lead Prioritization Engine/i);
  });

  it("throws on pinned drift reference drift and unsafe wording", () => {
    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        phaseStep: "Phase 3 — Lead Prioritization Engine" as "Phase 2F — Lead Intake Final Lockdown",
      }),
    ).toThrow(/step must remain pinned/i);

    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        phase2eGateReferences: {
          ...getPhase2LeadIntakeFinalLockdown().phase2eGateReferences,
          gateLanes: phase2LeadIntakeMinimalImplementationGateLanes.slice(0, -1),
        },
      }),
    ).toThrow(/Phase 2E gate references/i);

    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        finalLockdownRules: ["Phase 3 implementation is authorized"],
      }),
    ).toThrow(/lockdown rules|wording/i);
  });

  it("throws on blocked flag drift and missing boundaries", () => {
    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        flags: { ...phase2LeadIntakeFinalLockdownFlags, implementationAuthorized: true },
      }),
    ).toThrow(/cannot authorize/i);

    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        aiOperatorLeverageBoundary: [],
      }),
    ).toThrow(/AI boundary/i);

    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        humanOwnershipBoundary: [],
      }),
    ).toThrow(/human ownership/i);

    expect(() =>
      assertPhase2LeadIntakeFinalLockdownSafe({
        ...getPhase2LeadIntakeFinalLockdown(),
        forbiddenDrift: [],
      }),
    ).toThrow(/forbidden drift/i);
  });
});
