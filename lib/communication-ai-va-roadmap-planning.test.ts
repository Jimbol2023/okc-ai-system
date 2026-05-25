import {
  assertCommunicationAiVaRoadmapPlanningInvariants,
  communicationAiVaRoadmapPlanningFlags,
  createCommunicationAiVaRoadmapPlanning,
  summarizeCommunicationAiVaRoadmapPlanning,
} from "./communication-ai-va-roadmap-planning";

describe("communication AI VA roadmap planning", () => {
  it("creates a planning-only communication roadmap with readiness review as the next step", () => {
    const result = createCommunicationAiVaRoadmapPlanning();

    expect(result.phase).toBe("C0 Communication + AI VA Planning Gate");
    expect(result.recommendedNextExactStep).toBe("C1 Communication Readiness Review");
    expect(result.communicationRoadmapPhases.map((phase) => phase.id)).toEqual(
      expect.arrayContaining([
        "c0_communication_ai_va_planning_gate",
        "c1_communication_readiness_review",
        "c2_ai_va_operator_workflow_review",
        "c3_seller_conversation_memory_planning",
        "c4_human_approval_workflow_review",
        "c5_communication_identity_planning",
        "c6_controlled_communication_infrastructure_gate",
        "future_provider_activation_pilot",
      ]),
    );
  });

  it("keeps every execution provider outbound automation runtime and seller-handling flag blocked", () => {
    const flags = createCommunicationAiVaRoadmapPlanning().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.planningOnly).toBe(true);
    expect(flags.communicationExecutionAllowed).toBe(false);
    expect(flags.providerCalled).toBe(false);
    expect(flags.providerActivationAllowed).toBe(false);
    expect(flags.outboundSmsAllowed).toBe(false);
    expect(flags.outboundEmailAllowed).toBe(false);
    expect(flags.outboundCallingAllowed).toBe(false);
    expect(flags.aiVoiceAgentAllowed).toBe(false);
    expect(flags.autoDialingAllowed).toBe(false);
    expect(flags.campaignActivationAllowed).toBe(false);
    expect(flags.automatedOutreachAllowed).toBe(false);
    expect(flags.autonomousNegotiationAllowed).toBe(false);
    expect(flags.autonomousSellerHandlingAllowed).toBe(false);
    expect(flags.autonomousFollowUpAllowed).toBe(false);
    expect(flags.communicationQueueCreated).toBe(false);
    expect(flags.reminderCreated).toBe(false);
    expect(flags.runtimeJobCreated).toBe(false);
    expect(flags.pollingAllowed).toBe(false);
    expect(flags.crmMutationAutomationAllowed).toBe(false);
    expect(flags.aiExecutionPermissionGranted).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.routingAllowed).toBe(false);
    expect(flags.scrapingAllowed).toBe(false);
    expect(flags.publicRecordConnectorAllowed).toBe(false);
    expect(flags.mlsAccessAllowed).toBe(false);
    expect(flags.virtualD4DAllowed).toBe(false);
  });

  it("keeps approval as review only and never as permission to execute", () => {
    const result = createCommunicationAiVaRoadmapPlanning();

    expect(result.humanApprovalDoctrine.join(" ")).toMatch(/not an execution grant/i);
    expect(result.communicationGovernanceBoundaries.join(" ")).toMatch(/No approval-as-permission drift/i);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("keeps low-cost acquisition as the default until communication ROI is proven", () => {
    const result = createCommunicationAiVaRoadmapPlanning();

    expect(result.lowCostAcquisitionRules.join(" ")).toMatch(/manual imports/i);
    expect(result.lowCostAcquisitionRules.join(" ")).toMatch(/communication ROI is proven/i);
    expect(result.lowCostAcquisitionRules.join(" ")).toMatch(/Do not scale PropStream/i);
  });

  it("classifies planning findings by implementation priority and scope", () => {
    const result = createCommunicationAiVaRoadmapPlanning();
    const categories = result.findings.map((finding) => finding.category);

    expect(categories).toEqual(expect.arrayContaining(["required_before_implementation", "safe_to_include_now", "future_upgrade", "optional_optimization", "out_of_scope"]));
    expect(result.findings.some((finding) => finding.finding.includes("provider activation is future-only"))).toBe(true);
  });

  it("asserts invariants and summarizes the no-execution boundary", () => {
    const result = createCommunicationAiVaRoadmapPlanning();

    expect(() => assertCommunicationAiVaRoadmapPlanningInvariants(result)).not.toThrow();
    expect(summarizeCommunicationAiVaRoadmapPlanning(result)).toMatch(/No provider activation/i);
    expect(summarizeCommunicationAiVaRoadmapPlanning(result)).toMatch(/C1 Communication Readiness Review/i);
  });

  it("would fail invariant checks if any blocked flag drifted true", () => {
    const unsafeResult = {
      ...createCommunicationAiVaRoadmapPlanning(),
      flags: {
        ...communicationAiVaRoadmapPlanningFlags,
        providerActivationAllowed: true,
      },
    };

    expect(() => assertCommunicationAiVaRoadmapPlanningInvariants(unsafeResult)).toThrow(/cannot authorize execution/i);
  });
});
