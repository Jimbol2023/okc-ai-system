export const businessNumberTextCallIdentityPlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  numberPurchaseAuthorized: false,
  numberActivated: false,
  localNumberActivated: false,
  tollFreeNumberActivated: false,
  callerIdActivated: false,
  smsIdentityActivated: false,
  tenDlcRegistrationStarted: false,
  tenDlcBrandRegistered: false,
  tenDlcCampaignRegistered: false,
  consentCollectionEnabled: false,
  dncBypassAllowed: false,
  optOutBypassAllowed: false,
  stopHandlingActivated: false,
  inboundWebhookCreated: false,
  routeCreated: false,
  providerActivated: false,
  providerClientCreated: false,
  providerEnvRead: false,
  providerSdkImported: false,
  twilioActivated: false,
  smsProviderActivated: false,
  phoneProviderActivated: false,
  sendPathCreated: false,
  callPathCreated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  campaignActivated: false,
  outreachEnabled: false,
  automationEnabled: false,
  autonomousFollowUpEnabled: false,
  autonomousSellerHandlingEnabled: false,
  communicationQueueCreated: false,
  queueSystemEnabled: false,
  reminderCreated: false,
  reminderSystemEnabled: false,
  runtimeJobCreated: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  crmMutationEnabled: false,
  approvalGrantsExecution: false,
  communicationExecutionAuthorized: false,
  goLiveAuthorized: false,
  spendIncreaseAuthorized: false,
} as const;

export type BusinessNumberTextCallIdentityPlanningStatus =
  | "planning_only"
  | "number_identity_shape_defined"
  | "blocked_until_consent_evidence";

export type BusinessNumberDecision = "not_authorized_for_activation";
export type BusinessSmsDecision = "not_authorized_for_sending";
export type BusinessCallingDecision = "not_authorized_for_calling";
export type BusinessNumberProviderDecision = "not_authorized";

export type BusinessNumberTextCallIdentityPlanningLaneKey =
  | "business_number_identity"
  | "local_toll_free_number_type_planning"
  | "caller_id_business_naming"
  | "sms_identity_10dlc_evidence_planning"
  | "tcpa_consent_boundary"
  | "dnc_opt_out_visibility"
  | "inbound_reply_stop_handling_expectations"
  | "human_approval_audit_boundary"
  | "no_provider_no_send_no_call_boundary"
  | "c5_2_readiness";

export type BusinessNumberTextCallIdentityPlanningLane = {
  lane: BusinessNumberTextCallIdentityPlanningLaneKey;
  planningFocus: string[];
  governanceRule: string;
};

export type BusinessNumberTextCallIdentityPlanning = {
  phase: "C5.1 Business Number Text/Call Identity Planning";
  businessNumberTextCallIdentityPlanningStatus: BusinessNumberTextCallIdentityPlanningStatus;
  numberDecision: BusinessNumberDecision;
  smsDecision: BusinessSmsDecision;
  callingDecision: BusinessCallingDecision;
  providerDecision: BusinessNumberProviderDecision;
  textCallIdentityPlanningLanes: BusinessNumberTextCallIdentityPlanningLane[];
  textCallIdentityDoctrine: string[];
  forbiddenTextCallIdentityDrift: string[];
  recommendedNextExactStep: "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review";
  nextStageRecommendation: "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review";
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof businessNumberTextCallIdentityPlanningFlags;
};

export const businessNumberTextCallIdentityPlanningLanes: BusinessNumberTextCallIdentityPlanningLane[] = [
  {
    lane: "business_number_identity",
    planningFocus: ["future business number identity", "business-name alignment", "operator-visible identity", "no number activation"],
    governanceRule: "C5.1 may document future number identity requirements only and cannot purchase, assign, or activate a number.",
  },
  {
    lane: "local_toll_free_number_type_planning",
    planningFocus: ["local number option", "toll-free option", "use-case fit", "no number purchase"],
    governanceRule: "Number type planning may compare future identity choices only and cannot start registration or activation.",
  },
  {
    lane: "caller_id_business_naming",
    planningFocus: ["truthful caller identity", "business naming consistency", "operator review", "no calling"],
    governanceRule: "Caller identity must stay truthful and reviewable without enabling a call path, caller ID activation, or AI voice.",
  },
  {
    lane: "sms_identity_10dlc_evidence_planning",
    planningFocus: ["10DLC business evidence", "brand evidence", "campaign-use evidence", "no 10DLC registration"],
    governanceRule: "10DLC readiness may be planned as evidence only; C5.1 cannot register a brand, campaign, messaging service, or number.",
  },
  {
    lane: "tcpa_consent_boundary",
    planningFocus: ["consent evidence needed", "text/call sensitivity", "manual review before future contact", "no consent collection runtime"],
    governanceRule: "TCPA consent planning must remain a blocker boundary and cannot collect consent, send texts, or call sellers.",
  },
  {
    lane: "dnc_opt_out_visibility",
    planningFocus: ["DNC visibility", "opt-out visibility", "suppression review", "no bypass"],
    governanceRule: "DNC and opt-out visibility must remain non-bypassable and cannot be overridden by number or SMS planning.",
  },
  {
    lane: "inbound_reply_stop_handling_expectations",
    planningFocus: ["STOP handling expectations", "reply handling expectations", "wrong-number review", "no webhook"],
    governanceRule: "Inbound and STOP handling may be planned only; no webhook, route, provider, or persistence behavior is authorized.",
  },
  {
    lane: "human_approval_audit_boundary",
    planningFocus: ["human-supervised communication", "approval separate from execution", "audit expectation", "operator review"],
    governanceRule: "Approval and audit planning must remain separate from sending, calling, provider activation, and execution.",
  },
  {
    lane: "no_provider_no_send_no_call_boundary",
    planningFocus: ["no Twilio activation", "no provider client", "no SMS", "no calling", "no campaigns"],
    governanceRule: "C5.1 cannot activate providers, import SDKs, read env vars, send SMS, call sellers, or start campaigns.",
  },
  {
    lane: "c5_2_readiness",
    planningFocus: ["consent policy review next", "DNC policy review next", "opt-out policy review next", "sender policy review next"],
    governanceRule: "C5.2 may review consent, DNC, opt-out, and sender policy next; C5.1 cannot treat identity planning as contact readiness.",
  },
];

export const businessNumberTextCallIdentityDoctrine = [
  "C5.1 defines future text and call identity requirements only.",
  "Number decision remains not_authorized_for_activation.",
  "SMS decision remains not_authorized_for_sending.",
  "Calling decision remains not_authorized_for_calling.",
  "Provider decision remains not_authorized.",
  "No number purchase, Twilio/provider activation, provider SDK import, env read, webhook creation, send path, call path, campaign, queue, reminder, AI voice, or go-live behavior is authorized.",
  "Text and call identity must preserve business identity, consent sensitivity, opt-out handling, DNC visibility, and human supervision.",
  "10DLC/TCPA/DNC/opt-out checks are planning requirements only.",
  "C5.2 must review consent, DNC, opt-out, and sender policy before any provider or communication infrastructure gate.",
];

export const forbiddenBusinessNumberTextCallIdentityDrift = [
  "number purchase",
  "number activation",
  "local number activation",
  "toll-free number activation",
  "caller ID activation",
  "SMS identity activation",
  "10DLC registration start",
  "10DLC brand registration",
  "10DLC campaign registration",
  "consent collection runtime",
  "DNC bypass",
  "opt-out bypass",
  "STOP handling activation",
  "inbound webhook creation",
  "route creation",
  "provider activation",
  "provider client creation",
  "provider env reads",
  "provider SDK imports",
  "Twilio activation",
  "SMS provider activation",
  "phone provider activation",
  "send path creation",
  "call path creation",
  "outbound SMS",
  "outbound email",
  "calling",
  "AI voice",
  "campaign activation",
  "outreach",
  "automation",
  "autonomous follow-up",
  "autonomous seller handling",
  "communication queues",
  "reminders",
  "runtime jobs",
  "polling",
  "CRM mutation",
  "approval-as-execution",
  "communication execution",
  "go-live authorization",
  "spend increase",
];

export function getBusinessNumberTextCallIdentityPlanning(): BusinessNumberTextCallIdentityPlanning {
  const result: BusinessNumberTextCallIdentityPlanning = {
    phase: "C5.1 Business Number Text/Call Identity Planning",
    businessNumberTextCallIdentityPlanningStatus: "planning_only",
    numberDecision: "not_authorized_for_activation",
    smsDecision: "not_authorized_for_sending",
    callingDecision: "not_authorized_for_calling",
    providerDecision: "not_authorized",
    textCallIdentityPlanningLanes: businessNumberTextCallIdentityPlanningLanes,
    textCallIdentityDoctrine: businessNumberTextCallIdentityDoctrine,
    forbiddenTextCallIdentityDrift: forbiddenBusinessNumberTextCallIdentityDrift,
    recommendedNextExactStep: "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review",
    nextStageRecommendation: "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review",
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: businessNumberTextCallIdentityPlanningFlags,
  };

  assertBusinessNumberTextCallIdentityPlanningSafe(result);

  return result;
}

export function assertBusinessNumberTextCallIdentityPlanningSafe(result: BusinessNumberTextCallIdentityPlanning) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C5.1 business number text/call identity planning must remain read-only, advisory-only, and planning-only.");
  }

  if (result.businessNumberTextCallIdentityPlanningStatus !== "planning_only") {
    throw new Error("C5.1 business number text/call identity planning cannot become number-ready, SMS-ready, call-ready, provider-ready, go-live-ready, or execution-ready.");
  }

  if (result.numberDecision !== "not_authorized_for_activation") {
    throw new Error("C5.1 number decision must remain not_authorized_for_activation.");
  }

  if (result.smsDecision !== "not_authorized_for_sending") {
    throw new Error("C5.1 SMS decision must remain not_authorized_for_sending.");
  }

  if (result.callingDecision !== "not_authorized_for_calling") {
    throw new Error("C5.1 calling decision must remain not_authorized_for_calling.");
  }

  if (result.providerDecision !== "not_authorized") {
    throw new Error("C5.1 provider decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C5.1 business number text/call identity planning cannot authorize number activation, 10DLC registration, Twilio/provider activation, env reads, provider SDK imports, routes/webhooks, SMS, calling, AI voice, campaigns, queues, reminders, runtime jobs, CRM mutation, automation, approval-as-execution, go-live, or spend increases.");
  }

  if (result.recommendedNextExactStep !== "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review") {
    throw new Error("C5.1 business number text/call identity planning must recommend C5.2 Consent, DNC, Opt-Out, And Sender Policy Review next.");
  }

  if (result.nextStageRecommendation !== "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review") {
    throw new Error("C5.1 business number text/call identity planning must include the next stage recommendation.");
  }
}

export function summarizeBusinessNumberTextCallIdentityPlanning(result: BusinessNumberTextCallIdentityPlanning) {
  assertBusinessNumberTextCallIdentityPlanningSafe(result);

  return `${result.phase}: ${result.businessNumberTextCallIdentityPlanningStatus}. Number decision is ${result.numberDecision}; SMS decision is ${result.smsDecision}; calling decision is ${result.callingDecision}; provider decision is ${result.providerDecision}. C5.1 plans business number identity, local/toll-free number type review, caller ID and business naming, SMS identity and 10DLC evidence, TCPA consent boundary, DNC/opt-out visibility, inbound reply/STOP handling expectations, human approval and audit boundaries, no-provider/no-send/no-call boundaries, and C5.2 readiness. No number activation, number purchase, Twilio/provider activation, provider SDK import, env read, webhook, route, SMS, calling, AI voice, campaign, queue, reminder, runtime job, polling, CRM mutation, automation, approval-as-execution, go-live, or spend increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
