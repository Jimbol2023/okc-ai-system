import { phase4ForbiddenDrift } from "./phase-4-seller-review-call-prep-scope";

export const phase4SellerReviewSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  communicationEnabled: false,
  automationEnabled: false,
  crmMutationEnabled: false,
  sellerCallRecordMutationEnabled: false,
  followUpCreationEnabled: false,
  queueAssignmentEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  phase5ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase4SellerReviewSignalFamily =
  | "lead_identity_contact_fields"
  | "lead_property_source_status_fields"
  | "lead_score_priority_notes_payload_fields"
  | "review_safety_fields"
  | "seller_reply_fields"
  | "follow_up_visibility_fields"
  | "seller_call_outcome_fields"
  | "seller_call_usability_helper_concepts"
  | "seller_call_outcome_plan_concepts"
  | "human_guided_seller_conversation_helper_concepts";

export const phase4SellerReviewSignalFamilies: Phase4SellerReviewSignalFamily[] = [
  "lead_identity_contact_fields",
  "lead_property_source_status_fields",
  "lead_score_priority_notes_payload_fields",
  "review_safety_fields",
  "seller_reply_fields",
  "follow_up_visibility_fields",
  "seller_call_outcome_fields",
  "seller_call_usability_helper_concepts",
  "seller_call_outcome_plan_concepts",
  "human_guided_seller_conversation_helper_concepts",
];

export type Phase4SellerReviewSignalAudit = {
  phase: "Phase 4: Seller Review & Call Prep";
  phaseStep: "Phase 4B — Seller Review Signal Audit";
  previousStep: "Phase 4A — Seller Review & Call Prep Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sellerCallMutationDecision: "not_authorized";
  followUpCreationDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callingDecision: "not_authorized";
  queueDecision: "not_authorized";
  recommendedNextExactStep: "Phase 4C — Call Prep Advisory Policy";
  nextStageRecommendation: "Phase 4C — Call Prep Advisory Policy";
  signalFamilies: Phase4SellerReviewSignalFamily[];
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase4SellerReviewSignalAuditFlags;
};

export const phase4SellerReviewSignalAuditPurpose = [
  "Audit existing seller review and call-prep signals without changing the lead, CRM, follow-up, or seller-call outcome records.",
  "Surface missing seller context, source clarity, contact safety, reply context, motivation, timeline, condition, price expectations, and manual next-step visibility.",
  "Support highest acquisition ROI per operator hour by reducing pre-call review time while preserving human-owned seller communication.",
];

export const phase4SellerReviewSignalAuditStopRules = [
  "Phase 4B audits existing signal families only.",
  "No outreach, calling, message sending, CRM mutation, seller-call record mutation, follow-up creation, queues, providers, scraping, skip tracing, offers, contracts, Phase 5 implementation, or go-live is authorized.",
];

export const phase4SellerReviewSignalAuditAiBoundary = [
  "summarize existing seller review signals for human review only",
  "flag missing seller context visibility",
  "organize call-prep context without creating outreach",
  "do not invent property facts",
  "do not contact sellers",
  "do not call sellers",
  "do not send SMS or email",
  "do not mutate CRM or seller-call records",
  "do not create follow-ups or queues",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not generate offers or contracts",
];

export const phase4SellerReviewSignalAuditHumanBoundary = [
  "seller review judgment",
  "call-prep judgment",
  "seller communication",
  "call execution",
  "property fact verification",
  "source judgment",
  "future implementation approval",
];

export function getPhase4SellerReviewSignalAudit(): Phase4SellerReviewSignalAudit {
  const result: Phase4SellerReviewSignalAudit = {
    phase: "Phase 4: Seller Review & Call Prep",
    phaseStep: "Phase 4B — Seller Review Signal Audit",
    previousStep: "Phase 4A — Seller Review & Call Prep Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sellerCallMutationDecision: "not_authorized",
    followUpCreationDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    queueDecision: "not_authorized",
    recommendedNextExactStep: "Phase 4C — Call Prep Advisory Policy",
    nextStageRecommendation: "Phase 4C — Call Prep Advisory Policy",
    signalFamilies: phase4SellerReviewSignalFamilies,
    auditPurpose: phase4SellerReviewSignalAuditPurpose,
    stopRules: phase4SellerReviewSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase4SellerReviewSignalAuditAiBoundary,
    humanOwnershipBoundary: phase4SellerReviewSignalAuditHumanBoundary,
    forbiddenDrift: phase4ForbiddenDrift,
    flags: phase4SellerReviewSignalAuditFlags,
  };
  assertPhase4SellerReviewSignalAuditSafe(result);
  return result;
}

export function assertPhase4SellerReviewSignalAuditSafe(result: Phase4SellerReviewSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /outreach is authorized|calling is authorized|message sending is authorized|CRM mutation is authorized|seller-call record mutation is authorized|follow-up creation is authorized|queues? are authorized|providers? are authorized|scraping is authorized|skip tracing is authorized|offer generation is authorized|contract generation is authorized|Phase 5 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 4B — Seller Review Signal Audit") throw new Error("Phase 4B step must remain pinned.");
  if (result.previousStep !== "Phase 4A — Seller Review & Call Prep Scope") throw new Error("Phase 4B previous step must remain Phase 4A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 4B must remain signal-audit-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.sellerCallMutationDecision !== "not_authorized" ||
    result.followUpCreationDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized"
  ) throw new Error("Phase 4B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase4SellerReviewSignalFamilies.join("|")) throw new Error("Phase 4B must include all seller review signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 4B blocked flags cannot turn true.");
  if (!/seller_call_outcome_fields/i.test(result.signalFamilies.join(" ")) || !/seller_reply_fields/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 4B repo-grounded signals are missing.");
  if (!/audits existing signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 4B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 4B AI boundary is missing.");
  if (!/seller communication/i.test(result.humanOwnershipBoundary.join(" ")) || !/call execution/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 4B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 4C — Call Prep Advisory Policy") throw new Error("Phase 4B must hand off to Phase 4C.");
  if (unsafePattern.test(text)) throw new Error("Phase 4B wording must not imply unsafe authorization.");
}

export function getPhase4SellerReviewSignalAuditSummary() {
  const result = getPhase4SellerReviewSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing lead, review-safety, seller-reply, follow-up visibility, seller-call outcome, seller-call usability, seller-call plan, and human-guided seller conversation signals for highest acquisition ROI per operator hour. Human-owned seller communication remains required. No outreach, no calling, no CRM mutation, no scraping, no autonomous lead creation, no offer or contract generation, no Phase 5 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
