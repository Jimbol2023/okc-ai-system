import { createZ1FinalRevenueOperationsFoundationSummary } from "./z1-final-revenue-operations-foundation-summary";

describe("Z1F final revenue operations foundation summary", () => {
  it("summarizes Z1 readiness and keeps activation blocked", () => {
    const result = createZ1FinalRevenueOperationsFoundationSummary();
    expect(result.phase).toBe("Z1F");
    expect(result.leadCaptureReadiness.phase).toBe("Z1B");
    expect(result.attributionReadiness.phase).toBe("Z1C");
    expect(result.crmReadiness.phase).toBe("Z1D");
    expect(result.duplicateIncompleteReadiness.phase).toBe("Z1E");
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("recommends Z2 CRM workflow clarity next", () => {
    const result = createZ1FinalRevenueOperationsFoundationSummary();
    expect(result.recommendedNextStep).toBe("Z2 - CRM Workflow Clarity");
    expect(result.manualOperationsRemainPrimary).toBe(true);
  });
});
