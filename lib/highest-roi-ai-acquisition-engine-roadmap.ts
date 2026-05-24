import {
  createRoiSafeAcquisitionPhaseList,
  roiSafeAcquisitionPhaseListFlags,
  type RoiSafeAcquisitionPhase,
} from "./roi-safe-acquisition-phase-list";

export const highestRoiAiAcquisitionEngineFlags = {
  ...roiSafeAcquisitionPhaseListFlags,
  aiAutonomousLeadGenerationActivated: false,
  aiAutonomousPropertyTargetingActivated: false,
  aiAutonomousOutreachActivated: false,
  aiNegotiationActivated: false,
  aiBuyerBlastingActivated: false,
  aiColdCallingActivated: false,
  aiDecisionPersisted: false,
  sourceRoiTrackingPersisted: false,
  acquisitionPriorityPersisted: false,
  hiddenWorkflowEngineCreated: false,
} as const;

export type HighestRoiAiEngineComponent =
  | "acquisition_intake_intelligence"
  | "distress_and_source_intelligence"
  | "acquisition_priority_engine"
  | "source_roi_engine"
  | "operator_work_queue_integration";

export type HighestRoiAiAcquisitionRoadmap = {
  roadmapName: "Highest-ROI AI Acquisition Engine Phase Roadmap";
  principle: string;
  currentNextExactPhase: "Run Imported List Pilot";
  implementedFoothold: string[];
  phaseSequence: RoiSafeAcquisitionPhase[];
  aiEngineShape: Array<{
    component: HighestRoiAiEngineComponent;
    purpose: string;
    executionBoundary: string;
  }>;
  guardrails: string[];
  currentPilotMeasurements: string[];
  recommendedAfterPilot: "A1.2 Import Friction Fix";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof highestRoiAiAcquisitionEngineFlags;
};

const aiEngineShape: HighestRoiAiAcquisitionRoadmap["aiEngineShape"] = [
  {
    component: "acquisition_intake_intelligence",
    purpose: "Clean, label, and review imported or legal export previews before seller workflow.",
    executionBoundary: "Preview and review only; no production schema expansion, outreach, or CRM mutation.",
  },
  {
    component: "distress_and_source_intelligence",
    purpose: "Explain why a legally sourced lead may deserve manual review.",
    executionBoundary: "Use existing imported, legal export, or manual fields only; no scraping, crawling, surveillance, or external lookup.",
  },
  {
    component: "acquisition_priority_engine",
    purpose: "Produce a short explainable manual-review list instead of a large unranked lead pile.",
    executionBoundary: "Read-only ranking only; no persisted autonomous score, routing, assignment, outreach, or status movement.",
  },
  {
    component: "source_roi_engine",
    purpose: "Compare which sources create review-ready and revenue-progressing opportunities from existing outcomes.",
    executionBoundary: "No analytics persistence or tracking expansion unless separately approved after real pilot use.",
  },
  {
    component: "operator_work_queue_integration",
    purpose: "Show the best acquisition leads first in existing operator surfaces.",
    executionBoundary: "Display ordering only; no execution queue, assignment, reminder, routing, or automation.",
  },
];

export function createHighestRoiAiAcquisitionEngineRoadmap(): HighestRoiAiAcquisitionRoadmap {
  const phaseList = createRoiSafeAcquisitionPhaseList();

  return {
    roadmapName: "Highest-ROI AI Acquisition Engine Phase Roadmap",
    principle:
      "Do not try to find every property. Produce a short, explainable, legally sourced list of leads most worth manual review.",
    currentNextExactPhase: "Run Imported List Pilot",
    implementedFoothold: phaseList.currentImplementedFoothold,
    phaseSequence: phaseList.phases,
    aiEngineShape,
    guardrails: [
      ...phaseList.guardrails,
      "Every AI signal must explain why this lead is worth manual review.",
      "Every AI signal must preserve source attribution and compliance context.",
      "Do not advance beyond the current phase until prior pilot use shows real operator friction or ROI.",
    ],
    currentPilotMeasurements: [
      "Which imported rows were ready?",
      "Which rows needed cleanup?",
      "Which rows had source confusion?",
      "Which duplicates slowed review?",
      "Which sources looked highest quality?",
      "Did the importer review panel help choose what to import?",
      "What one friction point should be fixed next?",
    ],
    recommendedAfterPilot: "A1.2 Import Friction Fix",
    advisoryOnly: true,
    readOnly: true,
    flags: highestRoiAiAcquisitionEngineFlags,
  };
}
