export const operationalReadinessCheckFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  campaignsEnabled: false,
  queueSystemEnabled: false,
  reminderSystemEnabled: false,
  pollingEnabled: false,
  runtimeJobsEnabled: false,
  persistenceActivated: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  crmAutomationEnabled: false,
  autonomousNegotiationEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousFollowUpEnabled: false,
  scrapingEnabled: false,
  publicRecordConnectorsEnabled: false,
  routePlanningEnabled: false,
  territoryScoringEnabled: false,
  approvalGrantsExecution: false,
  readinessGrantsExecution: false,
  readinessGrantsApprovalExecution: false,
  readinessActivatesProviders: false,
  readinessTriggersOutreach: false,
  readinessTriggersContact: false,
  readinessRoutesWork: false,
  readinessCreatesAssignments: false,
  readinessCreatesQueues: false,
  readinessCreatesReminders: false,
  readinessMovesCrmStages: false,
  readinessTriggersRuntimeWork: false,
  missingContactTreatedAsOutreachReady: false,
  propertyFirstTreatedAsOutreachReady: false,
  dncTreatedAsOutreachReady: false,
  optOutTreatedAsOutreachReady: false,
  a14AllowedBeforeOperationalReadiness: false,
  acquisitionExecutionAuthorized: false,
  skipTracingEnabled: false,
} as const;

export type OperationalReadinessStatus =
  | "planning_only"
  | "needs_operator_review"
  | "blocked_until_manual_readiness";

export type OperationalReadinessLaneKey =
  | "imported_property_first_lead_review"
  | "missing_contact_manual_work"
  | "seller_context_visibility"
  | "operator_call_clarity"
  | "blocker_visibility"
  | "communication_readiness_clarity"
  | "acquisition_usability"
  | "return_to_acquisition_readiness";

export type OperationalReadinessLane = {
  lane: OperationalReadinessLaneKey;
  items: string[];
  governanceRule: string;
};

export type OperationalReadinessFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type OperationalReadinessFinding = {
  question: string;
  category: OperationalReadinessFindingCategory;
  finding: string;
};

export type FutureAcquisitionReturnGate = {
  nextExactPhase: "A1.4 Source Quality Intelligence";
  purpose: string;
  allowedFutureMetrics: string[];
  blockedUntil: string;
};

export type OperationalReadinessCheck = {
  phase: "Operational Readiness Check";
  operationalReadinessStatus: OperationalReadinessStatus;
  readinessLanes: OperationalReadinessLane[];
  operatorQuestions: string[];
  readinessBlockers: string[];
  futureAcquisitionReturnGate: FutureAcquisitionReturnGate;
  findings: OperationalReadinessFinding[];
  recommendedNextExactStep: "A1.4 Source Quality Intelligence";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof operationalReadinessCheckFlags;
};

export const operationalReadinessLanes: OperationalReadinessLane[] = [
  {
    lane: "imported_property_first_lead_review",
    items: [
      "imported lead readiness",
      "property-first cleanup visibility",
      "manual import review continuity",
      "source-labeled record review",
    ],
    governanceRule: "Imported and property-first leads may be reviewed manually but cannot trigger outreach, provider activation, or automation.",
  },
  {
    lane: "missing_contact_manual_work",
    items: [
      "missing phone/email visibility",
      "manual contact cleanup need",
      "no skip tracing authorization",
      "no automated contact enrichment",
    ],
    governanceRule: "Missing-contact leads may be worked manually but cannot be treated as outreach-ready or trigger skip tracing.",
  },
  {
    lane: "seller_context_visibility",
    items: [
      "seller notes visibility",
      "seller replies visibility",
      "timeline visibility",
      "AI VA summary review visibility",
      "explainable seller context",
    ],
    governanceRule: "Seller context must be explainable and operator-visible before any future communication readiness decision.",
  },
  {
    lane: "operator_call_clarity",
    items: [
      "who to call",
      "why the lead matters",
      "what is missing",
      "what is blocked",
      "what needs review",
    ],
    governanceRule: "Call clarity helps manual review only and does not authorize calling, messaging, routing, or assignment.",
  },
  {
    lane: "blocker_visibility",
    items: [
      "DNC blocker visibility",
      "opt-out blocker visibility",
      "property-first blocker visibility",
      "missing-contact blocker visibility",
      "governance blocker visibility",
    ],
    governanceRule: "Safety blockers must remain visible and non-bypassable in readiness planning.",
  },
  {
    lane: "communication_readiness_clarity",
    items: [
      "communication readiness status",
      "human approval review input",
      "AI VA recommendation as review input",
      "provider-blocked status",
      "execution-blocked status",
    ],
    governanceRule: "Communication readiness clarity is advisory only and cannot become communication execution.",
  },
  {
    lane: "acquisition_usability",
    items: [
      "manual review usability",
      "operator friction visibility",
      "source attribution visibility",
      "cleanup burden visibility",
      "review-ready signal clarity",
    ],
    governanceRule: "Acquisition usability may guide the next planning phase but cannot activate source scoring, routing, or automation.",
  },
  {
    lane: "return_to_acquisition_readiness",
    items: [
      "A1.4 Source Quality Intelligence readiness",
      "quality metrics planning",
      "manual throughput improvement planning",
      "no increased spend",
      "no acquisition execution",
    ],
    governanceRule: "Return to acquisition is allowed only as a planning phase after operational readiness remains safe.",
  },
];

export const operationalReadinessOperatorQuestions = [
  "Who to call?",
  "Why does the lead matter?",
  "What is missing?",
  "What is blocked?",
  "What needs review?",
];

export const operationalReadinessBlockers = [
  "DNC",
  "opt-out",
  "property-first cleanup",
  "missing phone/email",
  "missing source",
  "missing property address",
  "unclear seller context",
  "unreviewed AI VA summary",
  "approval not reviewed",
];

export const operationalReadinessFindings: OperationalReadinessFinding[] = [
  {
    question: "Can operational readiness remain planning-only?",
    category: "required_before_implementation",
    finding: "Yes. This check can verify manual review clarity without providers, outreach, runtime jobs, persistence, routing, or automation.",
  },
  {
    question: "Can imported and property-first leads be reviewed safely?",
    category: "safe_to_include_now",
    finding: "Yes. They may be reviewed manually when source, cleanup, missing-contact, and property-first blockers remain visible.",
  },
  {
    question: "Can missing-contact leads be worked manually without drift?",
    category: "required_before_implementation",
    finding: "Yes. Missing-contact work must remain manual and cannot trigger skip tracing, enrichment, outreach, provider activation, or automation.",
  },
  {
    question: "Can seller context stay explainable and operator-visible?",
    category: "safe_to_include_now",
    finding: "Yes. Notes, replies, timelines, AI VA summaries, and blockers can be surfaced as review inputs only.",
  },
  {
    question: "Can this safely return to A1.4 Source Quality Intelligence?",
    category: "required_before_implementation",
    finding: "Yes, if A1.4 remains a source-quality planning phase that improves manual throughput without increasing spend or execution authority.",
  },
  {
    question: "Should this phase add UI or runtime readiness systems?",
    category: "out_of_scope",
    finding: "No. This bridge is contracts and tests only, with no UI, routes, jobs, queues, persistence, provider clients, or CRM automation.",
  },
  {
    question: "Should source scoring be persisted now?",
    category: "future_upgrade",
    finding: "No. Source metrics can be planned for A1.4, but persistence and scoring activation require later approval.",
  },
  {
    question: "Can source quality intelligence improve ROI next?",
    category: "optional_optimization",
    finding: "Yes. A1.4 can reduce operator waste by comparing cleanup burden, review readiness, and source confidence from existing data.",
  },
];

export const futureAcquisitionReturnGate: FutureAcquisitionReturnGate = {
  nextExactPhase: "A1.4 Source Quality Intelligence",
  purpose: "Improve acquisition quality without increasing spend.",
  allowedFutureMetrics: [
    "cleanup burden",
    "property-first rate",
    "duplicate rate",
    "source confidence",
    "review-ready rate",
    "missing-data rate",
    "operator friction",
    "review completion rate",
    "source-level readiness quality",
    "acquisition usability",
  ],
  blockedUntil: "Operational readiness confirms manual review clarity and safety boundaries remain intact.",
};

export function getOperationalReadinessCheck(): OperationalReadinessCheck {
  const result: OperationalReadinessCheck = {
    phase: "Operational Readiness Check",
    operationalReadinessStatus: "planning_only",
    readinessLanes: operationalReadinessLanes,
    operatorQuestions: operationalReadinessOperatorQuestions,
    readinessBlockers: operationalReadinessBlockers,
    futureAcquisitionReturnGate,
    findings: operationalReadinessFindings,
    recommendedNextExactStep: "A1.4 Source Quality Intelligence",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: operationalReadinessCheckFlags,
  };

  assertOperationalReadinessCheckSafe(result);

  return result;
}

export function assertOperationalReadinessCheckSafe(result: OperationalReadinessCheck) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("Operational Readiness Check must remain read-only, advisory-only, and planning-only.");
  }

  if (result.operationalReadinessStatus !== "planning_only") {
    throw new Error("Operational Readiness Check cannot become execution-ready operational readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Operational Readiness Check cannot authorize providers, outbound messaging, seller contact, runtime work, persistence, vector storage, embeddings, automation, acquisition execution, routing, assignment, queues, reminders, CRM movement, scraping, source scoring activation, blocker bypass, or A1.4 before readiness.");
  }

  if (result.recommendedNextExactStep !== "A1.4 Source Quality Intelligence") {
    throw new Error("Operational Readiness Check must return to A1.4 Source Quality Intelligence next.");
  }

  if (result.futureAcquisitionReturnGate.nextExactPhase !== "A1.4 Source Quality Intelligence") {
    throw new Error("Operational Readiness Check return gate must point to A1.4 Source Quality Intelligence.");
  }
}

export function summarizeOperationalReadinessCheck(result: OperationalReadinessCheck) {
  assertOperationalReadinessCheckSafe(result);

  return `${result.phase}: ${result.operationalReadinessStatus}. Next step is ${result.recommendedNextExactStep}. Operators may review imported, property-first, missing-contact, seller-context, blocker, communication-readiness, and acquisition-usability signals manually only. No providers, outbound messaging, seller contact, runtime jobs, persistence, vector database, embeddings, automation, CRM movement, routing, assignments, queues, reminders, scraping, source scoring activation, acquisition execution, or blocker bypass is authorized.`;
}
