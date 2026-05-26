import {
  assertPhase2LeadIntakeSimpleCrmScopeSafe,
  getPhase2LeadIntakeSimpleCrmScopeReview,
  getPhase2LeadIntakeSimpleCrmScopeSummary,
  phase2LeadIntakeSimpleCrmEvidenceCategories,
  phase2LeadIntakeSimpleCrmScopeFlags,
} from "./phase-2-lead-intake-simple-crm-scope-review";

describe("phase 2 lead intake simple CRM scope review", () => {
  it("creates the pinned Phase 2A scope-review contract", () => {
    const result = getPhase2LeadIntakeSimpleCrmScopeReview();

    expect(result.phase).toBe("Phase 2: Lead Intake & Simple CRM");
    expect(result.phaseStep).toBe("Phase 2A — Lead Intake & Simple CRM Scope Review");
    expect(result.previousPhase).toBe("Phase 1: Business Foundation & Trust Infrastructure");
    expect(result.previousPhaseStatus).toBe("readiness_governance_chain_sufficient_for_transition");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.phaseDecision).toBe("scope_review_only");
    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 2B — Lead Intake Field Audit");
    expect(result.nextStageRecommendation).toBe("Phase 2B — Lead Intake Field Audit");
  });

  it("contains a stop rule preventing a new governance chain", () => {
    const stopRule = getPhase2LeadIntakeSimpleCrmScopeReview().stopRule.join(" ");

    expect(stopRule).toMatch(/one lightweight scope-review contract and stops/i);
    expect(stopRule).toMatch(/no additional readiness loop/i);
    expect(stopRule).toMatch(/nested review chain/i);
    expect(stopRule).toMatch(/Phase 1-style recursion/i);
  });

  it("defines the highest-aROI Phase 2 use case", () => {
    const useCase = getPhase2LeadIntakeSimpleCrmScopeReview().highestAroiUseCase.join(" ");

    expect(useCase).toMatch(/capture, review, organize, and understand seller lead information faster/i);
    expect(useCase).toMatch(/clean seller intake review/i);
    expect(useCase).toMatch(/missing information visibility/i);
    expect(useCase).toMatch(/lead source clarity/i);
    expect(useCase).toMatch(/property address clarity/i);
    expect(useCase).toMatch(/seller contact completeness/i);
    expect(useCase).toMatch(/motivation\/timeline\/condition\/price visibility/i);
    expect(useCase).toMatch(/duplicate-risk awareness/i);
    expect(useCase).toMatch(/highest acquisition ROI per operator hour/i);
  });

  it("includes all required evidence categories", () => {
    const result = getPhase2LeadIntakeSimpleCrmScopeReview();

    expect(result.evidenceCategories).toEqual(phase2LeadIntakeSimpleCrmEvidenceCategories);
    expect(result.evidenceCategories).toEqual([
      "existing_intake_fields",
      "existing_crm_lead_fields",
      "required_seller_contact_fields",
      "required_property_fields",
      "required_motivation_timeline_fields",
      "required_source_tracking_fields",
      "existing_lead_status_fields",
      "missing_data_handling",
      "duplicate_lead_handling",
      "manual_review_workflow",
      "human_approval_boundary",
      "no_provider_no_outreach_boundary",
    ]);
  });

  it("keeps AI operator-leverage-only", () => {
    const aiBoundary = getPhase2LeadIntakeSimpleCrmScopeReview().aiOperatorLeverageBoundary.join(" ");

    expect(aiBoundary).toMatch(/summarize intake completeness/i);
    expect(aiBoundary).toMatch(/identify missing fields/i);
    expect(aiBoundary).toMatch(/flag duplicate-risk indicators/i);
    expect(aiBoundary).toMatch(/suggest manual review priorities/i);
    expect(aiBoundary).toMatch(/do not create leads autonomously/i);
    expect(aiBoundary).toMatch(/do not enrich leads with invented facts/i);
    expect(aiBoundary).toMatch(/do not scrape property data/i);
    expect(aiBoundary).toMatch(/do not skip trace owners/i);
    expect(aiBoundary).toMatch(/do not contact sellers/i);
    expect(aiBoundary).toMatch(/do not mutate CRM records/i);
  });

  it("preserves human ownership boundary", () => {
    const humanBoundary = getPhase2LeadIntakeSimpleCrmScopeReview().humanOwnershipBoundary;

    expect(humanBoundary).toEqual(
      expect.arrayContaining([
        "lead acceptance",
        "lead rejection",
        "lead correction",
        "lead source judgment",
        "seller communication",
        "CRM record approval",
        "property fact verification",
        "duplicate merge decisions",
        "activation decisions",
        "Phase 2 implementation approval",
      ]),
    );
  });

  it("blocks forbidden drift", () => {
    const forbiddenDrift = getPhase2LeadIntakeSimpleCrmScopeReview().forbiddenDrift;

    expect(forbiddenDrift).toEqual(
      expect.arrayContaining([
        "autonomous wholesaling",
        "autonomous lead creation",
        "provider activation",
        "SMS sending",
        "email sending",
        "calling",
        "skip tracing",
        "scraping",
        "map automation",
        "Street View automation",
        "GPS surveillance",
        "public-record crawling",
        "CRM mutation",
        "schema changes",
        "runtime jobs",
        "queues",
        "campaigns",
        "paid ads",
        "buyer outreach",
        "seller outreach",
        "offer generation",
        "contract generation",
        "Phase 3 implementation",
        "go-live",
      ]),
    );
  });

  it("keeps all blocked flags false", () => {
    const flags = getPhase2LeadIntakeSimpleCrmScopeReview().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.scopeReviewOnly).toBe(true);
    expect(flags.phase2PlanningOnly).toBe(true);
    expect(flags.operatorLeverageOnly).toBe(true);
    expect(flags.implementationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.communicationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.autonomousLeadCreationEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.mapAutomationEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.paidAdsEnabled).toBe(false);
    expect(flags.sellerOutreachEnabled).toBe(false);
    expect(flags.buyerOutreachEnabled).toBe(false);
    expect(flags.offerGenerationEnabled).toBe(false);
    expect(flags.contractGenerationEnabled).toBe(false);
    expect(flags.phase3ImplementationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the required safety and next-step wording", () => {
    const summary = getPhase2LeadIntakeSimpleCrmScopeSummary();

    expect(summary).toMatch(/Phase 2: Lead Intake & Simple CRM/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned lead review/i);
    expect(summary).toMatch(/No autonomous lead creation/i);
    expect(summary).toMatch(/no provider activation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no scraping/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no Phase 3 implementation/i);
    expect(summary).toMatch(/Phase 2B — Lead Intake Field Audit/i);
  });

  it("fails invariant checks on pinned field drift", () => {
    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        phase: "Phase 1: Business Foundation & Trust Infrastructure" as "Phase 2: Lead Intake & Simple CRM",
      }),
    ).toThrow(/phase must remain pinned/i);

    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        previousPhase: "Phase 0" as "Phase 1: Business Foundation & Trust Infrastructure",
      }),
    ).toThrow(/previous phase/i);

    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        phaseDecision: "implementation_ready" as "scope_review_only",
      }),
    ).toThrow(/scope-review-only/i);
  });

  it("fails invariant checks on blocked flag drift", () => {
    const blockedFlags = Object.keys(phase2LeadIntakeSimpleCrmScopeFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "scopeReviewOnly", "phase2PlanningOnly", "operatorLeverageOnly"].includes(flag),
    ) as Array<keyof typeof phase2LeadIntakeSimpleCrmScopeFlags>;

    for (const blockedFlag of blockedFlags) {
      expect(() =>
        assertPhase2LeadIntakeSimpleCrmScopeSafe({
          ...getPhase2LeadIntakeSimpleCrmScopeReview(),
          flags: {
            ...phase2LeadIntakeSimpleCrmScopeFlags,
            [blockedFlag]: true,
          },
        }),
      ).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks on missing evidence category stop rule human boundary or drift", () => {
    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        evidenceCategories: phase2LeadIntakeSimpleCrmEvidenceCategories.slice(0, -1),
      }),
    ).toThrow(/evidence categories/i);

    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        stopRule: ["continue creating readiness reviews"],
      }),
    ).toThrow(/stop rule/i);

    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        humanOwnershipBoundary: [],
      }),
    ).toThrow(/human ownership/i);

    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        forbiddenDrift: [],
      }),
    ).toThrow(/forbidden drift/i);
  });

  it("fails invariant checks on unsafe wording", () => {
    expect(() =>
      assertPhase2LeadIntakeSimpleCrmScopeSafe({
        ...getPhase2LeadIntakeSimpleCrmScopeReview(),
        highestAroiUseCase: ["autonomous lead creation is authorized"],
      }),
    ).toThrow(/wording must not imply/i);
  });
});
