import { createServer } from "node:net";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import lighthouse from "lighthouse";
import { chromium } from "playwright";

function getAvailablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Unable to allocate Lighthouse debugging port.")));
        return;
      }
      server.close(() => resolvePort(address.port));
    });
  });
}

const [, , targetUrl, outputPath] = process.argv;

if (!targetUrl || !outputPath) {
  console.error("Usage: node scripts/run-lighthouse-accessibility.mjs <url> <output-path>");
  process.exit(2);
}

const resolvedOutputPath = resolve(outputPath);
mkdirSync(dirname(resolvedOutputPath), { recursive: true });

const debugPort = await getAvailablePort();
const browser = await chromium.launch({
  headless: true,
  args: [
    `--remote-debugging-port=${debugPort}`,
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-crash-reporter",
    "--disable-crashpad",
    "--disable-breakpad",
    "--disable-features=Crashpad",
    "--no-first-run",
    "--no-default-browser-check",
  ],
});

try {
  const runnerResult = await lighthouse(targetUrl, {
    port: debugPort,
    onlyCategories: ["accessibility"],
    output: "json",
    logLevel: "error",
  });

  if (!runnerResult) {
    throw new Error("Lighthouse did not return a report.");
  }

  const report = Array.isArray(runnerResult.report) ? runnerResult.report[0] : runnerResult.report;
  const score = Math.round((runnerResult.lhr.categories.accessibility?.score ?? 0) * 100);
  writeFileSync(resolvedOutputPath, `${report}\n`);
  console.log(`Lighthouse accessibility score: ${score}`);
} finally {
  await browser.close().catch(() => undefined);
}
