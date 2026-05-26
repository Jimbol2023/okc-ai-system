import { phase3AdvisoryPriorityLanes } from "./phase-3-advisory-prioritization-policy";

export const phase3PrioritizationImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  scorePersistenceEnabled: false,
  crmMutationEnabled: false,
  automatedRoutingEnabled: false,
  queueAssignmentEnabled: false,
  outreachEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase4ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase3ImplementationScopeLane =
  | "candidate_advisory_priority_surface"
  | "candidate_operator_review_explanation"
  | "blocked_mutation_and_routing_paths"
  | "phase_3e_gate_requirements";

export type Phase3PrioritizationImplementationScope = {
  phase: "Phase 3: Lead Prioritization Engine";
  phaseStep: "Phase 3D — Prioritization Engine Implementation Scope";
  previousStep: "Phase 3C — Advisory Prioritization Policy";
  phaseDecision: "implementation_scope_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  scorePersistenceDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueAssignmentDecision: "not_authorized";
  recommendedNextExactStep: "Phase 3E — Minimal Prioritization Gate";
  nextStageRecommendation: "Phase 3E — Minimal Prioritization Gate";
  implementationScopeLanes: Phase3ImplementationScopeLane[];
  advisoryLaneReferences: typeof phase3AdvisoryPriorityLanes;
  scopeRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  flags: typeof phase3PrioritizationImplementationScopeFlags;
};

export const phase3ImplementationScopeLanes: Phase3ImplementationScopeLane[] = [
  "candidate_advisory_priority_surface",
  "candidate_operator_review_explanation",
  "blocked_mutation_and_routing_paths",
  "phase_3e_gate_requirements",
];

export const phase3PrioritizationImplementationScopeRules = [
  "Phase 3D scopes possible future advisory prioritization only.",
  "No persisted scoring, CRM mutation, automated routing, queues, assignments, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized.",
  "Future implementation may only be considered after Phase 3E reviews minimal package value and safety.",
];

export const phase3PrioritizationImplementationScopeAiBoundary = [
  "explain possible future advisory prioritization scope for human review only",
  "map advisory lanes to candidate review surfaces",
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
  "do not make final lead quality decisions",
  "do not approve implementation",
];

export const phase3PrioritizationImplementationScopeHumanBoundary = [
  "final implementation approval",
  "required or optional prioritization decision",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "CRM approval",
];

export function getPhase3PrioritizationImplementationScope(): Phase3PrioritizationImplementationScope {
  const result: Phase3PrioritizationImplementationScope = {
    phase: "Phase 3: Lead Prioritization Engine",
    phaseStep: "Phase 3D — Prioritization Engine Implementation Scope",
    previousStep: "Phase 3C — Advisory Prioritization Policy",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    scorePersistenceDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueAssignmentDecision: "not_authorized",
    recommendedNextExactStep: "Phase 3E — Minimal Prioritization Gate",
    nextStageRecommendation: "Phase 3E — Minimal Prioritization Gate",
    implementationScopeLanes: phase3ImplementationScopeLanes,
    advisoryLaneReferences: phase3AdvisoryPriorityLanes,
    scopeRules: phase3PrioritizationImplementationScopeRules,
    aiOperatorLeverageBoundary: phase3PrioritizationImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase3PrioritizationImplementationScopeHumanBoundary,
    flags: phase3PrioritizationImplementationScopeFlags,
  };
  assertPhase3PrioritizationImplementationScopeSafe(result);
  return result;
}

export function assertPhase3PrioritizationImplementationScopeSafe(result: Phase3PrioritizationImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.implementationScopeLanes].flat().join(" ");
  const unsafePattern = /persisted scoring is authorized|CRM mutation is authorized|automated routing is authorized|queues? are authorized|assignments? are authorized|outreach is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 4 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 3D — Prioritization Engine Implementation Scope") throw new Error("Phase 3D step must remain pinned.");
  if (result.previousStep !== "Phase 3C — Advisory Prioritization Policy") throw new Error("Phase 3D previous step must remain Phase 3C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 3D must remain implementation-scope-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.scorePersistenceDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.queueAssignmentDecision !== "not_authorized"
  ) throw new Error("Phase 3D decisions must remain not_authorized.");
  if (result.implementationScopeLanes.join("|") !== phase3ImplementationScopeLanes.join("|")) throw new Error("Phase 3D must include all implementation scope lanes.");
  if (result.advisoryLaneReferences.join("|") !== phase3AdvisoryPriorityLanes.join("|")) throw new Error("Phase 3D must preserve Phase 3C advisory lanes.");
  if (unsafeTrue.length > 0) throw new Error("Phase 3D blocked flags cannot turn true.");
  if (!/No persisted scoring/i.test(result.scopeRules.join(" ")) || !/automated routing/i.test(result.scopeRules.join(" "))) throw new Error("Phase 3D scope rules must block persistence and routing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement scoring/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 3D AI boundary is missing.");
  if (!/final implementation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/CRM approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 3D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 3E — Minimal Prioritization Gate") throw new Error("Phase 3D must hand off to Phase 3E.");
  if (unsafePattern.test(text)) throw new Error("Phase 3D wording must not imply unsafe authorization.");
}

export function getPhase3PrioritizationImplementationScopeSummary() {
  const result = getPhase3PrioritizationImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes future advisory prioritization only. No persisted scoring, CRM mutation, automated routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
