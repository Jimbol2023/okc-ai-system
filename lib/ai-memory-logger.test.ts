import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeAiMemoryPayload } from "@/lib/ai-memory-logger";

test("sanitizeAiMemoryPayload removes sensitive metadata and keeps safe outcome fields", () => {
  const payload = sanitizeAiMemoryPayload({
    leadId: "lead_123",
    eventType: "conversion_event",
    source: "unit_test",
    outcome: "closed",
    metadata: {
      apiKey: "secret",
      nested: {
        password: "secret",
        visible: "kept",
      },
      token: "secret",
      whatHappened: "Lead closed.",
    },
  });

  assert.equal(payload.leadId, "lead_123");
  assert.equal(payload.eventType, "conversion_event");
  assert.equal(payload.outcome, "closed");
  assert.deepEqual(payload.metadata, {
    nested: {
      visible: "kept",
    },
    whatHappened: "Lead closed.",
  });
});

test("sanitizeAiMemoryPayload trims oversized text fields", () => {
  const payload = sanitizeAiMemoryPayload({
    eventType: "x".repeat(200),
    source: "unit_test",
    humanFinalReply: "y".repeat(2_100),
  });

  assert.equal(payload.eventType?.length, 120);
  assert.equal(payload.humanFinalReply?.length, 2_000);
});
