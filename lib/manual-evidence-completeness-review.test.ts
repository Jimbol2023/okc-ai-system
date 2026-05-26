import {
  assertManualEvidenceCompletenessReviewSafe,
  getManualEvidenceCompletenessReview,
  manualEvidenceCompletenessPhaseOrder,
  manualEvidenceCompletenessReviewFlags,
  summarizeManualEvidenceCompletenessReview,
} from "./manual-evidence-completeness-review";

describe("manual evidence completeness review", () => {
  it("creates the pinned manual evidence completeness review contract", () => {
    const result = getManualEvidenceCompletenessReview();

    expect(result.phase).toBe("Manual Evidence Completeness Review");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.manualReviewStatus).toBe("manual_evidence_completeness_review_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.previousRequiredStep).toBe("Activation Evidence Completeness Review");
    expect(result.recommendedNextExactStep).toBe("Controlled Manual Activation Readiness Planning");
    expect(result.nextStageRecommendation).toBe("Controlled Manual Activation Readiness Planning");
  });

  it("keeps manual evidence completeness review read-only advisory-only planning-only and manual-review-only", () => {
    const result = getManualEvidenceCompletenessReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.manualEvidenceCompletenessReviewOnly).toBe(true);
  });

  it("defines all 17 phase manual review records in exact order", () => {
    const result = getManualEvidenceCompletenessReview();

    expect(result.phaseManualReviewRecords).toHaveLength(17);
    expect(result.phaseManualReviewRecords.map((phase) => phase.phaseName)).toEqual([...manualEvidenceCompletenessPhaseOrder]);
    expect(result.phaseManualReviewRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("requires every phase record to include manual evidence review structure", () => {
    const result = getManualEvidenceCompletenessReview();

    for (const phase of result.phaseManualReviewRecords) {
      const evidenceText = phase.manualEvidenceReviewedRequirement.join(" ");

      expect(evidenceText).toMatch(/Activation Evidence Completeness Review evidence reviewed/i);
      expect(evidenceText).toMatch(/manual evidence reviewed by human/i);
      expect(evidenceText).toMatch(/blocker clarity documented/i);
      expect(phase.blockerClarityRequirement).toMatch(/blockers must be clear/i);
      expect(phase.humanReviewerBoundary).toEqual(
        expect.arrayContaining([
          "human owns manual evidence review",
          "human owns blocker clarity",
          "human owns provider decisions",
          "human owns communication decisions",
          "human owns activation decisions",
          "human owns final authorization judgment",
          "human owns go/no-go judgment",
        ]),
      );
      expect(phase.aiOperatorLeverageSupportRole).toEqual(
        expect.arrayContaining([
          "organize manual evidence",
          "summarize completeness gaps",
          "explain blockers",
          "support operator clarity",
          "do not activate providers",
          "do not send communication",
          "do not create leads",
          "do not automate maps",
          "do not implement Phase 2",
        ]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.nextReadinessGuidance).toMatch(/readiness|forward|carry/i);
    }
  });

  it("includes Phase 1 manual entity and communication identity evidence coverage", () => {
    const result = getManualEvidenceCompletenessReview();
    const phase1 = result.phaseManualReviewRecords[0];
    const coverageText = result.phase1ManualEvidenceCoverage.join(" ");
    const phase1Text = phase1.manualEvidenceReviewedRequirement.join(" ");

    expect(phase1.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(coverageText).toMatch(/Activation Evidence Completeness Review evidence/i);
    expect(coverageText).toMatch(/entity proof/i);
    expect(coverageText).toMatch(/EIN evidence/i);
    expect(coverageText).toMatch(/banking readiness/i);
    expect(coverageText).toMatch(/domain ownership/i);
    expect(coverageText).toMatch(/Google Workspace\/email identity/i);
    expect(coverageText).toMatch(/SPF notes/i);
    expect(coverageText).toMatch(/DKIM notes/i);
    expect(coverageText).toMatch(/DMARC notes/i);
    expect(coverageText).toMatch(/branded signature plan/i);
    expect(coverageText).toMatch(/Twilio readiness/i);
    expect(coverageText).toMatch(/A2P\/10DLC readiness/i);
    expect(coverageText).toMatch(/DNC\/STOP governance/i);
    expect(coverageText).toMatch(/public\/private separation/i);
    expect(phase1Text).toMatch(/entity proof/i);
    expect(phase1Text).toMatch(/public\/private separation/i);
  });

  it("keeps Virtual D4D review-only with no map automation or lead creation", () => {
    const result = getManualEvidenceCompletenessReview();
    const phaseNames = result.phaseManualReviewRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseManualReviewRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.manualEvidenceReviewedRequirement ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.nextReadinessGuidance ?? "",
    ].join(" ");

    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBe(phaseNames.indexOf("AI-Assisted Lead Discovery") + 1);
    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBeLessThan(phaseNames.indexOf("SEO & Local Authority Engine"));
    expect(virtualD4dText).toMatch(/approved target neighborhoods/i);
    expect(virtualD4dText).toMatch(/manual review process/i);
    expect(virtualD4dText).toMatch(/distress signal checklist/i);
    expect(virtualD4dText).toMatch(/lead approval criteria/i);
    expect(virtualD4dText).toMatch(/buyer-demand criteria/i);
    expect(virtualD4dText).toMatch(/DNC\/STOP governance/i);
    expect(virtualD4dText).toMatch(/public\/private separation/i);
    expect(virtualD4dText).toMatch(/no-autonomous-scraping confirmation/i);
    expect(virtualD4dText).toMatch(/map scraping/i);
    expect(virtualD4dText).toMatch(/Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
    expect(virtualD4dText).toMatch(/skip tracing automation/i);
    expect(virtualD4dText).toMatch(/autonomous outreach/i);
    expect(virtualD4dText).toMatch(/campaign activation/i);
    expect(virtualD4dText).toMatch(/lead creation without human approval/i);
  });

  it("keeps all blocked execution and drift flags false", () => {
    const flags = getManualEvidenceCompletenessReview().flags;

    expect(flags.evidenceCollectionAutomationEnabled).toBe(false);
    expect(flags.onlineVerificationEnabled).toBe(false);
    expect(flags.storageMutationEnabled).toBe(false);
    expect(flags.manualReviewDecisionAuthorized).toBe(false);
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
    expect(flags.communicationExecutionEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
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

  it("keeps doctrine focused on manual review without activation", () => {
    const result = getManualEvidenceCompletenessReview();
    const doctrineText = result.manualEvidenceCompletenessReviewDoctrine.join(" ");

    expect(doctrineText).toMatch(/manual evidence completeness review only/i);
    expect(doctrineText).toMatch(/Activation Evidence Completeness Review evidence/i);
    expect(doctrineText).toMatch(/all 17 phases/i);
    expect(doctrineText).toMatch(/Highest acquisition ROI per operator hour/i);
    expect(doctrineText).toMatch(/AI remains operator leverage only/i);
    expect(doctrineText).toMatch(/human-owned and human-approved/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/No activation, provider execution, outreach/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
    expect(doctrineText).toMatch(/Controlled Manual Activation Readiness Planning/i);
    expect(doctrineText).not.toMatch(new RegExp(`1${"6"}[- ]phases?`, "i"));
  });

  it("summarizes required manual evidence completeness boundaries and next stage", () => {
    const summary = summarizeManualEvidenceCompletenessReview(getManualEvidenceCompletenessReview());

    expect(summary).toMatch(/manual evidence completeness review/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned review/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/no activation/i);
    expect(summary).toMatch(/no provider execution/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/no map automation/i);
    expect(summary).toMatch(/not Phase 2 implementation/i);
    expect(summary).toMatch(/Controlled Manual Activation Readiness Planning/i);
    expect(summary).not.toMatch(new RegExp(`1${"6"}[- ]phases?`, "i"));
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = Object.keys(manualEvidenceCompletenessReviewFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "planningOnly", "manualEvidenceCompletenessReviewOnly"].includes(flag),
    ) as Array<keyof typeof manualEvidenceCompletenessReviewFlags>;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getManualEvidenceCompletenessReview(),
        flags: {
          ...manualEvidenceCompletenessReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertManualEvidenceCompletenessReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields or previous step drift", () => {
    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        manualReviewStatus: "complete" as "manual_evidence_completeness_review_required",
      }),
    ).toThrow(/cannot become activation-ready/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        providerDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/provider decision/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        communicationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/communication decision/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        automationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/automation decision/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        previousRequiredStep: "Skip Completeness Review" as "Activation Evidence Completeness Review",
      }),
    ).toThrow(/Activation Evidence Completeness Review/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        recommendedNextExactStep: "Activate Providers" as "Controlled Manual Activation Readiness Planning",
      }),
    ).toThrow(/Controlled Manual Activation Readiness Planning/i);
  });

  it("fails invariant checks if phase records drift or stale wording appears", () => {
    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        phaseManualReviewRecords: getManualEvidenceCompletenessReview().phaseManualReviewRecords.slice(0, 16),
      }),
    ).toThrow(/17 phase manual review records/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        phaseManualReviewRecords: [
          getManualEvidenceCompletenessReview().phaseManualReviewRecords[1],
          getManualEvidenceCompletenessReview().phaseManualReviewRecords[0],
          ...getManualEvidenceCompletenessReview().phaseManualReviewRecords.slice(2),
        ],
      }),
    ).toThrow(/required 17-phase order/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        phaseManualReviewRecords: [
          {
            ...getManualEvidenceCompletenessReview().phaseManualReviewRecords[0],
            manualEvidenceReviewedRequirement: [],
          },
          ...getManualEvidenceCompletenessReview().phaseManualReviewRecords.slice(1),
        ],
      }),
    ).toThrow(/Every phase manual review record/i);

    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        manualEvidenceCompletenessReviewDoctrine: [[ "This stale", "phase wording is not allowed." ].join(` 1${"6"}-`)],
      }),
    ).toThrow(/outdated phase-count wording/i);
  });

  it("fails invariant checks if wording implies activation", () => {
    expect(() =>
      assertManualEvidenceCompletenessReviewSafe({
        ...getManualEvidenceCompletenessReview(),
        manualEvidenceCompletenessReviewDoctrine: ["activation is authorized"],
      }),
    ).toThrow(/wording must forbid/i);
  });
});
