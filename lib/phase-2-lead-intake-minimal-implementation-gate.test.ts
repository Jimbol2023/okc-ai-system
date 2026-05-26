import {
  phase2LeadIntakeGapImplementationScopeHighestAroiPurpose,
  phase2LeadIntakeImplementationLaneDetails,
  phase2LeadIntakeImplementationLanes,
} from "./phase-2-lead-intake-gap-implementation-scope";
import {
  assertPhase2LeadIntakeMinimalImplementationGateSafe,
  getPhase2LeadIntakeMinimalImplementationGate,
  getPhase2LeadIntakeMinimalImplementationGateSummary,
  phase2LeadIntakeMinimalImplementationGateFlags,
  phase2LeadIntakeMinimalImplementationGateLanes,
} from "./phase-2-lead-intake-minimal-implementation-gate";

describe("phase 2 lead intake minimal implementation gate", () => {
  it("keeps all pinned Phase 2E fields unchanged", () => {
    const result = getPhase2LeadIntakeMinimalImplementationGate();

    expect(result.phase).toBe("Phase 2: Lead Intake & Simple CRM");
    expect(result.phaseStep).toBe("Phase 2E — Lead Intake Minimal Implementation Gate");
    expect(result.previousStep).toBe("Phase 2D — Lead Intake Gap Implementation Scope");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.phaseDecision).toBe("minimal_implementation_gate_only");
  });

  it("keeps all decisions not authorized and hands off to Phase 2F", () => {
    const result = getPhase2LeadIntakeMinimalImplementationGate();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.runtimeDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 2F — Lead Intake Final Lockdown");
    expect(result.nextStageRecommendation).toBe("Phase 2F — Lead Intake Final Lockdown");
  });

  it("defines all elite gate lanes", () => {
    const result = getPhase2LeadIntakeMinimalImplementationGate();

    expect(result.gateLanes).toEqual(["highest_aroi_minimal_package", "operator_review_quality_package", "implementation_blockers", "phase_2f_lockdown_requirements"]);
    expect(result.gateLaneDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ lane: "highest_aroi_minimal_package", reviewItems: expect.arrayContaining(["seller contact clarity", "source clarity", "duplicate-risk visibility"]) }),
        expect.objectContaining({ lane: "operator_review_quality_package", reviewItems: expect.arrayContaining(["property completeness", "human-review visibility"]) }),
        expect.objectContaining({ lane: "implementation_blockers", reviewItems: expect.arrayContaining(["schema edits", "form edits", "API edits", "CRM mutation"]) }),
        expect.objectContaining({ lane: "phase_2f_lockdown_requirements", reviewItems: expect.arrayContaining(["Phase 2E reviewed", "final lockdown ready"]) }),
      ]),
    );
  });

  it("preserves Phase 2D scope references", () => {
    const references = getPhase2LeadIntakeMinimalImplementationGate().phase2dScopeReferences;

    expect(references.implementationLanes).toEqual(phase2LeadIntakeImplementationLanes);
    expect(references.implementationLaneDetails).toEqual(phase2LeadIntakeImplementationLaneDetails);
    expect(references.highestAroiPurpose).toEqual(phase2LeadIntakeGapImplementationScopeHighestAroiPurpose);
  });

  it("defines highest-aROI gate purpose and boundaries", () => {
    const result = getPhase2LeadIntakeMinimalImplementationGate();
    const purpose = result.highestAroiGatePurpose.join(" ");
    const ai = result.aiOperatorLeverageBoundary.join(" ");
    const human = result.humanOwnershipBoundary.join(" ");
    const drift = result.forbiddenDrift.join(" ");

    expect(purpose).toMatch(/highest acquisition ROI per operator hour/i);
    expect(purpose).toMatch(/seller contact clarity/i);
    expect(purpose).toMatch(/source clarity/i);
    expect(purpose).toMatch(/duplicate-risk visibility/i);
    expect(ai).toMatch(/summarize gate readiness for human review only/i);
    expect(ai).toMatch(/do not invent property facts/i);
    expect(ai).toMatch(/do not mutate CRM records/i);
    expect(ai).toMatch(/do not approve implementation/i);
    expect(human).toMatch(/final implementation approval/i);
    expect(human).toMatch(/Phase 3 transition approval/i);
    expect(drift).toMatch(/schema edits/i);
    expect(drift).toMatch(/Phase 3 implementation/i);
    expect(drift).toMatch(/go-live/i);
  });

  it("keeps all blocked flags false", () => {
    const flags = getPhase2LeadIntakeMinimalImplementationGate().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.minimalImplementationGateOnly).toBe(true);
    expect(flags.phase2PlanningOnly).toBe(true);
    expect(flags.operatorLeverageOnly).toBe(true);
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

  it("summarizes Phase 2E safety and next step", () => {
    const summary = getPhase2LeadIntakeMinimalImplementationGateSummary();

    expect(summary).toMatch(/Phase 2E/i);
    expect(summary).toMatch(/minimal implementation gate only/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned implementation approval/i);
    expect(summary).toMatch(/No schema edits/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/Phase 2F — Lead Intake Final Lockdown/i);
  });

  it("throws on pinned drift missing lanes or unsafe wording", () => {
    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        phaseStep: "Phase 2F — Lead Intake Final Lockdown" as "Phase 2E — Lead Intake Minimal Implementation Gate",
      }),
    ).toThrow(/step must remain pinned/i);

    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        gateLanes: phase2LeadIntakeMinimalImplementationGateLanes.slice(0, -1),
      }),
    ).toThrow(/gate lanes/i);

    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        highestAroiGatePurpose: ["go-live is authorized"],
      }),
    ).toThrow(/wording must not imply/i);
  });

  it("throws on blocked flag drift missing stop rule and missing boundaries", () => {
    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        flags: { ...phase2LeadIntakeMinimalImplementationGateFlags, implementationAuthorized: true },
      }),
    ).toThrow(/cannot authorize/i);

    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        stopRule: ["build now"],
      }),
    ).toThrow(/stop rule/i);

    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        aiOperatorLeverageBoundary: [],
      }),
    ).toThrow(/AI boundary/i);

    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        humanOwnershipBoundary: [],
      }),
    ).toThrow(/human ownership/i);

    expect(() =>
      assertPhase2LeadIntakeMinimalImplementationGateSafe({
        ...getPhase2LeadIntakeMinimalImplementationGate(),
        forbiddenDrift: [],
      }),
    ).toThrow(/forbidden drift/i);
  });
});
