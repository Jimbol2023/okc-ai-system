import { evaluateExecutionPolicy, type ExecutionMode, type ExecutionPolicyReasonCode } from "@/lib/execution-policy";
import { evaluateProviderBoundary, type ProviderBoundaryReasonCode, type ProviderActionCategory } from "@/lib/provider-boundary";

export type ApprovalSendHandoffStage =
  | "collect_approved_message"
  | "verify_lead_context"
  | "verify_dnc_clear"
  | "verify_human_approval"
  | "evaluate_execution_policy"
  | "evaluate_provider_boundary"
  | "produce_send_preview"
  | "require_final_operator_action";

export type ApprovalSendHandoffInput = {
  leadId: string;
  message: string;
  channel: ProviderActionCategory;
  approvalStatus: string;
  doNotContact?: boolean;
  optOutReason?: string | null;
  operatorConfirmed?: boolean;
  executionMode?: ExecutionMode;
};

export type ApprovalSendPathReasonCode =
  | ExecutionPolicyReasonCode
  | ProviderBoundaryReasonCode
  | "missing_lead_id"
  | "missing_message"
  | "unapproved_for_outreach"
  | "final_operator_action_required";

export type ApprovalSendPathStageResult = {
  stage: ApprovalSendHandoffStage;
  passed: boolean;
  reasonCodes: ApprovalSendPathReasonCode[];
};

export type ApprovalSendPathPreview = {
  allowed: boolean;
  canSendNow: false;
  sent: false;
  providerCalled: false;
  requiresFinalOperatorAction: boolean;
  reasonCodes: ApprovalSendPathReasonCode[];
  stages: ApprovalSendPathStageResult[];
  safetySummary: string;
};

const approvalSendPathStages: ApprovalSendHandoffStage[] = [
  "collect_approved_message",
  "verify_lead_context",
  "verify_dnc_clear",
  "verify_human_approval",
  "evaluate_execution_policy",
  "evaluate_provider_boundary",
  "produce_send_preview",
  "require_final_operator_action",
];

function addReason(reasonCodes: ApprovalSendPathReasonCode[], reasonCode: ApprovalSendPathReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function getUniqueReasonCodes(reasonCodes: ApprovalSendPathReasonCode[]) {
  return reasonCodes.filter((reasonCode, index) => reasonCodes.indexOf(reasonCode) === index);
}

function buildStage(stage: ApprovalSendHandoffStage, passed: boolean, reasonCodes: ApprovalSendPathReasonCode[] = []): ApprovalSendPathStageResult {
  return {
    stage,
    passed,
    reasonCodes: getUniqueReasonCodes(reasonCodes),
  };
}

export function listApprovalSendPathStages() {
  return [...approvalSendPathStages];
}

export function summarizeApprovalSendPath(preview: ApprovalSendPathPreview) {
  const blockedStageCount = preview.stages.filter((stage) => !stage.passed).length;

  return `${preview.stages.length} handoff stages evaluated. ${blockedStageCount} stages require attention. No SMS, email, or provider call was made.`;
}

export function createApprovalSendPathPreview(input: ApprovalSendHandoffInput): ApprovalSendPathPreview {
  const message = input.message.trim();
  const leadId = input.leadId.trim();
  const approved = input.approvalStatus === "approved_for_outreach";
  const dncBlocked = Boolean(input.doNotContact || input.optOutReason);
  const requiresFinalOperatorAction = !input.operatorConfirmed;
  const executionMode = input.executionMode ?? "approved_pending";
  const reasonCodes: ApprovalSendPathReasonCode[] = [];

  if (!leadId) addReason(reasonCodes, "missing_lead_id");
  if (!message) addReason(reasonCodes, "missing_message");
  if (!approved) addReason(reasonCodes, "unapproved_for_outreach");
  if (input.doNotContact) addReason(reasonCodes, "dnc_blocked");
  if (input.optOutReason) addReason(reasonCodes, "opt_out_blocked");
  if (requiresFinalOperatorAction) addReason(reasonCodes, "final_operator_action_required");

  const executionPolicy = evaluateExecutionPolicy({
    action: input.channel,
    mode: executionMode,
    hasHumanApproval: approved,
    doNotContact: input.doNotContact,
    optedOut: Boolean(input.optOutReason),
    requestedProviderCall: false,
    futureLiveTestExplicitlyEnabled: false,
  });
  const providerBoundary = evaluateProviderBoundary({
    action: input.channel,
    to: leadId,
    message,
    leadId,
    approved,
    dncBlocked,
    executionMode,
    providerMode: "mock",
    futureLiveTestExplicitlyEnabled: false,
  });

  for (const reasonCode of executionPolicy.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of providerBoundary.reasonCodes) addReason(reasonCodes, reasonCode);

  const stages: ApprovalSendPathStageResult[] = [
    buildStage("collect_approved_message", Boolean(message), message ? [] : ["missing_message"]),
    buildStage("verify_lead_context", Boolean(leadId), leadId ? [] : ["missing_lead_id"]),
    buildStage("verify_dnc_clear", !dncBlocked, dncBlocked ? ["dnc_blocked"] : []),
    buildStage("verify_human_approval", approved, approved ? [] : ["unapproved_for_outreach"]),
    buildStage("evaluate_execution_policy", executionPolicy.allowed, executionPolicy.reasonCodes),
    buildStage("evaluate_provider_boundary", providerBoundary.ok, providerBoundary.reasonCodes),
    buildStage("produce_send_preview", true),
    buildStage(
      "require_final_operator_action",
      Boolean(input.operatorConfirmed),
      input.operatorConfirmed ? [] : ["final_operator_action_required"],
    ),
  ];

  const preview: ApprovalSendPathPreview = {
    allowed: false,
    canSendNow: false,
    sent: false,
    providerCalled: false,
    requiresFinalOperatorAction,
    reasonCodes: getUniqueReasonCodes(reasonCodes),
    stages,
    safetySummary: "Approval send path preview only. Approval does not send, provider execution is blocked, and final operator action is required.",
  };

  return {
    ...preview,
    safetySummary: summarizeApprovalSendPath(preview),
  };
}
