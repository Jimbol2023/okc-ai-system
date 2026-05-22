import {
  createR68SimulationDriftExecutionRiskAudit,
  summarizeR68SimulationDriftExecutionRiskAudit,
} from "./r68-simulation-drift-execution-risk-audit";

const completeInput = {
  simulationDriftReviewed: true,
  providerDriftReviewed: true,
  approvalSendRiskReviewed: true,
  signalExecutionRisksReviewed: true,
  auditPersistenceRisksReviewed: true,
  runtimePollingRisksReviewed: true,
  dangerousWordingReviewed: true,
} as const;

describe("R68B simulation drift execution risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR68SimulationDriftExecutionRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.auditRecordsWritten).toBe(false);
  });

  it("smoke-tests complete drift audit", () => {
    const result = createR68SimulationDriftExecutionRiskAudit(completeInput);
    expect(result.status).toBe("simulation_drift_audit_complete");
    expect(result.driftRisks).toContain("simulation-to-execution drift");
    expect(result.dangerousWording).toContain("preview triggers provider");
  });

  it("pressure-tests simulation preview approval and signal drift", () => {
    const result = createR68SimulationDriftExecutionRiskAudit({
      ...completeInput,
      simulationExecutionRequested: true,
      previewProviderRequested: true,
      approvalSendRequested: true,
      readinessExecutionRequested: true,
      queueWorkflowRequested: true,
      urgencyWorkflowRequested: true,
      revenueExecutionRequested: true,
    });
    expect(result.status).toBe("simulation_drift_audit_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["simulation-to-execution drift is forbidden", "preview-to-provider drift is forbidden"]));
  });

  it("pressure-tests audit persistence provider runtime and polling drift", () => {
    const result = createR68SimulationDriftExecutionRiskAudit({
      ...completeInput,
      auditWritingRequested: true,
      persistenceRequested: true,
      providerActivationRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
    });
    expect(result.status).toBe("simulation_drift_audit_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["audit-writing drift is forbidden", "polling drift is forbidden"]));
  });

  it("summarizes drift audit", () => {
    const result = createR68SimulationDriftExecutionRiskAudit(completeInput);
    expect(summarizeR68SimulationDriftExecutionRiskAudit(result)).toMatch(/preview-to-provider/i);
  });
});
