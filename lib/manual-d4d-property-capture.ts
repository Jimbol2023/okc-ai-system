export const manualD4dPropertyCaptureFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  captureExecutionEnabled: false,
  manualCaptureCreatesRecord: false,
  leadCreationEnabled: false,
  importExecutionEnabled: false,
  persistenceEnabled: false,
  localStorageWriteEnabled: false,
  auditWritingEnabled: false,
  routeCreationEnabled: false,
  apiHandlerEnabled: false,
  uiFormEnabled: false,
  schemaMigrationEnabled: false,
  gpsTrackingEnabled: false,
  locationTrackingEnabled: false,
  routePlanningEnabled: false,
  mapCrawlingEnabled: false,
  streetViewAutomationEnabled: false,
  scrapingEnabled: false,
  externalLookupEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  outreachEnabled: false,
  crmMutationEnabled: false,
  crmAutomationEnabled: false,
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

export type ManualD4dPropertyCaptureReadiness =
  | "planning_only"
  | "manual_review_shape_defined"
  | "blocked_until_capture_execution_gate";

export type ManualD4dCaptureField =
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

export type ManualD4dCaptureReviewLaneKey =
  | "address_completeness"
  | "source_provenance"
  | "observation_note_review"
  | "distress_tag_review"
  | "property_first_cleanup"
  | "duplicate_overlap"
  | "missing_owner_contact_visibility"
  | "operator_review_status"
  | "future_execution_gate_readiness";

export type ManualD4dCaptureReviewLane = {
  lane: ManualD4dCaptureReviewLaneKey;
  items: string[];
  governanceRule: string;
};

export type ManualD4dPropertyCaptureFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type ManualD4dPropertyCaptureFinding = {
  question: string;
  category: ManualD4dPropertyCaptureFindingCategory;
  finding: string;
};

export type ManualD4dPropertyCapturePlanning = {
  phase: "A3.1 Manual D4D Property Capture";
  manualD4dPropertyCaptureReadiness: ManualD4dPropertyCaptureReadiness;
  manualCaptureFields: ManualD4dCaptureField[];
  captureReviewLanes: ManualD4dCaptureReviewLane[];
  manualReviewLabels: string[];
  roiDoctrine: string[];
  forbiddenManualCaptureDrift: string[];
  findings: ManualD4dPropertyCaptureFinding[];
  recommendedNextExactStep: "A3.2 Manual D4D Capture UI Planning";
  nextStageRecommendation: "A3.2 Manual D4D Capture UI Planning";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dPropertyCaptureFlags;
};

export const manualD4dCaptureFields: ManualD4dCaptureField[] = [
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

export const manualD4dCaptureReviewLanes: ManualD4dCaptureReviewLane[] = [
  {
    lane: "address_completeness",
    items: [
      "property address required",
      "city required",
      "state required",
      "zip required",
      "address required label",
    ],
    governanceRule: "Address completeness defines future manual review shape only and cannot create a lead, write storage, or execute capture.",
  },
  {
    lane: "source_provenance",
    items: [
      "source required",
      "manual D4D source label",
      "observation date",
      "provenance note",
    ],
    governanceRule: "Manual D4D property capture must remain source-labeled and provenance-visible before any later execution gate.",
  },
  {
    lane: "observation_note_review",
    items: [
      "field note",
      "operator note",
      "human-entered observation",
      "review before capture",
    ],
    governanceRule: "Observation notes are human-entered planning fields only and cannot infer, invent, scrape, enrich, or persist property facts.",
  },
  {
    lane: "distress_tag_review",
    items: [
      "optional distress tags",
      "distress tags need verification",
      "vacancy review",
      "deferred maintenance review",
    ],
    governanceRule: "Distress tags require human verification and cannot trigger owner contact, valuation, offer generation, outreach, or autonomous acquisition.",
  },
  {
    lane: "property_first_cleanup",
    items: [
      "property-first cleanup",
      "missing seller contact visibility",
      "missing owner visibility",
      "outreach remains blocked",
    ],
    governanceRule: "Property-first D4D capture shape remains blocked from seller contact, skip tracing, enrichment, messaging, and calling.",
  },
  {
    lane: "duplicate_overlap",
    items: [
      "duplicate review",
      "duplicate property address",
      "near-duplicate address",
      "existing lead overlap",
    ],
    governanceRule: "Duplicate overlap review cannot merge, delete, create, persist, route, assign, import, or mutate lead records.",
  },
  {
    lane: "missing_owner_contact_visibility",
    items: [
      "owner/contact missing",
      "missing owner",
      "missing phone/email",
      "manual research needed",
    ],
    governanceRule: "Missing owner/contact visibility cannot trigger external lookup, skip tracing, enrichment, provider activation, outreach, or contact attempts.",
  },
  {
    lane: "operator_review_status",
    items: [
      "review status",
      "review before capture",
      "operator review required",
      "manual review labels",
    ],
    governanceRule: "Operator review status is a planning label and cannot approve capture execution, CRM mutation, reminders, queues, or assignments.",
  },
  {
    lane: "future_execution_gate_readiness",
    items: [
      "A3.2 UI planning readiness",
      "capture execution remains blocked",
      "lead creation remains blocked",
      "persistence remains blocked",
    ],
    governanceRule: "A3.2 may plan a future UI, but actual capture execution, lead creation, storage, routes, and API handlers require a separate future gate.",
  },
];

export const manualD4dPropertyCaptureReviewLabels = [
  "manual D4D property review",
  "address required",
  "source required",
  "observation note needed",
  "distress tags need verification",
  "property-first cleanup",
  "duplicate review",
  "owner/contact missing",
  "review before capture",
];

export const forbiddenManualCaptureDrift = [
  "lead creation",
  "manual capture record creation",
  "persistence",
  "localStorage writes",
  "routes",
  "API handlers",
  "UI/forms",
  "schema migrations",
  "GPS tracking",
  "location tracking",
  "map crawling",
  "route planning",
  "Street View automation",
  "scraping",
  "external lookup",
  "external API",
  "fetch/network",
  "skip tracing",
  "enrichment",
  "provider activation",
  "messaging",
  "outreach",
  "CRM mutation",
  "queues",
  "assignments",
  "routing",
  "reminders",
  "runtime jobs",
  "invented property facts",
  "spend increase",
  "lead-volume increase",
];

export const manualD4dPropertyCaptureFindings: ManualD4dPropertyCaptureFinding[] = [
  {
    question: "Can A3.1 define manual D4D capture without implementing capture?",
    category: "required_before_implementation",
    finding: "Yes. A3.1 defines the minimum future manual capture fields, review lanes, labels, doctrine, and fail-closed invariants while keeping UI, routes, storage, and lead creation blocked.",
  },
  {
    question: "Can this improve ROI now?",
    category: "safe_to_include_now",
    finding: "Yes, because it narrows future manual D4D work to the smallest source-labeled shape that could reduce operator friction without spend, volume, or automation growth.",
  },
  {
    question: "Should A3.1 write to leads-storage or localStorage?",
    category: "out_of_scope",
    finding: "No. leads-storage writes, localStorage writes, CRM mutation, persistence, and audit writing remain blocked until a separate capture execution gate.",
  },
  {
    question: "Should A3.1 add a UI form or route?",
    category: "future_upgrade",
    finding: "No. A3.2 may plan a UI, but this phase does not add forms, routes, API handlers, validation surfaces, or capture controls.",
  },
  {
    question: "Can distress tags be included safely?",
    category: "optional_optimization",
    finding: "Yes, as optional human-verified review prompts only, with no automated inference, valuation, offer generation, outreach, or owner contact.",
  },
];

export function getManualD4dPropertyCapturePlanning(): ManualD4dPropertyCapturePlanning {
  const result: ManualD4dPropertyCapturePlanning = {
    phase: "A3.1 Manual D4D Property Capture",
    manualD4dPropertyCaptureReadiness: "planning_only",
    manualCaptureFields: manualD4dCaptureFields,
    captureReviewLanes: manualD4dCaptureReviewLanes,
    manualReviewLabels: manualD4dPropertyCaptureReviewLabels,
    roiDoctrine: [
      "Define the smallest future manual D4D property capture shape only.",
      "Reduce manual operator friction before any capture UI or workflow exists.",
      "Use human-entered observations only.",
      "Preserve source, observation date, review status, and provenance visibility.",
      "Do not write to leads-storage, localStorage, CRM, persistence, or audit systems.",
      "Do not increase spend or lead volume through automation.",
      "Do not route, assign, queue, remind, contact, enrich, or execute.",
      "Never invent property facts.",
    ],
    forbiddenManualCaptureDrift,
    findings: manualD4dPropertyCaptureFindings,
    recommendedNextExactStep: "A3.2 Manual D4D Capture UI Planning",
    nextStageRecommendation: "A3.2 Manual D4D Capture UI Planning",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dPropertyCaptureFlags,
  };

  assertManualD4dPropertyCaptureSafe(result);

  return result;
}

export function assertManualD4dPropertyCaptureSafe(result: ManualD4dPropertyCapturePlanning) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.1 manual D4D property capture must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dPropertyCaptureReadiness !== "planning_only") {
    throw new Error("A3.1 manual D4D property capture cannot become execution-ready or live capture readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.1 manual D4D property capture cannot authorize capture execution, manual capture record creation, lead creation, import execution, persistence, localStorage writes, audit writing, routes, API handlers, UI/forms, schema migrations, GPS tracking, location tracking, route planning, map crawling, Street View automation, scraping, external lookup, external APIs, fetch/network behavior, skip tracing, enrichment, providers, outbound messaging, calling, AI voice, outreach, CRM mutation, CRM automation, queues, routing, assignments, reminders, runtime jobs, polling, vector storage, embeddings, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase.");
  }

  if (result.recommendedNextExactStep !== "A3.2 Manual D4D Capture UI Planning") {
    throw new Error("A3.1 manual D4D property capture must recommend A3.2 Manual D4D Capture UI Planning next.");
  }

  if (result.nextStageRecommendation !== "A3.2 Manual D4D Capture UI Planning") {
    throw new Error("A3.1 manual D4D property capture must include the next stage recommendation.");
  }
}

export function summarizeManualD4dPropertyCapture(result: ManualD4dPropertyCapturePlanning) {
  assertManualD4dPropertyCaptureSafe(result);

  return `${result.phase}: ${result.manualD4dPropertyCaptureReadiness}. A3.1 defines the smallest future manual Driving-for-Dollars property capture shape using property address, city, state, zip, source, observation date, field note, optional distress tags, operator note, review status, and provenance note. It does not write to leads-storage, localStorage, CRM, routes, API handlers, forms, persistence, or audit systems. No capture execution, manual capture record creation, lead creation, import execution, GPS tracking, location tracking, route planning, map crawling, Street View automation, scraping, external lookup, external API, fetch/network behavior, skip tracing, enrichment, provider activation, messaging, calling, AI voice, outreach, CRM mutation, CRM automation, queues, routing, assignments, reminders, runtime jobs, polling, vector storage, embeddings, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
