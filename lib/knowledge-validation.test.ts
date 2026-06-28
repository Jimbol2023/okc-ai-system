import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createFinanceEntrySchema } from "./validations/finance";
import { createKnowledgeItemSchema } from "./validations/knowledge";

describe("finance and knowledge validation", () => {
  it("accepts a valid manual finance entry", () => {
    const parsed = createFinanceEntrySchema.safeParse({
      entryType: "marketing_spend",
      category: "paid_ads",
      source: "website",
      amount: "125.50",
      entryDate: "2026-06-28",
      notes: "Manual spend entry for KPI tracking.",
    });

    assert.equal(parsed.success, true);
  });

  it("rejects invalid finance categories", () => {
    const parsed = createFinanceEntrySchema.safeParse({
      entryType: "marketing_spend",
      category: "unapproved_category",
      source: "website",
      amount: 10,
      entryDate: "2026-06-28",
      notes: "Manual spend entry.",
    });

    assert.equal(parsed.success, false);
  });

  it("accepts a valid knowledge item", () => {
    const parsed = createKnowledgeItemSchema.safeParse({
      title: "Seller call opening SOP",
      category: "sop",
      content: "Use this internal SOP to prepare for a seller call. Verify facts manually before relying on them.",
      tags: ["seller", "calls"],
      status: "active",
      source: "manual",
    });

    assert.equal(parsed.success, true);
  });

  it("rejects short knowledge content", () => {
    const parsed = createKnowledgeItemSchema.safeParse({
      title: "Prompt",
      category: "ai_prompt",
      content: "Too short",
      tags: [],
      status: "active",
      source: "manual",
    });

    assert.equal(parsed.success, false);
  });
});
