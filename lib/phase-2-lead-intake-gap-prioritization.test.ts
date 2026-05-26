import {
  phase2LeadIntakeFieldAuditGroups,
  phase2LeadIntakeFieldAuditPublicIntakeFields,
  phase2LeadIntakeFieldAuditStoredLeadFieldFamilies,
  phase2LeadIntakeFieldAuditSurfaces,
  phase2LeadIntakeFieldAuditPrismaLeadFields,
} from "./phase-2-lead-intake-field-audit";
import {
  assertPhase2LeadIntakeGapPrioritizationSafe,
  getPhase2LeadIntakeGapPrioritization,
  getPhase2LeadIntakeGapPrioritizationSummary,
  phase2LeadIntakeGapCategories,
  phase2LeadIntakeGapPrioritizationFlags,
  phase2LeadIntakeGapPriorityLevels,
} from "./phase-2-lead-intake-gap-prioritization";

describe("phase 2 lead intake gap prioritization", () => {
  it("keeps all pinned Phase 2C fields unchanged", () => {
    const result = getPhase2LeadIntakeGapPrioritization();

    expect(result.phase).toBe("Phase 2: Lead Intake & Simple CRM");
    expect(result.phaseStep).toBe("Phase 2C — Lead Intake Gap Prioritization");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.phaseDecision).toBe("gap_prioritization_only");
  });

  it("continues from Phase 2B field audit", () => {
    expect(getPhase2LeadIntakeGapPrioritization().previousStep).toBe("Phase 2B — Lead Intake Field Audit");
  });

  it("keeps all decisions not authorized", () => {
    const result = getPhase2LeadIntakeGapPrioritization();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.runtimeDecision).toBe("not_authorized");
  });

  it("hands off only to Phase 2D implementation scope", () => {
    const result = getPhase2LeadIntakeGapPrioritization();

    expect(result.recommendedNextExactStep).toBe("Phase 2D — Lead Intake Gap Implementation Scope");
    expect(result.nextStageRecommendation).toBe("Phase 2D — Lead Intake Gap Implementation Scope");
  });

  it("includes all prioritized gap categories", () => {
    expect(getPhase2LeadIntakeGapPrioritization().prioritizedGapCategories).toEqual([
      "seller_contact_clarity",
      "property_location_completeness",
      "source_attribution_clarity",
      "motivation_timeline_condition_price_context",
      "duplicate_risk_handling",
      "dnc_stop_contact_safety_visibility",
      "human_review_approval_visibility",
      "simple_crm_operator_usability",
    ]);
  });

  it("includes all deterministic priority levels", () => {
    expect(getPhase2LeadIntakeGapPrioritization().priorityLevels).toEqual([
      "highest_aroi_now",
      "important_next",
      "defer_until_implementation_scope",
    ]);
  });

  it("assigns deterministic priorities to the gap categories", () => {
    const result = getPhase2LeadIntakeGapPrioritization();

    expect(result.gapPriorities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: "seller_contact_clarity", priorityLevel: "highest_aroi_now" }),
        expect.objectContaining({ category: "source_attribution_clarity", priorityLevel: "highest_aroi_now" }),
        expect.objectContaining({ category: "duplicate_risk_handling", priorityLevel: "highest_aroi_now" }),
        expect.objectContaining({ category: "dnc_stop_contact_safety_visibility", priorityLevel: "highest_aroi_now" }),
        expect.objectContaining({ category: "property_location_completeness", priorityLevel: "important_next" }),
        expect.objectContaining({ category: "motivation_timeline_condition_price_context", priorityLevel: "important_next" }),
        expect.objectContaining({ category: "human_review_approval_visibility", priorityLevel: "important_next" }),
        expect.objectContaining({ category: "simple_crm_operator_usability", priorityLevel: "defer_until_implementation_scope" }),
      ]),
    );
  });

  it("references Phase 2B field audit surfaces without modifying them", () => {
    const references = getPhase2LeadIntakeGapPrioritization().phase2bFieldAuditReferences;

    expect(references.auditGroups).toEqual(phase2LeadIntakeFieldAuditGroups);
    expect(references.fieldSurfaces).toEqual(phase2LeadIntakeFieldAuditSurfaces);
    expect(references.publicIntakeFields).toEqual(phase2LeadIntakeFieldAuditPublicIntakeFields);
    expect(references.storedLeadFieldFamilies).toEqual(phase2LeadIntakeFieldAuditStoredLeadFieldFamilies);
    expect(references.prismaLeadFields).toEqual(phase2LeadIntakeFieldAuditPrismaLeadFields);
  });

  it("defines the highest-aROI prioritization purpose", () => {
    const purpose = getPhase2LeadIntakeGapPrioritization().highestAroiPrioritizationPurpose.join(" ");

    expect(purpose).toMatch(/highest acquisition ROI per operator hour/i);
    expect(purpose).toMatch(/faster human review/i);
    expect(purpose).toMatch(/missing-field visibility/i);
    expect(purpose).toMatch(/source clarity/i);
    expect(purpose).toMatch(/duplicate-risk awareness/i);
    expect(purpose).toMatch(/contact safety/i);
    expect(purpose).toMatch(/simple CRM usability/i);
  });

  it("keeps AI human-review-only and blocks unsafe actions", () => {
    const aiBoundary = getPhase2LeadIntakeGapPrioritization().aiOperatorLeverageBoundary.join(" ");

    expect(aiBoundary).toMatch(/rank and explain gaps for human review only/i);
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
    expect(getPhase2LeadIntakeGapPrioritization().humanOwnershipBoundary).toEqual(
      expect.arrayContaining([
        "final prioritization",
        "source judgment",
        "required/optional field decisions",
        "property fact verification",
        "duplicate merge decisions",
        "seller communication",
        "future implementation approval",
      ]),
    );
  });

  it("blocks forbidden drift", () => {
    expect(getPhase2LeadIntakeGapPrioritization().forbiddenDrift).toEqual(
      expect.arrayContaining([
        "implementation",
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
    const flags = getPhase2LeadIntakeGapPrioritization().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.gapPrioritizationOnly).toBe(true);
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
    const summary = getPhase2LeadIntakeGapPrioritizationSummary();

    expect(summary).toMatch(/Phase 2C/i);
    expect(summary).toMatch(/Lead Intake Gap Prioritization/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/gap prioritization only/i);
    expect(summary).toMatch(/human-owned prioritization/i);
    expect(summary).toMatch(/No schema changes/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no scraping/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/Phase 2D — Lead Intake Gap Implementation Scope/i);
  });

  it("throws on pinned field drift", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        phase: "Phase 3: Lead Prioritization Engine" as "Phase 2: Lead Intake & Simple CRM",
      }),
    ).toThrow(/phase must remain pinned/i);

    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        phaseStep: "Phase 2D — Lead Intake Gap Implementation Scope" as "Phase 2C — Lead Intake Gap Prioritization",
      }),
    ).toThrow(/step must remain pinned/i);
  });

  it("throws on blocked flag drift", () => {
    const blockedFlags = Object.keys(phase2LeadIntakeGapPrioritizationFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "gapPrioritizationOnly", "phase2PlanningOnly", "operatorLeverageOnly"].includes(flag),
    ) as Array<keyof typeof phase2LeadIntakeGapPrioritizationFlags>;

    for (const blockedFlag of blockedFlags) {
      expect(() =>
        assertPhase2LeadIntakeGapPrioritizationSafe({
          ...getPhase2LeadIntakeGapPrioritization(),
          flags: {
            ...phase2LeadIntakeGapPrioritizationFlags,
            [blockedFlag]: true,
          },
        }),
      ).toThrow(/cannot authorize/i);
    }
  });

  it("throws on missing priority category", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        prioritizedGapCategories: phase2LeadIntakeGapCategories.slice(0, -1),
      }),
    ).toThrow(/prioritized gap categories/i);
  });

  it("throws on missing priority level", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        priorityLevels: phase2LeadIntakeGapPriorityLevels.slice(0, -1),
      }),
    ).toThrow(/priority levels/i);
  });

  it("throws on missing stop rule", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        stopRule: ["continue prioritizing indefinitely"],
      }),
    ).toThrow(/stop rule/i);
  });

  it("throws on missing AI boundary", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        aiOperatorLeverageBoundary: [],
      }),
    ).toThrow(/AI boundary/i);
  });

  it("throws on missing human boundary", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        humanOwnershipBoundary: [],
      }),
    ).toThrow(/human ownership/i);
  });

  it("throws on missing forbidden drift", () => {
    expect(() =>
      assertPhase2LeadIntakeGapPrioritizationSafe({
        ...getPhase2LeadIntakeGapPrioritization(),
        forbiddenDrift: [],
      }),
    ).toThrow(/forbidden drift/i);
  });

  it("throws on unsafe wording", () => {
    const unsafePhrases = [
      "implementation is authorized",
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
        assertPhase2LeadIntakeGapPrioritizationSafe({
          ...getPhase2LeadIntakeGapPrioritization(),
          highestAroiPrioritizationPurpose: [unsafePhrase],
        }),
      ).toThrow(/wording must not imply/i);
    }
  });
});
