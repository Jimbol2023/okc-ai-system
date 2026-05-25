export const publicRecordsExportReviewHelperFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  connectorActivated: false,
  scrapingEnabled: false,
  crawlingEnabled: false,
  liveLookupEnabled: false,
  fetchNetworkEnabled: false,
  parserCodegenEnabled: false,
  schemaMigrationEnabled: false,
  importExecutionEnabled: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  crmAutomationEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  queueSystemEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  autonomousAcquisitionEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousSellerHandlingEnabled: false,
  approvalGrantsExecution: false,
  propertyFactsInvented: false,
  spendIncreaseAuthorized: false,
  leadVolumeIncreaseAuthorized: false,
} as const;

export type ExportReviewReadiness =
  | "planning_only"
  | "needs_operator_review"
  | "blocked_until_legal_export_available";

export type ExportReviewLaneKey =
  | "provenance_review"
  | "field_layout_review"
  | "parcel_account_identifier_review"
  | "owner_mailing_property_address_review"
  | "tax_assessor_signal_review"
  | "property_first_review"
  | "missing_field_cleanup_review"
  | "duplicate_overlap_review"
  | "disclaimer_source_confidence_review";

export type ExportReviewLane = {
  lane: ExportReviewLaneKey;
  items: string[];
  governanceRule: string;
};

export type ExpectedExportFieldGroup =
  | "source/provenance"
  | "jurisdiction"
  | "parcel/account identifiers"
  | "owner fields"
  | "property address"
  | "mailing address"
  | "tax/assessment fields"
  | "dates/status fields"
  | "notes/disclaimers";

export type PublicRecordsExportReviewFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type PublicRecordsExportReviewFinding = {
  question: string;
  category: PublicRecordsExportReviewFindingCategory;
  finding: string;
};

export type PublicRecordsExportReviewHelper = {
  phase: "A2.1 Public Records Export Review Helper";
  exportReviewReadiness: ExportReviewReadiness;
  exportReviewLanes: ExportReviewLane[];
  expectedFieldGroups: ExpectedExportFieldGroup[];
  manualReviewLabels: string[];
  roiDoctrine: string[];
  forbiddenExportReviewDrift: string[];
  findings: PublicRecordsExportReviewFinding[];
  recommendedNextExactStep: "A3 Manual D4D Capture Usability Gate";
  nextStageRecommendation: "A3 Manual D4D Capture Usability Gate";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof publicRecordsExportReviewHelperFlags;
};

export const publicRecordsExportReviewLanes: ExportReviewLane[] = [
  {
    lane: "provenance_review",
    items: [
      "source name",
      "source office or URL",
      "download/export date",
      "operator-provided provenance note",
      "legal export basis",
    ],
    governanceRule: "A2.1 reviews already-downloaded or operator-provided legal exports only and cannot fetch, connect to, or scrape public-record systems.",
  },
  {
    lane: "field_layout_review",
    items: [
      "visible column layout",
      "mapped import-ready fields",
      "unmapped public-record headers",
      "operator field notes",
    ],
    governanceRule: "Field layout review may describe source columns and aliases but cannot generate parser code, migrate schemas, or execute imports.",
  },
  {
    lane: "parcel_account_identifier_review",
    items: [
      "parcelId",
      "parcel",
      "APN",
      "account number",
      "tax account number",
    ],
    governanceRule: "Parcel and account identifiers support human review only and cannot create, enrich, or mutate lead records.",
  },
  {
    lane: "owner_mailing_property_address_review",
    items: [
      "ownerName",
      "propertyAddress",
      "mailingAddress",
      "county",
      "property-first classification",
    ],
    governanceRule: "Owner, mailing, and property address review must remain source-visible and cannot invent property facts or authorize outreach.",
  },
  {
    lane: "tax_assessor_signal_review",
    items: [
      "assessor field labels",
      "tax field labels",
      "assessment value columns",
      "tax status columns",
      "source disclaimer context",
    ],
    governanceRule: "Tax and assessor signals are planning inputs for operator review, not automated valuation, enrichment, or acquisition execution.",
  },
  {
    lane: "property_first_review",
    items: [
      "property-first rows",
      "missing seller contact visibility",
      "manual contact cleanup label",
      "outreach remains blocked",
    ],
    governanceRule: "Property-first export rows can be reviewed manually but cannot trigger skip tracing, enrichment, messaging, calling, or seller handling.",
  },
  {
    lane: "missing_field_cleanup_review",
    items: [
      "missing source",
      "missing county",
      "missing parcel/account identifier",
      "missing owner",
      "missing property or mailing address",
    ],
    governanceRule: "Missing-field cleanup remains manual and cannot auto-fix, persist, import, enrich, or lookup missing data.",
  },
  {
    lane: "duplicate_overlap_review",
    items: [
      "duplicate parcel overlap",
      "duplicate account overlap",
      "duplicate property address overlap",
      "duplicate owner/address overlap",
    ],
    governanceRule: "Duplicate and overlap review cannot auto-merge, delete, route, assign, import, or mutate records.",
  },
  {
    lane: "disclaimer_source_confidence_review",
    items: [
      "source confidence label",
      "disclaimer visibility",
      "operator confidence note",
      "no invented property facts",
    ],
    governanceRule: "Disclaimer and source-confidence review must stay explainable and cannot overwrite official-source uncertainty.",
  },
];

export const expectedPublicRecordExportFieldGroups: ExpectedExportFieldGroup[] = [
  "source/provenance",
  "jurisdiction",
  "parcel/account identifiers",
  "owner fields",
  "property address",
  "mailing address",
  "tax/assessment fields",
  "dates/status fields",
  "notes/disclaimers",
];

export const publicRecordsExportManualReviewLabels = [
  "legal export review",
  "provenance needed",
  "field layout review",
  "parcel/account review",
  "property-first cleanup",
  "missing field cleanup",
  "duplicate overlap review",
  "disclaimer review",
];

export const forbiddenExportReviewDrift = [
  "connector",
  "scraping",
  "crawling",
  "live lookup",
  "fetch/network",
  "parser codegen",
  "import execution",
  "lead creation",
  "CRM mutation",
  "persistence",
  "audit writing",
  "outreach",
  "provider activation",
  "skip tracing",
  "enrichment",
  "routing",
  "assignment",
  "queue",
  "reminder",
  "runtime job",
  "property fact invention",
  "spend increase",
  "lead-volume increase",
];

export const publicRecordsExportReviewFindings: PublicRecordsExportReviewFinding[] = [
  {
    question: "Can A2.1 improve export review without runtime drift?",
    category: "required_before_implementation",
    finding: "Yes. The helper defines field groups, labels, lanes, and invariants without connectors, parsers, imports, persistence, live lookups, or automation.",
  },
  {
    question: "Can export review improve ROI now?",
    category: "safe_to_include_now",
    finding: "Yes, by reducing manual research waste for already-downloaded or operator-provided legal exports before increasing spend or lead volume.",
  },
  {
    question: "Should A2.1 replace the universal county lead schema?",
    category: "out_of_scope",
    finding: "No. A2.1 stays narrower and only plans review helper doctrine around export provenance, field layout, and operator scanability.",
  },
  {
    question: "Should A2.1 generate parsers or mappings?",
    category: "future_upgrade",
    finding: "No. Parser generation, schema migration, and import execution require a later approval gate after manual review proves useful.",
  },
  {
    question: "Can source aliases be recognized for future review?",
    category: "optional_optimization",
    finding: "Yes. Parcel/account aliases such as parcel, APN, account number, and tax account number can be listed as human-review signals only.",
  },
];

export function getPublicRecordsExportReviewHelper(): PublicRecordsExportReviewHelper {
  const result: PublicRecordsExportReviewHelper = {
    phase: "A2.1 Public Records Export Review Helper",
    exportReviewReadiness: "planning_only",
    exportReviewLanes: publicRecordsExportReviewLanes,
    expectedFieldGroups: expectedPublicRecordExportFieldGroups,
    manualReviewLabels: publicRecordsExportManualReviewLabels,
    roiDoctrine: [
      "Review downloaded or operator-provided legal exports only.",
      "Improve operator scanability before any importer, parser, or runtime behavior changes.",
      "Reduce manual research waste without increasing acquisition spend.",
      "Preserve source, jurisdiction, date, disclaimer, and provenance visibility.",
      "Do not increase lead volume through automation.",
      "Never invent property facts.",
    ],
    forbiddenExportReviewDrift,
    findings: publicRecordsExportReviewFindings,
    recommendedNextExactStep: "A3 Manual D4D Capture Usability Gate",
    nextStageRecommendation: "A3 Manual D4D Capture Usability Gate",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: publicRecordsExportReviewHelperFlags,
  };

  assertPublicRecordsExportReviewHelperSafe(result);

  return result;
}

export function assertPublicRecordsExportReviewHelperSafe(result: PublicRecordsExportReviewHelper) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A2.1 public records export review helper must remain read-only, advisory-only, and planning-only.");
  }

  if (result.exportReviewReadiness !== "planning_only") {
    throw new Error("A2.1 public records export review helper cannot become execution-ready or live export review readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A2.1 public records export review helper cannot authorize connectors, scraping, crawling, live lookup, fetch/network behavior, parser codegen, schema migration, import execution, lead creation, CRM mutation, CRM automation, providers, outbound messaging, calling, AI voice, skip tracing, enrichment, persistence, audit writing, vector storage, embeddings, runtime jobs, polling, queues, routing, assignments, reminders, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase.");
  }

  if (result.recommendedNextExactStep !== "A3 Manual D4D Capture Usability Gate") {
    throw new Error("A2.1 public records export review helper must recommend A3 Manual D4D Capture Usability Gate next.");
  }

  if (result.nextStageRecommendation !== "A3 Manual D4D Capture Usability Gate") {
    throw new Error("A2.1 public records export review helper must include the next stage recommendation.");
  }
}

export function summarizePublicRecordsExportReviewHelper(result: PublicRecordsExportReviewHelper) {
  assertPublicRecordsExportReviewHelperSafe(result);

  return `${result.phase}: ${result.exportReviewReadiness}. A2.1 plans manual review help for already-downloaded or operator-provided legal public-record exports only. It defines provenance, field layout, parcel/account, owner/address, tax/assessor, property-first, missing-field, duplicate/overlap, disclaimer, and source-confidence review boundaries. No connector, scraping, crawling, live lookup, fetch/network behavior, parser codegen, schema migration, import execution, lead creation, CRM mutation, CRM automation, provider activation, outbound messaging, calling, AI voice, skip tracing, enrichment, persistence, audit writing, vector storage, embeddings, runtime jobs, polling, queues, routing, assignments, reminders, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, property fact invention, spend increase, or lead-volume increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
