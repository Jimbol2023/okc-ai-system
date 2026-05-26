import { phase3PrioritySignalFamilies } from "./phase-3-lead-priority-signal-audit";

export const phase3AdvisoryPrioritizationPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  hiddenScoringEnabled: false,
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

export type Phase3AdvisoryPriorityLane =
  | "stop_first"
  | "data_quality_review"
  | "contact_safety_review"
  | "work_first"
  | "follow_up_priority"
  | "seller_reply_review"
  | "high_intent_review"
  | "nurture_monitor"
  | "defer_low_priority";

export type Phase3AdvisoryPrioritizationPolicy = {
  phase: "Phase 3: Lead Prioritization Engine";
  phaseStep: "Phase 3C — Advisory Prioritization Policy";
  previousStep: "Phase 3B — Lead Priority Signal Audit";
  phaseDecision: "advisory_policy_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  hiddenScoringDecision: "not_authorized";
  scorePersistenceDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueAssignmentDecision: "not_authorized";
  recommendedNextExactStep: "Phase 3D — Prioritization Engine Implementation Scope";
  nextStageRecommendation: "Phase 3D — Prioritization Engine Implementation Scope";
  advisoryPriorityLanes: Phase3AdvisoryPriorityLane[];
  signalReferences: typeof phase3PrioritySignalFamilies;
  policyRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  flags: typeof phase3AdvisoryPrioritizationPolicyFlags;
};

export const phase3AdvisoryPriorityLanes: Phase3AdvisoryPriorityLane[] = [
  "stop_first",
  "data_quality_review",
  "contact_safety_review",
  "work_first",
  "follow_up_priority",
  "seller_reply_review",
  "high_intent_review",
  "nurture_monitor",
  "defer_low_priority",
];

export const phase3AdvisoryPolicyRules = [
  "Advisory lanes may guide human review only.",
  "Stop-first and contact-safety lanes outrank revenue interest.",
  "No hidden scoring, score persistence, CRM mutation, routing, queue assignment, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized.",
];

export const phase3AdvisoryPolicyAiBoundary = [
  "rank leads into advisory lanes for human review only",
  "explain lane rationale using existing signals",
  "do not invent property facts",
  "do not enrich leads with unverified facts",
  "do not persist scores",
  "do not mutate CRM records",
  "do not route leads",
  "do not create queues or assignments",
  "do not contact sellers",
  "do not activate providers",
  "do not scrape data",
  "do not skip trace owners",
  "do not create leads",
  "do not make final lead quality decisions",
  "do not approve implementation",
];

export const phase3AdvisoryPolicyHumanBoundary = [
  "final prioritization judgment",
  "final lead quality decisions",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "implementation approval",
];

export function getPhase3AdvisoryPrioritizationPolicy(): Phase3AdvisoryPrioritizationPolicy {
  const result: Phase3AdvisoryPrioritizationPolicy = {
    phase: "Phase 3: Lead Prioritization Engine",
    phaseStep: "Phase 3C — Advisory Prioritization Policy",
    previousStep: "Phase 3B — Lead Priority Signal Audit",
    phaseDecision: "advisory_policy_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    hiddenScoringDecision: "not_authorized",
    scorePersistenceDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueAssignmentDecision: "not_authorized",
    recommendedNextExactStep: "Phase 3D — Prioritization Engine Implementation Scope",
    nextStageRecommendation: "Phase 3D — Prioritization Engine Implementation Scope",
    advisoryPriorityLanes: phase3AdvisoryPriorityLanes,
    signalReferences: phase3PrioritySignalFamilies,
    policyRules: phase3AdvisoryPolicyRules,
    aiOperatorLeverageBoundary: phase3AdvisoryPolicyAiBoundary,
    humanOwnershipBoundary: phase3AdvisoryPolicyHumanBoundary,
    flags: phase3AdvisoryPrioritizationPolicyFlags,
  };
  assertPhase3AdvisoryPrioritizationPolicySafe(result);
  return result;
}

export function assertPhase3AdvisoryPrioritizationPolicySafe(result: Phase3AdvisoryPrioritizationPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.advisoryPriorityLanes].flat().join(" ");
  const unsafePattern = /hidden scoring is authorized|score persistence is authorized|CRM mutation is authorized|routing is authorized|queue assignment is authorized|outreach is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 4 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 3C — Advisory Prioritization Policy") throw new Error("Phase 3C step must remain pinned.");
  if (result.previousStep !== "Phase 3B — Lead Priority Signal Audit") throw new Error("Phase 3C previous step must remain Phase 3B.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.hiddenScoringDecision !== "not_authorized" ||
    result.scorePersistenceDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.queueAssignmentDecision !== "not_authorized"
  ) throw new Error("Phase 3C decisions must remain not_authorized.");
  if (result.advisoryPriorityLanes.join("|") !== phase3AdvisoryPriorityLanes.join("|")) throw new Error("Phase 3C must include all advisory priority lanes.");
  if (result.signalReferences.join("|") !== phase3PrioritySignalFamilies.join("|")) throw new Error("Phase 3C must preserve Phase 3B signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 3C blocked flags cannot turn true.");
  if (!/human review only/i.test(result.policyRules.join(" ")) || !/No hidden scoring/i.test(result.policyRules.join(" "))) throw new Error("Phase 3C policy rules must block hidden scoring and execution.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not persist scores/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 3C AI boundary is missing.");
  if (!/final prioritization judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 3C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 3D — Prioritization Engine Implementation Scope") throw new Error("Phase 3C must hand off to Phase 3D.");
  if (unsafePattern.test(text)) throw new Error("Phase 3C wording must not imply unsafe authorization.");
}

export function getPhase3AdvisoryPrioritizationPolicySummary() {
  const result = getPhase3AdvisoryPrioritizationPolicy();
  return `${result.phase} / ${result.phaseStep}: defines advisory lanes ${result.advisoryPriorityLanes.join(", ")} for human review only. No hidden scoring, score persistence, CRM mutation, routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
