import { getFeatureFlag, type FeatureFlagKey } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";

export async function isTenantFeatureEnabled(tenantId: string, key: FeatureFlagKey) {
  const definition = getFeatureFlag(key);
  if (!definition) return false;
  const record = await prisma.featureFlagRecord.findUnique({ where: { tenantId_flagKey: { tenantId, flagKey: key } } });
  if (!record) return definition.enabled;
  if (record.category !== definition.category || record.requiresAdminApproval !== definition.requiresAdminApproval) return false;
  if (definition.requiresAdminApproval && !record.updatedBy) return false;
  return record.enabled;
}
