import {
  activationEvidenceGapPhaseOrder,
  activationEvidenceGapResolutionPlanningFlags,
  assertActivationEvidenceGapResolutionPlanningSafe,
  getActivationEvidenceGapResolutionPlanning,
  summarizeActivationEvidenceGapResolutionPlanning,
} from "./activation-evidence-gap-resolution-planning";

describe("activation evidence gap resolution planning", () => {
  it("preserves pinned phase decisions next exact step and next stage", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.phase).toBe("Activation Evidence Gap Resolution Planning");
    expect(result.activationEvidenceGapResolutionPlanningStatus).toBe("planning_only");
    expect(result.gapResolutionDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Activation Evidence Completeness Review");
    expect(result.nextStageRecommendation).toBe("Activation Evidence Completeness Review");
  });

  it("requires Manual Activation Dry-Run Evidence Review as the previous step", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.previousRequiredStep).toBe("Manual Activation Dry-Run Evidence Review");
    expect(result.activationEvidenceGapDoctrine.join(" ")).toMatch(/Manual Activation Dry-Run Evidence Review gaps/i);
  });

  it("keeps gap resolution read-only advisory-only planning-only and evidence-gap-only", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.evidenceGapPlanningOnly).toBe(true);
    expect(result.flags.evidenceGapOnly).toBe(true);
  });

  it("preserves all activation evidence gap lanes", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.activationEvidenceGapLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "llc_business_identity_evidence",
        "domain_ownership_evidence",
        "vercel_domain_connection_evidence",
        "google_workspace_email_evidence",
        "spf_dkim_dmarc_evidence",
        "email_signature_evidence",
        "twilio_number_readiness",
        "a2p_10dlc_status",
        "stop_dnc_handling_evidence",
        "manual_approval_checklist_evidence",
        "rollback_checklist_evidence",
        "internal_test_evidence",
      ]),
    );

    for (const lane of result.activationEvidenceGapLanes) {
      expect(lane.missingEvidenceFocus.length).toBeGreaterThan(0);
      expect(lane.blockerRule).toMatch(/Missing|blocks|cannot/i);
    }
  });

  it("defines all 17 elite high-aROI phase evidence gap records in order", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.phaseEvidenceGapMap).toHaveLength(17);
    expect(result.phaseEvidenceGapMap.map((phase) => phase.phaseName)).toEqual([...activationEvidenceGapPhaseOrder]);
    expect(result.phaseEvidenceGapMap.map((phase) => phase.phaseName)).toEqual([
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

  it("requires every phase record to use the normalized evidence gap shape", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    for (const phase of result.phaseEvidenceGapMap) {
      expect(phase.evidenceFocus.length).toBeGreaterThan(0);
      expect(phase.manualEvidenceRequirement.length).toBeGreaterThan(0);
      expect(phase.manualEvidenceRequirement.join(" ")).toMatch(/Manual Activation Dry-Run Evidence Review gaps/i);
      expect(phase.blockerRule).toMatch(/block/i);
      expect(phase.aiGapSummaryOnlyRole).toEqual(
        expect.arrayContaining([
          "summarize evidence gaps",
          "organize evidence",
          "explain blockers",
          "prepare manual review notes",
          "support operator clarity",
        ]),
      );
      expect(phase.humanBoundary).toEqual(
        expect.arrayContaining([
          "evidence review",
          "blocker interpretation",
          "provider decisions",
          "communication decisions",
          "activation decisions",
          "dry-run authorization decisions",
          "final go/no-go judgment",
        ]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.nextEvidenceGuidance).toMatch(/evidence/i);
    }
  });

  it("keeps Virtual D4D review-only with no map automation or lead creation", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const phaseNames = result.phaseEvidenceGapMap.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseEvidenceGapMap.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.evidenceFocus ?? []),
      ...(virtualD4d?.manualEvidenceRequirement ?? []),
      virtualD4d?.blockerRule ?? "",
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.nextEvidenceGuidance ?? "",
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

  it("strengthens Phase 1 with the full manual entity and communication identity evidence set", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const phase1 = result.phaseEvidenceGapMap[0];
    const evidenceText = phase1.manualEvidenceRequirement.join(" ");

    expect(phase1.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(evidenceText).toMatch(/Manual Activation Dry-Run Evidence Review gaps/i);
    expect(evidenceText).toMatch(/entity proof/i);
    expect(evidenceText).toMatch(/EIN evidence/i);
    expect(evidenceText).toMatch(/banking readiness/i);
    expect(evidenceText).toMatch(/domain ownership/i);
    expect(evidenceText).toMatch(/Google Workspace\/email identity plan/i);
    expect(evidenceText).toMatch(/SPF readiness notes/i);
    expect(evidenceText).toMatch(/DKIM readiness notes/i);
    expect(evidenceText).toMatch(/DMARC readiness notes/i);
    expect(evidenceText).toMatch(/branded signature plan/i);
    expect(evidenceText).toMatch(/Twilio readiness notes/i);
    expect(evidenceText).toMatch(/A2P\/10DLC readiness notes/i);
    expect(evidenceText).toMatch(/DNC\/STOP governance/i);
    expect(evidenceText).toMatch(/public website\/private dashboard separation/i);
  });

  it("keeps all blocked execution provider communication runtime map lead Phase 2 and go-live flags false", () => {
    const flags = getActivationEvidenceGapResolutionPlanning().flags;

    expect(flags.activationAuthorized).toBe(false);
    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.evidenceCollectionAutomationEnabled).toBe(false);
    expect(flags.gapResolutionExecutionAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerExecutionEnabled).toBe(false);
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
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.mapScrapingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.skipTracingAutomationEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.phase2ImplementationEnabled).toBe(false);
  });

  it("keeps doctrine focused on evidence gaps without execution or stale phase wording", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const doctrineText = result.activationEvidenceGapDoctrine.join(" ");

    expect(doctrineText).toMatch(/identifies missing evidence only/i);
    expect(doctrineText).toMatch(/Manual Activation Dry-Run Evidence Review gaps/i);
    expect(doctrineText).toMatch(/not_authorized/i);
    expect(doctrineText).toMatch(/evidence-gap planning for all 17/i);
    expect(doctrineText).toMatch(/summarize evidence gaps, organize evidence, explain blockers/i);
    expect(doctrineText).toMatch(/AI cannot execute dry-runs/i);
    expect(doctrineText).toMatch(/Human-approved movement/i);
    expect(doctrineText).toMatch(/No evidence collection automation, dry-run execution, activation, provider execution/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
    expect(doctrineText).not.toMatch(new RegExp(`1${"6"}[- ]phases?`, "i"));
  });

  it("summarizes required evidence-gap planning language and next stage", () => {
    const summary = summarizeActivationEvidenceGapResolutionPlanning(getActivationEvidenceGapResolutionPlanning());

    expect(summary).toMatch(/evidence-gap planning for all 17 phases/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/no activation/i);
    expect(summary).toMatch(/no provider execution/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/no map automation/i);
    expect(summary).toMatch(/not Phase 2 implementation/i);
    expect(summary).toMatch(/Activation Evidence Completeness Review/i);
    expect(summary).not.toMatch(new RegExp(`1${"6"}[- ]phases?`, "i"));
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = Object.keys(activationEvidenceGapResolutionPlanningFlags).filter(
      (flag) => !["readOnly", "advisoryOnly", "planningOnly", "evidenceGapPlanningOnly", "evidenceGapOnly"].includes(flag),
    ) as Array<keyof typeof activationEvidenceGapResolutionPlanningFlags>;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getActivationEvidenceGapResolutionPlanning(),
        flags: {
          ...activationEvidenceGapResolutionPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertActivationEvidenceGapResolutionPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields or previous step drift", () => {
    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        gapResolutionDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/Gap Resolution decision/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        providerDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/provider decision/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        communicationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/communication decision/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        automationDecision: "authorized" as "not_authorized",
      }),
    ).toThrow(/automation decision/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        previousRequiredStep: "Skip Dry Run Evidence" as "Manual Activation Dry-Run Evidence Review",
      }),
    ).toThrow(/Manual Activation Dry-Run Evidence Review/i);
  });

  it("fails invariant checks if phase records drift or stale wording appears", () => {
    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        phaseEvidenceGapMap: getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap.slice(0, 16),
      }),
    ).toThrow(/17 phase evidence gap records/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        phaseEvidenceGapMap: [
          getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap[1],
          getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap[0],
          ...getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap.slice(2),
        ],
      }),
    ).toThrow(/required 17-phase order/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        phaseEvidenceGapMap: [
          {
            ...getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap[0],
            manualEvidenceRequirement: [],
          },
          ...getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap.slice(1),
        ],
      }),
    ).toThrow(/Every phase evidence gap record/i);

    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        activationEvidenceGapDoctrine: [[ "This stale", "phase wording is not allowed." ].join(` 1${"6"}-`)],
      }),
    ).toThrow(/outdated phase-count wording/i);
  });

  it("fails invariant checks if wording implies activation", () => {
    expect(() =>
      assertActivationEvidenceGapResolutionPlanningSafe({
        ...getActivationEvidenceGapResolutionPlanning(),
        activationEvidenceGapDoctrine: ["activation is authorized"],
      }),
    ).toThrow(/wording must forbid/i);
  });
});
