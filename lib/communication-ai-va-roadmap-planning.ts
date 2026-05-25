export const communicationAiVaRoadmapPlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  communicationExecutionAllowed: false,
  providerCalled: false,
  providerActivationAllowed: false,
  outboundSmsAllowed: false,
  outboundEmailAllowed: false,
  outboundCallingAllowed: false,
  aiVoiceAgentAllowed: false,
  autoDialingAllowed: false,
  campaignActivationAllowed: false,
  automatedOutreachAllowed: false,
  autonomousNegotiationAllowed: false,
  autonomousSellerHandlingAllowed: false,
  autonomousFollowUpAllowed: false,
  communicationQueueCreated: false,
  reminderCreated: false,
  runtimeJobCreated: false,
  pollingAllowed: false,
  crmMutationAutomationAllowed: false,
  aiExecutionPermissionGranted: false,
  approvalGrantsExecution: false,
  routingAllowed: false,
  scrapingAllowed: false,
  publicRecordConnectorAllowed: false,
  mlsAccessAllowed: false,
  virtualD4DAllowed: false,
} as const;

export type CommunicationPlanningFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type CommunicationPlanningFinding = {
  question: string;
  category: CommunicationPlanningFindingCategory;
  finding: string;
};

export type CommunicationAiVaRoadmapPhaseStatus = "current" | "next" | "future_only" | "blocked_until_ready";

export type CommunicationAiVaRoadmapPhase = {
  id: string;
  title: string;
  status: CommunicationAiVaRoadmapPhaseStatus;
  roiGoal: string;
  implementationRule: string;
};

export type CommunicationAiVaRoadmapPlanning = {
  phase: "C0 Communication + AI VA Planning Gate";
  strategicPauseReason: string;
  findings: CommunicationPlanningFinding[];
  communicationRoadmapPhases: CommunicationAiVaRoadmapPhase[];
  aiVaSupportBoundaries: string[];
  communicationGovernanceBoundaries: string[];
  humanApprovalDoctrine: string[];
  communicationSafetyDoctrine: string[];
  lowCostAcquisitionRules: string[];
  revenueFirstSequencing: string[];
  recommendedNextExactStep: "C1 Communication Readiness Review";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof communicationAiVaRoadmapPlanningFlags;
};

export const communicationAiVaRoadmapPhases: CommunicationAiVaRoadmapPhase[] = [
  {
    id: "c0_communication_ai_va_planning_gate",
    title: "C0 Communication + AI VA Planning Gate",
    status: "current",
    roiGoal: "Pause acquisition expansion and define communication governance before scaling lead flow.",
    implementationRule: "Planning contracts and tests only; no providers, queues, reminders, runtime jobs, or send paths.",
  },
  {
    id: "c1_communication_readiness_review",
    title: "C1 Communication Readiness Review",
    status: "next",
    roiGoal: "Find the highest-friction seller communication and follow-up readiness gaps before provider work.",
    implementationRule: "Review existing lead/contact workflow gaps without activating providers or creating runtime systems.",
  },
  {
    id: "c2_ai_va_operator_workflow_review",
    title: "C2 AI VA Operator Workflow Review",
    status: "blocked_until_ready",
    roiGoal: "Define operator-support AI tasks that improve preparation, summaries, and prioritization.",
    implementationRule: "AI VA remains advisory and cannot contact, negotiate with, or autonomously handle sellers.",
  },
  {
    id: "c3_seller_conversation_memory_planning",
    title: "C3 Seller Conversation Memory Planning",
    status: "blocked_until_ready",
    roiGoal: "Plan safe seller conversation memory, timeline clarity, redaction, and review boundaries.",
    implementationRule: "Planning only; no new persistence, audit writing, or memory storage until separately approved.",
  },
  {
    id: "c4_human_approval_workflow_review",
    title: "C4 Human Approval Workflow Review",
    status: "blocked_until_ready",
    roiGoal: "Keep communication review human-owned while preventing approval-as-execution drift.",
    implementationRule: "Approval states may guide manual review but never activate sending, routing, jobs, or providers.",
  },
  {
    id: "c5_communication_identity_planning",
    title: "C5 Communication Identity Planning",
    status: "future_only",
    roiGoal: "Plan future phone, email, SMS identity, sender reputation, opt-out, and compliance boundaries.",
    implementationRule: "Future-only provider identity planning; no credentials, env access, or provider clients.",
  },
  {
    id: "c6_controlled_communication_infrastructure_gate",
    title: "C6 Controlled Communication Infrastructure Gate",
    status: "future_only",
    roiGoal: "Decide whether limited provider activation is safe after governance and operator review are proven.",
    implementationRule: "No activation until readiness, approval workflow, outreach discipline, and intake quality are proven.",
  },
  {
    id: "future_provider_activation_pilot",
    title: "Future Only: Provider Activation Pilot",
    status: "future_only",
    roiGoal: "Test limited human-triggered communication infrastructure only after C1-C6 are satisfied.",
    implementationRule: "Manual, approved, audited, limited-scope pilot only; no autonomous negotiation or campaigns.",
  },
];

export const communicationPlanningFindings: CommunicationPlanningFinding[] = [
  {
    question: "Can communication planning remain separate from execution?",
    category: "required_before_implementation",
    finding: "Yes, but only if contracts keep provider, runtime, queue, reminder, polling, and send-path flags false.",
  },
  {
    question: "Can AI VA assistance remain operator-support only?",
    category: "safe_to_include_now",
    finding: "Yes. AI VA planning may cover summaries, prep, prioritization, and missing-data review without seller handling.",
  },
  {
    question: "Can human approval remain mandatory?",
    category: "required_before_implementation",
    finding: "Yes. Approval must mean review readiness only and never grant permission to execute communication.",
  },
  {
    question: "Can communication governance remain fail-closed?",
    category: "required_before_implementation",
    finding: "Yes. Missing readiness, unclear approval, unsafe wording, or provider uncertainty must block activation.",
  },
  {
    question: "Can future communication systems remain explainable?",
    category: "safe_to_include_now",
    finding: "Yes. Future outputs should explain why a seller conversation needs review without sending anything.",
  },
  {
    question: "Can future communication workflows avoid spam behavior?",
    category: "required_before_implementation",
    finding: "Yes, by blocking campaigns, bulk sends, auto-dialing, autonomous follow-up, and uncontrolled outreach.",
  },
  {
    question: "Can seller communication remain human-supervised?",
    category: "required_before_implementation",
    finding: "Yes. Seller-facing communication must remain human-owned until a later approved provider pilot.",
  },
  {
    question: "Can communication sequencing stay revenue-first?",
    category: "safe_to_include_now",
    finding: "Yes. Sequence readiness, AI VA workflow, memory planning, approval review, identity planning, then activation gate.",
  },
  {
    question: "Can this remain planning-only without execution drift?",
    category: "safe_to_include_now",
    finding: "Yes. This phase adds contracts and tests only, with no routes, UI, providers, persistence, or jobs.",
  },
  {
    question: "Can low-cost acquisition continue until communication ROI is proven?",
    category: "safe_to_include_now",
    finding: "Yes. Use manual imports, public exports, spreadsheets, manual D4D, referrals, and operator research.",
  },
  {
    question: "Should provider activation start in this phase?",
    category: "out_of_scope",
    finding: "No. Provider activation is future-only and blocked until communication governance is proven.",
  },
  {
    question: "Should seller conversation memory be persisted now?",
    category: "future_upgrade",
    finding: "No. Memory shape, redaction, retention, and auditability should be planned before persistence.",
  },
  {
    question: "Should importer or CRM surfaces be redesigned now?",
    category: "out_of_scope",
    finding: "No. This phase does not redesign acquisition intake, importer, CRM, or dashboard layout.",
  },
  {
    question: "Can better default-source suggestions improve acquisition workflow?",
    category: "optional_optimization",
    finding: "Yes, but acquisition UI refinements should wait until communication readiness planning is complete.",
  },
];

export function createCommunicationAiVaRoadmapPlanning(): CommunicationAiVaRoadmapPlanning {
  return {
    phase: "C0 Communication + AI VA Planning Gate",
    strategicPauseReason:
      "Communication infrastructure, AI VA workflow, seller follow-up discipline, and operator throughput are now higher ROI than scaling paid acquisition sources.",
    findings: communicationPlanningFindings,
    communicationRoadmapPhases: communicationAiVaRoadmapPhases,
    aiVaSupportBoundaries: [
      "AI VA may prepare seller intake summaries, missing-data reviews, call prep, timeline clarity, and prioritization guidance.",
      "AI VA may not contact sellers, negotiate, send messages, make calls, schedule campaigns, or autonomously handle follow-up.",
      "AI VA outputs must remain advisory, explainable, operator-reviewed, and fail-closed.",
    ],
    communicationGovernanceBoundaries: [
      "No Twilio, email, SMS, calling, AI voice, auto-dialing, campaigns, queues, reminders, runtime jobs, polling, or provider activation.",
      "No approval-as-permission drift; human approval does not send, call, route, schedule, or mutate records automatically.",
      "No CRM mutation automation, hidden provider activation, scraping, public-record connectors, MLS access, or virtual D4D expansion.",
    ],
    humanApprovalDoctrine: [
      "Human approval is mandatory before any future seller-facing communication.",
      "Approval is a review checkpoint, not an execution grant.",
      "Unclear approval, missing compliance context, or unsafe seller-contact state blocks future communication.",
    ],
    communicationSafetyDoctrine: [
      "Seller communication must avoid spam behavior, bulk outreach, autonomous negotiation, and AI-only seller handling.",
      "Future communication must preserve sender identity, opt-out review, explainability, and operator control.",
      "Any future provider pilot must be limited, human-triggered, auditable, and separately approved.",
    ],
    lowCostAcquisitionRules: [
      "Continue public legal exports, county/tax/assessor lists, spreadsheets, manual imports, manual D4D, referrals, networking, and operator research.",
      "Do not scale PropStream, DealMachine, public-record connectors, virtual D4D, territory scoring, or advanced acquisition AI until communication ROI is proven.",
      "Property-first imports remain useful only when operators can manage cleanup and communication discipline safely.",
    ],
    revenueFirstSequencing: [
      "Stabilize communication readiness before buying or generating more lead volume.",
      "Plan AI VA operator support before seller-facing communication infrastructure.",
      "Prove approval workflow and outreach discipline before provider activation.",
    ],
    recommendedNextExactStep: "C1 Communication Readiness Review",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: communicationAiVaRoadmapPlanningFlags,
  };
}

export function assertCommunicationAiVaRoadmapPlanningInvariants(result: CommunicationAiVaRoadmapPlanning) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!flags.readOnly || !flags.advisoryOnly || !flags.planningOnly) {
    throw new Error("Communication AI VA roadmap planning must remain read-only, advisory-only, and planning-only.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Communication AI VA roadmap planning cannot authorize execution, providers, outreach, automation, jobs, polling, routing, scraping, or AI-only seller handling.");
  }

  if (result.recommendedNextExactStep !== "C1 Communication Readiness Review") {
    throw new Error("Communication AI VA roadmap planning must recommend readiness review before provider activation.");
  }
}

export function summarizeCommunicationAiVaRoadmapPlanning(result: CommunicationAiVaRoadmapPlanning) {
  assertCommunicationAiVaRoadmapPlanningInvariants(result);

  return `${result.phase}: ${result.strategicPauseReason} Next step is ${result.recommendedNextExactStep}. No provider activation, outbound communication, automation, runtime job, queue, reminder, autonomous negotiation, AI-only seller handling, scraping, or communication execution is authorized.`;
}
