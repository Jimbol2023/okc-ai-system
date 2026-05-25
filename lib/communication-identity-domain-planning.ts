export const communicationIdentityDomainPlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  domainPurchaseAuthorized: false,
  domainActivated: false,
  dnsMutationAuthorized: false,
  dnsRecordPublished: false,
  spfPublished: false,
  dkimPublished: false,
  dmarcPublished: false,
  mailboxCreated: false,
  replyInboxCreated: false,
  providerActivated: false,
  providerClientCreated: false,
  providerEnvRead: false,
  twilioActivated: false,
  emailProviderActivated: false,
  smsProviderActivated: false,
  phoneProviderActivated: false,
  sendPathCreated: false,
  emailSendingEnabled: false,
  outboundEmailEnabled: false,
  outboundSmsEnabled: false,
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

export type CommunicationIdentityDomainPlanningStatus =
  | "planning_only"
  | "identity_shape_defined"
  | "blocked_until_domain_evidence";

export type CommunicationDomainDecision = "not_authorized_for_activation";
export type CommunicationEmailDecision = "not_authorized_for_sending";
export type CommunicationProviderDecision = "not_authorized";
export type CommunicationExecutionDecision = "not_authorized";

export type CommunicationIdentityDomainPlanningLaneKey =
  | "business_domain_identity"
  | "sender_name_policy"
  | "reply_inbox_planning"
  | "spf_dkim_dmarc_evidence_planning"
  | "can_spam_sender_opt_out_visibility"
  | "human_approval_audit_boundary"
  | "no_send_no_provider_boundary"
  | "c5_1_phone_text_call_readiness";

export type CommunicationIdentityDomainPlanningLane = {
  lane: CommunicationIdentityDomainPlanningLaneKey;
  planningFocus: string[];
  governanceRule: string;
};

export type CommunicationIdentityDomainPlanning = {
  phase: "C5 Communication Identity And Domain Planning";
  communicationIdentityDomainPlanningStatus: CommunicationIdentityDomainPlanningStatus;
  domainDecision: CommunicationDomainDecision;
  emailDecision: CommunicationEmailDecision;
  providerDecision: CommunicationProviderDecision;
  communicationDecision: CommunicationExecutionDecision;
  identityDomainPlanningLanes: CommunicationIdentityDomainPlanningLane[];
  identityDomainDoctrine: string[];
  forbiddenIdentityDomainDrift: string[];
  recommendedNextExactStep: "C5.1 Business Number Text/Call Identity Planning";
  nextStageRecommendation: "C5.1 Business Number Text/Call Identity Planning";
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof communicationIdentityDomainPlanningFlags;
};

export const communicationIdentityDomainPlanningLanes: CommunicationIdentityDomainPlanningLane[] = [
  {
    lane: "business_domain_identity",
    planningFocus: ["future business domain name", "business identity alignment", "public-facing sender identity", "no domain purchase"],
    governanceRule: "C5 may document future identity requirements only and cannot purchase, activate, or configure a domain.",
  },
  {
    lane: "sender_name_policy",
    planningFocus: ["truthful sender name", "operator-visible sender policy", "no deceptive headers", "manual review before use"],
    governanceRule: "Sender naming must remain truthful and reviewable without creating a send path or mailbox.",
  },
  {
    lane: "reply_inbox_planning",
    planningFocus: ["reply handling expectations", "operator-owned inbox review", "opt-out visibility", "no mailbox creation"],
    governanceRule: "Reply inbox planning may define future review expectations only and cannot create inboxes, routes, or provider accounts.",
  },
  {
    lane: "spf_dkim_dmarc_evidence_planning",
    planningFocus: ["SPF evidence", "DKIM evidence", "DMARC evidence", "DNS readiness notes"],
    governanceRule: "SPF/DKIM/DMARC may be planned as future evidence, but no DNS record may be published or changed in C5.",
  },
  {
    lane: "can_spam_sender_opt_out_visibility",
    planningFocus: ["sender identity", "physical address planning", "opt-out procedure visibility", "commercial email compliance review"],
    governanceRule: "CAN-SPAM planning must preserve sender and opt-out visibility without enabling email sending.",
  },
  {
    lane: "human_approval_audit_boundary",
    planningFocus: ["human-supervised communication", "approval separate from execution", "audit expectation", "operator review"],
    governanceRule: "Human approval and audit planning must remain separate from execution and cannot grant sending authority.",
  },
  {
    lane: "no_send_no_provider_boundary",
    planningFocus: ["no provider activation", "no email sending", "no SMS", "no calling", "no campaigns"],
    governanceRule: "C5 cannot activate providers, create clients, read provider env vars, send messages, call sellers, or start campaigns.",
  },
  {
    lane: "c5_1_phone_text_call_readiness",
    planningFocus: ["business number planning next", "text/call identity later", "TCPA/DNC review later", "no phone activation"],
    governanceRule: "C5.1 may plan number, text, and call identity next, but C5 cannot activate phone/SMS/calling infrastructure.",
  },
];

export const communicationIdentityDomainDoctrine = [
  "C5 defines communication identity and domain requirements only.",
  "Domain decision remains not_authorized_for_activation.",
  "Email decision remains not_authorized_for_sending.",
  "Provider decision remains not_authorized.",
  "Communication decision remains not_authorized.",
  "No DNS mutation, domain purchase, mailbox creation, provider client, env read, send path, campaign, or go-live behavior is authorized.",
  "Future email identity must preserve truthful sender identity, reply handling, opt-out visibility, and auditability.",
  "Communication remains human-supervised and provider-blocked.",
  "Custom email and domain planning must come before number, text, and call identity planning.",
];

export const forbiddenCommunicationIdentityDomainDrift = [
  "domain purchase",
  "domain activation",
  "DNS mutation",
  "DNS record publishing",
  "SPF publishing",
  "DKIM publishing",
  "DMARC publishing",
  "mailbox creation",
  "reply inbox creation",
  "provider activation",
  "provider client creation",
  "provider env reads",
  "Twilio activation",
  "email provider activation",
  "SMS provider activation",
  "phone provider activation",
  "send path creation",
  "email sending",
  "outbound email",
  "outbound SMS",
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

export function getCommunicationIdentityDomainPlanning(): CommunicationIdentityDomainPlanning {
  const result: CommunicationIdentityDomainPlanning = {
    phase: "C5 Communication Identity And Domain Planning",
    communicationIdentityDomainPlanningStatus: "planning_only",
    domainDecision: "not_authorized_for_activation",
    emailDecision: "not_authorized_for_sending",
    providerDecision: "not_authorized",
    communicationDecision: "not_authorized",
    identityDomainPlanningLanes: communicationIdentityDomainPlanningLanes,
    identityDomainDoctrine: communicationIdentityDomainDoctrine,
    forbiddenIdentityDomainDrift: forbiddenCommunicationIdentityDomainDrift,
    recommendedNextExactStep: "C5.1 Business Number Text/Call Identity Planning",
    nextStageRecommendation: "C5.1 Business Number Text/Call Identity Planning",
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: communicationIdentityDomainPlanningFlags,
  };

  assertCommunicationIdentityDomainPlanningSafe(result);

  return result;
}

export function assertCommunicationIdentityDomainPlanningSafe(result: CommunicationIdentityDomainPlanning) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C5 communication identity and domain planning must remain read-only, advisory-only, and planning-only.");
  }

  if (result.communicationIdentityDomainPlanningStatus !== "planning_only") {
    throw new Error("C5 communication identity and domain planning cannot become domain-ready, send-ready, provider-ready, go-live-ready, or execution-ready.");
  }

  if (result.domainDecision !== "not_authorized_for_activation") {
    throw new Error("C5 domain decision must remain not_authorized_for_activation.");
  }

  if (result.emailDecision !== "not_authorized_for_sending") {
    throw new Error("C5 email decision must remain not_authorized_for_sending.");
  }

  if (result.providerDecision !== "not_authorized") {
    throw new Error("C5 provider decision must remain not_authorized.");
  }

  if (result.communicationDecision !== "not_authorized") {
    throw new Error("C5 communication decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C5 communication identity and domain planning cannot authorize domain activation, DNS changes, mailbox creation, provider activation, env reads, sending, calling, campaigns, queues, reminders, runtime jobs, CRM mutation, automation, approval-as-execution, go-live, or spend increases.");
  }

  if (result.recommendedNextExactStep !== "C5.1 Business Number Text/Call Identity Planning") {
    throw new Error("C5 communication identity and domain planning must recommend C5.1 Business Number Text/Call Identity Planning next.");
  }

  if (result.nextStageRecommendation !== "C5.1 Business Number Text/Call Identity Planning") {
    throw new Error("C5 communication identity and domain planning must include the next stage recommendation.");
  }
}

export function summarizeCommunicationIdentityDomainPlanning(result: CommunicationIdentityDomainPlanning) {
  assertCommunicationIdentityDomainPlanningSafe(result);

  return `${result.phase}: ${result.communicationIdentityDomainPlanningStatus}. Domain decision is ${result.domainDecision}; email decision is ${result.emailDecision}; provider decision is ${result.providerDecision}; communication decision is ${result.communicationDecision}. C5 plans business/domain identity, truthful sender naming, reply inbox expectations, SPF/DKIM/DMARC evidence, CAN-SPAM sender and opt-out visibility, human approval and audit boundaries, no-send/no-provider boundaries, and C5.1 phone/text/call readiness. No domain activation, DNS change, DNS record publishing, mailbox creation, provider activation, provider client, env read, email sending, SMS, calling, AI voice, campaign, queue, reminder, runtime job, CRM mutation, automation, approval-as-execution, go-live, or spend increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
