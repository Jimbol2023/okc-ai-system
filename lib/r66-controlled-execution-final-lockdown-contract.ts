export type R66FinalLockdownStatus =
  | "lockdown_blocked"
  | "operator_review_required"
  | "final_lockdown_complete";

export type R66FinalLockdownInput = {
  r66eSafetyReviewCompleted?: boolean;
  dashboardSurfaceReviewed?: boolean;
  noExecutionReviewed?: boolean;
  noProviderReviewed?: boolean;
  noRuntimeReviewed?: boolean;
  noPollingReviewed?: boolean;
  noCampaignReviewed?: boolean;
  approvalSeparationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  executionFound?: boolean;
  providerActivationFound?: boolean;
  runtimeActivationFound?: boolean;
  pollingFound?: boolean;
  campaignFound?: boolean;
  approvalExecutionFound?: boolean;
  hiddenExecutionFound?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  approvalGrantsExecution?: boolean;
};

export type R66FinalLockdownFlags = {
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
  uiImplementationAllowedNow: true;
  executionAllowedNow: false;
  campaignActivationAllowed: false;
  backgroundJobsAllowed: false;
};

export type R66FinalLockdownResult = R66FinalLockdownFlags & {
  phase: "R66F";
  surface: "controlled_execution_readiness_dashboard_summary";
  lockdownStatus: R66FinalLockdownStatus;
  lockedFiles: string[];
  noExecutionLock: string[];
  providerRuntimeLock: string[];
  approvalSeparationLock: string[];
  accessibilityLock: string[];
  invariantAssertions: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R66FinalLockdownFlags;
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R66FinalLockdownFlags = {
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
  uiImplementationAllowedNow: true,
  executionAllowedNow: false,
  campaignActivationAllowed: false,
  backgroundJobsAllowed: false,
};

const lockedFiles = ["components/dashboard/controlled-execution-readiness-summary.tsx", "app/(dashboard)/dashboard/page.tsx"];
const noExecutionLock = [
  "R66 remains read-only and advisory-only.",
  "No send controls, provider controls, approval-to-send controls, runtime activation, polling, campaign controls, execution queues, workflow execution, automation controls, background jobs, or hidden execution state are allowed.",
  "Controlled execution readiness never means execute now, send now, activate provider, launch workflow, contact seller, contact buyer, or start automation.",
];
const providerRuntimeLock = [
  "Provider activation, Twilio activation, SMS/email/call activation, polling, runtime activation, persistence activation, background jobs, execution queues, and workflow runners remain blocked.",
];
const approvalSeparationLock = [
  "Approval does not equal execution.",
  "Approval cannot send messages, trigger providers, start workflows, create queues, launch campaigns, or run automation.",
  "Governance review comes first and must fail closed when incomplete.",
];
const accessibilityLock = [
  "Use semantic headings, aria-labelledby, aria-describedby, readable labels, concise summaries, and text-based status meaning.",
  "No color-only meaning, motion dependency, focus movement, auto-refresh, or polling.",
];
const invariantAssertions = [
  "readOnly:true",
  "advisoryOnly:true",
  "simulationOnly:true",
  "providerCalled:false",
  "sent:false",
  "persistenceAllowedNow:false",
  "pollingAllowed:false",
  "runtimeActivationAllowed:false",
  "providerActivationAllowed:false",
  "approvalGrantsExecution:false",
  "uiImplementationAllowedNow:true",
  "executionAllowedNow:false",
  "campaignActivationAllowed:false",
  "backgroundJobsAllowed:false",
];

function addUnique(list: string[], value: string) {
  if (value && !list.includes(value)) list.push(value);
}

export function createR66ControlledExecutionFinalLockdownContract(input: R66FinalLockdownInput = {}): R66FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r66eSafetyReviewCompleted !== true) addUnique(warningCodes, "r66e_safety_review_required");
  if (input.dashboardSurfaceReviewed !== true) addUnique(warningCodes, "dashboard_surface_review_required");
  if (input.noExecutionReviewed !== true) addUnique(warningCodes, "no_execution_review_required");
  if (input.noProviderReviewed !== true) addUnique(warningCodes, "no_provider_review_required");
  if (input.noRuntimeReviewed !== true) addUnique(warningCodes, "no_runtime_review_required");
  if (input.noPollingReviewed !== true) addUnique(warningCodes, "no_polling_review_required");
  if (input.noCampaignReviewed !== true) addUnique(warningCodes, "no_campaign_review_required");
  if (input.approvalSeparationReviewed !== true) addUnique(warningCodes, "approval_separation_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  const foundMap: Array<[boolean | undefined, string]> = [
    [input.executionFound, "execution_found"],
    [input.providerActivationFound, "provider_activation_found"],
    [input.runtimeActivationFound, "runtime_activation_found"],
    [input.pollingFound, "polling_found"],
    [input.campaignFound, "campaign_found"],
    [input.approvalExecutionFound, "approval_execution_found"],
    [input.hiddenExecutionFound, "hidden_execution_found"],
  ];
  for (const [flag, code] of foundMap) if (flag === true) addUnique(warningCodes, code);
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");
  for (const code of warningCodes) if (code.includes("found") || code.endsWith("_required") || code.endsWith("_must_be_false")) addUnique(rejectionReasons, code);
  const missing =
    input.r66eSafetyReviewCompleted !== true ||
    input.dashboardSurfaceReviewed !== true ||
    input.noExecutionReviewed !== true ||
    input.noProviderReviewed !== true ||
    input.noRuntimeReviewed !== true ||
    input.noPollingReviewed !== true ||
    input.noCampaignReviewed !== true ||
    input.approvalSeparationReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const blocked = foundMap.some(([flag]) => flag === true) || input.providerCalled === true || input.sent === true || input.approvalGrantsExecution === true;
  const lockdownStatus: R66FinalLockdownStatus = blocked
    ? "lockdown_blocked"
    : missing
      ? "operator_review_required"
      : "final_lockdown_complete";
  return {
    phase: "R66F",
    surface: "controlled_execution_readiness_dashboard_summary",
    lockdownStatus,
    lockedFiles,
    noExecutionLock,
    providerRuntimeLock,
    approvalSeparationLock,
    accessibilityLock,
    invariantAssertions,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase: "R67A - Automation-Last Governance Scope Contract",
    summary: `R66F controlled execution final lockdown status is ${lockdownStatus}. No execution, provider activation, runtime activation, polling, campaigns, approval-to-execution escalation, or hidden execution affordance is allowed.`,
    ...safetyFlags,
  };
}
