export type R52ManualRevenueWorkdayStatus =
  | "manual_revenue_workday_blocked"
  | "operator_review_required"
  | "manual_revenue_workday_ready";

export type R52OperationalizationClass =
  | "safe_manual_now"
  | "future_semi_automated_with_review"
  | "human_review_required"
  | "never_autonomous";

export type R52WorkdaySection =
  | "daily_operator_startup"
  | "lead_triage"
  | "seller_call"
  | "follow_up"
  | "buyer_review"
  | "revenue_pipeline"
  | "governance_safety"
  | "accessibility_operator_usability";

export type R52ManualRevenueWarningCode =
  | "r52f_manual_revenue_operator_workday_contract_only"
  | "input_missing"
  | "operator_review_required"
  | "system_readiness_required"
  | "governance_visibility_required"
  | "lead_queue_required"
  | "buyer_pipeline_required"
  | "revenue_pipeline_required"
  | "accessibility_review_required"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "autonomous_execution_rejected"
  | "advisory_to_permission_rejected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R52ManualRevenueOperatorWorkdayInput = {
  systemReadinessReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  highPriorityQueueReviewed?: boolean;
  overdueQueueReviewed?: boolean;
  buyerPipelineReviewed?: boolean;
  revenuePipelineReviewed?: boolean;
  accessibilityUsabilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  autonomousExecutionRequested?: boolean;
  advisoryConvertedToPermission?: boolean;
  extraOperatorNotes?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R52ManualRevenueStep = {
  order: number;
  section: R52WorkdaySection;
  title: string;
  requiredActions: string[];
  doNotProceedConditions: string[];
  output: string;
};

export type R52ManualRevenueOperationalizationItem = {
  workflow: string;
  classification: R52OperationalizationClass;
  reason: string;
};

export type R52ManualRevenueOperatorWorkdayResult = {
  workdayStatus: R52ManualRevenueWorkdayStatus;
  manualOnlyDoctrine: string;
  orderedWorkflow: R52ManualRevenueStep[];
  doNotProceedConditions: string[];
  governanceSafetyRules: string[];
  accessibilityUsabilityExpectations: string[];
  futureOperationalization: R52ManualRevenueOperationalizationItem[];
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  persistenceAllowedNow: false;
};

export type R52ManualRevenueInvariantCheck = {
  passed: boolean;
  warningCodes: Array<
    | "activation_executed_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "live_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
    | "persistence_not_allowed_now"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);

  if (normalized.length <= maxTextLength) return normalized;

  return `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);

  if (bounded && !list.includes(bounded) && list.length < maxListItems) {
    list.push(bounded);
  }
}

function addWarning(warningCodes: string[], warningCode: R52ManualRevenueWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRuntimeRequest(input: R52ManualRevenueOperatorWorkdayInput) {
  return (
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.autonomousExecutionRequested === true ||
    input.advisoryConvertedToPermission === true ||
    input.activationExecuted === true ||
    input.providerActivationAllowed === true ||
    input.liveExecutionAllowed === true ||
    input.sent === true ||
    input.providerCalled === true ||
    input.canSendNow === true ||
    input.liveTestReady === true ||
    input.persistenceAllowedNow === true
  );
}

const orderedWorkflow: R52ManualRevenueStep[] = [
  {
    order: 1,
    section: "daily_operator_startup",
    title: "Start with readiness and governance review",
    requiredActions: [
      "Review system readiness before touching lead queues.",
      "Review governance visibility and confirm execution remains blocked.",
      "Open high-priority, overdue, blocked, and needs-review queues.",
    ],
    doNotProceedConditions: [
      "System readiness is critical.",
      "Governance visibility reports activation prohibited or remediation required.",
      "Operator cannot confirm manual-only workflow.",
    ],
    output: "Operator starts the day with a bounded manual worklist and no execution permission.",
  },
  {
    order: 2,
    section: "lead_triage",
    title: "Rank leads by work-first revenue potential",
    requiredActions: [
      "Prioritize high score, hot, needs-review, overdue, approved-not-contacted, and buyer-ready leads.",
      "Classify dead leads as rejected, DNC, invalid contact, or low-quality nurture.",
      "Capture missing address, phone, source, ARV, repairs, and seller motivation data before outreach decisions.",
    ],
    doNotProceedConditions: [
      "Lead is DNC or opted out.",
      "Lead has missing or invalid contact data.",
      "Lead source is unknown.",
    ],
    output: "Lead is assigned a manual next action, blocker, or nurture state.",
  },
  {
    order: 3,
    section: "seller_call",
    title: "Perform manual seller call review",
    requiredActions: [
      "Review lead facts, distress signals, approval state, and DNC status before calling.",
      "Gather motivation, condition, timeline, price expectation, access, and decision-maker details.",
      "Record seller call outcome and manual next step after the call.",
    ],
    doNotProceedConditions: [
      "Operator would make guaranteed offer, legal, tax, lending, or valuation claims.",
      "Seller requests stop, opt-out, or do-not-contact.",
      "Operator intends to send automated messages.",
    ],
    output: "Seller outcome is captured for manual follow-up or offer-readiness review.",
  },
  {
    order: 4,
    section: "follow_up",
    title: "Handle follow-up manually",
    requiredActions: [
      "Review follow-up due dates and stale leads.",
      "Confirm approval state before drafting any manual follow-up.",
      "Respect DNC, opt-out, rejection, recent-contact, and max-attempt conditions.",
    ],
    doNotProceedConditions: [
      "DNC or opt-out is active.",
      "Lead is rejected or closed out.",
      "Follow-up would bypass human approval.",
    ],
    output: "Manual follow-up is scheduled outside automation or lead is escalated/reclassified.",
  },
  {
    order: 5,
    section: "buyer_review",
    title: "Review buyer and disposition readiness",
    requiredActions: [
      "Review buyer demand, buyer tiers, active buyer signals, and buyer activity.",
      "Confirm package completeness: ARV, repairs, price/spread assumption, photos, access, and contract visibility.",
      "Log buyer activity manually after real buyer interactions.",
    ],
    doNotProceedConditions: [
      "No seller agreement or contract visibility exists for buyer-facing work.",
      "Buyer package lacks critical valuation or access data.",
      "Buyer outreach would occur without approval and package review.",
    ],
    output: "Lead is prepared for internal buyer-match review or returned to package completion.",
  },
  {
    order: 6,
    section: "revenue_pipeline",
    title: "Review next-money actions and bottlenecks",
    requiredActions: [
      "Use the revenue pipeline cockpit to identify work-first, near-contract, under-contract, and closing-blocked leads.",
      "Resolve bottlenecks before moving pipeline stages.",
      "Pause for operator review when valuation, contract, title, buyer, or compliance data is incomplete.",
    ],
    doNotProceedConditions: [
      "Revenue action depends on unverified property facts.",
      "Closing/title/contract status is unknown for under-contract work.",
      "Pipeline movement would imply execution instead of tracking.",
    ],
    output: "Operator selects the highest-value manual action that can be done safely today.",
  },
  {
    order: 7,
    section: "governance_safety",
    title: "Preserve governance-first execution doctrine",
    requiredActions: [
      "Keep all automation, provider, SMS/email, and persistence actions disabled.",
      "Use mock outreach and dry-run previews as advisory evidence only.",
      "Escalate any pressure to bypass approval, DNC, opt-out, allowlist, or kill-switch rules.",
    ],
    doNotProceedConditions: [
      "Any path implies canSendNow:true.",
      "Any operator action would call providers or automation-agent.",
      "Any advisory status is treated as execution permission.",
    ],
    output: "Revenue work remains manual, governed, and fail-closed.",
  },
  {
    order: 8,
    section: "accessibility_operator_usability",
    title: "Check operator usability and accessibility friction",
    requiredActions: [
      "Favor keyboard-first review flows, visible focus, readable labels, and non-color-only status interpretation.",
      "Record any operator accessibility friction for future R51 implementation.",
      "Avoid rushed UI rewrites during manual revenue operations.",
    ],
    doNotProceedConditions: [
      "Critical workflow cannot be completed with keyboard navigation.",
      "Status or error state is only communicated by color.",
      "Operator cannot reliably interpret the next safe action.",
    ],
    output: "Accessibility findings are queued for implementation planning without runtime mutation.",
  },
];

const governanceSafetyRules = [
  "Manual approval is not send permission.",
  "Mock outreach is evidence only and never sends.",
  "Dry-run automation preview does not run automation.",
  "DNC, opt-out, and rejection states override revenue pressure.",
  "No operator workflow may call Twilio, provider APIs, automation-agent, or live execution routes.",
  "Revenue estimates are assumptions and not property facts or guarantees.",
];

const accessibilityUsabilityExpectations = [
  "Operator-critical controls should be keyboard reachable.",
  "Focus should remain visible during lead review, approval review, buyer review, and forms.",
  "Status should be readable as text, not color alone.",
  "Motion should not be required to understand workflow state.",
  "Errors and blockers should be explicit before operator action.",
];

const futureOperationalization: R52ManualRevenueOperationalizationItem[] = [
  {
    workflow: "Lead queue ranking and daily worklist generation",
    classification: "future_semi_automated_with_review",
    reason: "Ranking can be generated safely if it remains advisory and operator-reviewed.",
  },
  {
    workflow: "Seller call outcome capture",
    classification: "safe_manual_now",
    reason: "Capture is operator-entered and currently does not trigger outreach, approval, DNC mutation, provider calls, or automation.",
  },
  {
    workflow: "Buyer matching and disposition package review",
    classification: "human_review_required",
    reason: "Buyer-facing work needs valuation, contract, package, and compliance review before sharing.",
  },
  {
    workflow: "SMS/email/provider sending",
    classification: "never_autonomous",
    reason: "Outbound communication must never bypass operator approval, DNC/opt-out, allowlist, kill-switch, and audit controls.",
  },
  {
    workflow: "Automation-agent runtime cycle",
    classification: "never_autonomous",
    reason: "The legacy live-capable agent can mutate data and reach providers; it must remain blocked unless replaced by governed runtime controls.",
  },
  {
    workflow: "Audit persistence",
    classification: "future_semi_automated_with_review",
    reason: "Persistence can eventually be implemented only after R50 retention, access, export, deletion, and legal/admin controls are operationalized.",
  },
];

export function assertR52ManualRevenueOperatorWorkdayInvariants(
  result: Pick<
    R52ManualRevenueOperatorWorkdayResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
  >,
): R52ManualRevenueInvariantCheck {
  const warningCodes: R52ManualRevenueInvariantCheck["warningCodes"] = [];

  if (result.activationExecuted !== false) warningCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) warningCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) warningCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR52ManualRevenueOperatorWorkday(result: R52ManualRevenueOperatorWorkdayResult) {
  const invariantCheck = assertR52ManualRevenueOperatorWorkdayInvariants(result);

  return boundSummary(
    `R52F manual revenue operator workday status is ${result.workdayStatus}. ` +
      `${result.orderedWorkflow.length} ordered SOP sections are defined. ` +
      `${result.doNotProceedConditions.length} do-not-proceed conditions and ${result.governanceSafetyRules.length} governance rules are active. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is advisory-only, manual-only, simulation-first, and cannot authorize providers, live sending, automation-agent execution, polling, persistence, or autonomous execution.",
  );
}

export function createR52ManualRevenueOperatorWorkdayContract(
  input: R52ManualRevenueOperatorWorkdayInput = {},
): R52ManualRevenueOperatorWorkdayResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraOperatorNotes);
  const doNotProceedConditions: string[] = [];

  addWarning(warningCodes, "r52f_manual_revenue_operator_workday_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(doNotProceedConditions, "Input is missing; operator workday must fail closed.");
  }

  if (input.systemReadinessReviewed !== true) {
    addWarning(warningCodes, "system_readiness_required");
    addUnique(doNotProceedConditions, "System readiness must be reviewed before revenue work.");
  }
  if (input.governanceVisibilityReviewed !== true) {
    addWarning(warningCodes, "governance_visibility_required");
    addUnique(doNotProceedConditions, "Governance visibility must be reviewed before revenue work.");
  }
  if (input.highPriorityQueueReviewed !== true || input.overdueQueueReviewed !== true) {
    addWarning(warningCodes, "lead_queue_required");
    addUnique(doNotProceedConditions, "High-priority and overdue queues must be reviewed.");
  }
  if (input.buyerPipelineReviewed !== true) {
    addWarning(warningCodes, "buyer_pipeline_required");
    addUnique(doNotProceedConditions, "Buyer pipeline must be reviewed before disposition work.");
  }
  if (input.revenuePipelineReviewed !== true) {
    addWarning(warningCodes, "revenue_pipeline_required");
    addUnique(doNotProceedConditions, "Revenue pipeline must be reviewed before next-money actions.");
  }
  if (input.accessibilityUsabilityReviewed !== true) {
    addWarning(warningCodes, "accessibility_review_required");
    addUnique(doNotProceedConditions, "Operator accessibility/usability friction must be reviewed.");
  }
  if (input.operatorReviewCompleted !== true) {
    addWarning(warningCodes, "operator_review_required");
    addUnique(doNotProceedConditions, "Operator must confirm manual-only workflow before proceeding.");
  }

  if (input.runtimeActivationRequested === true) {
    addWarning(warningCodes, "runtime_activation_rejected");
    addUnique(doNotProceedConditions, "Runtime activation request is rejected.");
  }
  if (input.providerActivationRequested === true) {
    addWarning(warningCodes, "provider_activation_rejected");
    addUnique(doNotProceedConditions, "Provider activation request is rejected.");
  }
  if (input.liveSendingRequested === true) {
    addWarning(warningCodes, "live_sending_rejected");
    addUnique(doNotProceedConditions, "Live SMS/email request is rejected.");
  }
  if (input.automationAgentRequested === true) {
    addWarning(warningCodes, "automation_agent_rejected");
    addUnique(doNotProceedConditions, "Automation-agent execution request is rejected.");
  }
  if (input.pollingRequested === true) {
    addWarning(warningCodes, "polling_rejected");
    addUnique(doNotProceedConditions, "Uncontrolled polling request is rejected.");
  }
  if (input.autonomousExecutionRequested === true) {
    addWarning(warningCodes, "autonomous_execution_rejected");
    addUnique(doNotProceedConditions, "Autonomous execution request is rejected.");
  }
  if (input.advisoryConvertedToPermission === true) {
    addWarning(warningCodes, "advisory_to_permission_rejected");
    addUnique(doNotProceedConditions, "Advisory status cannot become execution permission.");
  }
  if (hasForbiddenRuntimeRequest(input)) {
    addUnique(doNotProceedConditions, "Forbidden runtime or execution indicator is present.");
  }
  if (input.activationExecuted === true) addWarning(warningCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addWarning(warningCodes, "can_send_now_must_be_false");
  if (input.simulationOnly !== true) addWarning(warningCodes, "simulation_only_required");
  if (input.liveTestReady === true) addWarning(warningCodes, "live_test_ready_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const workdayStatus: R52ManualRevenueWorkdayStatus = hasForbiddenRuntimeRequest(input)
    ? "manual_revenue_workday_blocked"
    : operatorReviewRequired || doNotProceedConditions.length > 0
      ? "operator_review_required"
      : "manual_revenue_workday_ready";

  const result: R52ManualRevenueOperatorWorkdayResult = {
    workdayStatus,
    manualOnlyDoctrine:
      "Revenue work is operator-led, manual-only, advisory-first, and simulation-first. Approval, readiness, or mock output never grants execution permission.",
    orderedWorkflow,
    doNotProceedConditions,
    governanceSafetyRules,
    accessibilityUsabilityExpectations,
    futureOperationalization,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R52F manual revenue operator workday contract only.",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    persistenceAllowedNow: false,
  };

  return {
    ...result,
    summary: summarizeR52ManualRevenueOperatorWorkday(result),
  };
}
