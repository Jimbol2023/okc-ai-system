import {
  phase2LeadIntakeFinalLockdownFlags,
  phase2LeadIntakeFinalLockdownRules,
} from "./phase-2-lead-intake-final-lockdown";

export const phase3LeadPrioritizationEngineScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  communicationEnabled: false,
  automationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  scorePersistenceEnabled: false,
  routingEnabled: false,
  queueAssignmentEnabled: false,
  outreachEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase4ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase3Decision = "not_authorized";

export type Phase3LeadPrioritizationEngineScope = {
  phase: "Phase 3: Lead Prioritization Engine";
  phaseStep: "Phase 3A — Lead Prioritization Engine Scope";
  previousStep: "Phase 2F — Lead Intake Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_priority_communication_verification_execution_owner";
  implementationDecision: Phase3Decision;
  providerDecision: Phase3Decision;
  automationDecision: Phase3Decision;
  communicationDecision: Phase3Decision;
  crmMutationDecision: Phase3Decision;
  scorePersistenceDecision: Phase3Decision;
  routingDecision: Phase3Decision;
  queueAssignmentDecision: Phase3Decision;
  recommendedNextExactStep: "Phase 3B — Lead Priority Signal Audit";
  nextStageRecommendation: "Phase 3B — Lead Priority Signal Audit";
  phase2FinalLockdownReference: {
    flags: typeof phase2LeadIntakeFinalLockdownFlags;
    rules: typeof phase2LeadIntakeFinalLockdownRules;
  };
  scopePurpose: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase3LeadPrioritizationEngineScopeFlags;
};

export const phase3ScopePurpose = [
  "Define an elite read-only lead prioritization engine that improves acquisition ROI per operator hour.",
  "Prioritize operator attention without persisting scores, mutating CRM records, routing work, assigning queues, contacting sellers, or executing revenue actions.",
  "Keep AI limited to advisory prioritization explanations while the human owns final priority, seller communication, verification, and execution.",
];

export const phase3ScopeAiBoundary = [
  "summarize prioritization scope for human review",
  "explain why prioritization may help operator focus",
  "identify safe advisory priority concepts",
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
  "do not approve Phase 4 implementation",
  "do not authorize go-live",
];

export const phase3ScopeHumanBoundary = [
  "final priority judgment",
  "seller communication",
  "property fact verification",
  "lead acceptance and rejection",
  "duplicate merge decisions",
  "CRM approval",
  "execution ownership",
  "Phase 4 transition approval",
];

export const phase3ScopeForbiddenDrift = [
  "score persistence",
  "hidden scoring",
  "CRM mutation",
  "automated routing",
  "queues",
  "assignments",
  "seller outreach",
  "provider activation",
  "scraping",
  "skip tracing",
  "autonomous lead creation",
  "Phase 4 implementation",
  "go-live",
];

export function getPhase3LeadPrioritizationEngineScope(): Phase3LeadPrioritizationEngineScope {
  const result: Phase3LeadPrioritizationEngineScope = {
    phase: "Phase 3: Lead Prioritization Engine",
    phaseStep: "Phase 3A — Lead Prioritization Engine Scope",
    previousStep: "Phase 2F — Lead Intake Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_priority_communication_verification_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    scorePersistenceDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueAssignmentDecision: "not_authorized",
    recommendedNextExactStep: "Phase 3B — Lead Priority Signal Audit",
    nextStageRecommendation: "Phase 3B — Lead Priority Signal Audit",
    phase2FinalLockdownReference: {
      flags: phase2LeadIntakeFinalLockdownFlags,
      rules: phase2LeadIntakeFinalLockdownRules,
    },
    scopePurpose: phase3ScopePurpose,
    aiOperatorLeverageBoundary: phase3ScopeAiBoundary,
    humanOwnershipBoundary: phase3ScopeHumanBoundary,
    forbiddenDrift: phase3ScopeForbiddenDrift,
    flags: phase3LeadPrioritizationEngineScopeFlags,
  };
  assertPhase3LeadPrioritizationEngineScopeSafe(result);
  return result;
}

export function assertPhase3LeadPrioritizationEngineScopeSafe(result: Phase3LeadPrioritizationEngineScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const allText = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /score persistence is authorized|CRM mutation is authorized|routing is authorized|queues? are authorized|assignments? are authorized|outreach is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 4 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 3: Lead Prioritization Engine") throw new Error("Phase 3A phase must remain pinned.");
  if (result.phaseStep !== "Phase 3A — Lead Prioritization Engine Scope") throw new Error("Phase 3A step must remain pinned.");
  if (result.previousStep !== "Phase 2F — Lead Intake Final Lockdown") throw new Error("Phase 3A previous step must remain Phase 2F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 3A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 3A must remain scope-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.scorePersistenceDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.queueAssignmentDecision !== "not_authorized"
  ) throw new Error("Phase 3A decisions must remain not_authorized.");
  if (result.recommendedNextExactStep !== "Phase 3B — Lead Priority Signal Audit") throw new Error("Phase 3A must hand off to Phase 3B.");
  if (unsafeTrue.length > 0) throw new Error("Phase 3A blocked flags cannot turn true.");
  if (result.phase2FinalLockdownReference.rules.join("|") !== phase2LeadIntakeFinalLockdownRules.join("|")) throw new Error("Phase 3A must preserve Phase 2F reference.");
  if (!/final priority judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 3A human boundary is missing.");
  if (!/score persistence/i.test(result.forbiddenDrift.join(" ")) || !/automated routing/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 3A forbidden drift is missing.");
  if (unsafePattern.test(allText)) throw new Error("Phase 3A wording must not imply unsafe authorization.");
}

export function getPhase3LeadPrioritizationEngineScopeSummary() {
  const result = getPhase3LeadPrioritizationEngineScope();
  return `${result.phase} / ${result.phaseStep}: elite read-only advisory lead prioritization scope for ${result.primaryMetric}. No score persistence, CRM mutation, routing, queues, assignments, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
