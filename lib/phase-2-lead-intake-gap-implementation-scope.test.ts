import {
  phase2LeadIntakeGapCategories,
  phase2LeadIntakeGapPriorities,
  phase2LeadIntakeGapPriorityLevels,
} from "./phase-2-lead-intake-gap-prioritization";
import {
  assertPhase2LeadIntakeGapImplementationScopeSafe,
  getPhase2LeadIntakeGapImplementationScope,
  getPhase2LeadIntakeGapImplementationScopeSummary,
  phase2LeadIntakeGapImplementationScopeFlags,
  phase2LeadIntakeImplementationLanes,
} from "./phase-2-lead-intake-gap-implementation-scope";

describe("phase 2 lead intake gap implementation scope", () => {
  it("keeps all pinned Phase 2D fields unchanged", () => {
    const result = getPhase2LeadIntakeGapImplementationScope();

    expect(result.phase).toBe("Phase 2: Lead Intake & Simple CRM");
    expect(result.phaseStep).toBe("Phase 2D — Lead Intake Gap Implementation Scope");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.phaseDecision).toBe("implementation_scope_only");
  });

  it("continues from Phase 2C gap prioritization", () => {
    expect(getPhase2LeadIntakeGapImplementationScope().previousStep).toBe("Phase 2C — Lead Intake Gap Prioritization");
  });

  it("keeps all decisions not authorized", () => {
    const result = getPhase2LeadIntakeGapImplementationScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.runtimeDecision).toBe("not_authorized");
  });

  it("hands off only to Phase 2E minimal implementation gate", () => {
    const result = getPhase2LeadIntakeGapImplementationScope();

    expect(result.recommendedNextExactStep).toBe("Phase 2E — Lead Intake Minimal Implementation Gate");
    expect(result.nextStageRecommendation).toBe("Phase 2E — Lead Intake Minimal Implementation Gate");
  });

  it("includes all implementation scope lanes", () => {
    expect(getPhase2LeadIntakeGapImplementationScope().implementationLanes).toEqual([
      "candidate_highest_aroi_fields",
      "candidate_review_clarity_fields",
      "deferred_schema_or_crm_work",
      "blocked_execution_work",
    ]);
  });

  it("defines lane details for future scope only", () => {
    const result = getPhase2LeadIntakeGapImplementationScope();

    expect(result.implementationLaneDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ lane: "candidate_highest_aroi_fields", candidateItems: expect.arrayContaining(["seller contact clarity", "source attribution clarity"]) }),
        expect.objectContaining({ lane: "candidate_review_clarity_fields", candidateItems: expect.arrayContaining(["property location completeness", "human review/approval visibility"]) }),
        expect.objectContaining({ lane: "deferred_schema_or_crm_work", candidateItems: expect.arrayContaining(["simple CRM operator usability", "future validation changes"]) }),
        expect.objectContaining({ lane: "blocked_execution_work", candidateItems: expect.arrayContaining(["outreach", "automation", "providers", "runtime jobs", "go-live"]) }),
      ]),
    );
  });

  it("references Phase 2C priorities without modifying them", () => {
    const references = getPhase2LeadIntakeGapImplementationScope().phase2cPriorityReferences;

    expect(references.prioritizedGapCategories).toEqual(phase2LeadIntakeGapCategories);
    expect(references.priorityLevels).toEqual(phase2LeadIntakeGapPriorityLevels);
    expect(references.gapPriorities).toEqual(phase2LeadIntakeGapPriorities);
  });

  it("defines the highest-aROI implementation scope purpose", () => {
    const purpose = getPhase2LeadIntakeGapImplementationScope().highestAroiImplementationScopePurpose.join(" ");

    expect(purpose).toMatch(/highest acquisition ROI per operator hour/i);
    expect(purpose).toMatch(/faster human review/i);
    expect(purpose).toMatch(/missing-field visibility/i);
    expect(purpose).toMatch(/source clarity/i);
    expect(purpose).toMatch(/duplicate-risk awareness/i);
    expect(purpose).toMatch(/contact safety/i);
    expect(purpose).toMatch(/simple CRM usability/i);
    expect(purpose).toMatch(/minimal future implementation/i);
  });

  it("keeps AI implementation-scope explanation only and blocks unsafe actions", () => {
    const aiBoundary = getPhase2LeadIntakeGapImplementationScope().aiOperatorLeverageBoundary.join(" ");

    expect(aiBoundary).toMatch(/explain implementation scope for human review only/i);
    expect(aiBoundary).toMatch(/do not invent property facts/i);
    expect(aiBoundary).toMatch(/do not enrich leads with unverified facts/i);
    expect(aiBoundary).toMatch(/do not scrape data/i);
    expect(aiBoundary).toMatch(/do not skip trace owners/i);
    expect(aiBoundary).toMatch(/do not create leads/i);
    expect(aiBoundary).toMatch(/do not mutate CRM records/i);
    expect(aiBoundary).toMatch(/do not contact sellers/i);
    expect(aiBoundary).toMatch(/do not make final lead quality decisions/i);
    expect(aiBoundary).toMatch(/do not approve implementation/i);
  });

  it("preserves human ownership boundary", () => {
    expect(getPhase2LeadIntakeGapImplementationScope().humanOwnershipBoundary).toEqual(
      expect.arrayContaining([
        "final implementation approval",
        "source judgment",
        "required/optional field decisions",
        "property fact verification",
        "duplicate merge decisions",
        "seller communication",
        "CRM approval",
      ]),
    );
  });

  it("blocks forbidden drift", () => {
    expect(getPhase2LeadIntakeGapImplementationScope().forbiddenDrift).toEqual(
      expect.arrayContaining([
        "implementation execution",
        "schema changes",
        "form edits",
        "API edits",
        "CRM mutation",
        "provider activation",
        "seller outreach",
        "scraping",
        "skip tracing",
        "autonomous lead creation",
        "Phase 3 implementation",
        "go-live",
      ]),
    );
  });

  it("keeps all blocked flags false", () => {
    const flags = getPhase2LeadIntakeGapImplementationScope().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.implementationScopeOnly).toBe(true);
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
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.paidAdsEnabled).toBe(false);
    expect(flags.autonomousLeadCreationEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.mapAutomationEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.sellerOutreachEnabled).toBe(false);
    expect(flags.buyerOutreachEnabled).toBe(false);
    expect(flags.offerGenerationEnabled).toBe(false);
    expect(flags.contractGenerationEnabled).toBe(false);
    expect(flags.phase3ImplementationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the required safety and next-step wording", () => {
    const summary = getPhase2LeadIntakeGapImplementationScopeSummary();

    expect(summary).toMatch(/Phase 2D/i);
    expect(summary).toMatch(/Lead Intake Gap Implementation Scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/implementation scope only/i);
    expect(summary).toMatch(/human-owned implementation approval/i);
    expect(summary).toMatch(/No schema changes/i);
    expect(summary).toMatch(/no form edits/i);
    expect(summary).toMatch(/no API edits/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no scraping/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/Phase 2E — Lead Intake Minimal Implementation Gate/i);
  });

  it("throws on pinned field drift", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        phase: "Phase 3: Lead Prioritization Engine" as "Phase 2: Lead Intake & Simple CRM",
      }),
    ).toThrow(/phase must remain pinned/i);

    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        phaseStep: "Phase 2E — Lead Intake Minimal Implementation Gate" as "Phase 2D — Lead Intake Gap Implementation Scope",
      }),
    ).toThrow(/step must remain pinned/i);
  });

  it("throws on blocked flag drift", () => {
    const blockedFlags = Object.keys(phase2LeadIntakeGapImplementationScopeFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "implementationScopeOnly", "phase2PlanningOnly", "operatorLeverageOnly"].includes(flag),
    ) as Array<keyof typeof phase2LeadIntakeGapImplementationScopeFlags>;

    for (const blockedFlag of blockedFlags) {
      expect(() =>
        assertPhase2LeadIntakeGapImplementationScopeSafe({
          ...getPhase2LeadIntakeGapImplementationScope(),
          flags: {
            ...phase2LeadIntakeGapImplementationScopeFlags,
            [blockedFlag]: true,
          },
        }),
      ).toThrow(/cannot authorize/i);
    }
  });

  it("throws on missing implementation lane", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        implementationLanes: phase2LeadIntakeImplementationLanes.slice(0, -1),
      }),
    ).toThrow(/implementation scope lanes/i);
  });

  it("throws on missing Phase 2C priority reference", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        phase2cPriorityReferences: {
          ...getPhase2LeadIntakeGapImplementationScope().phase2cPriorityReferences,
          prioritizedGapCategories: phase2LeadIntakeGapCategories.slice(0, -1),
        },
      }),
    ).toThrow(/Phase 2C priority references/i);
  });

  it("throws on missing stop rule", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        stopRule: ["start building immediately"],
      }),
    ).toThrow(/stop rule/i);
  });

  it("throws on missing AI boundary", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        aiOperatorLeverageBoundary: [],
      }),
    ).toThrow(/AI boundary/i);
  });

  it("throws on missing human boundary", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        humanOwnershipBoundary: [],
      }),
    ).toThrow(/human ownership/i);
  });

  it("throws on missing forbidden drift", () => {
    expect(() =>
      assertPhase2LeadIntakeGapImplementationScopeSafe({
        ...getPhase2LeadIntakeGapImplementationScope(),
        forbiddenDrift: [],
      }),
    ).toThrow(/forbidden drift/i);
  });

  it("throws on unsafe wording", () => {
    const unsafePhrases = [
      "implementation execution is authorized",
      "schema changes are authorized",
      "form edits are authorized",
      "API edits are authorized",
      "CRM mutation is authorized",
      "outreach is authorized",
      "provider activation is authorized",
      "scraping is authorized",
      "skip tracing is authorized",
      "autonomous lead creation is authorized",
      "Phase 3 implementation is authorized",
      "go-live is authorized",
    ];

    for (const unsafePhrase of unsafePhrases) {
      expect(() =>
        assertPhase2LeadIntakeGapImplementationScopeSafe({
          ...getPhase2LeadIntakeGapImplementationScope(),
          highestAroiImplementationScopePurpose: [unsafePhrase],
        }),
      ).toThrow(/wording must not imply/i);
    }
  });
});
