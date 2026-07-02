import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createInheritedPropertyCampaignDirective,
  getCompanyDepartmentRegistry,
  runCompanyOrchestrator,
  type ExecutiveDirective,
  type OpportunityQueueItem,
} from "./company-orchestrator";

describe("company orchestrator", () => {
  it("registers departments through the AI COO with shared business goals", () => {
    const departments = getCompanyDepartmentRegistry();
    const names = departments.map((department) => department.name);

    assert.ok(names.includes("Executive AI"));
    assert.ok(names.includes("Sales AI"));
    assert.ok(names.includes("County Records AI"));
    assert.ok(names.includes("Security & Governance AI"));
    assert.equal(departments.length, 21);

    for (const department of departments) {
      assert.ok(department.contributesTo.length > 0);
      assert.equal(department.approvalRequired, true);
      assert.equal(department.executionBoundary.communicatesThroughAiCoo, true);
      assert.equal(department.executionBoundary.providerCalled, false);
      assert.equal(department.executionBoundary.liveExecutionAllowed, false);
      assert.equal(department.executionBoundary.publishingBlocked, true);
      assert.equal(department.executionBoundary.scrapingBlocked, true);
      assert.equal(department.executionBoundary.outreachBlocked, true);
      assert.equal(department.executionBoundary.workflowExecutionBlocked, true);
    }
  });

  it("blocks department work until an executive directive is approved", () => {
    const directive: ExecutiveDirective = {
      ...createInheritedPropertyCampaignDirective(),
      approval_status: "awaiting_ceo_approval",
      approved_by: undefined,
      approved_at: undefined,
    };
    const report = runCompanyOrchestrator({ directive });

    assert.equal(report.approvalValid, false);
    assert.equal(report.workflowState, "blocked_awaiting_ceo_approval");
    assert.ok(report.departmentAssignments.every((assignment) => assignment.status === "blocked"));
    assert.ok(report.draftQueue.every((draft) => draft.status === "blocked_until_directive_approved"));
    assert.ok(report.blockedActions.some((action) => /not approved/i.test(action)));
    assert.equal(report.safety.providerCalled, false);
    assert.equal(report.safety.liveExecutionAllowed, false);
    assert.equal(report.safety.noDepartmentDirectCommunication, true);
  });

  it("can complete the approved inherited-property preparation workflow without execution", () => {
    const opportunities: OpportunityQueueItem[] = [
      {
        id: "opp-001",
        source: "County Records",
        address: "Manual review address",
        lead_score: 82,
        confidence: 80,
        estimated_value: "Manual estimate required",
        opportunity_type: "Inherited Property",
        motivation_signal: "Manual county record signal",
        recommended_action: "Route to Lead Intelligence AI for review.",
        status: "triage",
        sourceLabel: "county_records_manual_review",
        assumption: "No property facts are verified; human review required.",
        outreachAllowed: false,
      },
    ];
    const report = runCompanyOrchestrator({
      directive: createInheritedPropertyCampaignDirective(),
      opportunities,
    });

    assert.equal(report.approvalValid, true);
    assert.equal(report.workflowState, "approved_assignment_ready");
    assert.equal(report.opportunityQueue.totals.opportunities, 1);
    assert.equal(report.opportunityQueue.totals.readyForLeadIntelligence, 1);
    assert.ok(report.departmentAssignments.some((assignment) => assignment.department === "Marketing AI"));
    assert.ok(report.departmentAssignments.some((assignment) => assignment.department === "Brand Intelligence AI"));
    assert.ok(report.draftQueue.some((draft) => draft.output === "Website draft"));
    assert.ok(report.draftQueue.some((draft) => draft.output === "Canva brief"));
    assert.equal(report.reviewRoutes.brandReview, "Brand Intelligence AI");
    assert.equal(report.reviewRoutes.governanceReview, "Security & Governance AI");
    assert.equal(report.reviewRoutes.finalApprovalOwner, "CEO");
    assert.equal(report.safety.publishingBlocked, true);
    assert.equal(report.safety.outreachBlocked, true);
    assert.equal(report.safety.scrapingBlocked, true);
    assert.equal(report.safety.adsBlocked, true);
  });
});
