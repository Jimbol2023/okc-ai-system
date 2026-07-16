import { getInfrastructureHealth } from "../lib/infrastructure-health";

type DiagnoseMode = "all" | "infra" | "connectors" | "predeploy";

function getMode(): DiagnoseMode {
  const mode = process.argv[2] ?? "all";

  if (mode === "infra" || mode === "connectors" || mode === "predeploy" || mode === "all") {
    return mode;
  }

  return "all";
}

function providerChecksEnabled() {
  return process.env.INFRA_DIAGNOSE_PROVIDER_CHECKS === "true" || process.env.INFRA_DIAGNOSE_PROVIDER_CHECKS === "1";
}

function getRemediationHints(blockers: string[], warnings: string[]) {
  const messages = [...blockers, ...warnings];
  const hints = new Set<string>();

  messages.forEach((message) => {
    if (message.includes("GOOGLE_SEARCH_CONSOLE_SITE_URL")) {
      hints.add("Add GOOGLE_SEARCH_CONSOLE_SITE_URL in Vercel Preview/Production before relying on Search Console reads.");
    }
    if (message.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID")) {
      hints.add("Add GOOGLE_BUSINESS_PROFILE_LOCATION_ID in Vercel Preview/Production before relying on Google Business Profile reads.");
    }
    if (message.includes("DATABASE_URL") || message.includes("DIRECT_URL") || message.includes("Database connectivity")) {
      hints.add("Verify database secrets in the deployment runtime, not with env pull.");
    }
    if (message.includes("APPROVED_EXECUTION")) {
      hints.add("Keep external execution disabled until the governed production smoke approval is complete.");
    }
  });

  if (hints.size === 0) {
    hints.add("No remediation required from the current redacted diagnostic snapshot.");
  }

  return Array.from(hints);
}

async function main() {
  const mode = getMode();
  const includeOAuth = mode === "connectors" ? providerChecksEnabled() : false;
  const report = await getInfrastructureHealth({
    includeDatabase: mode === "all" || mode === "infra" || mode === "predeploy",
    includeOAuth,
  });
  const payload = {
    mode,
    ok: report.ok,
    status: report.status,
    environment: report.environment,
    generatedAt: report.generatedAt,
    blockers: report.blockers,
    warnings: report.warnings,
    operatorActions: report.operatorActions,
    remediationHints: getRemediationHints(report.blockers, report.warnings),
    env: {
      missing: report.env.missing,
      empty: report.env.empty,
      placeholders: report.env.placeholders,
    },
    database: report.database,
    auditTrail: report.auditTrail,
    oauth: mode === "connectors" || mode === "all" ? report.oauth : undefined,
    connectors: mode === "connectors" || mode === "all" ? report.connectors : undefined,
    safetyGates: report.safetyGates,
    providerCalled: report.providerCalled,
    liveExecutionAllowed: report.liveExecutionAllowed,
  };

  console.log(JSON.stringify(payload, null, 2));

  if (mode === "predeploy" && report.blockers.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Diagnostic failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
