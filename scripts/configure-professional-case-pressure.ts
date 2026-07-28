import { prisma } from "../lib/prisma";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL_required");
  const parsed = new URL(databaseUrl);
  if (!["127.0.0.1", "localhost", "::1"].includes(parsed.hostname) || !parsed.pathname.includes("jcapital_pressure")) throw new Error("isolated_local_pressure_database_required");
  for (const [flagKey, category] of [["professional_case_runtime", "automation"], ["search_market_intelligence_runtime", "intelligence"], ["search_market_intelligence_scheduling", "automation"]] as const) {
    await prisma.featureFlagRecord.upsert({
      where: { tenantId_flagKey: { tenantId: "default", flagKey } },
      update: { enabled: true, category, description: "Isolated professional-case pressure validation only.", requiresAdminApproval: true, updatedBy: "isolated-pressure-harness" },
      create: { tenantId: "default", flagKey, enabled: true, category, description: "Isolated professional-case pressure validation only.", requiresAdminApproval: true, updatedBy: "isolated-pressure-harness" },
    });
  }
  const safetyFlags = { readOnly: true, liveExecutionAllowed: false, externalWritesBlocked: true, publishingBlocked: true, emailSendingBlocked: true, smsBlocked: true, adsBlocked: true, crmMutationBlocked: true, providerExecutionBlocked: true, oauthWritesBlocked: true };
  for (const [snapshotDate, evidenceHash, impressions, clicks] of [["2026-07-14T00:00:00.000Z", "pressure-current-evidence-hash", 130, 8], ["2026-07-13T00:00:00.000Z", "pressure-previous-evidence-hash", 100, 5]] as const) {
    await prisma.businessDataSnapshot.create({ data: { tenantId: "default", contractVersion: "business-data-snapshot-v1", evidenceHash, snapshotDate: new Date(snapshotDate), provider: "Google", connectorId: "google_search_console", category: "search_console_performance", status: "fresh", sourceLabel: `isolated-pressure:${evidenceHash}`, provenance: "Synthetic isolated pressure evidence; no provider called.", freshness: snapshotDate, summary: `Synthetic verified search evidence: ${impressions} impressions and ${clicks} clicks.`, metrics: { impressions, clicks }, records: [{ dimension: "synthetic seller query", impressions, clicks }], dataGaps: [], assumptions: ["Synthetic pressure evidence only."], safetyFlags, providerCalled: false, sent: false, published: false, crmMutated: false, liveExecutionAllowed: false } });
  }
}

main()
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : "pressure_configuration_failed"}\n`);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
