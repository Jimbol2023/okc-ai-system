import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const shardCount = Math.max(1, Number.parseInt(process.env.TEST_SHARD_COUNT ?? "1", 10));
const shardIndex = Math.max(0, Number.parseInt(process.env.TEST_SHARD_INDEX ?? "0", 10));
const batchSize = Math.min(50, Math.max(1, Number.parseInt(process.env.TEST_BATCH_SIZE ?? "25", 10)));
const batchTimeoutMs = Math.max(30_000, Number.parseInt(process.env.TEST_BATCH_TIMEOUT_MS ?? "180000", 10));
if (!Number.isInteger(shardCount) || !Number.isInteger(shardIndex) || shardIndex >= shardCount) throw new Error("invalid_test_shard");

const allTests = readdirSync(resolve("lib"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.ts"))
  .map((entry) => `lib/${entry.name}`)
  .sort();
const selected = allTests.filter((_, index) => index % shardCount === shardIndex);
if (selected.length === 0) throw new Error("test_shard_is_empty");

process.stdout.write(`${JSON.stringify({ discovered: allTests.length, selected: selected.length, shardIndex, shardCount, batchSize })}\n`);
const nodeTests = selected.filter((file) => /(?:from|require\()\s*["']node:test["']/.test(readFileSync(file, "utf8")));
const vitestTests = selected.filter((file) => !nodeTests.includes(file));
process.stdout.write(`${JSON.stringify({ nodeTests: nodeTests.length, vitestTests: vitestTests.length })}\n`);

const groups = [
  { name: "node", files: nodeTests, args: (batch: string[]) => ["--import", "tsx", "--test", ...batch] },
  { name: "vitest", files: vitestTests, args: (batch: string[]) => [resolve("node_modules/vitest/vitest.mjs"), "run", "--globals", "--reporter=dot", "--maxWorkers=4", ...batch] },
];

let failed = false;
for (const group of groups) {
  for (let offset = 0; offset < group.files.length; offset += batchSize) {
    const batch = group.files.slice(offset, offset + batchSize);
    process.stdout.write(`${JSON.stringify({ framework: group.name, batch: offset / batchSize, files: batch.length })}\n`);
    const result = spawnSync(process.execPath, group.args(batch), { cwd: process.cwd(), env: process.env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: batchTimeoutMs, killSignal: "SIGTERM" });
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    if (result.error && "code" in result.error && result.error.code === "ETIMEDOUT") {
      process.stderr.write(`test_batch_timeout:${group.name}:${offset / batchSize}:${batch.join(",")}\n`);
      failed = true;
      continue;
    }
    if (result.error) throw result.error;
    if (result.status !== 0) failed = true;
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    if (/# skipped [1-9]|Tests\s+\d+ skipped/.test(output)) throw new Error(`skipped_tests_block_gate:${group.name}_batch_${offset / batchSize}`);
  }
}
if (failed) process.exit(1);
