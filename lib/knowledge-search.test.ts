import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildKnowledgeSearchDocuments, normalizeKnowledgeSearchQuery, searchKnowledgeDocuments } from "@/lib/knowledge-search";
import type { KnowledgeItemRecord } from "@/lib/knowledge";

function item(input: Partial<KnowledgeItemRecord> & Pick<KnowledgeItemRecord, "id" | "title" | "content">): KnowledgeItemRecord {
  return {
    category: "sop",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    source: "test",
    status: "active",
    tags: [],
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...input,
  };
}

describe("knowledge search", () => {
  it("normalizes long and padded queries", () => {
    assert.equal(normalizeKnowledgeSearchQuery("  probate   seller  "), "probate seller");
    assert.equal(normalizeKnowledgeSearchQuery("x".repeat(140)).length, 120);
  });

  it("ranks exact title matches above content-only matches", () => {
    const documents = buildKnowledgeSearchDocuments({
      items: [
        item({
          id: "1",
          title: "Probate Seller SOP",
          content: "How to review inherited property seller context.",
        }),
        item({
          id: "2",
          title: "General Seller SOP",
          content: "This content mentions probate only once.",
        }),
      ],
      docReferences: [],
    });
    const results = searchKnowledgeDocuments({ query: "probate", documents });

    assert.equal(results[0].title, "Probate Seller SOP");
    assert.ok(results[0].matchReasons.includes("Matched title"));
    assert.equal(results[0].providerCalled, false);
    assert.equal(results[0].semanticSearchUsed, false);
  });

  it("uses probate synonyms to find inherited property references", () => {
    const documents = buildKnowledgeSearchDocuments({
      items: [],
      docReferences: [
        {
          title: "Inherited Property Video Strategy",
          category: "marketing_template",
          path: "docs/video-production/inherited-property-video-strategy.md",
          summary: "Educational video planning notes for inherited property content.",
        },
      ],
    });
    const results = searchKnowledgeDocuments({ query: "probate", documents });

    assert.equal(results[0].title, "Inherited Property Video Strategy");
    assert.ok(results[0].matchReasons.includes("Matched title") || results[0].matchReasons.includes("Matched summary"));
  });

  it("searches documentation paths and summaries", () => {
    const documents = buildKnowledgeSearchDocuments({
      items: [],
      docReferences: [
        {
          title: "Google Business Profile Readiness",
          category: "marketing_template",
          path: "docs/seo-market-launch/GOOGLE-BUSINESS-PROFILE-READINESS.md",
          summary: "Manual local visibility checklist for business profile readiness.",
        },
      ],
    });
    const results = searchKnowledgeDocuments({ query: "GBP marketing", documents });

    assert.equal(results[0].title, "Google Business Profile Readiness");
    assert.ok(results[0].score > 0);
  });
});
