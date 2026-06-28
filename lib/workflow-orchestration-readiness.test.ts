import assert from "node:assert/strict";
import test from "node:test";

import {
  assertWorkflowOrchestrationSafety,
  createWorkflowOrchestrationReadinessReport,
} from "@/lib/workflow-orchestration-readiness";

test("workflow orchestration readiness recommends n8n without triggering workflows", () => {
  const report = createWorkflowOrchestrationReadinessReport();
  const n8n = report.capabilities.find((capability) => capability.id === "n8n");

  assert.equal(report.preferredOrchestrator, "n8n");
  assert.equal(n8n?.status, "recommended_readiness_only");
  assert.equal(n8n?.safetyFlags.workflowTriggered, false);
  assert.equal(n8n?.safetyFlags.providerCalled, false);
});

test("Power Automate Desktop remains blocked until governed", () => {
  const report = createWorkflowOrchestrationReadinessReport();
  const powerAutomate = report.capabilities.find((capability) => capability.id === "microsoft_power_automate_desktop");

  assert.equal(powerAutomate?.status, "blocked_until_governed");
  assert.equal(powerAutomate?.safetyFlags.desktopAutomationAuthorized, false);
});

test("terminal and filesystem access are not authorized from UI", () => {
  const report = createWorkflowOrchestrationReadinessReport();
  const terminal = report.capabilities.find((capability) => capability.id === "terminal_access");
  const fileSystem = report.capabilities.find((capability) => capability.id === "file_system_access");

  assert.equal(terminal?.safetyFlags.terminalCommandAuthorized, false);
  assert.equal(fileSystem?.safetyFlags.fileSystemWriteAuthorized, false);
  assert.equal(report.safety.noTerminalExecutionFromUi, true);
  assert.equal(report.safety.noFileSystemWritesFromUi, true);
});

test("workflow orchestration safety assertion rejects no false safety flags", () => {
  const report = createWorkflowOrchestrationReadinessReport();

  assert.doesNotThrow(() => assertWorkflowOrchestrationSafety(report));
  assert.ok(report.capabilities.every((capability) => capability.safetyFlags.outreachSent === false));
  assert.ok(report.capabilities.every((capability) => capability.safetyFlags.crmMutated === false));
});
