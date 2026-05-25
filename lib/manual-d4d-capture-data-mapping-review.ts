export const manualD4dCaptureDataMappingReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  mapperCreated: false,
  mappingImplemented: false,
  storedLeadConstructed: false,
  schemaCreated: false,
  zodSchemaCreated: false,
  validationRuntimeEnabled: false,
  safeParseWired: false,
  storageEnabled: false,
  persistenceEnabled: false,
  localStorageWriteEnabled: false,
  apiWriteEnabled: false,
  apiLeadsPostEnabled: false,
  databaseWriteEnabled: false,
  prismaWriteEnabled: false,
  leadCreationEnabled: false,
  manualCaptureCreatesRecord: false,
  crmMutationEnabled: false,
  auditWritingEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  gpsTrackingEnabled: false,
  mapEnabled: false,
  runtimeJobsEnabled: false,
  queueSystemEnabled: false,
  assignmentEnabled: false,
  automationEnabled: false,
  approvalGrantsExecution: false,
  propertyFactsInvented: false,
} as const;

export type ManualD4dDataMappingReviewStatus =
  | "planning_only"
  | "mapping_review_required"
  | "blocked_until_mapping_evidence";

export type ManualD4dMappingDecision = "not_authorized";

export type ManualD4dDataMappingLaneKey =
  | "draft_field_inventory"
  | "stored_lead_required_field_gaps"
  | "source_provenance_mapping"
  | "property_address_city_state_zip_mapping"
  | "field_note_to_situation_details_risk"
  | "distress_tag_mapping_risk"
  | "missing_seller_contact_blocker"
  | "property_first_blocker"
  | "duplicate_review_blocker"
  | "no_mapper_no_schema_no_write_boundary";

export type ManualD4dDataMappingLane = {
  lane: ManualD4dDataMappingLaneKey;
  items: string[];
  governanceRule: string;
};

export type ManualD4dCaptureDataMappingReview = {
  phase: "A3.9 Manual D4D Capture Data Mapping Review";
  manualD4dDataMappingReviewStatus: ManualD4dDataMappingReviewStatus;
  mappingDecision: ManualD4dMappingDecision;
  dataMappingLanes: ManualD4dDataMappingLane[];
  dataMappingDoctrine: string[];
  forbiddenDataMappingDrift: string[];
  recommendedNextExactStep: "A3.10 Manual D4D Capture ROI Stop/Go Review";
  nextStageRecommendation: "A3.10 Manual D4D Capture ROI Stop/Go Review";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCaptureDataMappingReviewFlags;
};

export const manualD4dDataMappingLanes: ManualD4dDataMappingLane[] = [
  {
    lane: "draft_field_inventory",
    items: [
      "property address",
      "city",
      "state",
      "ZIP",
      "source",
      "observation date",
      "field note",
      "optional distress tags",
      "operator note",
      "review status",
      "provenance note",
    ],
    governanceRule: "Draft field inventory is descriptive only and cannot become a mapper, validator, save flow, or lead creation path.",
  },
  {
    lane: "stored_lead_required_field_gaps",
    items: [
      "firstName missing",
      "lastName missing",
      "email missing",
      "phone missing",
      "ownerName missing",
      "mailingAddress missing",
      "county/parcelId missing",
      "status and scoring fields require future review",
    ],
    governanceRule: "StoredLead gaps must remain visible; A3.9 cannot construct a StoredLead object or fill missing seller/contact fields.",
  },
  {
    lane: "source_provenance_mapping",
    items: ["manual D4D source label", "provenance note", "observation date", "no hidden source inference"],
    governanceRule: "Source and provenance mapping must preserve visibility and cannot infer, hide, overwrite, or persist source data.",
  },
  {
    lane: "property_address_city_state_zip_mapping",
    items: ["propertyAddress candidate", "city candidate", "state candidate", "zipCode candidate", "no address enrichment"],
    governanceRule: "Address field mapping is a future review question only and cannot normalize, enrich, geocode, save, or create records.",
  },
  {
    lane: "field_note_to_situation_details_risk",
    items: ["field note may resemble situationDetails", "operator note may resemble notes", "no invented property facts"],
    governanceRule: "Notes cannot be transformed into seller situation, valuation, motivation, or property facts without human review.",
  },
  {
    lane: "distress_tag_mapping_risk",
    items: ["optional distress tags", "human verification required", "distressFlags mismatch", "no automated distress inference"],
    governanceRule: "Distress tags cannot map to distressFlags, score, priority, opportunity score, or offer guidance in A3.9.",
  },
  {
    lane: "missing_seller_contact_blocker",
    items: ["missing phone", "missing email", "missing seller name", "missing owner context"],
    governanceRule: "Missing seller/contact data blocks lead readiness and cannot trigger lookup, skip tracing, enrichment, or outreach.",
  },
  {
    lane: "property_first_blocker",
    items: ["property-first draft", "contact cleanup required", "seller context missing", "outreach blocked"],
    governanceRule: "Property-first mapping cannot become seller handling, provider activation, messaging, calling, or lead readiness.",
  },
  {
    lane: "duplicate_review_blocker",
    items: ["duplicate property review", "near-duplicate property review", "manual overlap review"],
    governanceRule: "Duplicate review cannot merge, delete, persist, mutate, create, or promote records.",
  },
  {
    lane: "no_mapper_no_schema_no_write_boundary",
    items: ["no conversion function", "no schema", "no runtime validation", "no storage", "no /api/leads", "no Prisma"],
    governanceRule: "A3.9 cannot create mappers, schemas, validators, API calls, persistence, database writes, or lead creation.",
  },
];

export const manualD4dDataMappingDoctrine = [
  "A3.9 may describe mapping questions only.",
  "Mapping decision remains not_authorized.",
  "No conversion function is created.",
  "No StoredLead object is constructed.",
  "No draft field completion can imply lead readiness.",
  "No schema or runtime validator is created.",
  "No persistence, localStorage, /api/leads, Prisma, or database write is authorized.",
  "Source/provenance and blocker visibility must be preserved before any future mapping work.",
  "Mapping cannot invent property facts.",
  "ROI remains protected by reviewing gaps before implementation spend.",
];

export const forbiddenManualD4dDataMappingDrift = [
  "mapper creation",
  "mapping implementation",
  "StoredLead construction",
  "schema creation",
  "Zod schema creation",
  "runtime validation",
  "safeParse wiring",
  "storage",
  "persistence",
  "localStorage writes",
  "/api/leads calls",
  "database writes",
  "Prisma writes",
  "lead creation",
  "manual capture record creation",
  "CRM mutation",
  "audit writing",
  "provider activation",
  "outreach",
  "maps/GPS",
  "runtime jobs",
  "queues",
  "assignments",
  "automation",
  "approval-as-execution",
  "property fact invention",
];

export function getManualD4dCaptureDataMappingReview(): ManualD4dCaptureDataMappingReview {
  const result: ManualD4dCaptureDataMappingReview = {
    phase: "A3.9 Manual D4D Capture Data Mapping Review",
    manualD4dDataMappingReviewStatus: "planning_only",
    mappingDecision: "not_authorized",
    dataMappingLanes: manualD4dDataMappingLanes,
    dataMappingDoctrine: manualD4dDataMappingDoctrine,
    forbiddenDataMappingDrift: forbiddenManualD4dDataMappingDrift,
    recommendedNextExactStep: "A3.10 Manual D4D Capture ROI Stop/Go Review",
    nextStageRecommendation: "A3.10 Manual D4D Capture ROI Stop/Go Review",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCaptureDataMappingReviewFlags,
  };

  assertManualD4dCaptureDataMappingReviewSafe(result);

  return result;
}

export function assertManualD4dCaptureDataMappingReviewSafe(result: ManualD4dCaptureDataMappingReview) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.9 manual D4D capture data mapping review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dDataMappingReviewStatus !== "planning_only") {
    throw new Error("A3.9 manual D4D capture data mapping review cannot become mapping-ready, implementation-ready, or execution-ready.");
  }

  if (result.mappingDecision !== "not_authorized") {
    throw new Error("A3.9 manual D4D capture data mapping decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.9 manual D4D capture data mapping review cannot authorize mappers, schemas, validators, storage, API/database writes, lead creation, CRM mutation, providers, outreach, runtime work, approval-as-execution, or property fact invention.");
  }

  if (result.recommendedNextExactStep !== "A3.10 Manual D4D Capture ROI Stop/Go Review") {
    throw new Error("A3.9 manual D4D capture data mapping review must recommend A3.10 Manual D4D Capture ROI Stop/Go Review next.");
  }

  if (result.nextStageRecommendation !== "A3.10 Manual D4D Capture ROI Stop/Go Review") {
    throw new Error("A3.9 manual D4D capture data mapping review must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCaptureDataMappingReview(result: ManualD4dCaptureDataMappingReview) {
  assertManualD4dCaptureDataMappingReviewSafe(result);

  return `${result.phase}: ${result.manualD4dDataMappingReviewStatus}. Mapping decision is ${result.mappingDecision}. A3.9 describes draft-to-lead mapping questions only. It authorizes no mapper, no conversion function, no StoredLead construction, no schema, no Zod schema, no runtime validation, no persistence, no localStorage writes, no /api/leads calls, no Prisma or database writes, no lead creation, no CRM mutation, no audit writing, no providers, no outreach, no maps/GPS, no runtime jobs, no queues, no assignments, no automation, no approval-as-execution, and no property fact invention. Next stage: ${result.nextStageRecommendation}.`;
}
