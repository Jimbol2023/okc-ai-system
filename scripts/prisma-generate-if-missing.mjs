import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const trackedClientEntry = "generated/prisma/index.js";
const shouldGenerateForRuntime =
  process.env.PRISMA_GENERATE === "true" ||
  process.env.VERCEL === "1" ||
  process.env.CI === "true";

if (!shouldGenerateForRuntime && existsSync(trackedClientEntry)) {
  console.log("Prisma client already tracked; skipping generate to preserve a clean local install.");
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
