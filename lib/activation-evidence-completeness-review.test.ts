import {
  activationEvidenceCompletenessPhaseOrder,
  activationEvidenceCompletenessReviewFlags,
  assertActivationEvidenceCompletenessReviewSafe,
  getActivationEvidenceCompletenessReview,
  summarizeActivationEvidenceCompletenessReview,
} from "./activation-evidence-completeness-review";

describe("activation evidence completeness review", () => {
  it("preserves pinned contract fields and decisions", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.phase).toBe("Activation Evidence Completeness Review");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.reviewStatus).toBe("completeness_review_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Manual Evidence Completeness Review");
    expect(result.nextStageRecommendation).toBe("Controlled Manual Activation Readiness Planning");
  });

  it("requires Activation Evidence Gap Resolution Planning as the previous step", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.previousRequiredStep).toBe("Activation Evidence Gap Resolution Planning");
    expect(result.activationEvidenceCompletenessDoctrine.join(" ")).toMatch(/Activation Evidence Gap Resolution Planning evidence/i);
  });

  it("keeps completeness review read-only advisory-only planning-only and review-only", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.evidenceCompletenessReviewOnly).toBe(true);
  });

  it("defines all 17 phase completeness records in order", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.phaseCompletenessRecords).toHaveLength(17);
    expect(result.phaseCompletenessRecords.map((phase) => phase.phaseName)).toEqual([...activationEvidenceCompletenessPhaseOrder]);
    expect(result.phaseCompletenessRecords.map((phase) => phase.phaseName)).toEqual([
      "Business Foundation & Trust Infrastructure",
      "Lead Intake & Simple CRM",
      "Lead Prioritization Engine",
      "Seller Review & Call Prep",
      "Follow-Up Organization System",
      "Daily Acquisition Command Center",
      "KPI & Revenue Intelligence",
      "Deal Quality Intelligence",
      "AI-Assisted Lead Discovery",
      "Virtual Driving for Dollars Intelligence Engine",
      "SEO & Local Authority Engine",
      "Conversion Optimization Engine",
      "Safety & Compliance Engine",
      "Facebook & TikTok Acquisition Engine",
      "Design & Creative AI Agent",
      "Buyer Fit Intelligence",
      "Pentest & Security Engine",
    ]);
  });

  it("requires every phase record to include completeness criteria and boundaries", () => {
    const result = getActivationEvidenceCompletenessReview();

    for (const phase of result.phaseCompletenessRecords) {
      const evidenceText = phase.manualEvidenceCriteria.join(" ");

      expect(evidenceText).toMatch(/evidence present/i);
      expect(evidenceText).toMatch(/evidence manually reviewed/i);
      expect(evidenceText).toMatch(/Activation Evidence Gap Resolution Planning evidence reviewed/i);
      expect(evidenceText).toMatch(/blocker status clear/i);
      expect(evidenceText).toMatch(/human approval boundary documented/i);
      expect(evidenceText).toMatch(/AI role limited to operator leverage/i);
      expect(evidenceText).toMatch(/forbidden drift still blocked/i);
      expect(evidenceText).toMatch(/no provider or communication execution/i);
      expect(phase.humanReviewBoundary).toEqual(
        expect.arrayContaining([
          "human reviews evidence completeness",
          "human owns activation decisions",
          "human owns dry-run authorization decisions",
          "human owns final authorization judgment",
          "human owns go/no-go decisions",
        ]),
      );
      expect(phase.aiOperatorLeverageBoundary).toEqual(
        expect.arrayContaining([
          "summarize completeness gaps",
          "support operator clarity",
          "do not activate providers",
          "do not send communication",
          "do not create leads",
          "do not automate maps",
          "do not implement Phase 2",
        ]),
      );
      expect(phase.blockerRule).toMatch(/blocks movement/i);
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.nextReviewGuidance).toMatch(/review/i);
    }
  });

  it("keeps Virtual D4D completeness review-only with no map automation or lead creation", () => {
    const result = getActivationEvidenceCompletenessReview();
    const phaseNames = result.phaseCompletenessRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseCompletenessRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.manualEvidenceCriteria ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.nextReviewGuidance ?? "",
    ].join(" ");

    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBe(phaseNames.indexOf("AI-Assisted Lead Discovery") + 1);
    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBeLessThan(phaseNames.indexOf("SEO & Local Authority Engine"));
    expect(virtualD4dText).toMatch(/approved target neighborhoods/i);
    expect(virtualD4dText).toMatch(/distress signal checklist/i);
    expect(virtualD4dText).toMatch(/lead approval criteria/i);
    expect(virtualD4dText).toMatch(/buyer-demand criteria/i);
    expect(virtualD4dText).toMatch(/DNC\/STOP governance/i);
    expect(virtualD4dText).toMatch(/public website\/private dashboard separation/i);
    expect(virtualD4dText).toMatch(/no-autonomous-scraping confirmation/i);
    expect(virtualD4dText).toMatch(/map scraping/i);
    expect(virtualD4dText).toMatch(/Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
    expect(virtualD4dText).toMatch(/skip tracing automation/i);
    expect(virtualD4dText).toMatch(/autonomous outreach/i);
    expect(virtualD4dText).toMatch(/campaign activation/i);
    expect(virtualD4dText).toMatch(/lead creation without human approval/i);
  });

  it("includes the full Phase 1 entity and communication identity completeness set", () => {
    const result = getActivationEvidenceCompletenessReview();
    const phase1 = result.phaseCompletenessRecords[0];
    const checklistText = result.phase1CompletenessChecklist.join(" ");
    const phase1Text = phase1.manualEvidenceCriteria.join(" ");

    expect(phase1.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(checklistText).toMatch(/Activation Evidence Gap Resolution Planning evidence/i);
    expect(checklistText).toMatch(/entity proof/i);
    expect(checklistText).toMatch(/EIN evidence/i);
    expect(checklistText).toMatch(/banking readiness/i);
    expect(checklistText).toMatch(/domain ownership/i);
    expect(checklistText).toMatch(/Google Workspace\/email identity plan/i);
    expect(checklistText).toMatch(/SPF readiness notes/i);
    expect(checklistText).toMatch(/DKIM readiness notes/i);
    expect(checklistText).toMatch(/DMARC readiness notes/i);
    expect(checklistText).toMatch(/branded signature plan/i);
    expect(checklistText).toMatch(/Twilio readiness/i);
    expect(checklistText).toMatch(/A2P\/10DLC readiness/i);
    expect(checklistText).toMatch(/DNC\/STOP governance/i);
    expect(checklistText).toMatch(/public website\/private dashboard separation/i);
    expect(phase1Text).toMatch(/entity proof/i);
    expect(phase1Text).toMatch(/Google Workspace\/email identity plan/i);
    expect(phase1Text).toMatch(/public website\/private dashboard separation/i);
  });

  it("keeps blocked execution provider communication runtime map lead Phase 2 and go-live flags false", () => {
    const flags = getActivationEvidenceCompletenessReview().flags;

    expect(flags.evidenceCollectionAutomationEnabled).toBe(false);
    expect(flags.onlineVerificationEnabled).toBe(false);
    expect(flags.storageMutationEnabled).toBe(false);
    expect(flags.completenessDecisionAuthorized).toBe(false);
    expect(flags.activationAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerExecutionAuthorized).toBe(false);
    expect(flags.providerExecutionEnabled).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerClientsEnabled).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.envReadEnabled).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.sdkImportEnabled).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.routeOrWebhookCreated).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWriteEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.mapScrapingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.skipTracingAutomationEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.phase2ImplementationEnabled).toBe(false);
  });

  it("keeps doctrine focused on highest ROI evidence completeness without activation", () => {
    const result = getActivationEvidenceCompletenessReview();
    const doctrineText = result.activationEvidenceCompletenessDoctrine.join(" ");

    expect(doctrineText).toMatch(/evidence completeness review only/i);
    expect(doctrineText).toMatch(/Activation Evidence Gap Resolution Planning evidence/i);
    expect(doctrineText).toMatch(/all 17 phases/i);
    expect(doctrineText).toMatch(/Highest acquisition ROI per operator hour/i);
    expect(doctrineText).toMatch(/AI remains operator leverage only/i);
    expect(doctrineText).toMatch(/human-approved/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/No dry-run execution, activation, provider execution, outreach/i);
    expect(doctrineText).toMatch(/map scraping/i);
    expect(doctrineText).toMatch(/GPS surveillance/i);
    expect(doctrineText).toMatch(/Phase 2 implementation/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
    expect(doctrineText).toMatch(/Manual Evidence Completeness Review/i);
    expect(doctrineText).not.toMatch(new RegExp(`1${"6"}[- ]phases?`, "i"));
  });

  it("summarizes the required completeness review boundaries and next step", () => {
    const summary = summarizeActivationEvidenceCompletenessReview(getActivationEvidenceCompletenessReview());

    expect(summary).toMatch(/evidence completeness review/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/Virtual Driving for Dollars completeness/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved/i);
    expect(summary).toMatch(/Provider decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/no activation/i);
    expect(summary).toMatch(/no provider execution/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/no map automation/i);
    expect(summary).toMatch(/not Phase 2 implementation/i);
    expect(summary).toMatch(/Manual Evidence Completeness Review/i);
    expect(summary).toMatch(/Controlled Manual Activation Readiness Planning/i);
    expect(summary).not.toMatch(new RegExp(`1${"6"}[- ]phases?`, "i"));
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = Object.keys(activationEvidenceCompletenessReviewFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "planningOnly", "evidenceCompletenessReviewOnly"].includes(flag),
    ) as Array<keyof typeof activationEvidenceCompletenessReviewFlags>;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getActivationEvidenceCompletenessReview(),
        flags: {
          ...activationEvidenceCompletenessReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertActivationEvidenceCompletenessReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields or previous step drift", () => {
    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        reviewStatus: "complete" as "completeness_review_required",
      }),
    ).toThrow(/cannot become complete/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        providerDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/provider decision/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        communicationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/communication decision/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        automationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/automation decision/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        previousRequiredStep: "Skip Gap Resolution" as "Activation Evidence Gap Resolution Planning",
      }),
    ).toThrow(/Activation Evidence Gap Resolution Planning/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        recommendedNextExactStep: "Activate Providers" as "Manual Evidence Completeness Review",
      }),
    ).toThrow(/Manual Evidence Completeness Review/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        nextStageRecommendation: "Phase 2 Implementation" as "Controlled Manual Activation Readiness Planning",
      }),
    ).toThrow(/Controlled Manual Activation Readiness Planning/i);
  });

  it("fails invariant checks if phase records drift or stale wording appears", () => {
    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        phaseCompletenessRecords: getActivationEvidenceCompletenessReview().phaseCompletenessRecords.slice(0, 16),
      }),
    ).toThrow(/17 phase completeness records/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        phaseCompletenessRecords: [
          getActivationEvidenceCompletenessReview().phaseCompletenessRecords[1],
          getActivationEvidenceCompletenessReview().phaseCompletenessRecords[0],
          ...getActivationEvidenceCompletenessReview().phaseCompletenessRecords.slice(2),
        ],
      }),
    ).toThrow(/required 17-phase order/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        phaseCompletenessRecords: [
          {
            ...getActivationEvidenceCompletenessReview().phaseCompletenessRecords[0],
            manualEvidenceCriteria: [],
          },
          ...getActivationEvidenceCompletenessReview().phaseCompletenessRecords.slice(1),
        ],
      }),
    ).toThrow(/Every phase completeness record/i);

    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        activationEvidenceCompletenessDoctrine: [[ "This stale", "phase wording is not allowed." ].join(` 1${"6"}-`)],
      }),
    ).toThrow(/outdated phase-count wording/i);
  });

  it("fails invariant checks if wording implies activation", () => {
    expect(() =>
      assertActivationEvidenceCompletenessReviewSafe({
        ...getActivationEvidenceCompletenessReview(),
        activationEvidenceCompletenessDoctrine: ["activation is authorized"],
      }),
    ).toThrow(/wording must forbid/i);
  });
});
