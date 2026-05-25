export const aiVaOperatorWorkflowReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  autonomousNegotiationEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousFollowUpEnabled: false,
  runtimeWorkflowJobsEnabled: false,
  memoryPersistenceActivated: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  hiddenMemoryEnabled: false,
  aiApprovalAuthorityEnabled: false,
  approvalGrantsExecution: false,
  campaignsEnabled: false,
  queueSystemEnabled: false,
  reminderSystemEnabled: false,
  pollingEnabled: false,
  crmAutomationEnabled: false,
  providerClientCreated: false,
  providerEnvRead: false,
  outboundSendPathCreated: false,
  aiOnlySellerHandlingAllowed: false,
} as const;

export type AiVaOperatorWorkflowReadiness =
  | "operator_assist_planning_only"
  | "future_review_required"
  | "blocked_until_approval";

export type AiVaOperatorWorkflowFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type AiVaOperatorWorkflowFinding = {
  question: string;
  category: AiVaOperatorWorkflowFindingCategory;
  finding: string;
};

export type AiVaOperatorWorkflowLaneKey =
  | "operator_prep_support"
  | "seller_context_summarization"
  | "follow_up_review_assistance"
  | "operator_prioritization"
  | "forbidden_ai_va_actions"
  | "approval_and_audit_boundaries";

export type AiVaOperatorWorkflowLane = {
  lane: AiVaOperatorWorkflowLaneKey;
  items: string[];
  governanceRule: string;
};

export type AiVaOperatorWorkflowReview = {
  phase: "C2 AI VA Operator Workflow Review";
  aiVaOperatorWorkflowReadiness: AiVaOperatorWorkflowReadiness;
  workflowLanes: AiVaOperatorWorkflowLane[];
  findings: AiVaOperatorWorkflowFinding[];
  operatorAssistDoctrine: string[];
  aiVaAllowedSupport: string[];
  aiVaForbiddenActions: string[];
  humanApprovalDoctrine: string[];
  sellerSafetyDoctrine: string[];
  lowCostAcquisitionContinuationRules: string[];
  recommendedNextExactStep: "C4 Human Approval Workflow Review";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof aiVaOperatorWorkflowReviewFlags;
};

export const aiVaOperatorWorkflowFindings: AiVaOperatorWorkflowFinding[] = [
  {
    question: "Can AI VA remain operator-assist only?",
    category: "required_before_implementation",
    finding: "Yes, if AI VA outputs are limited to preparation, summaries, review suggestions, and prioritization without seller-facing authority.",
  },
  {
    question: "Can operator prep improve ROI without provider activation?",
    category: "safe_to_include_now",
    finding: "Yes. Prep summaries, missing-data visibility, and seller status clarity can reduce operator friction while keeping outreach manual.",
  },
  {
    question: "Can follow-up review assistance avoid autonomous follow-up drift?",
    category: "required_before_implementation",
    finding: "Yes. AI VA may flag review needs or suggested next-review topics but cannot schedule, send, queue, remind, or contact sellers.",
  },
  {
    question: "Can seller context summaries avoid covert profiling?",
    category: "required_before_implementation",
    finding: "Yes. Summaries must stay explainable, operator-visible, non-manipulative, and based only on declared review context.",
  },
  {
    question: "Can approval remain separate from AI VA recommendations?",
    category: "required_before_implementation",
    finding: "Yes. AI VA recommendations are advisory only and never grant execution, provider activation, CRM mutation, or communication authority.",
  },
  {
    question: "Can this review stay governance-only without runtime workflow drift?",
    category: "safe_to_include_now",
    finding: "Yes. This phase adds deterministic contracts and tests only, with no UI, routes, providers, persistence, jobs, queues, or reminders.",
  },
  {
    question: "Should AI VA operate as a seller-facing assistant now?",
    category: "out_of_scope",
    finding: "No. Seller-facing AI, voice, SMS, email, calls, campaigns, and autonomous seller handling remain forbidden.",
  },
  {
    question: "Should AI VA workflow outputs be persisted now?",
    category: "future_upgrade",
    finding: "No. Persistence requires later retention, redaction, audit, access-control, and approval review.",
  },
  {
    question: "Can prioritization become smarter later?",
    category: "optional_optimization",
    finding: "Yes. Future ranking can improve operator focus after fairness, explainability, source quality, and approval boundaries are reviewed.",
  },
];

export const aiVaOperatorWorkflowLanes: AiVaOperatorWorkflowLane[] = [
  {
    lane: "operator_prep_support",
    items: [
      "seller timeline prep",
      "missing-data review",
      "property context checklist",
      "source visibility",
      "DNC and opt-out visibility",
      "operator question prompts",
    ],
    governanceRule: "Prep support is advisory only and must help the operator review facts without creating seller-facing communication.",
  },
  {
    lane: "seller_context_summarization",
    items: [
      "conversation recap",
      "seller status summary",
      "known preference summary",
      "approval-reviewed context summary",
      "communication blocker summary",
    ],
    governanceRule: "Context summaries must be explainable, reviewable, and based on declared information without hidden seller profiling.",
  },
  {
    lane: "follow_up_review_assistance",
    items: [
      "follow-up review suggestions",
      "stale-context visibility",
      "manual next-step checklist",
      "operator-owned callback notes",
    ],
    governanceRule: "Follow-up assistance may suggest review topics but must not schedule, send, queue, remind, or automate contact.",
  },
  {
    lane: "operator_prioritization",
    items: [
      "manual review priority hints",
      "missing-contact prioritization",
      "blocked-outreach visibility",
      "high-friction lead visibility",
      "property-first cleanup visibility",
    ],
    governanceRule: "Prioritization is an operator aid only and must not move CRM stages, route work automatically, or trigger communication.",
  },
  {
    lane: "forbidden_ai_va_actions",
    items: [
      "autonomous seller contact",
      "autonomous negotiation",
      "autonomous persuasion",
      "AI voice calling",
      "SMS or email sending",
      "campaign generation",
      "provider activation",
      "hidden seller profiling",
      "CRM stage movement",
    ],
    governanceRule: "Forbidden AI VA actions remain blocked regardless of approval wording or recommendation confidence.",
  },
  {
    lane: "approval_and_audit_boundaries",
    items: [
      "human review checkpoint",
      "approval separate from execution",
      "operator-visible rationale",
      "explainable suggestion basis",
      "future audit review before persistence",
    ],
    governanceRule: "Approval and audit boundaries must be visible before future workflow activation and never imply execution authority.",
  },
];

export function createAiVaOperatorWorkflowReview(): AiVaOperatorWorkflowReview {
  const result: AiVaOperatorWorkflowReview = {
    phase: "C2 AI VA Operator Workflow Review",
    aiVaOperatorWorkflowReadiness: "operator_assist_planning_only",
    workflowLanes: aiVaOperatorWorkflowLanes,
    findings: aiVaOperatorWorkflowFindings,
    operatorAssistDoctrine: [
      "AI VA remains operator-assist only.",
      "AI VA may help operators prepare, summarize, review missing data, recap context, and prioritize manual review.",
      "AI VA must not communicate with sellers or impersonate an operator.",
      "AI VA outputs must be explainable, reviewable, and human-supervised.",
      "AI VA recommendations must not become CRM automation, provider activation, or outreach execution.",
    ],
    aiVaAllowedSupport: [
      "operator preparation summaries",
      "seller context summarization",
      "missing-data visibility",
      "communication recap",
      "follow-up review suggestions",
      "seller status summaries",
      "operator prioritization",
    ],
    aiVaForbiddenActions: [
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
    ],
    humanApprovalDoctrine: [
      "Human approval remains mandatory before any future seller-facing communication.",
      "Approval is a review checkpoint and never an execution grant.",
      "AI VA cannot approve its own recommendations.",
      "Approval cannot activate providers, send paths, jobs, queues, reminders, polling, or CRM automation.",
    ],
    sellerSafetyDoctrine: [
      "Seller communication remains human-supervised.",
      "DNC and opt-out visibility must remain prominent in operator prep.",
      "AI VA support must avoid manipulation, pressure tactics, and autonomous persuasion.",
      "No hidden seller memory, covert behavior scoring, or undeclared retention may enter this phase.",
    ],
    lowCostAcquisitionContinuationRules: [
      "Continue public legal exports, county/tax/assessor lists, spreadsheet imports, manual imports, referrals, manual D4D, operator research, and property-first imports.",
      "Do not activate communication providers until human approval workflows, seller communication discipline, and controlled communication infrastructure mature.",
      "Keep property-first records blocked from outreach until contact cleanup and manual review are complete.",
    ],
    recommendedNextExactStep: "C4 Human Approval Workflow Review",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: aiVaOperatorWorkflowReviewFlags,
  };

  assertAiVaOperatorWorkflowReviewInvariants(result);

  return result;
}

export function assertAiVaOperatorWorkflowReviewInvariants(result: AiVaOperatorWorkflowReview) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C2 AI VA operator workflow review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.aiVaOperatorWorkflowReadiness !== "operator_assist_planning_only") {
    throw new Error("C2 AI VA operator workflow review cannot become runtime workflow readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C2 AI VA operator workflow review cannot authorize providers, outbound communication, AI voice, autonomous seller handling, negotiation, follow-up, persistence, hidden memory, jobs, campaigns, queues, reminders, polling, CRM automation, provider clients, env reads, or approval-as-execution.");
  }

  if (result.recommendedNextExactStep !== "C4 Human Approval Workflow Review") {
    throw new Error("C2 AI VA operator workflow review must recommend human approval workflow review before provider activation.");
  }
}

export function summarizeAiVaOperatorWorkflowReview(result: AiVaOperatorWorkflowReview) {
  assertAiVaOperatorWorkflowReviewInvariants(result);

  return `${result.phase}: ${result.aiVaOperatorWorkflowReadiness}. Next step is ${result.recommendedNextExactStep}. AI VA remains operator-assist only. No provider activation, outbound SMS/email/calling, AI voice, autonomous negotiation, autonomous seller handling, autonomous follow-up, runtime workflow job, persistence, hidden memory, campaign, queue, reminder, polling, CRM automation, provider client, env read, or approval-as-execution is authorized.`;
}
