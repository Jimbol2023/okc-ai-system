import assert from "node:assert/strict";
import test from "node:test";

import { createApiErrorBody, createApiSuccessBody } from "@/lib/api-response";

test("createApiSuccessBody includes ok and provider safety flag", () => {
  const body = createApiSuccessBody({ items: [1, 2, 3] });

  assert.equal(body.ok, true);
  assert.equal(body.providerCalled, false);
  assert.deepEqual(body.items, [1, 2, 3]);
});

test("createApiErrorBody includes scoped data gaps when provided", () => {
  const body = createApiErrorBody("Partial data available.", ["Finance records could not be loaded."]);

  assert.equal(body.ok, false);
  assert.equal(body.providerCalled, false);
  assert.equal(body.error, "Partial data available.");
  assert.deepEqual(body.dataGaps, ["Finance records could not be loaded."]);
});
