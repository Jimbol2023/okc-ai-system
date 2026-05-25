export const consentDncOptOutSenderPolicyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  consentCollectionEnabled: false,
  consentPersistenceEnabled: false,
  consentBypassAllowed: false,
  dncBypassAllowed: false,
  optOutBypassAllowed: false,
  stopHandlingActivated: false,
  revocationHandlingActivated: false,
  senderPolicyActivated: false,
  providerActivated: false,
  providerClientCreated: false,
  providerEnvRead: false,
  providerSdkImported: false,
  twilioActivated: false,
  numberActivated: false,
  domainActivated: false,
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
} as const;

export type ConsentDncOptOutSenderPolicyReviewStatus =
  | "planning_only"
  | "policy_shape_defined"
  | "blocked_until_policy_evidence";

export type ConsentPolicyDecision = "not_authorized_for_collection";
export type DncPolicyDecision = "hard_blocker";
export type OptOutPolicyDecision = "hard_blocker";
export type SenderPolicyDecision = "review_only";
export type ConsentPolicyProviderDecision = "not_authorized";

export type ConsentDncOptOutSenderPolicyLaneKey =
  | "consent_evidence_requirements"
  | "dnc_hard_blocker_policy"
  | "opt_out_hard_blocker_policy"
  | "stop_revocation_handling_expectations"
  | "sender_identity_policy"
  | "email_opt_out_visibility"
  | "sms_call_consent_sensitivity"
  | "human_approval_audit_boundary"
  | "no_provider_no_send_no_call_boundary"
  | "c6_readiness";

export type ConsentDncOptOutSenderPolicyLane = {
  lane: ConsentDncOptOutSenderPolicyLaneKey;
  reviewFocus: string[];
  governanceRule: string;
};

export type ConsentDncOptOutSenderPolicyReview = {
  phase: "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review";
  consentDncOptOutSenderPolicyReviewStatus: ConsentDncOptOutSenderPolicyReviewStatus;
  consentDecision: ConsentPolicyDecision;
  dncDecision: DncPolicyDecision;
  optOutDecision: OptOutPolicyDecision;
  senderPolicyDecision: SenderPolicyDecision;
  providerDecision: ConsentPolicyProviderDecision;
  consentDncOptOutSenderPolicyLanes: ConsentDncOptOutSenderPolicyLane[];
  consentDncOptOutSenderPolicyDoctrine: string[];
  forbiddenConsentDncOptOutSenderPolicyDrift: string[];
  recommendedNextExactStep: "C6 Controlled Communication Infrastructure Gate";
  nextStageRecommendation: "C6 Controlled Communication Infrastructure Gate";
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof consentDncOptOutSenderPolicyReviewFlags;
};

export const consentDncOptOutSenderPolicyLanes: ConsentDncOptOutSenderPolicyLane[] = [
  {
    lane: "consent_evidence_requirements",
    reviewFocus: ["future consent evidence", "source of consent", "scope of consent", "no consent collection"],
    governanceRule: "C5.2 may define future consent evidence requirements only and cannot collect, persist, infer, or bypass consent.",
  },
  {
    lane: "dnc_hard_blocker_policy",
    reviewFocus: ["DNC visibility", "doNotContact true", "suppression review", "non-bypassable blocker"],
    governanceRule: "DNC must remain a hard blocker and cannot be overridden by approval, AI, provider readiness, or operator convenience.",
  },
  {
    lane: "opt_out_hard_blocker_policy",
    reviewFocus: ["opt-out reason", "opt-out timestamp", "suppression visibility", "non-bypassable blocker"],
    governanceRule: "Opt-out must remain a hard blocker and cannot be bypassed by sender policy, number identity, or provider activation.",
  },
  {
    lane: "stop_revocation_handling_expectations",
    reviewFocus: ["STOP language", "revocation expectations", "unsubscribe language", "no handling runtime"],
    governanceRule: "STOP and revocation handling may be planned only; no webhook, route, runtime handler, or persistence is authorized.",
  },
  {
    lane: "sender_identity_policy",
    reviewFocus: ["truthful sender identity", "business identity", "no deceptive sender wording", "operator-visible sender policy"],
    governanceRule: "Sender policy must remain review-only and cannot activate email, SMS, calling, domains, numbers, or providers.",
  },
  {
    lane: "email_opt_out_visibility",
    reviewFocus: ["email opt-out notice", "reply or web opt-out expectations", "physical address planning", "no email sending"],
    governanceRule: "Email opt-out visibility may be planned only and cannot create email sending, mailbox, link, route, or provider behavior.",
  },
  {
    lane: "sms_call_consent_sensitivity",
    reviewFocus: ["SMS consent sensitivity", "call consent sensitivity", "TCPA review", "manual review before future contact"],
    governanceRule: "SMS/call consent sensitivity must block future contact until separately reviewed and cannot authorize text or call execution.",
  },
  {
    lane: "human_approval_audit_boundary",
    reviewFocus: ["human approval", "approval separate from execution", "audit expectation", "operator review"],
    governanceRule: "Human approval and audit planning must remain separate from sending, calling, provider activation, and execution.",
  },
  {
    lane: "no_provider_no_send_no_call_boundary",
    reviewFocus: ["no provider activation", "no SMS", "no email", "no calling", "no campaigns"],
    governanceRule: "C5.2 cannot activate providers, import SDKs, read env vars, send messages, call sellers, or start campaigns.",
  },
  {
    lane: "c6_readiness",
    reviewFocus: ["controlled infrastructure gate next", "provider activation still blocked", "operator evidence", "governance readiness"],
    governanceRule: "C6 may evaluate infrastructure readiness next, but C5.2 cannot treat policy shape as provider or execution readiness.",
  },
];

export const consentDncOptOutSenderPolicyDoctrine = [
  "C5.2 defines consent, DNC, opt-out, STOP/revocation, and sender policy boundaries only.",
  "Consent decision remains not_authorized_for_collection.",
  "DNC decision remains hard_blocker.",
  "Opt-out decision remains hard_blocker.",
  "Sender policy decision remains review_only.",
  "Provider decision remains not_authorized.",
  "Consent/DNC/opt-out policy review does not collect consent or activate communication.",
  "DNC and opt-out remain non-bypassable hard blockers.",
  "Approval remains separate from execution.",
  "Future sender policy must preserve truthful identity, reply handling, opt-out visibility, auditability, and human supervision.",
  "C6 may evaluate controlled communication infrastructure only after policy boundaries remain safe.",
];

export const forbiddenConsentDncOptOutSenderPolicyDrift = [
  "consent collection",
  "consent persistence",
  "consent bypass",
  "DNC bypass",
  "opt-out bypass",
  "STOP handling activation",
  "revocation handling activation",
  "sender policy activation",
  "provider activation",
  "provider client creation",
  "provider env reads",
  "provider SDK imports",
  "Twilio activation",
  "number activation",
  "domain activation",
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
];

export function getConsentDncOptOutSenderPolicyReview(): ConsentDncOptOutSenderPolicyReview {
  const result: ConsentDncOptOutSenderPolicyReview = {
    phase: "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review",
    consentDncOptOutSenderPolicyReviewStatus: "planning_only",
    consentDecision: "not_authorized_for_collection",
    dncDecision: "hard_blocker",
    optOutDecision: "hard_blocker",
    senderPolicyDecision: "review_only",
    providerDecision: "not_authorized",
    consentDncOptOutSenderPolicyLanes,
    consentDncOptOutSenderPolicyDoctrine,
    forbiddenConsentDncOptOutSenderPolicyDrift,
    recommendedNextExactStep: "C6 Controlled Communication Infrastructure Gate",
    nextStageRecommendation: "C6 Controlled Communication Infrastructure Gate",
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: consentDncOptOutSenderPolicyReviewFlags,
  };

  assertConsentDncOptOutSenderPolicyReviewSafe(result);

  return result;
}

export function assertConsentDncOptOutSenderPolicyReviewSafe(result: ConsentDncOptOutSenderPolicyReview) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C5.2 consent, DNC, opt-out, and sender policy review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.consentDncOptOutSenderPolicyReviewStatus !== "planning_only") {
    throw new Error("C5.2 consent, DNC, opt-out, and sender policy review cannot become policy-ready, provider-ready, send-ready, call-ready, go-live-ready, or execution-ready.");
  }

  if (result.consentDecision !== "not_authorized_for_collection") {
    throw new Error("C5.2 consent decision must remain not_authorized_for_collection.");
  }

  if (result.dncDecision !== "hard_blocker") {
    throw new Error("C5.2 DNC decision must remain a hard_blocker.");
  }

  if (result.optOutDecision !== "hard_blocker") {
    throw new Error("C5.2 opt-out decision must remain a hard_blocker.");
  }

  if (result.senderPolicyDecision !== "review_only") {
    throw new Error("C5.2 sender policy decision must remain review_only.");
  }

  if (result.providerDecision !== "not_authorized") {
    throw new Error("C5.2 provider decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C5.2 consent, DNC, opt-out, and sender policy review cannot authorize consent collection, DNC/opt-out bypass, provider activation, env reads, provider SDK imports, routes/webhooks, SMS, email, calling, AI voice, campaigns, queues, reminders, runtime jobs, CRM mutation, automation, approval-as-execution, go-live, or spend increases.");
  }

  if (result.recommendedNextExactStep !== "C6 Controlled Communication Infrastructure Gate") {
    throw new Error("C5.2 consent, DNC, opt-out, and sender policy review must recommend C6 Controlled Communication Infrastructure Gate next.");
  }

  if (result.nextStageRecommendation !== "C6 Controlled Communication Infrastructure Gate") {
    throw new Error("C5.2 consent, DNC, opt-out, and sender policy review must include the next stage recommendation.");
  }
}

export function summarizeConsentDncOptOutSenderPolicyReview(result: ConsentDncOptOutSenderPolicyReview) {
  assertConsentDncOptOutSenderPolicyReviewSafe(result);

  return `${result.phase}: ${result.consentDncOptOutSenderPolicyReviewStatus}. Consent decision is ${result.consentDecision}; DNC decision is ${result.dncDecision}; opt-out decision is ${result.optOutDecision}; sender policy decision is ${result.senderPolicyDecision}; provider decision is ${result.providerDecision}. C5.2 defines consent evidence, DNC hard-blocker policy, opt-out hard-blocker policy, STOP/revocation expectations, sender identity policy, email opt-out visibility, SMS/call consent sensitivity, human approval and audit boundaries, no-provider/no-send/no-call boundaries, and C6 readiness. No consent collection, DNC bypass, opt-out bypass, provider activation, provider client, env read, SDK import, webhook, route, SMS, email, calling, AI voice, campaign, queue, reminder, runtime job, polling, CRM mutation, automation, approval-as-execution, go-live, or spend increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
