import {
  assertHumanApprovalWorkflowReviewSafe,
  getHumanApprovalWorkflowReview,
  humanApprovalWorkflowReviewFlags,
  summarizeHumanApprovalWorkflowReview,
} from "./human-approval-workflow-review";

describe("human approval workflow review", () => {
  it("creates a planning-only C4 approval workflow contract", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.phase).toBe("C4 Human Approval Workflow Review");
    expect(result.approvalWorkflowReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("Operational Readiness Check");
    expect(result.returnToAcquisitionAfterOperationalReadiness).toBe("A1.4 Source Quality Intelligence");
  });

  it("defines all required approval states without execution authority", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.approvalStates).toEqual(
      expect.arrayContaining([
        "not_reviewed",
        "needs_operator_review",
        "needs_manager_review",
        "approved_for_manual_review",
        "blocked_by_dnc",
        "blocked_by_opt_out",
        "blocked_by_missing_contact",
        "blocked_by_property_first",
        "blocked_by_governance",
        "rejected_for_now",
      ]),
    );
    expect(result.approvalDoctrine.join(" ")).toMatch(/does not authorize seller contact/i);
  });

  it("defines all required review gates", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.reviewGates).toEqual(
      expect.arrayContaining([
        "contact_completeness_review",
        "dnc_review",
        "opt_out_review",
        "property_first_restriction_review",
        "seller_context_review",
        "ai_va_summary_review",
        "follow_up_context_review",
        "operator_readiness_review",
        "manager_escalation_review",
        "communication_readiness_review",
      ]),
    );
  });

  it("keeps all provider outbound runtime persistence vector embedding and hidden approval flags false", () => {
    const flags = getHumanApprovalWorkflowReview().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.planningOnly).toBe(true);
    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.runtimeApprovalJobsEnabled).toBe(false);
    expect(flags.approvalPersistenceActivated).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.hiddenApprovalEnabled).toBe(false);
  });

  it("keeps AI approval authority and approval execution false", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.flags.aiApprovalAuthorityEnabled).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.approvalDoctrine.join(" ")).toMatch(/Approval does not execute/i);
    expect(result.approvalDoctrine.join(" ")).toMatch(/Provider activation requires a separate future gate/i);
    expect(result.approvalDoctrine.join(" ")).toMatch(/Communication execution requires a separate future gate/i);
  });

  it("forbids approval drift into send contact provider campaign queue reminder job CRM or AI authority", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.forbiddenApprovalDrift).toEqual(
      expect.arrayContaining([
        "approval grants send authority",
        "approval activates providers",
        "approval starts SMS/email/calling",
        "approval triggers AI voice",
        "approval starts campaigns",
        "approval creates queues",
        "approval creates reminders",
        "approval starts polling/jobs",
        "approval moves CRM stages autonomously",
        "approval grants AI execution authority",
      ]),
    );
  });

  it("proves DNC opt-out property-first and missing-contact blockers cannot be bypassed", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.flags.approvalBypassesDnc).toBe(false);
    expect(result.flags.approvalBypassesOptOut).toBe(false);
    expect(result.flags.approvalBypassesPropertyFirst).toBe(false);
    expect(result.flags.approvalBypassesMissingContact).toBe(false);
    expect(result.forbiddenApprovalDrift).toEqual(
      expect.arrayContaining([
        "approval bypasses DNC/opt-out",
        "approval bypasses property-first restrictions",
        "approval bypasses missing-contact restrictions",
      ]),
    );
  });

  it("keeps autonomous negotiation seller handling and follow-up forbidden", () => {
    const flags = getHumanApprovalWorkflowReview().flags;

    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
  });

  it("keeps campaigns queues reminders polling and CRM automation false", () => {
    const flags = getHumanApprovalWorkflowReview().flags;

    expect(flags.campaignsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
  });

  it("requires future approval audit visibility and execution separation evidence", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(result.futureAuditRequirements).toEqual(
      expect.arrayContaining([
        "approval reason visibility",
        "reviewer visibility",
        "blocker visibility",
        "DNC/opt-out audit visibility",
        "property-first restriction visibility",
        "missing-contact visibility",
        "AI VA recommendation visibility",
        "approval timestamp planning",
        "future audit trail planning",
        "execution separation evidence",
      ]),
    );
  });

  it("classifies findings by implementation priority and scope", () => {
    const result = getHumanApprovalWorkflowReview();
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
    expect(result.findings.some((finding) => finding.question.includes("review-only"))).toBe(true);
  });

  it("asserts invariants and summarizes the no-execution boundary", () => {
    const result = getHumanApprovalWorkflowReview();

    expect(() => assertHumanApprovalWorkflowReviewSafe(result)).not.toThrow();
    expect(summarizeHumanApprovalWorkflowReview(result)).toMatch(/review-only/i);
    expect(summarizeHumanApprovalWorkflowReview(result)).toMatch(/Operational Readiness Check/i);
    expect(summarizeHumanApprovalWorkflowReview(result)).toMatch(/A1\.4 Source Quality Intelligence/i);
    expect(summarizeHumanApprovalWorkflowReview(result)).toMatch(/does not authorize provider activation/i);
    expect(summarizeHumanApprovalWorkflowReview(result)).toMatch(/blocker bypass/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getHumanApprovalWorkflowReview(),
      flags: {
        ...humanApprovalWorkflowReviewFlags,
        providerActivated: true,
      },
    };

    expect(() => assertHumanApprovalWorkflowReviewSafe(unsafeResult)).toThrow(/cannot authorize providers/i);
  });

  it("fails invariant checks if approval bypasses a blocker", () => {
    const unsafeResult = {
      ...getHumanApprovalWorkflowReview(),
      flags: {
        ...humanApprovalWorkflowReviewFlags,
        approvalBypassesDnc: true,
      },
    };

    expect(() => assertHumanApprovalWorkflowReviewSafe(unsafeResult)).toThrow(/blocker bypass/i);
  });

  it("fails invariant checks if readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getHumanApprovalWorkflowReview(),
      approvalWorkflowReadiness: "future_review_required" as const,
    };

    expect(() => assertHumanApprovalWorkflowReviewSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips operational readiness", () => {
    const unsafeResult = {
      ...getHumanApprovalWorkflowReview(),
      recommendedNextExactStep: "Provider Activation Pilot" as "Operational Readiness Check",
    };

    expect(() => assertHumanApprovalWorkflowReviewSafe(unsafeResult)).toThrow(/Operational Readiness Check/i);
  });
});
