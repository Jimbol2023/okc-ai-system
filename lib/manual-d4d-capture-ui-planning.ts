export const manualD4dCaptureUiPlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  uiComponentCreated: false,
  formCreated: false,
  routeChanged: false,
  apiHandlerEnabled: false,
  validationRuntimeEnabled: false,
  captureExecutionEnabled: false,
  leadCreationEnabled: false,
  manualCaptureCreatesRecord: false,
  localStorageWriteEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  crmAutomationEnabled: false,
  gpsTrackingEnabled: false,
  locationTrackingEnabled: false,
  mapEnabled: false,
  routePlanningEnabled: false,
  mapCrawlingEnabled: false,
  streetViewAutomationEnabled: false,
  scrapingEnabled: false,
  externalLookupEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  outreachEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  queueSystemEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  autonomousAcquisitionEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousSellerHandlingEnabled: false,
  approvalGrantsExecution: false,
  propertyFactsInvented: false,
  spendIncreaseAuthorized: false,
  leadVolumeIncreaseAuthorized: false,
} as const;

export type ManualD4dCaptureUiReadiness =
  | "planning_only"
  | "future_ui_shape_defined"
  | "blocked_until_validation_gate";

export type ManualD4dFutureUiField =
  | "property address"
  | "city"
  | "state"
  | "zip"
  | "source"
  | "observation date"
  | "field note"
  | "optional distress tags"
  | "operator note"
  | "review status"
  | "provenance note";

export type ManualD4dUiPlanningLaneKey =
  | "mobile_first_field_layout"
  | "source_provenance_visibility"
  | "required_field_clarity"
  | "distress_tag_verification"
  | "property_first_warning"
  | "duplicate_review_warning"
  | "missing_owner_contact_warning"
  | "no_map_no_gps_boundary"
  | "future_validation_readiness";

export type ManualD4dUiPlanningLane = {
  lane: ManualD4dUiPlanningLaneKey;
  items: string[];
  governanceRule: string;
};

export type ManualD4dCaptureUiPlanningFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type ManualD4dCaptureUiPlanningFinding = {
  question: string;
  category: ManualD4dCaptureUiPlanningFindingCategory;
  finding: string;
};

export type ManualD4dCaptureUiPlanning = {
  phase: "A3.2 Manual D4D Capture UI Planning";
  manualD4dCaptureUiReadiness: ManualD4dCaptureUiReadiness;
  futureUiFieldPlan: ManualD4dFutureUiField[];
  uiPlanningLanes: ManualD4dUiPlanningLane[];
  futureUiCopyDoctrine: string[];
  forbiddenUiPlanningWording: string[];
  forbiddenUiPlanningDrift: string[];
  findings: ManualD4dCaptureUiPlanningFinding[];
  recommendedNextExactStep: "A3.3 Manual D4D Capture Validation Planning";
  nextStageRecommendation: "A3.3 Manual D4D Capture Validation Planning";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCaptureUiPlanningFlags;
};

export const futureManualD4dUiFieldPlan: ManualD4dFutureUiField[] = [
  "property address",
  "city",
  "state",
  "zip",
  "source",
  "observation date",
  "field note",
  "optional distress tags",
  "operator note",
  "review status",
  "provenance note",
];

export const manualD4dUiPlanningLanes: ManualD4dUiPlanningLane[] = [
  {
    lane: "mobile_first_field_layout",
    items: [
      "single-column mobile field order",
      "address fields grouped first",
      "source and provenance visible near the top",
      "review status visible before any future action area",
    ],
    governanceRule: "A3.2 may plan a mobile-first field layout only and cannot create UI components, forms, routes, or click handlers.",
  },
  {
    lane: "source_provenance_visibility",
    items: [
      "source required",
      "manual D4D source label",
      "observation date",
      "provenance note",
    ],
    governanceRule: "Future UI planning must keep source and provenance visible and cannot hide, infer, or overwrite source context.",
  },
  {
    lane: "required_field_clarity",
    items: [
      "property address required",
      "city required",
      "state required",
      "zip required",
      "source required",
      "observation note needed",
    ],
    governanceRule: "Required-field clarity is planning only and cannot activate validation runtime, save behavior, capture execution, or record creation.",
  },
  {
    lane: "distress_tag_verification",
    items: [
      "optional distress tags",
      "distress tags need verification",
      "human verification copy",
      "no automated distress inference",
    ],
    governanceRule: "Distress tag UI copy must frame tags as human-verified review prompts and cannot imply valuation, offer generation, owner contact, or autonomous acquisition.",
  },
  {
    lane: "property_first_warning",
    items: [
      "property-first cleanup",
      "missing seller contact warning",
      "missing owner warning",
      "outreach blocked wording",
    ],
    governanceRule: "Property-first warning copy must make clear that missing seller/contact data blocks outreach, skip tracing, enrichment, messaging, and calling.",
  },
  {
    lane: "duplicate_review_warning",
    items: [
      "duplicate review",
      "duplicate property warning",
      "near-duplicate warning",
      "manual overlap review",
    ],
    governanceRule: "Duplicate review UI planning cannot imply merge, delete, create, persist, route, assign, import, or CRM mutation.",
  },
  {
    lane: "missing_owner_contact_warning",
    items: [
      "owner/contact missing",
      "missing phone/email warning",
      "manual research needed",
      "contact blocked warning",
    ],
    governanceRule: "Missing owner/contact warning copy cannot trigger external lookup, skip tracing, enrichment, provider activation, outreach, or contact attempts.",
  },
  {
    lane: "no_map_no_gps_boundary",
    items: [
      "no map UI",
      "no GPS tracking",
      "no route planning",
      "no Street View automation",
      "no location capture",
    ],
    governanceRule: "A3.2 cannot plan map, GPS, location, route planning, map crawling, Street View, scraping, external API, or fetch/network behavior.",
  },
  {
    lane: "future_validation_readiness",
    items: [
      "A3.3 validation planning readiness",
      "validation runtime remains blocked",
      "save behavior remains blocked",
      "capture execution remains blocked",
    ],
    governanceRule: "A3.3 may plan validation, but A3.2 cannot create validation runtime, forms, submit handlers, storage writes, or capture controls.",
  },
];

export const futureManualD4dUiCopyDoctrine = [
  "Use plain manual-review wording only.",
  "Describe future fields as review fields, not action controls.",
  "Make source and provenance visible in future UI planning.",
  "Show property-first, duplicate, missing owner/contact, and distress verification warnings as review context.",
  "Do not use execution-like labels or wording.",
  "Do not imply save, send, contact, route, workflow start, or provider activation.",
];

export const forbiddenManualD4dUiPlanningWording = [
  "route planning",
  "direct mail follow-up",
  "send",
  "contact",
  "capture now",
  "save lead",
  "start workflow",
  "execute",
  "activate",
  "launch",
  "call owner",
  "text owner",
  "skip trace",
];

export const forbiddenManualD4dUiPlanningDrift = [
  "UI component creation",
  "form creation",
  "route changes",
  "API handlers",
  "validation runtime",
  "lead creation",
  "manual capture record creation",
  "localStorage writes",
  "persistence",
  "audit writing",
  "maps/GPS",
  "location tracking",
  "routing",
  "route planning",
  "outreach",
  "providers",
  "skip tracing",
  "enrichment",
  "CRM mutation",
  "queues",
  "assignments",
  "reminders",
  "runtime jobs",
  "invented property facts",
];

export const manualD4dCaptureUiPlanningFindings: ManualD4dCaptureUiPlanningFinding[] = [
  {
    question: "Can A3.2 plan UI without creating UI?",
    category: "required_before_implementation",
    finding: "Yes. A3.2 can define future field layout, copy doctrine, warnings, and fail-closed invariants while blocking components, forms, routes, handlers, validation runtime, and storage.",
  },
  {
    question: "Can A3.2 improve ROI safely?",
    category: "safe_to_include_now",
    finding: "Yes, by making the future manual D4D UI shape scanable and mobile-first before any implementation spend or lead-volume expansion.",
  },
  {
    question: "Should A3.2 alter the current D4D dashboard page?",
    category: "out_of_scope",
    finding: "No. The current dashboard page remains untouched; this phase only defines the future UI planning contract.",
  },
  {
    question: "Should A3.2 create validation behavior?",
    category: "future_upgrade",
    finding: "No. A3.3 may plan validation, but runtime validation, submit handlers, forms, and storage writes remain blocked here.",
  },
  {
    question: "Can future UI copy be constrained now?",
    category: "optional_optimization",
    finding: "Yes. Blocking execution-like labels prevents future UI planning from implying save, send, route, contact, or workflow activation.",
  },
];

function copyDoctrineImpliesExecution(result: ManualD4dCaptureUiPlanning) {
  const doctrineText = result.futureUiCopyDoctrine.join(" ").toLowerCase();

  return result.forbiddenUiPlanningWording.some((wording) => doctrineText.includes(wording.toLowerCase()));
}

export function getManualD4dCaptureUiPlanning(): ManualD4dCaptureUiPlanning {
  const result: ManualD4dCaptureUiPlanning = {
    phase: "A3.2 Manual D4D Capture UI Planning",
    manualD4dCaptureUiReadiness: "planning_only",
    futureUiFieldPlan: futureManualD4dUiFieldPlan,
    uiPlanningLanes: manualD4dUiPlanningLanes,
    futureUiCopyDoctrine: futureManualD4dUiCopyDoctrine,
    forbiddenUiPlanningWording: forbiddenManualD4dUiPlanningWording,
    forbiddenUiPlanningDrift: forbiddenManualD4dUiPlanningDrift,
    findings: manualD4dCaptureUiPlanningFindings,
    recommendedNextExactStep: "A3.3 Manual D4D Capture Validation Planning",
    nextStageRecommendation: "A3.3 Manual D4D Capture Validation Planning",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCaptureUiPlanningFlags,
  };

  assertManualD4dCaptureUiPlanningSafe(result);

  return result;
}

export function assertManualD4dCaptureUiPlanningSafe(result: ManualD4dCaptureUiPlanning) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.2 manual D4D capture UI planning must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dCaptureUiReadiness !== "planning_only") {
    throw new Error("A3.2 manual D4D capture UI planning cannot become implementation-ready or live UI readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.2 manual D4D capture UI planning cannot authorize UI components, forms, route changes, API handlers, validation runtime, capture execution, lead creation, manual capture record creation, localStorage writes, persistence, audit writing, CRM mutation, CRM automation, GPS tracking, location tracking, maps, route planning, map crawling, Street View automation, scraping, external lookup, external APIs, fetch/network behavior, providers, outbound messaging, calling, AI voice, outreach, skip tracing, enrichment, queues, routing, assignments, reminders, runtime jobs, polling, vector storage, embeddings, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase.");
  }

  if (copyDoctrineImpliesExecution(result)) {
    throw new Error("A3.2 manual D4D capture UI planning copy doctrine cannot imply execution, contact, routing, saving, provider activation, skip tracing, or workflow start.");
  }

  if (result.recommendedNextExactStep !== "A3.3 Manual D4D Capture Validation Planning") {
    throw new Error("A3.2 manual D4D capture UI planning must recommend A3.3 Manual D4D Capture Validation Planning next.");
  }

  if (result.nextStageRecommendation !== "A3.3 Manual D4D Capture Validation Planning") {
    throw new Error("A3.2 manual D4D capture UI planning must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCaptureUiPlanning(result: ManualD4dCaptureUiPlanning) {
  assertManualD4dCaptureUiPlanningSafe(result);

  return `${result.phase}: ${result.manualD4dCaptureUiReadiness}. A3.2 plans a future manual D4D capture UI shape only, using mobile-first field layout, source/provenance visibility, required-field clarity, distress tag verification, property-first warnings, duplicate review warnings, missing owner/contact warnings, no-map/no-GPS boundaries, and future validation readiness. It does not alter the current D4D dashboard page or create UI components, forms, routes, API handlers, validation runtime, lead creation, manual capture records, localStorage writes, persistence, audit writing, CRM mutation, maps, GPS, route planning, scraping, external lookup, providers, outreach, skip tracing, enrichment, queues, assignments, reminders, runtime jobs, automation, approval-as-execution, property fact invention, spend increase, or lead-volume increase. Next stage: ${result.nextStageRecommendation}.`;
}
