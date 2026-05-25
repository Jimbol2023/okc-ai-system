export const humanTriggeredProviderPilotPlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  pilotActivationAuthorized: false,
  providerActivated: false,
  providerClientCreated: false,
  providerEnvRead: false,
  providerSdkImported: false,
  twilioActivated: false,
  emailProviderActivated: false,
  smsProviderActivated: false,
  phoneProviderActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  emailSendingEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  sendPathCreated: false,
  callPathCreated: false,
  inboundWebhookCreated: false,
  routeCreated: false,
  campaignActivated: false,
  outreachEnabled: false,
  automationEnabled: false,
  autonomousFollowUpEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousNegotiationEnabled: false,
  communicationQueueCreated: false,
  queueSystemEnabled: false,
  reminderCreated: false,
  reminderSystemEnabled: false,
  runtimeJobCreated: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  crmMutationEnabled: false,
  auditWritingEnabled: false,
  approvalGrantsExecution: false,
  communicationExecutionAuthorized: false,
  goLiveAuthorized: false,
  spendIncreaseAuthorized: false,
  dncBypassAllowed: false,
  optOutBypassAllowed: false,
  stopBypassAllowed: false,
  rollbackExecutionEnabled: false,
} as const;

export type HumanTriggeredProviderPilotPlanningStatus =
  | "planning_only"
  | "pilot_shape_defined"
  | "blocked_until_human_authorization";

export type HumanTriggeredPilotDecision = "not_authorized_for_activation";
export type HumanTriggeredProviderDecision = "not_authorized";
export type HumanTriggeredCommunicationExecutionDecision = "not_authorized";
export type HumanTriggeredAutomationDecision = "not_authorized";

export type HumanTriggeredProviderPilotPlanningLaneKey =
  | "c6_infrastructure_gate_prerequisite"
  | "human_triggered_only_pilot_boundary"
  | "approval_gated_send_call_review"
  | "audited_pilot_evidence"
  | "revocation_rollback_planning"
  | "dnc_opt_out_stop_hard_blocker_preservation"
  | "provider_credential_env_boundary"
  | "no_campaign_no_autonomy_boundary"
  | "pilot_failure_state_planning"
  | "go_live_readiness";

export type HumanTriggeredProviderPilotPlanningLane = {
  lane: HumanTriggeredProviderPilotPlanningLaneKey;
  planningFocus: string[];
  governanceRule: string;
};

export type HumanTriggeredProviderPilotPlanning = {
  phase: "C6.1 Human-Triggered Provider Pilot Planning";
  humanTriggeredProviderPilotPlanningStatus: HumanTriggeredProviderPilotPlanningStatus;
  pilotDecision: HumanTriggeredPilotDecision;
  providerDecision: HumanTriggeredProviderDecision;
  communicationExecutionDecision: HumanTriggeredCommunicationExecutionDecision;
  automationDecision: HumanTriggeredAutomationDecision;
  humanTriggeredProviderPilotPlanningLanes: HumanTriggeredProviderPilotPlanningLane[];
  humanTriggeredProviderPilotDoctrine: string[];
  forbiddenHumanTriggeredProviderPilotDrift: string[];
  recommendedNextExactStep: "Go-Live Readiness Gate";
  nextStageRecommendation: "Go-Live Readiness Gate";
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof humanTriggeredProviderPilotPlanningFlags;
};

export const humanTriggeredProviderPilotPlanningLanes: HumanTriggeredProviderPilotPlanningLane[] = [
  {
    lane: "c6_infrastructure_gate_prerequisite",
    planningFocus: ["C6 infrastructure gate prerequisite", "provider risk review", "controlled readiness evidence", "no activation skip"],
    governanceRule: "C6.1 may plan a pilot only after C6 gate evidence and cannot skip controlled infrastructure review.",
  },
  {
    lane: "human_triggered_only_pilot_boundary",
    planningFocus: ["human-triggered only", "manual operator action", "no autonomous trigger", "no background send"],
    governanceRule: "Any future pilot must require an explicit human trigger and cannot run from automation, polling, queues, or jobs.",
  },
  {
    lane: "approval_gated_send_call_review",
    planningFocus: ["approval-gated message review", "approval-gated call review", "manual final check", "approval separate from execution"],
    governanceRule: "Approval may be planned as a review gate only and cannot grant send, call, provider, or execution authority in C6.1.",
  },
  {
    lane: "audited_pilot_evidence",
    planningFocus: ["future reviewer identity", "future reason capture", "future blocked-state evidence", "no audit writes"],
    governanceRule: "Audit evidence may be planned, but C6.1 cannot write audit rows, persist pilot events, or mutate CRM records.",
  },
  {
    lane: "revocation_rollback_planning",
    planningFocus: ["revocation expectation", "rollback planning", "STOP handling expectation", "failure rollback review"],
    governanceRule: "Revocation and rollback may be planned only; no runtime rollback, webhook, STOP handler, or provider behavior is authorized.",
  },
  {
    lane: "dnc_opt_out_stop_hard_blocker_preservation",
    planningFocus: ["DNC hard blocker", "opt-out hard blocker", "STOP hard blocker", "no bypass"],
    governanceRule: "DNC, opt-out, and STOP/revocation blockers remain non-bypassable and cannot be overridden by pilot planning.",
  },
  {
    lane: "provider_credential_env_boundary",
    planningFocus: ["no provider credentials", "no env reads", "no SDK import", "no Twilio activation"],
    governanceRule: "C6.1 cannot import provider SDKs, read credentials, create clients, activate Twilio, or configure providers.",
  },
  {
    lane: "no_campaign_no_autonomy_boundary",
    planningFocus: ["no campaigns", "no autonomous follow-up", "no autonomous seller handling", "no autonomous negotiation"],
    governanceRule: "The pilot shape must remain one-at-a-time, human-triggered, and non-autonomous with no campaign or follow-up automation.",
  },
  {
    lane: "pilot_failure_state_planning",
    planningFocus: ["provider failure states", "delivery failure review", "blocked send review", "manual incident review"],
    governanceRule: "Failure states may be planned as future review expectations only and cannot create provider calls, retries, jobs, or alerts.",
  },
  {
    lane: "go_live_readiness",
    planningFocus: ["go-live readiness gate next", "domain/email/number evidence", "consent policy evidence", "operator workflow evidence"],
    governanceRule: "Go-Live Readiness Gate may be planned next, but C6.1 cannot authorize go-live, production rollout, or live communication.",
  },
];

export const humanTriggeredProviderPilotDoctrine = [
  "C6.1 plans a future human-triggered provider pilot only.",
  "Pilot decision remains not_authorized_for_activation.",
  "Provider decision remains not_authorized.",
  "Communication execution decision remains not_authorized.",
  "Automation decision remains not_authorized.",
  "A future pilot must be human-triggered, approval-gated, audited, revocable, and non-autonomous.",
  "No provider activation, SDK import, env read, SMS, email, call, webhook, route, queue, reminder, runtime job, CRM mutation, or go-live behavior is authorized.",
  "DNC, opt-out, STOP, and revocation blockers remain non-bypassable hard blockers.",
  "Existing /api/send-sms and Twilio inbound webhook routes are not changed by C6.1.",
  "Go-Live Readiness Gate must review readiness before any live provider behavior is considered.",
];

export const forbiddenHumanTriggeredProviderPilotDrift = [
  "pilot activation",
  "provider activation",
  "provider client creation",
  "provider env reads",
  "provider SDK imports",
  "Twilio activation",
  "email provider activation",
  "SMS provider activation",
  "phone provider activation",
  "outbound SMS",
  "outbound email",
  "email sending",
  "calling",
  "AI voice",
  "send path creation",
  "call path creation",
  "inbound webhook creation",
  "route creation",
  "campaign activation",
  "outreach",
  "automation",
  "autonomous follow-up",
  "autonomous seller handling",
  "autonomous negotiation",
  "communication queues",
  "reminders",
  "runtime jobs",
  "polling",
  "CRM mutation",
  "audit writing",
  "approval-as-execution",
  "communication execution",
  "go-live authorization",
  "spend increase",
  "DNC bypass",
  "opt-out bypass",
  "STOP bypass",
  "runtime rollback execution",
];

export function getHumanTriggeredProviderPilotPlanning(): HumanTriggeredProviderPilotPlanning {
  const result: HumanTriggeredProviderPilotPlanning = {
    phase: "C6.1 Human-Triggered Provider Pilot Planning",
    humanTriggeredProviderPilotPlanningStatus: "planning_only",
    pilotDecision: "not_authorized_for_activation",
    providerDecision: "not_authorized",
    communicationExecutionDecision: "not_authorized",
    automationDecision: "not_authorized",
    humanTriggeredProviderPilotPlanningLanes,
    humanTriggeredProviderPilotDoctrine,
    forbiddenHumanTriggeredProviderPilotDrift,
    recommendedNextExactStep: "Go-Live Readiness Gate",
    nextStageRecommendation: "Go-Live Readiness Gate",
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: humanTriggeredProviderPilotPlanningFlags,
  };

  assertHumanTriggeredProviderPilotPlanningSafe(result);

  return result;
}

export function assertHumanTriggeredProviderPilotPlanningSafe(result: HumanTriggeredProviderPilotPlanning) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C6.1 human-triggered provider pilot planning must remain read-only, advisory-only, and planning-only.");
  }

  if (result.humanTriggeredProviderPilotPlanningStatus !== "planning_only") {
    throw new Error("C6.1 human-triggered provider pilot planning cannot become pilot-ready, provider-ready, send-ready, call-ready, go-live-ready, or execution-ready.");
  }

  if (result.pilotDecision !== "not_authorized_for_activation") {
    throw new Error("C6.1 pilot decision must remain not_authorized_for_activation.");
  }

  if (result.providerDecision !== "not_authorized") {
    throw new Error("C6.1 provider decision must remain not_authorized.");
  }

  if (result.communicationExecutionDecision !== "not_authorized") {
    throw new Error("C6.1 communication execution decision must remain not_authorized.");
  }

  if (result.automationDecision !== "not_authorized") {
    throw new Error("C6.1 automation decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C6.1 human-triggered provider pilot planning cannot authorize provider activation, env reads, SDK imports, routes/webhooks, SMS, email, calling, AI voice, campaigns, queues, reminders, runtime jobs, CRM mutation, audit writing, autonomous follow-up, autonomous seller handling, go-live, spend increases, blocker bypass, or runtime rollback execution.");
  }

  if (result.recommendedNextExactStep !== "Go-Live Readiness Gate") {
    throw new Error("C6.1 human-triggered provider pilot planning must recommend Go-Live Readiness Gate next.");
  }

  if (result.nextStageRecommendation !== "Go-Live Readiness Gate") {
    throw new Error("C6.1 human-triggered provider pilot planning must include the next stage recommendation.");
  }
}

export function summarizeHumanTriggeredProviderPilotPlanning(result: HumanTriggeredProviderPilotPlanning) {
  assertHumanTriggeredProviderPilotPlanningSafe(result);

  return `${result.phase}: ${result.humanTriggeredProviderPilotPlanningStatus}. Pilot decision is ${result.pilotDecision}; provider decision is ${result.providerDecision}; communication execution decision is ${result.communicationExecutionDecision}; automation decision is ${result.automationDecision}. C6.1 plans a future human-triggered, approval-gated, audited, revocable, non-autonomous provider pilot with C6 prerequisite review, DNC/opt-out/STOP blocker preservation, provider credential/env boundaries, no-campaign/no-autonomy boundaries, failure-state planning, and go-live readiness. No provider activation, provider client, env read, SDK import, webhook, route, outbound communication, SMS, email, calling, AI voice, campaign, queue, reminder, runtime job, polling, CRM mutation, audit writing, autonomous follow-up, autonomous seller handling, approval-as-execution, go-live, spend increase, blocker bypass, or runtime rollback execution is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
