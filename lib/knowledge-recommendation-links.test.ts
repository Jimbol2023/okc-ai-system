import assert from "node:assert/strict";
import test from "node:test";

import { findRecommendationKnowledgeLinks, getKnownRecommendationTopics } from "@/lib/knowledge-recommendation-links";

test("getKnownRecommendationTopics recognizes core recommendation subjects", () => {
  assert.deepEqual(getKnownRecommendationTopics("Probate follow-up needs provider readiness review"), [
    "follow_up",
    "probate",
    "provider_readiness",
  ]);
});

test("findRecommendationKnowledgeLinks returns Knowledge Hub references for matching topics", () => {
  const links = findRecommendationKnowledgeLinks({
    text: "Inherited probate leads need follow-up timing guidance.",
    knowledgeItems: [],
  });

  assert.ok(links.some((link) => /Inherited Property/i.test(link.title)));
  assert.ok(links.every((link) => link.href === "/dashboard/knowledge"));
});
