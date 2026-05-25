export const manualD4dCaptureValidationPlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  zodSchemaCreated: false,
  runtimeValidatorEnabled: false,
  safeParseWired: false,
  formValidationEnabled: false,
  uiComponentCreated: false,
  formCreated: false,
  routeChanged: false,
  apiHandlerEnabled: false,
  captureExecutionEnabled: false,
  manualCaptureCreatesRecord: false,
  leadCreationEnabled: false,
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

export type ManualD4dCaptureValidationReadiness =
  | "planning_only"
  | "future_validation_shape_defined"
  | "blocked_until_runtime_validation_gate";

export type FutureManualD4dValidationFieldRule =
  | "property address required"
  | "city required"
  | "state required as two-letter abbreviation"
  | "zip required as 5-digit ZIP"
  | "source required"
  | "observation date required"
  | "field note required"
  | "optional distress tags human-verified"
  | "operator note bounded"
  | "review status required"
  | "provenance note required";

export type ManualD4dValidationPlanningLaneKey =
  | "required_field_rules"
  | "source_provenance_validation"
  | "address_location_minimization"
  | "distress_tag_verification"
  | "bounded_note_guidance"
  | "review_status_validation"
  | "property_first_blockers"
  | "duplicate_review_blockers"
  | "no_runtime_no_schema_boundary"
  | "a3_4_readiness";

export type ManualD4dValidationPlanningLane = {
  lane: ManualD4dValidationPlanningLaneKey;
  items: string[];
  governanceRule: string;
};

export type ManualD4dCaptureValidationPlanningFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type ManualD4dCaptureValidationPlanningFinding = {
  question: string;
  category: ManualD4dCaptureValidationPlanningFindingCategory;
  finding: string;
};

export type ManualD4dCaptureValidationPlanning = {
  phase: "A3.3 Manual D4D Capture Validation Planning";
  manualD4dCaptureValidationReadiness: ManualD4dCaptureValidationReadiness;
  futureValidationFieldRules: FutureManualD4dValidationFieldRule[];
  validationPlanningLanes: ManualD4dValidationPlanningLane[];
  validationCopyDoctrine: string[];
  forbiddenValidationWording: string[];
  forbiddenValidationDrift: string[];
  findings: ManualD4dCaptureValidationPlanningFinding[];
  recommendedNextExactStep: "A3.4 Manual D4D Capture Readiness Review";
  nextStageRecommendation: "A3.4 Manual D4D Capture Readiness Review";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCaptureValidationPlanningFlags;
};

export const futureManualD4dValidationFieldRules: FutureManualD4dValidationFieldRule[] = [
  "property address required",
  "city required",
  "state required as two-letter abbreviation",
  "zip required as 5-digit ZIP",
  "source required",
  "observation date required",
  "field note required",
  "optional distress tags human-verified",
  "operator note bounded",
  "review status required",
  "provenance note required",
];

export const manualD4dValidationPlanningLanes: ManualD4dValidationPlanningLane[] = [
  {
    lane: "required_field_rules",
    items: [
      "property address required",
      "city required",
      "state required as two-letter abbreviation",
      "zip required as 5-digit ZIP",
      "source required",
      "observation date required",
      "field note required",
    ],
    governanceRule: "Required-field rules are validation planning only and cannot create a Zod schema, runtime validator, safeParse wiring, form validation, or capture execution.",
  },
  {
    lane: "source_provenance_validation",
    items: [
      "source required",
      "manual D4D source visible",
      "observation date required",
      "provenance note required",
    ],
    governanceRule: "Source and provenance validation planning must keep origin context visible and cannot infer, hide, overwrite, or auto-fill source data.",
  },
  {
    lane: "address_location_minimization",
    items: [
      "property address required",
      "city/state/zip required",
      "no GPS coordinate requirement",
      "no location trail",
      "no map capture",
    ],
    governanceRule: "Address validation planning uses typed address fields only and cannot collect GPS coordinates, location trails, maps, route data, or Street View data.",
  },
  {
    lane: "distress_tag_verification",
    items: [
      "optional distress tags human-verified",
      "no automated distress inference",
      "verification copy required",
      "distress tags are review prompts",
    ],
    governanceRule: "Distress tag validation planning requires human verification and cannot imply valuation, offer generation, owner contact, outreach, or autonomous acquisition.",
  },
  {
    lane: "bounded_note_guidance",
    items: [
      "field note required",
      "operator note bounded",
      "plain text only planning",
      "no unrestricted free-form capture",
    ],
    governanceRule: "Note validation planning should require bounded, human-entered text and cannot create storage, persistence, audit writing, or sanitizer/runtime behavior.",
  },
  {
    lane: "review_status_validation",
    items: [
      "review status required",
      "required for review wording",
      "manual review status only",
      "no execution-ready status",
    ],
    governanceRule: "Review status validation planning cannot mark a record ready to save, ready to contact, ready to execute, or approved for capture execution.",
  },
  {
    lane: "property_first_blockers",
    items: [
      "property-first blocker visibility",
      "missing owner blocker",
      "missing phone/email blocker",
      "outreach blocked",
    ],
    governanceRule: "Property-first blockers must remain visible and cannot trigger skip tracing, enrichment, provider activation, outreach, messaging, or calling.",
  },
  {
    lane: "duplicate_review_blockers",
    items: [
      "duplicate review required",
      "duplicate property blocker",
      "near-duplicate address blocker",
      "manual overlap review",
    ],
    governanceRule: "Duplicate review blockers cannot merge, delete, create, persist, route, assign, import, or mutate lead records.",
  },
  {
    lane: "no_runtime_no_schema_boundary",
    items: [
      "no Zod schema creation",
      "no runtime validator",
      "no safeParse wiring",
      "no form validation",
      "no route or API handler",
    ],
    governanceRule: "A3.3 can plan future validation rules only and cannot add validation code, import zod, wire safeParse, create forms, or change routes.",
  },
  {
    lane: "a3_4_readiness",
    items: [
      "A3.4 readiness review",
      "runtime validation gate remains separate",
      "capture execution remains blocked",
      "lead creation remains blocked",
    ],
    governanceRule: "A3.4 may review readiness, but runtime validation, UI implementation, storage writes, lead creation, and capture execution remain blocked here.",
  },
];

export const manualD4dValidationCopyDoctrine = [
  "Use required for review wording.",
  "Use needs human verification wording.",
  "Describe future validation as review readiness only.",
  "Do not describe any field as a valid lead.",
  "Do not imply a record is ready to save.",
  "Do not imply a record is ready to contact.",
  "Do not imply a record is ready to execute.",
];

export const forbiddenManualD4dValidationWording = [
  "valid lead",
  "ready to save",
  "ready to contact",
  "ready to execute",
  "ready to send",
  "ready to route",
  "approved for capture",
  "save lead",
  "contact owner",
  "execute capture",
];

export const forbiddenManualD4dValidationDrift = [
  "Zod schema creation",
  "runtime validator",
  "safeParse wiring",
  "form validation",
  "UI component creation",
  "form creation",
  "route changes",
  "API handlers",
  "storage",
  "lead creation",
  "manual capture record creation",
  "localStorage writes",
  "persistence",
  "audit writing",
  "CRM mutation",
  "maps/GPS",
  "location tracking",
  "outreach",
  "providers",
  "automation",
  "runtime jobs",
  "invented property facts",
];

export const manualD4dCaptureValidationPlanningFindings: ManualD4dCaptureValidationPlanningFinding[] = [
  {
    question: "Can A3.3 plan validation without creating runtime validation?",
    category: "required_before_implementation",
    finding: "Yes. A3.3 can define future field rules, copy doctrine, validation lanes, and fail-closed invariants while blocking Zod schemas, safeParse wiring, runtime validators, forms, routes, handlers, and storage.",
  },
  {
    question: "Can validation planning improve ROI safely?",
    category: "safe_to_include_now",
    finding: "Yes, by clarifying future manual D4D data quality requirements before implementation spend, lead creation, or operator workflow changes.",
  },
  {
    question: "Should A3.3 import zod or create schemas?",
    category: "out_of_scope",
    finding: "No. Existing validation patterns can inform the future shape, but this phase must not import zod, create schemas, or wire safeParse.",
  },
  {
    question: "Should A3.3 create form validation?",
    category: "future_upgrade",
    finding: "No. Runtime validation, form validation, submit handlers, and error rendering require a later implementation gate after readiness review.",
  },
  {
    question: "Can validation wording be constrained now?",
    category: "optional_optimization",
    finding: "Yes. Using review-only validation wording prevents future validation planning from implying save, contact, or execution readiness.",
  },
];

function validationCopyImpliesExecution(result: ManualD4dCaptureValidationPlanning) {
  const doctrineText = result.validationCopyDoctrine.join(" ").toLowerCase();

  return result.forbiddenValidationWording.some((wording) => doctrineText.includes(wording.toLowerCase()));
}

export function getManualD4dCaptureValidationPlanning(): ManualD4dCaptureValidationPlanning {
  const result: ManualD4dCaptureValidationPlanning = {
    phase: "A3.3 Manual D4D Capture Validation Planning",
    manualD4dCaptureValidationReadiness: "planning_only",
    futureValidationFieldRules: futureManualD4dValidationFieldRules,
    validationPlanningLanes: manualD4dValidationPlanningLanes,
    validationCopyDoctrine: manualD4dValidationCopyDoctrine,
    forbiddenValidationWording: forbiddenManualD4dValidationWording,
    forbiddenValidationDrift: forbiddenManualD4dValidationDrift,
    findings: manualD4dCaptureValidationPlanningFindings,
    recommendedNextExactStep: "A3.4 Manual D4D Capture Readiness Review",
    nextStageRecommendation: "A3.4 Manual D4D Capture Readiness Review",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCaptureValidationPlanningFlags,
  };

  assertManualD4dCaptureValidationPlanningSafe(result);

  return result;
}

export function assertManualD4dCaptureValidationPlanningSafe(result: ManualD4dCaptureValidationPlanning) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.3 manual D4D capture validation planning must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dCaptureValidationReadiness !== "planning_only") {
    throw new Error("A3.3 manual D4D capture validation planning cannot become runtime-ready or live validation readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.3 manual D4D capture validation planning cannot authorize Zod schemas, runtime validators, safeParse wiring, form validation, UI components, forms, route changes, API handlers, capture execution, manual capture record creation, lead creation, localStorage writes, persistence, audit writing, CRM mutation, CRM automation, GPS tracking, location tracking, maps, route planning, map crawling, Street View automation, scraping, external lookup, external APIs, fetch/network behavior, providers, outbound messaging, calling, AI voice, outreach, skip tracing, enrichment, queues, routing, assignments, reminders, runtime jobs, polling, vector storage, embeddings, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase.");
  }

  if (validationCopyImpliesExecution(result)) {
    throw new Error("A3.3 manual D4D capture validation planning copy cannot imply saving, contact, routing, sending, capture approval, or execution readiness.");
  }

  if (result.recommendedNextExactStep !== "A3.4 Manual D4D Capture Readiness Review") {
    throw new Error("A3.3 manual D4D capture validation planning must recommend A3.4 Manual D4D Capture Readiness Review next.");
  }

  if (result.nextStageRecommendation !== "A3.4 Manual D4D Capture Readiness Review") {
    throw new Error("A3.3 manual D4D capture validation planning must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCaptureValidationPlanning(result: ManualD4dCaptureValidationPlanning) {
  assertManualD4dCaptureValidationPlanningSafe(result);

  return `${result.phase}: ${result.manualD4dCaptureValidationReadiness}. A3.3 plans future manual D4D capture validation rules for property address, city, state, ZIP, source, observation date, field note, optional human-verified distress tags, bounded operator note, review status, and provenance note. It does not create Zod schemas, runtime validators, safeParse wiring, form validation, UI components, forms, route changes, API handlers, storage, lead creation, localStorage writes, persistence, audit writing, CRM mutation, maps, GPS, providers, outreach, automation, runtime jobs, approval-as-execution, or property fact invention. Next stage: ${result.nextStageRecommendation}.`;
}
