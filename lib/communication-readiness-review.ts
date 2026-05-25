export const communicationReadinessReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  providerCalled: false,
  providerActivationAllowed: false,
  twilioActivated: false,
  emailActivated: false,
  smsActivated: false,
  callingActivated: false,
  aiVoiceActivated: false,
  campaignActivated: false,
  communicationQueueCreated: false,
  reminderCreated: false,
  runtimeJobCreated: false,
  pollingAllowed: false,
  providerClientCreated: false,
  providerEnvRead: false,
  outboundSendPathCreated: false,
  crmAutomationAllowed: false,
  autonomousNegotiationAllowed: false,
  autonomousSellerHandlingAllowed: false,
  autonomousFollowUpAllowed: false,
  approvalGrantsExecution: false,
  aiOnlySellerHandlingAllowed: false,
} as const;

export type CommunicationReadinessStatus =
  | "not_ready"
  | "needs_operator_review"
  | "readiness_planning_only";

export type CommunicationReadinessLane =
  | "contact_data"
  | "dnc_opt_out"
  | "property_first_blocks"
  | "seller_reply_context"
  | "human_approval"
  | "ai_va_operator_support"
  | "follow_up_discipline"
  | "provider_activation_blockers"
  | "communication_identity";

export type CommunicationReadinessNextStep =
  | "C2 AI VA Operator Workflow Review"
  | "C3 Seller Conversation Memory Planning";

export type CommunicationReadinessInput = {
  phone?: string | null;
  email?: string | null;
  propertyAddress?: string | null;
  source?: string | null;
  importReadiness?: string | null;
  doNotContact?: boolean | null;
  optOutReason?: string | null;
  optOutAt?: string | Date | null;
  approvalStatus?: string | null;
  requiresHumanApproval?: boolean | null;
  lastSellerReply?: string | null;
  lastSellerReplyIntent?: string | null;
  lastSellerReplyConfidence?: number | null;
  followUpCount?: number | null;
  nextFollowUpAt?: string | Date | null;
  automationStatus?: string | null;
  conversationMemoryPlanned?: boolean | null;
  communicationAuditPlanned?: boolean | null;
  humanApprovalWorkflowPlanned?: boolean | null;
  approvedSendPathPlanned?: boolean | null;
  providerIdentityPlanned?: boolean | null;
  aiVaOperatorSupportPlanned?: boolean | null;
};

export type CommunicationReadinessLaneReview = {
  lane: CommunicationReadinessLane;
  ready: boolean;
  blockers: string[];
  guidance: string;
};

export type CommunicationReadinessReview = {
  phase: "C1 Communication Readiness Review";
  communicationReadinessStatus: CommunicationReadinessStatus;
  readinessLanes: CommunicationReadinessLaneReview[];
  blockers: string[];
  recommendedNextExactStep: CommunicationReadinessNextStep;
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof communicationReadinessReviewFlags;
};

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasContact(input: CommunicationReadinessInput) {
  return hasText(input.phone) || hasText(input.email);
}

function hasSellerReplyContext(input: CommunicationReadinessInput) {
  return hasText(input.lastSellerReply) || hasText(input.lastSellerReplyIntent);
}

function isPropertyFirstBlocked(input: CommunicationReadinessInput) {
  const importReadiness = input.importReadiness?.trim();
  const propertyFirstNote = hasText(input.source) && hasText(input.propertyAddress) && !hasContact(input);

  return importReadiness === "property_first_review" || propertyFirstNote;
}

function hasOptOut(input: CommunicationReadinessInput) {
  return hasText(input.optOutReason) || Boolean(input.optOutAt);
}

function createLane(
  lane: CommunicationReadinessLane,
  blockers: string[],
  guidance: string
): CommunicationReadinessLaneReview {
  return {
    lane,
    ready: blockers.length === 0,
    blockers,
    guidance,
  };
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function reviewCommunicationReadiness(input: CommunicationReadinessInput = {}): CommunicationReadinessReview {
  const contactLane = createLane(
    "contact_data",
    hasContact(input) ? [] : ["missing phone/email"],
    "Seller phone or email must be present before communication can be considered."
  );
  const dncLane = createLane(
    "dnc_opt_out",
    [
      input.doNotContact ? "doNotContact true" : "",
      hasOptOut(input) ? "opt-out present" : "",
    ].filter(Boolean),
    "DNC and opt-out signals block all future seller communication."
  );
  const propertyLane = createLane(
    "property_first_blocks",
    isPropertyFirstBlocked(input) ? ["property-first cleanup required"] : [],
    "Property-first records require contact cleanup and manual review before outreach."
  );
  const sellerReplyLane = createLane(
    "seller_reply_context",
    hasSellerReplyContext(input) ? [] : ["no conversation memory plan"],
    "Seller reply context or a conversation memory plan is needed before AI VA communication support matures."
  );
  const humanApprovalLane = createLane(
    "human_approval",
    [
      input.approvalStatus === "approved_for_outreach" || input.requiresHumanApproval ? "" : "approval missing",
      input.humanApprovalWorkflowPlanned ? "" : "no human approval workflow",
    ].filter(Boolean),
    "Human approval must remain a review gate and never grant execution."
  );
  const aiVaLane = createLane(
    "ai_va_operator_support",
    input.aiVaOperatorSupportPlanned ? [] : ["AI VA operator-support workflow not planned"],
    "AI VA support should be planned for summaries, prep, and prioritization only."
  );
  const followUpLane = createLane(
    "follow_up_discipline",
    [
      input.automationStatus === "scheduled" || input.automationStatus === "idle" || input.nextFollowUpAt || (input.followUpCount ?? 0) > 0
        ? ""
        : "follow-up discipline not visible",
    ].filter(Boolean),
    "Follow-up discipline must be visible before provider activation is considered."
  );
  const providerLane = createLane(
    "provider_activation_blockers",
    [
      input.providerIdentityPlanned ? "" : "provider identity not planned",
      input.approvedSendPathPlanned ? "" : "no approved send path",
    ].filter(Boolean),
    "Provider activation remains blocked until identity and send-path planning are complete."
  );
  const identityLane = createLane(
    "communication_identity",
    [
      input.providerIdentityPlanned ? "" : "provider identity not planned",
      input.communicationAuditPlanned ? "" : "no communication audit plan",
    ].filter(Boolean),
    "Communication identity, auditability, and opt-out handling must be planned before activation."
  );

  const readinessLanes = [
    contactLane,
    dncLane,
    propertyLane,
    sellerReplyLane,
    humanApprovalLane,
    aiVaLane,
    followUpLane,
    providerLane,
    identityLane,
  ];
  const blockers = unique(readinessLanes.flatMap((lane) => lane.blockers));
  const hardSafetyBlockers = dncLane.blockers.length + propertyLane.blockers.length + contactLane.blockers.length;
  const communicationReadinessStatus: CommunicationReadinessStatus =
    hardSafetyBlockers > 0 ? "not_ready" : blockers.length > 0 ? "needs_operator_review" : "readiness_planning_only";
  const recommendedNextExactStep: CommunicationReadinessNextStep =
    sellerReplyLane.ready && input.conversationMemoryPlanned ? "C2 AI VA Operator Workflow Review" : "C3 Seller Conversation Memory Planning";

  const result: CommunicationReadinessReview = {
    phase: "C1 Communication Readiness Review",
    communicationReadinessStatus,
    readinessLanes,
    blockers,
    recommendedNextExactStep,
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: communicationReadinessReviewFlags,
  };

  assertCommunicationReadinessReviewInvariants(result);

  return result;
}

export function assertCommunicationReadinessReviewInvariants(result: CommunicationReadinessReview) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("C1 communication readiness review must remain read-only, advisory-only, and planning-only.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("C1 communication readiness review cannot authorize providers, outbound communication, automation, queues, reminders, runtime jobs, polling, CRM automation, negotiation, or AI-only seller handling.");
  }

  if (!["C2 AI VA Operator Workflow Review", "C3 Seller Conversation Memory Planning"].includes(result.recommendedNextExactStep)) {
    throw new Error("C1 communication readiness review must recommend a planning step before provider activation.");
  }
}

export function summarizeCommunicationReadinessReview(result: CommunicationReadinessReview) {
  assertCommunicationReadinessReviewInvariants(result);

  return `${result.phase}: ${result.communicationReadinessStatus}. ${result.blockers.length} blocker(s) found. Next step is ${result.recommendedNextExactStep}. No provider activation, outbound SMS/email/calling, queues, reminders, runtime jobs, polling, CRM automation, autonomous negotiation, autonomous seller handling, autonomous follow-up, or AI-only seller handling is authorized.`;
}
