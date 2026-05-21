export type R53ManualRevenueMetricDataSourceSafety =
  | "safe_read_only_now"
  | "safe_future_derived_metric"
  | "requires_audit_persistence_first"
  | "unsafe_until_runtime_activation_exists";

export type R53ManualRevenueMetricId =
  | "total_leads_provided"
  | "leads_needing_review"
  | "manually_reviewed_leads"
  | "manual_seller_calls_recorded"
  | "seller_outcomes_recorded"
  | "manual_follow_ups_due"
  | "manual_follow_ups_overdue"
  | "buyer_ready_leads"
  | "incomplete_buyer_packages"
  | "near_contract_opportunities"
  | "near_close_opportunities"
  | "blocked_leads"
  | "dnc_opt_out_blocked_leads"
  | "missing_critical_data_count"
  | "governance_blocked_count"
  | "human_review_required_count";

export type R53ManualRevenueUnsafeMetricId =
  | "live_send_count"
  | "provider_delivery_count"
  | "twilio_success_failure_count"
  | "automation_agent_cycle_count"
  | "autonomous_follow_up_count"
  | "persistence_backed_audit_log_count";

export type R53ManualRevenueMetricsHelperInput = {
  leads?: unknown[] | null;
  referenceDate?: string | Date | null;
  maxRecords?: number | null;
};

export type R53ManualRevenueMetric = {
  id: R53ManualRevenueMetricId;
  label: string;
  value: number;
  dataSourceSafety: R53ManualRevenueMetricDataSourceSafety;
  readOnly: true;
};

export type R53ManualRevenueExcludedMetric = {
  id: R53ManualRevenueUnsafeMetricId;
  label: string;
  dataSourceSafety: "unsafe_until_runtime_activation_exists" | "requires_audit_persistence_first";
  excluded: true;
  reason: string;
};

export type R53ManualRevenueMetricsResult = {
  sourceMode: "in_memory_input_only";
  inputRecordsProvided: number;
  inputRecordsProcessed: number;
  inputRecordsSkippedByBound: number;
  referenceDateSource: "provided" | "omitted_or_invalid";
  metrics: R53ManualRevenueMetric[];
  metricValues: Record<R53ManualRevenueMetricId, number>;
  excludedUnsafeMetrics: R53ManualRevenueExcludedMetric[];
  warningCodes: string[];
  summary: string;
  readOnly: true;
  persistenceWritten: false;
  providerCalled: false;
  sent: false;
  automationExecuted: false;
  pollingEnabled: false;
  liveExecutionAllowed: false;
  simulationOnly: true;
  advisoryOnly: true;
};

export type R53ManualRevenueMetricsInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

type LeadRecord = Record<string, unknown>;

const defaultMaxRecords = 500;
const absoluteMaxRecords = 1000;
const maxSummaryLength = 900;

function isRecord(value: unknown): value is LeadRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function booleanLike(value: unknown) {
  if (typeof value === "boolean") return value;

  const normalized = normalizeText(value);

  if (["true", "yes", "y", "1"].includes(normalized)) return true;
  if (["false", "no", "n", "0"].includes(normalized)) return false;

  return false;
}

function hasText(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null;
}

function textIn(record: LeadRecord, keys: string[]) {
  return keys.some((key) => hasText(record[key]));
}

function boolIn(record: LeadRecord, keys: string[]) {
  return keys.some((key) => booleanLike(record[key]));
}

function textMatches(record: LeadRecord, keys: string[], values: string[]) {
  return keys.some((key) => values.includes(normalizeText(record[key])));
}

function parseReferenceDate(value: R53ManualRevenueMetricsHelperInput["referenceDate"]) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
  if (typeof value === "string") {
    const parsed = Date.parse(value);

    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

function parseDateValue(value: unknown) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
  if (typeof value === "string") {
    const parsed = Date.parse(value);

    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

function boundMaxRecords(value: R53ManualRevenueMetricsHelperInput["maxRecords"]) {
  if (typeof value !== "number" || !Number.isFinite(value)) return defaultMaxRecords;
  if (value <= 0) return 0;

  return Math.min(Math.floor(value), absoluteMaxRecords);
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function hasFollowUpDue(record: LeadRecord) {
  return parseDateValue(record.followUpDueAt) ?? parseDateValue(record.nextFollowUpAt) ?? parseDateValue(record.nextFollowUpDate);
}

function isNeedingReview(record: LeadRecord) {
  return (
    boolIn(record, ["needsReview", "humanReviewRequired", "requiresReview"]) ||
    textMatches(record, ["status", "reviewStatus", "workflowStatus"], ["new", "needs_review", "pending_review", "unreviewed"])
  );
}

function isManuallyReviewed(record: LeadRecord) {
  return (
    boolIn(record, ["manuallyReviewed", "reviewed", "operatorReviewed"]) ||
    textMatches(record, ["reviewStatus"], ["reviewed", "manual_reviewed", "operator_reviewed"]) ||
    hasText(record.reviewedAt)
  );
}

function hasManualSellerCall(record: LeadRecord) {
  return (
    boolIn(record, ["manualSellerCallRecorded", "sellerCallRecorded", "calledManually"]) ||
    textMatches(record, ["lastContactType", "contactType", "sellerContactMethod"], ["manual_call", "seller_call", "phone_call"]) ||
    hasText(record.sellerCallAt)
  );
}

function hasSellerOutcome(record: LeadRecord) {
  return textIn(record, ["sellerOutcome", "sellerCallOutcome", "callOutcome", "outcome", "sellerStatus"]);
}

function isBuyerReady(record: LeadRecord) {
  return (
    boolIn(record, ["buyerReady", "readyForBuyerReview", "dispositionReady"]) ||
    textMatches(record, ["buyerReadiness", "dispositionStatus", "status"], ["buyer_ready", "ready_for_buyers", "disposition_ready"])
  );
}

function hasCompleteBuyerPackage(record: LeadRecord) {
  return (
    boolIn(record, ["buyerPackageComplete", "dispositionPackageComplete", "packageComplete"]) ||
    textMatches(record, ["buyerPackageStatus", "dispositionPackageStatus"], ["complete", "ready", "buyer_ready"])
  );
}

function isNearContract(record: LeadRecord) {
  return textMatches(record, ["stage", "pipelineStage", "status"], ["near_contract", "offer_ready", "contract_review", "pending_contract"]);
}

function isNearClose(record: LeadRecord) {
  return textMatches(record, ["stage", "pipelineStage", "status"], ["near_close", "under_contract", "closing_ready", "title_review"]);
}

function isBlocked(record: LeadRecord) {
  return (
    boolIn(record, ["blocked", "isBlocked"]) ||
    textMatches(record, ["status", "workflowStatus"], ["blocked", "do_not_proceed", "paused"]) ||
    hasText(record.blockedReason)
  );
}

function isDncOptOutBlocked(record: LeadRecord) {
  return (
    boolIn(record, ["dnc", "doNotContact", "optOut", "optedOut"]) ||
    textMatches(record, ["status", "blockedReason", "complianceStatus"], ["dnc", "do_not_contact", "opt_out", "opted_out"])
  );
}

function hasMissingCriticalData(record: LeadRecord) {
  const hasSource = textIn(record, ["source", "leadSource"]);
  const hasAddress = textIn(record, ["address", "propertyAddress"]);
  const hasContact = textIn(record, ["phone", "phoneNumber", "email", "sellerPhone", "sellerEmail"]);
  const hasSellerContext = textIn(record, ["motivation", "sellerMotivation", "timeline", "sellerTimeline"]);

  return !hasSource || !hasAddress || !hasContact || !hasSellerContext;
}

function isGovernanceBlocked(record: LeadRecord) {
  return (
    boolIn(record, ["governanceBlocked", "safetyBlocked"]) ||
    textMatches(record, ["governanceStatus", "safetyStatus"], ["blocked", "activation_prohibited", "remediation_required"])
  );
}

function metric(
  id: R53ManualRevenueMetricId,
  label: string,
  value: number,
  dataSourceSafety: R53ManualRevenueMetricDataSourceSafety,
): R53ManualRevenueMetric {
  return {
    id,
    label,
    value,
    dataSourceSafety,
    readOnly: true,
  };
}

const excludedUnsafeMetrics: R53ManualRevenueExcludedMetric[] = [
  {
    id: "live_send_count",
    label: "Live send count",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    excluded: true,
    reason: "Live sending remains blocked and cannot be represented as an operational metric.",
  },
  {
    id: "provider_delivery_count",
    label: "Provider delivery count",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    excluded: true,
    reason: "Provider delivery would require provider execution data.",
  },
  {
    id: "twilio_success_failure_count",
    label: "Twilio success/failure count",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    excluded: true,
    reason: "Twilio outbound sending is not activated.",
  },
  {
    id: "automation_agent_cycle_count",
    label: "Automation-agent cycle count",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    excluded: true,
    reason: "Automation-agent runtime metrics are excluded while automation remains blocked.",
  },
  {
    id: "autonomous_follow_up_count",
    label: "Autonomous follow-up count",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    excluded: true,
    reason: "Follow-up remains manual and operator-controlled.",
  },
  {
    id: "persistence_backed_audit_log_count",
    label: "Persistence-backed audit log count",
    dataSourceSafety: "requires_audit_persistence_first",
    excluded: true,
    reason: "Audit persistence is not active in this helper.",
  },
];

export function summarizeManualRevenueMetrics(result: R53ManualRevenueMetricsResult) {
  return boundSummary(
    `R53B manual revenue metrics derived ${result.inputRecordsProcessed} of ${result.inputRecordsProvided} provided records from ${result.sourceMode}. ` +
      `Review needed: ${result.metricValues.leads_needing_review}. Manual seller calls: ${result.metricValues.manual_seller_calls_recorded}. ` +
      `Follow-ups due: ${result.metricValues.manual_follow_ups_due}. Follow-ups overdue: ${result.metricValues.manual_follow_ups_overdue}. ` +
      `Buyer-ready leads: ${result.metricValues.buyer_ready_leads}. Blocked leads: ${result.metricValues.blocked_leads}. ` +
      "The result is read-only, advisory-only, simulation-only, non-persistent, non-polling, and cannot authorize providers, sending, automation, or live execution.",
  );
}

export function assertManualRevenueMetricsInvariants(
  result: Pick<
    R53ManualRevenueMetricsResult,
    | "sourceMode"
    | "readOnly"
    | "persistenceWritten"
    | "providerCalled"
    | "sent"
    | "automationExecuted"
    | "pollingEnabled"
    | "liveExecutionAllowed"
    | "simulationOnly"
    | "advisoryOnly"
  >,
): R53ManualRevenueMetricsInvariantCheck {
  const warningCodes: string[] = [];

  if (result.sourceMode !== "in_memory_input_only") warningCodes.push("source_mode_must_be_in_memory_input_only");
  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.persistenceWritten !== false) warningCodes.push("persistence_written_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.automationExecuted !== false) warningCodes.push("automation_executed_must_be_false");
  if (result.pollingEnabled !== false) warningCodes.push("polling_enabled_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function deriveManualRevenueMetrics(
  input: R53ManualRevenueMetricsHelperInput = {},
): R53ManualRevenueMetricsResult {
  const providedLeads = Array.isArray(input.leads) ? input.leads : [];
  const maxRecords = boundMaxRecords(input.maxRecords);
  const records = providedLeads.slice(0, maxRecords).filter(isRecord);
  const referenceTime = parseReferenceDate(input.referenceDate);
  const warningCodes: string[] = [];

  if (!Array.isArray(input.leads) && input.leads !== undefined && input.leads !== null) {
    warningCodes.push("leads_input_not_array");
  }

  if (providedLeads.length > maxRecords) warningCodes.push("input_bounded");
  if (records.length < Math.min(providedLeads.length, maxRecords)) warningCodes.push("malformed_records_skipped");
  if (input.referenceDate !== undefined && input.referenceDate !== null && referenceTime === null) {
    warningCodes.push("invalid_reference_date_ignored");
  }

  const counts: Record<R53ManualRevenueMetricId, number> = {
    total_leads_provided: providedLeads.length,
    leads_needing_review: 0,
    manually_reviewed_leads: 0,
    manual_seller_calls_recorded: 0,
    seller_outcomes_recorded: 0,
    manual_follow_ups_due: 0,
    manual_follow_ups_overdue: 0,
    buyer_ready_leads: 0,
    incomplete_buyer_packages: 0,
    near_contract_opportunities: 0,
    near_close_opportunities: 0,
    blocked_leads: 0,
    dnc_opt_out_blocked_leads: 0,
    missing_critical_data_count: 0,
    governance_blocked_count: 0,
    human_review_required_count: 0,
  };

  for (const record of records) {
    if (isNeedingReview(record)) counts.leads_needing_review += 1;
    if (isManuallyReviewed(record)) counts.manually_reviewed_leads += 1;
    if (hasManualSellerCall(record)) counts.manual_seller_calls_recorded += 1;
    if (hasSellerOutcome(record)) counts.seller_outcomes_recorded += 1;

    const followUpDueAt = hasFollowUpDue(record);

    if (followUpDueAt !== null) {
      counts.manual_follow_ups_due += 1;

      if (referenceTime !== null && followUpDueAt < referenceTime) {
        counts.manual_follow_ups_overdue += 1;
      }
    }

    const buyerReady = isBuyerReady(record);

    if (buyerReady) counts.buyer_ready_leads += 1;
    if (buyerReady && !hasCompleteBuyerPackage(record)) counts.incomplete_buyer_packages += 1;
    if (isNearContract(record)) counts.near_contract_opportunities += 1;
    if (isNearClose(record)) counts.near_close_opportunities += 1;
    if (isBlocked(record)) counts.blocked_leads += 1;
    if (isDncOptOutBlocked(record)) counts.dnc_opt_out_blocked_leads += 1;
    if (hasMissingCriticalData(record)) counts.missing_critical_data_count += 1;
    if (isGovernanceBlocked(record)) counts.governance_blocked_count += 1;
    if (boolIn(record, ["humanReviewRequired", "manualReviewRequired", "requiresHumanReview"])) {
      counts.human_review_required_count += 1;
    }
  }

  const metrics: R53ManualRevenueMetric[] = [
    metric("total_leads_provided", "Total leads provided", counts.total_leads_provided, "safe_read_only_now"),
    metric("leads_needing_review", "Leads needing review", counts.leads_needing_review, "safe_read_only_now"),
    metric("manually_reviewed_leads", "Manually reviewed leads", counts.manually_reviewed_leads, "safe_read_only_now"),
    metric("manual_seller_calls_recorded", "Manual seller calls recorded", counts.manual_seller_calls_recorded, "safe_read_only_now"),
    metric("seller_outcomes_recorded", "Seller outcomes recorded", counts.seller_outcomes_recorded, "safe_read_only_now"),
    metric("manual_follow_ups_due", "Manual follow-ups due", counts.manual_follow_ups_due, "safe_read_only_now"),
    metric("manual_follow_ups_overdue", "Manual follow-ups overdue", counts.manual_follow_ups_overdue, "safe_read_only_now"),
    metric("buyer_ready_leads", "Buyer-ready leads", counts.buyer_ready_leads, "safe_read_only_now"),
    metric(
      "incomplete_buyer_packages",
      "Incomplete buyer packages",
      counts.incomplete_buyer_packages,
      "safe_future_derived_metric",
    ),
    metric(
      "near_contract_opportunities",
      "Near-contract opportunities",
      counts.near_contract_opportunities,
      "safe_read_only_now",
    ),
    metric("near_close_opportunities", "Near-close opportunities", counts.near_close_opportunities, "safe_read_only_now"),
    metric("blocked_leads", "Blocked leads", counts.blocked_leads, "safe_read_only_now"),
    metric("dnc_opt_out_blocked_leads", "DNC/opt-out blocked leads", counts.dnc_opt_out_blocked_leads, "safe_read_only_now"),
    metric(
      "missing_critical_data_count",
      "Missing critical data count",
      counts.missing_critical_data_count,
      "safe_future_derived_metric",
    ),
    metric(
      "governance_blocked_count",
      "Governance-blocked count",
      counts.governance_blocked_count,
      "safe_future_derived_metric",
    ),
    metric(
      "human_review_required_count",
      "Human-review-required count",
      counts.human_review_required_count,
      "safe_read_only_now",
    ),
  ];

  const result: R53ManualRevenueMetricsResult = {
    sourceMode: "in_memory_input_only",
    inputRecordsProvided: providedLeads.length,
    inputRecordsProcessed: records.length,
    inputRecordsSkippedByBound: Math.max(0, providedLeads.length - maxRecords),
    referenceDateSource: referenceTime === null ? "omitted_or_invalid" : "provided",
    metrics,
    metricValues: counts,
    excludedUnsafeMetrics,
    warningCodes,
    summary: "R53B manual revenue metrics helper.",
    readOnly: true,
    persistenceWritten: false,
    providerCalled: false,
    sent: false,
    automationExecuted: false,
    pollingEnabled: false,
    liveExecutionAllowed: false,
    simulationOnly: true,
    advisoryOnly: true,
  };

  return {
    ...result,
    summary: summarizeManualRevenueMetrics(result),
  };
}
