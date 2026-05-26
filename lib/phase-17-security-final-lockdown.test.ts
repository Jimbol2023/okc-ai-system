import {
  assertPhase17SecurityFinalLockdownSafe,
  getPhase17SecurityFinalLockdown,
  getPhase17SecurityFinalLockdownSummary,
  phase17SecurityFinalLockdownFlags,
} from "./phase-17-security-final-lockdown";

describe("phase 17F security final lockdown", () => {
  it("pins Phase 17F fields and recommends final roadmap lockdown", () => {
    const result = getPhase17SecurityFinalLockdown();

    expect(result.phase).toBe("Phase 17: Pentest & Security Engine");
    expect(result.phaseStep).toBe("Phase 17F â€” Security Final Lockdown");
    expect(result.previousStep).toBe("Phase 17E â€” Minimal Security Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.recommendedNextExactStep).toBe("Roadmap Final Lockdown â€” Human Go/No-Go Review");
    expect(result.nextStageRecommendation).toBe("Roadmap Final Lockdown â€” Human Go/No-Go Review");
  });

  it("locks Phase 17 with all execution decisions unauthorized and flags false", () => {
    const result = getPhase17SecurityFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.roadmapComplete).toBe(true);
    expect(result.flags.pentestExecutionEnabled).toBe(false);
    expect(result.flags.scannerEnabled).toBe(false);
    expect(result.flags.credentialReadEnabled).toBe(false);
    expect(result.flags.authMutationEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("preserves final lockdown boundaries", () => {
    const result = getPhase17SecurityFinalLockdown();
    const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(text).toMatch(/read-only planning/i);
    expect(text).toMatch(/no-live-pentest/i);
    expect(text).toMatch(/no-scan/i);
    expect(text).toMatch(/no-credential-read/i);
    expect(text).toMatch(/no-auth-mutation/i);
    expect(text).toMatch(/Human Go\/No-Go Review/i);
  });

  it("summarizes Phase 17 final lockdown", () => {
    const summary = getPhase17SecurityFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 17 Pentest & Security Engine planning/i);
    expect(summary).toMatch(/completes the 17-phase roadmap/i);
    expect(summary).toMatch(/human-owned security judgment/i);
    expect(summary).toMatch(/No live pentesting/i);
    expect(summary).toMatch(/no scans/i);
    expect(summary).toMatch(/no credential reads/i);
    expect(summary).toMatch(/Roadmap Final Lockdown â€” Human Go\/No-Go Review/i);
  });

  it("throws on pinned drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase17SecurityFinalLockdown();

    expect(() => assertPhase17SecurityFinalLockdownSafe({ ...result, phaseStep: "Phase 17F â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase17SecurityFinalLockdownSafe({ ...result, flags: { ...phase17SecurityFinalLockdownFlags, scannerEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase17SecurityFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase17SecurityFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase17SecurityFinalLockdownSafe({ ...result, lockdownRules: ["live pentesting is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
