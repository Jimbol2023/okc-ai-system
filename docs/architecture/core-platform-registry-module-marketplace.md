# Core Platform Registry & Module Marketplace

The Core Platform Registry is the organizing layer for J Capital AI OS. It lists reusable AI Core platforms separately from installable Business Modules so the system remains modular, governed, and easy to extend.

## Core Platform Registry

`lib/core-platform-registry.ts` exposes a read-only map of AI Core subsystems:

- Executive AI
- Revenue Engine
- CRM Engine
- Workflow Engine
- Automation Engine
- Connector Platform
- AI Agent Framework
- Analytics
- Security Platform
- Governance, Permissions, and Audit
- Knowledge Base
- Creative Growth Studio
- Document Intelligence
- Notification Engine

Every core platform entry declares purpose, capabilities, dependencies, route, high-ROI reason, governance controls, and no-provider/no-live-execution flags.

The Core Platform Registry also exposes a planning-only provider registry for marketing destinations and analytics surfaces. Facebook, Instagram, Google Business Profile, GA4, Search Console, and LinkedIn are configured as future providers, but they remain not connected and cannot execute. LinkedIn stores only the public Company Page URL, `https://www.linkedin.com/company/109661667/`, and does not store the authenticated admin dashboard URL.

LinkedIn is inactive until a future approval-controlled publishing phase defines OAuth, organization scopes, connector health, audit persistence, Safe Auto Mode policy, feature flags, and explicit approval workflows. Current flags remain `providerCalled:false` and `liveExecutionAllowed:false`; there is no OAuth, API call, publishing, scheduling, scraping, automation, background job, or connector write.

## Module Marketplace

The Module Marketplace lists installed and planned Business Modules:

- Real Estate is installed as the first module.
- E-commerce, Trucking, Healthcare, Property Management, Lending, Consulting, and AI Agency are planning-only.

Every module declares capabilities, required connectors, required permissions, feature flags, source-tracking requirements, extension points, and safety status.

## APIs And Dashboard

- `GET /api/platform/registry`
- `GET /api/modules/marketplace`
- `/dashboard/platform-registry`
- `/dashboard/modules`

These surfaces are authenticated, read-only, and do not call providers, activate connectors, mutate modules, install modules, or grant live execution.

## Next High-ROI Sequence

1. Persist audit, security, creative, document, connector, and approval events.
2. Upgrade the unified Approval Center to cover every AI Core and Business Module action.
3. Add tenant, organization, team, role, and service-account foundations.
4. Add encrypted connector credential vault and scope validation.
5. Keep live connector flags blocked until security and approval evidence is complete.
