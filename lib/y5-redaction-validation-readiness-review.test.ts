import { createY5RedactionValidationReadinessReview } from "./y5-redaction-validation-readiness-review";

describe("Y5D redaction validation readiness review", () => {
  it("plans validation readiness without implementing validation or storage", () => {
    const result = createY5RedactionValidationReadinessReview();
    expect(result.planningOnly).toBe(true);
    expect(result.validationImplementationAuthorized).toBe(false);
    expect(result.rawContactStorageAllowed).toBe(false);
    expect(result.messageBodyStorageAllowed).toBe(false);
    expect(result.providerPayloadStorageAllowed).toBe(false);
    expect(result.tokenSecretStorageAllowed).toBe(false);
  });

  it("blocks raw contact, message, payload, token, unbounded text, unsafe enum, and audit write requests", () => {
    const result = createY5RedactionValidationReadinessReview({ rawContactStorageRequested: true, messageBodyStorageRequested: true, providerPayloadStorageRequested: true, tokenSecretStorageRequested: true, unboundedTextRequested: true, unsafeEnumRequested: true, auditWriteRequested: true });
    expect(result.status).toBe("redaction_validation_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/raw contact storage remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/token\/secret storage remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/unsafe enum values remain blocked/);
  });
});
