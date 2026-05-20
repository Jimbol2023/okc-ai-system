import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getSellerCallOutcomePlan } from "./seller-call-outcome-plan";

describe("seller call outcome persistence design", () => {
  it("keeps R19 planning-only with no persistence runtime", () => {
    const plan = getSellerCallOutcomePlan();
    const labels = plan.safetyLabels.join(" ");

    assert.equal(plan.status, "planning_only");
    assert.match(labels, /No write API/);
    assert.match(labels, /No schema changes/);
    assert.match(labels, /No DB writes/);
  });

  it("classifies every requested R19 field", () => {
    const plan = getSellerCallOutcomePlan();
    const classifiedFields = plan.persistenceClassifications.map((field) => field.field).sort();

    assert.deepEqual(classifiedFields, [
      "callCompletedAt",
      "followUpNeeded",
      "manualNextStep",
      "operatorSummary",
      "outcome",
      "priceExpectationSignal",
      "propertyConditionSignal",
      "reviewRequired",
      "safetyFlags",
      "sellerMotivationSignal",
      "sellerTimelineSignal",
    ]);
  });

  it("keeps persistence classifications out of execution paths", () => {
    const plan = getSellerCallOutcomePlan();

    for (const field of plan.persistenceClassifications) {
      assert.doesNotMatch(field.executionBoundary, /can trigger|will trigger|will send|will schedule|will approve/i);
      assert.match(field.executionBoundary, /cannot|never|only|must not/i);
    }
  });

  it("forbids provider, automation, approval, DNC, and schema responsibilities", () => {
    const plan = getSellerCallOutcomePlan();
    const futureBoundaryText = [
      ...plan.futureApiBoundary.forbiddenResponsibilities,
      ...plan.futureApiBoundary.requiredIsolation,
      ...plan.appendOnlyModelGuidance.forbiddenShape,
    ].join(" ");

    assert.match(futureBoundaryText, /No provider imports|provider/i);
    assert.match(futureBoundaryText, /No automation imports|automation/i);
    assert.match(futureBoundaryText, /approvalStatus|approval/i);
    assert.match(futureBoundaryText, /doNotContact|DNC/i);
    assert.doesNotMatch(futureBoundaryText, /add prisma model|run migration|create migration/i);
  });

  it("keeps DNC outcomes visible but non-mutating", () => {
    const plan = getSellerCallOutcomePlan();
    const dncOutcome = plan.outcomeDefinitions.find((outcome) => outcome.id === "do_not_contact");
    const dncSafetyText = plan.dncPersistenceSafety.items.join(" ");

    assert.ok(dncOutcome);
    assert.equal(dncOutcome.reviewRequired, true);
    assert.ok(dncOutcome.safetyFlags.includes("dnc_requested"));
    assert.match(dncSafetyText, /do not automatically mutate doNotContact/);
    assert.match(dncSafetyText, /do not trigger outreach changes/);
  });

  it("keeps free text bounded and rejected as a command channel", () => {
    const plan = getSellerCallOutcomePlan();
    const summaryField = plan.persistenceClassifications.find((field) => field.field === "operatorSummary");
    const validationText = plan.validationRules.map((rule) => `${rule.plannedRule} ${rule.failureBehavior}`).join(" ");

    assert.equal(summaryField?.scope, "bounded_free_text");
    assert.match(summaryField?.executionBoundary ?? "", /never automation input/);
    assert.match(validationText, /Reject credentials/);
    assert.match(validationText, /Reject language that instructs the system to send, call, schedule, approve, override, generate, import, or execute/);
  });
});
