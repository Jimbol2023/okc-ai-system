import {
  assertOperationalReadinessCheckSafe,
  getOperationalReadinessCheck,
  operationalReadinessCheckFlags,
  summarizeOperationalReadinessCheck,
} from "./operational-readiness-check";

describe("operational readiness check", () => {
  it("creates a planning-only operational readiness bridge to A1.4", () => {
    const result = getOperationalReadinessCheck();

    expect(result.phase).toBe("Operational Readiness Check");
    expect(result.operationalReadinessStatus).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A1.4 Source Quality Intelligence");
    expect(result.futureAcquisitionReturnGate.nextExactPhase).toBe("A1.4 Source Quality Intelligence");
  });

  it("keeps readiness read-only advisory-only and planning-only", () => {
    const result = getOperationalReadinessCheck();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("defines all required readiness lanes", () => {
    const result = getOperationalReadinessCheck();

    expect(result.readinessLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "imported_property_first_lead_review",
        "missing_contact_manual_work",
        "seller_context_visibility",
        "operator_call_clarity",
        "blocker_visibility",
        "communication_readiness_clarity",
        "acquisition_usability",
        "return_to_acquisition_readiness",
      ]),
    );
  });

  it("keeps all provider outbound runtime persistence vector embedding and automation flags false", () => {
    const flags = getOperationalReadinessCheck().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.campaignsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.persistenceActivated).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
  });

  it("keeps autonomous seller handling follow-up negotiation and approval execution false", () => {
    const flags = getOperationalReadinessCheck().flags;

    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.readinessGrantsExecution).toBe(false);
    expect(flags.readinessGrantsApprovalExecution).toBe(false);
  });

  it("keeps scraping connectors route planning territory scoring and acquisition execution false", () => {
    const flags = getOperationalReadinessCheck().flags;

    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.publicRecordConnectorsEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.territoryScoringEnabled).toBe(false);
    expect(flags.acquisitionExecutionAuthorized).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
  });

  it("keeps DNC opt-out property-first and missing-contact blockers visible and non-bypassable", () => {
    const result = getOperationalReadinessCheck();
    const flags = result.flags;

    expect(result.readinessBlockers).toEqual(
      expect.arrayContaining([
        "DNC",
        "opt-out",
        "property-first cleanup",
        "missing phone/email",
      ]),
    );
    expect(flags.dncTreatedAsOutreachReady).toBe(false);
    expect(flags.optOutTreatedAsOutreachReady).toBe(false);
    expect(flags.propertyFirstTreatedAsOutreachReady).toBe(false);
    expect(flags.missingContactTreatedAsOutreachReady).toBe(false);
  });

  it("covers the core operator questions", () => {
    const result = getOperationalReadinessCheck();

    expect(result.operatorQuestions).toEqual(
      expect.arrayContaining([
        "Who to call?",
        "Why does the lead matter?",
        "What is missing?",
        "What is blocked?",
        "What needs review?",
      ]),
    );
  });

  it("requires seller context to be explainable and operator-visible", () => {
    const result = getOperationalReadinessCheck();
    const lane = result.readinessLanes.find((item) => item.lane === "seller_context_visibility");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "seller notes visibility",
        "seller replies visibility",
        "timeline visibility",
        "AI VA summary review visibility",
        "explainable seller context",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/explainable and operator-visible/i);
  });

  it("allows imported and property-first leads to be reviewed manually but not contacted automatically", () => {
    const result = getOperationalReadinessCheck();
    const lane = result.readinessLanes.find((item) => item.lane === "imported_property_first_lead_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "imported lead readiness",
        "property-first cleanup visibility",
        "manual import review continuity",
        "source-labeled record review",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot trigger outreach/i);
    expect(result.flags.readinessTriggersOutreach).toBe(false);
    expect(result.flags.readinessTriggersContact).toBe(false);
  });

  it("allows missing-contact leads to be worked manually but not skip-traced contacted or automated", () => {
    const result = getOperationalReadinessCheck();
    const lane = result.readinessLanes.find((item) => item.lane === "missing_contact_manual_work");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "missing phone/email visibility",
        "manual contact cleanup need",
        "no skip tracing authorization",
        "no automated contact enrichment",
      ]),
    );
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.readinessTriggersContact).toBe(false);
    expect(result.flags.crmAutomationEnabled).toBe(false);
  });

  it("keeps approval and AI VA summaries as review inputs only", () => {
    const result = getOperationalReadinessCheck();
    const lane = result.readinessLanes.find((item) => item.lane === "communication_readiness_clarity");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "human approval review input",
        "AI VA recommendation as review input",
        "provider-blocked status",
        "execution-blocked status",
      ]),
    );
    expect(result.flags.readinessGrantsApprovalExecution).toBe(false);
    expect(result.flags.readinessActivatesProviders).toBe(false);
  });

  it("defines the future A1.4 source quality return gate metrics", () => {
    const result = getOperationalReadinessCheck();

    expect(result.futureAcquisitionReturnGate.purpose).toMatch(/without increasing spend/i);
    expect(result.futureAcquisitionReturnGate.allowedFutureMetrics).toEqual(
      expect.arrayContaining([
        "cleanup burden",
        "property-first rate",
        "duplicate rate",
        "source confidence",
        "review-ready rate",
        "missing-data rate",
        "operator friction",
        "review completion rate",
        "source-level readiness quality",
        "acquisition usability",
      ]),
    );
  });

  it("classifies readiness findings by implementation priority and scope", () => {
    const result = getOperationalReadinessCheck();
    const categories = result.findings.map((finding) => finding.category);

    expect(categories).toEqual(
      expect.arrayContaining([
        "required_before_implementation",
        "safe_to_include_now",
        "future_upgrade",
        "optional_optimization",
        "out_of_scope",
      ]),
    );
    expect(result.findings.some((finding) => finding.question.includes("return to A1.4"))).toBe(true);
  });

  it("asserts invariants and summarizes the no-execution boundary", () => {
    const result = getOperationalReadinessCheck();

    expect(() => assertOperationalReadinessCheckSafe(result)).not.toThrow();
    expect(summarizeOperationalReadinessCheck(result)).toMatch(/A1\.4 Source Quality Intelligence/i);
    expect(summarizeOperationalReadinessCheck(result)).toMatch(/No providers/i);
    expect(summarizeOperationalReadinessCheck(result)).toMatch(/seller contact/i);
    expect(summarizeOperationalReadinessCheck(result)).toMatch(/acquisition execution/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getOperationalReadinessCheck(),
      flags: {
        ...operationalReadinessCheckFlags,
        providerActivated: true,
      },
    };

    expect(() => assertOperationalReadinessCheckSafe(unsafeResult)).toThrow(/cannot authorize providers/i);
  });

  it("fails invariant checks if a blocker is treated as outreach-ready", () => {
    const unsafeResult = {
      ...getOperationalReadinessCheck(),
      flags: {
        ...operationalReadinessCheckFlags,
        missingContactTreatedAsOutreachReady: true,
      },
    };

    expect(() => assertOperationalReadinessCheckSafe(unsafeResult)).toThrow(/blocker bypass/i);
  });

  it("fails invariant checks if A1.4 is allowed before operational readiness", () => {
    const unsafeResult = {
      ...getOperationalReadinessCheck(),
      flags: {
        ...operationalReadinessCheckFlags,
        a14AllowedBeforeOperationalReadiness: true,
      },
    };

    expect(() => assertOperationalReadinessCheckSafe(unsafeResult)).toThrow(/A1.4 before readiness/i);
  });

  it("fails invariant checks if readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getOperationalReadinessCheck(),
      operationalReadinessStatus: "needs_operator_review" as const,
    };

    expect(() => assertOperationalReadinessCheckSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips A1.4", () => {
    const unsafeResult = {
      ...getOperationalReadinessCheck(),
      recommendedNextExactStep: "Provider Activation Pilot" as "A1.4 Source Quality Intelligence",
    };

    expect(() => assertOperationalReadinessCheckSafe(unsafeResult)).toThrow(/A1.4 Source Quality Intelligence/i);
  });
});
