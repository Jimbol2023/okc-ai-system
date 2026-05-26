import { phase16MinimalBuyerFitGateChecks } from "./phase-16-minimal-buyer-fit-gate";
import {
  phase16BuyerFitForbiddenDrift,
  phase16BuyerFitHumanBoundary,
} from "./phase-16-buyer-fit-intelligence-scope";

export const phase16BuyerFitFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
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
  offerGenerationEnabled: false,
  dealPackageSendingEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  routingEnabled: false,
  queueEnabled: false,
  providerActivated: false,
  campaignEnabled: false,
  auditWritingEnabled: false,
  storageMutationEnabled: false,
  goLiveAuthorized: false,
  phase17ImplementationEnabled: false,
} as const;

export type Phase16BuyerFitFinalLockdown = {
  phase: "Phase 16: Buyer Fit Intelligence";
  phaseStep: "Phase 16F â€” Buyer Fit Final Lockdown";
  previousStep: "Phase 16E â€” Minimal Buyer Fit Gate";
  phaseDecision: "final_lockdown_only";
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
  offerDecision: "not_authorized";
  dealPackageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueDecision: "not_authorized";
  providerDecision: "not_authorized";
  campaignDecision: "not_authorized";
  auditDecision: "not_authorized";
  storageDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 17 â€” Pentest & Security Engine";
  nextStageRecommendation: "Phase 17 â€” Pentest & Security Engine";
  gateReferences: typeof phase16MinimalBuyerFitGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase16BuyerFitFinalLockdownFlags;
};

export const phase16BuyerFitFinalLockdownRules = [
  "Phase 16F locks Phase 16 as read-only planning for Buyer Fit Intelligence.",
  "Phase 16F preserves the no-buyer-outreach, no-deal-blasting, no-buyer-record-mutation, no-buyer-activity-mutation, no-score-persistence, no-matching-execution, no-assignment-generation, no-contract-generation, no-deal-package-sending, no-CRM-mutation, no-provider, no-campaign, no-audit-writing, and no-go-live boundary.",
  "Phase 16F can recommend Phase 17 â€” Pentest & Security Engine, but cannot implement Phase 17.",
];

export const phase16BuyerFitFinalLockdownStopRules = [
  "Phase 16F is final lockdown only.",
  "No implementation, buyer outreach, seller outreach, SMS/email/calling, AI voice, deal blasting, buyer record mutation, buyer activity mutation, lead mutation, CRM mutation, disposition mutation, buyer score persistence, assignment agreement generation, contract generation, offer generation, deal package sending, automated buyer matching execution, routing, queues, assignments, reminders, runtime jobs, provider activation, external API/fetch/network behavior, scraping, skip tracing, campaign activation, ad activation, spend increases, audit writing, storage mutation, final buyer-fit decisions by AI, relationship decisions by AI, assignment decisions by AI, legal/compliance approval by AI, Phase 17 implementation, or go-live is authorized.",
];

export const phase16BuyerFitFinalLockdownAiBoundary = [
  "summarize Phase 16 lockdown boundaries for human review only",
  "do not implement Phase 17, contact buyers or sellers, blast deals, mutate buyer records or activities, persist scores, mutate CRM leads or disposition records, generate assignments contracts or offers, send deal packages, execute matching, route work, create queues, activate providers, launch campaigns, write audits, or authorize go-live",
];

export function getPhase16BuyerFitFinalLockdown(): Phase16BuyerFitFinalLockdown {
  const result: Phase16BuyerFitFinalLockdown = {
    phase: "Phase 16: Buyer Fit Intelligence",
    phaseStep: "Phase 16F â€” Buyer Fit Final Lockdown",
    previousStep: "Phase 16E â€” Minimal Buyer Fit Gate",
    phaseDecision: "final_lockdown_only",
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
    offerDecision: "not_authorized",
    dealPackageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueDecision: "not_authorized",
    providerDecision: "not_authorized",
    campaignDecision: "not_authorized",
    auditDecision: "not_authorized",
    storageDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 17 â€” Pentest & Security Engine",
    nextStageRecommendation: "Phase 17 â€” Pentest & Security Engine",
    gateReferences: phase16MinimalBuyerFitGateChecks,
    lockdownRules: phase16BuyerFitFinalLockdownRules,
    stopRules: phase16BuyerFitFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase16BuyerFitFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase16BuyerFitHumanBoundary,
    forbiddenDrift: phase16BuyerFitForbiddenDrift,
    flags: phase16BuyerFitFinalLockdownFlags,
  };
  assertPhase16BuyerFitFinalLockdownSafe(result);
  return result;
}

export function assertPhase16BuyerFitFinalLockdownSafe(result: Phase16BuyerFitFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|buyer outreach is authorized|deal blasting is authorized|buyer record mutation is authorized|score persistence is authorized|matching execution is authorized|assignment .*generation is authorized|contract generation is authorized|deal package sending is authorized|CRM mutation is authorized|provider activation is authorized|audit writing is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 16F â€” Buyer Fit Final Lockdown") throw new Error("Phase 16F step must remain pinned.");
  if (result.previousStep !== "Phase 16E â€” Minimal Buyer Fit Gate") throw new Error("Phase 16F previous step must remain Phase 16E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 16F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 16F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase16MinimalBuyerFitGateChecks.join("|")) throw new Error("Phase 16F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 16F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 16F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 17/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 16F AI boundary is missing.");
  if (!/buyer-fit judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/buyer relationship ownership/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 16F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 17 â€” Pentest & Security Engine") throw new Error("Phase 16F must recommend Phase 17.");
  if (unsafePattern.test(text)) throw new Error("Phase 16F wording must not imply unsafe authorization.");
}

export function getPhase16BuyerFitFinalLockdownSummary() {
  const result = getPhase16BuyerFitFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 16 Buyer Fit Intelligence planning for highest acquisition ROI per operator hour with human-owned buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, compliance review, and go-live approval. No buyer outreach, no deal blasting, no buyer mutation, no CRM mutation, no assignment/contract generation, no deal package sending, no go-live, and no Phase 17 implementation are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
