export const acquisitionBottleneckReassessmentFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
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

export type AcquisitionBottleneckReassessmentStatus =
  | "planning_only"
  | "roi_reassessment_required"
  | "blocked_until_operator_evidence";

export type D4dSavePathDecision = "not_authorized";

export type AcquisitionBottleneckReassessmentLaneKey =
  | "d4d_save_path_roi"
  | "import_cleanup_roi"
  | "source_quality_roi"
  | "public_records_review_roi"
  | "referrals_manual_relationship_sourcing_roi"
  | "operator_throughput_roi"
  | "no_write_no_lead_boundary"
  | "acquisition_spend_discipline"
  | "a4_1_selection_readiness";

export type AcquisitionBottleneckReassessmentLane = {
  lane: AcquisitionBottleneckReassessmentLaneKey;
  comparedBottlenecks: string[];
  governanceRule: string;
};

export type AcquisitionBottleneckReassessment = {
  phase: "A4 Acquisition Bottleneck Reassessment";
  acquisitionBottleneckReassessmentStatus: AcquisitionBottleneckReassessmentStatus;
  d4dSavePathDecision: D4dSavePathDecision;
  reassessmentLanes: AcquisitionBottleneckReassessmentLane[];
  roiDoctrine: string[];
  forbiddenBottleneckReassessmentDrift: string[];
  recommendedNextExactStep: "A4.1 Cheapest Bottleneck Reducer Selection";
  nextStageRecommendation: "A4.1 Cheapest Bottleneck Reducer Selection";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof acquisitionBottleneckReassessmentFlags;
};

export const acquisitionBottleneckReassessmentLanes: AcquisitionBottleneckReassessmentLane[] = [
  {
    lane: "d4d_save_path_roi",
    comparedBottlenecks: ["manual D4D save path", "UI-only draft", "mapping gaps", "write-risk review"],
    governanceRule: "D4D save work remains blocked unless operator evidence proves it beats cheaper acquisition bottleneck fixes.",
  },
  {
    lane: "import_cleanup_roi",
    comparedBottlenecks: ["duplicate cleanup", "invalid row review", "missing source cleanup", "unmapped headers"],
    governanceRule: "Import cleanup should be favored when it improves review-ready lead quality with lower cost than new save-path work.",
  },
  {
    lane: "source_quality_roi",
    comparedBottlenecks: ["source confidence", "review-ready rate", "cleanup burden", "operator friction"],
    governanceRule: "Source quality remains a high-ROI candidate because it uses existing import/review data without new spend or automation.",
  },
  {
    lane: "public_records_review_roi",
    comparedBottlenecks: ["legal public-record exports", "county/tax/assessor review", "provenance checks", "field-layout review"],
    governanceRule: "Public-record review may continue only as manual review of already obtained legal exports, without connectors or scraping.",
  },
  {
    lane: "referrals_manual_relationship_sourcing_roi",
    comparedBottlenecks: ["referrals", "manual relationship sourcing", "operator notes", "source attribution"],
    governanceRule: "Referral and relationship sourcing should remain manual and source-tracked before any automated acquisition expansion.",
  },
  {
    lane: "operator_throughput_roi",
    comparedBottlenecks: ["manual review speed", "blocker clarity", "scanability", "review completion"],
    governanceRule: "Operator throughput improvements should win when they reduce manual waste without increasing lead volume or communication volume.",
  },
  {
    lane: "no_write_no_lead_boundary",
    comparedBottlenecks: ["D4D save path", "lead creation", "CRM mutation", "storage"],
    governanceRule: "A4 cannot authorize writes, lead creation, persistence, CRM mutation, schemas, APIs, or mappers.",
  },
  {
    lane: "acquisition_spend_discipline",
    comparedBottlenecks: ["no spend increase", "no volume scaling", "no paid enrichment", "no provider activation"],
    governanceRule: "ROI priority must favor the cheapest bottleneck reducer that improves review-ready quality without spend growth.",
  },
  {
    lane: "a4_1_selection_readiness",
    comparedBottlenecks: ["import cleanup", "source quality", "public records", "referrals", "operator throughput", "D4D save path"],
    governanceRule: "A4.1 should select the cheapest highest-return bottleneck reducer before any implementation gate.",
  },
];

export const acquisitionBottleneckRoiDoctrine = [
  "A4 decides priority only; it does not implement anything.",
  "D4D save work remains blocked until it beats cheaper bottleneck fixes.",
  "No save path, persistence, APIs, schemas, mappers, lead creation, CRM mutation, outreach, providers, maps/GPS, scraping, queues, assignments, reminders, or automation is authorized.",
  "ROI priority should favor the cheapest bottleneck reducer that improves review-ready lead quality without increasing spend or communication volume.",
  "Import cleanup, source quality, public-record review, referrals, and operator throughput must be compared before save-path work proceeds.",
  "Every future acquisition improvement must preserve source attribution and avoid invented property facts.",
];

export const forbiddenAcquisitionBottleneckReassessmentDrift = [
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

export function getAcquisitionBottleneckReassessment(): AcquisitionBottleneckReassessment {
  const result: AcquisitionBottleneckReassessment = {
    phase: "A4 Acquisition Bottleneck Reassessment",
    acquisitionBottleneckReassessmentStatus: "planning_only",
    d4dSavePathDecision: "not_authorized",
    reassessmentLanes: acquisitionBottleneckReassessmentLanes,
    roiDoctrine: acquisitionBottleneckRoiDoctrine,
    forbiddenBottleneckReassessmentDrift: forbiddenAcquisitionBottleneckReassessmentDrift,
    recommendedNextExactStep: "A4.1 Cheapest Bottleneck Reducer Selection",
    nextStageRecommendation: "A4.1 Cheapest Bottleneck Reducer Selection",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: acquisitionBottleneckReassessmentFlags,
  };

  assertAcquisitionBottleneckReassessmentSafe(result);

  return result;
}

export function assertAcquisitionBottleneckReassessmentSafe(result: AcquisitionBottleneckReassessment) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A4 acquisition bottleneck reassessment must remain read-only, advisory-only, and planning-only.");
  }

  if (result.acquisitionBottleneckReassessmentStatus !== "planning_only") {
    throw new Error("A4 acquisition bottleneck reassessment cannot become implementation-ready, write-ready, or execution-ready.");
  }

  if (result.d4dSavePathDecision !== "not_authorized") {
    throw new Error("A4 D4D save path decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A4 acquisition bottleneck reassessment cannot authorize writes, leads, providers, runtime work, automation, scraping, spend increases, approval-as-execution, or property fact drift.");
  }

  if (result.recommendedNextExactStep !== "A4.1 Cheapest Bottleneck Reducer Selection") {
    throw new Error("A4 acquisition bottleneck reassessment must recommend A4.1 Cheapest Bottleneck Reducer Selection next.");
  }

  if (result.nextStageRecommendation !== "A4.1 Cheapest Bottleneck Reducer Selection") {
    throw new Error("A4 acquisition bottleneck reassessment must include the next stage recommendation.");
  }
}

export function summarizeAcquisitionBottleneckReassessment(result: AcquisitionBottleneckReassessment) {
  assertAcquisitionBottleneckReassessmentSafe(result);

  return `${result.phase}: ${result.acquisitionBottleneckReassessmentStatus}. D4D save path decision is ${result.d4dSavePathDecision}. A4 compares D4D save work against import cleanup, source quality, public-record review, referrals/manual relationship sourcing, and operator throughput so the cheapest highest-return bottleneck reducer can be selected. No implementation, save path, persistence, API route, /api/leads write, schema, Zod schema, mapper, runtime validation, storage, Prisma or database write, lead creation, CRM mutation, provider activation, outreach, maps/GPS, scraping, public-record connector, external lookup, skip tracing, queue, routing, assignment, reminder, automation, spend increase, communication volume increase, approval-as-execution, acquisition execution, or property fact invention is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
