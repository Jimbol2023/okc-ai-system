import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { redactSecurityValue, securityLog } from "@/lib/security-log";

describe("security log redaction", () => {
  it("redacts nested secrets and common PII", () => {
    const value = redactSecurityValue({
      phone: "+14055550100",
      nested: { emailAddress: "owner@example.com", note: "Call +1 (405) 555-0100" },
      authorization: "Bearer secret-token",
      url: "postgresql://user:password@host/db",
    });
    const text = JSON.stringify(value);
    assert.doesNotMatch(text, /4055550100|owner@example\.com|secret-token|user:password/);
    assert.match(text, /redacted/);
  });

  it("never emits sensitive values through the structured logger", () => {
    const original = console.info;
    const records: string[] = [];
    console.info = (record) => records.push(String(record));
    try {
      securityLog("info", "test.event", { phone: "+14055550100", messageBody: "private seller message" });
    } finally {
      console.info = original;
    }
    assert.equal(records.length, 1);
    assert.doesNotMatch(records[0], /14055550100|private seller message/);
  });
});
