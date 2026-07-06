import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDirectiveDecisionPlan, scoreExecutiveDirective } from "./company-activation";
import { createInitialDraftWorkspaceFields } from "./company-draft-workspace";
import { createInheritedPropertyCampaignDirective } from "./company-orchestrator";

describe("AI company activation", () => {
  it("scores Campaign 001 as a high-ROI internal directive", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const score = scoreExecutiveDirective(directive);

    assert.equal(score.qualifiedLeadPotential, 28);
    assert.equal(score.brandValue, 22);
    assert.ok(score.total >= 90);
  });

  it("plans approval as internal work assignment and draft queue generation only", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const plan = createDirectiveDecisionPlan(directive, "approve");

    assert.equal(plan.resultingStatus, "executive_approved");
    assert.equal(plan.workflowState, "draft_queue_populated");
    assert.deepEqual(plan.assignmentDepartments, directive.assigned_departments);
    assert.deepEqual(plan.draftOutputs, directive.requested_outputs);
    assert.equal(plan.revisionTaskRequired, false);
    assert.equal(plan.safetyFlags.providerCalled, false);
    assert.equal(plan.safetyFlags.liveExecutionAllowed, false);
    assert.equal(plan.safetyFlags.published, false);
    assert.equal(plan.safetyFlags.sent, false);
    assert.equal(plan.safetyFlags.outreachBlocked, true);
    assert.equal(plan.safetyFlags.workflowExecutionBlocked, true);
    assert.equal(plan.safetyFlags.scrapingBlocked, true);
    assert.equal(plan.safetyFlags.adsBlocked, true);
    assert.equal(plan.safetyFlags.emailBlocked, true);
    assert.equal(plan.safetyFlags.smsBlocked, true);
  });

  it("creates internal-only draft workspace fields for activation draft queue items", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const fields = createInitialDraftWorkspaceFields({
      output: directive.requested_outputs[0],
      ownerDepartment: directive.assigned_departments[0],
      directive: {
        id: directive.id,
        title: directive.title,
        businessGoal: directive.business_goal,
        expectedBusinessValue: directive.expected_business_value,
      },
      sourceLabel: `executive_directive:${directive.id}`,
    });

    assert.equal(fields.title, directive.requested_outputs[0]);
    assert.equal(fields.approvalStatus, "pending_ceo_review");
    assert.equal(fields.revisionCount, 0);
    assert.equal(fields.metadata.sourceLabel, "executive_directive:campaign-001");
    assert.ok(fields.knowledgeTrace.some((entry) => entry.type === "knowledge_pack"));
    assert.ok(fields.knowledgeTrace.some((entry) => entry.type === "source_registry_entry"));
    assert.ok(fields.executiveSummary.includes("blocked from publishing"));
  });

  it("routes request changes back to Executive AI without creating drafts", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const plan = createDirectiveDecisionPlan(directive, "request_changes");

    assert.equal(plan.resultingStatus, "changes_requested");
    assert.equal(plan.workflowState, "changes_requested");
    assert.deepEqual(plan.assignmentDepartments, []);
    assert.deepEqual(plan.draftOutputs, []);
    assert.equal(plan.revisionTaskRequired, true);
    assert.equal(plan.safetyFlags.providerCalled, false);
  });

  it("rejects and defers directives without activating departments", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const rejected = createDirectiveDecisionPlan(directive, "reject");
    const deferred = createDirectiveDecisionPlan(directive, "defer");

    assert.equal(rejected.resultingStatus, "rejected");
    assert.equal(rejected.workflowState, "closed_rejected");
    assert.deepEqual(rejected.assignmentDepartments, []);
    assert.deepEqual(rejected.draftOutputs, []);

    assert.equal(deferred.resultingStatus, "deferred");
    assert.equal(deferred.workflowState, "deferred");
    assert.deepEqual(deferred.assignmentDepartments, []);
    assert.deepEqual(deferred.draftOutputs, []);
    assert.equal(deferred.safetyFlags.liveExecutionAllowed, false);
  });
});
