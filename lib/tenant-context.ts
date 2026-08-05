export type TenantIdentity = Readonly<{
  tenantId: string;
}>;

const TENANT_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{1,63}$/u;

export function requireTenantId(value: string | null | undefined, source = "execution_context") {
  const tenantId = value?.trim();
  if (!tenantId) throw new Error(`tenant_id_required:${source}`);
  if (!TENANT_ID_PATTERN.test(tenantId)) throw new Error(`tenant_id_invalid:${source}`);
  return tenantId;
}

export function resolvePublicIntakeTenant(env: NodeJS.ProcessEnv = process.env) {
  return requireTenantId(env.PUBLIC_INTAKE_TENANT_ID, "public_intake_rule");
}
