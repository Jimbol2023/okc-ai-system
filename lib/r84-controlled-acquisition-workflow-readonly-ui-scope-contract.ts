import {
  r84AccessibilityRequirements,
  r84AdvisoryWorkflowCategories,
  r84ScopeFlags,
} from "./r84-controlled-acquisition-workflow-intelligence-scope-contract";
import { r84BlockedDriftTransitions } from "./r84-controlled-acquisition-workflow-drift-risk-audit";

export const r84ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/controlled-acquisition-workflow-intelligence-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r84ReadonlyUiWording = {
  workflowIntelligence: "Workflow intelligence is read-only and advisory only.",
  manualSequence: "Manual sequence labels help operators decide what to review; they do not automate work.",
  bottleneck: "Bottleneck visibility is a human review signal only and does not activate providers.",
  stalledWorkflow: "Stalled workflow visibility does not authorize scraping, sourcing, or external lookup.",
  throughputVisibility: "Throughput visibility can inform manual prioritization without runtime jobs or polling.",
  manualReviewOnly: "Operator should review before any action.",
  noExecution: "No provider, contact, outreach, automation, or execution is authorized.",
  noContact: "Seller and buyer contact remain blocked unless a separate human-governed process authorizes it outside R84.",
  noProvider: "Provider activation remains blocked.",
} as const;

export const r84ReadonlyUiForbiddenControls = [
  "buttons",
  "forms",
  "inputs",
  "click handlers",
  "execution controls",
  "outreach controls",
  "provider controls",
  "automation controls",
  "runtime controls",
  "fetch/network behavior",
  "persistence behavior",
  "audit writing",
] as const;

export const r84ReadonlyUiFlags = {
  ...r84ScopeFlags,
  uiScopeOnly: true,
  implementationAllowedNow: false,
  buttonsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  clickHandlersAllowed: false,
  executionControlsAllowed: false,
  outreachControlsAllowed: false,
  providerControlsAllowed: false,
  automationControlsAllowed: false,
  runtimeControlsAllowed: false,
  fetchNetworkBehaviorAllowed: false,
  persistenceBehaviorAllowed: false,
  auditWritingBehaviorAllowed: false,
} as const;

export type R84ReadonlyUiStatus = "controlled_acquisition_workflow_ui_scope_blocked" | "operator_review_required" | "controlled_acquisition_workflow_ui_scope_ready";

export type R84ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  workflowIntelligenceWordingReviewed?: boolean;
  manualSequenceWordingReviewed?: boolean;
  bottleneckWordingReviewed?: boolean;
  stalledWorkflowWordingReviewed?: boolean;
  throughputVisibilityWordingReviewed?: boolean;
  manualReviewOnlyWordingReviewed?: boolean;
  noExecutionWordingReviewed?: boolean;
  noContactWordingReviewed?: boolean;
  noProviderWordingReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  clickHandlerRequested?: boolean;
  executionControlRequested?: boolean;
  outreachControlRequested?: boolean;
  providerControlRequested?: boolean;
  automationControlRequested?: boolean;
  runtimeControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R84ReadonlyUiResult = {
  phase: "R84C";
  status: R84ReadonlyUiStatus;
  flags: typeof r84ReadonlyUiFlags;
  authorizedSurfaces: typeof r84ReadonlyUiAuthorizedSurfaces;
  wording: typeof r84ReadonlyUiWording;
  advisoryCategories: typeof r84AdvisoryWorkflowCategories;
  forbiddenControls: typeof r84ReadonlyUiForbiddenControls;
  blockedDriftTransitions: typeof r84BlockedDriftTransitions;
  accessibility: typeof r84AccessibilityRequirements;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R84D - Controlled Acquisition Workflow Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R84ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["workflowIntelligenceWordingReviewed", "workflow intelligence wording"],
  ["manualSequenceWordingReviewed", "manual sequence wording"],
  ["bottleneckWordingReviewed", "bottleneck wording"],
  ["stalledWorkflowWordingReviewed", "stalled workflow wording"],
  ["throughputVisibilityWordingReviewed", "throughput visibility wording"],
  ["manualReviewOnlyWordingReviewed", "manual-review-only wording"],
  ["noExecutionWordingReviewed", "no-execution wording"],
  ["noContactWordingReviewed", "no-contact wording"],
  ["noProviderWordingReviewed", "no-provider wording"],
  ["forbiddenControlsReviewed", "forbidden UI controls"],
  ["accessibilityReviewed", "accessibility requirements"],
];

const blockedReasons: Array<[keyof R84ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R84C is scope-only; UI implementation waits for R84D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["clickHandlerRequested", "click handlers remain forbidden"],
  ["executionControlRequested", "execution controls remain forbidden"],
  ["outreachControlRequested", "outreach controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["automationControlRequested", "automation controls remain forbidden"],
  ["runtimeControlRequested", "runtime controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
];

export function assertR84ReadonlyUiScopeInvariants(result: R84ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.uiScopeOnly) {
    throw new Error("R84C must authorize read-only advisory UI scope only");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "uiScopeOnly"].includes(key) && value === true)) {
    throw new Error("R84C cannot authorize UI controls, providers, outreach, automation, runtime, network behavior, persistence, audit writing, or execution");
  }
}

export function createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract(input: R84ReadonlyUiInput = {}): R84ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R84ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "controlled_acquisition_workflow_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_acquisition_workflow_ui_scope_ready";
  const result: R84ReadonlyUiResult = {
    phase: "R84C",
    status,
    flags: r84ReadonlyUiFlags,
    authorizedSurfaces: r84ReadonlyUiAuthorizedSurfaces,
    wording: r84ReadonlyUiWording,
    advisoryCategories: r84AdvisoryWorkflowCategories,
    forbiddenControls: r84ReadonlyUiForbiddenControls,
    blockedDriftTransitions: r84BlockedDriftTransitions,
    accessibility: r84AccessibilityRequirements,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R84D - Controlled Acquisition Workflow Read-Only UI Implementation",
  };
  assertR84ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR84ControlledAcquisitionWorkflowReadonlyUiScope(result: R84ReadonlyUiResult): string {
  assertR84ReadonlyUiScopeInvariants(result);
  return `R84C ${result.status}: future Controlled Acquisition Workflow UI is limited to read-only advisory wording for workflow intelligence, manual sequence, bottlenecks, stalled workflows, throughput visibility, manual review, no execution, no contact, and no provider states.`;
}
