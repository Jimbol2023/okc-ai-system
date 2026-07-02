import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createDepartmentIntelligenceReportFromEvents,
  createDepartmentMemoryPlan,
  decisionReasonTemplates,
} from "./department-intelligence";
import { createInheritedPropertyCampaignDirective } from "./company-orchestrator";

describe("Department Intelligence", () => {
  it("creates Department Memory records for all CEO decision paths without external execution", () => {
    const directive = createInheritedPropertyCampaignDirective();

    for (const decision of ["approve", "reject", "request_changes", "defer"] as const) {
      const events = createDepartmentMemoryPlan({ directive, decision, note: "CEO review note" });

      assert.ok(events.length >= 1);
      assert.ok(events.some((event) => event.eventType === "ceo_decision"));
      assert.ok(events.every((event) => event.evidenceLabels.includes(`executive_directive:${directive.id}`)));
      assert.ok(events.every((event) => event.assumptions.some((assumption) => /No campaign performance/i.test(assumption))));
    }
  });

  it("approval creates assignment and draft memory keys without claiming campaign performance", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const events = createDepartmentMemoryPlan({ directive, decision: "approve" });

    assert.ok(events.some((event) => event.memoryKey === "directive:campaign-001:assignment:Marketing AI"));
    assert.ok(events.some((event) => event.memoryKey === "directive:campaign-001:draft:Website draft"));
    assert.ok(events.some((event) => event.department === "SEO AI"));
    assert.ok(events.some((event) => event.department === "Design AI"));
    assert.ok(events.every((event) => event.outcome === "approved_internal_workflow" || event.outcome === "outcome_pending"));
  });

  it("reject and defer do not create department assignments or draft memory", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const rejected = createDepartmentMemoryPlan({ directive, decision: "reject", note: "Low ROI" });
    const deferred = createDepartmentMemoryPlan({ directive, decision: "defer" });

    assert.equal(rejected.some((event) => event.eventType === "department_assignment"), false);
    assert.equal(rejected.some((event) => event.eventType === "draft_queue_item"), false);
    assert.equal(deferred.some((event) => event.eventType === "department_assignment"), false);
    assert.equal(deferred.some((event) => event.eventType === "draft_queue_item"), false);
  });

  it("summarizes department memory with outcome-pending labels and safety flags", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const events = createDepartmentMemoryPlan({ directive, decision: "approve" });
    const report = createDepartmentIntelligenceReportFromEvents(events, "2026-07-02T12:00:00.000Z");
    const marketing = report.departments.find((department) => department.department === "Marketing AI");

    assert.equal(report.generatedAt, "2026-07-02T12:00:00.000Z");
    assert.ok(report.topRecommendations.length > 0);
    assert.equal(marketing?.memoryStatus, "outcome_pending");
    assert.ok(marketing?.latestLesson.includes("Department work starts"));
    assert.equal(report.safety.providerCalled, false);
    assert.equal(report.safety.liveExecutionAllowed, false);
    assert.equal(report.safety.published, false);
    assert.equal(report.safety.sent, false);
    assert.equal(report.safety.outreachBlocked, true);
  });

  it("exposes decision reason templates for CEO review", () => {
    assert.ok(decisionReasonTemplates.approve.includes("High ROI"));
    assert.ok(decisionReasonTemplates.request_changes.includes("Brand risk"));
    assert.ok(decisionReasonTemplates.reject.includes("Low revenue value"));
    assert.ok(decisionReasonTemplates.defer.includes("Awaiting outcome data"));
  });
});
