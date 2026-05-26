import {
  assertManualActivationDryRunEvidenceReviewSafe,
  getManualActivationDryRunEvidenceReview,
  manualActivationDryRunEvidenceLaneOrder,
  manualActivationDryRunEvidenceReviewFlags,
  manualActivationDryRunPhaseOrder,
  summarizeManualActivationDryRunEvidenceReview,
} from "./manual-activation-dry-run-evidence-review";

describe("manual activation dry-run evidence review", () => {
  it("preserves pinned fields and decisions", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.phase).toBe("Manual Activation Dry-Run Evidence Review");
    expect(result.currentPhasePosition).toBe("Phase 1: Business Foundation & Trust Infrastructure");
    expect(result.manualActivationDryRunEvidenceReviewStatus).toBe("planning_only");
    expect(result.dryRunDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Activation Evidence Gap Resolution Planning");
    expect(result.nextStageRecommendation).toBe("Activation Evidence Gap Resolution Planning");
  });

  it("requires controlled manual activation runbook planning first", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.previousRequiredStep).toBe("Controlled Manual Activation Runbook Planning");
    expect(result.manualActivationDryRunEvidenceDoctrine.join(" ")).toMatch(/Controlled Manual Activation Runbook Planning evidence/i);
  });

  it("keeps dry-run evidence review read-only advisory-only planning-only and evidence-review-only", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.evidenceReviewOnly).toBe(true);
  });

  it("preserves all dry-run evidence lanes with evidence-only human-owned AI-summary-only boundaries", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.manualActivationDryRunEvidenceLanes.map((lane) => lane.lane)).toEqual(
      manualActivationDryRunEvidenceLaneOrder,
    );

    for (const lane of result.manualActivationDryRunEvidenceLanes) {
      expect(lane.evidenceFocus.length).toBeGreaterThan(0);
      expect(lane.governanceRule).toMatch(/evidence|review|cannot/i);
      expect(lane.humanOwner.join(" ")).toMatch(/human owns/i);
      expect(lane.aiEvidenceSummaryOnlyRole.join(" ")).toMatch(/summarize evidence gaps/i);
      expect(lane.noExecutionRule).toMatch(/cannot execute runbooks/i);
      expect(lane.noExecutionRule).toMatch(/cannot execute dry-runs/i);
    }
  });

  it("defines all 17 phase dry-run evidence records in order", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.phaseDryRunEvidenceRecords).toHaveLength(17);
    expect(result.phaseDryRunEvidenceRecords.map((phase) => phase.phaseName)).toEqual([...manualActivationDryRunPhaseOrder]);
    expect(result.phaseDryRunEvidenceRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("requires complete phase evidence structure for every phase", () => {
    const result = getManualActivationDryRunEvidenceReview();

    for (const phase of result.phaseDryRunEvidenceRecords) {
      expect(phase.evidenceReviewBasis.length).toBeGreaterThan(0);
      expect(phase.manualEvidenceRequirement).toMatch(/Controlled Manual Activation Runbook Planning/i);
      expect(phase.blockerRule).toMatch(/blockers/i);
      expect(phase.humanOwner.join(" ")).toMatch(/human owns/i);
      expect(phase.aiEvidenceSummaryOnlyRole.join(" ")).toMatch(/summarize evidence gaps/i);
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionRule).toMatch(/no runbook execution/i);
      expect(phase.noExecutionRule).toMatch(/no dry-run execution/i);
    }
  });

  it("keeps Virtual D4D evidence review review-only with no map automation or lead creation", () => {
    const result = getManualActivationDryRunEvidenceReview();
    const virtualD4d = result.phaseDryRunEvidenceRecords.find(
      (phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine",
    );

    expect(virtualD4d).toBeDefined();
    expect(virtualD4d?.evidenceReviewBasis).toEqual(
      expect.arrayContaining([
        "approved target neighborhoods",
        "manual review process",
        "distress signal checklist",
        "lead approval criteria",
        "buyer-demand criteria",
        "DNC/STOP governance",
        "public/private separation",
        "no-autonomous-scraping confirmation",
      ]),
    );
    expect(virtualD4d?.forbiddenDrift).toEqual(
      expect.arrayContaining([
        "map scraping",
        "Google Street View automation",
        "GPS surveillance",
        "skip tracing automation",
        "owner contact automation",
        "autonomous outreach",
        "campaign activation",
        "lead creation without human approval",
      ]),
    );
    expect(virtualD4d?.noExecutionRule).toMatch(/no map automation/i);
    expect(virtualD4d?.noExecutionRule).toMatch(/no lead creation/i);
  });

  it("keeps all blocked execution flags false", () => {
    const flags = getManualActivationDryRunEvidenceReview().flags;

    expect(flags.runbookExecutionAuthorized).toBe(false);
    expect(flags.runbookExecutionEnabled).toBe(false);
    expect(flags.dryRunExecutionAuthorized).toBe(false);
    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerClientsEnabled).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.envReadEnabled).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.sdkImportEnabled).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.domainMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
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
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousTextingEnabled).toBe(false);
    expect(flags.autonomousCallingEnabled).toBe(false);
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

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = Object.keys(manualActivationDryRunEvidenceReviewFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "planningOnly", "evidenceReviewOnly"].includes(flag),
    ) as Array<keyof typeof manualActivationDryRunEvidenceReviewFlags>;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getManualActivationDryRunEvidenceReview(),
        flags: {
          ...manualActivationDryRunEvidenceReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertManualActivationDryRunEvidenceReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned decisions or previous step drift", () => {
    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        dryRunDecision: "authorized" as "not_authorized_for_execution",
      }),
    ).toThrow(/Dry-Run decision/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        providerDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/provider decision/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        communicationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/communication decision/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        automationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/automation decision/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        currentPhasePosition: "Phase 2: Lead Intake & Simple CRM" as "Phase 1: Business Foundation & Trust Infrastructure",
      }),
    ).toThrow(/Phase 1/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        previousRequiredStep: "Skip Runbook Planning" as "Controlled Manual Activation Runbook Planning",
      }),
    ).toThrow(/Controlled Manual Activation Runbook Planning/i);
  });

  it("fails invariant checks if phase records or doctrine wording drift", () => {
    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        manualActivationDryRunEvidenceLanes: getManualActivationDryRunEvidenceReview().manualActivationDryRunEvidenceLanes.slice(0, -1),
      }),
    ).toThrow(/required dry-run evidence lane/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        phaseDryRunEvidenceRecords: getManualActivationDryRunEvidenceReview().phaseDryRunEvidenceRecords.slice(0, 16),
      }),
    ).toThrow(/17 phase evidence records/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        phaseDryRunEvidenceRecords: [
          getManualActivationDryRunEvidenceReview().phaseDryRunEvidenceRecords[1],
          getManualActivationDryRunEvidenceReview().phaseDryRunEvidenceRecords[0],
          ...getManualActivationDryRunEvidenceReview().phaseDryRunEvidenceRecords.slice(2),
        ],
      }),
    ).toThrow(/17-phase order/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        manualActivationDryRunEvidenceDoctrine: ["Manual Activation Dry-Run Evidence Review covers all 16 phases."],
      }),
    ).toThrow(/17-phase language/i);

    expect(() =>
      assertManualActivationDryRunEvidenceReviewSafe({
        ...getManualActivationDryRunEvidenceReview(),
        manualActivationDryRunEvidenceDoctrine: ["activation is authorized"],
      }),
    ).toThrow(/wording must forbid/i);
  });

  it("summarizes highest ROI no-drift evidence review and the next stage", () => {
    const summary = summarizeManualActivationDryRunEvidenceReview(getManualActivationDryRunEvidenceReview());

    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/Phase 1: Business Foundation & Trust Infrastructure/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned dry-run evidence review/i);
    expect(summary).toMatch(/No runbook execution, dry-run execution/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/no map automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/Activation Evidence Gap Resolution Planning/i);
  });
});
