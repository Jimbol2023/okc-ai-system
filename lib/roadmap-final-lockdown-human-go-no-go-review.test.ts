import {
  assertRoadmapFinalLockdownHumanGoNoGoReviewSafe,
  getRoadmapFinalLockdownHumanGoNoGoReview,
  getRoadmapFinalLockdownHumanGoNoGoReviewSummary,
  roadmapFinalLockdownHumanGoNoGoReviewFlags,
  roadmapFinalLockdownReviewLanes,
  roadmapFinalLockdownSummaryStates,
} from "./roadmap-final-lockdown-human-go-no-go-review";

describe("roadmap final lockdown human go/no-go review", () => {
  it("pins final roadmap fields, Phase 17F continuity, and no further phase handoff", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(result.phase).toBe("Roadmap Final Lockdown — Human Go/No-Go Review");
    expect(result.previousStep).toBe("Phase 17F — Security Final Lockdown");
    expect(result.phaseDecision).toBe("human_go_no_go_review_only");
    expect(result.recommendedNextExactStep).toBe("No further roadmap phase — human-owned final decision required");
    expect(result.nextStageRecommendation).toBe("No further roadmap phase — human-owned final decision required");
  });

  it("keeps every execution decision unauthorized and blocked flags false", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.completedSeventeenPhaseRoadmap).toBe(true);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.credentialReadEnabled).toBe(false);
    expect(result.flags.pentestExecutionEnabled).toBe(false);
    expect(result.flags.scannerEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.remediationExecutionEnabled).toBe(false);
    expect(result.flags.furtherRoadmapImplementationEnabled).toBe(false);
  });

  it("includes all 17 phases in order", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(result.phaseRecords).toHaveLength(17);
    expect(result.phaseRecords.map((record) => record.phaseNumber)).toEqual(Array.from({ length: 17 }, (_, index) => index + 1));
    expect(result.phaseRecords[0]?.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(result.phaseRecords[16]?.phaseName).toBe("Pentest & Security Engine");
    expect(result.phaseRecords.every((record) => /no |advisory\/planning-only/i.test(record.executionBoundary))).toBe(true);
  });

  it("includes every final human review lane and summary state", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(result.finalReviewLanes).toEqual(roadmapFinalLockdownReviewLanes);
    expect(result.summaryStates).toEqual(roadmapFinalLockdownSummaryStates);
    expect(result.finalReviewLanes).toContain("final_human_go_no_go_decision_required");
    expect(result.summaryStates).toContain("human_go_no_go_required");
    expect(result.summaryStates).toContain("not_authorized");
  });

  it("blocks go-live, providers, credentials, scans, mutation, audit writing, remediation, outreach, runtime work, and further roadmap implementation", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();
    const text = [result.stopRules, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/No go-live/i);
    expect(text).toMatch(/provider activation/i);
    expect(text).toMatch(/credential reads/i);
    expect(text).toMatch(/env reads/i);
    expect(text).toMatch(/live pentesting/i);
    expect(text).toMatch(/scans/i);
    expect(text).toMatch(/network calls/i);
    expect(text).toMatch(/auth\/security mutation/i);
    expect(text).toMatch(/CRM mutation/i);
    expect(text).toMatch(/audit writing/i);
    expect(text).toMatch(/remediation execution/i);
    expect(text).toMatch(/outreach/i);
    expect(text).toMatch(/runtime jobs/i);
    expect(text).toMatch(/further roadmap implementation/i);
  });

  it("keeps AI advisory-only and human-owned final authority explicit", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/human review only/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/may not approve go-live/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/read credentials or env files/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final go\/no-go judgment/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/legal and security review/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/provider approval/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/remediation approval/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/communication approval/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/spend approval/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/execution approval/i);
  });

  it("summarizes the completed roadmap and final blockers", () => {
    const summary = getRoadmapFinalLockdownHumanGoNoGoReviewSummary();

    expect(summary).toMatch(/Roadmap Final Lockdown — Human Go\/No-Go Review/i);
    expect(summary).toMatch(/completed 17-phase roadmap/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned final decision/i);
    expect(summary).toMatch(/No go-live/i);
    expect(summary).toMatch(/no provider activation/i);
    expect(summary).toMatch(/no credential reads/i);
    expect(summary).toMatch(/no live pentesting or scans/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no CRM\/storage mutation/i);
    expect(summary).toMatch(/no audit writing/i);
    expect(summary).toMatch(/no remediation execution/i);
    expect(summary).toMatch(/no further roadmap phase/i);
  });

  it("throws on pinned drift, missing records, missing lanes, missing states, missing boundaries, blocked flags, and unsafe wording", () => {
    const result = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, phase: "Drift" as never })).toThrow(/phase/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, previousStep: "Phase 17E — Minimal Security Gate" as never })).toThrow(/previous/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, phaseRecords: result.phaseRecords.slice(0, 16) })).toThrow(/17 ordered phase records/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, finalReviewLanes: result.finalReviewLanes.slice(1) })).toThrow(/review lanes/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, summaryStates: result.summaryStates.slice(1) })).toThrow(/summary states/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, stopRules: [] })).toThrow(/stop rule/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, flags: { ...roadmapFinalLockdownHumanGoNoGoReviewFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertRoadmapFinalLockdownHumanGoNoGoReviewSafe({ ...result, stopRules: ["go-live is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
