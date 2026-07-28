import assert from "node:assert/strict";
import { test } from "node:test";

import {
  aiWorkforceDepartments,
  aiWorkforceEmployees,
  createAiWorkforceReportFromInputs,
  type AiWorkforceReport,
} from "@/lib/ai-workforce";

function report(): AiWorkforceReport {
  return createAiWorkforceReportFromInputs({ generatedAt: "2026-07-09T00:00:00.000Z" });
}

test("AI workforce roster loads the required departments and employees", () => {
  const workforce = report();

  assert.equal(workforce.ok, true);
  assert.equal(workforce.company, "J Capital Property Group");
  assert.equal(workforce.totals.departments, 16);
  assert.equal(aiWorkforceDepartments.length, 16);
  assert.ok(workforce.totals.employees >= 39);
  assert.ok(aiWorkforceEmployees.length >= 39);
});

test("every department has a manager and at least one employee", () => {
  const workforce = report();

  for (const department of workforce.departments) {
    assert.ok(department.manager);
    assert.ok(department.employees.length > 0, `${department.name} should have employees`);
    assert.ok(department.employees.some((employee) => employee.name === department.manager), `${department.name} manager must be in employee roster`);
  }
});

test("every employee has the required workforce fields", () => {
  const workforce = report();

  for (const employee of workforce.employees) {
    assert.ok(employee.id);
    assert.ok(employee.name);
    assert.ok(employee.department);
    assert.ok(employee.manager);
    assert.ok(employee.role);
    assert.ok(employee.mission);
    assert.ok(employee.dailyResponsibilities.length > 0);
    assert.ok(employee.requiredTools.length > 0);
    assert.ok(employee.tools.length > 0);
    assert.ok(employee.kpisAffected.length > 0);
    assert.ok(employee.outputTypes.length > 0);
    assert.ok(employee.safeNextAction);
    assert.ok(employee.responsibilityMatrix.primaryResponsibilities.length > 0);
    assert.ok(employee.responsibilityMatrix.requiredEvidenceBeforeWork.length > 0);
    assert.ok(employee.responsibilityMatrix.approvalEscalationTrigger);
  }
});

test("employees cannot perform external actions without approval", () => {
  const workforce = report();

  assert.equal(workforce.safety.externalActionsBlocked, true);
  assert.equal(workforce.safety.providerCalled, false);
  assert.equal(workforce.safety.liveExecutionAllowed, false);
  assert.equal(workforce.safety.sendsBlocked, true);
  assert.equal(workforce.safety.publishingBlocked, true);
  assert.equal(workforce.safety.scrapingBlocked, true);
  assert.equal(workforce.safety.smsBlocked, true);
  assert.equal(workforce.safety.schedulingBlocked, true);

  for (const employee of workforce.employees) {
    assert.equal(employee.externalExecutionAllowed, false);
    assert.equal(employee.providerCalled, false);
    assert.equal(employee.liveExecutionAllowed, false);
    assert.ok(employee.responsibilityMatrix.cannotDo.some((item) => item.includes("Send email")));
  }
});

test("readiness detects missing or idle connectors", () => {
  const workforce = report();

  assert.ok(workforce.topMissingConnectors.length > 0);
  assert.ok(workforce.topMissingConnectors.includes("Facebook Business"));
  assert.ok(workforce.topMissingConnectors.includes("TikTok"));

  const facebook = workforce.employees.find((employee) => employee.id === "facebook-specialist");
  const gbp = workforce.employees.find((employee) => employee.id === "local-seo-gbp-specialist");

  assert.ok(facebook);
  assert.ok(gbp);
  assert.ok(facebook.missingConnectors.includes("Facebook Business"));
  assert.ok(gbp.missingConnectors.includes("Google Business Profile"));
});

test("internal-only employees can be marked available today", () => {
  const workforce = report();
  const dataQuality = workforce.employees.find((employee) => employee.id === "data-quality-specialist");
  const connectorMonitor = workforce.employees.find((employee) => employee.id === "connector-health-monitor");

  assert.ok(dataQuality);
  assert.ok(connectorMonitor);
  assert.equal(dataQuality.canProduceInternalOutputToday, true);
  assert.equal(connectorMonitor.canProduceInternalOutputToday, true);
  assert.ok(workforce.totals.internalOutputAvailableToday > 0);
});

test("department readiness aggregates employee readiness", () => {
  const workforce = report();
  const crm = workforce.departments.find((department) => department.name === "CRM");
  const social = workforce.departments.find((department) => department.name === "Social Media");

  assert.ok(crm);
  assert.ok(social);
  assert.equal(crm.canProduceInternalOutputToday, true);
  assert.ok(crm.readinessPercent > 70);
  assert.ok(social.missingConnectors.length > 0);
});

test("responsibility matrix has no duplicate primary owner labels", () => {
  const workforce = report();
  const primaryResponsibilities = workforce.employees.flatMap((employee) => employee.responsibilityMatrix.primaryResponsibilities);
  const unique = new Set(primaryResponsibilities);

  assert.equal(unique.size, primaryResponsibilities.length);
});

test("no provider calls are made while calculating workforce readiness", () => {
  const workforce = report();

  assert.equal(workforce.safety.providerCalled, false);
  assert.equal(workforce.departments.some((department) => department.providerCalled), false);
  assert.equal(workforce.employees.some((employee) => employee.providerCalled), false);
});
