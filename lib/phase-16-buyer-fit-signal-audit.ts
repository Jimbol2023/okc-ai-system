import {
  phase16BuyerFitForbiddenDrift,
  phase16BuyerFitHumanBoundary,
} from "./phase-16-buyer-fit-intelligence-scope";

export const phase16BuyerFitSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  buyerRecordMutationEnabled: false,
  buyerActivityMutationEnabled: false,
  leadMutationEnabled: false,
  crmMutationEnabled: false,
  dispositionMutationEnabled: false,
  matchingExecutionEnabled: false,
  scorePersistenceEnabled: false,
  assignmentGenerationEnabled: false,
  contractGenerationEnabled: false,
  dealPackageSendingEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  campaignEnabled: false,
  providerActivated: false,
  runtimeJobsEnabled: false,
  auditWritingEnabled: false,
  storageMutationEnabled: false,
  goLiveAuthorized: false,
  phase17ImplementationEnabled: false,
} as const;

export type Phase16BuyerFitSignalFamily =
  | "phase_15_final_lockdown_handoff"
  | "buyer_demand_quality_score_activity_intelligence"
  | "disposition_buyer_matching_engine_types_card_api"
  | "buyer_readiness_r61_r62_r78_alignment_doctrine"
  | "x4_human_guided_buyer_matching_operations_doctrine"
  | "x7_near_close_buyer_readiness_boundaries"
  | "dashboard_revenue_buyer_ready_disposition_assignment_visibility"
  | "existing_safety_language_no_buyer_outreach_deal_blasting_mutation_or_runtime_matching";

export const phase16BuyerFitSignalFamilies: Phase16BuyerFitSignalFamily[] = [
  "phase_15_final_lockdown_handoff",
  "buyer_demand_quality_score_activity_intelligence",
  "disposition_buyer_matching_engine_types_card_api",
  "buyer_readiness_r61_r62_r78_alignment_doctrine",
  "x4_human_guided_buyer_matching_operations_doctrine",
  "x7_near_close_buyer_readiness_boundaries",
  "dashboard_revenue_buyer_ready_disposition_assignment_visibility",
  "existing_safety_language_no_buyer_outreach_deal_blasting_mutation_or_runtime_matching",
];

export type Phase16BuyerFitSignalAudit = {
  phase: "Phase 16: Buyer Fit Intelligence";
  phaseStep: "Phase 16B â€” Buyer Fit Signal Audit";
  previousStep: "Phase 16A â€” Buyer Fit Intelligence Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  buyerRecordDecision: "not_authorized";
  buyerActivityDecision: "not_authorized";
  leadDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  dispositionDecision: "not_authorized";
  matchingDecision: "not_authorized";
  scoreDecision: "not_authorized";
  assignmentDecision: "not_authorized";
  contractDecision: "not_authorized";
  dealPackageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  campaignDecision: "not_authorized";
  providerDecision: "not_authorized";
  runtimeDecision: "not_authorized";
  auditDecision: "not_authorized";
  storageDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 16C â€” Manual Buyer Fit Advisory Policy";
  nextStageRecommendation: "Phase 16C â€” Manual Buyer Fit Advisory Policy";
  signalFamilies: Phase16BuyerFitSignalFamily[];
  groundedReferences: {
    buyerIntelligenceFiles: string[];
    dispositionBuyerMatchingSurfaces: string[];
    buyerReadinessDoctrine: string[];
    humanGuidedOperationsDoctrine: string[];
    dashboardRevenueVisibilityConcepts: string[];
    safetyBoundaryReferences: string[];
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase16BuyerFitSignalAuditFlags;
};

export const phase16BuyerFitSignalAuditPurpose = [
  "Audit existing buyer-fit signal families without mutating buyer records, buyer activities, leads, CRM records, disposition records, scores, assignments, contracts, deal packages, providers, storage, outreach, campaigns, runtime jobs, or go-live state.",
  "Reference buyer demand, buyer quality, buyer score, buyer activity, disposition matching, readiness doctrine, human-guided buyer operations, near-close buyer readiness, and dashboard revenue visibility as advisory signals only.",
  "Support highest acquisition ROI per operator hour by making buyer profile fit, buyer demand alignment, deal-package readiness, property type fit, price/location fit, funding verification gaps, assignment readiness, buyer relationship priority, and disposition risk easier for humans to review.",
];

export const phase16BuyerFitSignalAuditStopRules = [
  "Phase 16B audits existing buyer-fit signal families only.",
  "No implementation, buyer outreach, seller outreach, SMS/email/calling, AI voice, deal blasting, buyer record mutation, buyer activity mutation, lead mutation, CRM mutation, disposition mutation, buyer score persistence, assignment agreement generation, contract generation, offer generation, deal package sending, automated buyer matching execution, routing, queues, assignments, reminders, runtime jobs, provider activation, external API/fetch/network behavior, scraping, skip tracing, campaign activation, ad activation, spend increases, audit writing, storage mutation, final buyer-fit decisions by AI, relationship decisions by AI, assignment decisions by AI, legal/compliance approval by AI, Phase 17 implementation, or go-live is authorized.",
];

export const phase16BuyerFitSignalAuditAiBoundary = [
  "summarize existing buyer-fit signals for human review only",
  "flag buyer profile completeness, buyer demand alignment, deal package readiness, property type fit, price range fit, location fit, funding verification gaps, assignment readiness, buyer relationship priority, and disposition risk",
  "do not contact buyers or sellers, blast deals, mutate buyer records or activities, persist scores, mutate CRM leads or disposition records, generate assignments contracts or offers, send deal packages, execute matching, route work, activate providers, scrape, skip trace, launch campaigns, increase spend, implement Phase 17, or authorize go-live",
];

export function getPhase16BuyerFitSignalAudit(): Phase16BuyerFitSignalAudit {
  const result: Phase16BuyerFitSignalAudit = {
    phase: "Phase 16: Buyer Fit Intelligence",
    phaseStep: "Phase 16B â€” Buyer Fit Signal Audit",
    previousStep: "Phase 16A â€” Buyer Fit Intelligence Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    buyerRecordDecision: "not_authorized",
    buyerActivityDecision: "not_authorized",
    leadDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    dispositionDecision: "not_authorized",
    matchingDecision: "not_authorized",
    scoreDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    contractDecision: "not_authorized",
    dealPackageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    campaignDecision: "not_authorized",
    providerDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    auditDecision: "not_authorized",
    storageDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 16C â€” Manual Buyer Fit Advisory Policy",
    nextStageRecommendation: "Phase 16C â€” Manual Buyer Fit Advisory Policy",
    signalFamilies: phase16BuyerFitSignalFamilies,
    groundedReferences: {
      buyerIntelligenceFiles: ["buyer-demand", "buyer-demand-intelligence", "buyer-intake", "buyer-quality", "buyer-score", "buyer-activity-score", "predictive-buyer-demand"],
      dispositionBuyerMatchingSurfaces: ["disposition-buyer-matching-engine", "types/disposition-buyer-matching", "DispositionBuyerMatchingCard", "/api/disposition-buyer-matching"],
      buyerReadinessDoctrine: ["buyer-disposition-readiness-usability", "r61-buyer-ready-disposition-priority", "r62-buyer-disposition-operational-intelligence", "r78-buyer-demand-alignment"],
      humanGuidedOperationsDoctrine: ["x4-human-guided-buyer-matching-operations", "x7-near-close-deal-recovery-operations"],
      dashboardRevenueVisibilityConcepts: ["buyer-ready leads", "buyer-readiness blockers", "disposition readiness", "assignment readiness", "buyer demand", "deal package checklist", "required verifications", "stop conditions"],
      safetyBoundaryReferences: ["no buyer outreach", "no deal blasting", "no assignment generation", "no buyer list mutation", "no score persistence", "no runtime matching execution"],
    },
    auditPurpose: phase16BuyerFitSignalAuditPurpose,
    stopRules: phase16BuyerFitSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase16BuyerFitSignalAuditAiBoundary,
    humanOwnershipBoundary: phase16BuyerFitHumanBoundary,
    forbiddenDrift: phase16BuyerFitForbiddenDrift,
    flags: phase16BuyerFitSignalAuditFlags,
  };
  assertPhase16BuyerFitSignalAuditSafe(result);
  return result;
}

export function assertPhase16BuyerFitSignalAuditSafe(result: Phase16BuyerFitSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /buyer outreach is authorized|deal blasting is authorized|buyer record mutation is authorized|buyer score persistence is authorized|assignment agreement generation is authorized|contract generation is authorized|deal package sending is authorized|automated buyer matching execution is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|Phase 17 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 16B â€” Buyer Fit Signal Audit") throw new Error("Phase 16B step must remain pinned.");
  if (result.previousStep !== "Phase 16A â€” Buyer Fit Intelligence Scope") throw new Error("Phase 16B previous step must remain Phase 16A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 16B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 16B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase16BuyerFitSignalFamilies.join("|")) throw new Error("Phase 16B must include all buyer-fit signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 16B blocked flags cannot turn true.");
  if (!/buyer_demand_quality_score_activity/i.test(result.signalFamilies.join(" ")) || !/disposition_buyer_matching/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 16B repo-grounded signals are missing.");
  if (!/audits existing buyer-fit signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 16B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not contact buyers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 16B AI boundary is missing.");
  if (!/buyer relationship ownership/i.test(result.humanOwnershipBoundary.join(" ")) || !/deal-package approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 16B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 16C â€” Manual Buyer Fit Advisory Policy") throw new Error("Phase 16B must hand off to Phase 16C.");
  if (unsafePattern.test(text)) throw new Error("Phase 16B wording must not imply unsafe authorization.");
}

export function getPhase16BuyerFitSignalAuditSummary() {
  const result = getPhase16BuyerFitSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing buyer demand, buyer quality, buyer score, buyer activity, disposition matching, readiness, human-guided buyer operations, near-close buyer readiness, and dashboard revenue visibility signals for highest acquisition ROI per operator hour. Human-owned buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, and compliance review remain required. No buyer outreach, no deal blasting, no buyer mutation, no CRM mutation, no assignment/contract generation, no deal package sending, no go-live, and no Phase 17 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
