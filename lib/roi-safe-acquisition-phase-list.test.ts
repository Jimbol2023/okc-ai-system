import {
  createRoiSafeAcquisitionPhaseList,
  roiSafeAcquisitionPhaseListFlags,
  roiSafeAcquisitionPhases,
} from "./roi-safe-acquisition-phase-list";

describe("ROI-safe acquisition phase list", () => {
  it("pins the current next step to imported-list pilot instead of roadmap expansion", () => {
    const result = createRoiSafeAcquisitionPhaseList();

    expect(result.currentImplementedFoothold).toEqual([
      "A1 Acquisition Intake Review Layer",
      "A1.1 Acquisition Intake Review Polish",
    ]);
    expect(result.recommendedNextExactStep).toBe("Run Imported List Pilot");
    expect(result.phases[0]).toEqual(
      expect.objectContaining({
        id: "run_imported_list_pilot",
        status: "current",
        implementationRule: expect.stringMatching(/No code change/i),
      }),
    );
  });

  it("keeps later acquisition capabilities deferred until observed friction justifies them", () => {
    const result = createRoiSafeAcquisitionPhaseList();
    const deferredPhases = result.phases.slice(1);

    expect(deferredPhases.every((phase) => phase.status === "deferred_until_friction")).toBe(true);
    expect(result.guardrails.join(" ")).toMatch(/Do not implement A2, A3, B, C, or D until pilot evidence/i);
    expect(result.guardrails.join(" ")).toMatch(/Choose one focused A1\.2 fix/i);
  });

  it("orders all ROI phases deterministically", () => {
    expect(roiSafeAcquisitionPhases.map((phase) => phase.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(roiSafeAcquisitionPhases.map((phase) => phase.id)).toEqual([
      "run_imported_list_pilot",
      "a1_2_import_friction_fix",
      "a1_3_canonical_preview_hardening",
      "a1_4_source_quality_review",
      "a1_5_duplicate_cleanup_practicalization",
      "a2_public_records_intake_planning_gate",
      "a2_1_public_records_export_review_helper",
      "a3_manual_d4d_capture_usability_gate",
      "a3_1_manual_d4d_property_capture",
      "b1_virtual_distress_review_existing_data",
      "b2_territory_signal_review",
      "c1_acquisition_priority_review",
      "d1_acquisition_work_queue_integration",
      "stop_and_measure_acquisition_roi",
    ]);
  });

  it("keeps public records D4D territory scoring and work queue expansion blocked by friction gates", () => {
    const result = createRoiSafeAcquisitionPhaseList();
    const phaseText = result.phases.map((phase) => `${phase.title} ${phase.blockedUntil ?? ""} ${phase.implementationRule}`).join(" ");

    expect(phaseText).toMatch(/Public Records Export Review Helper/i);
    expect(phaseText).toMatch(/Manual D4D Property Capture/i);
    expect(phaseText).toMatch(/Territory Signal Review/i);
    expect(phaseText).toMatch(/Acquisition Work Queue Integration/i);
    expect(phaseText).toMatch(/No live external access/i);
    expect(phaseText).toMatch(/no auto-contact, auto-route, or assignment/i);
    expect(phaseText).toMatch(/Do not create execution queues/i);
  });

  it("records practical pilot questions for imported-list review", () => {
    const result = createRoiSafeAcquisitionPhaseList();

    expect(result.pilotQuestions).toEqual(
      expect.arrayContaining([
        "Which rows were ready?",
        "Which rows needed cleanup?",
        "Which rows had source confusion?",
        "Which duplicates slowed review?",
      ]),
    );
  });

  it("keeps every execution provider scraping outreach queue and CRM mutation flag false", () => {
    expect(Object.values(roiSafeAcquisitionPhaseListFlags).every((value) => value === false)).toBe(true);
  });
});
