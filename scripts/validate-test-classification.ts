import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const allowed = new Set(["maintained_unit", "safety", "migration", "integration", "browser_acceptance", "pressure", "provider_isolated", "quarantined_legacy"]);
const manifest = JSON.parse(readFileSync(resolve("tests/test-classification.json"), "utf8")) as {
  discovered: number;
  tests: Array<{ path: string; category: string; owner: string; quarantine?: Record<string, string> }>;
};
const discovered = readdirSync(resolve("lib"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.ts"))
  .map((entry) => `lib/${entry.name}`)
  .sort();
const listed = manifest.tests.map((test) => test.path);
const unique = new Set(listed);
const missing = discovered.filter((path) => !unique.has(path));
const stale = listed.filter((path) => !discovered.includes(path));
const duplicates = listed.filter((path, index) => listed.indexOf(path) !== index);
const invalid = manifest.tests.filter((test) => !allowed.has(test.category) || !test.owner.trim());
const invalidQuarantine = manifest.tests.filter((test) => test.category === "quarantined_legacy" && (!test.quarantine?.reason || !test.quarantine?.risk || !test.quarantine?.reviewDate || !test.quarantine?.recoveryPlan));

if (manifest.discovered !== discovered.length || missing.length || stale.length || duplicates.length || invalid.length || invalidQuarantine.length) {
  process.stderr.write(`${JSON.stringify({ discovered: discovered.length, declared: manifest.discovered, missing, stale, duplicates, invalid: invalid.map((test) => test.path), invalidQuarantine: invalidQuarantine.map((test) => test.path) }, null, 2)}\n`);
  process.exit(1);
}

const counts = Object.fromEntries([...allowed].map((category) => [category, manifest.tests.filter((test) => test.category === category).length]));
process.stdout.write(`${JSON.stringify({ status: "pass", discovered: discovered.length, classified: listed.length, counts })}\n`);
