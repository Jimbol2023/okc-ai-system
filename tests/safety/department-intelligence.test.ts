import assert from "node:assert/strict";
import test from "node:test";

import {
  createDepartmentIntelligenceReportFromEvents,
  createDepartmentMemoryPlan,
} from "@/lib/department-intelligence";
import { createInheritedPropertyCampaignDirective } from "@/lib/company-orchestrator";

test("Department Intelligence remains advisory and blocks external execution", () => {
  const events = createDepartmentMemoryPlan({
    directive: createInheritedPropertyCampaignDirective(),
    decision: "approve",
  });
  const report = createDepartmentIntelligenceReportFromEvents(events);

  assert.equal(report.safety.providerCalled, false);
  assert.equal(report.safety.liveExecutionAllowed, false);
  assert.equal(report.safety.published, false);
  assert.equal(report.safety.sent, false);
  assert.equal(report.safety.outreachBlocked, true);
  assert.equal(report.safety.workflowExecutionBlocked, true);
  assert.equal(report.safety.scrapingBlocked, true);
  assert.equal(report.safety.adsBlocked, true);
  assert.equal(report.safety.emailBlocked, true);
  assert.equal(report.safety.smsBlocked, true);
  assert.ok(report.departments.every((department) => department.safety.approvalRequired));
  assert.ok(report.topRecommendations.every((recommendation) => recommendation.approvalRequired));
});

test("Department Intelligence does not invent campaign performance outcomes", () => {
  const events = createDepartmentMemoryPlan({
    directive: createInheritedPropertyCampaignDirective(),
    decision: "approve",
  });

  assert.ok(events.every((event) => event.outcome === "approved_internal_workflow" || event.outcome === "outcome_pending"));
  assert.ok(events.every((event) => event.assumptions.some((assumption) => /No campaign performance/i.test(assumption))));
});
