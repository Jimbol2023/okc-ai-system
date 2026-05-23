import { createY6AuditSchemaRelationshipBoundaryReview } from "./y6-audit-schema-relationship-boundary-review";

describe("Y6C audit schema relationship boundary review", () => {
  it("keeps relationships placeholder-based and decoupled", () => {
    const result = createY6AuditSchemaRelationshipBoundaryReview();
    expect(result.planningOnly).toBe(true);
    expect(result.providerPayloadLinkageAllowed).toBe(false);
    expect(result.executionCouplingAllowed).toBe(false);
    expect(result.approvalAsExecutionRelationshipAllowed).toBe(false);
    expect(result.communicationSendCouplingAllowed).toBe(false);
    expect(result.runtimeJobCouplingAllowed).toBe(false);
  });

  it("blocks provider, execution, approval, communication, runtime, direct FK, and schema requests", () => {
    const result = createY6AuditSchemaRelationshipBoundaryReview({ providerPayloadLinkRequested: true, executionCouplingRequested: true, approvalExecutionRelationshipRequested: true, communicationSendCouplingRequested: true, runtimeJobCouplingRequested: true, directForeignKeyRequested: true, schemaChangeRequested: true });
    expect(result.status).toBe("audit_schema_relationship_boundary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/direct provider payload linkage remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/approval-as-execution relationship remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime job coupling remains blocked/);
  });
});
