export const manualD4dCaptureUiSafetyAccessibilityReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  uiExecutionAuthorized: false,
  captureExecutionEnabled: false,
  leadCreationEnabled: false,
  manualCaptureCreatesRecord: false,
  localStorageWriteEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  routeChanged: false,
  apiHandlerEnabled: false,
  schemaCreated: false,
  zodSchemaCreated: false,
  runtimeValidatorEnabled: false,
  safeParseWired: false,
  formSubmitEnabled: false,
  crmMutationEnabled: false,
  crmAutomationEnabled: false,
  gpsTrackingEnabled: false,
  mapEnabled: false,
  routePlanningEnabled: false,
  scrapingEnabled: false,
  externalLookupEnabled: false,
  fetchNetworkEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  outreachEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  queueSystemEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  autonomousAcquisitionEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousSellerHandlingEnabled: false,
  approvalGrantsExecution: false,
  propertyFactsInvented: false,
} as const;

export type ManualD4dUiSafetyAccessibilityStatus =
  | "planning_only"
  | "needs_ui_hardening_review"
  | "blocked_until_accessibility_evidence";

export type ManualD4dUiSafetyAccessibilityLaneKey =
  | "visible_labels"
  | "guidance_text"
  | "dynamic_review_messages"
  | "keyboard_usability"
  | "disabled_action_clarity"
  | "safety_copy"
  | "blocker_visibility"
  | "no_storage_no_runtime_boundary"
  | "next_stage_readiness";

export type ManualD4dUiSafetyAccessibilityLane = {
  lane: ManualD4dUiSafetyAccessibilityLaneKey;
  items: string[];
  governanceRule: string;
};

export type ManualD4dUiSafetyAccessibilityReview = {
  phase: "A3.7 Manual D4D Capture UI Safety And Accessibility Review";
  manualD4dUiSafetyAccessibilityStatus: ManualD4dUiSafetyAccessibilityStatus;
  safetyAccessibilityLanes: ManualD4dUiSafetyAccessibilityLane[];
  hardeningExpectations: string[];
  forbiddenSafetyAccessibilityDrift: string[];
  recommendedNextExactStep: "A3.8 Manual D4D Capture Persistence And Lead Creation Gate";
  nextStageRecommendation: "A3.8 Manual D4D Capture Persistence And Lead Creation Gate";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCaptureUiSafetyAccessibilityReviewFlags;
};

export const manualD4dUiSafetyAccessibilityLanes: ManualD4dUiSafetyAccessibilityLane[] = [
  {
    lane: "visible_labels",
    items: ["visible label per input", "required meaning visible in text", "source/provenance label visibility"],
    governanceRule: "Labels and required-field meaning must be visible without relying only on color, icons, or placeholder text.",
  },
  {
    lane: "guidance_text",
    items: ["required for review wording", "two-letter state guidance", "5-digit ZIP guidance", "no invented property facts guidance"],
    governanceRule: "Guidance text can help operators review draft input but cannot become runtime validation, schema validation, or capture approval.",
  },
  {
    lane: "dynamic_review_messages",
    items: ["required review message list", "draft preview text", "polite live region"],
    governanceRule: "Dynamic review messages should be announced politely and cannot create records, write storage, or change CRM data.",
  },
  {
    lane: "keyboard_usability",
    items: ["native inputs", "native select", "native checkboxes", "focus-visible control styles"],
    governanceRule: "Keyboard usability must use native controls and cannot add custom workflow launch controls.",
  },
  {
    lane: "disabled_action_clarity",
    items: ["disabled draft control", "disabled explanation", "no submit handler", "no action authority"],
    governanceRule: "Disabled action clarity must explain why the draft is locked and cannot imply save, submission, execution, or approval.",
  },
  {
    lane: "safety_copy",
    items: ["draft only", "manual review only", "no storage", "no maps or GPS", "no outreach"],
    governanceRule: "Safety copy must remain plain and visible without implying capture execution or seller handling.",
  },
  {
    lane: "blocker_visibility",
    items: ["property-first blocker", "duplicate review blocker", "missing owner blocker", "distress verification blocker"],
    governanceRule: "Blockers remain review signals only and cannot be bypassed by review status or draft completion.",
  },
  {
    lane: "no_storage_no_runtime_boundary",
    items: ["no localStorage writes", "no persistence", "no API handler", "no schema or runtime validator", "no fetch/network behavior"],
    governanceRule: "A3.7 can harden screen accessibility only and cannot add storage, routes, APIs, schemas, validators, or runtime work.",
  },
  {
    lane: "next_stage_readiness",
    items: ["A3.8 persistence and lead creation gate", "future gate required before writes", "lead creation remains blocked"],
    governanceRule: "A3.7 may recommend A3.8 only; it cannot authorize persistence, lead creation, or capture execution.",
  },
];

export const manualD4dUiSafetyAccessibilityHardeningExpectations = [
  "Add polite live regions for dynamic preview and required-review messages.",
  "Add aria-invalid on blank required draft fields.",
  "Make required-field meaning visible in text.",
  "Tie the disabled draft control to explanatory text.",
  "Keep all UI wording review-only and non-executing.",
];

export const forbiddenManualD4dUiSafetyAccessibilityDrift = [
  "lead creation",
  "manual capture record creation",
  "localStorage writes",
  "persistence",
  "API handlers",
  "route changes",
  "schema creation",
  "Zod schema creation",
  "runtime validation",
  "safeParse wiring",
  "form submit",
  "CRM mutation",
  "maps/GPS",
  "route planning",
  "scraping",
  "external lookup",
  "fetch/network behavior",
  "provider activation",
  "outreach",
  "skip tracing",
  "enrichment",
  "queues",
  "assignments",
  "reminders",
  "runtime jobs",
  "automation",
  "property fact invention",
];

export function getManualD4dCaptureUiSafetyAccessibilityReview(): ManualD4dUiSafetyAccessibilityReview {
  const result: ManualD4dUiSafetyAccessibilityReview = {
    phase: "A3.7 Manual D4D Capture UI Safety And Accessibility Review",
    manualD4dUiSafetyAccessibilityStatus: "planning_only",
    safetyAccessibilityLanes: manualD4dUiSafetyAccessibilityLanes,
    hardeningExpectations: manualD4dUiSafetyAccessibilityHardeningExpectations,
    forbiddenSafetyAccessibilityDrift: forbiddenManualD4dUiSafetyAccessibilityDrift,
    recommendedNextExactStep: "A3.8 Manual D4D Capture Persistence And Lead Creation Gate",
    nextStageRecommendation: "A3.8 Manual D4D Capture Persistence And Lead Creation Gate",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCaptureUiSafetyAccessibilityReviewFlags,
  };

  assertManualD4dCaptureUiSafetyAccessibilityReviewSafe(result);

  return result;
}

export function assertManualD4dCaptureUiSafetyAccessibilityReviewSafe(
  result: ManualD4dUiSafetyAccessibilityReview,
) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.7 manual D4D UI safety/accessibility review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dUiSafetyAccessibilityStatus !== "planning_only") {
    throw new Error("A3.7 manual D4D UI safety/accessibility review cannot become implementation-ready or execution-ready.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.7 manual D4D UI safety/accessibility review cannot authorize execution, storage, providers, automation, runtime work, or property fact invention.");
  }

  if (result.recommendedNextExactStep !== "A3.8 Manual D4D Capture Persistence And Lead Creation Gate") {
    throw new Error("A3.7 manual D4D UI safety/accessibility review must recommend A3.8 Manual D4D Capture Persistence And Lead Creation Gate next.");
  }

  if (result.nextStageRecommendation !== "A3.8 Manual D4D Capture Persistence And Lead Creation Gate") {
    throw new Error("A3.7 manual D4D UI safety/accessibility review must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCaptureUiSafetyAccessibilityReview(
  result: ManualD4dUiSafetyAccessibilityReview,
) {
  assertManualD4dCaptureUiSafetyAccessibilityReviewSafe(result);

  return `${result.phase}: ${result.manualD4dUiSafetyAccessibilityStatus}. A3.7 reviews and hardens visible labels, guidance text, dynamic review messages, keyboard usability, disabled action clarity, safety copy, blocker visibility, and the no-storage/no-runtime boundary. It does not authorize storage, lead creation, outreach, maps/GPS, providers, route changes, API handlers, schemas, runtime validation, CRM mutation, queues, assignments, reminders, runtime jobs, automation, approval-as-execution, or property fact invention. Next stage: ${result.nextStageRecommendation}.`;
}
