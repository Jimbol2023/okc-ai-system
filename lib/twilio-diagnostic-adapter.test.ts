import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertTwilioDiagnosticCapability, executeTwilioDiagnosticRead, TwilioDiagnosticError, type TwilioDiagnosticCredential } from "@/lib/twilio-diagnostic-adapter";

const credential: TwilioDiagnosticCredential = { accountSid: `AC${"a".repeat(32)}`, apiKeySid: `SK${"b".repeat(32)}`, apiKeySecret: "restricted-test-secret" };

describe("Twilio read-only diagnostic adapter", () => {
  it("hard-denies unknown and external-action operations", () => {
    for (const operation of ["unknown", "send_sms", "send_message", "make_call", "buy_phone_number", "release_phone_number", "modify_phone_number", "modify_webhook", "modify_messaging_service", "modify_account", "modify_billing", "modify_security_settings", "retrieve_auth_token", "rotate_auth_token", "create_api_key", "delete_api_key", "outreach", "publishing", "crm_mutation", "external_execution"]) {
      assert.throws(() => assertTwilioDiagnosticCapability(operation), (error: unknown) => error instanceof TwilioDiagnosticError && error.code === "denied");
    }
  });

  it("uses one bounded GET and excludes message bodies and phone PII", async () => {
    let calls = 0;
    const result = await executeTwilioDiagnosticRead({ capability: "get_recent_message_delivery_metadata" }, credential, async (_url, init) => {
      calls += 1;
      assert.equal(init?.method, "GET");
      assert.equal(init?.cache, "no-store");
      assert.ok(String((init?.headers as Record<string, string>).authorization).startsWith("Basic "));
      return new Response(JSON.stringify({ messages: [{ sid: `SM${"c".repeat(32)}`, body: "SECRET MESSAGE BODY", from: "+14055550100", to: "+18559193366", direction: "inbound", status: "received", error_code: null, date_created: "Wed, 12 Aug 2026 12:00:00 +0000" }] }), { status: 200 });
    });
    const serialized = JSON.stringify(result);
    assert.equal(calls, 1);
    assert.doesNotMatch(serialized, /SECRET MESSAGE BODY|14055550100|18559193366/);
    assert.match(serialized, /deliveryStatus/);
  });

  it("redacts owned phone numbers and never returns credential material", async () => {
    const result = await executeTwilioDiagnosticRead({ capability: "list_owned_phone_numbers" }, credential, async () => new Response(JSON.stringify({ incoming_phone_numbers: [{ sid: `PN${"d".repeat(32)}`, phone_number: "+18559193366", capabilities: { sms: true } }] }), { status: 200 }));
    const serialized = JSON.stringify(result);
    assert.match(serialized, /\*\*\*3366/);
    assert.doesNotMatch(serialized, /18559193366|restricted-test-secret|SKb{32}/);
  });

  it("normalizes provider errors, rate limits, and invalid responses safely", async () => {
    await assert.rejects(executeTwilioDiagnosticRead({ capability: "get_twilio_account_identity" }, credential, async () => new Response("{}", { status: 429 })), (error: unknown) => error instanceof TwilioDiagnosticError && error.code === "rate_limited");
    await assert.rejects(executeTwilioDiagnosticRead({ capability: "get_twilio_account_identity" }, credential, async () => new Response("provider detail", { status: 500 })), (error: unknown) => error instanceof TwilioDiagnosticError && error.code === "provider_error" && !error.message.includes("provider detail"));
    await assert.rejects(executeTwilioDiagnosticRead({ capability: "get_twilio_account_identity" }, credential, async () => new Response("not-json", { status: 200 })), (error: unknown) => error instanceof TwilioDiagnosticError && error.code === "response_invalid");
  });

  it("fails closed on provider timeout", async () => {
    await assert.rejects(executeTwilioDiagnosticRead({ capability: "get_twilio_account_identity" }, credential, async () => { throw new DOMException("timed out", "TimeoutError"); }), (error: unknown) => error instanceof TwilioDiagnosticError && error.code === "timeout");
  });
});
