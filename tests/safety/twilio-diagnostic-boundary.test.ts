import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Twilio diagnostic API is authenticated, tenant-derived, no-store, and contains no send path", () => {
  const readiness = readFileSync("app/api/company/connectors/twilio/diagnostic-readiness/route.ts", "utf8");
  const authorization = readFileSync("app/api/company/connectors/twilio/preview-authorization/route.ts", "utf8");
  const read = readFileSync("app/api/company/connectors/twilio/preview-read/route.ts", "utf8");
  for (const source of [readiness, authorization, read]) {
    assert.match(source, /getAuthenticatedRequestContext/);
    assert.match(source, /Cache-Control/);
    assert.doesNotMatch(source, /process\.env\.TWILIO|send|messages\.create|calls\.create/);
  }
  assert.doesNotMatch(read, /input\.tenantId/);
  assert.match(read, /tenantId: actor\.tenantId/);
});

test("Twilio diagnostic adapter permits only GET and strips message bodies", () => {
  const adapter = readFileSync("lib/twilio-diagnostic-adapter.ts", "utf8");
  assert.match(adapter, /method: "GET"/);
  assert.doesNotMatch(adapter, /method: "POST"|method: "PUT"|method: "PATCH"|method: "DELETE"/);
  assert.doesNotMatch(adapter, /row\.body|body: row|row\.from|row\.to/);
  for (const denied of ["send_sms", "make_call", "buy_phone_number", "modify_webhook", "retrieve_auth_token", "create_api_key"]) assert.match(adapter, new RegExp(denied));
});
