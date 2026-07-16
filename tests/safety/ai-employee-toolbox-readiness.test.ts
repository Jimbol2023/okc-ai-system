import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createAiEmployeeToolboxReadinessFromInputs,
  type AiEmployeeCertificationLevel,
} from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";

function report() {
  return createAiEmployeeToolboxReadinessFromInputs({
    workforce: createAiWorkforceReportFromInputs({ generatedAt: "2026-07-09T13:00:00.000Z" }),
    generatedAt: "2026-07-09T13:00:00.000Z",
  });
}

test("every AI employee has a toolbox and certification level", () => {
  const readiness = report();

  assert.equal(readiness.ok, true);
  assert.equal(readiness.company, "J Capital Property Group");
  assert.ok(readiness.employees.length >= 39);

  for (const employee of readiness.employees) {
    assert.ok(employee.toolbox.requiredTools.length > 0, employee.name);
    assert.ok(Array.isArray(employee.toolbox.optionalTools), employee.name);
    assert.ok(Array.isArray(employee.toolbox.connectedTools), employee.name);
    assert.ok(Array.isArray(employee.toolbox.missingTools), employee.name);
    assert.ok(Array.isArray(employee.toolbox.blockedTools), employee.name);
    assert.ok(employee.toolbox.connectorHealth.length >= employee.toolbox.requiredTools.length, employee.name);
    assert.equal(employee.toolbox.canProduceExternalWork, false);
    assert.ok(employee.certification.label, employee.name);
    assert.ok(employee.certification.explanation, employee.name);
    assert.ok(employee.certification.nextLevelRequirement, employee.name);
    assert.equal(employee.certification.externalExecutionBlocked, true);
  }
});

test("certification never grants external execution or autonomy in this sprint", () => {
  const readiness = report();
  const certificationLevels = readiness.employees.map((employee) => employee.certification.level);

  assert.equal(certificationLevels.some((level) => level >= 4), false);
  assert.equal(readiness.certificationDistribution[4 satisfies AiEmployeeCertificationLevel], 0);
  assert.equal(readiness.certificationDistribution[5 satisfies AiEmployeeCertificationLevel], 0);
  assert.equal(readiness.safety.externalExecutionAllowed, false);
  assert.equal(readiness.safety.externalProviderWritesAllowed, false);
});

test("department toolbox readiness rolls up employee tools", () => {
  const readiness = report();
  const departments = new Set(readiness.departments.map((department) => department.department));
  const design = readiness.departments.find((department) => department.department === "Design");
  const seo = readiness.departments.find((department) => department.department === "SEO");

  assert.equal(departments.size, 16);
  assert.ok(design);
  assert.ok(seo);
  assert.ok(design.employees > 0);
  assert.equal(design.externalExecutionAllowed, false);
  assert.equal(seo.externalExecutionAllowed, false);
  assert.ok(design.missingTools.length > 0 || design.connectedTools.length > 0);
});

test("connector matrix groups employees and identifies missing high-value tools", () => {
  const readiness = report();
  const canva = readiness.connectorMatrix.find((connector) => connector.connectorId === "canva");
  const gmail = readiness.connectorMatrix.find((connector) => connector.connectorId === "gmail");
  const blockedExternal = readiness.connectorMatrix.filter((connector) => connector.mode === "blocked");

  assert.ok(canva);
  assert.ok(gmail);
  assert.ok(canva.unlocksEmployees > 0);
  assert.ok(gmail.unlocksDepartments > 0);
  assert.ok(readiness.connectorMatrix.length > 0);
  assert.ok(blockedExternal.length > 0);
  assert.ok(readiness.highestRoiConnectorsToActivateNext.length > 0);
});

test("company operational readiness is calculated and external readiness remains constrained", () => {
  const readiness = report();
  const operational = readiness.companyOperationalReadiness;

  assert.ok(operational.workforce >= 0 && operational.workforce <= 100);
  assert.ok(operational.departments >= 0 && operational.departments <= 100);
  assert.equal(operational.operatingLoop, 100);
  assert.equal(operational.ceoReview, 100);
  assert.ok(operational.connectorReadiness >= 0 && operational.connectorReadiness <= 100);
  assert.ok(operational.externalReadiness >= 0 && operational.externalReadiness <= 35);
  assert.ok(operational.overall >= 0 && operational.overall <= 100);
});

test("toolbox readiness is read-only and makes no provider calls", () => {
  const readiness = report();

  assert.equal(readiness.safety.readOnly, true);
  assert.equal(readiness.safety.providerCalled, false);
  assert.equal(readiness.safety.liveExecutionAllowed, false);
  assert.equal(readiness.safety.oauthStarted, false);
  assert.equal(readiness.safety.credentialsChanged, false);
  assert.equal(readiness.employees.some((employee) => employee.providerCalled || employee.liveExecutionAllowed), false);
  assert.equal(readiness.employees.some((employee) => employee.toolbox.canProduceExternalWork), false);
});
