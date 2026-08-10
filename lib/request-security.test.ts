import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isSameOriginBrowserRequest } from "@/lib/request-security";

describe("browser request origin policy", () => {
  it("allows same-origin and rejects cross-site mutations", () => {
    assert.equal(isSameOriginBrowserRequest(new Request("https://app.example.test/api", { headers: { origin: "https://app.example.test" } })), true);
    assert.equal(isSameOriginBrowserRequest(new Request("https://app.example.test/api", { headers: { origin: "https://evil.example", "sec-fetch-site": "cross-site" } })), false);
  });

  it("uses the governed external host instead of an internal framework URL", () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      headers: { host: "127.0.0.1:3041", origin: "http://127.0.0.1:3041" },
    });
    assert.equal(isSameOriginBrowserRequest(request), true);
  });

  it("rejects mismatched origins and malformed forwarded hosts", () => {
    assert.equal(isSameOriginBrowserRequest(new Request("https://preview.example/api", {
      headers: { host: "preview.example", origin: "https://attacker.invalid" },
    })), false);
    assert.equal(isSameOriginBrowserRequest(new Request("https://preview.example/api", {
      headers: { "x-forwarded-host": "preview.example/path", origin: "https://preview.example" },
    })), false);
  });
});
