import assert from "node:assert/strict";
import test from "node:test";

import { assertOperationalSafetyCenter, createOperationalSafetyCenterReport } from "@/lib/operational-safety-center";

test("operational safety center includes the required governance sections", () => {
  const report = createOperationalSafetyCenterReport();
  const ids = report.cards.map((card) => card.id);

  assert.deepEqual(ids, [
    "provider-readiness",
    "workflow-orchestration",
    "ai-memory",
    "openai-semantic-search",
    "twilio-sms",
    "n8n-readiness",
  ]);
});

test("operational safety center keeps every global execution flag false", () => {
  const report = createOperationalSafetyCenterReport();

  assert.doesNotThrow(() => assertOperationalSafetyCenter(report));
  assert.equal(report.globalFlags.providerCalled, false);
  assert.equal(report.globalFlags.outreachSent, false);
  assert.equal(report.globalFlags.workflowTriggered, false);
  assert.equal(report.globalFlags.desktopAutomationAuthorized, false);
  assert.equal(report.globalFlags.terminalCommandAuthorized, false);
  assert.equal(report.globalFlags.fileSystemWriteAuthorized, false);
  assert.equal(report.globalFlags.generatedPropertyFacts, false);
});
