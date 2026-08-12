import { constants, existsSync, readFileSync } from "node:fs";
import { open, readFile, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const lockPath = resolve(".next-build-owner.json");
const staleAfterMs = 10 * 60 * 1000;

function processMatchesOwner(owner) {
  const pid = owner?.pid;
  if (!Number.isInteger(pid) || pid <= 0) return false;
  if (existsSync("/proc")) {
    const commandPath = `/proc/${pid}/cmdline`;
    if (!existsSync(commandPath)) return false;
    try {
      const commandMatches = /build-with-lock|next.*build/.test(readFileSync(commandPath, "utf8").replace(/\0/g, " "));
      const stat = readFileSync(`/proc/${pid}/stat`, "utf8").trim().split(/\s+/);
      const uptimeSeconds = Number(readFileSync("/proc/uptime", "utf8").split(/\s+/)[0]);
      const startedAtMs = Date.now() - uptimeSeconds * 1000 + Number(stat[21]) * 10;
      return commandMatches && Math.abs(startedAtMs - Date.parse(owner.startedAt)) < 5000;
    } catch {
      return false;
    }
  }
  try { process.kill(pid, 0); return true; } catch { return false; }
}

async function acquire() {
  const record = { pid: process.pid, startedAt: new Date().toISOString(), command: "next build" };
  try {
    const handle = await open(lockPath, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY);
    await handle.writeFile(JSON.stringify(record));
    await handle.close();
    return;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
  }
  let owner;
  try { owner = JSON.parse(await readFile(lockPath, "utf8")); } catch { owner = null; }
  const age = owner?.startedAt ? Date.now() - Date.parse(owner.startedAt) : 0;
  if (owner && processMatchesOwner(owner)) throw new Error(`build_already_running:pid_${owner.pid}`);
  if (!owner && (!Number.isFinite(age) || age < staleAfterMs)) throw new Error("build_lock_unverifiable_refusing_cleanup");
  await unlink(lockPath);
  return acquire();
}

await acquire();
try {
  const child = spawn(process.execPath, [createRequire(import.meta.url).resolve("next/dist/bin/next"), "build"], { stdio: "inherit", env: process.env });
  const signalHandlers = ["SIGINT", "SIGTERM"].map((signal) => {
    const handler = () => child.kill(signal);
    process.on(signal, handler);
    return [signal, handler];
  });
  const exitCode = await new Promise((resolveExit, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolveExit(code ?? 1));
  });
  for (const [signal, handler] of signalHandlers) process.off(signal, handler);
  process.exitCode = exitCode;
} finally {
  await unlink(lockPath).catch(() => undefined);
}
