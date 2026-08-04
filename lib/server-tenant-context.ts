import "server-only";

import { getAuthenticatedAdmin } from "@/lib/auth";
import { requireTenantId } from "@/lib/tenant-context";

export async function requireAuthenticatedServerTenant() {
  const actor = await getAuthenticatedAdmin();
  if (!actor) throw new Error("authenticated_admin_required");
  return Object.freeze({
    tenantId: requireTenantId(actor.tenantId, "server_session"),
    actorId: actor.actorId || actor.email,
  });
}
