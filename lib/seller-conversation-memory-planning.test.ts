import {
  assertSellerConversationMemoryPlanningInvariants,
  createSellerConversationMemoryPlanning,
  sellerConversationMemoryPlanningFlags,
  summarizeSellerConversationMemoryPlanning,
} from "./seller-conversation-memory-planning";

describe("seller conversation memory planning", () => {
  it("creates a planning-only seller conversation memory contract", () => {
    const result = createSellerConversationMemoryPlanning();

    expect(result.phase).toBe("C3 Seller Conversation Memory Planning");
    expect(result.conversationMemoryReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("C2 AI VA Operator Workflow Review");
    expect(result.memoryLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "allowed_future_memory",
        "forbidden_memory",
        "redaction_requirements",
        "future_audit_requirements",
      ]),
    );
  });

  it("keeps every required provider outbound runtime persistence and automation flag false", () => {
    const flags = createSellerConversationMemoryPlanning().flags;

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
    expect(flags.runtimeMemoryJobsEnabled).toBe(false);
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
  });

  it("defines allowed future memory without activating persistence or runtime memory jobs", () => {
    const result = createSellerConversationMemoryPlanning();
    const allowedLane = result.memoryLanes.find((lane) => lane.lane === "allowed_future_memory");

    expect(allowedLane?.items).toEqual(
      expect.arrayContaining([
        "seller timeline summaries",
        "operator notes",
        "follow-up history",
        "seller preference summaries",
        "approval-reviewed conversation summaries",
        "communication status visibility",
        "AI VA prep summaries",
      ]),
    );
    expect(result.flags.memoryPersistenceActivated).toBe(false);
    expect(result.flags.runtimeMemoryJobsEnabled).toBe(false);
  });

  it("forbids hidden memory covert profiling autonomous persuasion vector storage and embeddings", () => {
    const result = createSellerConversationMemoryPlanning();
    const forbiddenLane = result.memoryLanes.find((lane) => lane.lane === "forbidden_memory");

    expect(forbiddenLane?.items).toEqual(
      expect.arrayContaining([
        "hidden memory",
        "undeclared persistence",
        "autonomous persuasion memory",
        "emotional manipulation tracking",
        "biometric/surveillance memory",
        "AI-only seller memory",
        "autonomous negotiation profiles",
        "covert behavior scoring",
      ]),
    );
    expect(result.flags.hiddenMemoryEnabled).toBe(false);
    expect(result.flags.vectorDatabaseEnabled).toBe(false);
    expect(result.flags.embeddingsEnabled).toBe(false);
  });

  it("keeps communication human-supervised and AI VA operator-assist only", () => {
    const result = createSellerConversationMemoryPlanning();

    expect(result.memorySafetyDoctrine.join(" ")).toMatch(/human-supervised/i);
    expect(result.memorySafetyDoctrine.join(" ")).toMatch(/operator-assist only/i);
    expect(result.aiVaMayAssistWith).toEqual(
      expect.arrayContaining([
        "seller timeline summaries",
        "operator preparation",
        "missing-data visibility",
        "communication recap",
        "follow-up review suggestions",
        "seller status summaries",
        "operator prioritization",
      ]),
    );
  });

  it("blocks AI VA autonomous seller handling negotiation persuasion provider activation CRM movement and campaigns", () => {
    const result = createSellerConversationMemoryPlanning();

    expect(result.aiVaMustNever).toEqual(
      expect.arrayContaining([
        "negotiate autonomously",
        "persuade autonomously",
        "contact sellers autonomously",
        "create hidden seller profiles",
        "bypass approval",
        "activate providers",
        "move CRM stages autonomously",
        "generate campaigns autonomously",
      ]),
    );
    expect(result.flags.autonomousNegotiationEnabled).toBe(false);
    expect(result.flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(result.flags.crmAutomationEnabled).toBe(false);
    expect(result.flags.campaignsEnabled).toBe(false);
  });

  it("keeps approval separate from execution", () => {
    const result = createSellerConversationMemoryPlanning();

    expect(result.humanApprovalDoctrine.join(" ")).toMatch(/Approval never grants execution/i);
    expect(result.humanApprovalDoctrine.join(" ")).toMatch(/never activates providers/i);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.aiApprovalAuthorityEnabled).toBe(false);
  });

  it("requires opt-out DNC redaction retention review explainability auditability and operator visibility", () => {
    const result = createSellerConversationMemoryPlanning();
    const redactionLane = result.memoryLanes.find((lane) => lane.lane === "redaction_requirements");
    const auditLane = result.memoryLanes.find((lane) => lane.lane === "future_audit_requirements");

    expect(redactionLane?.items).toEqual(
      expect.arrayContaining([
        "opt-out visibility",
        "DNC visibility",
        "sensitive-content handling",
        "manual review requirements",
        "future retention review",
        "approval review before memory use",
      ]),
    );
    expect(auditLane?.items).toEqual(
      expect.arrayContaining([
        "explainable memory usage",
        "reviewable summaries",
        "operator visibility",
        "approval checkpoints",
        "future auditability requirements",
      ]),
    );
  });

  it("classifies safety findings by implementation priority and scope", () => {
    const result = createSellerConversationMemoryPlanning();
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
    expect(result.findings.some((finding) => finding.question.includes("covert profiling"))).toBe(true);
  });

  it("keeps low-cost acquisition continuation explicit until communication maturity improves", () => {
    const result = createSellerConversationMemoryPlanning();

    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/public legal exports/i);
    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/county\/tax\/assessor lists/i);
    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/property-first imports/i);
    expect(result.lowCostAcquisitionContinuationRules.join(" ")).toMatch(/AI VA operator workflow mature/i);
  });

  it("asserts invariants and summarizes the no-execution boundary", () => {
    const result = createSellerConversationMemoryPlanning();

    expect(() => assertSellerConversationMemoryPlanningInvariants(result)).not.toThrow();
    expect(summarizeSellerConversationMemoryPlanning(result)).toMatch(/No provider activation/i);
    expect(summarizeSellerConversationMemoryPlanning(result)).toMatch(/runtime memory job/i);
    expect(summarizeSellerConversationMemoryPlanning(result)).toMatch(/C2 AI VA Operator Workflow Review/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...createSellerConversationMemoryPlanning(),
      flags: {
        ...sellerConversationMemoryPlanningFlags,
        hiddenMemoryEnabled: true,
      },
    };

    expect(() => assertSellerConversationMemoryPlanningInvariants(unsafeResult)).toThrow(/cannot authorize providers/i);
  });

  it("fails invariant checks if memory readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...createSellerConversationMemoryPlanning(),
      conversationMemoryReadiness: "future_review_required" as const,
    };

    expect(() => assertSellerConversationMemoryPlanningInvariants(unsafeResult)).toThrow(/cannot become runtime memory readiness/i);
  });
});
