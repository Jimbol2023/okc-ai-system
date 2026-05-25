export const manualD4dCaptureUsabilityGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  captureExecutionEnabled: false,
  leadCreationEnabled: false,
  importExecutionEnabled: false,
  gpsTrackingEnabled: false,
  locationTrackingEnabled: false,
  routePlanningEnabled: false,
  mapCrawlingEnabled: false,
  streetViewAutomationEnabled: false,
  scrapingEnabled: false,
  externalLookupEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  crmAutomationEnabled: false,
  queueSystemEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  outreachEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
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

export type ManualD4dCaptureReadiness =
  | "planning_only"
  | "needs_operator_evidence"
  | "blocked_until_manual_capture_bottleneck";

export type ManualD4dUsabilityLaneKey =
  | "address_capture_clarity"
  | "source_labeling"
  | "field_observation_notes"
  | "distress_tag_review"
  | "property_first_handling"
  | "duplicate_property_overlap_review"
  | "missing_owner_contact_visibility"
  | "operator_scanability"
  | "a3_1_readiness";

export type ManualD4dUsabilityLane = {
  lane: ManualD4dUsabilityLaneKey;
  items: string[];
  governanceRule: string;
};

export type MinimumFutureManualCaptureField =
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

export type ManualD4dFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type ManualD4dCaptureUsabilityFinding = {
  question: string;
  category: ManualD4dFindingCategory;
  finding: string;
};

export type ManualD4dCaptureUsabilityGate = {
  phase: "A3 Manual D4D Capture Usability Gate";
  manualD4dCaptureReadiness: ManualD4dCaptureReadiness;
  manualD4dUsabilityLanes: ManualD4dUsabilityLane[];
  minimumFutureManualCaptureFields: MinimumFutureManualCaptureField[];
  manualReviewLabels: string[];
  roiDoctrine: string[];
  forbiddenManualD4dDrift: string[];
  findings: ManualD4dCaptureUsabilityFinding[];
  recommendedNextExactStep: "A3.1 Manual D4D Property Capture";
  nextStageRecommendation: "A3.1 Manual D4D Property Capture";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCaptureUsabilityGateFlags;
};

export const manualD4dUsabilityLanes: ManualD4dUsabilityLane[] = [
  {
    lane: "address_capture_clarity",
    items: [
      "property address",
      "city",
      "state",
      "zip",
      "address needed label",
    ],
    governanceRule: "Manual D4D address capture can be planned for human-entered property observations only and cannot create leads or execute capture.",
  },
  {
    lane: "source_labeling",
    items: [
      "source required label",
      "manual D4D source",
      "operator provenance note",
      "observation date",
    ],
    governanceRule: "Every future manual D4D record must remain source-labeled and provenance-visible before any later capture feature is considered.",
  },
  {
    lane: "field_observation_notes",
    items: [
      "field note",
      "operator note",
      "human-entered observation",
      "no automated property inference",
    ],
    governanceRule: "Field notes are manual review text only and cannot infer, invent, scrape, enrich, or overwrite property facts.",
  },
  {
    lane: "distress_tag_review",
    items: [
      "optional distress tags",
      "vacancy review label",
      "deferred maintenance review label",
      "human verification requirement",
    ],
    governanceRule: "Distress tags may be planned as review prompts only and cannot trigger outreach, valuation, offer generation, owner contact, or autonomous acquisition.",
  },
  {
    lane: "property_first_handling",
    items: [
      "property-first row",
      "missing owner visibility",
      "missing contact visibility",
      "outreach remains blocked",
    ],
    governanceRule: "Property-first D4D observations remain manual property records and cannot authorize seller contact, skip tracing, enrichment, messaging, or calling.",
  },
  {
    lane: "duplicate_property_overlap_review",
    items: [
      "duplicate property address overlap",
      "near-duplicate address review",
      "existing lead overlap check planning",
      "manual duplicate review label",
    ],
    governanceRule: "Duplicate/property overlap review cannot auto-merge, delete, route, assign, persist, import, create leads, or mutate CRM records.",
  },
  {
    lane: "missing_owner_contact_visibility",
    items: [
      "missing owner label",
      "missing phone/email label",
      "manual research needed",
      "contact blocked status",
    ],
    governanceRule: "Missing owner or contact visibility cannot trigger external lookup, skip tracing, enrichment, outreach, provider activation, or contact attempts.",
  },
  {
    lane: "operator_scanability",
    items: [
      "review status",
      "manual review labels",
      "smallest useful capture surface",
      "operator friction evidence",
    ],
    governanceRule: "A3 can improve scanability doctrine only after operator evidence shows manual D4D capture is the bottleneck.",
  },
  {
    lane: "a3_1_readiness",
    items: [
      "A3.1 readiness check",
      "manual capture bottleneck evidence",
      "source/provenance requirements",
      "capture remains execution-blocked",
    ],
    governanceRule: "A3.1 may be recommended only as manual D4D property capture planning, not as lead creation, persistence, routing, or outreach.",
  },
];

export const minimumFutureManualCaptureFields: MinimumFutureManualCaptureField[] = [
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

export const manualD4dReviewLabels = [
  "manual D4D review",
  "address needed",
  "source required",
  "field note review",
  "distress tag review",
  "property-first cleanup",
  "duplicate property review",
  "missing owner/contact review",
];

export const forbiddenManualD4dDrift = [
  "GPS tracking",
  "location tracking",
  "route planning",
  "map crawling",
  "Street View automation",
  "scraping",
  "external lookup",
  "external API",
  "fetch/network",
  "lead creation",
  "import execution",
  "persistence",
  "audit writing",
  "CRM mutation",
  "assignments",
  "queues",
  "routing",
  "reminders",
  "runtime jobs",
  "providers",
  "outbound messaging",
  "outreach",
  "skip tracing",
  "enrichment",
  "autonomous acquisition",
  "invented property facts",
  "spend increase",
  "lead-volume increase",
];

export const manualD4dCaptureUsabilityFindings: ManualD4dCaptureUsabilityFinding[] = [
  {
    question: "Can A3 remain a gate instead of a capture feature?",
    category: "required_before_implementation",
    finding: "Yes. A3 defines usability lanes, minimum future fields, labels, doctrine, and invariants without UI, routes, persistence, maps, GPS, or lead creation.",
  },
  {
    question: "Can manual D4D improve ROI safely?",
    category: "safe_to_include_now",
    finding: "Yes, but only as a planning gate that proceeds when operator evidence shows manual field capture is a higher bottleneck than importer or public-record review work.",
  },
  {
    question: "Should A3 activate GPS, maps, or route planning?",
    category: "out_of_scope",
    finding: "No. D4D usability planning must block GPS tracking, location tracking, route planning, map crawling, Street View automation, external APIs, and fetch/network behavior.",
  },
  {
    question: "Should A3.1 capture records later?",
    category: "future_upgrade",
    finding: "Only after this gate proves the bottleneck. A3.1 may plan manual property capture, but lead creation, persistence, CRM mutation, and outreach remain separate future approvals.",
  },
  {
    question: "Can minimum fields be defined now?",
    category: "optional_optimization",
    finding: "Yes. Listing property address, source, observation date, field note, optional distress tags, operator note, review status, and provenance note improves future scanability without executing capture.",
  },
];

export function getManualD4dCaptureUsabilityGate(): ManualD4dCaptureUsabilityGate {
  const result: ManualD4dCaptureUsabilityGate = {
    phase: "A3 Manual D4D Capture Usability Gate",
    manualD4dCaptureReadiness: "planning_only",
    manualD4dUsabilityLanes,
    minimumFutureManualCaptureFields,
    manualReviewLabels: manualD4dReviewLabels,
    roiDoctrine: [
      "Proceed only if manual field capture is the proven acquisition bottleneck.",
      "Use human-entered field observations only.",
      "Improve manual review throughput before building capture UI or workflow.",
      "Preserve source, observation date, review status, and provenance visibility.",
      "Do not increase acquisition spend.",
      "Do not increase lead volume through automation.",
      "Do not route operators, assign work, create reminders, or automate follow-up.",
      "Never invent property facts.",
    ],
    forbiddenManualD4dDrift,
    findings: manualD4dCaptureUsabilityFindings,
    recommendedNextExactStep: "A3.1 Manual D4D Property Capture",
    nextStageRecommendation: "A3.1 Manual D4D Property Capture",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCaptureUsabilityGateFlags,
  };

  assertManualD4dCaptureUsabilityGateSafe(result);

  return result;
}

export function assertManualD4dCaptureUsabilityGateSafe(result: ManualD4dCaptureUsabilityGate) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3 manual D4D capture usability gate must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dCaptureReadiness !== "planning_only") {
    throw new Error("A3 manual D4D capture usability gate cannot become execution-ready or live capture readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3 manual D4D capture usability gate cannot authorize capture execution, lead creation, import execution, GPS tracking, location tracking, route planning, map crawling, Street View automation, scraping, external lookup, external APIs, fetch/network behavior, persistence, audit writing, CRM mutation, CRM automation, queues, routing, assignments, reminders, runtime jobs, polling, providers, outbound messaging, calling, AI voice, outreach, skip tracing, enrichment, vector storage, embeddings, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase.");
  }

  if (result.recommendedNextExactStep !== "A3.1 Manual D4D Property Capture") {
    throw new Error("A3 manual D4D capture usability gate must recommend A3.1 Manual D4D Property Capture next.");
  }

  if (result.nextStageRecommendation !== "A3.1 Manual D4D Property Capture") {
    throw new Error("A3 manual D4D capture usability gate must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCaptureUsabilityGate(result: ManualD4dCaptureUsabilityGate) {
  assertManualD4dCaptureUsabilityGateSafe(result);

  return `${result.phase}: ${result.manualD4dCaptureReadiness}. A3 is a planning-only usability gate to decide whether manual Driving-for-Dollars capture is the highest-ROI bottleneck before any capture UI or workflow exists. It defines address capture clarity, source labeling, field observation notes, distress tag review, property-first handling, duplicate/property overlap review, missing owner/contact visibility, operator scanability, and A3.1 readiness. No capture execution, lead creation, import execution, GPS tracking, location tracking, route planning, map crawling, Street View automation, scraping, external lookup, external API, fetch/network behavior, persistence, audit writing, CRM mutation, CRM automation, queues, routing, assignments, reminders, runtime jobs, polling, provider activation, outbound messaging, calling, AI voice, outreach, skip tracing, enrichment, vector storage, embeddings, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
