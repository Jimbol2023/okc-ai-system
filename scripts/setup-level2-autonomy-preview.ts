import { prisma } from "@/lib/prisma";
import { leadQualificationLane, leadQualificationPolicyKey } from "@/lib/autonomy-policy";
import { diagnosePreviewDatabaseFingerprint } from "@/lib/preview-database-fingerprint-diagnosis";

export function assertPreviewLevel2SetupEnvironment(env: NodeJS.ProcessEnv) {
  if (env.VERCEL_ENV !== "preview") throw new Error("Level-2 setup is Preview-only.");
  if (env.LEVEL2_SETUP_TENANT !== "default") throw new Error("LEVEL2_SETUP_TENANT must exactly match the certified default tenant.");
  if (!env.DATABASE_URL || !env.DIRECT_URL) throw new Error("DATABASE_URL and DIRECT_URL are required.");
  if (env.PRODUCTION_DATABASE_URL && env.DATABASE_URL === env.PRODUCTION_DATABASE_URL) throw new Error("Preview database must not equal Production database.");
  return { tenantId: env.LEVEL2_SETUP_TENANT };
}

export async function activatePreviewLevel2Policy(
  env: NodeJS.ProcessEnv = process.env,
  deps: {
    diagnose?: typeof diagnosePreviewDatabaseFingerprint;
    db?: typeof prisma;
  } = {},
) {
  const { tenantId } = assertPreviewLevel2SetupEnvironment(env);
  const diagnose = deps.diagnose ?? diagnosePreviewDatabaseFingerprint;
  const db = deps.db ?? prisma;
  const identity = await diagnose({ env });
  if (identity.classification !== "PREVIEW_DATABASE_IDENTITY_CERTIFIED" || identity.activeDatabaseIdentityClassification !== "approved_preview_database") {
    throw new Error(`Preview database identity rejected: ${identity.classification}.`);
  }
  return db.$transaction(async (tx) => {
    const policy = await tx.autonomyPolicy.update({
      where: { tenantId_policyKey: { tenantId, policyKey: leadQualificationPolicyKey } },
      data: { effect: "allow", approvalRequired: false, killSwitchEnabled: false, maxAutonomyLevel: 2 },
    });
    const sla = await tx.departmentSLA.update({
      where: { tenantId_department: { tenantId, department: "Revenue Operations" } },
      data: { maxAutonomyLevel: 2, lane: leadQualificationLane },
    });
    return { tenantId, policyKey: policy.policyKey, lane: sla.lane, maxAutonomyLevel: policy.maxAutonomyLevel, providerCalled: false, outreach: false, liveExecutionAllowed: false };
  });
}

if (process.argv[1]?.endsWith("setup-level2-autonomy-preview.ts")) {
  activatePreviewLevel2Policy()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .finally(() => prisma.$disconnect());
}
