export const humanApprovalWorkflowReviewFlags = {
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
  runtimeApprovalJobsEnabled: false,
  approvalPersistenceActivated: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  hiddenApprovalEnabled: false,
  aiApprovalAuthorityEnabled: false,
  approvalGrantsExecution: false,
  campaignsEnabled: false,
  queueSystemEnabled: false,
  reminderSystemEnabled: false,
  pollingEnabled: false,
  crmAutomationEnabled: false,
  approvalBypassesDnc: false,
  approvalBypassesOptOut: false,
  approvalBypassesPropertyFirst: false,
  approvalBypassesMissingContact: false,
} as const;

export type ApprovalWorkflowReadiness =
  | "planning_only"
  | "future_review_required"
  | "blocked_until_execution_gate";

export type HumanApprovalState =
  | "not_reviewed"
  | "needs_operator_review"
  | "needs_manager_review"
  | "approved_for_manual_review"
  | "blocked_by_dnc"
  | "blocked_by_opt_out"
  | "blocked_by_missing_contact"
  | "blocked_by_property_first"
  | "blocked_by_governance"
  | "rejected_for_now";

export type HumanApprovalReviewGate =
  | "contact_completeness_review"
  | "dnc_review"
  | "opt_out_review"
  | "property_first_restriction_review"
  | "seller_context_review"
  | "ai_va_summary_review"
  | "follow_up_context_review"
  | "operator_readiness_review"
  | "manager_escalation_review"
  | "communication_readiness_review";

export type HumanApprovalFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type HumanApprovalWorkflowFinding = {
  question: string;
  category: HumanApprovalFindingCategory;
  finding: string;
};

export type HumanApprovalWorkflowReview = {
  phase: "C4 Human Approval Workflow Review";
  approvalWorkflowReadiness: ApprovalWorkflowReadiness;
  approvalStates: HumanApprovalState[];
  reviewGates: HumanApprovalReviewGate[];
  forbiddenApprovalDrift: string[];
  approvalDoctrine: string[];
  futureAuditRequirements: string[];
  findings: HumanApprovalWorkflowFinding[];
  recommendedNextExactStep: "Operational Readiness Check";
  returnToAcquisitionAfterOperationalReadiness: "A1.4 Source Quality Intelligence";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof humanApprovalWorkflowReviewFlags;
};

export const humanApprovalStates: HumanApprovalState[] = [
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
];

export const humanApprovalReviewGates: HumanApprovalReviewGate[] = [
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
];

export const forbiddenApprovalDrift = [
  "approval grants send authority",
  "approval activates providers",
  "approval starts SMS/email/calling",
  "approval triggers AI voice",
  "approval starts campaigns",
  "approval creates queues",
  "approval creates reminders",
  "approval starts polling/jobs",
  "approval moves CRM stages autonomously",
  "approval bypasses DNC/opt-out",
  "approval bypasses property-first restrictions",
  "approval bypasses missing-contact restrictions",
  "approval grants AI execution authority",
];

export const humanApprovalWorkflowFindings: HumanApprovalWorkflowFinding[] = [
  {
    question: "Can approval remain review-only?",
    category: "required_before_implementation",
    finding: "Yes. Approval states may clarify human review status but cannot send, contact, execute, route, automate, or activate providers.",
  },
  {
    question: "Can blocker visibility remain explicit?",
    category: "safe_to_include_now",
    finding: "Yes. DNC, opt-out, property-first, missing-contact, and governance blockers should stay visible in approval states and review gates.",
  },
  {
    question: "Can approval remain separate from AI VA recommendations?",
    category: "required_before_implementation",
    finding: "Yes. AI VA summaries may be reviewed by humans, but AI VA cannot approve, execute, or bypass blockers.",
  },
  {
    question: "Can audit expectations be planned without persistence?",
    category: "safe_to_include_now",
    finding: "Yes. Audit requirements can describe future reason, reviewer, blocker, timestamp, and execution-separation evidence without storing records now.",
  },
  {
    question: "Should approval persistence be implemented now?",
    category: "future_upgrade",
    finding: "No. Persistence requires later schema, retention, redaction, access control, and audit authorization.",
  },
  {
    question: "Should approval activate communication providers now?",
    category: "out_of_scope",
    finding: "No. Provider activation and communication execution require separate future gates.",
  },
  {
    question: "Can approval review improve ROI later?",
    category: "optional_optimization",
    finding: "Yes. Clear review gates can reduce operator waste and prepare a safer return to A1.4 Source Quality Intelligence.",
  },
];

export function getHumanApprovalWorkflowReview(): HumanApprovalWorkflowReview {
  const result: HumanApprovalWorkflowReview = {
    phase: "C4 Human Approval Workflow Review",
    approvalWorkflowReadiness: "planning_only",
    approvalStates: humanApprovalStates,
    reviewGates: humanApprovalReviewGates,
    forbiddenApprovalDrift,
    approvalDoctrine: [
      "Approval is review-only.",
      "Approval does not execute.",
      "Approval does not contact sellers.",
      "Approval does not activate providers.",
      "Approval does not bypass blockers.",
      "Approval remains human-supervised.",
      "Approval remains explainable.",
      "Approval remains auditable.",
      "Approval remains separate from execution.",
      "Provider activation requires a separate future gate.",
      "Communication execution requires a separate future gate.",
      "Approved for manual review means a human may continue reviewing; it does not authorize seller contact.",
    ],
    futureAuditRequirements: [
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
    ],
    findings: humanApprovalWorkflowFindings,
    recommendedNextExactStep: "Operational Readiness Check",
    returnToAcquisitionAfterOperationalReadiness: "A1.4 Source Quality Intelligence",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: humanApprovalWorkflowReviewFlags,
  };

  assertHumanApprovalWorkflowReviewSafe(result);

  return result;
}

export function assertHumanApprovalWorkflowReviewSafe(result: HumanApprovalWorkflowReview) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C4 human approval workflow review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.approvalWorkflowReadiness !== "planning_only") {
    throw new Error("C4 human approval workflow review cannot become execution-ready approval readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C4 human approval workflow review cannot authorize providers, outbound communication, calling, AI voice, autonomous seller handling, approval execution, persistence, vector storage, embeddings, hidden approval, campaigns, queues, reminders, polling, CRM automation, blocker bypass, or runtime approval jobs.");
  }

  if (result.recommendedNextExactStep !== "Operational Readiness Check") {
    throw new Error("C4 human approval workflow review must recommend Operational Readiness Check before any provider activation.");
  }

  if (result.returnToAcquisitionAfterOperationalReadiness !== "A1.4 Source Quality Intelligence") {
    throw new Error("C4 human approval workflow review must return to A1.4 Source Quality Intelligence only after operational readiness.");
  }
}

export function summarizeHumanApprovalWorkflowReview(result: HumanApprovalWorkflowReview) {
  assertHumanApprovalWorkflowReviewSafe(result);

  return `${result.phase}: ${result.approvalWorkflowReadiness}. Next step is ${result.recommendedNextExactStep}; return to acquisition with ${result.returnToAcquisitionAfterOperationalReadiness} after operational readiness. Approval is review-only and does not authorize provider activation, outbound messaging, seller contact, runtime approval execution, CRM automation, autonomous seller handling, or blocker bypass.`;
}
