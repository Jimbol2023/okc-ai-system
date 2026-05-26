import {
  phase3FinalLockdownRules,
  phase3LeadPrioritizationFinalLockdownFlags,
} from "./phase-3-lead-prioritization-final-lockdown";

export const phase4SellerReviewCallPrepScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  queueAssignmentEnabled: false,
  sellerCallRecordMutationEnabled: false,
  followUpCreationEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  phase5ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase4Decision = "not_authorized";

export type Phase4SellerReviewCallPrepScope = {
  phase: "Phase 4: Seller Review & Call Prep";
  phaseStep: "Phase 4A — Seller Review & Call Prep Scope";
  previousStep: "Phase 3F — Lead Prioritization Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_seller_communication_property_verification_call_judgment_negotiation_execution_owner";
  implementationDecision: Phase4Decision;
  providerDecision: Phase4Decision;
  automationDecision: Phase4Decision;
  communicationDecision: Phase4Decision;
  crmMutationDecision: Phase4Decision;
  schemaDecision: Phase4Decision;
  storageDecision: Phase4Decision;
  runtimeDecision: Phase4Decision;
  outreachDecision: Phase4Decision;
  callingDecision: Phase4Decision;
  messageSendingDecision: Phase4Decision;
  queueDecision: Phase4Decision;
  recommendedNextExactStep: "Phase 4B — Seller Review Signal Audit";
  nextStageRecommendation: "Phase 4B — Seller Review Signal Audit";
  phase3FinalLockdownReference: {
    flags: typeof phase3LeadPrioritizationFinalLockdownFlags;
    rules: typeof phase3FinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase4SellerReviewCallPrepScopeFlags;
};

export const phase4ScopePurpose = [
  "Define read-only Seller Review & Call Prep planning for highest acquisition ROI per operator hour.",
  "Prepare seller context, missing information visibility, question-prep notes, and call-prep guidance for human review only.",
  "Improve operator focus before manual seller conversations without contacting sellers, mutating records, or creating execution tasks.",
];

export const phase4ScopeStopRules = [
  "Phase 4A is scope only.",
  "No seller outreach, calling, SMS, email, provider activation, CRM mutation, seller-call record mutation, follow-up creation, queue assignment, scraping, skip tracing, offer generation, contract generation, Phase 5 implementation, or go-live is authorized.",
];

export const phase4ScopeAiBoundary = [
  "summarize seller review context for human review only",
  "identify missing seller context visibility",
  "prepare internal question-prep notes",
  "explain call-prep risks for operator focus",
  "do not invent property facts",
  "do not enrich leads with unverified facts",
  "do not contact sellers",
  "do not call sellers",
  "do not send SMS or email",
  "do not mutate CRM records",
  "do not mutate seller-call records",
  "do not create follow-ups or queues",
  "do not activate providers",
  "do not scrape data",
  "do not skip trace owners",
  "do not generate offers or contracts",
  "do not approve implementation or go-live",
];

export const phase4ScopeHumanBoundary = [
  "final seller communication",
  "call execution",
  "call judgment",
  "negotiation",
  "property fact verification",
  "seller motivation judgment",
  "source judgment",
  "CRM approval",
  "future implementation approval",
];

export const phase4ForbiddenDrift = [
  "seller outreach",
  "calling",
  "SMS sending",
  "email sending",
  "provider activation",
  "CRM mutation",
  "seller-call record mutation",
  "follow-up creation",
  "queue assignment",
  "scraping",
  "skip tracing",
  "invented property facts",
  "offer generation",
  "contract generation",
  "Phase 5 implementation",
  "go-live",
];

export function getPhase4SellerReviewCallPrepScope(): Phase4SellerReviewCallPrepScope {
  const result: Phase4SellerReviewCallPrepScope = {
    phase: "Phase 4: Seller Review & Call Prep",
    phaseStep: "Phase 4A — Seller Review & Call Prep Scope",
    previousStep: "Phase 3F — Lead Prioritization Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_seller_communication_property_verification_call_judgment_negotiation_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    messageSendingDecision: "not_authorized",
    queueDecision: "not_authorized",
    recommendedNextExactStep: "Phase 4B — Seller Review Signal Audit",
    nextStageRecommendation: "Phase 4B — Seller Review Signal Audit",
    phase3FinalLockdownReference: {
      flags: phase3LeadPrioritizationFinalLockdownFlags,
      rules: phase3FinalLockdownRules,
    },
    scopePurpose: phase4ScopePurpose,
    stopRules: phase4ScopeStopRules,
    aiOperatorLeverageBoundary: phase4ScopeAiBoundary,
    humanOwnershipBoundary: phase4ScopeHumanBoundary,
    forbiddenDrift: phase4ForbiddenDrift,
    flags: phase4SellerReviewCallPrepScopeFlags,
  };
  assertPhase4SellerReviewCallPrepScopeSafe(result);
  return result;
}

export function assertPhase4SellerReviewCallPrepScopeSafe(result: Phase4SellerReviewCallPrepScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /outreach is authorized|calling is authorized|SMS sending is authorized|email sending is authorized|provider activation is authorized|CRM mutation is authorized|seller-call record mutation is authorized|follow-up creation is authorized|queue assignment is authorized|scraping is authorized|skip tracing is authorized|offer generation is authorized|contract generation is authorized|Phase 5 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 4: Seller Review & Call Prep") throw new Error("Phase 4A phase must remain pinned.");
  if (result.phaseStep !== "Phase 4A — Seller Review & Call Prep Scope") throw new Error("Phase 4A step must remain pinned.");
  if (result.previousStep !== "Phase 3F — Lead Prioritization Final Lockdown") throw new Error("Phase 4A previous step must remain Phase 3F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 4A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 4A must remain scope-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.schemaDecision !== "not_authorized" ||
    result.storageDecision !== "not_authorized" ||
    result.runtimeDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized" ||
    result.messageSendingDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized"
  ) throw new Error("Phase 4A decisions must remain not_authorized.");
  if (result.recommendedNextExactStep !== "Phase 4B — Seller Review Signal Audit") throw new Error("Phase 4A must hand off to Phase 4B.");
  if (result.phase3FinalLockdownReference.rules.join("|") !== phase3FinalLockdownRules.join("|")) throw new Error("Phase 4A must preserve Phase 3F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 4A blocked flags cannot turn true.");
  if (!/No seller outreach/i.test(result.stopRules.join(" ")) || !/no go-live/i.test(result.stopRules.join(" "))) throw new Error("Phase 4A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 4A AI boundary is missing.");
  if (!/final seller communication/i.test(result.humanOwnershipBoundary.join(" ")) || !/call execution/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 4A human boundary is missing.");
  if (!/seller outreach/i.test(result.forbiddenDrift.join(" ")) || !/Phase 5 implementation/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 4A forbidden drift is missing.");
  if (unsafePattern.test(text)) throw new Error("Phase 4A wording must not imply unsafe authorization.");
}

export function getPhase4SellerReviewCallPrepScopeSummary() {
  const result = getPhase4SellerReviewCallPrepScope();
  return `${result.phase} / ${result.phaseStep}: read-only Seller Review & Call Prep scope for highest acquisition ROI per operator hour with human-owned seller communication, call judgment, negotiation, and verification. No outreach, no calling, no SMS/email sending, no CRM mutation, no seller-call mutation, no scraping, no skip tracing, no autonomous lead creation, no offer or contract generation, no Phase 5 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
