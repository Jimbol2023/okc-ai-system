import {
  assertFinalHumanGoNoGoAuthorizationReviewSafe,
  finalHumanGoNoGoAuthorizationReviewFlags,
  getFinalHumanGoNoGoAuthorizationReview,
  summarizeFinalHumanGoNoGoAuthorizationReview,
} from "./final-human-go-no-go-authorization-review";

describe("final human go no-go authorization review", () => {
  it("creates a planning-only final human go/no-go review contract", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();

    expect(result.phase).toBe("Final Human Go/No-Go Authorization Review");
    expect(result.finalHumanGoNoGoAuthorizationReviewStatus).toBe("planning_only");
    expect(result.goNoGoDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationExecutionDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.previousRequiredStep).toBe("Complete Human Go No-Go Readiness Decision Planning");
    expect(result.recommendedNextExactStep).toBe("Controlled Manual Activation Runbook Planning");
    expect(result.nextStageRecommendation).toBe("Controlled Manual Activation Runbook Planning");
  });

  it("keeps final review read-only advisory-only and planning-only", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps go/no-go provider communication execution and automation decisions not authorized", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();

    expect(result.goNoGoDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationExecutionDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.finalAuthorizationGranted).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.flags.providerActivationAuthorized).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all final human go/no-go review lanes", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();

    expect(result.finalHumanGoNoGoLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "go_live_readiness_gate_evidence",
        "human_decision_authority",
        "signed_authorization_evidence",
        "identity_policy_evidence",
        "consent_dnc_opt_out_evidence",
        "operator_workflow_evidence",
        "provider_credential_boundary",
        "audit_rollback_failure_evidence",
        "no_campaign_no_autonomy_boundary",
        "hard_blocker_preservation",
        "no_activation_in_review_boundary",
        "controlled_activation_runbook_readiness",
      ]),
    );
  });

  it("requires human authority signed evidence identity consent operator and runbook review", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();
    const laneText = result.finalHumanGoNoGoLanes
      .flatMap((lane) => [lane.lane, ...lane.reviewFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/Go-Live Readiness Gate evidence/i);
    expect(laneText).toMatch(/named human decision-maker/i);
    expect(laneText).toMatch(/signed authorization evidence/i);
    expect(laneText).toMatch(/custom domain policy/i);
    expect(laneText).toMatch(/consent evidence/i);
    expect(laneText).toMatch(/operator workflow clarity/i);
    expect(laneText).toMatch(/controlled manual activation runbook next/i);
  });

  it("preserves DNC opt-out STOP missing approval and no activation boundaries", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();
    const laneText = result.finalHumanGoNoGoLanes
      .flatMap((lane) => [lane.lane, ...lane.reviewFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/DNC hard blocker/i);
    expect(laneText).toMatch(/opt-out hard blocker/i);
    expect(laneText).toMatch(/STOP hard blocker/i);
    expect(laneText).toMatch(/missing approval blocker/i);
    expect(laneText).toMatch(/no go-live/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/no outbound communication/i);
  });

  it("keeps provider domain number env SDK route webhook and activation flags false", () => {
    const flags = getFinalHumanGoNoGoAuthorizationReview().flags;

    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.spfDkimDmarcPublished).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.routeCreated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
  });

  it("keeps outbound communication AI voice campaign queue reminder polling and runtime flags false", () => {
    const flags = getFinalHumanGoNoGoAuthorizationReview().flags;

    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
  });

  it("keeps CRM audit approval execution autonomy spend blocker and rollback flags false", () => {
    const flags = getFinalHumanGoNoGoAuthorizationReview().flags;

    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopBypassAllowed).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
  });

  it("keeps doctrine focused on human review without live activation", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();
    const doctrineText = result.finalHumanGoNoGoDoctrine.join(" ");

    expect(doctrineText).toMatch(/contract-only and review-only/i);
    expect(doctrineText).toMatch(/Go\/no-go decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication execution decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/AI may summarize evidence and explain blockers only/i);
    expect(doctrineText).toMatch(/Final authorization requires separate signed human evidence/i);
    expect(doctrineText).toMatch(/DNC, opt-out, STOP, revocation, and missing approval remain non-bypassable/i);
    expect(doctrineText).toMatch(/Complete Human Go No-Go Readiness Decision Planning/i);
    expect(doctrineText).toMatch(/all 17 phases/i);
    expect(doctrineText).toMatch(/operator leverage only/i);
    expect(doctrineText).toMatch(/Virtual Driving for Dollars remains no-map-automation/i);
    expect(doctrineText).toMatch(/lead creation/i);
    expect(doctrineText).toMatch(/map scraping/i);
    expect(doctrineText).toMatch(/Google Street View automation/i);
    expect(doctrineText).toMatch(/GPS surveillance/i);
    expect(doctrineText).toMatch(/Phase 2 implementation/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
  });

  it("defines all 17 phase final review records in order", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();

    expect(result.phaseFinalReviewRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("requires every phase final review record to preserve human authorization and no-execution boundaries", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();

    for (const phase of result.phaseFinalReviewRecords) {
      expect(phase.finalReviewEvidence).toEqual(expect.arrayContaining(["prior completion step evidence"]));
      expect(phase.humanAuthorizationBoundary).toEqual(expect.arrayContaining(["human owns final review judgment", "human owns signed authorization evidence"]));
      expect(phase.signedEvidenceExpectation).toMatch(/separate signed human evidence/i);
      expect(phase.blockerPreservationRule).toMatch(/non-bypassable/i);
      expect(phase.aiAdvisoryOnlyRole).toEqual(expect.arrayContaining(["summarize final review evidence", "support operator clarity", "do not grant final authorization"]));
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionRule).toMatch(/does not authorize final authorization/i);
      expect(phase.noExecutionRule).toMatch(/go-live/i);
      expect(phase.noExecutionRule).toMatch(/provider activation/i);
      expect(phase.noExecutionRule).toMatch(/lead creation/i);
      expect(phase.noExecutionRule).toMatch(/map automation/i);
      expect(phase.noExecutionRule).toMatch(/Phase 2 implementation/i);
    }
  });

  it("keeps Virtual Driving for Dollars final review no-map automation and human-approved only", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();
    const phaseNames = result.phaseFinalReviewRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseFinalReviewRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.finalReviewEvidence ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.noExecutionRule ?? "",
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
    expect(virtualD4dText).toMatch(/map scraping/i);
    expect(virtualD4dText).toMatch(/Google Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
    expect(virtualD4dText).toMatch(/skip tracing automation/i);
    expect(virtualD4dText).toMatch(/owner contact automation/i);
    expect(virtualD4dText).toMatch(/autonomous outreach/i);
    expect(virtualD4dText).toMatch(/campaign activation/i);
    expect(virtualD4dText).toMatch(/lead creation without human approval/i);
  });

  it("summarizes no authorization activation communication runtime autonomy or spend and includes next stage", () => {
    const result = getFinalHumanGoNoGoAuthorizationReview();
    const summary = summarizeFinalHumanGoNoGoAuthorizationReview(result);

    expect(summary).toMatch(/Go\/no-go decision is not_authorized/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication execution decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/No final authorization/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned/i);
    expect(summary).toMatch(/go-live/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/lead creation/i);
    expect(summary).toMatch(/map scraping/i);
    expect(summary).toMatch(/Google Street View automation/i);
    expect(summary).toMatch(/GPS surveillance/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/runtime job/i);
    expect(summary).toMatch(/autonomous seller handling/i);
    expect(summary).toMatch(/spend increase/i);
    expect(summary).toMatch(/Next stage: Controlled Manual Activation Runbook Planning/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "finalAuthorizationGranted",
      "goLiveAuthorized",
      "providerActivationAuthorized",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "mailboxCreated",
      "spfDkimDmarcPublished",
      "numberActivated",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
      "routeCreated",
      "inboundWebhookCreated",
      "campaignActivated",
      "queueSystemEnabled",
      "reminderSystemEnabled",
      "pollingEnabled",
      "runtimeJobsEnabled",
      "crmMutationEnabled",
      "auditWritingEnabled",
      "automationEnabled",
      "autonomousFollowUpEnabled",
      "autonomousSellerHandlingEnabled",
      "autonomousOutreachEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopBypassAllowed",
      "rollbackExecutionEnabled",
      "mapScrapingEnabled",
      "streetViewAutomationEnabled",
      "gpsSurveillanceEnabled",
      "skipTracingEnabled",
      "leadCreationEnabled",
      "phase2ImplementationEnabled",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getFinalHumanGoNoGoAuthorizationReview(),
        flags: {
          ...finalHumanGoNoGoAuthorizationReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      finalHumanGoNoGoAuthorizationReviewStatus: "human_authorization_review_required" as "planning_only",
    };
    const goNoGoUnsafe = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      goNoGoDecision: "authorized" as "not_authorized",
    };
    const providerUnsafe = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      communicationExecutionDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      automationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(statusUnsafe)).toThrow(/cannot become authorized/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(goNoGoUnsafe)).toThrow(/Go\/No-Go decision/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(communicationUnsafe)).toThrow(/communication execution decision/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if prior completion step or phase records drift", () => {
    const missingPriorStep = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      previousRequiredStep: "Human Go No-Go Readiness Decision Planning" as "Complete Human Go No-Go Readiness Decision Planning",
    };
    const missingPhase = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      phaseFinalReviewRecords: getFinalHumanGoNoGoAuthorizationReview().phaseFinalReviewRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      phaseFinalReviewRecords: [
        getFinalHumanGoNoGoAuthorizationReview().phaseFinalReviewRecords[1],
        getFinalHumanGoNoGoAuthorizationReview().phaseFinalReviewRecords[0],
        ...getFinalHumanGoNoGoAuthorizationReview().phaseFinalReviewRecords.slice(2),
      ],
    };
    const missingRecordField = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      phaseFinalReviewRecords: [
        {
          ...getFinalHumanGoNoGoAuthorizationReview().phaseFinalReviewRecords[0],
          noExecutionRule: "",
        },
        ...getFinalHumanGoNoGoAuthorizationReview().phaseFinalReviewRecords.slice(1),
      ],
    };
    const activationWording = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      finalHumanGoNoGoDoctrine: ["Activation and final authorization are allowed."],
    };

    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(missingPriorStep)).toThrow(/Complete Human Go No-Go Readiness Decision Planning/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(missingPhase)).toThrow(/17 phase final review records/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(wrongOrder)).toThrow(/17-phase order/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(missingRecordField)).toThrow(/Every phase final review record/i);
    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(activationWording)).toThrow(/forbid activation/i);
  });

  it("fails invariant checks if the roadmap skips controlled manual activation runbook planning", () => {
    const unsafeResult = {
      ...getFinalHumanGoNoGoAuthorizationReview(),
      recommendedNextExactStep: "Activate Providers" as "Controlled Manual Activation Runbook Planning",
    };

    expect(() => assertFinalHumanGoNoGoAuthorizationReviewSafe(unsafeResult)).toThrow(/Controlled Manual Activation Runbook Planning/i);
  });
});
