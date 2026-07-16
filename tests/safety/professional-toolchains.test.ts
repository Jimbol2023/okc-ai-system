import assert from "node:assert/strict";
import test from "node:test";

import { readOnlyBusinessSafetyFlags, type BusinessDataSnapshotRecord } from "../../lib/read-only-business-connections";
import {
  assertValidProfessionalToolchainRegistry,
  certificationWaveContracts,
  createConnectorIntakeEvidenceFromRecords,
  createProfessionalToolchainsReport,
  createWaveOneIntelligenceReports,
  evaluateConnectorIntake,
  professionalExpertisePacks,
  professionalToolchainContracts,
} from "../../lib/professional-toolchains";
import { listUniversalConnectorManifests } from "../../lib/universal-enterprise-integration-platform";

const noEvidence = { activeCertifiedProfessionalIds: [], activeCertificationScopes: [], activeQualificationIds: [], securityApprovedConnectorIds: [] };
const seoCertificationScope = [{ professionalId: "senior-seo-director", competencyId: "marketing-attribution-analysis", deliverableId: "executive-seo-brief" }];

function snapshot(input: Partial<BusinessDataSnapshotRecord> & Pick<BusinessDataSnapshotRecord, "connectorId" | "category">): BusinessDataSnapshotRecord {
  return {
    snapshotDate: "2026-07-15T12:00:00.000Z",
    provider: input.connectorId,
    connectorId: input.connectorId,
    category: input.category,
    status: input.status ?? "fresh",
    sourceLabel: input.sourceLabel ?? `normalized:${input.connectorId}:${input.category}`,
    provenance: input.provenance ?? "Normalized governed test evidence.",
    freshness: "2026-07-15T12:00:00.000Z",
    summary: input.summary ?? "A normalized source-qualified signal is available.",
    metrics: input.metrics ?? {},
    records: input.records ?? [],
    dataGaps: input.dataGaps ?? [],
    assumptions: input.assumptions ?? [],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: input.providerCalled ?? false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

test("professional toolchain registry is canonical, measurable, and authority-bound", () => {
  assert.equal(assertValidProfessionalToolchainRegistry(), true);
  assert.equal(professionalToolchainContracts.length, 4);
  assert.ok(professionalToolchainContracts.every((item) => item.independentReviewerId !== item.accountableProfessionalId));
  assert.ok(professionalToolchainContracts.every((item) => item.expectedBusinessValue.measurableMetricIds.length > 0));
  assert.ok(professionalToolchainContracts.every((item) => !item.providerAuthorityGranted && !item.externalExecutionGranted));
  assert.equal(certificationWaveContracts.filter((item) => item.lifecycle === "active").length, 2);
  assert.ok(certificationWaveContracts.every((item) => item.humanPromotionRequired));
});

test("registered professional capabilities resolve to exact canonical UEIP capabilities", () => {
  const manifests = new Map(listUniversalConnectorManifests().map((manifest) => [manifest.connectorId, manifest]));
  const registered = professionalToolchainContracts.flatMap((toolchain) => toolchain.capabilities.filter((capability) => capability.runtimeState === "registered"));
  assert.ok(registered.length > 0);
  for (const capability of registered) {
    assert.ok(
      manifests.get(capability.connectorId)?.capabilities.some((candidate) => candidate.capabilityKey === capability.capabilityKey),
      `${capability.connectorId}/${capability.capabilityKey} must be registered exactly once in UEIP`,
    );
  }
  const searchConsole = manifests.get("google_search_console");
  assert.ok(searchConsole?.capabilities.some((capability) => capability.capabilityKey === "seo.page.performance.read"));
  assert.ok(searchConsole?.capabilities.some((capability) => capability.capabilityKey === "seo.indexing.summary.read"));
  assert.ok(!searchConsole?.capabilities.some((capability) => capability.capabilityKey === "search.console.read"));
});

test("regional property expertise stays in the Real Estate Business Module", () => {
  const regional = professionalExpertisePacks.find((item) => item.scope === "regional");
  assert.equal(regional?.regionalSpecialization, "Oklahoma County, Oklahoma");
  assert.deepEqual(regional?.applicableBusinessModules, ["real-estate"]);
  assert.ok(professionalExpertisePacks.filter((item) => item.applicableBusinessModules.includes("ai-core")).every((item) => item.regionalSpecialization === null));
});

test("connector intake fails closed through certification, security, and calibration gates", () => {
  const toolchainId = "seo-director-search-intelligence-toolchain";
  const connectorId = "google_search_console";
  const certificationRequired = evaluateConnectorIntake(toolchainId, connectorId, noEvidence);
  assert.equal(certificationRequired.status, "professional_certification_required");
  assert.equal(certificationRequired.connectorActivated, false);

  const securityRequired = evaluateConnectorIntake(toolchainId, connectorId, { activeCertifiedProfessionalIds: ["senior-seo-director"], activeCertificationScopes: seoCertificationScope, activeQualificationIds: ["senior-seo-search-console-performance"], securityApprovedConnectorIds: [] });
  assert.equal(securityRequired.status, "security_review_required");
  const calibration = evaluateConnectorIntake(toolchainId, connectorId, { activeCertifiedProfessionalIds: ["senior-seo-director"], activeCertificationScopes: seoCertificationScope, activeQualificationIds: ["senior-seo-search-console-performance"], securityApprovedConnectorIds: [connectorId] });
  assert.equal(calibration.status, "calibration_only");
  const ready = evaluateConnectorIntake(toolchainId, connectorId, { activeCertifiedProfessionalIds: ["senior-seo-director"], activeCertificationScopes: seoCertificationScope, activeQualificationIds: ["senior-seo-search-console-performance"], securityApprovedConnectorIds: [connectorId], calibrationByToolchainId: { [toolchainId]: { calibrationCases: 10, blindValidationCases: 20, allSeededCriticalDefectsDetected: true, zeroUnauthorizedActions: true, humanPromotionApproved: true } } });
  assert.equal(ready.status, "ready_for_governed_enablement");
  assert.equal(ready.connectorActivated, false);
  assert.equal(ready.externalExecutionGranted, false);
});

test("staged GA4 and GBP capabilities cannot pass capability registration", () => {
  const staged = evaluateConnectorIntake("local-visibility-intelligence-toolchain", "google_business_profile", { activeCertifiedProfessionalIds: ["local-visibility-specialist"], activeCertificationScopes: [{ professionalId: "local-visibility-specialist", competencyId: "marketing-attribution-analysis", deliverableId: "local-visibility-report" }], activeQualificationIds: ["local-visibility-gbp-performance"], securityApprovedConnectorIds: ["google_business_profile"] });
  assert.equal(staged.status, "capability_registration_required");
  assert.ok(staged.reasons.some((reason) => reason.includes("staged")));
});

test("Wave 1 reports expose GA4 and GBP gaps without inventing metrics", () => {
  const bundle = createWaveOneIntelligenceReports({ tenantId: "tenant-a", inputSnapshotVersion: "snapshot-1", observationCutoff: "2026-07-15T12:00:00.000Z", snapshots: [snapshot({ connectorId: "google_search_console", category: "search_console_performance", summary: "Verified page evidence is available.", metrics: { impressions: 100, clicks: 5 } })] });
  assert.equal(bundle.reports.length, 3);
  assert.equal(bundle.summary.partialDataGap, 1);
  assert.equal(bundle.summary.calibrationOnly, 3);
  assert.ok(bundle.dataGaps.some((gap) => gap.includes("google_analytics")));
  assert.ok(bundle.dataGaps.some((gap) => gap.includes("google_business_profile")));
  assert.equal(bundle.reportAssemblyProviderCalled, false);
  assert.equal(bundle.externalWritesAllowed, false);
  assert.ok(bundle.reports.every((report) => report.assumptions.some((assumption) => assumption.includes("No traffic, ranking, conversion, or revenue outcome is forecast"))));
});

test("Wave 1 executive eligibility requires evidence, certification, qualification, and QA", () => {
  const bundle = createWaveOneIntelligenceReports({
    tenantId: "tenant-a",
    inputSnapshotVersion: "snapshot-2",
    observationCutoff: "2026-07-15T12:00:00.000Z",
    snapshots: [
      snapshot({ connectorId: "google_search_console", category: "search_console_performance" }),
      snapshot({ connectorId: "google_analytics", category: "google_analytics_traffic" }),
      snapshot({ connectorId: "google_business_profile", category: "google_business_profile_performance" }),
    ],
    activeCertifiedProfessionalIds: ["senior-seo-director", "senior-analytics-specialist", "local-visibility-specialist", "marketing-quality-reviewer"],
    activeQualificationIds: ["senior-seo-search-console-performance", "analytics-specialist-search-content", "local-visibility-gbp-performance"],
  });
  assert.equal(bundle.summary.executiveUseEligible, 3);
  assert.ok(bundle.reports.every((report) => report.qa.status === "ready_for_internal_executive_review"));
});

test("append-only records produce scoped active intake evidence", () => {
  const evidence = createConnectorIntakeEvidenceFromRecords({ certifications: [{ professionalId: "senior-seo-director", competencyId: "marketing-attribution-analysis", deliverableId: "executive-seo-brief", state: "certified_internal", expiresAt: null }], governance: [{ eventType: "professional_capability_qualified", subjectId: "q-1", sanitizedData: { qualificationId: "senior-seo-search-console-performance" } }, { eventType: "connector_security_review_approved", subjectId: "gsc", sanitizedData: { connectorId: "google_search_console" } }] });
  assert.deepEqual(evidence.activeCertifiedProfessionalIds, ["senior-seo-director"]);
  assert.deepEqual(evidence.activeCertificationScopes, seoCertificationScope);
  assert.deepEqual(evidence.activeQualificationIds, ["senior-seo-search-console-performance"]);
  assert.deepEqual(evidence.securityApprovedConnectorIds, ["google_search_console"]);
  const report = createProfessionalToolchainsReport(evidence);
  assert.equal(report.safety.connectorActivationAllowed, false);
});
