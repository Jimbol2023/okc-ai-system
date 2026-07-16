import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

import { getInventoriedProviderBoundaryPaths, ueipProviderSurfaceInventory } from "@/lib/ueip-provider-surface-inventory";
import { listUniversalConnectorManifests } from "@/lib/universal-enterprise-integration-platform";

const root = process.cwd();
const providerPattern = /https:\/\/(?:api\.openai|api\.twilio|api\.canva|oauth2\.googleapis|gmail\.googleapis|searchconsole\.googleapis|analyticsdata\.googleapis|businessprofileperformance\.googleapis|mybusiness\.googleapis|youtubeanalytics\.googleapis|www\.googleapis\.com\/(?:webmasters|calendar|drive|upload|youtube))|process\.env\.[A-Z0-9_]*(?:TOKEN|SECRET|API_KEY|ACCOUNT_SID)|(?:from|require\()[\s(]*["'](?:twilio|openai|googleapis|@google|@aws-sdk|stripe)/;

function sourceFiles(directory: string): string[] {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [path] : [];
  });
}

test("every provider boundary is inventoried and department code cannot add an implicit provider path", () => {
  const inventoried = getInventoriedProviderBoundaryPaths();
  const detected = [...sourceFiles("app"), ...sourceFiles("lib")].filter((path) => providerPattern.test(readFileSync(join(root, path), "utf8")));
  const unclassified = detected.filter((path) => !inventoried.has(path));
  assert.deepEqual(unclassified, [], `Unclassified provider boundaries: ${unclassified.join(", ")}`);
});

test("inventory records have unique ids and mandatory ownership and migration evidence", () => {
  assert.equal(new Set(ueipProviderSurfaceInventory.map((record) => record.id)).size, ueipProviderSurfaceInventory.length);
  for (const record of ueipProviderSurfaceInventory) {
    assert.ok(record.owner && record.policyCoverage && record.auditCoverage && record.retirementDependency);
    assert.equal(relative(root, join(root, record.path)), record.path);
  }
});

test("UEIP manifests expose unique canonical capability keys", () => {
  for (const manifest of listUniversalConnectorManifests()) {
    const keys = manifest.capabilities.map((capability) => capability.capabilityKey);
    assert.equal(new Set(keys).size, keys.length, `Duplicate UEIP capability in ${manifest.connectorId}`);
    assert.ok(keys.every((key) => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(key)), `Invalid UEIP capability in ${manifest.connectorId}`);
  }
});
