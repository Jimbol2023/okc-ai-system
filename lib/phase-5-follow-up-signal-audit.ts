import { phase5FollowUpForbiddenDrift } from "./phase-5-follow-up-organization-scope";

export const phase5FollowUpSignalAuditFlags = {
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
  followUpCreationEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  scheduleWritingEnabled: false,
  messageDraftPersistenceEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase6ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase5FollowUpSignalFamily =
  | "lead_follow_up_fields"
  | "lead_review_fields"
  | "contact_safety_fields"
  | "seller_context_fields"
  | "manual_follow_up_workspace_concepts"
  | "z3_follow_up_readiness_concepts"
  | "z3_follow_up_staleness_risk_concepts"
  | "z3_manual_follow_up_priority_concepts"
  | "z3_follow_up_velocity_policy_concepts";

export const phase5FollowUpSignalFamilies: Phase5FollowUpSignalFamily[] = [
  "lead_follow_up_fields",
  "lead_review_fields",
  "contact_safety_fields",
  "seller_context_fields",
  "manual_follow_up_workspace_concepts",
  "z3_follow_up_readiness_concepts",
  "z3_follow_up_staleness_risk_concepts",
  "z3_manual_follow_up_priority_concepts",
  "z3_follow_up_velocity_policy_concepts",
];

export type Phase5FollowUpSignalAudit = {
  phase: "Phase 5: Follow-Up Organization System";
  phaseStep: "Phase 5B — Follow-Up Signal Audit";
  previousStep: "Phase 5A — Follow-Up Organization System Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  followUpCreationDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  reminderDecision: "not_authorized";
  calendarDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 5C — Manual Follow-Up Organization Policy";
  nextStageRecommendation: "Phase 5C — Manual Follow-Up Organization Policy";
  signalFamilies: Phase5FollowUpSignalFamily[];
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase5FollowUpSignalAuditFlags;
};

export const phase5FollowUpSignalAuditPurpose = [
  "Audit existing follow-up organization signals without changing leads, CRM records, schedules, queues, reminders, or message drafts.",
  "Surface stale, overdue, due-soon, suppressed, terminal, cleanup, nurture, and manual cadence visibility.",
  "Support highest acquisition ROI per operator hour by reducing time spent finding manual follow-up priorities.",
];

export const phase5FollowUpSignalAuditStopRules = [
  "Phase 5B audits existing follow-up signal families only.",
  "No message sending, calling, CRM mutation, follow-up creation, task creation, queue creation, reminder creation, calendar creation, schedule writing, message draft persistence, automation, providers, scraping, skip tracing, Phase 6 implementation, or go-live is authorized.",
];

export const phase5FollowUpSignalAuditAiBoundary = [
  "summarize existing follow-up signals for human review only",
  "flag stale overdue due-soon suppressed terminal cleanup and nurture visibility",
  "do not invent property facts",
  "do not send messages or call sellers",
  "do not mutate CRM records",
  "do not create follow-ups tasks queues reminders or calendar items",
  "do not write schedules or persist message drafts",
  "do not trigger automation",
  "do not activate providers",
  "do not scrape or skip trace",
];

export const phase5FollowUpSignalAuditHumanBoundary = [
  "follow-up priority judgment",
  "follow-up timing",
  "seller communication",
  "task ownership",
  "CRM approval",
  "future implementation approval",
];

export function getPhase5FollowUpSignalAudit(): Phase5FollowUpSignalAudit {
  const result: Phase5FollowUpSignalAudit = {
    phase: "Phase 5: Follow-Up Organization System",
    phaseStep: "Phase 5B — Follow-Up Signal Audit",
    previousStep: "Phase 5A — Follow-Up Organization System Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    followUpCreationDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 5C — Manual Follow-Up Organization Policy",
    nextStageRecommendation: "Phase 5C — Manual Follow-Up Organization Policy",
    signalFamilies: phase5FollowUpSignalFamilies,
    auditPurpose: phase5FollowUpSignalAuditPurpose,
    stopRules: phase5FollowUpSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase5FollowUpSignalAuditAiBoundary,
    humanOwnershipBoundary: phase5FollowUpSignalAuditHumanBoundary,
    forbiddenDrift: phase5FollowUpForbiddenDrift,
    flags: phase5FollowUpSignalAuditFlags,
  };
  assertPhase5FollowUpSignalAuditSafe(result);
  return result;
}

export function assertPhase5FollowUpSignalAuditSafe(result: Phase5FollowUpSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /message sending is authorized|calling is authorized|CRM mutation is authorized|follow-up creation is authorized|task creation is authorized|queue creation is authorized|reminder creation is authorized|calendar creation is authorized|schedule writing is authorized|message draft persistence is authorized|automation is authorized|providers? are authorized|scraping is authorized|skip tracing is authorized|Phase 6 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 5B — Follow-Up Signal Audit") throw new Error("Phase 5B step must remain pinned.");
  if (result.previousStep !== "Phase 5A — Follow-Up Organization System Scope") throw new Error("Phase 5B previous step must remain Phase 5A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 5B must remain signal-audit-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.followUpCreationDecision !== "not_authorized" ||
    result.taskDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized" ||
    result.reminderDecision !== "not_authorized" ||
    result.calendarDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized"
  ) throw new Error("Phase 5B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase5FollowUpSignalFamilies.join("|")) throw new Error("Phase 5B must include all follow-up signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 5B blocked flags cannot turn true.");
  if (!/manual_follow_up_workspace_concepts/i.test(result.signalFamilies.join(" ")) || !/z3_follow_up_readiness_concepts/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 5B repo-grounded signals are missing.");
  if (!/audits existing follow-up signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 5B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create follow-ups/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 5B AI boundary is missing.");
  if (!/follow-up timing/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 5B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 5C — Manual Follow-Up Organization Policy") throw new Error("Phase 5B must hand off to Phase 5C.");
  if (unsafePattern.test(text)) throw new Error("Phase 5B wording must not imply unsafe authorization.");
}

export function getPhase5FollowUpSignalAuditSummary() {
  const result = getPhase5FollowUpSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing lead follow-up, review, contact-safety, seller-context, manual-follow-up workspace, Z3 readiness, staleness, priority, and cadence signals for highest acquisition ROI per operator hour. Human-owned follow-up judgment remains required. No outreach, no calling, no message sending, no CRM mutation, no queue, reminder, or calendar creation, no scraping, no autonomous lead creation, no Phase 6 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
