import assert from "node:assert/strict";
import { test } from "node:test";

import {
  assertAiCollaborationSafety,
  createAiWorkforceCommandCenterFromInputs,
} from "@/lib/ai-collaboration-engine";
import { createAiEmployeeToolboxReadinessFromInputs } from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createDailyRevenueOperatingLoopFromInputs } from "@/lib/daily-revenue-operating-loop";

function commandCenter() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt: "2026-07-09T13:00:00.000Z" });
  const toolbox = createAiEmployeeToolboxReadinessFromInputs({ workforce, generatedAt: "2026-07-09T13:00:00.000Z" });
  const dailyRevenueOperatingLoop = createDailyRevenueOperatingLoopFromInputs({ workforce, generatedAt: "2026-07-09T13:00:00.000Z" });

  return createAiWorkforceCommandCenterFromInputs({
    workforce,
    toolbox,
    dailyRevenueOperatingLoop,
    generatedAt: "2026-07-09T13:00:00.000Z",
  });
}

test("command center represents every AI employee", () => {
  const report = commandCenter();

  assert.equal(report.ok, true);
  assert.equal(report.company, "J Capital Property Group");
  assert.ok(report.employees.length >= 39);
  assert.equal(report.totals.employees, report.employees.length);
  assert.ok(report.employees.some((employee) => employee.employee === "CEO Executive Assistant AI"));
  assert.ok(report.employees.some((employee) => employee.employee === "Canva Designer AI"));
});

test("daily work orders create internal collaboration requests and dependency chains", () => {
  const report = commandCenter();

  assert.ok(report.requests.length > 0);
  assert.ok(report.dependencyChains.length > 0);
  assert.ok(report.requests.some((request) => request.dependencyOf?.startsWith("dw-")));
  assert.ok(report.requests.some((request) => request.fromEmployee !== request.toEmployee));
});

test("tool blockers create Operations requests", () => {
  const report = commandCenter();
  const operationsRequests = report.requests.filter((request) => request.toDepartment === "Operations");

  assert.ok(operationsRequests.length > 0);
  assert.ok(operationsRequests.some((request) => request.requestType === "blocker_escalation"));
  assert.ok(report.managerEscalations.length > 0);
});

test("approval-sensitive work creates Approval Safety escalations", () => {
  const report = commandCenter();

  assert.ok(report.ceoEscalations.length > 0);
  assert.ok(report.requests.some((request) => request.toDepartment === "Approval / Safety"));
  assert.ok(report.requests.some((request) => request.status === "needs_ceo_approval"));
});

test("collaboration projections remain internal only", () => {
  const report = commandCenter();

  assert.doesNotThrow(() => assertAiCollaborationSafety(report));
  assert.equal(report.safety.readOnly, true);
  assert.equal(report.safety.providerCalled, false);
  assert.equal(report.safety.liveExecutionAllowed, false);
  assert.equal(report.safety.externalExecutionAllowed, false);
  assert.equal(report.safety.connectorActivationAllowed, false);
  assert.equal(report.requests.some((request) => request.providerCalled || request.liveExecutionAllowed), false);
  assert.equal(report.employees.some((employee) => employee.providerCalled || employee.liveExecutionAllowed), false);
});

test("CEO can see working waiting blocked and approval-needed employee states", () => {
  const report = commandCenter();
  const statuses = new Set(report.employees.map((employee) => employee.status));

  assert.ok(statuses.has("working"));
  assert.ok(statuses.has("blocked") || statuses.has("waiting"));
  assert.ok(statuses.has("needs_approval"));
  assert.ok(report.totals.requests > 0);
});
