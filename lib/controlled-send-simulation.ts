import {
  createApprovalSendPathPreview,
  type ApprovalSendHandoffInput,
  type ApprovalSendPathPreview,
  type ApprovalSendPathReasonCode,
} from "@/lib/approval-send-path-design";
import { evaluateExecutionPolicy, type ExecutionMode, type ExecutionPolicyDecision } from "@/lib/execution-policy";
import {
  evaluateProviderBoundary,
  type ProviderBoundaryResponse,
  type ProviderMode,
  type ProviderActionCategory,
} from "@/lib/provider-boundary";

export type ControlledSendSimulationInput = {
  leadId: string;
  message: string;
  channel: ProviderActionCategory;
  approvalStatus: string;
  doNotContact?: boolean;
  optOutReason?: string | null;
  operatorConfirmed?: boolean;
  executionMode?: ExecutionMode;
  providerMode?: ProviderMode;
};

export type ControlledSendSimulationResult = {
  ok: boolean;
  simulationOnly: true;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  requiresFinalOperatorAction: boolean;
  reasonCodes: ApprovalSendPathReasonCode[];
  policyDecision: ExecutionPolicyDecision;
  providerDecision: ProviderBoundaryResponse;
  sendPathPreview: ApprovalSendPathPreview;
  safetySummary: string;
};

export type SimulationInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "simulation_only_required"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
  >;
};

function uniqueReasonCodes(reasonCodes: ApprovalSendPathReasonCode[]) {
  return reasonCodes.filter((reasonCode, index) => reasonCodes.indexOf(reasonCode) === index);
}

export function assertSimulationInvariants(result: ControlledSendSimulationResult): SimulationInvariantCheck {
  const reasonCodes: SimulationInvariantCheck["reasonCodes"] = [];

  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeControlledSendSimulation(result: ControlledSendSimulationResult) {
  const invariantCheck = assertSimulationInvariants(result);
  const blockedStageCount = result.sendPathPreview.stages.filter((stage) => !stage.passed).length;

  return (
    `Controlled send simulation reviewed ${result.sendPathPreview.stages.length} handoff stages. ` +
    `${blockedStageCount} stages require attention. ` +
    `Simulation invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "No SMS, email, provider call, API call, automation execution, or DB write occurred."
  );
}

export function createControlledSendSimulation(input: ControlledSendSimulationInput): ControlledSendSimulationResult {
  const executionMode = input.executionMode ?? "approved_pending";
  const providerMode = input.providerMode ?? "mock";
  const approved = input.approvalStatus === "approved_for_outreach";
  const dncBlocked = Boolean(input.doNotContact || input.optOutReason);
  const handoffInput: ApprovalSendHandoffInput = {
    leadId: input.leadId,
    message: input.message,
    channel: input.channel,
    approvalStatus: input.approvalStatus,
    doNotContact: input.doNotContact,
    optOutReason: input.optOutReason,
    operatorConfirmed: input.operatorConfirmed,
    executionMode,
  };
  const sendPathPreview = createApprovalSendPathPreview(handoffInput);
  const policyDecision = evaluateExecutionPolicy({
    action: input.channel,
    mode: executionMode,
    hasHumanApproval: approved,
    doNotContact: input.doNotContact,
    optedOut: Boolean(input.optOutReason),
    requestedProviderCall: providerMode === "future_live_test",
    futureLiveTestExplicitlyEnabled: false,
  });
  const providerDecision = evaluateProviderBoundary({
    action: input.channel,
    to: input.leadId,
    message: input.message,
    leadId: input.leadId,
    approved,
    dncBlocked,
    executionMode,
    providerMode,
    futureLiveTestExplicitlyEnabled: false,
  });
  const reasonCodes = uniqueReasonCodes([
    ...sendPathPreview.reasonCodes,
    ...policyDecision.reasonCodes,
    ...providerDecision.reasonCodes,
  ]);
  const result: ControlledSendSimulationResult = {
    ok: false,
    simulationOnly: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    requiresFinalOperatorAction: true,
    reasonCodes,
    policyDecision,
    providerDecision,
    sendPathPreview,
    safetySummary: "Controlled send simulation only. Operator confirmation, approval, and provider readiness do not send in R45E.",
  };

  return {
    ...result,
    safetySummary: summarizeControlledSendSimulation(result),
  };
}
