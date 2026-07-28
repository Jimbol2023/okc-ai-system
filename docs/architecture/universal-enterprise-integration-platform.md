# Universal Enterprise Integration Platform

## Charter

The Universal Enterprise Integration Platform (UEIP) is the permanent AI Core boundary for external systems. It owns how connector plug-ins are registered, authenticated, authorized, monitored, audited, configured, certified, and operated. Departments own business decisions and workflows; they request semantic capabilities through UEIP and do not call providers or read credentials directly.

- Executive owner: Chief AI Officer.
- Platform owner: Integration Platform Engineering.
- Governance owners: Approval / Safety, Security, Compliance, and tenant administrators.
- Connector owners: the departments consuming each connector capability.
- Objective: make integrations safe, reusable, observable, tenant-aware, and inexpensive to add.

Success is measured through connector delivery time, contract certification, health, freshness, audit completeness, credential incidents, policy denials, provider failures, and reuse across business modules.

## Control Plane

UEIP composes the existing connector registry, tool capability manager, credential workflow, provider policy, health contracts, activation gates, audit controls, and read-only adapters. It does not create parallel implementations of those services.

1. The Universal Connector Registry supplies provider identity, ownership, versions, dependencies, environments, and lifecycle state.
2. The manifest contract exposes semantic capabilities independently of department workflows.
3. Tenant-scoped credential references identify authentication material without returning secrets.
4. The policy decision point evaluates tenant, actor, AI employee, business module, capability, environment, scopes, flags, health, Safe Auto Mode, and exact approval.
5. The gateway is the only authorized provider-call boundary. A policy decision is a plan, not a provider call.
6. Provider payloads must be validated and normalized into versioned enterprise contracts with provenance and redaction.
7. Health, audit, incident, and portfolio visibility are exposed through one connector dashboard.

Department services must not import provider SDKs, implement OAuth flows, read secret values, or call provider endpoints directly. Existing direct provider paths are legacy consolidation candidates and may not be expanded without architecture review.

## Universal Manifest

The `ueip-connector-manifest-v1` contract declares:

- stable connector ID and semantic version;
- provider and owner department;
- supported tenant IDs and compatible business modules;
- authentication strategy and a non-secret credential reference label;
- semantic capabilities, provider action mappings, scopes, risk, data classification, approval policy, and execution boundary;
- supported environments and dependencies;
- rate limit, quota, timeout, retry, and circuit-breaker policies;
- audit, redaction, provenance, retention, and incident requirements.

Lifecycle states are `proposed`, `sandboxed`, `read_only`, `controlled_write`, `suspended`, `deprecated`, and `retired`. Passing one state never authorizes the next.

## Gateway And Policy Boundary

The gateway fails closed before provider execution when any of these conditions apply:

- the connector or capability is not registered;
- the tenant, business module, or environment is not authorized;
- the connector is suspended, deprecated, retired, unavailable, rate-limited, or circuit-open;
- credential scopes are insufficient;
- a required feature flag is disabled;
- the capability is blocked;
- a write lacks exact-action approval or the connector is not in `controlled_write` lifecycle.

An allowed read decision authorizes only a governed read plan. Provider execution, audit persistence, retry enforcement, idempotency, normalization, and result capture remain separate runtime responsibilities. Approval never bypasses scopes, flags, health, lifecycle, Safe Auto Mode, audit, or policy.

## Connector Lifecycle

1. Intake records business value, authority, classification, owner, tenants, and duplicate-capability review.
2. Contract review approves capabilities, schemas, scopes, provenance, safety flags, and failure behavior.
3. Sandbox validates fixtures or a provider sandbox with external writes blocked.
4. Read-only pilot authorizes exact reads for selected tenants and environments.
5. Controlled-write review applies a separate governance gate to every write capability.
6. Limited activation requires least privilege, exact approval, idempotency, audit preflight, flags, and kill switches.
7. Production monitoring enforces service targets, freshness, quota, incidents, outcome capture, and access review.
8. Deprecation blocks capabilities, revokes credentials, preserves audit history, and migrates consumers.

## Certification And Service Levels

Every plug-in must pass reusable manifest, tenant-isolation, no-secret, scope, health, failure, audit, and no-unauthorized-execution tests. Certification is required at each lifecycle promotion.

Platform service levels must cover availability, data freshness, audit completeness, credential rotation, incident response, and certification. Targets remain uncommitted until production baselines and business requirements are approved; dashboards must label missing targets rather than invent them.

## Roadmap

- Foundation: consolidate current connector controls behind this charter and certify existing manifests.
- Sprint 16: add multi-business tenant isolation, tenant-specific installations, module configuration, quotas, and delegated administration.
- Sprint 17: add exact-action controlled execution, approval binding, idempotency, compensation, write audit evidence, and emergency suspension.
- Sprint 18 reconciliation: register existing governed read-only business connections as UEIP plug-ins without rewriting their implementation history.
- Expansion: onboard government, county, maps, MLS, accounting, CRM, communication, marketing, and social providers according to governed business priority and legal availability.

External execution remains unauthorized unless an exact governed policy and sprint gate explicitly authorize it.

## Phase 2 Runtime Adoption

The control plane becomes enforceable through the runtime gateway described in [UEIP Phase 2](../engineering/ueip-phase-2-runtime-gateway-adoption-brief.md). Search Console is the Preview-only reference migration. The existing shared read adapter is no longer the Search Console OAuth or provider-call owner; it consumes the normalized UEIP result while other provider reads remain classified legacy paths.

The signed tenant context, tenant installation, preflight evidence, credential broker, endpoint allowlist, reliability controls, normalized schema, completion evidence, and health record are all mandatory. A successful policy decision alone never calls the provider.
