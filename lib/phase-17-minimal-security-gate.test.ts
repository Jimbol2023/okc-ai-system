import {
  assertPhase17MinimalSecurityGateSafe,
  getPhase17MinimalSecurityGate,
  getPhase17MinimalSecurityGateSummary,
  phase17MinimalSecurityGateChecks,
  phase17MinimalSecurityGateFlags,
} from "./phase-17-minimal-security-gate";

describe("phase 17E minimal security gate", () => {
  it("pins Phase 17E fields and includes all gate checks", () => {
    const result = getPhase17MinimalSecurityGate();

    expect(result.phaseStep).toBe("Phase 17E â€” Minimal Security Gate");
    expect(result.previousStep).toBe("Phase 17D â€” Security Implementation Scope");
    expect(result.gateChecks).toEqual(phase17MinimalSecurityGateChecks);
    expect(result.implementationLaneReferences).toContain("blocked_scan_exploit_credential_mutation_remediation_execution_paths");
    expect(result.recommendedNextExactStep).toBe("Phase 17F â€” Security Final Lockdown");
  });

  it("gates only read-only visibility and blocks execution", () => {
    const result = getPhase17MinimalSecurityGate();
    const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/minimal read-only security/i);
    expect(text).toMatch(/scans/i);
    expect(text).toMatch(/credential reads/i);
    expect(text).toMatch(/auth\/security changes/i);
    expect(text).toMatch(/audit writing/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes the minimal gate", () => {
    const summary = getPhase17MinimalSecurityGateSummary();

    expect(summary).toMatch(/minimal read-only security review package/i);
    expect(summary).toMatch(/go-live approval/i);
    expect(summary).toMatch(/No live pentesting/i);
    expect(summary).toMatch(/no credential reads/i);
    expect(summary).toMatch(/Phase 17F â€” Security Final Lockdown/i);
  });

  it("throws on gate drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase17MinimalSecurityGate();

    expect(() => assertPhase17MinimalSecurityGateSafe({ ...result, gateChecks: [] as never })).toThrow(/gate checks/i);
    expect(() => assertPhase17MinimalSecurityGateSafe({ ...result, flags: { ...phase17MinimalSecurityGateFlags, credentialReadEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase17MinimalSecurityGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase17MinimalSecurityGateSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase17MinimalSecurityGateSafe({ ...result, gateRules: ["credential reads are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
