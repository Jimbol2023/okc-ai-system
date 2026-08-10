import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Twilio webhook verifies and claims replay receipt before business mutation", () => {
  const source = readFileSync("app/api/twilio/inbound-sms/route.ts", "utf8");
  const verifyAt = source.indexOf("verifyTwilioWebhookRequest(request)");
  const claimAt = source.indexOf("claimWebhookReceipt(");
  const leadReadAt = source.indexOf("prisma.lead.findFirst");
  const leadWriteAt = source.indexOf("prisma.lead.update");
  assert.ok(verifyAt >= 0 && claimAt > verifyAt && leadReadAt > claimAt && leadWriteAt > leadReadAt);
  assert.doesNotMatch(source, /console\.(?:log|info|warn|error)\s*\(/);
  assert.doesNotMatch(source, /securityLog\([^\n]+(?:rawPhone|messageBody|fromPhone)/);
});
