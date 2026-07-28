import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateExternalExecutionReadinessGate } from "@/lib/controlled-execution-maturity";

describe("Sprint 7E external execution readiness gate", () => {
  it("blocks external execution until every readiness control is satisfied", () => {
    const gate = evaluateExternalExecutionReadinessGate({
      connectorVerified: false,
      scopesVerified: false,
      credentialEvidencePresent: false,
      exactActionAllowlisted: false,
      rollbackPlanPresent: false,
      auditPathConfirmed: true,
      memoryPathConfirmed: true,
      killSwitchConfirmed: false,
      ceoApprovalConfirmed: false,
      previewTested: false,
      risk: "low",
      candidateAction: "create_calendar_draft",
    });

    assert.equal(gate.go, false);
    assert.equal(gate.recommendedPilot, null);
    assert.equal(gate.providerCalled, false);
    assert.equal(gate.liveExecutionAllowed, false);
    assert.match(gate.blockedReasons.join(" "), /Connector is not verified/);
    assert.match(gate.blockedReasons.join(" "), /Preview test has not passed/);
  });

  it("rejects prohibited external execution candidates even when other controls pass", () => {
    const gate = evaluateExternalExecutionReadinessGate({
      connectorVerified: true,
      scopesVerified: true,
      credentialEvidencePresent: true,
      exactActionAllowlisted: true,
      rollbackPlanPresent: true,
      auditPathConfirmed: true,
      memoryPathConfirmed: true,
      killSwitchConfirmed: true,
      ceoApprovalConfirmed: true,
      previewTested: true,
      risk: "low",
      candidateAction: "send_email",
    });

    assert.equal(gate.go, false);
    assert.equal(gate.recommendedPilot, null);
    assert.match(gate.blockedReasons.join(" "), /prohibited/);
  });

  it("can recommend one low-risk pilot only after all controls pass", () => {
    const gate = evaluateExternalExecutionReadinessGate({
      connectorVerified: true,
      scopesVerified: true,
      credentialEvidencePresent: true,
      exactActionAllowlisted: true,
      rollbackPlanPresent: true,
      auditPathConfirmed: true,
      memoryPathConfirmed: true,
      killSwitchConfirmed: true,
      ceoApprovalConfirmed: true,
      previewTested: true,
      risk: "low",
      candidateAction: "create_drive_doc_draft",
    });

    assert.equal(gate.go, true);
    assert.equal(gate.recommendedPilot, "create_drive_doc_draft");
    assert.equal(gate.providerCalled, false);
    assert.equal(gate.liveExecutionAllowed, false);
  });
});
