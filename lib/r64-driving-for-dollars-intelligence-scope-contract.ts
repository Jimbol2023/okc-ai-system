export type R64DrivingForDollarsScopeStatus =
  | "driving_for_dollars_scope_blocked"
  | "operator_review_required"
  | "driving_for_dollars_scope_ready";

export type R64DrivingForDollarsConcept =
  | "governance_stop_visibility"
  | "manual_property_review_priority"
  | "visible_distress_signal_review"
  | "vacancy_signal_visibility"
  | "deferred_maintenance_review"
  | "overgrowth_signal_review"
  | "boarded_broken_feature_visibility"
  | "neighborhood_opportunity_visibility"
  | "acquisition_review_priority"
  | "ownership_research_needed"
  | "property_condition_review_needed"
  | "lead_quality_concern_visibility"
  | "stale_field_observation_review"
  | "incomplete_property_data_visibility"
  | "duplicate_property_review"
  | "human_verification_required"
  | "manual_follow_up_recommended"
  | "revenue_potential_visibility"
  | "acquisition_bottleneck_visibility"
  | "review_needed_prioritization"
  | "operator_attention_guidance"
  | "stale_property_recovery_visibility"
  | "field_note_quality_review"
  | "workload_prioritization_visibility"
  | "human_only_decision_support";

export type R64DrivingForDollarsRankingConcept = {
  concept: R64DrivingForDollarsConcept;
  rank: number;
  revenueReason: string;
  safeOperatorGuidance: string;
  boundary: string;
};

export type R64ForbiddenDrivingForDollarsSemantic =
  | "auto contact owner"
  | "auto skip trace"
  | "auto call"
  | "auto SMS"
  | "auto email"
  | "auto mailer"
  | "auto campaign"
  | "auto route driver"
  | "auto assign acquisition rep"
  | "auto scrape owner data"
  | "auto pull phone numbers"
  | "auto generate offers"
  | "auto negotiate"
  | "autonomous acquisition"
  | "autonomous outreach"
  | "autonomous property targeting"
  | "autonomous route planning"
  | "GPS activation"
  | "provider activation"
  | "runtime activation"
  | "polling"
  | "workflow execution"
  | "approval escalation"
  | "approval grants execution";

export type R64ScopeWarningCode =
  | "r64a_scope_contract_only"
  | "input_missing"
  | "r63f_lockdown_review_required"
  | "allowed_concepts_review_required"
  | "distress_visibility_review_required"
  | "stale_property_review_required"
  | "acquisition_review_required"
  | "field_note_quality_review_required"
  | "governance_boundary_review_required"
  | "future_ui_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "provider_activation_rejected"
  | "gps_map_activation_rejected"
  | "scraping_rejected"
  | "skip_tracing_rejected"
  | "outreach_execution_rejected"
  | "campaign_launch_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "runtime_activation_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_acquisition_rejected"
  | "autonomous_property_targeting_rejected"
  | "autonomous_route_planning_rejected"
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

export type R64ScopeInput = {
  r63fLockdownReviewed?: boolean;
  allowedConceptsReviewed?: boolean;
  distressVisibilityReviewed?: boolean;
  stalePropertyReviewed?: boolean;
  acquisitionReviewReviewed?: boolean;
  fieldNoteQualityReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  futureUiReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  gpsMapActivationRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  runtimeActivationRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousAcquisitionRequested?: boolean;
  autonomousPropertyTargetingRequested?: boolean;
  autonomousRoutePlanningRequested?: boolean;
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

export type R64ScopeSafetyFlags = {
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

export type R64PreImplementationAuditFinding = {
  classification:
    | "Required before implementation"
    | "Safe to include now"
    | "Future upgrade"
    | "Optional optimization"
    | "Forbidden because it violates governance";
  finding: string;
};

export type R64GovernanceBoundary = {
  rule: string;
  priority: number;
  enforcement: string;
};

export type R64ScopeResult = R64ScopeSafetyFlags & {
  phase: "R64A";
  surface: "driving_for_dollars_intelligence_scope";
  scopeStatus: R64DrivingForDollarsScopeStatus;
  allowedIntelligenceConcepts: R64DrivingForDollarsConcept[];
  rankingConcepts: R64DrivingForDollarsRankingConcept[];
  deterministicScope: {
    phase: "R64A";
    purpose: string;
    implementationAllowed: false;
    routeChangesAllowed: false;
    providerConnectivityAllowed: false;
    gpsMapActivationAllowed: false;
    scrapingAllowed: false;
    skipTracingAllowed: false;
    persistenceAllowed: false;
    runtimeActivationAllowed: false;
    executionControlsAllowed: false;
  };
  governanceBoundaries: R64GovernanceBoundary[];
  futureUiBoundaryNotes: string[];
  safeOperatorGuidanceWording: string[];
  forbiddenDrivingForDollarsSemantics: R64ForbiddenDrivingForDollarsSemantic[];
  deterministicInvariants: string[];
  failClosedRules: string[];
  accessibilityRequirements: string[];
  preImplementationAuditFindings: R64PreImplementationAuditFinding[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R64ScopeSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R64ScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 44;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R64ScopeSafetyFlags = {
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

const allowedIntelligenceConcepts: R64DrivingForDollarsConcept[] = [
  "governance_stop_visibility",
  "manual_property_review_priority",
  "visible_distress_signal_review",
  "vacancy_signal_visibility",
  "deferred_maintenance_review",
  "overgrowth_signal_review",
  "boarded_broken_feature_visibility",
  "neighborhood_opportunity_visibility",
  "acquisition_review_priority",
  "ownership_research_needed",
  "property_condition_review_needed",
  "lead_quality_concern_visibility",
  "stale_field_observation_review",
  "incomplete_property_data_visibility",
  "duplicate_property_review",
  "human_verification_required",
  "manual_follow_up_recommended",
  "revenue_potential_visibility",
  "acquisition_bottleneck_visibility",
  "review_needed_prioritization",
  "operator_attention_guidance",
  "stale_property_recovery_visibility",
  "field_note_quality_review",
  "workload_prioritization_visibility",
  "human_only_decision_support",
];

const rankingConcepts: R64DrivingForDollarsRankingConcept[] = allowedIntelligenceConcepts.map((concept, index) => ({
  concept,
  rank: index + 1,
  revenueReason:
    concept === "governance_stop_visibility"
      ? "Governance stop signals must outrank distress visibility, revenue opportunity, stale-property urgency, acquisition momentum, workload pressure, and neighborhood opportunity visibility."
      : "Driving-for-dollars intelligence may improve property review quality and revenue prioritization only through manual operator review.",
  safeOperatorGuidance:
    concept === "governance_stop_visibility"
      ? "Governance stop signals must be resolved before any property review guidance is considered."
      : "Manual property review may be beneficial; verify property context before taking action.",
  boundary:
    concept === "governance_stop_visibility"
      ? "Stop signals are visibility only and cannot approve outreach, provider activation, route automation, scraping, skip tracing, or workflow execution."
      : "Priority is advisory only and never means contact owner, send communication, launch outreach, activate providers, execute acquisition workflow, trigger campaigns, route operators automatically, or automate lead generation.",
}));

const forbiddenDrivingForDollarsSemantics: R64ForbiddenDrivingForDollarsSemantic[] = [
  "auto contact owner",
  "auto skip trace",
  "auto call",
  "auto SMS",
  "auto email",
  "auto mailer",
  "auto campaign",
  "auto route driver",
  "auto assign acquisition rep",
  "auto scrape owner data",
  "auto pull phone numbers",
  "auto generate offers",
  "auto negotiate",
  "autonomous acquisition",
  "autonomous outreach",
  "autonomous property targeting",
  "autonomous route planning",
  "GPS activation",
  "provider activation",
  "runtime activation",
  "polling",
  "workflow execution",
  "approval escalation",
  "approval grants execution",
];

const deterministicScope: R64ScopeResult["deterministicScope"] = {
  phase: "R64A",
  purpose: "Define driving-for-dollars intelligence concepts, governance boundaries, future UI expectations, and fail-closed rules without implementing UI or execution.",
  implementationAllowed: false,
  routeChangesAllowed: false,
  providerConnectivityAllowed: false,
  gpsMapActivationAllowed: false,
  scrapingAllowed: false,
  skipTracingAllowed: false,
  persistenceAllowed: false,
  runtimeActivationAllowed: false,
  executionControlsAllowed: false,
};

const governanceBoundaries: R64GovernanceBoundary[] = [
  {
    rule: "Governance stop signals render first.",
    priority: 1,
    enforcement: "Governance stop visibility outranks distress visibility, revenue opportunity, stale-property urgency, acquisition momentum, workload pressure, and neighborhood opportunity visibility.",
  },
  {
    rule: "Driving-for-dollars priority is advisory only.",
    priority: 2,
    enforcement: "Priority means manual review may be beneficial; it never means contact owner, send communication, launch outreach, activate providers, execute acquisition workflow, trigger campaigns, route operators automatically, or automate lead generation.",
  },
  {
    rule: "R64A cannot implement UI.",
    priority: 3,
    enforcement: "This contract only defines future boundaries for read-only dashboard visibility and cannot add components, routes, providers, persistence, polling, GPS/map activation, scraping, skip tracing, or runtime activation.",
  },
  {
    rule: "Human verification remains required.",
    priority: 4,
    enforcement: "Distress, vacancy, stale property, ownership research, and lead quality signals remain operator-review concepts and cannot create autonomous targeting or acquisition decisions.",
  },
];

const futureUiBoundaryNotes = [
  "Future UI may use existing dashboard placement only after explicit implementation authorization.",
  "Future UI may show distress, vacancy, stale-property, field-note quality, revenue-opportunity, and acquisition-review visibility as read-only advisory summaries.",
  "Future UI must not add a GPS map, map provider integration, auto route driver, provider console, scraping panel, skip-tracing panel, campaign panel, seller outreach panel, execution queue, or approval-to-execution workflow.",
  "Future UI must keep governance stop signals before property priority, revenue-potential, workload, neighborhood opportunity, and stale-property guidance.",
  "Future UI must use text-based status meaning, semantic headings, readable labels, concise screen-reader-friendly summaries, predictable reading order, no motion dependency, no focus movement, no auto-refresh, and no polling.",
];

const safeOperatorGuidanceWording = [
  "Manual property review recommended.",
  "Driving-for-dollars priority label is advisory only.",
  "Review property context before taking action.",
  "Human verification required before acquisition action.",
  "Field-note quality review needed.",
  "Governance stop signals must be resolved first.",
  "Property priority does not mean contact owner.",
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
  "uiImplementationAllowedNow must remain false in R64A.",
  "Governance stop signals must rank first.",
  "No provider, GPS/map, scraping, skip-tracing, outreach, campaign, execution, persistence, polling, or runtime activation can be authorized.",
];

const failClosedRules = [
  "Missing operator review keeps the scope in operator_review_required status.",
  "Any request for UI implementation, route changes, provider activation, GPS/map activation, scraping, skip tracing, outreach execution, campaigns, polling, persistence, runtime activation, execution controls, autonomous acquisition, autonomous property targeting, autonomous route planning, or approval-grants-execution blocks the scope.",
  "Unsafe input flags are never echoed into output safety flags.",
  "Extra notes are bounded and cannot expand the authorized scope.",
];

const accessibilityRequirements = [
  "Future UI must use semantic headings.",
  "Future UI must use readable labels and screen-reader-friendly summaries.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling is allowed.",
  "Reading order must place governance stop visibility before advisory property review guidance.",
];

const preImplementationAuditFindings: R64PreImplementationAuditFinding[] = [
  { classification: "Required before implementation", finding: "Governance stop dominance must be preserved before any R64 UI planning or implementation." },
  { classification: "Safe to include now", finding: "Read-only driving-for-dollars concepts, forbidden semantics, future UI boundaries, and fail-closed invariants." },
  { classification: "Future upgrade", finding: "Dashboard visualization may be scoped after R64B and R64C authorize the exact read-only surface." },
  { classification: "Optional optimization", finding: "Shared governance helper extraction may be considered later if it reduces duplication without broadening scope." },
  { classification: "Forbidden because it violates governance", finding: "Any GPS/map activation, scraping, skip tracing, seller outreach, campaign, provider activation, autonomous acquisition, autonomous property targeting, or workflow execution behavior." },
];

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);
  return normalized.length <= maxTextLength ? normalized : `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  return value.length <= maxSummaryLength ? value : `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R64ScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);
  return notes;
}

function hasForbiddenRequest(input: R64ScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.providerActivationRequested === true ||
    input.gpsMapActivationRequested === true ||
    input.scrapingRequested === true ||
    input.skipTracingRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.runtimeActivationRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousAcquisitionRequested === true ||
    input.autonomousPropertyTargetingRequested === true ||
    input.autonomousRoutePlanningRequested === true ||
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

export function assertR64DrivingForDollarsScopeInvariants(
  result: Pick<
    R64ScopeResult,
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
): R64ScopeInvariantCheck {
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

export function summarizeR64DrivingForDollarsScope(result: R64ScopeResult) {
  const invariantCheck = assertR64DrivingForDollarsScopeInvariants(result);
  return boundSummary(
    `R64A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedIntelligenceConcepts.length} driving-for-dollars concepts and ${result.rankingConcepts.length} ranking concepts are scoped. ` +
      `${result.forbiddenDrivingForDollarsSemantics.length} forbidden driving-for-dollars semantics are blocked. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract cannot authorize UI implementation, routes, providers, GPS/map activation, scraping, skip tracing, outreach, campaigns, persistence, polling, execution controls, autonomous acquisition, autonomous property targeting, autonomous route planning, or runtime activation.",
  );
}

export function createR64DrivingForDollarsIntelligenceScopeContract(input: R64ScopeInput = {}): R64ScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r64a_scope_contract_only");
  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r63fLockdownReviewed !== true) addWarning(warningCodes, "r63f_lockdown_review_required");
  if (input.allowedConceptsReviewed !== true) addWarning(warningCodes, "allowed_concepts_review_required");
  if (input.distressVisibilityReviewed !== true) addWarning(warningCodes, "distress_visibility_review_required");
  if (input.stalePropertyReviewed !== true) addWarning(warningCodes, "stale_property_review_required");
  if (input.acquisitionReviewReviewed !== true) addWarning(warningCodes, "acquisition_review_required");
  if (input.fieldNoteQualityReviewed !== true) addWarning(warningCodes, "field_note_quality_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.futureUiReviewed !== true) addWarning(warningCodes, "future_ui_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.gpsMapActivationRequested === true) addWarning(warningCodes, "gps_map_activation_rejected");
  if (input.scrapingRequested === true) addWarning(warningCodes, "scraping_rejected");
  if (input.skipTracingRequested === true) addWarning(warningCodes, "skip_tracing_rejected");
  if (input.outreachExecutionRequested === true) addWarning(warningCodes, "outreach_execution_rejected");
  if (input.campaignLaunchRequested === true) addWarning(warningCodes, "campaign_launch_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousAcquisitionRequested === true) addWarning(warningCodes, "autonomous_acquisition_rejected");
  if (input.autonomousPropertyTargetingRequested === true) addWarning(warningCodes, "autonomous_property_targeting_rejected");
  if (input.autonomousRoutePlanningRequested === true) addWarning(warningCodes, "autonomous_route_planning_rejected");
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
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r63fLockdownReviewed !== true ||
    input.allowedConceptsReviewed !== true ||
    input.distressVisibilityReviewed !== true ||
    input.stalePropertyReviewed !== true ||
    input.acquisitionReviewReviewed !== true ||
    input.fieldNoteQualityReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.futureUiReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R64DrivingForDollarsScopeStatus = hasForbiddenRequest(input)
    ? "driving_for_dollars_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "driving_for_dollars_scope_ready";
  const result: R64ScopeResult = {
    phase: "R64A",
    surface: "driving_for_dollars_intelligence_scope",
    scopeStatus,
    allowedIntelligenceConcepts,
    rankingConcepts,
    deterministicScope,
    governanceBoundaries,
    futureUiBoundaryNotes,
    safeOperatorGuidanceWording,
    forbiddenDrivingForDollarsSemantics,
    deterministicInvariants,
    failClosedRules,
    accessibilityRequirements,
    preImplementationAuditFindings,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R64B - Driving-for-Dollars Intelligence UI Scope Audit",
    summary: "R64A driving-for-dollars intelligence scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR64DrivingForDollarsScope(result) };
}
