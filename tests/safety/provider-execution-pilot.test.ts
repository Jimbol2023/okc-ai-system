import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateExternalExecutionReadinessGate } from "@/lib/controlled-execution-maturity";

describe("Sprint 7F first controlled provider execution pilot readiness", () => {
  it("keeps the first provider pilot as a separate approval decision with no execution in this sprint", () => {
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
      candidateAction: "create_calendar_draft",
    });

    assert.equal(gate.go, true);
    assert.equal(gate.recommendedPilot, "create_calendar_draft");
    assert.equal(gate.providerCalled, false);
    assert.equal(gate.liveExecutionAllowed, false);
    assert.deepEqual(
      gate.prohibitedActions,
      ["send_email", "send_sms", "publish_post", "reply_to_review", "run_ads", "autonomous_outreach"],
    );
  });
});
