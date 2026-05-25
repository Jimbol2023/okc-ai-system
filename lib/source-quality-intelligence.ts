export const sourceQualityIntelligenceFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousAcquisitionEnabled: false,
  autonomousSellerHandlingEnabled: false,
  scrapingExpansionEnabled: false,
  publicRecordConnectorsEnabled: false,
  crmAutomationEnabled: false,
  runtimeAcquisitionJobsEnabled: false,
  sourceScoringPersisted: false,
  acquisitionQueueCreated: false,
  acquisitionAssignmentCreated: false,
  acquisitionRoutingCreated: false,
  acquisitionReminderCreated: false,
  vectorDatabaseEnabled: false,
  embeddingsEnabled: false,
  externalLookupEnabled: false,
  approvalGrantsExecution: false,
  acquisitionExecutionAuthorized: false,
  sourceQualityCreatesLeads: false,
  sourceQualityMutatesRecords: false,
  sourceQualityIncreasesSpend: false,
} as const;

export type SourceQualityReadiness =
  | "planning_only"
  | "needs_operator_review"
  | "blocked_until_manual_evidence";

export type SourceQualitySignal =
  | "cleanup_burden"
  | "property_first_rate"
  | "duplicate_rate"
  | "source_confidence"
  | "review_ready_rate"
  | "missing_data_rate"
  | "operator_friction"
  | "review_completion_rate"
  | "source_level_readiness_quality"
  | "acquisition_usability";

export type SourceQualityLaneKey =
  | "source_attribution_quality"
  | "review_ready_density"
  | "cleanup_burden"
  | "property_first_burden"
  | "duplicate_burden"
  | "missing_data_burden"
  | "operator_friction"
  | "acquisition_usability";

export type SourceQualityLane = {
  lane: SourceQualityLaneKey;
  signals: SourceQualitySignal[];
  existingInputs: string[];
  governanceRule: string;
};

export type SourceQualityFindingCategory =
  | "required_before_implementation"
  | "safe_to_include_now"
  | "future_upgrade"
  | "optional_optimization"
  | "out_of_scope";

export type SourceQualityFinding = {
  question: string;
  category: SourceQualityFindingCategory;
  finding: string;
};

export type SourceQualityIntelligence = {
  phase: "A1.4 Source Quality Intelligence";
  sourceQualityReadiness: SourceQualityReadiness;
  sourceQualitySignals: SourceQualitySignal[];
  sourceQualityLanes: SourceQualityLane[];
  roiDoctrine: string[];
  forbiddenSourceQualityDrift: string[];
  existingReviewInputs: string[];
  findings: SourceQualityFinding[];
  recommendedNextExactStep: "A1.5 Duplicate And Cleanup Review Practicalization";
  nextStageRecommendation: "A1.5 Duplicate And Cleanup Review Practicalization";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof sourceQualityIntelligenceFlags;
};

export const sourceQualitySignals: SourceQualitySignal[] = [
  "cleanup_burden",
  "property_first_rate",
  "duplicate_rate",
  "source_confidence",
  "review_ready_rate",
  "missing_data_rate",
  "operator_friction",
  "review_completion_rate",
  "source_level_readiness_quality",
  "acquisition_usability",
];

export const existingSourceQualityReviewInputs = [
  "ready rows",
  "property-first rows",
  "duplicate rows",
  "missing source rows",
  "missing contact rows",
  "missing address rows",
  "source mix",
  "source clarity",
  "cleanup needs",
  "import confidence",
];

export const sourceQualityLanes: SourceQualityLane[] = [
  {
    lane: "source_attribution_quality",
    signals: ["source_confidence", "source_level_readiness_quality"],
    existingInputs: ["source mix", "source clarity", "missing source rows", "import confidence"],
    governanceRule: "Source attribution quality uses existing preview/review fields only and cannot activate external lookup or scoring persistence.",
  },
  {
    lane: "review_ready_density",
    signals: ["review_ready_rate", "review_completion_rate"],
    existingInputs: ["ready rows", "import confidence"],
    governanceRule: "Review-ready density helps estimate manual throughput only and cannot create queues, assignments, routing, or automation.",
  },
  {
    lane: "cleanup_burden",
    signals: ["cleanup_burden", "operator_friction"],
    existingInputs: ["cleanup needs", "missing source rows", "missing address rows"],
    governanceRule: "Cleanup burden identifies operator waste without mutating records, deleting rows, or auto-fixing data.",
  },
  {
    lane: "property_first_burden",
    signals: ["property_first_rate", "missing_data_rate"],
    existingInputs: ["property-first rows", "missing contact rows"],
    governanceRule: "Property-first burden remains manual cleanup intelligence and cannot authorize outreach or contact enrichment.",
  },
  {
    lane: "duplicate_burden",
    signals: ["duplicate_rate", "operator_friction"],
    existingInputs: ["duplicate rows", "cleanup needs"],
    governanceRule: "Duplicate burden is review guidance only and cannot merge, delete, route, or mutate records.",
  },
  {
    lane: "missing_data_burden",
    signals: ["missing_data_rate", "cleanup_burden"],
    existingInputs: ["missing contact rows", "missing address rows", "missing source rows"],
    governanceRule: "Missing-data burden cannot trigger skip tracing, scraping, external lookup, or provider activation.",
  },
  {
    lane: "operator_friction",
    signals: ["operator_friction", "acquisition_usability"],
    existingInputs: ["cleanup needs", "source clarity", "import confidence"],
    governanceRule: "Operator friction may guide the next manual improvement phase but cannot trigger runtime acquisition work.",
  },
  {
    lane: "acquisition_usability",
    signals: ["acquisition_usability", "source_level_readiness_quality"],
    existingInputs: ["ready rows", "source mix", "cleanup needs", "import confidence"],
    governanceRule: "Acquisition usability stays advisory and does not increase lead spend, outreach volume, or communication readiness.",
  },
];

export const sourceQualityFindings: SourceQualityFinding[] = [
  {
    question: "Can source quality intelligence improve ROI without scaling volume?",
    category: "required_before_implementation",
    finding: "Yes. It can reduce operator waste by identifying cleanup burden, review-ready density, source confidence, and usability from existing review data.",
  },
  {
    question: "Can A1.4 use existing import review concepts only?",
    category: "required_before_implementation",
    finding: "Yes. The contract should reference ready rows, property-first rows, duplicates, missing fields, source mix, cleanup needs, and import confidence only.",
  },
  {
    question: "Can source confidence remain non-executing?",
    category: "safe_to_include_now",
    finding: "Yes. Source confidence is advisory only and cannot become persisted scoring, routing, assignment, outreach, or acquisition execution.",
  },
  {
    question: "Can property-first and missing-data rates remain safe?",
    category: "safe_to_include_now",
    finding: "Yes. They reveal cleanup burden but cannot trigger skip tracing, scraping, enrichment, seller contact, or provider activation.",
  },
  {
    question: "Should source quality metrics be persisted now?",
    category: "future_upgrade",
    finding: "No. Persistence, scoring activation, and analytics storage need a later approval and data-governance review.",
  },
  {
    question: "Should A1.4 add scraping, connectors, or external lookup?",
    category: "out_of_scope",
    finding: "No. A1.4 uses existing data only and does not expand acquisition sources or automate research.",
  },
  {
    question: "Can duplicate and cleanup clarity be the next ROI step?",
    category: "optional_optimization",
    finding: "Yes. A1.5 should practicalize duplicate and cleanup review after source-quality signals clarify operator friction.",
  },
];

export const forbiddenSourceQualityDrift = [
  "autonomous acquisition",
  "autonomous outreach",
  "scraping expansion",
  "provider activation",
  "outbound messaging",
  "CRM automation",
  "persistence",
  "source scoring activation",
  "routing",
  "assignments",
  "queues",
  "reminders",
  "runtime acquisition execution",
  "external lookup",
  "public-record connector activation",
  "lead spend increase",
];

export function getSourceQualityIntelligence(): SourceQualityIntelligence {
  const result: SourceQualityIntelligence = {
    phase: "A1.4 Source Quality Intelligence",
    sourceQualityReadiness: "planning_only",
    sourceQualitySignals,
    sourceQualityLanes,
    roiDoctrine: [
      "Improve quality before volume.",
      "Reduce manual waste before scaling acquisition.",
      "Use existing data only.",
      "Do not increase spend.",
      "Preserve source attribution and operator review.",
      "Keep every source quality output advisory, explainable, and non-executing.",
    ],
    forbiddenSourceQualityDrift,
    existingReviewInputs: existingSourceQualityReviewInputs,
    findings: sourceQualityFindings,
    recommendedNextExactStep: "A1.5 Duplicate And Cleanup Review Practicalization",
    nextStageRecommendation: "A1.5 Duplicate And Cleanup Review Practicalization",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: sourceQualityIntelligenceFlags,
  };

  assertSourceQualityIntelligenceSafe(result);

  return result;
}

export function assertSourceQualityIntelligenceSafe(result: SourceQualityIntelligence) {
  const flags = result.flags;
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A1.4 source quality intelligence must remain read-only, advisory-only, and planning-only.");
  }

  if (result.sourceQualityReadiness !== "planning_only") {
    throw new Error("A1.4 source quality intelligence cannot become execution-ready source scoring.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A1.4 source quality intelligence cannot authorize providers, outbound messaging, autonomous acquisition, autonomous outreach, scraping expansion, public-record connectors, CRM automation, runtime acquisition jobs, source scoring persistence, queues, assignments, routing, reminders, vector storage, embeddings, external lookup, approval-as-execution, record mutation, lead creation, spend increases, or acquisition execution.");
  }

  if (result.recommendedNextExactStep !== "A1.5 Duplicate And Cleanup Review Practicalization") {
    throw new Error("A1.4 source quality intelligence must recommend A1.5 Duplicate And Cleanup Review Practicalization next.");
  }

  if (result.nextStageRecommendation !== "A1.5 Duplicate And Cleanup Review Practicalization") {
    throw new Error("A1.4 source quality intelligence must include the next stage recommendation.");
  }
}

export function summarizeSourceQualityIntelligence(result: SourceQualityIntelligence) {
  assertSourceQualityIntelligenceSafe(result);

  return `${result.phase}: ${result.sourceQualityReadiness}. Source quality improves acquisition quality before volume by reviewing cleanup burden, property-first rate, duplicate rate, source confidence, review-ready rate, missing-data rate, operator friction, review completion rate, source-level readiness quality, and acquisition usability from existing data only. No providers, outbound messaging, autonomous outreach, scraping expansion, CRM automation, runtime acquisition execution, source scoring persistence, queue, routing, assignment, reminder, vector database, embeddings, external lookup, approval-as-execution, record mutation, lead creation, or spend increase is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
