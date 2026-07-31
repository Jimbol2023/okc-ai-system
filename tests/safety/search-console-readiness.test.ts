import assert from "node:assert/strict";
import test from "node:test";

import { getSearchConsoleReadinessPacket } from "@/lib/search-console-readiness";

test("Search Console readiness packet stays manual and read-only", () => {
  const packet = getSearchConsoleReadinessPacket();

  assert.equal(packet.schemaVersion, "search-console-readiness-v1");
  assert.equal(packet.siteUrl, "https://jcapitalpropertygroup.com");
  assert.equal(packet.sitemapUrl, "https://jcapitalpropertygroup.com/sitemap.xml");
  assert.equal(packet.robotsUrl, "https://jcapitalpropertygroup.com/robots.txt");
  assert.equal(packet.safety.providerCalled, false);
  assert.equal(packet.safety.externalWritesAllowed, false);
  assert.equal(packet.safety.sitemapSubmissionAutomated, false);
  assert.equal(packet.safety.indexingRequestAutomated, false);
  assert.equal(packet.safety.bingSubmissionAutomated, false);
});

test("Search Console readiness packet targets only the remaining manual submission URLs", () => {
  const packet = getSearchConsoleReadinessPacket();

  assert.deepEqual(packet.targetUrls, [
    "https://jcapitalpropertygroup.com/resources/shared-inherited-property-oklahoma",
    "https://jcapitalpropertygroup.com/edmond",
    "https://jcapitalpropertygroup.com/midwest-city",
    "https://jcapitalpropertygroup.com/moore",
  ]);
  assert.equal(packet.targetUrls.length, 4);
  assert.ok(!packet.targetUrls.includes("https://jcapitalpropertygroup.com/"));
  assert.ok(!packet.targetUrls.includes("https://jcapitalpropertygroup.com/resources"));
  assert.ok(!packet.targetUrls.includes("https://jcapitalpropertygroup.com/oklahoma-city"));

  assert.ok(packet.manualActivationSteps.some((step) => /Google Search Console/i.test(step)));
  assert.ok(packet.manualActivationSteps.some((step) => /Bing Webmaster Tools/i.test(step)));
  assert.ok(packet.baselineEvidenceFields.includes("indexed pages"));
});
