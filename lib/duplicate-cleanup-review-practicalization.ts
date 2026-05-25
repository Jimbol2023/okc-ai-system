export const duplicateCleanupReviewPracticalizationFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  duplicateAutoMergeEnabled: false,
  duplicateAutoDeleteEnabled: false,
  importAutoApprovalEnabled: false,
  cleanupAutoFixEnabled: false,
  crmMutationEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  publicRecordConnectorsEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  runtimeJobsEnabled: false,
  queueSystemEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  autonomousAcquisitionEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousSellerHandlingEnabled: false,
  approvalGrantsExecution: false,
  cleanupMutatesRecords: false,
  duplicateReviewCreatesLeads: false,
  propertyFirstAuthorizesOutreach: false,
  missingContactTriggersEnrichment: false,
} as const;

export type DuplicateCleanupReadiness =
  | "planning_only"
  | "needs_operator_review"
  | "blocked_until_manual_cleanup_evidence";

export type DuplicateCleanupLaneKey =
  | "duplicate_review_clarity"
  | "invalid_row_cleanup"
  | "source_cleanup"
  | "property_address_cleanup"
  | "missing_contact_cleanup"
  | "unmapped_header_review"
  | "property_first_cleanup"
  | "operator_scanability";

export type DuplicateCleanupLane = {
  lane: DuplicateCleanupLaneKey;
  existingInputs: string[];
  manualMeaning: string;
  governanceRule: string;
};

export type DuplicateCleanupFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type DuplicateCleanupFinding = {
  question: string;
  category: DuplicateCleanupFindingCategory;
  finding: string;
};

export type DuplicateCleanupReviewPracticalization = {
  phase: "A1.5 Duplicate And Cleanup Review Practicalization";
  duplicateCleanupReadiness: DuplicateCleanupReadiness;
  duplicateCleanupLanes: DuplicateCleanupLane[];
  manualReviewLabels: string[];
  practicalizationDoctrine: string[];
  forbiddenDuplicateCleanupDrift: string[];
  existingReviewInputs: string[];
  findings: DuplicateCleanupFinding[];
  recommendedNextExactStep: "A2 Read-Only Public Records Intake Planning Gate";
  nextStageRecommendation: "A2 Read-Only Public Records Intake Planning Gate";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof duplicateCleanupReviewPracticalizationFlags;
};

export const duplicateCleanupExistingReviewInputs = [
  "duplicate",
  "validationErrors",
  "blocked_cleanup",
  "cleanup_needed",
  "importBlockers",
  "sourceReviewReasons",
  "unmappedHeaders",
  "cleanupNeeds",
  "missingSourceRows",
  "missingAddressRows",
  "duplicateRows",
];

export const duplicateCleanupLanes: DuplicateCleanupLane[] = [
  {
    lane: "duplicate_review_clarity",
    existingInputs: ["duplicate", "duplicateRows", "cleanupNeeds"],
    manualMeaning: "Duplicate rows need human comparison before import decisions.",
    governanceRule: "Duplicate review cannot merge, delete, import, route, assign, or mutate records automatically.",
  },
  {
    lane: "invalid_row_cleanup",
    existingInputs: ["validationErrors", "blocked_cleanup", "cleanupNeeds"],
    manualMeaning: "Invalid rows need human cleanup before they can become reliable import candidates.",
    governanceRule: "Invalid-row cleanup is advisory only and cannot auto-fix, persist, or approve records.",
  },
  {
    lane: "source_cleanup",
    existingInputs: ["cleanup_needed", "sourceReviewReasons", "missingSourceRows"],
    manualMeaning: "Missing or unclear source labels need source review before import confidence improves.",
    governanceRule: "Source cleanup cannot infer facts, activate external lookup, scrape, or create public-record connectors.",
  },
  {
    lane: "property_address_cleanup",
    existingInputs: ["validationErrors", "importBlockers", "missingAddressRows"],
    manualMeaning: "Missing property address blocks useful acquisition review until a human resolves it.",
    governanceRule: "Property address cleanup cannot enrich, scrape, skip trace, or mutate records automatically.",
  },
  {
    lane: "missing_contact_cleanup",
    existingInputs: ["importBlockers", "cleanupNeeds"],
    manualMeaning: "Missing contact information remains manual cleanup and does not make a lead outreach-ready.",
    governanceRule: "Missing contact cleanup cannot trigger skip tracing, enrichment, seller contact, or provider activation.",
  },
  {
    lane: "unmapped_header_review",
    existingInputs: ["unmappedHeaders", "cleanupNeeds"],
    manualMeaning: "Unmapped headers should be reviewed for future import clarity.",
    governanceRule: "Header review cannot add runtime parsing, codegen, migrations, or schema changes in this phase.",
  },
  {
    lane: "property_first_cleanup",
    existingInputs: ["blocked_cleanup", "cleanupNeeds"],
    manualMeaning: "Property-first rows require contact cleanup and remain blocked from outreach.",
    governanceRule: "Property-first cleanup cannot authorize outreach, calling, messaging, follow-up, or communication readiness.",
  },
  {
    lane: "operator_scanability",
    existingInputs: ["cleanupNeeds", "sourceReviewReasons", "importBlockers"],
    manualMeaning: "Operators need concise review labels to decide what cleanup matters first.",
    governanceRule: "Scanability guidance cannot create queues, assignments, reminders, routing, or automation.",
  },
];

export const duplicateCleanupManualReviewLabels = [
  "duplicate review",
  "cleanup before import",
  "source review",
  "property-first contact cleanup",
  "missing property address",
  "unmapped headers",
  "invalid row review",
];

export const forbiddenDuplicateCleanupDrift = [
  "auto-merge duplicates",
  "auto-delete duplicates",
  "auto-import duplicate rows",
  "auto-fix cleanup rows",
  "CRM mutation",
  "persistence",
  "queue creation",
  "routing creation",
  "assignment creation",
  "reminder creation",
  "scraping",
  "skip tracing",
  "provider activation",
  "outbound messaging",
  "runtime execution",
  "public-record connector activation",
  "audit writing",
  "approval-as-execution",
];

export const duplicateCleanupFindings: DuplicateCleanupFinding[] = [
  {
    question: "Can duplicate and cleanup review become more practical without execution?",
    category: "required_before_implementation",
    finding: "Yes. A1.5 can define manual labels, lanes, and review meaning without auto-merge, auto-delete, auto-import, mutation, or automation.",
  },
  {
    question: "Can existing importer and intake concepts cover this phase?",
    category: "required_before_implementation",
    finding: "Yes. Existing duplicate, validation, blocker, source-review, unmapped-header, and cleanup fields are enough for a planning contract.",
  },
  {
    question: "Can missing contact cleanup remain safe?",
    category: "safe_to_include_now",
    finding: "Yes. Missing contact cleanup can stay visible while skip tracing, enrichment, outreach, and provider activation remain blocked.",
  },
  {
    question: "Can property-first cleanup remain blocked from outreach?",
    category: "safe_to_include_now",
    finding: "Yes. Property-first rows can remain manual cleanup records and must not become communication-ready through this phase.",
  },
  {
    question: "Should duplicate cleanup mutate records now?",
    category: "out_of_scope",
    finding: "No. Merging, deleting, importing, persisting, or CRM mutation is outside this phase.",
  },
  {
    question: "Should unmapped header review update parser behavior now?",
    category: "future_upgrade",
    finding: "No. Header mapping improvements should be separately justified by repeated real operator friction.",
  },
  {
    question: "Can A2 planning be the next ROI-safe step?",
    category: "optional_optimization",
    finding: "Yes. After cleanup practicalization, A2 should only plan read-only public-record export intake if exports are the next bottleneck.",
  },
];

export function getDuplicateCleanupReviewPracticalization(): DuplicateCleanupReviewPracticalization {
  const result: DuplicateCleanupReviewPracticalization = {
    phase: "A1.5 Duplicate And Cleanup Review Practicalization",
    duplicateCleanupReadiness: "planning_only",
    duplicateCleanupLanes,
    manualReviewLabels: duplicateCleanupManualReviewLabels,
    practicalizationDoctrine: [
      "Improve scanability before adding capability.",
      "Reduce manual waste without mutating records.",
      "Preserve source attribution and cleanup reasons.",
      "Use existing preview data only.",
      "Never auto-fix records.",
      "Keep duplicate and cleanup outputs advisory, explainable, and operator-reviewed.",
    ],
    forbiddenDuplicateCleanupDrift,
    existingReviewInputs: duplicateCleanupExistingReviewInputs,
    findings: duplicateCleanupFindings,
    recommendedNextExactStep: "A2 Read-Only Public Records Intake Planning Gate",
    nextStageRecommendation: "A2 Read-Only Public Records Intake Planning Gate",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: duplicateCleanupReviewPracticalizationFlags,
  };

  assertDuplicateCleanupReviewPracticalizationSafe(result);

  return result;
}

export function assertDuplicateCleanupReviewPracticalizationSafe(result: DuplicateCleanupReviewPracticalization) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A1.5 duplicate cleanup review practicalization must remain read-only, advisory-only, and planning-only.");
  }

  if (result.duplicateCleanupReadiness !== "planning_only") {
    throw new Error("A1.5 duplicate cleanup review practicalization cannot become execution-ready cleanup.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A1.5 duplicate cleanup review practicalization cannot authorize auto-merge, auto-delete, auto-import, auto-cleanup, CRM mutation, provider activation, outbound messaging, scraping, skip tracing, public-record connectors, persistence, audit writing, vector storage, embeddings, runtime jobs, queues, routing, assignments, reminders, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, record mutation, lead creation, or property-first outreach.");
  }

  if (result.recommendedNextExactStep !== "A2 Read-Only Public Records Intake Planning Gate") {
    throw new Error("A1.5 duplicate cleanup review practicalization must recommend A2 Read-Only Public Records Intake Planning Gate next.");
  }

  if (result.nextStageRecommendation !== "A2 Read-Only Public Records Intake Planning Gate") {
    throw new Error("A1.5 duplicate cleanup review practicalization must include the next stage recommendation.");
  }
}

export function summarizeDuplicateCleanupReviewPracticalization(result: DuplicateCleanupReviewPracticalization) {
  assertDuplicateCleanupReviewPracticalizationSafe(result);

  return `${result.phase}: ${result.duplicateCleanupReadiness}. Duplicate and cleanup review practicalization improves scanability for duplicate rows, invalid rows, missing source/property/contact data, unmapped headers, and property-first cleanup using existing preview data only. No auto-merge, auto-delete, auto-import, auto-cleanup, CRM mutation, provider activation, outbound messaging, scraping, skip tracing, public-record connector, persistence, audit writing, runtime job, queue, routing, assignment, reminder, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, record mutation, lead creation, or property-first outreach is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
