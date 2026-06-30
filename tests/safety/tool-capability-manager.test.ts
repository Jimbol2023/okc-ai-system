import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateSafeAutomation, getSafeAutoDefaults } from "@/lib/safe-auto-mode";
import { listToolCapabilities, selectToolForAction } from "@/lib/tool-capability-manager";

test("tool registry exposes required enterprise capability fields", () => {
  const tools = listToolCapabilities();
  const canva = tools.find((tool) => tool.toolKey === "canva");

  assert.ok(canva);
  assert.equal(canva.providerCallsAllowed, false);
  assert.ok(canva.authenticationMethod);
  assert.ok(canva.requiredPermissions.length > 0);
  assert.ok(canva.supportedActions.length > 0);
  assert.ok(canva.retryPolicy);
  assert.ok(canva.owner);
  assert.ok(canva.approvalRequirements.length > 0);
});

test("Canva flyer request remains internal and approval gated", () => {
  const decision = selectToolForAction({
    requestedAction: "create_flyer_brief",
    preferredToolKey: "canva",
    module: "Executive AI",
  });

  assert.equal(decision.selectedToolKey, "canva");
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.liveExecutionAllowed, false);
  assert.equal(decision.approvalRequired, true);
});

test("ATTOM unavailable falls back to county assessor for ownership verification", () => {
  const decision = selectToolForAction({
    requestedAction: "verify_ownership",
    preferredToolKey: "attom",
    module: "Property Intelligence AI",
  });

  assert.equal(decision.decision, "fallback_selected");
  assert.equal(decision.selectedToolKey, "county_assessor");
  assert.equal(decision.fallbackToolKey, "county_assessor");
  assert.equal(decision.providerCalled, false);
});

test("Twilio rate limit queues safe fallback instead of sending", () => {
  const decision = selectToolForAction({
    requestedAction: "queue_sms_draft",
    preferredToolKey: "twilio",
    module: "Revenue Spine",
  });

  assert.equal(decision.decision, "fallback_selected");
  assert.equal(decision.selectedToolKey, "manual_follow_up_task");
  assert.equal(decision.liveExecutionAllowed, false);
});

test("Safe Auto Internal blocks external sending and allows internal prep", () => {
  const defaults = getSafeAutoDefaults();
  const internal = evaluateSafeAutomation({
    requestedAction: "create_flyer_brief",
    preferredToolKey: "canva",
    module: "Marketing AI",
  });
  const blocked = evaluateSafeAutomation({
    requestedAction: "send_sms",
    preferredToolKey: "twilio",
    module: "Revenue Spine",
  });

  assert.equal(defaults.autoExternalProviderCalls, false);
  assert.equal(internal.status, "auto_allowed_internal");
  assert.equal(internal.providerCalled, false);
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.sent, false);
});

test("approved macro registry can summarize internal signals without provider calls", () => {
  const decision = selectToolForAction({
    requestedAction: "summarize_macro_signal",
    preferredToolKey: "approved_news_registry",
    module: "Executive AI",
  });

  assert.equal(decision.selectedToolKey, "approved_news_registry");
  assert.equal(decision.decision, "selected_draft_only");
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.liveExecutionAllowed, false);
});
