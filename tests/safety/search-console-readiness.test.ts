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

test("Search Console readiness packet covers priority public URLs", () => {
  const packet = getSearchConsoleReadinessPacket();

  for (const url of [
    "https://jcapitalpropertygroup.com/",
    "https://jcapitalpropertygroup.com/resources",
    "https://jcapitalpropertygroup.com/resources/inherited-property-oklahoma",
    "https://jcapitalpropertygroup.com/oklahoma-city",
    "https://jcapitalpropertygroup.com/yukon",
    "https://jcapitalpropertygroup.com/moore",
    "https://jcapitalpropertygroup.com/norman",
    "https://jcapitalpropertygroup.com/edmond",
    "https://jcapitalpropertygroup.com/midwest-city"
  ]) {
    assert.ok(packet.targetUrls.includes(url));
  }

  assert.ok(packet.manualActivationSteps.some((step) => /Google Search Console/i.test(step)));
  assert.ok(packet.manualActivationSteps.some((step) => /Bing Webmaster Tools/i.test(step)));
  assert.ok(packet.baselineEvidenceFields.includes("indexed pages"));
});
