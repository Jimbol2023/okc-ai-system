import { getInfrastructureHealth } from "../lib/infrastructure-health";

async function main() {
  const includeProviderChecks =
    process.env.INFRA_PREFLIGHT_PROVIDER_CHECKS === "true" || process.env.INFRA_PREFLIGHT_PROVIDER_CHECKS === "1";
  const report = await getInfrastructureHealth({
    includeDatabase: false,
    includeOAuth: includeProviderChecks,
  });
  const summary = {
    environment: report.environment,
    status: report.status,
    blockers: report.blockers,
    warnings: report.warnings,
    operatorActions: report.operatorActions,
    providerCalled: report.providerCalled,
    liveExecutionAllowed: report.liveExecutionAllowed,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (report.environment === "production" && report.blockers.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Infrastructure preflight failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
