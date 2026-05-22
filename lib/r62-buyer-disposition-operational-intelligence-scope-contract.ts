export type R62BuyerDispositionOperationalScopeStatus =
  | "buyer_disposition_operational_scope_blocked"
  | "operator_review_required"
  | "buyer_disposition_operational_scope_ready";

export type R62BuyerDispositionOperationalCategory =
  | "governance_stop_visibility"
  | "revenue_priority_disposition_review"
  | "high_likelihood_assignment_review"
  | "assignment_readiness_review"
  | "buyer_package_completeness_review"
  | "buyer_response_probability_review"
  | "buyer_engagement_quality_review"
  | "buyer_activity_freshness_review"
  | "buyer_demand_mismatch_visibility"
  | "stale_package_detection"
  | "stale_deal_visibility"
  | "assignment_readiness_momentum_review"
  | "buyer_ready_urgency_review"
  | "assignment_risk_review"
  | "disposition_bottleneck_visibility"
  | "blocked_disposition_visibility"
  | "disposition_pipeline_stagnation_review"
  | "disposition_workload_prioritization"
  | "high_value_disposition_queue_review"
  | "manual_buyer_review_guidance";

export type R62OperationalRankingConcept = {
  concept:
    | "resolve_governance_stops"
    | "review_revenue_priority_disposition"
    | "review_high_likelihood_assignment"
    | "review_assignment_readiness"
    | "complete_buyer_package"
    | "review_buyer_response_probability"
    | "review_buyer_engagement_quality"
    | "review_buyer_activity_freshness"
    | "review_buyer_demand_mismatch"
    | "detect_stale_packages"
    | "review_stale_deals"
    | "review_assignment_momentum"
    | "review_buyer_ready_urgency"
    | "review_assignment_risk"
    | "resolve_disposition_bottlenecks"
    | "review_blocked_disposition"
    | "review_pipeline_stagnation"
    | "prioritize_disposition_workload"
    | "review_high_value_disposition_queue";
  rank: number;
  revenueReason: string;
  safeOperatorGuidance: string;
  boundary: string;
};

export type R62StaleDealConcept =
  | "stale_package_detection"
  | "stale_deal_visibility"
  | "buyer_activity_freshness_review"
  | "disposition_pipeline_stagnation_review"
  | "assignment_readiness_momentum_review"
  | "manual_stale_deal_recovery_review";

export type R62AssignmentReadinessConcept =
  | "assignment_readiness_review"
  | "high_likelihood_assignment_review"
  | "assignment_readiness_momentum_review"
  | "assignment_risk_review"
  | "revenue_priority_disposition_review"
  | "buyer_ready_urgency_review"
  | "manual_assignment_review_only";

export type R62BuyerEngagementReviewConcept =
  | "buyer_response_probability_review"
  | "buyer_engagement_quality_review"
  | "buyer_activity_freshness_review"
  | "buyer_demand_mismatch_visibility"
  | "buyer_fit_review"
  | "manual_buyer_review_guidance";

export type R62DispositionBottleneckConcept =
  | "governance_stop_visibility"
  | "blocked_disposition_visibility"
  | "buyer_package_completeness_review"
  | "package_prep_priority"
  | "disposition_bottleneck_visibility"
  | "disposition_workload_prioritization"
  | "high_value_disposition_queue_review";

export type R62ForbiddenExecutionSemantic =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "execute disposition workflow"
  | "match and send automatically"
  | "autonomous buyer matching"
  | "autonomous buyer negotiation"
  | "autonomous outreach"
  | "approve and send"
  | "release automation"
  | "provider activation"
  | "campaign launch"
  | "AI closes deals automatically"
  | "AI negotiates automatically"
  | "auto assignment workflow"
  | "buyer communication execution"
  | "hidden execution semantics";

export type R62BuyerDispositionOperationalWarningCode =
  | "r62a_scope_contract_only"
  | "input_missing"
  | "r61f_lockdown_review_required"
  | "operational_categories_review_required"
  | "stale_deal_review_required"
  | "assignment_readiness_review_required"
  | "buyer_engagement_review_required"
  | "disposition_bottleneck_review_required"
  | "workload_prioritization_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "buyer_outreach_execution_rejected"
  | "campaign_launch_rejected"
  | "buyer_communication_execution_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_matching_rejected"
  | "autonomous_buyer_outreach_rejected"
  | "autonomous_negotiation_rejected"
  | "auto_assignment_workflow_rejected"
  | "approval_grants_execution_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "provider_activation_allowed_must_be_false"
  | "approval_grants_execution_must_be_false"
  | "ui_implementation_not_allowed_now";

export type R62BuyerDispositionOperationalInput = {
  r61fLockdownReviewed?: boolean;
  operationalCategoriesReviewed?: boolean;
  staleDealReviewed?: boolean;
  assignmentReadinessReviewed?: boolean;
  buyerEngagementReviewed?: boolean;
  dispositionBottleneckReviewed?: boolean;
  workloadPrioritizationReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  emailSmsSendingRequested?: boolean;
  buyerOutreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  buyerCommunicationExecutionRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousMatchingRequested?: boolean;
  autonomousBuyerOutreachRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
  autoAssignmentWorkflowRequested?: boolean;
  approvalGrantsExecution?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraScopeNotes?: string[];
};

export type R62BuyerDispositionOperationalSafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  providerActivationAllowed: false;
  approvalGrantsExecution: false;
  uiImplementationAllowedNow: false;
};

export type R62PreImplementationAuditFinding = {
  classification:
    | "Required before implementation"
    | "Safe to include now"
    | "Future upgrade"
    | "Optional optimization"
    | "Forbidden because it violates governance";
  finding: string;
};

export type R62BuyerDispositionOperationalScopeResult = R62BuyerDispositionOperationalSafetyFlags & {
  phase: "R62A";
  surface: "buyer_disposition_operational_intelligence";
  scopeStatus: R62BuyerDispositionOperationalScopeStatus;
  operationalCategories: R62BuyerDispositionOperationalCategory[];
  operationalRankingConcepts: R62OperationalRankingConcept[];
  staleDealConcepts: R62StaleDealConcept[];
  assignmentReadinessConcepts: R62AssignmentReadinessConcept[];
  buyerEngagementReviewConcepts: R62BuyerEngagementReviewConcept[];
  dispositionBottleneckConcepts: R62DispositionBottleneckConcept[];
  workloadPrioritizationConcepts: string[];
  governanceStopSignals: string[];
  safeOperatorGuidanceWording: string[];
  forbiddenExecutionSemantics: R62ForbiddenExecutionSemantic[];
  governanceBoundaries: string[];
  deterministicInvariants: string[];
  accessibilityRequirements: string[];
  preImplementationAuditFindings: R62PreImplementationAuditFinding[];
  safetyFlags: R62BuyerDispositionOperationalSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R62BuyerDispositionOperationalInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 50;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R62BuyerDispositionOperationalSafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  uiImplementationAllowedNow: false,
};

const operationalCategories: R62BuyerDispositionOperationalCategory[] = [
  "governance_stop_visibility",
  "revenue_priority_disposition_review",
  "high_likelihood_assignment_review",
  "assignment_readiness_review",
  "buyer_package_completeness_review",
  "buyer_response_probability_review",
  "buyer_engagement_quality_review",
  "buyer_activity_freshness_review",
  "buyer_demand_mismatch_visibility",
  "stale_package_detection",
  "stale_deal_visibility",
  "assignment_readiness_momentum_review",
  "buyer_ready_urgency_review",
  "assignment_risk_review",
  "disposition_bottleneck_visibility",
  "blocked_disposition_visibility",
  "disposition_pipeline_stagnation_review",
  "disposition_workload_prioritization",
  "high_value_disposition_queue_review",
  "manual_buyer_review_guidance",
];

const operationalRankingConcepts: R62OperationalRankingConcept[] = [
  {
    concept: "resolve_governance_stops",
    rank: 1,
    revenueReason: "Governance stops can invalidate any buyer-side revenue priority and must outrank readiness, urgency, stale status, and momentum.",
    safeOperatorGuidance: "Governance stop visibility must be reviewed before buyer disposition planning.",
    boundary: "No override, outreach, sending, campaign launch, provider activation, approval escalation, or execution workflow is allowed.",
  },
  {
    concept: "review_revenue_priority_disposition",
    rank: 2,
    revenueReason: "Revenue-priority disposition review helps operators focus on deals most likely to produce assignment revenue fastest.",
    safeOperatorGuidance: "Use the label for manual operator review and sequencing only.",
    boundary: "No buyer communication execution, autonomous outreach, auto assignment workflow, or approval-as-permission.",
  },
  {
    concept: "review_high_likelihood_assignment",
    rank: 3,
    revenueReason: "High-likelihood assignment review can surface deals with strong package, buyer-fit, and demand signals.",
    safeOperatorGuidance: "Review assignment likelihood as advisory intelligence before any off-platform action.",
    boundary: "No autonomous buyer matching, match-and-send, negotiation, sending, or package release.",
  },
  {
    concept: "review_assignment_readiness",
    rank: 4,
    revenueReason: "Assignment-readiness review identifies manual blockers around package, title, strategy, and buyer demand.",
    safeOperatorGuidance: "Review readiness gaps manually and label assumptions clearly.",
    boundary: "No execution controls, runtime activation, queue execution, persistence, or provider connectivity.",
  },
  {
    concept: "complete_buyer_package",
    rank: 5,
    revenueReason: "Incomplete buyer packages slow assignment revenue and create disposition bottlenecks.",
    safeOperatorGuidance: "Complete assignment, title, photos, repair, ARV, rent, and strategy data manually.",
    boundary: "No fact invention, enrichment activation, scraping, package release, sending, or provider calls.",
  },
  {
    concept: "review_buyer_response_probability",
    rank: 6,
    revenueReason: "Buyer response probability review can help prioritize manual attention where a buyer-side response is more likely.",
    safeOperatorGuidance: "Treat response probability as a review label based on existing evidence only.",
    boundary: "No buyer contact, messaging, campaign infrastructure, or autonomous follow-up.",
  },
  {
    concept: "review_buyer_engagement_quality",
    rank: 7,
    revenueReason: "Buyer engagement quality review distinguishes strong demand signals from stale or weak buyer-side evidence.",
    safeOperatorGuidance: "Review engagement quality manually before relying on buyer-fit assumptions.",
    boundary: "No automated ranking that contacts, negotiates, sends, or executes buyer workflows.",
  },
  {
    concept: "review_buyer_activity_freshness",
    rank: 8,
    revenueReason: "Fresh buyer activity can improve disposition confidence while stale activity may require caution.",
    safeOperatorGuidance: "Use freshness as manual review context, not contact permission.",
    boundary: "No polling, auto-refresh, provider activation, background sync, or runtime activation.",
  },
  {
    concept: "review_buyer_demand_mismatch",
    rank: 9,
    revenueReason: "Demand mismatch visibility prevents operators from over-prioritizing packages that do not fit current buyer demand.",
    safeOperatorGuidance: "Review mismatch labels against strategy, area, property type, price, repair, ARV, and rent context.",
    boundary: "No autonomous matching, buyer outreach, buyer blast, or campaign launch.",
  },
  {
    concept: "detect_stale_packages",
    rank: 10,
    revenueReason: "Stale packages can quietly leak revenue when no manual package-prep progress is visible.",
    safeOperatorGuidance: "Stale package detection is a human review label for package-prep triage.",
    boundary: "No automatic reactivation, persistence, polling, task mutation, or workflow activation.",
  },
  {
    concept: "review_stale_deals",
    rank: 11,
    revenueReason: "Stale deal visibility helps recover disposition opportunities before assignment momentum decays.",
    safeOperatorGuidance: "Review stale deals manually for bottlenecks, package gaps, and buyer-fit assumptions.",
    boundary: "No campaigns, outbound communication, execution queues, or automated buyer reactivation.",
  },
  {
    concept: "review_assignment_momentum",
    rank: 12,
    revenueReason: "Assignment-readiness momentum review can show whether a deal is moving toward or away from revenue.",
    safeOperatorGuidance: "Use momentum review for manual prioritization only.",
    boundary: "No auto assignment workflow, autonomous negotiation, or workflow mutation.",
  },
  {
    concept: "review_buyer_ready_urgency",
    rank: 13,
    revenueReason: "Buyer-ready urgency can help operators identify time-sensitive manual review opportunities.",
    safeOperatorGuidance: "Urgency never outranks governance and never authorizes contact.",
    boundary: "Buyer-ready does not mean send, contact, blast, execute, activate, queue, or automate.",
  },
  {
    concept: "review_assignment_risk",
    rank: 14,
    revenueReason: "Assignment-risk review surfaces title, package, fit, stale, and governance risks that could block revenue.",
    safeOperatorGuidance: "Review assignment risk manually before assigning urgency or priority.",
    boundary: "No approval-to-execution escalation, provider activation, autonomous outreach, or negotiation.",
  },
  {
    concept: "resolve_disposition_bottlenecks",
    rank: 15,
    revenueReason: "Disposition bottleneck visibility helps operators remove manual blockers that slow assignment throughput.",
    safeOperatorGuidance: "Bottlenecks are review labels for operator sequencing.",
    boundary: "No task mutation, execution queue, workflow activation, persistence, polling, or runtime activation.",
  },
  {
    concept: "review_blocked_disposition",
    rank: 16,
    revenueReason: "Blocked disposition visibility prevents unsafe revenue pressure from overriding governance or missing package facts.",
    safeOperatorGuidance: "Blocked disposition requires human review before any next step.",
    boundary: "No release automation, provider activation, sending, buyer execution, or approval-as-permission.",
  },
  {
    concept: "review_pipeline_stagnation",
    rank: 17,
    revenueReason: "Pipeline stagnation review shows where buyer-side workflow has stopped producing movement.",
    safeOperatorGuidance: "Use stagnation review to focus manual operator attention.",
    boundary: "No auto-refresh, polling, autonomous workflow, provider call, or campaign launch.",
  },
  {
    concept: "prioritize_disposition_workload",
    rank: 18,
    revenueReason: "Disposition workload prioritization helps operators decide which manual reviews should happen first.",
    safeOperatorGuidance: "Workload priority is advisory and does not assign work or change state.",
    boundary: "No queue execution, task mutation, persistence, workflow activation, or hidden execution affordance.",
  },
  {
    concept: "review_high_value_disposition_queue",
    rank: 19,
    revenueReason: "High-value disposition queue review can group manual opportunities with the strongest revenue-throughput signals.",
    safeOperatorGuidance: "Queue review means operator visibility only.",
    boundary: "No outbound queue, buyer execution queue, provider connectivity, sending, or autonomous buyer matching.",
  },
];

const staleDealConcepts: R62StaleDealConcept[] = [
  "stale_package_detection",
  "stale_deal_visibility",
  "buyer_activity_freshness_review",
  "disposition_pipeline_stagnation_review",
  "assignment_readiness_momentum_review",
  "manual_stale_deal_recovery_review",
];

const assignmentReadinessConcepts: R62AssignmentReadinessConcept[] = [
  "assignment_readiness_review",
  "high_likelihood_assignment_review",
  "assignment_readiness_momentum_review",
  "assignment_risk_review",
  "revenue_priority_disposition_review",
  "buyer_ready_urgency_review",
  "manual_assignment_review_only",
];

const buyerEngagementReviewConcepts: R62BuyerEngagementReviewConcept[] = [
  "buyer_response_probability_review",
  "buyer_engagement_quality_review",
  "buyer_activity_freshness_review",
  "buyer_demand_mismatch_visibility",
  "buyer_fit_review",
  "manual_buyer_review_guidance",
];

const dispositionBottleneckConcepts: R62DispositionBottleneckConcept[] = [
  "governance_stop_visibility",
  "blocked_disposition_visibility",
  "buyer_package_completeness_review",
  "package_prep_priority",
  "disposition_bottleneck_visibility",
  "disposition_workload_prioritization",
  "high_value_disposition_queue_review",
];

const workloadPrioritizationConcepts = [
  "Governance stop visibility must render first in any future R62 surface.",
  "Revenue-priority disposition review may rank manual operator attention, not execution.",
  "High-value disposition queue review means read-only workload visibility, not an outbound queue.",
  "Stale deal, stale package, assignment risk, buyer-fit, and demand mismatch labels should reduce revenue leakage.",
  "Disposition workload prioritization cannot assign work, mutate tasks, persist state, poll, or activate workflows.",
];

const governanceStopSignals = [
  "Do-not-contact or opt-out state.",
  "Human-review-required state.",
  "Rejected or blocked approval state.",
  "Missing consent or unclear buyer-facing permission.",
  "Missing assignment, title, package, or strategy facts that require manual verification.",
  "Any governance stop must appear before urgency, buyer readiness, package completeness, buyer-fit, stale-deal urgency, or assignment momentum.",
];

const safeOperatorGuidanceWording = [
  "manual buyer-review guidance",
  "revenue-priority disposition review",
  "high-likelihood assignment review",
  "assignment readiness review",
  "buyer package completeness review",
  "buyer response probability review",
  "buyer engagement quality review",
  "buyer activity freshness review",
  "stale package detection",
  "stale deal visibility",
  "disposition bottleneck visibility",
  "blocked disposition visibility",
  "Buyer-ready does not mean send.",
  "Use this scope for buyer disposition operational intelligence only; it does not send, blast, email, SMS, persist, poll, activate providers, launch campaigns, match autonomously, negotiate, or execute workflows.",
];

const forbiddenExecutionSemantics: R62ForbiddenExecutionSemantic[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "execute disposition workflow",
  "match and send automatically",
  "autonomous buyer matching",
  "autonomous buyer negotiation",
  "autonomous outreach",
  "approve and send",
  "release automation",
  "provider activation",
  "campaign launch",
  "AI closes deals automatically",
  "AI negotiates automatically",
  "auto assignment workflow",
  "buyer communication execution",
  "hidden execution semantics",
];

const governanceBoundaries = [
  "Buyer disposition operational intelligence is scope-contract-only and cannot implement UI, routes, providers, persistence, polling, automation, campaigns, or runtime activation.",
  "Governance stop signals must always outrank urgency, buyer readiness, package completeness, buyer-fit, stale-deal urgency, and assignment momentum.",
  "Buyer-ready means manual review and package preparation may be prioritized; it never means send, contact, blast, execute, activate, queue, or automate.",
  "Revenue priority, high-likelihood assignment, response probability, engagement quality, and queue review cannot become permission to contact buyers or release packages.",
  "Approval and human review states cannot become permission to execute buyer outreach, negotiation, package release, provider activation, or workflow mutation.",
  "All package, buyer-fit, assignment, title, photo, repair, ARV, rent, strategy, buyer activity, and demand facts must be manually verified.",
  "Assumptions must be labeled clearly and no property, buyer, assignment, demand, or package facts may be invented.",
];

const deterministicInvariants = [
  "readOnly must remain true.",
  "advisoryOnly must remain true.",
  "simulationOnly must remain true.",
  "providerCalled must remain false.",
  "sent must remain false.",
  "persistenceAllowedNow must remain false.",
  "pollingAllowed must remain false.",
  "runtimeActivationAllowed must remain false.",
  "providerActivationAllowed must remain false.",
  "approvalGrantsExecution must remain false.",
  "uiImplementationAllowedNow must remain false in R62A.",
  "Governance stop signals must rank first.",
  "Buyer-ready does not mean send.",
  "No outbound communication, campaign infrastructure, provider activation, autonomous matching, autonomous negotiation, or execution controls may be authorized.",
  "R62 outputs must be deterministic, bounded, explainable, fail-closed, and manual-first.",
];

const accessibilityRequirements = [
  "Future presentation must use semantic headings and predictable reading order.",
  "Disposition priority, stale deal, assignment readiness, buyer engagement, bottleneck, blocked, and governance labels must be readable.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, polling, auto-refresh, or live-update noise is allowed.",
  "Use concise wording and screen-reader-friendly summaries for buyer disposition operational categories.",
];

const preImplementationAuditFindings: R62PreImplementationAuditFinding[] = [
  {
    classification: "Required before implementation",
    finding: "Audit execution drift, approval-as-permission drift, autonomous behavior, campaign semantics, dangerous wording, hidden affordances, and governance-stop dominance before R62D.",
  },
  {
    classification: "Safe to include now",
    finding: "Scope stale package, stale deal, assignment readiness, buyer engagement, demand mismatch, and workload priority concepts as read-only intelligence.",
  },
  {
    classification: "Future upgrade",
    finding: "Future UI density and observability bloat should be audited in R62B before any dashboard implementation.",
  },
  {
    classification: "Optional optimization",
    finding: "Reusable scoring helpers may be considered later, but R62A should remain a simple deterministic contract.",
  },
  {
    classification: "Forbidden because it violates governance",
    finding: "Provider activation, buyer communication execution, autonomous matching, autonomous negotiation, campaign launch, and auto assignment workflows are rejected.",
  },
];

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
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R62BuyerDispositionOperationalWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R62BuyerDispositionOperationalInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.buyerOutreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.buyerCommunicationExecutionRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousMatchingRequested === true ||
    input.autonomousBuyerOutreachRequested === true ||
    input.autonomousNegotiationRequested === true ||
    input.autoAssignmentWorkflowRequested === true ||
    input.approvalGrantsExecution === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function assertR62BuyerDispositionOperationalScopeInvariants(
  result: Pick<
    R62BuyerDispositionOperationalScopeResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "providerActivationAllowed"
    | "approvalGrantsExecution"
    | "uiImplementationAllowedNow"
  >,
): R62BuyerDispositionOperationalInvariantCheck {
  const warningCodes: string[] = [];

  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");

  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR62BuyerDispositionOperationalScope(
  result: R62BuyerDispositionOperationalScopeResult,
) {
  const invariantCheck = assertR62BuyerDispositionOperationalScopeInvariants(result);

  return boundSummary(
    `R62A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.operationalCategories.length} operational categories and ${result.operationalRankingConcepts.length} ranking concepts are scoped. ` +
      `${result.staleDealConcepts.length} stale-deal concepts, ${result.assignmentReadinessConcepts.length} assignment-readiness concepts, and ${result.buyerEngagementReviewConcepts.length} buyer engagement review concepts are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, providers, buyer communication, campaigns, sending, persistence, polling, automation, approval execution, autonomous matching, autonomous negotiation, auto assignment workflows, queue execution, or runtime activation.",
  );
}

export function createR62BuyerDispositionOperationalIntelligenceScopeContract(
  input: R62BuyerDispositionOperationalInput = {},
): R62BuyerDispositionOperationalScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r62a_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r61fLockdownReviewed !== true) addWarning(warningCodes, "r61f_lockdown_review_required");
  if (input.operationalCategoriesReviewed !== true) {
    addWarning(warningCodes, "operational_categories_review_required");
  }
  if (input.staleDealReviewed !== true) addWarning(warningCodes, "stale_deal_review_required");
  if (input.assignmentReadinessReviewed !== true) {
    addWarning(warningCodes, "assignment_readiness_review_required");
  }
  if (input.buyerEngagementReviewed !== true) addWarning(warningCodes, "buyer_engagement_review_required");
  if (input.dispositionBottleneckReviewed !== true) {
    addWarning(warningCodes, "disposition_bottleneck_review_required");
  }
  if (input.workloadPrioritizationReviewed !== true) {
    addWarning(warningCodes, "workload_prioritization_review_required");
  }
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.emailSmsSendingRequested === true) addWarning(warningCodes, "email_sms_sending_rejected");
  if (input.buyerOutreachExecutionRequested === true) {
    addWarning(warningCodes, "buyer_outreach_execution_rejected");
  }
  if (input.campaignLaunchRequested === true) addWarning(warningCodes, "campaign_launch_rejected");
  if (input.buyerCommunicationExecutionRequested === true) {
    addWarning(warningCodes, "buyer_communication_execution_rejected");
  }
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousMatchingRequested === true) addWarning(warningCodes, "autonomous_matching_rejected");
  if (input.autonomousBuyerOutreachRequested === true) {
    addWarning(warningCodes, "autonomous_buyer_outreach_rejected");
  }
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
  if (input.autoAssignmentWorkflowRequested === true) addWarning(warningCodes, "auto_assignment_workflow_rejected");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addWarning(warningCodes, "ui_implementation_not_allowed_now");

  for (const warningCode of warningCodes) {
    if (
      warningCode.endsWith("_rejected") ||
      warningCode.endsWith("_must_be_false") ||
      warningCode.endsWith("_not_allowed_now")
    ) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r61fLockdownReviewed !== true ||
    input.operationalCategoriesReviewed !== true ||
    input.staleDealReviewed !== true ||
    input.assignmentReadinessReviewed !== true ||
    input.buyerEngagementReviewed !== true ||
    input.dispositionBottleneckReviewed !== true ||
    input.workloadPrioritizationReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R62BuyerDispositionOperationalScopeStatus = hasForbiddenRequest(input)
    ? "buyer_disposition_operational_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "buyer_disposition_operational_scope_ready";
  const result: R62BuyerDispositionOperationalScopeResult = {
    phase: "R62A",
    surface: "buyer_disposition_operational_intelligence",
    scopeStatus,
    operationalCategories,
    operationalRankingConcepts,
    staleDealConcepts,
    assignmentReadinessConcepts,
    buyerEngagementReviewConcepts,
    dispositionBottleneckConcepts,
    workloadPrioritizationConcepts,
    governanceStopSignals,
    safeOperatorGuidanceWording,
    forbiddenExecutionSemantics,
    governanceBoundaries,
    deterministicInvariants,
    accessibilityRequirements,
    preImplementationAuditFindings,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R62B - Buyer Disposition Operational Intelligence UI Scope Audit",
    summary: "R62A buyer disposition operational intelligence scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR62BuyerDispositionOperationalScope(result) };
}
