import { runRuntimePreflightCertification } from "../lib/runtime-preflight";

async function main() {
  const summary = await runRuntimePreflightCertification();

  console.log(JSON.stringify(summary, null, 2));

  if (summary.readinessState !== "RUNTIME_READY" && summary.readinessState !== "RUNTIME_WARNING") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Infrastructure runtime preflight failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
