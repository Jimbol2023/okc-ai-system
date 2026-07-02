import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createCorePlatformRegistryReport } from "./core-platform-registry";

describe("core platform registry", () => {
  it("registers official AI departments with approval-first execution boundaries", () => {
    const report = createCorePlatformRegistryReport();
    const departmentNames = report.aiDepartments.map((department) => department.name);

    assert.equal(report.totals.aiDepartments, 21);
    assert.ok(departmentNames.includes("Executive AI"));
    assert.ok(departmentNames.includes("Revenue AI"));
    assert.ok(departmentNames.includes("Marketing AI"));
    assert.ok(departmentNames.includes("Content Intelligence AI"));
    assert.ok(departmentNames.includes("Sales AI"));
    assert.ok(departmentNames.includes("County Records AI"));
    assert.ok(departmentNames.includes("Driving for Dollars AI"));
    assert.ok(departmentNames.includes("Google Maps AI"));
    assert.ok(departmentNames.includes("Government & Policy AI"));
    assert.ok(departmentNames.includes("News Intelligence AI"));
    assert.ok(departmentNames.includes("Market Research AI"));
    assert.ok(departmentNames.includes("Approval AI"));
    assert.ok(departmentNames.includes("Security & Governance AI"));

    for (const department of report.aiDepartments) {
      assert.equal(department.approvalRequired, true);
      assert.equal(department.executionBoundary.advisoryOnly, true);
      assert.equal(department.executionBoundary.providerCalled, false);
      assert.equal(department.executionBoundary.liveExecutionAllowed, false);
      assert.equal(department.executionBoundary.publishingBlocked, true);
      assert.equal(department.executionBoundary.scrapingBlocked, true);
      assert.equal(department.executionBoundary.outreachBlocked, true);
      assert.equal(department.executionBoundary.communicatesThroughAiCoo, true);
      assert.equal(department.executionBoundary.workflowExecutionBlocked, true);
      assert.ok(department.purpose.length > 0);
      assert.ok(department.responsibilities.length > 0);
      assert.ok(department.outputs.length > 0);
    }
  });

  it("exposes marketing platforms as readiness-only registry entries", () => {
    const report = createCorePlatformRegistryReport();
    const labels = report.providerRegistry.map((provider) => provider.displayName);

    assert.ok(labels.includes("Website"));
    assert.ok(labels.includes("Google Business Profile"));
    assert.ok(labels.includes("Facebook Business"));
    assert.ok(labels.includes("Instagram Business"));
    assert.ok(labels.includes("LinkedIn"));
    assert.ok(labels.includes("Pinterest Business"));
    assert.ok(labels.includes("YouTube"));
    assert.ok(labels.includes("X (@JcapitalPG)"));
    assert.ok(labels.includes("TikTok"));

    for (const provider of report.providerRegistry) {
      assert.equal(provider.manualPublishing, true);
      assert.equal(provider.publishingMode, "MANUAL");
      assert.equal(provider.approvalRequired, "CEO APPROVAL REQUIRED");
      assert.equal(provider.providerCalled, false);
      assert.equal(provider.liveExecutionAllowed, false);
      assert.ok(provider.readinessScore >= 0 && provider.readinessScore <= 100);
    }
  });
});
