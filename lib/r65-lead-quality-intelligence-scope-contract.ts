export type R65LeadQualityScopeStatus =
  | "lead_quality_scope_blocked"
  | "operator_review_required"
  | "lead_quality_scope_ready";

export type R65LeadQualityConcept =
  | "governance_stop_visibility"
  | "incomplete_lead_data_visibility"
  | "missing_phone_email_address_visibility"
  | "missing_seller_motivation_visibility"
  | "missing_timeline_visibility"
  | "missing_asking_price_visibility"
  | "missing_property_condition_visibility"
  | "missing_arv_repair_estimate_visibility"
  | "duplicate_lead_visibility"
  | "stale_lead_quality_review"
  | "low_confidence_lead_review"
  | "inconsistent_lead_data_review"
  | "acquisition_readiness_visibility"
  | "disposition_readiness_visibility"
  | "buyer_fit_data_readiness"
  | "seller_follow_up_readiness"
  | "revenue_risk_visibility"
  | "manual_data_cleanup_priority"
  | "human_verification_required"
  | "operator_attention_guidance";

export type R65LeadQualityRankingConcept = {
  concept: R65LeadQualityConcept;
  rank: number;
  revenueReason: string;
  safeOperatorGuidance: string;
  boundary: string;
};

export type R65ForbiddenLeadQualitySemantic =
  | "auto enrich lead"
  | "auto skip trace"
  | "auto contact seller"
  | "auto contact buyer"
  | "auto call"
  | "auto SMS"
  | "auto email"
  | "auto campaign"
  | "auto reject lead"
  | "auto assign lead"
  | "auto qualify lead for execution"
  | "auto route lead"
  | "auto create workflow"
  | "auto launch follow-up"
  | "provider activation"
  | "runtime activation"
  | "polling"
  | "scraping"
  | "external lookup activation"
  | "approval grants execution";

export type R65ScopeInput = {
  r64fLockdownReviewed?: boolean;
  allowedConceptsReviewed?: boolean;
  dataCompletenessReviewed?: boolean;
  duplicateLeadReviewed?: boolean;
  staleLeadReviewed?: boolean;
  readinessReviewed?: boolean;
  revenueRiskReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  futureUiReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  enrichmentActivationRequested?: boolean;
  skipTracingRequested?: boolean;
  scrapingRequested?: boolean;
  externalLookupRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  runtimeActivationRequested?: boolean;
  executionControlRequested?: boolean;
  autonomousQualificationRequested?: boolean;
  autonomousRoutingRequested?: boolean;
  autoRejectionRequested?: boolean;
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

export type R65ScopeSafetyFlags = {
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
  enrichmentActivationAllowed: false;
  skipTracingAllowed: false;
};

export type R65ScopeResult = R65ScopeSafetyFlags & {
  phase: "R65A";
  surface: "lead_quality_intelligence_scope";
  scopeStatus: R65LeadQualityScopeStatus;
  allowedIntelligenceConcepts: R65LeadQualityConcept[];
  rankingConcepts: R65LeadQualityRankingConcept[];
  deterministicScope: {
    phase: "R65A";
    purpose: string;
    uiImplementationAllowed: false;
    routeChangesAllowed: false;
    providerConnectivityAllowed: false;
    enrichmentAllowed: false;
    skipTracingAllowed: false;
    scrapingAllowed: false;
    externalLookupAllowed: false;
    persistenceAllowed: false;
    runtimeActivationAllowed: false;
    executionControlsAllowed: false;
  };
  governanceBoundaries: string[];
  futureUiBoundaryNotes: string[];
  safeOperatorGuidanceWording: string[];
  forbiddenLeadQualitySemantics: R65ForbiddenLeadQualitySemantic[];
  deterministicInvariants: string[];
  failClosedRules: string[];
  accessibilityRequirements: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R65ScopeSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R65ScopeInvariantCheck = { passed: boolean; warningCodes: string[] };

const maxListItems = 44;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R65ScopeSafetyFlags = {
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
  enrichmentActivationAllowed: false,
  skipTracingAllowed: false,
};

const allowedIntelligenceConcepts: R65LeadQualityConcept[] = [
  "governance_stop_visibility",
  "incomplete_lead_data_visibility",
  "missing_phone_email_address_visibility",
  "missing_seller_motivation_visibility",
  "missing_timeline_visibility",
  "missing_asking_price_visibility",
  "missing_property_condition_visibility",
  "missing_arv_repair_estimate_visibility",
  "duplicate_lead_visibility",
  "stale_lead_quality_review",
  "low_confidence_lead_review",
  "inconsistent_lead_data_review",
  "acquisition_readiness_visibility",
  "disposition_readiness_visibility",
  "buyer_fit_data_readiness",
  "seller_follow_up_readiness",
  "revenue_risk_visibility",
  "manual_data_cleanup_priority",
  "human_verification_required",
  "operator_attention_guidance",
];

const rankingConcepts: R65LeadQualityRankingConcept[] = allowedIntelligenceConcepts.map((concept, index) => ({
  concept,
  rank: index + 1,
  revenueReason:
    concept === "governance_stop_visibility"
      ? "Governance stop signals must outrank lead quality score, revenue opportunity, data completeness, acquisition readiness, disposition readiness, follow-up urgency, and operator workload pressure."
      : "Lead quality intelligence may reduce wasted operator time and protect revenue only through manual review.",
  safeOperatorGuidance:
    concept === "governance_stop_visibility"
      ? "Governance stop signals must be reviewed before lead quality priority guidance."
      : "Manual review may be beneficial; verify lead data before taking action.",
  boundary:
    concept === "governance_stop_visibility"
      ? "Stop signals are visibility only and cannot grant execution, outreach, provider activation, enrichment, skip tracing, scraping, or routing permission."
      : "Lead quality priority is advisory only and never means contact, enrich, skip trace, launch campaign, activate provider, execute workflow, or route automatically.",
}));

const forbiddenLeadQualitySemantics: R65ForbiddenLeadQualitySemantic[] = [
  "auto enrich lead",
  "auto skip trace",
  "auto contact seller",
  "auto contact buyer",
  "auto call",
  "auto SMS",
  "auto email",
  "auto campaign",
  "auto reject lead",
  "auto assign lead",
  "auto qualify lead for execution",
  "auto route lead",
  "auto create workflow",
  "auto launch follow-up",
  "provider activation",
  "runtime activation",
  "polling",
  "scraping",
  "external lookup activation",
  "approval grants execution",
];

const deterministicScope: R65ScopeResult["deterministicScope"] = {
  phase: "R65A",
  purpose: "Define lead quality intelligence concepts, governance boundaries, future UI expectations, and fail-closed rules without implementing UI, enrichment, outreach, persistence, providers, skip tracing, or execution.",
  uiImplementationAllowed: false,
  routeChangesAllowed: false,
  providerConnectivityAllowed: false,
  enrichmentAllowed: false,
  skipTracingAllowed: false,
  scrapingAllowed: false,
  externalLookupAllowed: false,
  persistenceAllowed: false,
  runtimeActivationAllowed: false,
  executionControlsAllowed: false,
};

const governanceBoundaries = [
  "Governance stop signals render first and outrank lead quality score, revenue opportunity, data completeness, acquisition readiness, disposition readiness, follow-up urgency, and operator workload pressure.",
  "Lead quality priority means manual review may be beneficial, data cleanup may be needed, human verification may be required, operator attention may be warranted, and revenue risk should be reviewed manually.",
  "Lead quality priority never means contact seller, contact buyer, enrich data automatically, skip trace automatically, launch campaign, activate provider, execute workflow, or route lead automatically.",
  "R65A cannot implement UI, routes, persistence, providers, enrichment, skip tracing, scraping, polling, runtime activation, or execution controls.",
];

const futureUiBoundaryNotes = [
  "Future UI may use existing dashboard placement only after explicit implementation authorization.",
  "Future UI may show data completeness, duplicate lead, stale lead, lead confidence, acquisition-readiness, disposition-readiness, seller follow-up readiness, and revenue-risk visibility as read-only advisory summaries.",
  "Future UI must not add enrichment controls, skip-tracing controls, external lookup activation, seller or buyer outreach controls, campaigns, provider consoles, execution queues, or approval-to-execution workflows.",
  "Future UI must keep governance stop signals before lead quality priority, revenue-risk, data completeness, readiness, and follow-up urgency guidance.",
  "Future UI must use semantic headings, readable labels, concise screen-reader-friendly summaries, text-based status meaning, no color-only meaning, no motion dependency, no focus movement, no auto-refresh, and no polling.",
];

const safeOperatorGuidanceWording = [
  "Manual lead quality review recommended.",
  "Lead quality priority label is advisory only.",
  "Review lead data before taking action.",
  "Human verification required before workflow action.",
  "Manual data cleanup priority.",
  "Governance stop signals must be resolved first.",
  "Lead quality priority does not mean enrich or contact.",
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
  "uiImplementationAllowedNow must remain false in R65A.",
  "enrichmentActivationAllowed must remain false.",
  "skipTracingAllowed must remain false.",
  "Governance stop signals must rank first.",
];

const failClosedRules = [
  "Missing operator review keeps the scope in operator_review_required status.",
  "Any request for UI implementation, routes, providers, enrichment, skip tracing, scraping, external lookup, outreach, campaigns, automation, polling, persistence, runtime activation, execution controls, autonomous qualification, autonomous routing, auto rejection, or approval-grants-execution blocks the scope.",
  "Unsafe input flags are never echoed into output safety flags.",
  "Extra notes are bounded and cannot expand the authorized scope.",
];

const accessibilityRequirements = [
  "Future UI must use semantic headings.",
  "Future UI must use readable labels and screen-reader-friendly summaries.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling is allowed.",
  "Reading order must place governance stop visibility before advisory lead quality guidance.",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  const bounded = trimmed.length <= maxTextLength ? trimmed : `${trimmed.slice(0, maxTextLength)}...`;
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function hasForbiddenRequest(input: R65ScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.providerActivationRequested === true ||
    input.enrichmentActivationRequested === true ||
    input.skipTracingRequested === true ||
    input.scrapingRequested === true ||
    input.externalLookupRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.runtimeActivationRequested === true ||
    input.executionControlRequested === true ||
    input.autonomousQualificationRequested === true ||
    input.autonomousRoutingRequested === true ||
    input.autoRejectionRequested === true ||
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

export function assertR65LeadQualityScopeInvariants(
  result: Pick<
    R65ScopeResult,
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
    | "enrichmentActivationAllowed"
    | "skipTracingAllowed"
  >,
): R65ScopeInvariantCheck {
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
  if (result.enrichmentActivationAllowed !== false) warningCodes.push("enrichment_activation_not_allowed");
  if (result.skipTracingAllowed !== false) warningCodes.push("skip_tracing_not_allowed");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR65LeadQualityScope(result: R65ScopeResult) {
  const invariantCheck = assertR65LeadQualityScopeInvariants(result);
  const summary =
    `R65A ${result.surface} status is ${result.scopeStatus}. ` +
    `${result.allowedIntelligenceConcepts.length} lead quality concepts and ${result.rankingConcepts.length} ranking concepts are scoped. ` +
    `${result.forbiddenLeadQualitySemantics.length} forbidden lead quality semantics are blocked. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This contract cannot authorize UI implementation, routes, providers, enrichment, skip tracing, scraping, external lookups, outreach, campaigns, persistence, polling, execution controls, autonomous qualification, autonomous routing, or runtime activation.";
  return summary.length <= maxSummaryLength ? summary : `${summary.slice(0, maxSummaryLength)}...`;
}

export function createR65LeadQualityIntelligenceScopeContract(input: R65ScopeInput = {}): R65ScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes: string[] = [];
  for (const note of input.extraScopeNotes ?? []) addUnique(scopeNotes, note);

  addUnique(warningCodes, "r65a_scope_contract_only");
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r64fLockdownReviewed !== true) addUnique(warningCodes, "r64f_lockdown_review_required");
  if (input.allowedConceptsReviewed !== true) addUnique(warningCodes, "allowed_concepts_review_required");
  if (input.dataCompletenessReviewed !== true) addUnique(warningCodes, "data_completeness_review_required");
  if (input.duplicateLeadReviewed !== true) addUnique(warningCodes, "duplicate_lead_review_required");
  if (input.staleLeadReviewed !== true) addUnique(warningCodes, "stale_lead_review_required");
  if (input.readinessReviewed !== true) addUnique(warningCodes, "readiness_review_required");
  if (input.revenueRiskReviewed !== true) addUnique(warningCodes, "revenue_risk_review_required");
  if (input.governanceBoundaryReviewed !== true) addUnique(warningCodes, "governance_boundary_review_required");
  if (input.futureUiReviewed !== true) addUnique(warningCodes, "future_ui_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addUnique(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addUnique(warningCodes, "route_change_rejected");
  if (input.providerActivationRequested === true) addUnique(warningCodes, "provider_activation_rejected");
  if (input.enrichmentActivationRequested === true) addUnique(warningCodes, "enrichment_activation_rejected");
  if (input.skipTracingRequested === true) addUnique(warningCodes, "skip_tracing_rejected");
  if (input.scrapingRequested === true) addUnique(warningCodes, "scraping_rejected");
  if (input.externalLookupRequested === true) addUnique(warningCodes, "external_lookup_rejected");
  if (input.outreachExecutionRequested === true) addUnique(warningCodes, "outreach_execution_rejected");
  if (input.campaignLaunchRequested === true) addUnique(warningCodes, "campaign_launch_rejected");
  if (input.automationAgentRequested === true) addUnique(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addUnique(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addUnique(warningCodes, "persistence_rejected");
  if (input.runtimeActivationRequested === true) addUnique(warningCodes, "runtime_activation_rejected");
  if (input.executionControlRequested === true) addUnique(warningCodes, "execution_control_rejected");
  if (input.autonomousQualificationRequested === true) addUnique(warningCodes, "autonomous_qualification_rejected");
  if (input.autonomousRoutingRequested === true) addUnique(warningCodes, "autonomous_routing_rejected");
  if (input.autoRejectionRequested === true) addUnique(warningCodes, "auto_rejection_rejected");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addUnique(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addUnique(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addUnique(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addUnique(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addUnique(warningCodes, "ui_implementation_not_allowed_now");

  for (const warningCode of warningCodes) {
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) addUnique(rejectionReasons, warningCode);
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingReview =
    input.r64fLockdownReviewed !== true ||
    input.allowedConceptsReviewed !== true ||
    input.dataCompletenessReviewed !== true ||
    input.duplicateLeadReviewed !== true ||
    input.staleLeadReviewed !== true ||
    input.readinessReviewed !== true ||
    input.revenueRiskReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.futureUiReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R65LeadQualityScopeStatus = hasForbiddenRequest(input)
    ? "lead_quality_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "lead_quality_scope_ready";

  const result: R65ScopeResult = {
    phase: "R65A",
    surface: "lead_quality_intelligence_scope",
    scopeStatus,
    allowedIntelligenceConcepts,
    rankingConcepts,
    deterministicScope,
    governanceBoundaries,
    futureUiBoundaryNotes,
    safeOperatorGuidanceWording,
    forbiddenLeadQualitySemantics,
    deterministicInvariants,
    failClosedRules,
    accessibilityRequirements,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R65B - Lead Quality Intelligence UI Scope Audit",
    summary: "R65A lead quality intelligence scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR65LeadQualityScope(result) };
}
