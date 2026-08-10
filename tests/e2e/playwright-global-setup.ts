import { spawn, spawnSync, type ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
import path from "node:path";

const playwrightPort = process.env.PLAYWRIGHT_PORT ?? "3020";
const playwrightBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${playwrightPort}`;

async function isServerReady() {
  try {
    const response = await fetch(playwrightBaseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

type PlaywrightServerProcess = ChildProcessByStdio<null, Readable, Readable>;

async function waitForServer(processRef: PlaywrightServerProcess) {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    if (processRef.exitCode !== null) {
      throw new Error(`Playwright dev server exited early with code ${processRef.exitCode}.`);
    }

    if (await isServerReady()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for Playwright dev server at ${playwrightBaseUrl}.`);
}

function stopServer(processRef: PlaywrightServerProcess) {
  if (!processRef.pid || processRef.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(processRef.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  processRef.kill("SIGTERM");
}

export default async function globalSetup() {
  if (process.env.PLAYWRIGHT_EXTERNAL_SERVER === "true") return undefined;
  if (process.platform !== "win32") return undefined;

  const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER !== "false";
  if (reuseExistingServer && (await isServerReady())) return undefined;

  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const server = spawn(process.execPath, [nextBin, "dev", "-p", playwrightPort], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  server.stdout.on("data", (data) => process.stdout.write(`[WebServer] ${data}`));
  server.stderr.on("data", (data) => process.stderr.write(`[WebServer] ${data}`));

  await waitForServer(server);

  return async () => {
    stopServer(server);
  };
}
