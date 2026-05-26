import { phase3MinimalGateLanes } from "./phase-3-minimal-prioritization-gate";

export const phase3LeadPrioritizationFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase3LockdownEnforced: true,
  implementationAuthorized: false,
  scorePersistenceEnabled: false,
  crmMutationEnabled: false,
  routingEnabled: false,
  queueAssignmentEnabled: false,
  outreachEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase4ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase3LeadPrioritizationFinalLockdown = {
  phase: "Phase 3: Lead Prioritization Engine";
  phaseStep: "Phase 3F — Lead Prioritization Final Lockdown";
  previousStep: "Phase 3E — Minimal Prioritization Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  scorePersistenceDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueAssignmentDecision: "not_authorized";
  recommendedNextExactStep: "Phase 4 — Seller Review & Call Prep";
  nextStageRecommendation: "Phase 4 — Seller Review & Call Prep";
  finalLockdownRules: string[];
  phase3eGateReferences: typeof phase3MinimalGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase3LeadPrioritizationFinalLockdownFlags;
};

export const phase3FinalLockdownRules = [
  "Phase 3F locks Phase 3 as read-only advisory planning only.",
  "Phase 3F authorizes no implementation, score persistence, CRM mutation, routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live.",
  "Phase 3F can recommend Phase 4 — Seller Review & Call Prep as the next roadmap phase only after human review.",
];

export const phase3FinalLockdownAiBoundary = [
  "summarize Phase 3 closeout for human review only",
  "summarize Phase 3A through Phase 3E continuity",
  "prepare Phase 4 transition notes for human review",
  "do not invent property facts",
  "do not persist scores",
  "do not mutate CRM records",
  "do not route leads",
  "do not create queues or assignments",
  "do not contact sellers",
  "do not activate providers",
  "do not scrape data",
  "do not skip trace owners",
  "do not create leads",
  "do not approve Phase 4 implementation",
  "do not authorize go-live",
];

export const phase3FinalLockdownHumanBoundary = [
  "Phase 3 closeout approval",
  "Phase 4 transition approval",
  "final prioritization judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "CRM approval",
  "future implementation approval",
];

export const phase3FinalLockdownForbiddenDrift = [
  "implementation",
  "score persistence",
  "CRM mutation",
  "routing",
  "queues",
  "assignments",
  "outreach",
  "providers",
  "scraping",
  "skip tracing",
  "autonomous lead creation",
  "Phase 4 implementation",
  "go-live",
];

export function getPhase3LeadPrioritizationFinalLockdown(): Phase3LeadPrioritizationFinalLockdown {
  const result: Phase3LeadPrioritizationFinalLockdown = {
    phase: "Phase 3: Lead Prioritization Engine",
    phaseStep: "Phase 3F — Lead Prioritization Final Lockdown",
    previousStep: "Phase 3E — Minimal Prioritization Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    scorePersistenceDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueAssignmentDecision: "not_authorized",
    recommendedNextExactStep: "Phase 4 — Seller Review & Call Prep",
    nextStageRecommendation: "Phase 4 — Seller Review & Call Prep",
    finalLockdownRules: phase3FinalLockdownRules,
    phase3eGateReferences: phase3MinimalGateLanes,
    aiOperatorLeverageBoundary: phase3FinalLockdownAiBoundary,
    humanOwnershipBoundary: phase3FinalLockdownHumanBoundary,
    forbiddenDrift: phase3FinalLockdownForbiddenDrift,
    flags: phase3LeadPrioritizationFinalLockdownFlags,
  };
  assertPhase3LeadPrioritizationFinalLockdownSafe(result);
  return result;
}

export function assertPhase3LeadPrioritizationFinalLockdownSafe(result: Phase3LeadPrioritizationFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase3LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|score persistence is authorized|CRM mutation is authorized|routing is authorized|queues? are authorized|assignments? are authorized|outreach is authorized|providers? are authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 4 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 3F — Lead Prioritization Final Lockdown") throw new Error("Phase 3F step must remain pinned.");
  if (result.previousStep !== "Phase 3E — Minimal Prioritization Gate") throw new Error("Phase 3F previous step must remain Phase 3E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 3F must remain final-lockdown-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.scorePersistenceDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.queueAssignmentDecision !== "not_authorized"
  ) throw new Error("Phase 3F decisions must remain not_authorized.");
  if (result.phase3eGateReferences.join("|") !== phase3MinimalGateLanes.join("|")) throw new Error("Phase 3F must preserve Phase 3E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase3LockdownEnforced) throw new Error("Phase 3F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/authorizes no implementation/i.test(text) || !/score persistence/i.test(text) || !/Phase 4 — Seller Review & Call Prep/i.test(text)) throw new Error("Phase 3F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 4 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 3F AI boundary is missing.");
  if (!/Phase 3 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 4 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 3F human boundary is missing.");
  if (!/score persistence/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 3F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 4 — Seller Review & Call Prep") throw new Error("Phase 3F must recommend Phase 4.");
  if (unsafePattern.test(text)) throw new Error("Phase 3F wording must not imply unsafe authorization.");
}

export function getPhase3LeadPrioritizationFinalLockdownSummary() {
  const result = getPhase3LeadPrioritizationFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only advisory prioritization planning. No implementation, score persistence, CRM mutation, routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
