import { createY3ExecutionReconstructionIncidentReviewPlan } from "./y3-execution-reconstruction-incident-review-plan";

describe("Y3E execution reconstruction incident review plan", () => {
  it("preserves execution, provider, send, runtime, and persistence blocks", () => {
    const result = createY3ExecutionReconstructionIncidentReviewPlan();
    expect(result.executionAllowed).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.sent).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.persistenceWritten).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("plans future incident reconstruction signals", () => {
    const result = createY3ExecutionReconstructionIncidentReviewPlan();
    expect(result.reconstructionSignals).toContain("who reviewed");
    expect(result.reconstructionSignals).toContain("DNC/opt-out state");
    expect(result.reconstructionSignals).toContain("rollback trigger");
    expect(result.reconstructionSignals).toContain("stop conditions");
  });

  it("blocks execution, provider activation, send, runtime, polling, persistence, and approval-to-send", () => {
    const result = createY3ExecutionReconstructionIncidentReviewPlan({ executionRequested: true, providerActivationRequested: true, sendRequested: true, runtimeRequested: true, persistenceRequested: true, pollingRequested: true, approvalToSendRequested: true });
    expect(result.status).toBe("execution_reconstruction_incident_review_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/execution remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/approval-to-send behavior remains blocked/);
  });
});
