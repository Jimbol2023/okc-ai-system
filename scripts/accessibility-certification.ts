import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import { resolve } from "node:path";

type CommandResult = {
  ok: boolean;
  code: number | null;
  stdout: string;
  stderr: string;
};

type WaveEvidence = {
  provided: boolean;
  source: string | null;
  criticalIssues: number | null;
  passed: boolean;
  message: string;
};

const port = Number(process.env.ACCESSIBILITY_CERTIFICATION_PORT ?? 3031);
const baseUrl = process.env.ACCESSIBILITY_BASE_URL ?? `http://127.0.0.1:${port}`;
const reportDir = "accessibility-results/accessibility-certification";
const lighthouseReportPath = resolve(reportDir, "lighthouse-home.json");
const playwrightReportPath = resolve(reportDir, "playwright-a11y.json");
const finalReportPath = resolve(reportDir, "accessibility-certification.json");
const lighthouseMinimumScore = 95;
const serverMode = process.env.ACCESSIBILITY_SERVER_MODE ?? "production";

function npmExecutable() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function redact(value: string) {
  return value
    .replace(/postgres(?:ql)?:\/\/\S+/giu, "[redacted-database-url]")
    .replace(/(token|secret|password|authorization|cookie|api[_-]?key)=\S+/giu, "$1=[redacted]")
    .slice(0, 8000);
}

function runCommand(command: string, args: string[], env: NodeJS.ProcessEnv = process.env): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      shell: process.platform === "win32",
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => { stdout += String(chunk); });
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("error", (error) => resolve({ ok: false, code: null, stdout, stderr: error.message }));
    child.on("close", (code) => resolve({ ok: code === 0, code, stdout, stderr }));
  });
}

function startServer(): ChildProcessWithoutNullStreams | null {
  if (process.env.ACCESSIBILITY_EXTERNAL_SERVER === "true") return null;

  const args = serverMode === "dev"
    ? ["run", "dev", "--", "-p", String(port)]
    : ["run", "start", "--", "-p", String(port)];

  const child = spawn(npmExecutable(), args, {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    shell: process.platform === "win32",
  });

  child.stdout.on("data", () => undefined);
  child.stderr.on("data", () => undefined);

  return child;
}

function stopServer(server: ChildProcessWithoutNullStreams | null) {
  if (!server) return;

  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore",
      shell: false,
    });
    return;
  }

  server.kill();
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { method: "HEAD" });
      if (response.ok || response.status < 500) return;
    } catch {
      // Keep polling until the certification server is accepting connections.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Accessibility certification server did not become ready at ${baseUrl}.`);
}

async function runLighthouse() {
  const result = await runCommand(process.execPath, [
    "scripts/run-lighthouse-accessibility.mjs",
    baseUrl,
    lighthouseReportPath,
  ]);
  let score: number | null = null;

  if (existsSync(lighthouseReportPath)) {
    const report = JSON.parse(readFileSync(lighthouseReportPath, "utf8")) as {
      categories?: { accessibility?: { score?: number } };
    };
    score = Math.round((report.categories?.accessibility?.score ?? 0) * 100);
  }

  return {
    ok: typeof score === "number" && score >= lighthouseMinimumScore,
    commandOk: result.ok,
    score,
    minimumScore: lighthouseMinimumScore,
    stdout: redact(result.stdout),
    stderr: redact(result.stderr),
  };
}

async function runPlaywrightCertification() {
  const result = await runCommand(npmExecutable(), [
    "exec",
    "--",
    "playwright",
    "test",
    "tests/e2e/accessibility-certification.spec.ts",
    "--reporter=list",
  ], {
    ...process.env,
    PLAYWRIGHT_EXTERNAL_SERVER: "true",
    PLAYWRIGHT_BASE_URL: baseUrl,
  });
  const report = existsSync(playwrightReportPath)
    ? JSON.parse(readFileSync(playwrightReportPath, "utf8")) as Record<string, unknown>
    : null;

  return {
    ok: result.ok && Boolean(report),
    report,
    stdout: redact(result.stdout),
    stderr: redact(result.stderr),
  };
}

function waveEvidenceFromEnv(): WaveEvidence {
  const direct = process.env.WAVE_CRITICAL_ISSUES?.trim();
  if (direct) {
    const criticalIssues = Number(direct);
    return {
      provided: Number.isFinite(criticalIssues),
      source: "WAVE_CRITICAL_ISSUES",
      criticalIssues: Number.isFinite(criticalIssues) ? criticalIssues : null,
      passed: criticalIssues === 0,
      message: Number.isFinite(criticalIssues)
        ? "WAVE critical issue count supplied by release environment."
        : "WAVE_CRITICAL_ISSUES is not numeric.",
    };
  }

  const path = process.env.ACCESSIBILITY_WAVE_REPORT_PATH?.trim();
  if (path && existsSync(path)) {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as { criticalIssues?: unknown; critical?: unknown; summary?: { critical?: unknown } };
    const criticalIssues = Number(parsed.criticalIssues ?? parsed.critical ?? parsed.summary?.critical);
    return {
      provided: Number.isFinite(criticalIssues),
      source: path,
      criticalIssues: Number.isFinite(criticalIssues) ? criticalIssues : null,
      passed: criticalIssues === 0,
      message: Number.isFinite(criticalIssues)
        ? "WAVE critical issue count supplied by report file."
        : "WAVE report did not expose a numeric critical issue count.",
    };
  }

  return {
    provided: false,
    source: null,
    criticalIssues: null,
    passed: false,
    message: "WAVE evidence is required: set WAVE_CRITICAL_ISSUES=0 or ACCESSIBILITY_WAVE_REPORT_PATH to a JSON report with criticalIssues:0.",
  };
}

async function main() {
  mkdirSync(reportDir, { recursive: true });
  const server = startServer();

  try {
    await waitForServer();
    const [lighthouse, playwright] = await Promise.all([
      runLighthouse(),
      runPlaywrightCertification(),
    ]);
    const wave = waveEvidenceFromEnv();
    const criteria = {
      wcag22AaTarget: playwright.ok,
      lighthouseScoreAtLeast95: lighthouse.ok,
      axeCriticalIssuesZero: playwright.ok,
      axeSeriousIssuesZero: playwright.ok,
      waveCriticalIssuesZero: wave.passed,
      keyboardNavigationSmokePassed: playwright.ok,
      visibleFocusIndicatorsPassed: playwright.ok,
      screenReaderNavigationAndControlsPassed: playwright.ok,
      accessibilityToolbarPassed: playwright.ok,
    };
    const passed = Object.values(criteria).every(Boolean);
    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      criteria,
      lighthouse,
      playwright,
      wave,
      safety: {
        providerCalled: false,
        databaseAltered: false,
        migrationsRun: false,
        liveExecutionAllowed: false,
      },
      classification: passed ? "ACCESSIBILITY_CERTIFICATION_VERIFIED" : "ACCESSIBILITY_CERTIFICATION_BLOCKED",
    };

    writeFileSync(finalReportPath, `${JSON.stringify(report, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (!passed) process.exitCode = 1;
  } finally {
    stopServer(server);
  }
}

main()
  .then(() => {
    process.exit(process.exitCode ?? 0);
  })
  .catch((error) => {
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    error: error instanceof Error ? error.message : "Unknown accessibility certification failure.",
    safety: {
      providerCalled: false,
      databaseAltered: false,
      migrationsRun: false,
      liveExecutionAllowed: false,
    },
    classification: "ACCESSIBILITY_CERTIFICATION_BLOCKED",
  };
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(finalReportPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = 1;
  process.exit(1);
});
