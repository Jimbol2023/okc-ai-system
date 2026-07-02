import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createInheritedPropertyCampaignDirective,
  getCompanyDepartmentRegistry,
  listExecutiveDirectives,
  runCompanyOrchestrator,
  startDailyCompanyOperatingSession,
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
    const directive: ExecutiveDirective = createInheritedPropertyCampaignDirective();
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
    const directive: ExecutiveDirective = {
      ...createInheritedPropertyCampaignDirective(),
      approval_status: "approved",
      approved_by: "Moses Adebajo",
      approved_at: "manual-test-approval",
    };
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
      directive,
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

  it("registers activation directives as CEO approval gated", () => {
    const directives = listExecutiveDirectives();

    assert.deepEqual(directives.map((directive) => directive.id), [
      "campaign-001",
      "directive-brand-readiness-review",
      "directive-content-refresh-review",
      "directive-lead-source-quality-review",
    ]);
    assert.ok(directives.every((directive) => directive.approval_status === "awaiting_ceo_approval"));
    assert.ok(directives[0]?.governance_notes.some((note) => note.includes("https://jcapitalpropertygroup.com/resources/inherited-property-oklahoma")));
  });

  it("starts a daily company operating session without external execution", () => {
    const session = startDailyCompanyOperatingSession({
      date: "2026-07-03T08:00:00.000Z",
      providerReadiness: { ready: 2, missing: 3 },
    });

    assert.equal(session.ok, true);
    assert.equal(session.companyOperatingMode, "daily_startup_ready");
    assert.equal(session.date, "2026-07-03T08:00:00.000Z");
    assert.equal(session.active_executive_directives[0]?.id, "campaign-001");
    assert.equal(session.active_executive_directives[0]?.approval_status, "awaiting_ceo_approval");
    assert.equal(session.campaign_queue_summary.awaiting_ceo_approval, 4);
    assert.equal(session.draft_queue_summary.blocked, 4);
    assert.equal(session.approval_queue_summary.total, 4);
    assert.ok(session.blocked_items.some((item) => /No department work starts/i.test(item)));
    assert.ok(session.ceo_decision_agenda.some((item) => item.title.includes("Inherited Property") && item.recommended_action === "approve"));
    assert.ok(session.ceo_decision_agenda.every((item) => item.approval_required));
    assert.equal(session.provider_readiness.providerCalled, false);
    assert.equal(session.provider_readiness.liveExecutionAllowed, false);
    assert.equal(session.safety.providerCalled, false);
    assert.equal(session.safety.liveExecutionAllowed, false);
    assert.equal(session.safety.publishingBlocked, true);
    assert.equal(session.safety.emailBlocked, true);
    assert.equal(session.safety.smsBlocked, true);
    assert.equal(session.safety.scrapingBlocked, true);
    assert.equal(session.safety.adsBlocked, true);
    assert.equal(session.safety.outreachBlocked, true);
    assert.equal(session.safety.workflowExecutionBlocked, true);
    assert.equal(session.safety.recommendationsOnly, true);
  });
});
