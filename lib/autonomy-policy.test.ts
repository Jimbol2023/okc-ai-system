import assert from "node:assert/strict";
import test from "node:test";

import { evaluateAutonomyPolicy, leadQualificationActionKey, leadQualificationLane, leadQualificationTaskType } from "@/lib/autonomy-policy";

const policy = {
  tenantId: "default", policyKey: "p", lane: leadQualificationLane, actionKey: leadQualificationActionKey,
  maxAutonomyLevel: 2, effect: "allow", approvalRequired: false, quotaPerDay: 50, killSwitchEnabled: false,
  allowedActions: [leadQualificationActionKey], blockedActions: ["send_sms"],
  requiredEvidence: ["stored_lead", "source_attribution", "revenue_score", "no_dnc_or_opt_out"],
};
const base = { policy, tenantId: "default", requestedAction: leadQualificationActionKey, requestedTaskType: leadQualificationTaskType, requestedLevel: 2, evidence: policy.requiredEvidence, usedToday: 0 };

test("allows only the explicitly governed Level-2 internal task", () => assert.equal(evaluateAutonomyPolicy(base).allowed, true));
test("denies Level 3 and above", () => assert.deepEqual(evaluateAutonomyPolicy({ ...base, requestedLevel: 3 }), { allowed: false, decision: "denied", reason: "level_3_and_above_blocked" }));
test("fails closed for tenant mismatch, kill switch, quota, missing evidence, and task allowlist", () => {
  assert.equal(evaluateAutonomyPolicy({ ...base, tenantId: "other" }).allowed, false);
  assert.equal(evaluateAutonomyPolicy({ ...base, policy: { ...policy, killSwitchEnabled: true } }).allowed, false);
  assert.equal(evaluateAutonomyPolicy({ ...base, usedToday: 50 }).allowed, false);
  assert.equal(evaluateAutonomyPolicy({ ...base, evidence: ["stored_lead"] }).allowed, false);
  assert.equal(evaluateAutonomyPolicy({ ...base, requestedTaskType: "send_sms" }).allowed, false);
});
