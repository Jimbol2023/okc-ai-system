export const manualD4dCapturePersistenceLeadCreationGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  persistenceAuthorized: false,
  persistenceEnabled: false,
  localStorageWriteEnabled: false,
  legacyLeadsStorageWriteEnabled: false,
  apiWriteEnabled: false,
  apiLeadsPostEnabled: false,
  databaseWriteEnabled: false,
  prismaWriteEnabled: false,
  schemaCreated: false,
  zodSchemaCreated: false,
  routeChanged: false,
  saveEnabled: false,
  formSubmitEnabled: false,
  leadCreationEnabled: false,
  manualCaptureCreatesRecord: false,
  crmMutationEnabled: false,
  auditWritingEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  outreachEnabled: false,
  gpsTrackingEnabled: false,
  mapEnabled: false,
  routePlanningEnabled: false,
  queueSystemEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  automationEnabled: false,
  approvalGrantsExecution: false,
  propertyFactsInvented: false,
} as const;

export type ManualD4dPersistenceLeadCreationGateStatus =
  | "planning_only"
  | "persistence_review_required"
  | "blocked_until_operator_approval";

export type ManualD4dPersistenceDecision = "not_authorized";
export type ManualD4dLeadCreationDecision = "not_authorized";

export type ManualD4dPersistenceLeadCreationGateLaneKey =
  | "local_draft_state_review"
  | "legacy_localstorage_boundary"
  | "database_api_lead_creation_boundary"
  | "stored_lead_field_mapping_risk"
  | "source_provenance_requirement"
  | "duplicate_property_first_blocker_review"
  | "missing_owner_contact_blocker_review"
  | "audit_write_boundary"
  | "approval_separation"
  | "a3_9_data_mapping_readiness";

export type ManualD4dPersistenceLeadCreationGateLane = {
  lane: ManualD4dPersistenceLeadCreationGateLaneKey;
  items: string[];
  governanceRule: string;
};

export type ManualD4dCapturePersistenceLeadCreationGate = {
  phase: "A3.8 Manual D4D Capture Persistence And Lead Creation Gate";
  manualD4dPersistenceLeadCreationGateStatus: ManualD4dPersistenceLeadCreationGateStatus;
  persistenceDecision: ManualD4dPersistenceDecision;
  leadCreationDecision: ManualD4dLeadCreationDecision;
  gateLanes: ManualD4dPersistenceLeadCreationGateLane[];
  persistenceLeadCreationDoctrine: string[];
  forbiddenPersistenceLeadCreationDrift: string[];
  recommendedNextExactStep: "A3.9 Manual D4D Capture Data Mapping Review";
  nextStageRecommendation: "A3.9 Manual D4D Capture Data Mapping Review";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCapturePersistenceLeadCreationGateFlags;
};

export const manualD4dPersistenceLeadCreationGateLanes: ManualD4dPersistenceLeadCreationGateLane[] = [
  {
    lane: "local_draft_state_review",
    items: ["A3.6 local React state", "screen-only draft preview", "no write target selected"],
    governanceRule: "Local draft state can be reviewed for future mapping questions only and cannot become storage or lead creation.",
  },
  {
    lane: "legacy_localstorage_boundary",
    items: ["legacy leads-storage risk", "localStorage write boundary", "OKC_WHOLESALE_LEADS_KEY remains off-limits"],
    governanceRule: "A3.8 cannot write to leads-storage, localStorage, browser storage, or any legacy lead store.",
  },
  {
    lane: "database_api_lead_creation_boundary",
    items: ["/api/leads POST boundary", "Prisma/database write boundary", "lead creation remains blocked"],
    governanceRule: "A3.8 cannot call /api/leads, create Prisma records, write database rows, or create leads.",
  },
  {
    lane: "stored_lead_field_mapping_risk",
    items: ["StoredLead mapping gap", "property-first draft mismatch", "missing seller/contact fields", "distress tags need mapping review"],
    governanceRule: "StoredLead field mapping is a future A3.9 review topic and cannot be inferred or implemented in this gate.",
  },
  {
    lane: "source_provenance_requirement",
    items: ["manual D4D source must remain visible", "provenance note required", "no hidden source inference"],
    governanceRule: "Source and provenance must be preserved before any future data mapping or lead creation can be considered.",
  },
  {
    lane: "duplicate_property_first_blocker_review",
    items: ["duplicate blocker", "property-first blocker", "manual overlap review", "no bypass by draft completion"],
    governanceRule: "Duplicate and property-first blockers cannot be bypassed by review status, completed draft fields, or future mapping.",
  },
  {
    lane: "missing_owner_contact_blocker_review",
    items: ["missing owner blocker", "missing phone/email blocker", "missing seller context blocker"],
    governanceRule: "Missing owner/contact blockers cannot trigger lookup, skip tracing, outreach, enrichment, or lead creation.",
  },
  {
    lane: "audit_write_boundary",
    items: ["no audit writing", "no persistence log", "no review-history write", "future audit questions only"],
    governanceRule: "A3.8 can name future audit needs but cannot write audit records, review history, or persistence logs.",
  },
  {
    lane: "approval_separation",
    items: ["approval remains separate", "gate does not grant execution", "draft completion is not approval"],
    governanceRule: "Approval cannot grant save, persistence, lead creation, CRM mutation, provider activation, or execution authority.",
  },
  {
    lane: "a3_9_data_mapping_readiness",
    items: ["A3.9 data mapping review", "field mapping questions", "blocked write targets", "manual evidence needed"],
    governanceRule: "A3.8 may recommend A3.9 data mapping review only; it cannot authorize mapping implementation or writes.",
  },
];

export const manualD4dPersistenceLeadCreationDoctrine = [
  "A3.8 is contract-only.",
  "Persistence decision remains not_authorized.",
  "Lead creation decision remains not_authorized.",
  "A3.8 may identify future data-mapping questions only.",
  "No writes are authorized to leads-storage.",
  "No writes are authorized to localStorage.",
  "No writes are authorized to /api/leads.",
  "No writes are authorized to Prisma, database, CRM, or any store.",
  "Draft completion cannot equal lead creation.",
  "Source/provenance and blocker visibility must be preserved before future mapping work.",
];

export const forbiddenManualD4dPersistenceLeadCreationDrift = [
  "persistence",
  "localStorage writes",
  "leads-storage writes",
  "/api/leads calls",
  "database writes",
  "Prisma writes",
  "schema creation",
  "Zod schema creation",
  "route changes",
  "save behavior",
  "form submit",
  "lead creation",
  "manual capture record creation",
  "CRM mutation",
  "audit writing",
  "provider activation",
  "outreach",
  "maps/GPS",
  "queues",
  "assignments",
  "reminders",
  "runtime jobs",
  "automation",
  "approval-as-execution",
  "property fact invention",
];

export function getManualD4dCapturePersistenceLeadCreationGate(): ManualD4dCapturePersistenceLeadCreationGate {
  const result: ManualD4dCapturePersistenceLeadCreationGate = {
    phase: "A3.8 Manual D4D Capture Persistence And Lead Creation Gate",
    manualD4dPersistenceLeadCreationGateStatus: "planning_only",
    persistenceDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    gateLanes: manualD4dPersistenceLeadCreationGateLanes,
    persistenceLeadCreationDoctrine: manualD4dPersistenceLeadCreationDoctrine,
    forbiddenPersistenceLeadCreationDrift: forbiddenManualD4dPersistenceLeadCreationDrift,
    recommendedNextExactStep: "A3.9 Manual D4D Capture Data Mapping Review",
    nextStageRecommendation: "A3.9 Manual D4D Capture Data Mapping Review",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCapturePersistenceLeadCreationGateFlags,
  };

  assertManualD4dCapturePersistenceLeadCreationGateSafe(result);

  return result;
}

export function assertManualD4dCapturePersistenceLeadCreationGateSafe(
  result: ManualD4dCapturePersistenceLeadCreationGate,
) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.8 manual D4D persistence and lead creation gate must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dPersistenceLeadCreationGateStatus !== "planning_only") {
    throw new Error("A3.8 manual D4D persistence and lead creation gate cannot become persistence-ready, lead-creation-ready, or execution-ready.");
  }

  if (result.persistenceDecision !== "not_authorized") {
    throw new Error("A3.8 manual D4D persistence decision must remain not_authorized.");
  }

  if (result.leadCreationDecision !== "not_authorized") {
    throw new Error("A3.8 manual D4D lead creation decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.8 manual D4D persistence and lead creation gate cannot authorize writes, storage, APIs, database access, schemas, routes, lead creation, CRM mutation, providers, outreach, runtime work, approval-as-execution, or property fact invention.");
  }

  if (result.recommendedNextExactStep !== "A3.9 Manual D4D Capture Data Mapping Review") {
    throw new Error("A3.8 manual D4D persistence and lead creation gate must recommend A3.9 Manual D4D Capture Data Mapping Review next.");
  }

  if (result.nextStageRecommendation !== "A3.9 Manual D4D Capture Data Mapping Review") {
    throw new Error("A3.8 manual D4D persistence and lead creation gate must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCapturePersistenceLeadCreationGate(
  result: ManualD4dCapturePersistenceLeadCreationGate,
) {
  assertManualD4dCapturePersistenceLeadCreationGateSafe(result);

  return `${result.phase}: ${result.manualD4dPersistenceLeadCreationGateStatus}. Persistence decision is ${result.persistenceDecision}; lead creation decision is ${result.leadCreationDecision}. A3.8 may identify future data-mapping questions only. It authorizes no persistence, no localStorage writes, no leads-storage writes, no /api/leads calls, no Prisma or database writes, no lead creation, no CRM mutation, no audit writing, no providers, no outreach, no maps/GPS, no queues, no assignments, no reminders, no runtime jobs, no automation, no approval-as-execution, and no property fact invention. Next stage: ${result.nextStageRecommendation}.`;
}
