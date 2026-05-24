import {
  createHighestRoiAiAcquisitionEngineRoadmap,
  highestRoiAiAcquisitionEngineFlags,
} from "./highest-roi-ai-acquisition-engine-roadmap";

describe("highest ROI AI acquisition engine roadmap", () => {
  it("starts with the imported-list pilot instead of AI acquisition expansion", () => {
    const result = createHighestRoiAiAcquisitionEngineRoadmap();

    expect(result.currentNextExactPhase).toBe("Run Imported List Pilot");
    expect(result.recommendedAfterPilot).toBe("A1.2 Import Friction Fix");
    expect(result.principle).toMatch(/short, explainable, legally sourced list/i);
    expect(result.implementedFoothold).toEqual([
      "A1 Acquisition Intake Review Layer",
      "A1.1 Acquisition Intake Review Polish",
    ]);
  });

  it("reuses the ROI-safe phase sequence and keeps later phases friction-gated", () => {
    const result = createHighestRoiAiAcquisitionEngineRoadmap();

    expect(result.phaseSequence.map((phase) => phase.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(result.phaseSequence[0]).toEqual(
      expect.objectContaining({
        id: "run_imported_list_pilot",
        status: "current",
      }),
    );
    expect(result.phaseSequence.slice(1).every((phase) => phase.status === "deferred_until_friction")).toBe(true);
  });

  it("defines the AI engine shape as advisory acquisition intelligence only", () => {
    const result = createHighestRoiAiAcquisitionEngineRoadmap();

    expect(result.aiEngineShape.map((item) => item.component)).toEqual([
      "acquisition_intake_intelligence",
      "distress_and_source_intelligence",
      "acquisition_priority_engine",
      "source_roi_engine",
      "operator_work_queue_integration",
    ]);
    expect(result.aiEngineShape.map((item) => item.executionBoundary).join(" ")).toMatch(/no scraping|Read-only ranking|Display ordering only/i);
  });

  it("keeps pilot measurement focused on real import friction and source quality", () => {
    const result = createHighestRoiAiAcquisitionEngineRoadmap();

    expect(result.currentPilotMeasurements).toEqual(
      expect.arrayContaining([
        "Which imported rows were ready?",
        "Which rows had source confusion?",
        "Which duplicates slowed review?",
        "Which sources looked highest quality?",
        "What one friction point should be fixed next?",
      ]),
    );
  });

  it("preserves anti-drift and compliance guardrails", () => {
    const result = createHighestRoiAiAcquisitionEngineRoadmap();
    const guardrails = result.guardrails.join(" ");

    expect(guardrails).toMatch(/Do not implement A2, A3, B, C, or D until pilot evidence/i);
    expect(guardrails).toMatch(/Every AI signal must explain why this lead/i);
    expect(guardrails).toMatch(/preserve source attribution/i);
    expect(guardrails).toMatch(/Do not advance beyond the current phase/i);
  });

  it("keeps every AI automation scraping outreach persistence and workflow flag false", () => {
    expect(Object.values(highestRoiAiAcquisitionEngineFlags).every((value) => value === false)).toBe(true);
  });
});
