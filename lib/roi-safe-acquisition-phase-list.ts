import { acquisitionIntakeReviewFlags } from "./acquisition-intake-review";

export const roiSafeAcquisitionPhaseListFlags = {
  ...acquisitionIntakeReviewFlags,
  publicRecordConnectorCreated: false,
  virtualD4DActivated: false,
  territoryScoringActivated: false,
  routePlanningActivated: false,
  acquisitionScoringPersisted: false,
  acquisitionQueueCreated: false,
  acquisitionAssignmentCreated: false,
  acquisitionAutomationTriggered: false,
  externalLookupTriggered: false,
  mlsScrapingAllowed: false,
  publicRecordsScrapingTriggered: false,
  operatorTrackingCreated: false,
} as const;

export type RoiSafeAcquisitionPhaseStatus = "complete" | "current" | "deferred_until_friction";

export type RoiSafeAcquisitionPhase = {
  order: number;
  id: string;
  title: string;
  status: RoiSafeAcquisitionPhaseStatus;
  roiGoal: string;
  implementationRule: string;
  blockedUntil?: string;
};

export type RoiSafeAcquisitionPhaseList = {
  phaseListName: "ROI-Safe Acquisition Intelligence Phase List";
  currentImplementedFoothold: string[];
  phases: RoiSafeAcquisitionPhase[];
  guardrails: string[];
  recommendedNextExactStep: "Run Imported List Pilot";
  pilotQuestions: string[];
  advisoryOnly: true;
  readOnly: true;
  flags: typeof roiSafeAcquisitionPhaseListFlags;
};

export const roiSafeAcquisitionPhases: RoiSafeAcquisitionPhase[] = [
  {
    order: 1,
    id: "run_imported_list_pilot",
    title: "Run Imported List Pilot",
    status: "current",
    roiGoal: "Use real imported lists to reveal the smallest acquisition friction worth fixing.",
    implementationRule: "No code change unless a real operator blocker appears during import review.",
  },
  {
    order: 2,
    id: "a1_2_import_friction_fix",
    title: "A1.2 Import Friction Fix",
    status: "deferred_until_friction",
    roiGoal: "Fix one specific import-review problem that slows operators down.",
    implementationRule: "Choose exactly one focused fix from pilot notes, such as column aliases, duplicate clarity, source fallback, or empty/error copy.",
    blockedUntil: "Imported-list pilot identifies a repeated import friction point.",
  },
  {
    order: 3,
    id: "a1_3_canonical_preview_hardening",
    title: "A1.3 Canonical Imported Lead Preview Hardening",
    status: "deferred_until_friction",
    roiGoal: "Make repeated list formats easier to preview without creating a new production schema.",
    implementationRule: "Harden preview normalization only for real PropStream, DealMachine, assessor, spreadsheet, or tax-list headers encountered in pilot use.",
    blockedUntil: "Multiple real imports show recurring header or preview-normalization friction.",
  },
  {
    order: 4,
    id: "a1_4_source_quality_review",
    title: "A1.4 Acquisition Source Quality Review",
    status: "deferred_until_friction",
    roiGoal: "Reduce source confusion before imported records enter seller workflow.",
    implementationRule: "Add source confidence and source cleanup hints from existing preview data only.",
    blockedUntil: "Imported lists show mixed, missing, or low-confidence source attribution.",
  },
  {
    order: 5,
    id: "a1_5_duplicate_cleanup_practicalization",
    title: "A1.5 Duplicate And Cleanup Review Practicalization",
    status: "deferred_until_friction",
    roiGoal: "Reduce duplicate and invalid-row waste during manual import review.",
    implementationRule: "Improve scanability only; no automatic merge, delete, mutation, or dedupe execution.",
    blockedUntil: "Duplicates or invalid rows repeatedly slow import decisions.",
  },
  {
    order: 6,
    id: "a2_public_records_intake_planning_gate",
    title: "A2 Read-Only Public Records Intake Planning Gate",
    status: "deferred_until_friction",
    roiGoal: "Plan legal public-record intake only if exports become the bottleneck.",
    implementationRule: "Define legal data shapes, compliance labels, timestamps, confidence, and operator review requirements without connectors.",
    blockedUntil: "Imported-list pilot proves public-record intake is the next acquisition bottleneck.",
  },
  {
    order: 7,
    id: "a2_1_public_records_export_review_helper",
    title: "A2.1 Public Records Export Review Helper",
    status: "deferred_until_friction",
    roiGoal: "Review already-downloaded legal public-record exports without scraping or crawling.",
    implementationRule: "Accept export previews and label compliance, source, and confidence; no live external access.",
    blockedUntil: "A2 planning confirms export review is necessary and legally sourced files are available.",
  },
  {
    order: 8,
    id: "a3_manual_d4d_capture_usability_gate",
    title: "A3 Manual D4D Capture Usability Gate",
    status: "deferred_until_friction",
    roiGoal: "Determine whether manual field property capture is the actual bottleneck.",
    implementationRule: "Review the current D4D placeholder and define the smallest manual capture workflow only if pilot notes justify it.",
    blockedUntil: "Operators need field/manual property capture more than importer improvements.",
  },
  {
    order: 9,
    id: "a3_1_manual_d4d_property_capture",
    title: "A3.1 Manual D4D Property Capture",
    status: "deferred_until_friction",
    roiGoal: "Capture field-found property context for operator review.",
    implementationRule: "Manual address, source, distress tags, notes, and review status only; no auto-contact, auto-route, or assignment.",
    blockedUntil: "A3 gate confirms manual D4D capture is the highest ROI missing capability.",
  },
  {
    order: 10,
    id: "b1_virtual_distress_review_existing_data",
    title: "B1 Virtual Distress Review From Existing Data",
    status: "deferred_until_friction",
    roiGoal: "Surface distress hints only from existing legal/imported/manual fields.",
    implementationRule: "No invasive monitoring, illegal scraping, utility monitoring, image surveillance, hidden crawling, or MLS replication.",
    blockedUntil: "Enough legal/imported/manual records exist to make distress review meaningful.",
  },
  {
    order: 11,
    id: "b2_territory_signal_review",
    title: "B2 Territory Signal Review",
    status: "deferred_until_friction",
    roiGoal: "Show whether territory patterns help operators inspect better acquisition opportunities.",
    implementationRule: "Summarize existing source mix, zip/city concentration, cleanup burden, and review-ready density only.",
    blockedUntil: "Lead volume is sufficient for territory patterns to be useful.",
  },
  {
    order: 12,
    id: "c1_acquisition_priority_review",
    title: "C1 Acquisition Priority Review",
    status: "deferred_until_friction",
    roiGoal: "Help operators prioritize acquisition opportunities after intake/source/territory data is reliable.",
    implementationRule: "Read-only priority from existing data only; no score persistence, routing, assignments, outreach, or status movement.",
    blockedUntil: "Source, cleanup, and territory data are reliable enough to rank acquisition opportunities.",
  },
  {
    order: 13,
    id: "d1_acquisition_work_queue_integration",
    title: "D1 Acquisition Work Queue Integration",
    status: "deferred_until_friction",
    roiGoal: "Fold useful acquisition priority into the existing read-only manual work queue.",
    implementationRule: "Display ordering only; do not create execution queues, assignments, routing, reminders, or automation.",
    blockedUntil: "C1 priority review proves useful in real operator decisions.",
  },
  {
    order: 14,
    id: "stop_and_measure_acquisition_roi",
    title: "Stop And Measure Acquisition ROI",
    status: "deferred_until_friction",
    roiGoal: "Pause after each meaningful acquisition capability and verify operator throughput improved.",
    implementationRule: "If no measurable friction remains, hold scope and operate manually.",
    blockedUntil: "One meaningful acquisition capability has been used with real records.",
  },
];

export function createRoiSafeAcquisitionPhaseList(): RoiSafeAcquisitionPhaseList {
  return {
    phaseListName: "ROI-Safe Acquisition Intelligence Phase List",
    currentImplementedFoothold: ["A1 Acquisition Intake Review Layer", "A1.1 Acquisition Intake Review Polish"],
    phases: roiSafeAcquisitionPhases,
    guardrails: [
      "Do not implement A2, A3, B, C, or D until pilot evidence justifies them.",
      "Do not add illegal MLS scraping, unauthorized crawling, invasive monitoring, hidden provider activation, autonomous outreach, autonomous negotiation, autonomous routing, or CRM mutation expansion.",
      "Every acquisition output must stay source-labeled, explainable, compliance-aware, operator-reviewed, and fail-closed.",
      "Choose one focused A1.2 fix only after imported-list friction is observed.",
    ],
    recommendedNextExactStep: "Run Imported List Pilot",
    pilotQuestions: [
      "Which rows were ready?",
      "Which rows needed cleanup?",
      "Which rows had source confusion?",
      "Which duplicates slowed review?",
      "Did the intake review panel make the import decision faster?",
      "Was any wording unclear or too automation-like?",
    ],
    advisoryOnly: true,
    readOnly: true,
    flags: roiSafeAcquisitionPhaseListFlags,
  };
}
