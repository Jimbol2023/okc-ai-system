import { createY4RedactionBeforeStorageContractPlan } from "./y4-redaction-before-storage-contract-plan";

describe("Y4C redaction before storage contract plan", () => {
  it("requires redaction and bounded storage shapes before any storage", () => {
    const result = createY4RedactionBeforeStorageContractPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.redactionTargets).toContain("phones");
    expect(result.redactionTargets).toContain("tokens/secrets");
    expect(result.safeStorageShapeRequirements).toContain("bounded text");
    expect(result.safeStorageShapeRequirements).toContain("no unrestricted logs");
    expect(result.storageAuthorized).toBe(false);
  });

  it("blocks raw payloads, unrestricted logs, unredacted contacts, tokens, audit writes, and storage", () => {
    const result = createY4RedactionBeforeStorageContractPlan({ rawPayloadStorageRequested: true, unrestrictedLogRequested: true, unredactedContactStorageRequested: true, tokenStorageRequested: true, auditWriteRequested: true, storageRequested: true });
    expect(result.status).toBe("redaction_before_storage_contract_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/raw payload storage remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/token\/secret storage remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/storage remains unauthorized/);
  });
});
