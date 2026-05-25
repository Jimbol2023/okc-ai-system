export const publicRecordsIntakePlanningGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  publicRecordConnectorActivated: false,
  scrapingEnabled: false,
  crawlingEnabled: false,
  liveCountyLookupEnabled: false,
  fetchNetworkEnabled: false,
  mlsAccessEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  crmMutationEnabled: false,
  crmAutomationEnabled: false,
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
  leadCreationEnabled: false,
  importExecutionEnabled: false,
  propertyFactsInvented: false,
  leadVolumeAutomationEnabled: false,
  spendIncreaseAuthorized: false,
} as const;

export type PublicRecordsIntakeReadiness =
  | "planning_only"
  | "needs_legal_export_review"
  | "blocked_until_export_evidence";

export type PublicRecordExportSource =
  | "county assessor exports"
  | "county treasurer/tax exports"
  | "county clerk/legal exports"
  | "downloaded public-list spreadsheets"
  | "operator-provided manual exports";

export type PublicRecordRequiredEvidence =
  | "source name"
  | "county"
  | "state"
  | "download/export date"
  | "source URL or office"
  | "legal/public-record basis"
  | "field layout notes"
  | "disclaimer visibility"
  | "operator provenance note";

export type PublicRecordIntakeLaneKey =
  | "legal_export_provenance"
  | "county_assessor_tax_field_readiness"
  | "property_first_intake_handling"
  | "source_confidence_and_disclaimer_visibility"
  | "missing_field_manual_cleanup_planning"
  | "duplicate_export_overlap_review"
  | "no_connector_no_scraping_boundary"
  | "a2_1_export_review_readiness";

export type PublicRecordIntakeLane = {
  lane: PublicRecordIntakeLaneKey;
  items: string[];
  governanceRule: string;
};

export type PublicRecordsFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type PublicRecordsIntakeFinding = {
  question: string;
  category: PublicRecordsFindingCategory;
  finding: string;
};

export type PublicRecordsIntakePlanningGate = {
  phase: "A2 Read-Only Public Records Intake Planning Gate";
  publicRecordsIntakeReadiness: PublicRecordsIntakeReadiness;
  allowedExportSources: PublicRecordExportSource[];
  requiredExportEvidence: PublicRecordRequiredEvidence[];
  publicRecordIntakeLanes: PublicRecordIntakeLane[];
  roiDoctrine: string[];
  forbiddenPublicRecordDrift: string[];
  findings: PublicRecordsIntakeFinding[];
  recommendedNextExactStep: "A2.1 Public Records Export Review Helper";
  nextStageRecommendation: "A2.1 Public Records Export Review Helper";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof publicRecordsIntakePlanningGateFlags;
};

export const allowedPublicRecordExportSources: PublicRecordExportSource[] = [
  "county assessor exports",
  "county treasurer/tax exports",
  "county clerk/legal exports",
  "downloaded public-list spreadsheets",
  "operator-provided manual exports",
];

export const requiredPublicRecordExportEvidence: PublicRecordRequiredEvidence[] = [
  "source name",
  "county",
  "state",
  "download/export date",
  "source URL or office",
  "legal/public-record basis",
  "field layout notes",
  "disclaimer visibility",
  "operator provenance note",
];

export const publicRecordIntakeLanes: PublicRecordIntakeLane[] = [
  {
    lane: "legal_export_provenance",
    items: [
      "official source name",
      "county and state",
      "download/export date",
      "source URL or office",
      "operator provenance note",
    ],
    governanceRule: "Public-record intake planning requires visible provenance before any future export review.",
  },
  {
    lane: "county_assessor_tax_field_readiness",
    items: [
      "parcel/account number readiness",
      "owner name readiness",
      "property address readiness",
      "mailing address readiness",
      "tax or assessor field layout notes",
    ],
    governanceRule: "County, assessor, and tax fields are planned for manual export review only and cannot trigger live lookup or enrichment.",
  },
  {
    lane: "property_first_intake_handling",
    items: [
      "property-first classification",
      "missing contact visibility",
      "manual contact cleanup requirement",
      "outreach blocked status",
    ],
    governanceRule: "Property-first public-record rows remain manual review records and cannot authorize seller contact.",
  },
  {
    lane: "source_confidence_and_disclaimer_visibility",
    items: [
      "source confidence label",
      "disclaimer visibility",
      "legal/public-record basis",
      "no invented property facts",
    ],
    governanceRule: "Source confidence must show disclaimers and cannot invent, infer, or overwrite property facts.",
  },
  {
    lane: "missing_field_manual_cleanup_planning",
    items: [
      "missing owner field visibility",
      "missing address field visibility",
      "missing parcel field visibility",
      "manual cleanup label",
    ],
    governanceRule: "Missing public-record fields require human cleanup and cannot trigger scraping, skip tracing, or enrichment.",
  },
  {
    lane: "duplicate_export_overlap_review",
    items: [
      "duplicate parcel overlap",
      "duplicate property address overlap",
      "duplicate owner/address overlap",
      "manual overlap review",
    ],
    governanceRule: "Duplicate/export overlap review cannot merge, delete, import, route, assign, or mutate records automatically.",
  },
  {
    lane: "no_connector_no_scraping_boundary",
    items: [
      "no public-record connectors",
      "no scraping",
      "no crawling",
      "no live county lookup",
      "no fetch/network behavior",
    ],
    governanceRule: "A2 planning forbids live access and only describes already-downloaded or manually provided legal exports.",
  },
  {
    lane: "a2_1_export_review_readiness",
    items: [
      "A2.1 export review helper readiness",
      "legal export evidence complete",
      "manual field review planned",
      "operator review remains required",
    ],
    governanceRule: "A2.1 may be planned only as a read-only export review helper after A2 provenance and safety evidence are clear.",
  },
];

export const forbiddenPublicRecordDrift = [
  "scraping",
  "crawling",
  "live county access",
  "public-record connectors",
  "MLS access",
  "skip tracing",
  "enrichment",
  "provider activation",
  "outbound messaging",
  "CRM automation",
  "persistence",
  "queues",
  "assignments",
  "routing",
  "reminders",
  "runtime jobs",
  "AI-only acquisition",
  "invented property facts",
  "lead creation",
  "import execution",
];

export const publicRecordsIntakeFindings: PublicRecordsIntakeFinding[] = [
  {
    question: "Can public-record intake planning remain read-only?",
    category: "required_before_implementation",
    finding: "Yes. A2 can define legal export provenance, required evidence, and review lanes without connectors, scraping, live lookup, import execution, or persistence.",
  },
  {
    question: "Can public-record exports improve ROI safely?",
    category: "safe_to_include_now",
    finding: "Yes, but only if already-downloaded or manually provided legal exports are a proven operator bottleneck.",
  },
  {
    question: "Can assessor/tax data remain source-bound?",
    category: "required_before_implementation",
    finding: "Yes. The contract should require source name, county/state, date, source office or URL, field layout notes, disclaimer visibility, and provenance notes.",
  },
  {
    question: "Can property facts stay non-invented?",
    category: "required_before_implementation",
    finding: "Yes. A2 must require human review and forbid invented, inferred, or overwritten property facts.",
  },
  {
    question: "Should A2 activate public-record connectors?",
    category: "out_of_scope",
    finding: "No. Connectors, scraping, crawling, live lookup, fetch/network behavior, and MLS access remain forbidden.",
  },
  {
    question: "Should A2 store export reviews now?",
    category: "future_upgrade",
    finding: "No. Persistence, audit writing, and schema changes require later approval after export review proves useful.",
  },
  {
    question: "Can A2.1 be the next ROI-safe step?",
    category: "optional_optimization",
    finding: "Yes. A2.1 should only help review already-downloaded legal exports without live access or automation.",
  },
];

export function getPublicRecordsIntakePlanningGate(): PublicRecordsIntakePlanningGate {
  const result: PublicRecordsIntakePlanningGate = {
    phase: "A2 Read-Only Public Records Intake Planning Gate",
    publicRecordsIntakeReadiness: "planning_only",
    allowedExportSources: allowedPublicRecordExportSources,
    requiredExportEvidence: requiredPublicRecordExportEvidence,
    publicRecordIntakeLanes,
    roiDoctrine: [
      "Proceed only if public-record exports are a proven acquisition bottleneck.",
      "Use already-downloaded or manually provided legal exports only.",
      "Improve manual review quality before increasing lead volume.",
      "Do not increase spend or automate lead volume.",
      "Preserve source, date, disclaimer, and operator provenance visibility.",
      "Never invent property facts.",
    ],
    forbiddenPublicRecordDrift,
    findings: publicRecordsIntakeFindings,
    recommendedNextExactStep: "A2.1 Public Records Export Review Helper",
    nextStageRecommendation: "A2.1 Public Records Export Review Helper",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: publicRecordsIntakePlanningGateFlags,
  };

  assertPublicRecordsIntakePlanningGateSafe(result);

  return result;
}

export function assertPublicRecordsIntakePlanningGateSafe(result: PublicRecordsIntakePlanningGate) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A2 public records intake planning gate must remain read-only, advisory-only, and planning-only.");
  }

  if (result.publicRecordsIntakeReadiness !== "planning_only") {
    throw new Error("A2 public records intake planning gate cannot become live public-record intake readiness.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A2 public records intake planning gate cannot authorize connectors, scraping, crawling, live county lookup, fetch/network behavior, MLS access, skip tracing, enrichment, providers, outbound messaging, CRM mutation, persistence, audit writing, vector storage, embeddings, runtime jobs, polling, queues, routing, assignments, reminders, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, lead creation, import execution, property fact invention, lead volume automation, or spend increase.");
  }

  if (result.recommendedNextExactStep !== "A2.1 Public Records Export Review Helper") {
    throw new Error("A2 public records intake planning gate must recommend A2.1 Public Records Export Review Helper next.");
  }

  if (result.nextStageRecommendation !== "A2.1 Public Records Export Review Helper") {
    throw new Error("A2 public records intake planning gate must include the next stage recommendation.");
  }
}

export function summarizePublicRecordsIntakePlanningGate(result: PublicRecordsIntakePlanningGate) {
  assertPublicRecordsIntakePlanningGateSafe(result);

  return `${result.phase}: ${result.publicRecordsIntakeReadiness}. A2 plans manual review of already-downloaded or operator-provided legal public-record exports only when exports are a proven bottleneck. Required evidence includes source, county/state, date, source office or URL, legal basis, layout notes, disclaimer visibility, and operator provenance. No connectors, scraping, crawling, live county lookup, fetch/network behavior, MLS access, skip tracing, enrichment, providers, outbound messaging, CRM automation, persistence, audit writing, runtime jobs, queues, routing, assignments, reminders, autonomous acquisition, autonomous outreach, autonomous seller handling, approval-as-execution, lead creation, import execution, property fact invention, lead volume automation, or spend increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
