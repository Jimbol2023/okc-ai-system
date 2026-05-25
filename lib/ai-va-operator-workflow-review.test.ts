import {
  aiVaOperatorWorkflowReviewFlags,
  assertAiVaOperatorWorkflowReviewInvariants,
  createAiVaOperatorWorkflowReview,
  summarizeAiVaOperatorWorkflowReview,
} from "./ai-va-operator-workflow-review";

describe("AI VA operator workflow review", () => {
  it("creates a planning-only C2 operator-assist workflow contract", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(result.phase).toBe("C2 AI VA Operator Workflow Review");
    expect(result.aiVaOperatorWorkflowReadiness).toBe("operator_assist_planning_only");
    expect(result.recommendedNextExactStep).toBe("C4 Human Approval Workflow Review");
    expect(result.workflowLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "operator_prep_support",
        "seller_context_summarization",
        "follow_up_review_assistance",
        "operator_prioritization",
        "forbidden_ai_va_actions",
        "approval_and_audit_boundaries",
      ]),
    );
  });

  it("keeps every provider outbound runtime persistence automation and AI-only handling flag false", () => {
    const flags = createAiVaOperatorWorkflowReview().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.planningOnly).toBe(true);
    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.runtimeWorkflowJobsEnabled).toBe(false);
    expect(flags.memoryPersistenceActivated).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.hiddenMemoryEnabled).toBe(false);
    expect(flags.aiApprovalAuthorityEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.campaignsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.outboundSendPathCreated).toBe(false);
    expect(flags.aiOnlySellerHandlingAllowed).toBe(false);
  });

  it("allows only operator preparation summaries missing-data visibility recaps and prioritization", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(result.aiVaAllowedSupport).toEqual(
      expect.arrayContaining([
        "operator preparation summaries",
        "seller context summarization",
        "missing-data visibility",
        "communication recap",
        "follow-up review suggestions",
        "seller status summaries",
        "operator prioritization",
      ]),
    );
    expect(result.operatorAssistDoctrine.join(" ")).toMatch(/operator-assist only/i);
    expect(result.operatorAssistDoctrine.join(" ")).toMatch(/human-supervised/i);
  });

  it("blocks AI VA negotiation persuasion seller contact provider activation CRM movement campaigns and autonomous follow-up", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(result.aiVaForbiddenActions).toEqual(
      expect.arrayContaining([
        "negotiate autonomously",
        "persuade autonomously",
        "contact sellers autonomously",
        "send SMS or email",
        "make calls or use AI voice",
        "activate providers",
        "create campaigns",
        "create hidden seller profiles",
        "move CRM stages autonomously",
        "schedule follow-up autonomously",
      ]),
    );
    expect(result.flags.autonomousNegotiationEnabled).toBe(false);
    expect(result.flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(result.flags.autonomousFollowUpEnabled).toBe(false);
    expect(result.flags.crmAutomationEnabled).toBe(false);
  });

  it("defines follow-up review assistance without queues reminders runtime jobs or send paths", () => {
    const result = createAiVaOperatorWorkflowReview();
    const followUpLane = result.workflowLanes.find((lane) => lane.lane === "follow_up_review_assistance");

    expect(followUpLane?.items).toEqual(
      expect.arrayContaining([
        "follow-up review suggestions",
        "stale-context visibility",
        "manual next-step checklist",
        "operator-owned callback notes",
      ]),
    );
    expect(followUpLane?.governanceRule).toMatch(/must not schedule, send, queue, remind, or automate contact/i);
    expect(result.flags.queueSystemEnabled).toBe(false);
    expect(result.flags.reminderSystemEnabled).toBe(false);
    expect(result.flags.runtimeWorkflowJobsEnabled).toBe(false);
    expect(result.flags.outboundSendPathCreated).toBe(false);
  });

  it("keeps seller context summaries explainable reviewable and free from hidden profiling", () => {
    const result = createAiVaOperatorWorkflowReview();
    const summaryLane = result.workflowLanes.find((lane) => lane.lane === "seller_context_summarization");

    expect(summaryLane?.items).toEqual(
      expect.arrayContaining([
        "conversation recap",
        "seller status summary",
        "known preference summary",
        "approval-reviewed context summary",
        "communication blocker summary",
      ]),
    );
    expect(summaryLane?.governanceRule).toMatch(/without hidden seller profiling/i);
    expect(result.flags.hiddenMemoryEnabled).toBe(false);
  });

  it("keeps approval as review only and separate from execution", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(result.humanApprovalDoctrine.join(" ")).toMatch(/never an execution grant/i);
    expect(result.humanApprovalDoctrine.join(" ")).toMatch(/AI VA cannot approve its own recommendations/i);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.aiApprovalAuthorityEnabled).toBe(false);
  });

  it("preserves DNC opt-out visibility and blocks manipulation hidden memory and undeclared retention", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(result.sellerSafetyDoctrine.join(" ")).toMatch(/DNC and opt-out visibility/i);
    expect(result.sellerSafetyDoctrine.join(" ")).toMatch(/avoid manipulation/i);
    expect(result.sellerSafetyDoctrine.join(" ")).toMatch(/No hidden seller memory/i);
    expect(result.sellerSafetyDoctrine.join(" ")).toMatch(/undeclared retention/i);
  });

  it("classifies findings by implementation priority and scope", () => {
    const result = createAiVaOperatorWorkflowReview();
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
    expect(result.findings.some((finding) => finding.question.includes("operator-assist"))).toBe(true);
  });

  it("keeps low-cost acquisition continuation explicit until communication maturity improves", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/public legal exports/i);
    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/county\/tax\/assessor lists/i);
    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/property-first records blocked from outreach/i);
  });

  it("asserts invariants and summarizes the no-execution boundary", () => {
    const result = createAiVaOperatorWorkflowReview();

    expect(() => assertAiVaOperatorWorkflowReviewInvariants(result)).not.toThrow();
    expect(summarizeAiVaOperatorWorkflowReview(result)).toMatch(/operator-assist only/i);
    expect(summarizeAiVaOperatorWorkflowReview(result)).toMatch(/No provider activation/i);
    expect(summarizeAiVaOperatorWorkflowReview(result)).toMatch(/C4 Human Approval Workflow Review/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...createAiVaOperatorWorkflowReview(),
      flags: {
        ...aiVaOperatorWorkflowReviewFlags,
        providerActivated: true,
      },
    };

    expect(() => assertAiVaOperatorWorkflowReviewInvariants(unsafeResult)).toThrow(/cannot authorize providers/i);
  });

  it("fails invariant checks if workflow readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...createAiVaOperatorWorkflowReview(),
      aiVaOperatorWorkflowReadiness: "future_review_required" as const,
    };

    expect(() => assertAiVaOperatorWorkflowReviewInvariants(unsafeResult)).toThrow(/cannot become runtime workflow readiness/i);
  });
});
