export const manualActivationDryRunEvidenceReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  evidenceReviewOnly: true,
  runbookExecutionAuthorized: false,
  runbookExecutionEnabled: false,
  dryRunExecutionAuthorized: false,
  dryRunExecutionEnabled: false,
  providerActivationAuthorized: false,
  providerActivated: false,
  providerClientCreated: false,
  providerClientsEnabled: false,
  providerEnvRead: false,
  envReadEnabled: false,
  providerSdkImported: false,
  sdkImportEnabled: false,
  twilioActivated: false,
  dnsMutationEnabled: false,
  domainActivated: false,
  domainMutationEnabled: false,
  vercelMutationEnabled: false,
  mailboxCreated: false,
  googleWorkspaceActivated: false,
  spfDkimDmarcPublished: false,
  numberActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  emailSendingEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  routeCreated: false,
  inboundWebhookCreated: false,
  routeOrWebhookCreated: false,
  campaignActivated: false,
  campaignEnabled: false,
  queueSystemEnabled: false,
  reminderSystemEnabled: false,
  pollingEnabled: false,
  runtimeJobsEnabled: false,
  crmMutationEnabled: false,
  auditWritingEnabled: false,
  auditWriteEnabled: false,
  approvalGrantsExecution: false,
  communicationExecutionAuthorized: false,
  communicationExecutionEnabled: false,
  automationEnabled: false,
  autonomousFollowUpEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousNegotiationEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousTextingEnabled: false,
  autonomousCallingEnabled: false,
  rollbackExecutionEnabled: false,
  finalAuthorizationGranted: false,
  goLiveAuthorized: false,
  spendIncreaseAuthorized: false,
  dncBypassAllowed: false,
  optOutBypassAllowed: false,
  stopBypassAllowed: false,
  mapScrapingEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  skipTracingAutomationEnabled: false,
  leadCreationEnabled: false,
  phase2ImplementationEnabled: false,
} as const;

export type ManualActivationDryRunEvidenceReviewStatus =
  | "planning_only"
  | "dry_run_evidence_review_required"
  | "blocked_until_complete_evidence";

export type ManualActivationDryRunDecision = "not_authorized_for_execution";
export type ManualActivationDryRunProviderDecision = "not_authorized";
export type ManualActivationDryRunCommunicationDecision = "not_authorized";
export type ManualActivationDryRunAutomationDecision = "not_authorized";

export type ManualActivationDryRunEvidenceLaneKey =
  | "controlled_runbook_planning_prerequisite"
  | "domain_email_checklist_readiness"
  | "business_number_twilio_readiness"
  | "consent_dnc_opt_out_stop_blocker_evidence"
  | "manual_approval_step_evidence"
  | "rollback_checklist_evidence"
  | "failure_state_handling_evidence"
  | "audit_expectation_evidence"
  | "credential_env_boundary"
  | "no_send_no_call_no_provider_boundary"
  | "evidence_gap_resolution_readiness";

export type ManualActivationDryRunEvidenceLane = {
  lane: ManualActivationDryRunEvidenceLaneKey;
  evidenceFocus: string[];
  governanceRule: string;
  humanOwner: string[];
  aiEvidenceSummaryOnlyRole: string[];
  noExecutionRule: string;
};

export const manualActivationDryRunEvidenceLaneOrder: ManualActivationDryRunEvidenceLaneKey[] = [
  "controlled_runbook_planning_prerequisite",
  "domain_email_checklist_readiness",
  "business_number_twilio_readiness",
  "consent_dnc_opt_out_stop_blocker_evidence",
  "manual_approval_step_evidence",
  "rollback_checklist_evidence",
  "failure_state_handling_evidence",
  "audit_expectation_evidence",
  "credential_env_boundary",
  "no_send_no_call_no_provider_boundary",
  "evidence_gap_resolution_readiness",
];

export type ManualActivationDryRunPhaseEvidenceRecord = {
  phaseName: string;
  evidenceReviewBasis: string[];
  manualEvidenceRequirement: string;
  blockerRule: string;
  humanOwner: string[];
  aiEvidenceSummaryOnlyRole: string[];
  forbiddenDrift: string[];
  noExecutionRule: string;
};

export type ManualActivationDryRunEvidenceReview = {
  phase: "Manual Activation Dry-Run Evidence Review";
  currentPhasePosition: "Phase 1: Business Foundation & Trust Infrastructure";
  manualActivationDryRunEvidenceReviewStatus: ManualActivationDryRunEvidenceReviewStatus;
  dryRunDecision: ManualActivationDryRunDecision;
  providerDecision: ManualActivationDryRunProviderDecision;
  communicationDecision: ManualActivationDryRunCommunicationDecision;
  automationDecision: ManualActivationDryRunAutomationDecision;
  previousRequiredStep: "Controlled Manual Activation Runbook Planning";
  manualActivationDryRunEvidenceLanes: ManualActivationDryRunEvidenceLane[];
  phaseDryRunEvidenceRecords: ManualActivationDryRunPhaseEvidenceRecord[];
  manualActivationDryRunEvidenceDoctrine: string[];
  forbiddenManualActivationDryRunEvidenceDrift: string[];
  recommendedNextExactStep: "Activation Evidence Gap Resolution Planning";
  nextStageRecommendation: "Activation Evidence Gap Resolution Planning";
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof manualActivationDryRunEvidenceReviewFlags;
};

const dryRunEvidenceHumanOwner = [
  "human owns controlled runbook planning evidence",
  "human owns dry-run evidence review",
  "human owns blocker interpretation",
  "human owns provider decisions",
  "human owns communication decisions",
  "human owns activation decisions",
  "human owns go/no-go judgment",
];

const aiEvidenceSummaryOnlyRole = [
  "summarize evidence gaps",
  "organize dry-run evidence",
  "explain blockers",
  "support operator clarity",
  "prepare evidence gap notes",
  "do not execute dry-runs",
  "do not activate providers",
  "do not collect credentials",
  "do not access env vars",
  "do not send communication",
  "do not create leads",
  "do not automate maps",
  "do not approve final authorization",
  "do not implement Phase 2",
];

export const manualActivationDryRunPhaseOrder = [
  "Business Foundation & Trust Infrastructure",
  "Lead Intake & Simple CRM",
  "Lead Prioritization Engine",
  "Seller Review & Call Prep",
  "Follow-Up Organization System",
  "Daily Acquisition Command Center",
  "KPI & Revenue Intelligence",
  "Deal Quality Intelligence",
  "AI-Assisted Lead Discovery",
  "Virtual Driving for Dollars Intelligence Engine",
  "SEO & Local Authority Engine",
  "Conversion Optimization Engine",
  "Safety & Compliance Engine",
  "Facebook & TikTok Acquisition Engine",
  "Design & Creative AI Agent",
  "Buyer Fit Intelligence",
  "Pentest & Security Engine",
] as const;

function createEvidenceLane(
  lane: ManualActivationDryRunEvidenceLaneKey,
  evidenceFocus: string[],
  governanceRule: string,
): ManualActivationDryRunEvidenceLane {
  return {
    lane,
    evidenceFocus,
    governanceRule,
    humanOwner: dryRunEvidenceHumanOwner,
    aiEvidenceSummaryOnlyRole,
    noExecutionRule: `${lane} is evidence review only and cannot execute runbooks, execute dry-runs, activate providers, execute provider actions, send outreach, run automation, mutate CRM data, create leads, automate maps, execute rollback, grant final authorization, implement Phase 2, or authorize go-live.`,
  };
}

export const manualActivationDryRunEvidenceLanes: ManualActivationDryRunEvidenceLane[] = [
  createEvidenceLane(
    "controlled_runbook_planning_prerequisite",
    ["Controlled Manual Activation Runbook Planning evidence", "manual checklist evidence", "runbook blocker evidence", "dry-run review dependency"],
    "Dry-run evidence review requires controlled runbook planning evidence before any evidence gap review can be considered.",
  ),
  createEvidenceLane(
    "domain_email_checklist_readiness",
    ["domain checklist evidence", "sender identity evidence", "SPF/DKIM/DMARC evidence", "reply inbox readiness"],
    "Dry-run review may inspect domain and email checklist evidence but cannot mutate DNS, activate domains, create mailboxes, or send email.",
  ),
  createEvidenceLane(
    "business_number_twilio_readiness",
    ["business number evidence", "caller identity evidence", "Twilio readiness evidence", "10DLC readiness evidence"],
    "Dry-run review may inspect number and Twilio readiness evidence but cannot buy numbers, activate Twilio, import SDKs, read credentials, send SMS, or place calls.",
  ),
  createEvidenceLane(
    "consent_dnc_opt_out_stop_blocker_evidence",
    ["consent evidence", "DNC blocker evidence", "opt-out blocker evidence", "STOP/revocation blocker evidence"],
    "Consent, DNC, opt-out, STOP, and revocation evidence must be complete and cannot be bypassed by dry-run review.",
  ),
  createEvidenceLane(
    "manual_approval_step_evidence",
    ["manual approval checklist", "human reviewer evidence", "approval separation evidence", "missing approval blocker"],
    "Manual approval steps may be reviewed as evidence only and cannot grant execution, provider, send, call, or go-live authority.",
  ),
  createEvidenceLane(
    "rollback_checklist_evidence",
    ["rollback checklist evidence", "revocation path evidence", "provider disable plan evidence", "manual stop procedure evidence"],
    "Rollback evidence may be reviewed only; no rollback execution, provider disable call, webhook mutation, or runtime job is authorized.",
  ),
  createEvidenceLane(
    "failure_state_handling_evidence",
    ["failed preflight handling", "provider failure expectation", "blocked communication state", "manual incident review evidence"],
    "Failure-state evidence may be reviewed only and cannot trigger alerts, retries, queues, jobs, or outbound communication.",
  ),
  createEvidenceLane(
    "audit_expectation_evidence",
    ["audit field evidence", "reviewer identity evidence", "decision reason evidence", "timestamp evidence"],
    "Audit expectations may be reviewed, but this phase cannot write audit records or mutate CRM data.",
  ),
  createEvidenceLane(
    "credential_env_boundary",
    ["no credential use", "no env reads", "no SDK imports", "no provider clients"],
    "Dry-run evidence review cannot touch credentials, read env vars, import provider SDKs, or create provider clients.",
  ),
  createEvidenceLane(
    "no_send_no_call_no_provider_boundary",
    ["no provider activation", "no outbound SMS", "no outbound email", "no calling"],
    "Dry-run evidence review cannot activate providers, execute provider actions, send messages, place calls, start campaigns, or create runtime infrastructure.",
  ),
  createEvidenceLane(
    "evidence_gap_resolution_readiness",
    ["evidence gap list", "missing checklist items", "blocked readiness reasons", "gap resolution planning next"],
    "Missing evidence must route to gap resolution planning next, not activation, dry-run execution, lead creation, or communication execution.",
  ),
];

function createPhaseDryRunEvidenceRecord(
  phaseName: (typeof manualActivationDryRunPhaseOrder)[number],
  evidenceReviewBasis: string[],
  forbiddenDrift: string[],
): ManualActivationDryRunPhaseEvidenceRecord {
  return {
    phaseName,
    evidenceReviewBasis,
    manualEvidenceRequirement: `${phaseName} requires manual evidence from Controlled Manual Activation Runbook Planning before any dry-run evidence review can be considered.`,
    blockerRule: `${phaseName} blockers must remain explicit and non-bypassable; missing evidence routes back to Activation Evidence Gap Resolution Planning.`,
    humanOwner: dryRunEvidenceHumanOwner,
    aiEvidenceSummaryOnlyRole,
    forbiddenDrift,
    noExecutionRule: `${phaseName} dry-run evidence review authorizes no runbook execution, no dry-run execution, no activation, no provider execution, no outreach, no automation, no CRM mutation, no lead creation, no map automation, no rollback execution, no final authorization, no Phase 2 implementation, and no go-live.`,
  };
}

export const phaseDryRunEvidenceRecords: ManualActivationDryRunPhaseEvidenceRecord[] = [
  createPhaseDryRunEvidenceRecord(
    "Business Foundation & Trust Infrastructure",
    ["controlled runbook planning evidence", "identity evidence checklist", "domain/email checklist", "Twilio/A2P readiness checklist", "DNC/STOP governance checklist"],
    ["provider activation", "DNS mutation", "Vercel mutation", "Google Workspace activation", "Twilio activation", "outbound communication", "go-live"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Lead Intake & Simple CRM",
    ["controlled runbook planning evidence", "source tracking checklist", "manual intake checklist", "stage taxonomy checklist", "CRM non-mutation checklist"],
    ["CRM mutation", "automated lead creation", "property fact invention", "autonomous outreach"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Lead Prioritization Engine",
    ["controlled runbook planning evidence", "priority criteria checklist", "queue definition checklist", "blocked lead checklist", "operator override checklist"],
    ["hidden scoring", "autonomous routing", "auto-send behavior", "unreviewed conversion claims"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Seller Review & Call Prep",
    ["controlled runbook planning evidence", "seller context checklist", "property summary checklist", "call prep checklist", "risk visibility checklist"],
    ["autonomous negotiation", "seller-facing AI persuasion", "offer approval automation", "property fact invention"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Follow-Up Organization System",
    ["controlled runbook planning evidence", "follow-up date checklist", "callback checklist", "opt-out checklist", "manual send boundary checklist"],
    ["autonomous follow-up", "autonomous texting", "autonomous email", "DNC/STOP bypass"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Daily Acquisition Command Center",
    ["controlled runbook planning evidence", "daily queue checklist", "operator rhythm checklist", "warning criteria checklist", "manual action boundary checklist"],
    ["runtime jobs", "CRM mutation", "auto-send behavior", "autonomous work execution"],
  ),
  createPhaseDryRunEvidenceRecord(
    "KPI & Revenue Intelligence",
    ["controlled runbook planning evidence", "KPI definition checklist", "source quality checklist", "dead lead cause checklist", "revenue claim boundary checklist"],
    ["unreviewed revenue claims", "autonomous expansion", "spend automation", "provider activation"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Deal Quality Intelligence",
    ["controlled runbook planning evidence", "title risk checklist", "repair uncertainty checklist", "occupancy checklist", "seller realism checklist"],
    ["automatic deal rejection", "investment advice claims", "property fact invention", "autonomous offer execution"],
  ),
  createPhaseDryRunEvidenceRecord(
    "AI-Assisted Lead Discovery",
    ["controlled runbook planning evidence", "source provenance checklist", "legal source checklist", "manual review boundary checklist", "no scraping and no skip tracing checklist"],
    ["autonomous scraping", "autonomous skip tracing", "autonomous seller outreach", "autonomous campaigns"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Virtual Driving for Dollars Intelligence Engine",
    ["controlled runbook planning evidence", "approved target neighborhoods", "manual review process", "distress signal checklist", "lead approval criteria", "buyer-demand criteria", "DNC/STOP governance", "public/private separation", "no-autonomous-scraping confirmation"],
    ["map scraping", "Google Street View automation", "GPS surveillance", "skip tracing automation", "owner contact automation", "autonomous outreach", "campaign activation", "lead creation without human approval"],
  ),
  createPhaseDryRunEvidenceRecord(
    "SEO & Local Authority Engine",
    ["controlled runbook planning evidence", "keyword plan checklist", "local claim review checklist", "manual publishing checklist", "trust copy checklist"],
    ["auto-publishing", "invented local claims", "provider activation", "spam content generation"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Conversion Optimization Engine",
    ["controlled runbook planning evidence", "form review checklist", "CTA review checklist", "mobile usability checklist", "seller trust copy checklist"],
    ["dark patterns", "unapproved publishing", "misleading urgency", "provider mutation"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Safety & Compliance Engine",
    ["controlled runbook planning evidence", "DNC policy checklist", "STOP policy checklist", "opt-out visibility checklist", "consent visibility checklist"],
    ["DNC bypass", "STOP bypass", "autonomous compliance decisions", "go-live authorization"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Facebook & TikTok Acquisition Engine",
    ["controlled runbook planning evidence", "ad claim checklist", "seller education checklist", "manual publishing checklist", "spend approval boundary checklist"],
    ["autonomous campaigns", "unapproved ad claims", "provider activation", "spend automation"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Design & Creative AI Agent",
    ["controlled runbook planning evidence", "brand standard checklist", "mobile-first checklist", "claim review checklist", "manual publish boundary checklist"],
    ["brand sprawl", "unapproved claims", "auto-publishing", "creative complexity"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Buyer Fit Intelligence",
    ["controlled runbook planning evidence", "buyer category checklist", "fit criteria checklist", "manual deal sharing checklist", "no blast checklist"],
    ["autonomous deal blasting", "autonomous buyer handling", "unapproved buyer communication", "hidden buyer scoring"],
  ),
  createPhaseDryRunEvidenceRecord(
    "Pentest & Security Engine",
    ["controlled runbook planning evidence", "auth review checklist", "API exposure checklist", "route protection checklist", "env safety checklist"],
    ["unsafe scanning", "credential exposure", "provider mutation", "unapproved deployment changes"],
  ),
];

export const manualActivationDryRunEvidenceDoctrine = [
  "Current roadmap position remains Phase 1: Business Foundation & Trust Infrastructure, inside the readiness chain before Phase 2.",
  "Manual Activation Dry-Run Evidence Review is evidence-only.",
  "Manual Activation Dry-Run Evidence Review requires Controlled Manual Activation Runbook Planning evidence before Activation Evidence Gap Resolution Planning can be considered.",
  "Manual Activation Dry-Run Evidence Review covers all 17 phases of the elite high-aROI acquisition OS.",
  "Dry-run decision remains not_authorized_for_execution.",
  "Provider decision remains not_authorized.",
  "Communication decision remains not_authorized.",
  "Automation decision remains not_authorized.",
  "Dry-run evidence may review controlled runbook planning evidence, domain/email readiness, business number/Twilio readiness, consent/DNC/STOP blockers, manual approval steps, rollback checklist, failure handling, audit expectations, credential boundaries, no-send/no-call/no-provider boundaries, and evidence gap resolution readiness only.",
  "AI remains operator leverage only and may summarize evidence gaps, organize dry-run evidence, explain blockers, support operator clarity, and prepare evidence gap notes.",
  "AI cannot execute dry-runs, approve final authorization, activate providers, contact sellers, create leads, automate maps, run campaigns, perform outreach, bypass blockers, or implement Phase 2.",
  "Virtual Driving for Dollars remains review-only, evidence-first, human-approved, and operator-leverage-only with no map automation.",
  "No runbook execution, dry-run execution, provider activation, provider execution, DNS/domain mutation, Vercel mutation, mailbox creation, Google Workspace activation, Twilio activation, number activation, env read, SDK import, provider client, route, webhook, SMS, email, calling, AI voice, CRM mutation, campaign, queue, reminder, polling, runtime job, audit write, rollback execution, final authorization, lead creation, map scraping, Google Street View automation, GPS surveillance, skip tracing automation, Phase 2 implementation, go-live behavior, or spend increase is authorized.",
  "DNC, opt-out, STOP, revocation, missing approval, missing identity evidence, missing controlled runbook evidence, and missing consent evidence remain non-bypassable blockers.",
  "This is not autonomous wholesaling.",
  "Highest acquisition ROI per operator hour remains controlled: review evidence gaps before considering any activation path.",
];

export const forbiddenManualActivationDryRunEvidenceDrift = [
  "runbook execution authorization",
  "runbook execution",
  "dry-run execution authorization",
  "dry-run execution",
  "provider activation authorization",
  "provider activation",
  "provider execution",
  "provider client creation",
  "provider env reads",
  "provider SDK imports",
  "Twilio activation",
  "DNS mutation",
  "domain activation",
  "Vercel mutation",
  "mailbox creation",
  "Google Workspace activation",
  "SPF/DKIM/DMARC publishing",
  "number activation",
  "outbound SMS",
  "outbound email",
  "email sending",
  "calling",
  "AI voice",
  "route creation",
  "inbound webhook creation",
  "campaign activation",
  "queues",
  "reminders",
  "polling",
  "runtime jobs",
  "CRM mutation",
  "audit writing",
  "approval-as-execution",
  "communication execution",
  "automation",
  "autonomous follow-up",
  "autonomous seller handling",
  "autonomous negotiation",
  "autonomous outreach",
  "autonomous texting",
  "autonomous calling",
  "rollback execution",
  "final authorization",
  "go-live authorization",
  "spend increase",
  "DNC bypass",
  "opt-out bypass",
  "STOP bypass",
  "map scraping",
  "Google Street View automation",
  "GPS surveillance",
  "skip tracing automation",
  "lead creation",
  "Phase 2 implementation",
];

export function getManualActivationDryRunEvidenceReview(): ManualActivationDryRunEvidenceReview {
  const result: ManualActivationDryRunEvidenceReview = {
    phase: "Manual Activation Dry-Run Evidence Review",
    currentPhasePosition: "Phase 1: Business Foundation & Trust Infrastructure",
    manualActivationDryRunEvidenceReviewStatus: "planning_only",
    dryRunDecision: "not_authorized_for_execution",
    providerDecision: "not_authorized",
    communicationDecision: "not_authorized",
    automationDecision: "not_authorized",
    previousRequiredStep: "Controlled Manual Activation Runbook Planning",
    manualActivationDryRunEvidenceLanes,
    phaseDryRunEvidenceRecords,
    manualActivationDryRunEvidenceDoctrine,
    forbiddenManualActivationDryRunEvidenceDrift,
    recommendedNextExactStep: "Activation Evidence Gap Resolution Planning",
    nextStageRecommendation: "Activation Evidence Gap Resolution Planning",
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: manualActivationDryRunEvidenceReviewFlags,
  };

  assertManualActivationDryRunEvidenceReviewSafe(result);

  return result;
}

export function assertManualActivationDryRunEvidenceReviewSafe(result: ManualActivationDryRunEvidenceReview) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly", "evidenceReviewOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);
  const doctrineText = result.manualActivationDryRunEvidenceDoctrine.join(" ");
  const unsafeImplicationPattern =
    /activation is authorized|outreach is authorized|automation is authorized|runbook execution is authorized|dry-run execution is authorized|rollback execution is authorized|lead creation is authorized|map automation is authorized|final authorization is granted|Phase 2 implementation is authorized|go-live is authorized|required 16-phase order|all 16 phases|16 phase/i;

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("Manual Activation Dry-Run Evidence Review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualActivationDryRunEvidenceReviewStatus !== "planning_only") {
    throw new Error("Manual Activation Dry-Run Evidence Review cannot become dry-run-ready, execution-ready, activation-ready, provider-ready, send-ready, call-ready, rollback-ready, final-authorization-ready, Phase 2-ready, or go-live-ready.");
  }

  if (result.currentPhasePosition !== "Phase 1: Business Foundation & Trust Infrastructure") {
    throw new Error("Manual Activation Dry-Run Evidence Review must remain positioned in Phase 1: Business Foundation & Trust Infrastructure.");
  }

  if (result.dryRunDecision !== "not_authorized_for_execution") {
    throw new Error("Manual Activation Dry-Run decision must remain not_authorized_for_execution.");
  }

  if (result.providerDecision !== "not_authorized") {
    throw new Error("Manual Activation Dry-Run provider decision must remain not_authorized.");
  }

  if (result.communicationDecision !== "not_authorized") {
    throw new Error("Manual Activation Dry-Run communication decision must remain not_authorized.");
  }

  if (result.automationDecision !== "not_authorized") {
    throw new Error("Manual Activation Dry-Run automation decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Manual Activation Dry-Run Evidence Review cannot authorize runbook execution, dry-run execution, provider activation, DNS/domain activation, env reads, SDK imports, routes/webhooks, SMS, email, calling, AI voice, campaigns, queues, reminders, runtime jobs, CRM mutation, audit writing, rollback execution, autonomous seller handling, spend increases, blocker bypass, communication execution, lead creation, map automation, skip tracing, final authorization, Phase 2 implementation, or go-live.");
  }

  if (result.previousRequiredStep !== "Controlled Manual Activation Runbook Planning") {
    throw new Error("Manual Activation Dry-Run Evidence Review must require Controlled Manual Activation Runbook Planning first.");
  }

  if (
    result.manualActivationDryRunEvidenceLanes.length !== manualActivationDryRunEvidenceLaneOrder.length ||
    result.manualActivationDryRunEvidenceLanes.map((lane) => lane.lane).join("|") !== manualActivationDryRunEvidenceLaneOrder.join("|")
  ) {
    throw new Error("Manual Activation Dry-Run Evidence Review must preserve every required dry-run evidence lane in order.");
  }

  if (/required 16-phase order|all 16 phases|16 phase/i.test(doctrineText)) {
    throw new Error("Manual Activation Dry-Run Evidence Review wording must use 17-phase language and cannot contain stale 16-phase wording.");
  }

  if (result.phaseDryRunEvidenceRecords.length !== 17) {
    throw new Error("Manual Activation Dry-Run Evidence Review must include all 17 phase evidence records.");
  }

  if (result.phaseDryRunEvidenceRecords.map((phase) => phase.phaseName).join("|") !== manualActivationDryRunPhaseOrder.join("|")) {
    throw new Error("Manual Activation Dry-Run Evidence Review phase records must remain in the required 17-phase order.");
  }

  if (
    result.phaseDryRunEvidenceRecords.some(
      (phase) =>
        phase.evidenceReviewBasis.length === 0 ||
        !phase.manualEvidenceRequirement ||
        !phase.blockerRule ||
        phase.humanOwner.length === 0 ||
        phase.aiEvidenceSummaryOnlyRole.length === 0 ||
        phase.forbiddenDrift.length === 0 ||
        !phase.noExecutionRule,
    )
  ) {
    throw new Error("Every phase dry-run evidence record must include evidence basis, manual evidence requirement, blocker rule, human owner, AI evidence-summary-only role, forbidden drift, and no-execution rule.");
  }

  if (
    result.manualActivationDryRunEvidenceLanes.some(
      (lane) =>
        lane.evidenceFocus.length === 0 ||
        !lane.governanceRule ||
        lane.humanOwner.length === 0 ||
        lane.aiEvidenceSummaryOnlyRole.length === 0 ||
        !lane.noExecutionRule,
    )
  ) {
    throw new Error("Every manual activation dry-run evidence lane must preserve evidence-only review, human ownership, AI gap-summary-only role, and no execution authorization.");
  }

  if (
    !/No runbook execution, dry-run execution/i.test(doctrineText) ||
    !/provider execution/i.test(doctrineText) ||
    !/SMS, email, calling/i.test(doctrineText) ||
    !/lead creation/i.test(doctrineText) ||
    !/map scraping/i.test(doctrineText) ||
    !/Google Street View automation/i.test(doctrineText) ||
    !/GPS surveillance/i.test(doctrineText) ||
    !/not autonomous wholesaling/i.test(doctrineText) ||
    !/Phase 2 implementation/i.test(doctrineText) ||
    !/go-live behavior/i.test(doctrineText) ||
    unsafeImplicationPattern.test(doctrineText)
  ) {
    throw new Error("Manual Activation Dry-Run Evidence Review wording must forbid runbook execution, dry-run execution, activation, outreach, automation, autonomous wholesaling, rollback execution, lead creation, map automation, final authorization, Phase 2 implementation, and go-live.");
  }

  if (result.recommendedNextExactStep !== "Activation Evidence Gap Resolution Planning") {
    throw new Error("Manual Activation Dry-Run Evidence Review must recommend Activation Evidence Gap Resolution Planning next.");
  }

  if (result.nextStageRecommendation !== "Activation Evidence Gap Resolution Planning") {
    throw new Error("Manual Activation Dry-Run Evidence Review must include the next stage recommendation.");
  }
}

export function summarizeManualActivationDryRunEvidenceReview(result: ManualActivationDryRunEvidenceReview) {
  assertManualActivationDryRunEvidenceReviewSafe(result);

  return `${result.phase}: ${result.manualActivationDryRunEvidenceReviewStatus}. Current phase position is ${result.currentPhasePosition}, inside the readiness chain before Phase 2. Previous required step is ${result.previousRequiredStep}. Dry-run decision is ${result.dryRunDecision}; provider decision is ${result.providerDecision}; communication decision is ${result.communicationDecision}; automation decision is ${result.automationDecision}. The human-owned dry-run evidence review protects highest acquisition ROI per operator hour across all 17 phases through operator leverage only, controlled runbook planning evidence, manual evidence requirements, blocker clarity, no-drift Virtual Driving for Dollars boundaries, and evidence gap resolution readiness. No runbook execution, dry-run execution, activation, provider activation, provider execution, DNS/domain activation, Vercel mutation, mailbox creation, Google Workspace activation, Twilio activation, number activation, env read, SDK import, route, webhook, outbound communication, SMS, email, calling, AI voice, campaign, queue, reminder, polling, runtime job, CRM mutation, audit writing, rollback execution, final authorization, autonomous seller handling, lead creation, map scraping, Google Street View automation, GPS surveillance, skip tracing automation, approval-as-execution, blocker bypass, communication execution, automation, Phase 2 implementation, go-live, or spend increase is authorized. This is not autonomous wholesaling. Next stage: ${result.nextStageRecommendation}.`;
}
