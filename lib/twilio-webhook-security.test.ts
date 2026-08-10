import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { verifyTwilioWebhookRequest } from "@/lib/twilio-webhook-security";

const config = {
  authToken: "test-webhook-auth-token",
  publicUrl: "https://preview.example.test/api/twilio/inbound-sms",
  accountSid: `AC${"a".repeat(32)}`,
  toNumber: "+14055550100",
  tenantId: "tenant-preview",
};
const validPayload = new URLSearchParams({
  MessageSid: `SM${"b".repeat(32)}`,
  AccountSid: config.accountSid,
  From: "+14055550101",
  To: config.toNumber,
  Body: "Please stop messaging me",
}).toString();

function request(body = validPayload, headers: Record<string, string> = {}) {
  return new Request(config.publicUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "x-twilio-signature": "mock-signature", ...headers },
    body,
  });
}

describe("Twilio webhook verification", () => {
  it("rejects unsigned requests", async () => {
    const result = await verifyTwilioWebhookRequest(request(validPayload, { "x-twilio-signature": "" }), { config, validate: () => true });
    assert.deepEqual(result, { ok: false, status: 403, reason: "signature_missing" });
  });

  it("rejects invalid signatures", async () => {
    const result = await verifyTwilioWebhookRequest(request(), { config, validate: () => false });
    assert.deepEqual(result, { ok: false, status: 403, reason: "signature_invalid" });
  });

  it("accepts a valid mocked signature against the configured public URL", async () => {
    let verifiedUrl = "";
    const result = await verifyTwilioWebhookRequest(request(), {
      config,
      validate: (_token, _signature, url) => { verifiedUrl = url; return true; },
    });
    assert.equal(result.ok, true);
    assert.equal(verifiedUrl, config.publicUrl);
    if (result.ok) assert.equal(result.tenantId, "tenant-preview");
  });

  it("rejects malformed and cross-tenant payloads", async () => {
    const malformed = await verifyTwilioWebhookRequest(request("Body=hello"), { config, validate: () => true });
    assert.equal(malformed.ok, false);
    const crossTenant = new URLSearchParams(validPayload);
    crossTenant.set("AccountSid", `AC${"c".repeat(32)}`);
    const mismatch = await verifyTwilioWebhookRequest(request(crossTenant.toString()), { config, validate: () => true });
    assert.deepEqual(mismatch, { ok: false, status: 403, reason: "tenant_boundary_mismatch" });
  });

  it("rejects oversized payloads before signature validation", async () => {
    let called = false;
    const result = await verifyTwilioWebhookRequest(request(`Body=${"a".repeat(70_000)}`), {
      config,
      validate: () => { called = true; return true; },
    });
    assert.deepEqual(result, { ok: false, status: 413, reason: "payload_too_large" });
    assert.equal(called, false);
  });
});
