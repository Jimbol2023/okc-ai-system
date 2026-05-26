import {
  assertPhase2LeadIntakeFieldAuditSafe,
  getPhase2LeadIntakeFieldAudit,
  getPhase2LeadIntakeFieldAuditSummary,
  phase2LeadIntakeFieldAuditFlags,
  phase2LeadIntakeFieldAuditGroups,
} from "./phase-2-lead-intake-field-audit";

describe("phase 2 lead intake field audit", () => {
  it("keeps all pinned Phase 2B fields unchanged", () => {
    const result = getPhase2LeadIntakeFieldAudit();

    expect(result.phase).toBe("Phase 2: Lead Intake & Simple CRM");
    expect(result.phaseStep).toBe("Phase 2B — Lead Intake Field Audit");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.phaseDecision).toBe("field_audit_only");
  });

  it("continues from Phase 2A scope review", () => {
    expect(getPhase2LeadIntakeFieldAudit().previousStep).toBe("Phase 2A — Lead Intake & Simple CRM Scope Review");
  });

  it("keeps all decisions not authorized", () => {
    const result = getPhase2LeadIntakeFieldAudit();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.runtimeDecision).toBe("not_authorized");
  });

  it("hands off only to Phase 2C gap prioritization", () => {
    const result = getPhase2LeadIntakeFieldAudit();

    expect(result.recommendedNextExactStep).toBe("Phase 2C — Lead Intake Gap Prioritization");
    expect(result.nextStageRecommendation).toBe("Phase 2C — Lead Intake Gap Prioritization");
  });

  it("contains a stop rule preventing schema form API CRM mutation and a new governance chain", () => {
    const stopRule = getPhase2LeadIntakeFieldAudit().stopRule.join(" ");

    expect(stopRule).toMatch(/audits existing fields only/i);
    expect(stopRule).toMatch(/no new governance chain/i);
    expect(stopRule).toMatch(/no nested readiness loop/i);
    expect(stopRule).toMatch(/no Phase 1-style recursion/i);
    expect(stopRule).toMatch(/no schema migration/i);
    expect(stopRule).toMatch(/no form changes/i);
    expect(stopRule).toMatch(/no API changes/i);
    expect(stopRule).toMatch(/no CRM mutation/i);
  });

  it("includes all required field audit groups", () => {
    expect(getPhase2LeadIntakeFieldAudit().fieldAuditGroups).toEqual([
      "seller_identity_contact",
      "property_location",
      "source_tracking",
      "seller_motivation_timeline_condition_price_context",
      "status_and_review_state",
      "duplicate_risk_signals",
      "dnc_stop_contact_safety",
      "notes_and_situation_details",
      "approval_human_review_fields",
      "simple_crm_usability_fields",
    ]);
  });

  it("references existing intake schema CRM and Prisma field families without authorizing changes", () => {
    const result = getPhase2LeadIntakeFieldAudit();

    expect(result.existingPublicIntakeFields).toEqual([
      "firstName",
      "lastName",
      "email",
      "phone",
      "propertyAddress",
      "city",
      "state",
      "zipCode",
      "message",
      "source",
    ]);
    expect(result.existingStoredLeadFieldFamilies).toEqual(
      expect.arrayContaining(["contact", "property", "owner/import", "source", "notes", "follow-ups", "analyzer", "distress flags", "score/priority", "approval/mock outreach metadata"]),
    );
    expect(result.existingPrismaLeadFields).toEqual(expect.arrayContaining(["name", "phone", "propertyAddress", "source", "status", "payload", "automation fields", "DNC fields", "unique propertyAddress + phone"]));
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
  });

  it("defines the highest-aROI audit purpose", () => {
    const purpose = getPhase2LeadIntakeFieldAudit().highestAroiAuditPurpose.join(" ");

    expect(purpose).toMatch(/faster human lead review/i);
    expect(purpose).toMatch(/missing-field visibility/i);
    expect(purpose).toMatch(/source clarity/i);
    expect(purpose).toMatch(/duplicate-risk awareness/i);
    expect(purpose).toMatch(/simple CRM usability/i);
    expect(purpose).toMatch(/Phase 2C gap prioritization/i);
  });

  it("keeps AI operator-leverage-only and blocks unsafe actions", () => {
    const aiBoundary = getPhase2LeadIntakeFieldAudit().aiOperatorLeverageBoundary.join(" ");

    expect(aiBoundary).toMatch(/summarize field coverage/i);
    expect(aiBoundary).toMatch(/summarize field gaps/i);
    expect(aiBoundary).toMatch(/identify missing-field visibility/i);
    expect(aiBoundary).toMatch(/flag duplicate-risk indicators/i);
    expect(aiBoundary).toMatch(/do not invent property facts/i);
    expect(aiBoundary).toMatch(/do not enrich leads with unverified facts/i);
    expect(aiBoundary).toMatch(/do not scrape data/i);
    expect(aiBoundary).toMatch(/do not skip trace owners/i);
    expect(aiBoundary).toMatch(/do not create leads/i);
    expect(aiBoundary).toMatch(/do not mutate CRM records/i);
    expect(aiBoundary).toMatch(/do not contact sellers/i);
    expect(aiBoundary).toMatch(/do not make final lead quality decisions/i);
  });

  it("preserves human ownership boundary", () => {
    expect(getPhase2LeadIntakeFieldAudit().humanOwnershipBoundary).toEqual(
      expect.arrayContaining([
        "required/optional field decisions",
        "source judgment",
        "property fact verification",
        "duplicate merge decisions",
        "seller communication",
        "future implementation approval",
      ]),
    );
  });

  it("blocks forbidden drift", () => {
    expect(getPhase2LeadIntakeFieldAudit().forbiddenDrift).toEqual(
      expect.arrayContaining([
        "schema changes",
        "form changes",
        "API changes",
        "CRM mutation",
        "runtime jobs",
        "queues",
        "campaigns",
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
    const flags = getPhase2LeadIntakeFieldAudit().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.fieldAuditOnly).toBe(true);
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
    const summary = getPhase2LeadIntakeFieldAuditSummary();

    expect(summary).toMatch(/Phase 2B/i);
    expect(summary).toMatch(/Lead Intake Field Audit/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/field audit only/i);
    expect(summary).toMatch(/human-owned lead review/i);
    expect(summary).toMatch(/No schema changes/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no scraping/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/Phase 2C — Lead Intake Gap Prioritization/i);
  });

  it("throws on pinned field drift", () => {
    expect(() =>
      assertPhase2LeadIntakeFieldAuditSafe({
        ...getPhase2LeadIntakeFieldAudit(),
        phase: "Phase 3: Lead Prioritization Engine" as "Phase 2: Lead Intake & Simple CRM",
      }),
    ).toThrow(/phase must remain pinned/i);

    expect(() =>
      assertPhase2LeadIntakeFieldAuditSafe({
        ...getPhase2LeadIntakeFieldAudit(),
        phaseStep: "Phase 2C — Lead Intake Gap Prioritization" as "Phase 2B — Lead Intake Field Audit",
      }),
    ).toThrow(/step must remain pinned/i);
  });

  it("throws on blocked flag drift", () => {
    const blockedFlags = Object.keys(phase2LeadIntakeFieldAuditFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "fieldAuditOnly", "phase2PlanningOnly", "operatorLeverageOnly"].includes(flag),
    ) as Array<keyof typeof phase2LeadIntakeFieldAuditFlags>;

    for (const blockedFlag of blockedFlags) {
      expect(() =>
        assertPhase2LeadIntakeFieldAuditSafe({
          ...getPhase2LeadIntakeFieldAudit(),
          flags: {
            ...phase2LeadIntakeFieldAuditFlags,
            [blockedFlag]: true,
          },
        }),
      ).toThrow(/cannot authorize/i);
    }
  });

  it("throws on missing audit group", () => {
    expect(() =>
      assertPhase2LeadIntakeFieldAuditSafe({
        ...getPhase2LeadIntakeFieldAudit(),
        fieldAuditGroups: phase2LeadIntakeFieldAuditGroups.slice(0, -1),
      }),
    ).toThrow(/field audit groups/i);
  });

  it("throws on missing stop rule", () => {
    expect(() =>
      assertPhase2LeadIntakeFieldAuditSafe({
        ...getPhase2LeadIntakeFieldAudit(),
        stopRule: ["keep reviewing indefinitely"],
      }),
    ).toThrow(/stop rule/i);
  });

  it("throws on missing human boundary", () => {
    expect(() =>
      assertPhase2LeadIntakeFieldAuditSafe({
        ...getPhase2LeadIntakeFieldAudit(),
        humanOwnershipBoundary: [],
      }),
    ).toThrow(/human ownership/i);
  });

  it("throws on missing forbidden drift", () => {
    expect(() =>
      assertPhase2LeadIntakeFieldAuditSafe({
        ...getPhase2LeadIntakeFieldAudit(),
        forbiddenDrift: [],
      }),
    ).toThrow(/forbidden drift/i);
  });

  it("throws on unsafe wording", () => {
    const unsafePhrases = [
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
        assertPhase2LeadIntakeFieldAuditSafe({
          ...getPhase2LeadIntakeFieldAudit(),
          highestAroiAuditPurpose: [unsafePhrase],
        }),
      ).toThrow(/wording must not imply/i);
    }
  });
});
