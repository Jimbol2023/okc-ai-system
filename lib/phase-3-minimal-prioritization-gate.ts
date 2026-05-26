import { phase3ImplementationScopeLanes } from "./phase-3-prioritization-engine-implementation-scope";

export const phase3MinimalPrioritizationGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  minimalGateOnly: true,
  operatorLeverageOnly: true,
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

export type Phase3MinimalGateLane =
  | "minimal_advisory_package"
  | "operator_roi_review"
  | "blocked_execution_paths"
  | "phase_3f_lockdown_requirements";

export type Phase3MinimalPrioritizationGate = {
  phase: "Phase 3: Lead Prioritization Engine";
  phaseStep: "Phase 3E — Minimal Prioritization Gate";
  previousStep: "Phase 3D — Prioritization Engine Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  scorePersistenceDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueAssignmentDecision: "not_authorized";
  recommendedNextExactStep: "Phase 3F — Lead Prioritization Final Lockdown";
  nextStageRecommendation: "Phase 3F — Lead Prioritization Final Lockdown";
  gateLanes: Phase3MinimalGateLane[];
  implementationScopeReferences: typeof phase3ImplementationScopeLanes;
  gateRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  flags: typeof phase3MinimalPrioritizationGateFlags;
};

export const phase3MinimalGateLanes: Phase3MinimalGateLane[] = [
  "minimal_advisory_package",
  "operator_roi_review",
  "blocked_execution_paths",
  "phase_3f_lockdown_requirements",
];

export const phase3MinimalGateRules = [
  "Phase 3E gates whether a minimal advisory prioritization package is worth considering.",
  "Phase 3E cannot authorize implementation, score persistence, CRM mutation, routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live.",
  "Phase 3E hands off only to final Phase 3 lockdown.",
];

export const phase3MinimalGateAiBoundary = [
  "summarize minimal advisory package value for human review only",
  "explain acquisition ROI per operator hour tradeoffs",
  "do not implement scoring",
  "do not persist scores",
  "do not mutate CRM records",
  "do not route leads",
  "do not create queues or assignments",
  "do not contact sellers",
  "do not activate providers",
  "do not scrape data",
  "do not skip trace owners",
  "do not create leads",
  "do not approve implementation",
  "do not authorize go-live",
];

export const phase3MinimalGateHumanBoundary = [
  "final minimal package decision",
  "final prioritization judgment",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "implementation approval",
  "go-live approval ownership",
];

export function getPhase3MinimalPrioritizationGate(): Phase3MinimalPrioritizationGate {
  const result: Phase3MinimalPrioritizationGate = {
    phase: "Phase 3: Lead Prioritization Engine",
    phaseStep: "Phase 3E — Minimal Prioritization Gate",
    previousStep: "Phase 3D — Prioritization Engine Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    scorePersistenceDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueAssignmentDecision: "not_authorized",
    recommendedNextExactStep: "Phase 3F — Lead Prioritization Final Lockdown",
    nextStageRecommendation: "Phase 3F — Lead Prioritization Final Lockdown",
    gateLanes: phase3MinimalGateLanes,
    implementationScopeReferences: phase3ImplementationScopeLanes,
    gateRules: phase3MinimalGateRules,
    aiOperatorLeverageBoundary: phase3MinimalGateAiBoundary,
    humanOwnershipBoundary: phase3MinimalGateHumanBoundary,
    flags: phase3MinimalPrioritizationGateFlags,
  };
  assertPhase3MinimalPrioritizationGateSafe(result);
  return result;
}

export function assertPhase3MinimalPrioritizationGateSafe(result: Phase3MinimalPrioritizationGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "minimalGateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|score persistence is authorized|CRM mutation is authorized|routing is authorized|queues? are authorized|assignments? are authorized|outreach is authorized|providers? are authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 4 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 3E — Minimal Prioritization Gate") throw new Error("Phase 3E step must remain pinned.");
  if (result.previousStep !== "Phase 3D — Prioritization Engine Implementation Scope") throw new Error("Phase 3E previous step must remain Phase 3D.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.scorePersistenceDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.queueAssignmentDecision !== "not_authorized"
  ) throw new Error("Phase 3E decisions must remain not_authorized.");
  if (result.gateLanes.join("|") !== phase3MinimalGateLanes.join("|")) throw new Error("Phase 3E must include all minimal gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase3ImplementationScopeLanes.join("|")) throw new Error("Phase 3E must preserve Phase 3D scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 3E blocked flags cannot turn true.");
  if (!/cannot authorize implementation/i.test(result.gateRules.join(" ")) || !/score persistence/i.test(result.gateRules.join(" "))) throw new Error("Phase 3E gate rules must block implementation and persistence.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not authorize go-live/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 3E AI boundary is missing.");
  if (!/final minimal package decision/i.test(result.humanOwnershipBoundary.join(" ")) || !/implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 3E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 3F — Lead Prioritization Final Lockdown") throw new Error("Phase 3E must hand off to Phase 3F.");
  if (unsafePattern.test(text)) throw new Error("Phase 3E wording must not imply unsafe authorization.");
}

export function getPhase3MinimalPrioritizationGateSummary() {
  const result = getPhase3MinimalPrioritizationGate();
  return `${result.phase} / ${result.phaseStep}: gates whether a minimal advisory prioritization package is worth considering. No implementation, score persistence, CRM mutation, routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
