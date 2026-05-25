export const manualD4dCaptureRoiStopGoReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  limitedUiMvpAllowed: true,
  persistenceEnabled: false,
  localStorageWriteEnabled: false,
  apiWriteEnabled: false,
  apiLeadsPostEnabled: false,
  databaseWriteEnabled: false,
  prismaWriteEnabled: false,
  schemaCreated: false,
  zodSchemaCreated: false,
  validationRuntimeEnabled: false,
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
  routePlanningEnabled: false,
  runtimeJobsEnabled: false,
  queueSystemEnabled: false,
  assignmentEnabled: false,
  reminderSystemEnabled: false,
  automationEnabled: false,
  approvalGrantsExecution: false,
  propertyFactsInvented: false,
  spendIncreaseAuthorized: false,
  leadVolumeAutomationEnabled: false,
} as const;

export type ManualD4dRoiStopGoStatus =
  | "planning_only"
  | "mvp_review_allowed"
  | "stop_until_roi_evidence";

export type LimitedManualCaptureMvpDecision =
  | "allowed_for_ui_only"
  | "not_authorized_for_writes";

export type ManualD4dPersistenceDecision = "not_authorized";
export type ManualD4dLeadCreationDecision = "not_authorized";

export type ManualD4dRoiStopGoLaneKey =
  | "governance_sufficiency_review"
  | "operator_bottleneck_evidence"
  | "cheaper_alternative_comparison"
  | "source_import_cleanup_comparison"
  | "public_records_referral_comparison"
  | "limited_mvp_boundary"
  | "no_write_no_lead_boundary"
  | "property_first_missing_contact_blocker_preservation"
  | "final_implementation_gate_readiness";

export type ManualD4dRoiStopGoLane = {
  lane: ManualD4dRoiStopGoLaneKey;
  items: string[];
  roiRule: string;
};

export type ManualD4dCaptureRoiStopGoReview = {
  phase: "A3.10 Manual D4D Capture ROI Stop/Go Review";
  manualD4dRoiStopGoStatus: ManualD4dRoiStopGoStatus;
  limitedManualCaptureMvpDecision: LimitedManualCaptureMvpDecision;
  persistenceDecision: ManualD4dPersistenceDecision;
  leadCreationDecision: ManualD4dLeadCreationDecision;
  roiStopGoLanes: ManualD4dRoiStopGoLane[];
  decisionDoctrine: string[];
  forbiddenRoiStopGoDrift: string[];
  recommendedNextExactStep: "A3.11 Manual D4D Capture Final Implementation Gate";
  nextStageRecommendation: "A3.11 Manual D4D Capture Final Implementation Gate";
  advisoryOnly: true;
  readOnly: true;
  planningOnly: true;
  flags: typeof manualD4dCaptureRoiStopGoReviewFlags;
};

export const manualD4dRoiStopGoLanes: ManualD4dRoiStopGoLane[] = [
  {
    lane: "governance_sufficiency_review",
    items: [
      "A3.5 implementation gate reviewed",
      "A3.6 UI draft exists",
      "A3.7 accessibility review exists",
      "A3.8 write gate remains closed",
      "A3.9 mapping review remains non-executing",
    ],
    roiRule: "Governance is sufficient for a limited manual UI MVP review only, not persistence, lead creation, or execution.",
  },
  {
    lane: "operator_bottleneck_evidence",
    items: ["manual field capture friction", "operator review speed", "repeat field-observation need"],
    roiRule: "Manual D4D should proceed only if operator evidence shows field capture is the active bottleneck.",
  },
  {
    lane: "cheaper_alternative_comparison",
    items: ["referrals", "operator research", "manual imports", "spreadsheet cleanup"],
    roiRule: "D4D must beat cheaper acquisition fixes before implementation scope expands.",
  },
  {
    lane: "source_import_cleanup_comparison",
    items: ["source quality", "duplicate cleanup", "property-first cleanup", "missing data cleanup"],
    roiRule: "If source/import cleanup removes more operator waste, stop D4D and return to cleanup work.",
  },
  {
    lane: "public_records_referral_comparison",
    items: ["public-record export review", "county/tax/assessor exports", "referral intake", "manual list review"],
    roiRule: "If public records or referrals produce cheaper review-ready leads, D4D should not consume implementation effort.",
  },
  {
    lane: "limited_mvp_boundary",
    items: ["UI-only manual capture", "local screen state", "manual review preview", "no write target"],
    roiRule: "Limited MVP can mean UI-only manual review, but not saves, records, APIs, or CRM mutation.",
  },
  {
    lane: "no_write_no_lead_boundary",
    items: ["persistence remains blocked", "lead creation remains blocked", "localStorage remains blocked", "/api/leads remains blocked"],
    roiRule: "No ROI finding in A3.10 can authorize writes, lead creation, persistence, or API/database work.",
  },
  {
    lane: "property_first_missing_contact_blocker_preservation",
    items: ["property-first blocker", "missing phone/email blocker", "missing owner blocker", "duplicate blocker"],
    roiRule: "Blockers stay visible and cannot be bypassed by draft completion or MVP review.",
  },
  {
    lane: "final_implementation_gate_readiness",
    items: ["A3.11 final implementation gate", "UI-only scope review", "write paths remain future-only"],
    roiRule: "A3.10 may recommend A3.11 only; it cannot directly authorize implementation.",
  },
];

export const manualD4dRoiStopGoDecisionDoctrine = [
  "Governance is sufficient for a limited manual UI MVP only.",
  "Limited manual capture MVP is allowed for UI-only review.",
  "Persistence remains not_authorized.",
  "Lead creation remains not_authorized.",
  "Manual D4D proceeds only if it beats cheaper bottleneck fixes.",
  "No spend increase is authorized.",
  "No lead-volume automation is authorized.",
  "No outreach or provider activation is authorized.",
  "Property-first and missing-contact blockers remain visible.",
  "Do not invent property facts.",
];

export const forbiddenManualD4dRoiStopGoDrift = [
  "persistence",
  "localStorage writes",
  "/api/leads calls",
  "database writes",
  "Prisma writes",
  "schema creation",
  "Zod schema creation",
  "runtime validation",
  "lead creation",
  "manual capture record creation",
  "CRM mutation",
  "audit writing",
  "provider activation",
  "outreach",
  "maps/GPS",
  "route planning",
  "runtime jobs",
  "queues",
  "assignments",
  "reminders",
  "automation",
  "approval-as-execution",
  "property fact invention",
  "spend increase",
  "lead-volume automation",
];

export function getManualD4dCaptureRoiStopGoReview(): ManualD4dCaptureRoiStopGoReview {
  const result: ManualD4dCaptureRoiStopGoReview = {
    phase: "A3.10 Manual D4D Capture ROI Stop/Go Review",
    manualD4dRoiStopGoStatus: "planning_only",
    limitedManualCaptureMvpDecision: "allowed_for_ui_only",
    persistenceDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    roiStopGoLanes: manualD4dRoiStopGoLanes,
    decisionDoctrine: manualD4dRoiStopGoDecisionDoctrine,
    forbiddenRoiStopGoDrift: forbiddenManualD4dRoiStopGoDrift,
    recommendedNextExactStep: "A3.11 Manual D4D Capture Final Implementation Gate",
    nextStageRecommendation: "A3.11 Manual D4D Capture Final Implementation Gate",
    advisoryOnly: true,
    readOnly: true,
    planningOnly: true,
    flags: manualD4dCaptureRoiStopGoReviewFlags,
  };

  assertManualD4dCaptureRoiStopGoReviewSafe(result);

  return result;
}

export function assertManualD4dCaptureRoiStopGoReviewSafe(result: ManualD4dCaptureRoiStopGoReview) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly", "limitedUiMvpAllowed"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("A3.10 manual D4D capture ROI stop/go review must remain read-only, advisory-only, and planning-only.");
  }

  if (result.manualD4dRoiStopGoStatus !== "planning_only") {
    throw new Error("A3.10 manual D4D capture ROI stop/go review cannot become implementation-ready or execution-ready.");
  }

  if (result.limitedManualCaptureMvpDecision !== "allowed_for_ui_only") {
    throw new Error("A3.10 limited manual capture MVP decision must remain allowed_for_ui_only.");
  }

  if (result.persistenceDecision !== "not_authorized") {
    throw new Error("A3.10 persistence decision must remain not_authorized.");
  }

  if (result.leadCreationDecision !== "not_authorized") {
    throw new Error("A3.10 lead creation decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A3.10 manual D4D capture ROI stop/go review cannot authorize writes, lead creation, persistence, providers, outreach, CRM mutation, maps/GPS, runtime work, automation, approval-as-execution, spend increase, lead-volume automation, or property fact invention.");
  }

  if (result.recommendedNextExactStep !== "A3.11 Manual D4D Capture Final Implementation Gate") {
    throw new Error("A3.10 manual D4D capture ROI stop/go review must recommend A3.11 Manual D4D Capture Final Implementation Gate next.");
  }

  if (result.nextStageRecommendation !== "A3.11 Manual D4D Capture Final Implementation Gate") {
    throw new Error("A3.10 manual D4D capture ROI stop/go review must include the next stage recommendation.");
  }
}

export function summarizeManualD4dCaptureRoiStopGoReview(result: ManualD4dCaptureRoiStopGoReview) {
  assertManualD4dCaptureRoiStopGoReviewSafe(result);

  return `${result.phase}: ${result.manualD4dRoiStopGoStatus}. Limited manual capture MVP decision is ${result.limitedManualCaptureMvpDecision}; it is safe only as UI/manual review. Persistence decision is ${result.persistenceDecision}; lead creation decision is ${result.leadCreationDecision}. A3.10 requires D4D to beat cheaper import cleanup, source quality, public records, referral, and operator-throughput fixes before implementation scope expands. It authorizes no persistence, no localStorage writes, no /api/leads calls, no Prisma or database writes, no lead creation, no CRM mutation, no outreach, no providers, no maps/GPS, no queues, no assignments, no reminders, no runtime jobs, no automation, no approval-as-execution, no spend increase, no lead-volume automation, and no property fact invention. Next stage: ${result.nextStageRecommendation}.`;
}
