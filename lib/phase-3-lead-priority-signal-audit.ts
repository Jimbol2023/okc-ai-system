import { phase3ScopeForbiddenDrift } from "./phase-3-lead-prioritization-engine-scope";

export const phase3LeadPrioritySignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
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

export type Phase3PrioritySignalFamily =
  | "score"
  | "priority"
  | "status"
  | "source"
  | "payload"
  | "notes"
  | "follow_up_fields"
  | "reply_fields"
  | "dnc_fields"
  | "approval_fields"
  | "distress_flags"
  | "seller_call_signals"
  | "duplicate_contact_safety_indicators";

export type Phase3LeadPrioritySignalAudit = {
  phase: "Phase 3: Lead Prioritization Engine";
  phaseStep: "Phase 3B — Lead Priority Signal Audit";
  previousStep: "Phase 3A — Lead Prioritization Engine Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  scorePersistenceDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueAssignmentDecision: "not_authorized";
  recommendedNextExactStep: "Phase 3C — Advisory Prioritization Policy";
  nextStageRecommendation: "Phase 3C — Advisory Prioritization Policy";
  signalFamilies: Phase3PrioritySignalFamily[];
  auditPurpose: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase3LeadPrioritySignalAuditFlags;
};

export const phase3PrioritySignalFamilies: Phase3PrioritySignalFamily[] = [
  "score",
  "priority",
  "status",
  "source",
  "payload",
  "notes",
  "follow_up_fields",
  "reply_fields",
  "dnc_fields",
  "approval_fields",
  "distress_flags",
  "seller_call_signals",
  "duplicate_contact_safety_indicators",
];

export const phase3PrioritySignalAuditPurpose = [
  "Audit existing repo-grounded lead priority inputs before defining advisory lanes.",
  "Separate useful human-review signals from unsafe hidden scoring, score persistence, routing, queues, or CRM mutation.",
  "Protect acquisition ROI per operator hour by showing which signals can guide human review without executing work.",
];

export const phase3PrioritySignalAuditAiBoundary = [
  "summarize existing priority signals for human review only",
  "identify missing or unclear signal visibility",
  "explain why a signal may matter for operator focus",
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

export const phase3PrioritySignalAuditHumanBoundary = [
  "final signal importance judgment",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "lead priority interpretation",
  "future implementation approval",
];

export function getPhase3LeadPrioritySignalAudit(): Phase3LeadPrioritySignalAudit {
  const result: Phase3LeadPrioritySignalAudit = {
    phase: "Phase 3: Lead Prioritization Engine",
    phaseStep: "Phase 3B — Lead Priority Signal Audit",
    previousStep: "Phase 3A — Lead Prioritization Engine Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    scorePersistenceDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueAssignmentDecision: "not_authorized",
    recommendedNextExactStep: "Phase 3C — Advisory Prioritization Policy",
    nextStageRecommendation: "Phase 3C — Advisory Prioritization Policy",
    signalFamilies: phase3PrioritySignalFamilies,
    auditPurpose: phase3PrioritySignalAuditPurpose,
    aiOperatorLeverageBoundary: phase3PrioritySignalAuditAiBoundary,
    humanOwnershipBoundary: phase3PrioritySignalAuditHumanBoundary,
    forbiddenDrift: phase3ScopeForbiddenDrift,
    flags: phase3LeadPrioritySignalAuditFlags,
  };
  assertPhase3LeadPrioritySignalAuditSafe(result);
  return result;
}

export function assertPhase3LeadPrioritySignalAuditSafe(result: Phase3LeadPrioritySignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const unsafePattern = /score persistence is authorized|CRM mutation is authorized|routing is authorized|queue assignment is authorized|outreach is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 4 implementation is authorized|go-live is authorized/i;
  const allText = [result.auditPurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");

  if (result.phaseStep !== "Phase 3B — Lead Priority Signal Audit") throw new Error("Phase 3B step must remain pinned.");
  if (result.previousStep !== "Phase 3A — Lead Prioritization Engine Scope") throw new Error("Phase 3B previous step must remain Phase 3A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 3B must remain signal-audit-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.scorePersistenceDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.queueAssignmentDecision !== "not_authorized"
  ) throw new Error("Phase 3B decisions must remain not_authorized.");
  if (result.recommendedNextExactStep !== "Phase 3C — Advisory Prioritization Policy") throw new Error("Phase 3B must hand off to Phase 3C.");
  if (result.signalFamilies.join("|") !== phase3PrioritySignalFamilies.join("|")) throw new Error("Phase 3B must include all priority signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 3B blocked flags cannot turn true.");
  if (!/score/i.test(result.signalFamilies.join(" ")) || !/dnc_fields/i.test(result.signalFamilies.join(" ")) || !/seller_call_signals/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 3B repo-grounded signals are missing.");
  if (!/hidden scoring/i.test(result.auditPurpose.join(" ")) || !/CRM mutation/i.test(result.auditPurpose.join(" "))) throw new Error("Phase 3B audit purpose must block unsafe signal drift.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 3B AI boundary is missing.");
  if (!/final signal importance judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/future implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 3B human boundary is missing.");
  if (unsafePattern.test(allText)) throw new Error("Phase 3B wording must not imply unsafe authorization.");
}

export function getPhase3LeadPrioritySignalAuditSummary() {
  const result = getPhase3LeadPrioritySignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits score, priority, status, source, payload, notes, follow-up, reply, DNC, approval, distress, seller-call, and duplicate/contact-safety signals. No score persistence, CRM mutation, routing, queues, assignments, outreach, providers, scraping, skip tracing, autonomous lead creation, Phase 4 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
