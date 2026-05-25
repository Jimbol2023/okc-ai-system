export const operatorDecisionQualitySelectionFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationAuthorized: false,
  implementationStarted: false,
  d4dSavePathAuthorized: false,
  savePathImplemented: false,
  saveButtonCreated: false,
  saveHandlerCreated: false,
  apiRouteCreated: false,
  apiWriteEnabled: false,
  apiLeadsPostEnabled: false,
  databaseWriteEnabled: false,
  prismaWriteEnabled: false,
  schemaCreated: false,
  zodSchemaCreated: false,
  mapperCreated: false,
  validationRuntimeEnabled: false,
  safeParseWired: false,
  storageEnabled: false,
  persistenceEnabled: false,
  localStorageWriteEnabled: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  auditWritingEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  gpsTrackingEnabled: false,
  mapEnabled: false,
  routePlanningEnabled: false,
  scrapingEnabled: false,
  publicRecordConnectorsEnabled: false,
  externalLookupEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  runtimeJobsEnabled: false,
  queueSystemEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  followUpAutomationEnabled: false,
  automationEnabled: false,
  approvalGrantsExecution: false,
  acquisitionExecutionAuthorized: false,
  spendIncreaseAuthorized: false,
  communicationVolumeIncreaseAuthorized: false,
  leadVolumeAutomationEnabled: false,
  propertyFactsInvented: false,
} as const;

export type OperatorDecisionQualitySelectionStatus =
  | "planning_only"
  | "operator_decision_quality_selected"
  | "blocked_until_operator_evidence";

export type SelectedBottleneck = "operator_decision_quality";
export type D4dSavePathDecision = "not_authorized";
export type OperatorDecisionQualityImplementationDecision = "not_authorized";

export type OperatorDecisionQualitySelectionLaneKey =
  | "lead_worthiness_clarity"
  | "blocker_clarity"
  | "missing_data_clarity"
  | "source_provenance_clarity"
  | "review_ready_clarity"
  | "operator_next_action_clarity"
  | "import_cleanup_comparison"
  | "source_quality_comparison"
  | "public_records_referral_comparison"
  | "d4d_save_path_deferral"
  | "no_execution_boundary";

export type OperatorDecisionQualitySelectionLane = {
  lane: OperatorDecisionQualitySelectionLaneKey;
  decisionValue: string[];
  governanceRule: string;
};

export type OperatorDecisionQualitySelection = {
  phase: "A4.1 Operator Decision Quality Selection";
  operatorDecisionQualitySelectionStatus: OperatorDecisionQualitySelectionStatus;
  selectedBottleneck: SelectedBottleneck;
  d4dSavePathDecision: D4dSavePathDecision;
  implementationDecision: OperatorDecisionQualityImplementationDecision;
  selectionLanes: OperatorDecisionQualitySelectionLane[];
  decisionQualityDoctrine: string[];
  forbiddenOperatorDecisionQualityDrift: string[];
  recommendedNextExactStep: "A4.2 Operator Decision Quality Implementation Gate";
  nextStageRecommendation: "A4.2 Operator Decision Quality Implementation Gate";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof operatorDecisionQualitySelectionFlags;
};

export const operatorDecisionQualitySelectionLanes: OperatorDecisionQualitySelectionLane[] = [
  {
    lane: "lead_worthiness_clarity",
    decisionValue: ["why the lead matters", "review priority", "manual value signal", "operator decision confidence"],
    governanceRule: "Lead worthiness clarity helps operators decide where to spend time but cannot score, route, assign, or execute work.",
  },
  {
    lane: "blocker_clarity",
    decisionValue: ["DNC visibility", "opt-out visibility", "property-first blocker", "missing-contact blocker"],
    governanceRule: "Blocker clarity must make unsafe or incomplete leads obvious and cannot bypass blockers.",
  },
  {
    lane: "missing_data_clarity",
    decisionValue: ["missing source", "missing address", "missing owner", "missing phone/email"],
    governanceRule: "Missing-data clarity can guide manual cleanup only and cannot trigger enrichment, skip tracing, or outreach.",
  },
  {
    lane: "source_provenance_clarity",
    decisionValue: ["source attribution", "provenance note", "public-record basis", "manual D4D source"],
    governanceRule: "Source and provenance clarity must preserve attribution without inventing property facts or activating lookups.",
  },
  {
    lane: "review_ready_clarity",
    decisionValue: ["review-ready signal", "manual readiness", "cleanup burden", "source confidence"],
    governanceRule: "Review-ready clarity is an operator aid and cannot become lead creation, persistence, scoring persistence, or execution.",
  },
  {
    lane: "operator_next_action_clarity",
    decisionValue: ["what to review next", "what to fix manually", "what remains blocked", "what not to do"],
    governanceRule: "Next-action clarity may recommend manual review focus only and cannot create queues, assignments, reminders, routing, or follow-up.",
  },
  {
    lane: "import_cleanup_comparison",
    decisionValue: ["duplicate cleanup", "invalid row review", "unmapped headers", "source cleanup"],
    governanceRule: "Import cleanup remains a comparison input because it may reduce waste, but A4.1 selects broader operator decision quality.",
  },
  {
    lane: "source_quality_comparison",
    decisionValue: ["source confidence", "review-ready rate", "operator friction", "source-level readiness"],
    governanceRule: "Source quality remains a comparison input and cannot create persisted scoring, automation, or increased spend.",
  },
  {
    lane: "public_records_referral_comparison",
    decisionValue: ["public-record review", "legal export provenance", "referrals", "manual relationship sourcing"],
    governanceRule: "Public records and referrals remain manual, source-tracked comparison inputs without connectors, scraping, or automation.",
  },
  {
    lane: "d4d_save_path_deferral",
    decisionValue: ["D4D UI-only draft", "save path deferred", "mapping gaps", "write risk"],
    governanceRule: "D4D save work remains deferred because decision clarity must improve before persistence or lead creation is reconsidered.",
  },
  {
    lane: "no_execution_boundary",
    decisionValue: ["no implementation", "no save path", "no lead creation", "no provider activation", "no automation"],
    governanceRule: "A4.1 selects a bottleneck only; it cannot execute, persist, contact, route, assign, or automate.",
  },
];

export const operatorDecisionQualityDoctrine = [
  "Operator Decision Quality is selected because it improves decisions per operator hour, not just task cost.",
  "Cheapest bottleneck remains a comparison input, but it is not the only priority.",
  "The selected bottleneck is operator_decision_quality.",
  "D4D save path decision remains not_authorized.",
  "Implementation decision remains not_authorized.",
  "Future implementation may only improve review clarity, not execute work.",
  "No persistence, save path, lead creation, CRM mutation, outreach, provider activation, routing, assignments, reminders, scraping, enrichment, maps/GPS, or automation is authorized.",
  "Operator decision quality must answer what matters, what is blocked, what is missing, and what manual action is safest.",
  "Spend and communication volume must not increase.",
  "Source attribution must be preserved and property facts must not be invented.",
];

export const forbiddenOperatorDecisionQualityDrift = [
  "implementation authorization",
  "implementation start",
  "D4D save path authorization",
  "save path implementation",
  "save button creation",
  "save handler creation",
  "API route creation",
  "/api/leads writes",
  "database writes",
  "Prisma writes",
  "schema creation",
  "Zod schema creation",
  "mapper creation",
  "runtime validation",
  "safeParse wiring",
  "storage",
  "persistence",
  "localStorage writes",
  "lead creation",
  "CRM mutation",
  "audit writing",
  "provider activation",
  "outreach",
  "maps/GPS",
  "route planning",
  "scraping",
  "public-record connector activation",
  "external lookup",
  "skip tracing",
  "enrichment",
  "runtime jobs",
  "queues",
  "routing",
  "assignments",
  "reminders",
  "follow-up automation",
  "automation",
  "approval-as-execution",
  "acquisition execution",
  "spend increase",
  "communication volume increase",
  "lead-volume automation",
  "property fact invention",
];

export function getOperatorDecisionQualitySelection(): OperatorDecisionQualitySelection {
  const result: OperatorDecisionQualitySelection = {
    phase: "A4.1 Operator Decision Quality Selection",
    operatorDecisionQualitySelectionStatus: "planning_only",
    selectedBottleneck: "operator_decision_quality",
    d4dSavePathDecision: "not_authorized",
    implementationDecision: "not_authorized",
    selectionLanes: operatorDecisionQualitySelectionLanes,
    decisionQualityDoctrine: operatorDecisionQualityDoctrine,
    forbiddenOperatorDecisionQualityDrift,
    recommendedNextExactStep: "A4.2 Operator Decision Quality Implementation Gate",
    nextStageRecommendation: "A4.2 Operator Decision Quality Implementation Gate",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: operatorDecisionQualitySelectionFlags,
  };

  assertOperatorDecisionQualitySelectionSafe(result);

  return result;
}

export function assertOperatorDecisionQualitySelectionSafe(result: OperatorDecisionQualitySelection) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A4.1 operator decision quality selection must remain read-only, advisory-only, and planning-only.");
  }

  if (result.operatorDecisionQualitySelectionStatus !== "planning_only") {
    throw new Error("A4.1 operator decision quality selection cannot become implementation-ready, write-ready, or execution-ready.");
  }

  if (result.selectedBottleneck !== "operator_decision_quality") {
    throw new Error("A4.1 must select operator_decision_quality as the elite ROI bottleneck.");
  }

  if (result.d4dSavePathDecision !== "not_authorized") {
    throw new Error("A4.1 D4D save path decision must remain not_authorized.");
  }

  if (result.implementationDecision !== "not_authorized") {
    throw new Error("A4.1 implementation decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A4.1 operator decision quality selection cannot authorize implementation, writes, leads, providers, runtime work, automation, scraping, enrichment, spend increases, approval-as-execution, or property fact drift.");
  }

  if (result.recommendedNextExactStep !== "A4.2 Operator Decision Quality Implementation Gate") {
    throw new Error("A4.1 operator decision quality selection must recommend A4.2 Operator Decision Quality Implementation Gate next.");
  }

  if (result.nextStageRecommendation !== "A4.2 Operator Decision Quality Implementation Gate") {
    throw new Error("A4.1 operator decision quality selection must include the next stage recommendation.");
  }
}

export function summarizeOperatorDecisionQualitySelection(result: OperatorDecisionQualitySelection) {
  assertOperatorDecisionQualitySelectionSafe(result);

  return `${result.phase}: ${result.operatorDecisionQualitySelectionStatus}. Selected bottleneck is ${result.selectedBottleneck} because it improves decisions per operator hour, not just task cost. D4D save path decision is ${result.d4dSavePathDecision}; implementation decision is ${result.implementationDecision}. A4.1 compares import cleanup, source quality, public-record review, referrals/manual relationship sourcing, operator throughput, and D4D save work while selecting operator decision quality as the elite ROI bottleneck. No implementation, save path, persistence, API route, /api/leads write, schema, Zod schema, mapper, runtime validation, storage, Prisma or database write, lead creation, CRM mutation, provider activation, outreach, maps/GPS, scraping, public-record connector, external lookup, skip tracing, enrichment, queue, routing, assignment, reminder, automation, spend increase, communication volume increase, approval-as-execution, acquisition execution, or property fact invention is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
