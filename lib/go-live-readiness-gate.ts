export const goLiveReadinessGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  goLiveAuthorized: false,
  finalHumanAuthorizationGranted: false,
  providerActivated: false,
  providerClientCreated: false,
  providerEnvRead: false,
  providerSdkImported: false,
  twilioActivated: false,
  dnsMutationEnabled: false,
  domainActivated: false,
  mailboxCreated: false,
  spfDkimDmarcPublished: false,
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
  routeCreated: false,
  inboundWebhookCreated: false,
  campaignActivated: false,
  communicationQueueCreated: false,
  queueSystemEnabled: false,
  reminderCreated: false,
  reminderSystemEnabled: false,
  pollingEnabled: false,
  runtimeJobCreated: false,
  runtimeJobsEnabled: false,
  crmMutationEnabled: false,
  auditWritingEnabled: false,
  approvalGrantsExecution: false,
  communicationExecutionAuthorized: false,
  outreachEnabled: false,
  automationEnabled: false,
  autonomousFollowUpEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousNegotiationEnabled: false,
  spendIncreaseAuthorized: false,
  dncBypassAllowed: false,
  optOutBypassAllowed: false,
  stopBypassAllowed: false,
  rollbackExecutionEnabled: false,
} as const;

export type GoLiveReadinessGateStatus =
  | "planning_only"
  | "go_live_review_required"
  | "blocked_until_final_human_authorization";

export type GoLiveDecision = "not_authorized";
export type GoLiveProviderDecision = "not_authorized";
export type GoLiveCommunicationExecutionDecision = "not_authorized";
export type GoLiveAutomationDecision = "not_authorized";

export type GoLiveReadinessGateLaneKey =
  | "c5_domain_email_identity_evidence"
  | "c5_1_business_number_text_call_identity_evidence"
  | "c5_2_consent_dnc_opt_out_sender_policy_evidence"
  | "c6_controlled_infrastructure_gate_evidence"
  | "c6_1_human_triggered_pilot_evidence"
  | "operator_workflow_readiness"
  | "dnc_opt_out_stop_hard_blocker_preservation"
  | "provider_credential_env_boundary"
  | "audit_rollback_failure_state_readiness"
  | "no_campaign_no_autonomy_boundary"
  | "no_go_live_no_provider_boundary"
  | "final_human_authorization_readiness";

export type GoLiveReadinessGateLane = {
  lane: GoLiveReadinessGateLaneKey;
  readinessFocus: string[];
  governanceRule: string;
};

export type GoLiveReadinessGate = {
  phase: "Go-Live Readiness Gate";
  goLiveReadinessGateStatus: GoLiveReadinessGateStatus;
  goLiveDecision: GoLiveDecision;
  providerDecision: GoLiveProviderDecision;
  communicationExecutionDecision: GoLiveCommunicationExecutionDecision;
  automationDecision: GoLiveAutomationDecision;
  goLiveReadinessGateLanes: GoLiveReadinessGateLane[];
  goLiveReadinessDoctrine: string[];
  forbiddenGoLiveReadinessDrift: string[];
  recommendedNextExactStep: "Final Human Go/No-Go Authorization Review";
  nextStageRecommendation: "Final Human Go/No-Go Authorization Review";
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof goLiveReadinessGateFlags;
};

export const goLiveReadinessGateLanes: GoLiveReadinessGateLane[] = [
  {
    lane: "c5_domain_email_identity_evidence",
    readinessFocus: ["C5 domain/email identity evidence", "truthful sender identity", "reply inbox planning", "SPF/DKIM/DMARC evidence"],
    governanceRule: "Go-live readiness may review C5 email identity evidence but cannot activate domains, publish DNS, create mailboxes, or send email.",
  },
  {
    lane: "c5_1_business_number_text_call_identity_evidence",
    readinessFocus: ["C5.1 business number evidence", "caller identity", "10DLC readiness", "text/call identity planning"],
    governanceRule: "Go-live readiness may review business number evidence but cannot buy numbers, activate Twilio, send SMS, or place calls.",
  },
  {
    lane: "c5_2_consent_dnc_opt_out_sender_policy_evidence",
    readinessFocus: ["C5.2 consent evidence", "DNC policy", "opt-out policy", "sender policy"],
    governanceRule: "Consent, DNC, opt-out, and sender policy evidence must be reviewable before any later final authorization is considered.",
  },
  {
    lane: "c6_controlled_infrastructure_gate_evidence",
    readinessFocus: ["C6 controlled infrastructure gate evidence", "provider risk review", "credential boundary", "no activation skip"],
    governanceRule: "Go-live readiness cannot bypass C6 controlled infrastructure review or convert readiness into provider activation.",
  },
  {
    lane: "c6_1_human_triggered_pilot_evidence",
    readinessFocus: ["C6.1 pilot planning evidence", "human-triggered-only boundary", "approval-gated pilot shape", "non-autonomous pilot"],
    governanceRule: "Any future pilot evidence must remain human-triggered, approval-gated, audited, revocable, and non-autonomous.",
  },
  {
    lane: "operator_workflow_readiness",
    readinessFocus: ["operator clarity", "manual review workflow", "approval separation", "blocked-state visibility"],
    governanceRule: "Operators must understand why a lead matters, what is blocked, what is missing, and what requires review before go-live can be considered.",
  },
  {
    lane: "dnc_opt_out_stop_hard_blocker_preservation",
    readinessFocus: ["DNC hard blocker", "opt-out hard blocker", "STOP hard blocker", "revocation hard blocker"],
    governanceRule: "DNC, opt-out, STOP, and revocation blockers remain non-bypassable and cannot be overridden by readiness review.",
  },
  {
    lane: "provider_credential_env_boundary",
    readinessFocus: ["no provider credentials", "no env reads", "no SDK imports", "no provider clients"],
    governanceRule: "Go-live readiness cannot read credentials, import SDKs, create clients, configure providers, or activate Twilio.",
  },
  {
    lane: "audit_rollback_failure_state_readiness",
    readinessFocus: ["audit planning", "rollback planning", "failure-state review", "manual incident review"],
    governanceRule: "Audit, rollback, and failure-state readiness may be reviewed only; no audit writes, retries, rollback execution, alerts, or runtime jobs are authorized.",
  },
  {
    lane: "no_campaign_no_autonomy_boundary",
    readinessFocus: ["no campaigns", "no autonomous follow-up", "no autonomous seller handling", "no autonomous negotiation"],
    governanceRule: "Go-live readiness cannot authorize campaigns, autonomous follow-up, autonomous seller handling, autonomous negotiation, queues, or reminders.",
  },
  {
    lane: "no_go_live_no_provider_boundary",
    readinessFocus: ["no go-live", "no provider activation", "no outbound communication", "no runtime infrastructure"],
    governanceRule: "Readiness review does not authorize go-live, provider activation, outbound SMS/email/calling, AI voice, routes, webhooks, or runtime infrastructure.",
  },
  {
    lane: "final_human_authorization_readiness",
    readinessFocus: ["final human go/no-go review", "documented authorization evidence", "revocable decision", "non-autonomous approval"],
    governanceRule: "The next stage must be a separate final human go/no-go authorization review before any live behavior can be considered.",
  },
];

export const goLiveReadinessDoctrine = [
  "Go-Live Readiness Gate is review-only.",
  "Go-live decision remains not_authorized.",
  "Provider decision remains not_authorized.",
  "Communication execution decision remains not_authorized.",
  "Automation decision remains not_authorized.",
  "No provider activation, DNS/domain activation, env read, SDK import, route, webhook, SMS, email, calling, AI voice, CRM mutation, campaign, queue, reminder, polling, runtime job, autonomous follow-up, autonomous seller handling, audit write, go-live behavior, or spend increase is authorized.",
  "Final authorization must remain separate, human-controlled, documented, revocable, and non-autonomous.",
  "DNC, opt-out, STOP, and revocation blockers remain non-bypassable hard blockers.",
  "Highest ROI route remains: activate nothing until operator clarity, identity evidence, consent policy, auditability, rollback, and blocker visibility are proven.",
];

export const forbiddenGoLiveReadinessDrift = [
  "go-live authorization",
  "final human authorization grant",
  "provider activation",
  "provider client creation",
  "provider env reads",
  "provider SDK imports",
  "Twilio activation",
  "DNS mutation",
  "domain activation",
  "mailbox creation",
  "SPF/DKIM/DMARC publishing",
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
  "route creation",
  "inbound webhook creation",
  "campaign activation",
  "communication queues",
  "reminders",
  "polling",
  "runtime jobs",
  "CRM mutation",
  "audit writing",
  "approval-as-execution",
  "communication execution",
  "outreach",
  "automation",
  "autonomous follow-up",
  "autonomous seller handling",
  "autonomous negotiation",
  "spend increase",
  "DNC bypass",
  "opt-out bypass",
  "STOP bypass",
  "runtime rollback execution",
];

export function getGoLiveReadinessGate(): GoLiveReadinessGate {
  const result: GoLiveReadinessGate = {
    phase: "Go-Live Readiness Gate",
    goLiveReadinessGateStatus: "planning_only",
    goLiveDecision: "not_authorized",
    providerDecision: "not_authorized",
    communicationExecutionDecision: "not_authorized",
    automationDecision: "not_authorized",
    goLiveReadinessGateLanes,
    goLiveReadinessDoctrine,
    forbiddenGoLiveReadinessDrift,
    recommendedNextExactStep: "Final Human Go/No-Go Authorization Review",
    nextStageRecommendation: "Final Human Go/No-Go Authorization Review",
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: goLiveReadinessGateFlags,
  };

  assertGoLiveReadinessGateSafe(result);

  return result;
}

export function assertGoLiveReadinessGateSafe(result: GoLiveReadinessGate) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("Go-Live Readiness Gate must remain read-only, advisory-only, and planning-only.");
  }

  if (result.goLiveReadinessGateStatus !== "planning_only") {
    throw new Error("Go-Live Readiness Gate cannot become go-live-ready, provider-ready, send-ready, call-ready, infrastructure-ready, automation-ready, or execution-ready.");
  }

  if (result.goLiveDecision !== "not_authorized") {
    throw new Error("Go-Live Readiness Gate go-live decision must remain not_authorized.");
  }

  if (result.providerDecision !== "not_authorized") {
    throw new Error("Go-Live Readiness Gate provider decision must remain not_authorized.");
  }

  if (result.communicationExecutionDecision !== "not_authorized") {
    throw new Error("Go-Live Readiness Gate communication execution decision must remain not_authorized.");
  }

  if (result.automationDecision !== "not_authorized") {
    throw new Error("Go-Live Readiness Gate automation decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Go-Live Readiness Gate cannot authorize provider activation, DNS/domain activation, env reads, SDK imports, routes/webhooks, SMS, email, calling, AI voice, campaigns, queues, reminders, runtime jobs, CRM mutation, audit writing, autonomous follow-up, autonomous seller handling, go-live, spend increases, blocker bypass, communication execution, or runtime rollback execution.");
  }

  if (result.recommendedNextExactStep !== "Final Human Go/No-Go Authorization Review") {
    throw new Error("Go-Live Readiness Gate must recommend Final Human Go/No-Go Authorization Review next.");
  }

  if (result.nextStageRecommendation !== "Final Human Go/No-Go Authorization Review") {
    throw new Error("Go-Live Readiness Gate must include the next stage recommendation.");
  }
}

export function summarizeGoLiveReadinessGate(result: GoLiveReadinessGate) {
  assertGoLiveReadinessGateSafe(result);

  return `${result.phase}: ${result.goLiveReadinessGateStatus}. Go-live decision is ${result.goLiveDecision}; provider decision is ${result.providerDecision}; communication execution decision is ${result.communicationExecutionDecision}; automation decision is ${result.automationDecision}. Go-live readiness reviews C5 domain/email identity evidence, C5.1 number/text/call identity evidence, C5.2 consent/DNC/opt-out/sender policy evidence, C6 controlled infrastructure evidence, C6.1 human-triggered pilot evidence, operator workflow readiness, DNC/opt-out/STOP blocker preservation, credential/env boundaries, audit/rollback/failure-state readiness, no-campaign/no-autonomy boundaries, and final human authorization readiness. No go-live, provider activation, DNS/domain activation, env read, SDK import, route, webhook, outbound communication, SMS, email, calling, AI voice, campaign, queue, reminder, polling, runtime job, CRM mutation, audit writing, autonomous follow-up, autonomous seller handling, approval-as-execution, blocker bypass, spend increase, or runtime infrastructure is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
