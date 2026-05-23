import { createY5StorageWritePathReadinessReview } from "./y5-storage-write-path-readiness-review";

describe("Y5C storage write path readiness review", () => {
  it("keeps write paths disabled and unauthorized", () => {
    const result = createY5StorageWritePathReadinessReview();
    expect(result.planningOnly).toBe(true);
    expect(result.writePathCreationAuthorized).toBe(false);
    expect(result.implicitWritesAllowed).toBe(false);
    expect(result.approvalAsWriteAllowed).toBe(false);
    expect(result.providerCoupledWritesAllowed).toBe(false);
    expect(result.runtimeTriggeredWritesAllowed).toBe(false);
  });

  it("blocks write path creation and all unsafe write triggers", () => {
    const result = createY5StorageWritePathReadinessReview({ writePathRequested: true, implicitWriteRequested: true, approvalAsWriteRequested: true, providerWriteRequested: true, runtimeWriteRequested: true, auditWriteRequested: true, persistenceRequested: true });
    expect(result.status).toBe("storage_write_path_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/write path creation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider-coupled writes remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime-triggered writes remain blocked/);
  });
});
