import type { BuyerDemandSignals } from "@/lib/buyer-demand-types";
import type { StoredLead } from "@/lib/leads-storage";

export type ProfessionalCertificationState = "draft" | "in_training" | "certified_internal" | "suspended" | "recertification_required" | "retired";
export type EvidenceVerificationState = "verified" | "partially_verified" | "conflicting" | "unavailable" | "assumption" | "not_authorized";
export type AcquisitionDisposition = "research_next" | "manager_review" | "hold_missing_data" | "not_actionable_with_current_evidence";

export type ProfessionalCompetencyV1 = { id: string; label: string; requiredLevel: "working" | "advanced" | "reviewer"; certificationEvidence: string[] };
export type ProfessionalSopReferenceV1 = { id: string; version: string; title: string; approvedSource: string; required: boolean };
export type ProfessionalDeliverableStandardV1 = { deliverableType: string; schemaVersion: string; requiredSections: string[]; qualityThresholds: string[] };
export type ProfessionalEvidencePolicyV1 = { acceptedAuthorities: string[]; provenanceRequired: true; freshnessRequired: true; conflictingEvidenceVisible: true; assumptionsLabeled: true; crossPropertyEvidenceBlocked: true };
export type ProfessionalKpiDefinitionV1 = { id: string; label: string; measure: string; direction: "increase" | "decrease"; outcomeContractRequired: true };
export type ProfessionalCertificationV1 = { state: ProfessionalCertificationState; certifiedFor: "internal_advisory_only"; certifiedAt: string | null; expiresAt: string | null; suspensionTriggers: string[]; recertificationTriggers: string[] };
export type ProfessionalCapabilityGrantV1 = { capabilityKey: string; mode: "internal" | "ueip_read_plan"; providerExecutionGranted: false; externalWritesGranted: false };
export type ProfessionalEscalationRuleV1 = { trigger: string; target: string; requiredEvidence: string[] };

export type ProfessionalProfileV1 = {
  id: string;
  profileVersion: "1.0.0";
  sourceWorkforceIds: string[];
  name: string;
  department: "Property Intelligence";
  manager: string;
  rolePurpose: string;
  responsibilities: string[];
  prohibitedActivities: string[];
  competencies: ProfessionalCompetencyV1[];
  sopReferences: ProfessionalSopReferenceV1[];
  deliverables: ProfessionalDeliverableStandardV1[];
  evidencePolicy: ProfessionalEvidencePolicyV1;
  kpis: ProfessionalKpiDefinitionV1[];
  capabilityGrants: ProfessionalCapabilityGrantV1[];
  escalationRules: ProfessionalEscalationRuleV1[];
  certification: ProfessionalCertificationV1;
  humanReviewRequired: true;
  titleDoesNotImplyHumanLicensure: true;
};

export type CanonicalPropertyIdentityV1 = {
  identityId: string;
  normalizedAddress: string | null;
  parcelId: string | null;
  county: string | null;
  jurisdiction: string | null;
  sourceIdentifiers: Array<{ source: string; identifier: string }>;
  leadId: string;
  propertyRecordId: string | null;
  confidence: number;
  matchMethod: "address_and_parcel" | "address_only" | "parcel_only" | "insufficient_identity";
  conflicts: string[];
  unresolvedCandidates: string[];
  humanVerificationState: "not_reviewed" | "verified" | "conflict_review_required";
};

export type PropertyEvidenceItemV1 = {
  evidenceId: string;
  propertyIdentityId: string;
  category: "identity" | "lead_source" | "seller_reported" | "public_record" | "tax" | "gis" | "zoning" | "flood" | "valuation_input" | "cost_assumption" | "buyer_demand" | "deal_economics";
  field: string;
  value: string | number | boolean | null;
  unit: string | null;
  sourceAuthority: string;
  sourceRecordReference: string;
  observedAt: string | null;
  retrievedAt: string;
  freshnessPolicy: string;
  confidence: number;
  verificationState: EvidenceVerificationState;
  permittedUse: "internal_acquisition_review_only";
  sensitivity: "internal" | "confidential" | "restricted";
  responsibleProfessionalId: string;
  contradictsEvidenceIds: string[];
  supersedesEvidenceId: string | null;
};

export type AcquisitionBriefSectionV1 = {
  id: string;
  title: string;
  status: EvidenceVerificationState;
  summary: string;
  evidenceIds: string[];
  assumptions: string[];
  missingData: string[];
  conflicts: string[];
  responsibleProfessionalId: string;
  qaStatus: "pending" | "passed" | "failed";
  humanReviewRequired: true;
  permittedUse: "internal_acquisition_review_only";
};

export type AcquisitionReadinessFactorV1 = { id: string; label: string; score: number; weight: number; explanation: string; evidenceIds: string[]; missingData: string[] };

export type AcquisitionDecisionBriefV1 = {
  briefId: string;
  briefVersion: "1.0.0";
  inputSnapshotVersion: string;
  generatedAt: string;
  observationCutoff: string;
  propertyIdentity: CanonicalPropertyIdentityV1;
  disposition: AcquisitionDisposition;
  executiveSummary: string;
  sections: AcquisitionBriefSectionV1[];
  evidence: PropertyEvidenceItemV1[];
  sourceIndex: Array<{ authority: string; evidenceIds: string[] }>;
  readinessFactors: AcquisitionReadinessFactorV1[];
  scenarioSensitivity: { arv: string | null; repairs: string | null; desiredProfit: string | null; limitations: string[] };
  risks: string[];
  missingInformation: string[];
  recommendedManualResearchAction: { action: string; ownerProfessionalId: string; reason: string };
  professionalVersions: Array<{ professionalId: string; profileVersion: string }>;
  sopVersions: Array<{ sopId: string; version: string }>;
  reportSchemaVersion: "acquisition-decision-brief-v1";
  scoringPolicyVersion: "acquisition-readiness-factors-v1";
  modelVersion: "deterministic-no-model-call-v1";
  promptVersion: null;
  qa: ProfessionalQualityReviewV1;
  permittedUse: "internal_acquisition_review_only";
  advisoryOnly: true;
  requiresHumanReview: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type ProfessionalQualityReviewV1 = {
  reviewId: string;
  reviewerProfessionalId: "property-intelligence-quality-reviewer";
  reviewerProfileVersion: "1.0.0";
  generatorProfessionalIds: string[];
  independentReviewer: boolean;
  status: "certified_for_internal_executive_review" | "not_certified_for_executive_use";
  checks: Array<{ id: string; passed: boolean; reason: string }>;
  prohibitedClaims: string[];
  humanOverride: { overridden: boolean; reason: string | null };
  reviewedAt: string;
};

export type ProfessionalOutcomeEventV1 = {
  eventId: string;
  briefId: string;
  profileVersions: string[];
  evidenceCompleteness: number;
  conflictsDetected: number;
  initialDecision: AcquisitionDisposition | null;
  finalDecision: AcquisitionDisposition | null;
  overrideReason: string | null;
  researchMinutes: number | null;
  usefulnessRating: 1 | 2 | 3 | 4 | 5 | null;
  verifiedOutcome: string | null;
  advisoryOnly: true;
};

const sharedProhibitions = ["contact sellers", "generate or present offers", "mutate CRM", "order paid data", "activate connectors", "publish", "perform legal or appraisal work", "autonomous execution"];
const evidencePolicy: ProfessionalEvidencePolicyV1 = { acceptedAuthorities: ["internal verified record", "seller reported", "official public source", "licensed source after approval"], provenanceRequired: true, freshnessRequired: true, conflictingEvidenceVisible: true, assumptionsLabeled: true, crossPropertyEvidenceBlocked: true };
// Compatibility profiles describe scope only. Certification is established exclusively by persisted EPC assessment and human decision records.
const internalCertification: ProfessionalCertificationV1 = { state: "draft", certifiedFor: "internal_advisory_only", certifiedAt: null, expiresAt: null, suspensionTriggers: ["invented fact", "cross-property evidence", "prohibited execution", "missing provenance"], recertificationTriggers: ["material SOP change", "report schema change", "capability change", "quality threshold failure"] };
const briefStandard: ProfessionalDeliverableStandardV1 = { deliverableType: "acquisition_decision_brief", schemaVersion: "1.0.0", requiredSections: ["identity", "source", "seller context", "public records", "economics", "buyer demand", "risks", "next action"], qualityThresholds: ["no invented facts", "visible data gaps", "claim provenance", "independent QA"] };

function profile(input: Omit<ProfessionalProfileV1, "profileVersion" | "department" | "prohibitedActivities" | "evidencePolicy" | "certification" | "humanReviewRequired" | "titleDoesNotImplyHumanLicensure">): ProfessionalProfileV1 {
  return { ...input, profileVersion: "1.0.0", department: "Property Intelligence", prohibitedActivities: sharedProhibitions, evidencePolicy, certification: internalCertification, humanReviewRequired: true, titleDoesNotImplyHumanLicensure: true };
}

export const propertyIntelligenceProfessionalProfiles: ProfessionalProfileV1[] = [
  profile({ id: "chief-property-intelligence-officer", sourceWorkforceIds: ["county-records-analyst", "deal-analyst"], name: "Chief Property Intelligence Officer AI", manager: "AI COO", rolePurpose: "Triage evidence, assign review, resolve visible conflicts, and present advisory executive context.", responsibilities: ["triage", "cross-role handoffs", "executive presentation"], competencies: [{ id: "evidence-triage", label: "Evidence triage", requiredLevel: "advanced", certificationEvidence: ["conflict handling tests"] }], sopReferences: [{ id: "property-intelligence-operating-sop", version: "1.0.0", title: "Property Intelligence Operating SOP", approvedSource: "internal architecture", required: true }], deliverables: [briefStandard], kpis: [{ id: "decision-quality-per-research-hour", label: "Decision quality per research hour", measure: "CEO usefulness and research time", direction: "increase", outcomeContractRequired: true }], capabilityGrants: [{ capabilityKey: "property.evidence.review", mode: "internal", providerExecutionGranted: false, externalWritesGranted: false }], escalationRules: [{ trigger: "failed QA or unresolved identity", target: "CEO / Approval Safety", requiredEvidence: ["QA result", "identity conflicts"] }] }),
  profile({ id: "property-records-gis-analyst", sourceWorkforceIds: ["county-records-analyst", "property-signal-analyst"], name: "Property Records and GIS Analyst AI", manager: "Chief Property Intelligence Officer AI", rolePurpose: "Prepare source-qualified property identity and public-record evidence.", responsibilities: ["address and parcel identity", "county evidence", "GIS/tax/zoning/flood gap review"], competencies: [{ id: "property-identity", label: "Property identity resolution", requiredLevel: "advanced", certificationEvidence: ["cross-property leakage tests"] }], sopReferences: [{ id: "property-evidence-sop", version: "1.0.0", title: "Property Evidence SOP", approvedSource: "internal architecture", required: true }], deliverables: [briefStandard], kpis: [{ id: "identity-confidence", label: "Property identity confidence", measure: "verified identity coverage", direction: "increase", outcomeContractRequired: true }], capabilityGrants: [{ capabilityKey: "county.records.read_plan", mode: "ueip_read_plan", providerExecutionGranted: false, externalWritesGranted: false }], escalationRules: [{ trigger: "ambiguous parcel or jurisdiction", target: "Chief Property Intelligence Officer AI", requiredEvidence: ["identity candidates", "source references"] }] }),
  profile({ id: "market-valuation-analyst", sourceWorkforceIds: ["deal-analyst"], name: "Market and Valuation Analyst AI", manager: "Chief Property Intelligence Officer AI", rolePurpose: "Prepare transparent value ranges and sensitivity context without producing an appraisal.", responsibilities: ["value input review", "range methodology", "uncertainty disclosure"], competencies: [{ id: "valuation-boundary", label: "Valuation methodology and appraisal boundary", requiredLevel: "advanced", certificationEvidence: ["unsupported valuation rejection tests"] }], sopReferences: [{ id: "valuation-range-sop", version: "1.0.0", title: "Internal Value Range SOP", approvedSource: "internal architecture", required: true }], deliverables: [briefStandard], kpis: [{ id: "assumption-visibility", label: "Valuation assumption visibility", measure: "labeled inputs and gaps", direction: "increase", outcomeContractRequired: true }], capabilityGrants: [{ capabilityKey: "property.valuation.prepare", mode: "internal", providerExecutionGranted: false, externalWritesGranted: false }], escalationRules: [{ trigger: "missing or unlicensed comparable authority", target: "Property Intelligence Quality Reviewer AI", requiredEvidence: ["source license", "selection method"] }] }),
  profile({ id: "investment-acquisition-analyst", sourceWorkforceIds: ["deal-analyst", "offer-recommendation"], name: "Investment and Acquisition Analyst AI", manager: "Chief Property Intelligence Officer AI", rolePurpose: "Combine verified inputs, economics, buyer demand, and risk into an advisory research priority.", responsibilities: ["factor calculation", "buyer demand alignment", "manual next-step recommendation"], competencies: [{ id: "acquisition-analysis", label: "Explainable acquisition analysis", requiredLevel: "advanced", certificationEvidence: ["calculation lineage tests"] }], sopReferences: [{ id: "acquisition-review-sop", version: "1.0.0", title: "Acquisition Review SOP", approvedSource: "internal architecture", required: true }], deliverables: [briefStandard], kpis: [{ id: "research-priority-usefulness", label: "Research priority usefulness", measure: "CEO usefulness without false priority increase", direction: "increase", outcomeContractRequired: true }], capabilityGrants: [{ capabilityKey: "acquisition.brief.prepare", mode: "internal", providerExecutionGranted: false, externalWritesGranted: false }], escalationRules: [{ trigger: "economics depend on missing facts", target: "Chief Property Intelligence Officer AI", requiredEvidence: ["missing inputs", "sensitivity result"] }] }),
  profile({ id: "property-intelligence-quality-reviewer", sourceWorkforceIds: ["property-signal-analyst"], name: "Property Intelligence Quality Reviewer AI", manager: "Approval / Safety", rolePurpose: "Independently reject unsupported, conflicting, misleading, or unsafe executive briefs.", responsibilities: ["identity QA", "claim provenance QA", "calculation and safety QA"], competencies: [{ id: "independent-qa", label: "Independent evidence and safety review", requiredLevel: "reviewer", certificationEvidence: ["seeded conflict detection tests"] }], sopReferences: [{ id: "property-qa-sop", version: "1.0.0", title: "Property Intelligence QA SOP", approvedSource: "internal architecture", required: true }], deliverables: [briefStandard], kpis: [{ id: "prohibited-claim-detection", label: "Prohibited claim detection", measure: "seeded prohibited claims caught", direction: "increase", outcomeContractRequired: true }], capabilityGrants: [{ capabilityKey: "property.brief.review", mode: "internal", providerExecutionGranted: false, externalWritesGranted: false }], escalationRules: [{ trigger: "failed evidence or compliance gate", target: "Approval / Safety", requiredEvidence: ["failed checks", "affected claims"] }] }),
];

export const professionalArchitectureInventory = [
  { capability: "AI workforce registry", classification: "reuse", authority: "lib/ai-workforce.ts" },
  { capability: "department mission orchestration", classification: "reuse", authority: "lib/department-operating-system.ts" },
  { capability: "property identity and dashboard record", classification: "consolidate", authority: "lib/property-records.ts" },
  { capability: "county capability governance", classification: "consolidate", authority: "lib/county-capability-registry.ts" },
  { capability: "acquisition factor inputs", classification: "consolidate", authority: "existing acquisition scoring and deal analysis" },
  { capability: "buyer demand signals", classification: "reuse", authority: "lib/buyer-demand.ts" },
  { capability: "provider boundaries", classification: "reuse", authority: "UEIP" },
  { capability: "new overlapping county/acquisition engines", classification: "deprecated", authority: "prohibited during pilot" },
] as const;

function clean(value: string | null | undefined) { return value?.trim() || null; }
function normalizeAddress(lead: StoredLead) { const street = clean(lead.propertyAddress); return street ? [street, clean(lead.city), clean(lead.state)?.toUpperCase(), clean(lead.zipCode)].filter(Boolean).join(", ") : null; }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function numberFrom(value: string | null | undefined) { if (!value) return null; const parsed = Number(value.replace(/[$,\s]/g, "")); return Number.isFinite(parsed) ? parsed : null; }

export function createCanonicalPropertyIdentity(lead: StoredLead): CanonicalPropertyIdentityV1 {
  const address = normalizeAddress(lead);
  const parcelId = clean(lead.parcelId);
  const county = clean(lead.county);
  const conflicts: string[] = [];
  if (address && clean(lead.state) && !address.toLowerCase().includes(clean(lead.state)!.toLowerCase())) conflicts.push("Address and state could not be reconciled.");
  const confidence = Math.min(100, (address ? 50 : 0) + (parcelId ? 30 : 0) + (county ? 20 : 0));
  const method = address && parcelId ? "address_and_parcel" : address ? "address_only" : parcelId ? "parcel_only" : "insufficient_identity";
  return { identityId: `property:${slug([address, parcelId, county, lead.id].filter(Boolean).join("|"))}`, normalizedAddress: address, parcelId, county, jurisdiction: county ? `${county}${clean(lead.state) ? `, ${clean(lead.state)!.toUpperCase()}` : ""}` : null, sourceIdentifiers: [{ source: "internal_lead", identifier: lead.id }, ...(parcelId ? [{ source: "lead_parcel_field", identifier: parcelId }] : [])], leadId: lead.id, propertyRecordId: null, confidence, matchMethod: method, conflicts, unresolvedCandidates: [], humanVerificationState: conflicts.length ? "conflict_review_required" : "not_reviewed" };
}

function evidence(input: Omit<PropertyEvidenceItemV1, "evidenceId" | "retrievedAt" | "permittedUse" | "contradictsEvidenceIds" | "supersedesEvidenceId">, now: string): PropertyEvidenceItemV1 {
  return { ...input, evidenceId: `evidence:${slug(`${input.propertyIdentityId}:${input.category}:${input.field}:${input.sourceRecordReference}`)}`, retrievedAt: now, permittedUse: "internal_acquisition_review_only", contradictsEvidenceIds: [], supersedesEvidenceId: null };
}

function leadEvidence(lead: StoredLead, identity: CanonicalPropertyIdentityV1, now: string, buyerDemand?: BuyerDemandSignals | null) {
  const items: PropertyEvidenceItemV1[] = [];
  const add = (item: Omit<PropertyEvidenceItemV1, "evidenceId" | "retrievedAt" | "permittedUse" | "contradictsEvidenceIds" | "supersedesEvidenceId">) => items.push(evidence(item, now));
  const base = { propertyIdentityId: identity.identityId, observedAt: lead.timestamp || null, freshnessPolicy: "Review against current authoritative source before action.", sensitivity: "confidential" as const };
  if (identity.normalizedAddress) add({ ...base, category: "identity", field: "normalizedAddress", value: identity.normalizedAddress, unit: null, sourceAuthority: "internal lead record", sourceRecordReference: lead.id, confidence: identity.confidence, verificationState: "partially_verified", responsibleProfessionalId: "property-records-gis-analyst" });
  if (identity.parcelId) add({ ...base, category: "identity", field: "parcelId", value: identity.parcelId, unit: null, sourceAuthority: "internal lead record", sourceRecordReference: lead.id, confidence: 60, verificationState: "partially_verified", responsibleProfessionalId: "property-records-gis-analyst" });
  if (lead.source) add({ ...base, category: "lead_source", field: "leadSource", value: lead.source, unit: null, sourceAuthority: "internal source attribution", sourceRecordReference: lead.id, confidence: 70, verificationState: "partially_verified", responsibleProfessionalId: "chief-property-intelligence-officer" });
  for (const [field, value] of [["situationDetails", lead.situationDetails], ["sellerReply", lead.lastSellerReply ?? ""]] as const) if (clean(value)) add({ ...base, category: "seller_reported", field, value, unit: null, sourceAuthority: "seller-reported/internal operator record", sourceRecordReference: lead.id, confidence: 50, verificationState: "partially_verified", responsibleProfessionalId: "investment-acquisition-analyst" });
  for (const [field, value] of [["arv", lead.analyzer.arv], ["estimatedRepairs", lead.analyzer.estimatedRepairs], ["desiredProfit", lead.analyzer.desiredProfit]] as const) if (numberFrom(value) !== null) add({ ...base, category: field === "arv" ? "valuation_input" : "cost_assumption", field, value: numberFrom(value), unit: "USD", sourceAuthority: "internal operator-entered analyzer input", sourceRecordReference: lead.id, confidence: 35, verificationState: "assumption", responsibleProfessionalId: field === "arv" ? "market-valuation-analyst" : "investment-acquisition-analyst" });
  if (buyerDemand && clean(lead.zipCode)) { const matching = buyerDemand.hotZips.find((item) => item.label === lead.zipCode); add({ ...base, category: "buyer_demand", field: "zipDemandSignal", value: matching?.count ?? 0, unit: "weighted_activity_count", sourceAuthority: "internal buyer activity", sourceRecordReference: `buyer-demand:${lead.zipCode}`, confidence: matching ? 75 : 30, verificationState: matching ? "verified" : "unavailable", responsibleProfessionalId: "investment-acquisition-analyst" }); }
  return items;
}

function sourceIndex(items: PropertyEvidenceItemV1[]) { return [...new Set(items.map((item) => item.sourceAuthority))].sort().map((authority) => ({ authority, evidenceIds: items.filter((item) => item.sourceAuthority === authority).map((item) => item.evidenceId) })); }
function itemsByCategory(items: PropertyEvidenceItemV1[], categories: PropertyEvidenceItemV1["category"][]) { return items.filter((item) => categories.includes(item.category)); }

function section(input: { id: string; title: string; items: PropertyEvidenceItemV1[]; missing: string[]; professional: string; summary: string; conflicts?: string[] }): AcquisitionBriefSectionV1 {
  const conflicts = input.conflicts ?? [];
  const status: EvidenceVerificationState = conflicts.length ? "conflicting" : input.items.length === 0 ? "unavailable" : input.items.every((item) => item.verificationState === "verified") ? "verified" : input.items.some((item) => item.verificationState === "assumption") ? "assumption" : "partially_verified";
  return { id: input.id, title: input.title, status, summary: input.summary, evidenceIds: input.items.map((item) => item.evidenceId), assumptions: input.items.filter((item) => item.verificationState === "assumption").map((item) => `${item.field} is an operator-entered assumption.`), missingData: input.missing, conflicts, responsibleProfessionalId: input.professional, qaStatus: "pending", humanReviewRequired: true, permittedUse: "internal_acquisition_review_only" };
}

function qualityReview(input: { briefId: string; identity: CanonicalPropertyIdentityV1; sections: AcquisitionBriefSectionV1[]; evidence: PropertyEvidenceItemV1[]; generatedBy: string[]; now: string }): ProfessionalQualityReviewV1 {
  const identityMatch = input.evidence.every((item) => item.propertyIdentityId === input.identity.identityId);
  const provenance = input.evidence.every((item) => item.sourceAuthority && item.sourceRecordReference);
  const sellerSeparated = input.evidence.filter((item) => item.category === "seller_reported").every((item) => item.sourceAuthority.toLowerCase().includes("seller-reported"));
  const missingVisible = input.sections.every((item) => item.status !== "unavailable" || item.missingData.length > 0);
  const forbiddenPattern = /guaranteed|certified appraisal|good school|bad school|clear title|legal advice/i;
  const prohibitedClaims = input.sections.flatMap((item) => item.summary.match(forbiddenPattern) ?? []);
  const checks = [
    { id: "canonical-property-match", passed: identityMatch, reason: identityMatch ? "All evidence matches the canonical property." : "Cross-property evidence detected." },
    { id: "claim-provenance", passed: provenance, reason: provenance ? "Evidence contains authority and record references." : "Evidence provenance is incomplete." },
    { id: "seller-report-separation", passed: sellerSeparated, reason: sellerSeparated ? "Seller-reported statements remain labeled." : "Seller-reported data was presented as verified." },
    { id: "missing-data-visibility", passed: missingVisible, reason: missingVisible ? "Unavailable sections expose data gaps." : "An unavailable section hid its data gap." },
    { id: "prohibited-claim-boundary", passed: prohibitedClaims.length === 0, reason: prohibitedClaims.length ? "Prohibited or unsupported claim language detected." : "No prohibited claim language detected." },
    { id: "independent-reviewer", passed: !input.generatedBy.includes("property-intelligence-quality-reviewer"), reason: "The QA reviewer is separate from report generators." },
  ];
  const passed = checks.every((check) => check.passed) && input.identity.matchMethod !== "insufficient_identity";
  return { reviewId: `qa:${input.briefId}`, reviewerProfessionalId: "property-intelligence-quality-reviewer", reviewerProfileVersion: "1.0.0", generatorProfessionalIds: input.generatedBy, independentReviewer: true, status: passed ? "certified_for_internal_executive_review" : "not_certified_for_executive_use", checks, prohibitedClaims, humanOverride: { overridden: false, reason: null }, reviewedAt: input.now };
}

export function createAcquisitionDecisionBrief(input: { lead: StoredLead; buyerDemand?: BuyerDemandSignals | null; additionalEvidence?: PropertyEvidenceItemV1[]; generatedAt?: Date; inputSnapshotVersion?: string }): AcquisitionDecisionBriefV1 {
  const now = (input.generatedAt ?? new Date()).toISOString();
  const identity = createCanonicalPropertyIdentity(input.lead);
  const generated = leadEvidence(input.lead, identity, now, input.buyerDemand);
  const admittedAdditional = (input.additionalEvidence ?? []).filter((item) => item.propertyIdentityId === identity.identityId);
  const rejectedCrossProperty = (input.additionalEvidence ?? []).length - admittedAdditional.length;
  const allEvidence = [...generated, ...admittedAdditional];
  const identityItems = itemsByCategory(allEvidence, ["identity"]);
  const sourceItems = itemsByCategory(allEvidence, ["lead_source"]);
  const sellerItems = itemsByCategory(allEvidence, ["seller_reported"]);
  const publicItems = itemsByCategory(allEvidence, ["public_record", "tax", "gis", "zoning", "flood"]);
  const economicsItems = itemsByCategory(allEvidence, ["valuation_input", "cost_assumption", "deal_economics"]);
  const demandItems = itemsByCategory(allEvidence, ["buyer_demand"]);
  const missingIdentity = [!identity.normalizedAddress ? "normalized address" : "", !identity.parcelId ? "parcel identifier" : "", !identity.county ? "county" : ""].filter(Boolean);
  const sections = [
    section({ id: "identity", title: "Property Identity", items: identityItems, missing: missingIdentity, professional: "property-records-gis-analyst", summary: identity.matchMethod === "insufficient_identity" ? "Property identity is insufficient for analysis." : `Identity confidence is ${identity.confidence}/100; human verification remains required.`, conflicts: identity.conflicts }),
    section({ id: "lead-source", title: "Lead Source", items: sourceItems, missing: sourceItems.length ? [] : ["verified lead source"], professional: "chief-property-intelligence-officer", summary: sourceItems.length ? "Lead source attribution is available but must be verified before ROI attribution." : "Lead source is unavailable." }),
    section({ id: "seller-context", title: "Seller-Reported Context", items: sellerItems, missing: sellerItems.length ? [] : ["seller-reported motivation, condition, or timing"], professional: "investment-acquisition-analyst", summary: sellerItems.length ? "Seller-reported context is available and is not treated as independently verified." : "No seller-reported context is available." }),
    section({ id: "public-records", title: "Public Records, Tax, GIS, Zoning, and Flood", items: publicItems, missing: publicItems.length ? [] : ["verified official public-record evidence"], professional: "property-records-gis-analyst", summary: publicItems.length ? "Official-source evidence is available subject to source limitations." : "No verified public-record evidence was supplied; no property fact is inferred." }),
    section({ id: "economics", title: "Value and Deal Economics", items: economicsItems, missing: [numberFrom(input.lead.analyzer.arv) === null ? "ARV assumption" : "", numberFrom(input.lead.analyzer.estimatedRepairs) === null ? "repair assumption" : "", numberFrom(input.lead.analyzer.desiredProfit) === null ? "desired profit assumption" : ""].filter(Boolean), professional: "market-valuation-analyst", summary: economicsItems.length ? "Operator-entered economics are assumptions for sensitivity review, not an appraisal or offer." : "Economics cannot be evaluated from current evidence." }),
    section({ id: "buyer-demand", title: "Buyer Demand", items: demandItems, missing: demandItems.length ? [] : ["current internal buyer-demand signal"], professional: "investment-acquisition-analyst", summary: demandItems.length ? "Internal buyer activity provides a disposition signal, not a guarantee of sale." : "Buyer-demand evidence is unavailable." }),
  ];
  if (rejectedCrossProperty) sections[0].conflicts.push(`${rejectedCrossProperty} evidence item(s) were rejected because they did not match the canonical property.`);
  const economicsReady = economicsItems.length >= 3;
  const demandMatch = demandItems.find((item) => item.verificationState === "verified");
  const factors: AcquisitionReadinessFactorV1[] = [
    { id: "identity", label: "Property identity", score: identity.confidence, weight: 35, explanation: `Based on address, parcel, and county coverage using ${identity.matchMethod}.`, evidenceIds: identityItems.map((item) => item.evidenceId), missingData: missingIdentity },
    { id: "source", label: "Source attribution", score: sourceItems.length ? 70 : 0, weight: 15, explanation: sourceItems.length ? "Internal attribution exists but is not independently verified." : "Source attribution is missing.", evidenceIds: sourceItems.map((item) => item.evidenceId), missingData: sourceItems.length ? [] : ["verified source"] },
    { id: "economics", label: "Economics readiness", score: economicsReady ? 65 : economicsItems.length * 20, weight: 30, explanation: "Measures presence of labeled ARV, repairs, and desired-profit assumptions; it is not a deal value score.", evidenceIds: economicsItems.map((item) => item.evidenceId), missingData: sections.find((item) => item.id === "economics")!.missingData },
    { id: "buyer-demand", label: "Buyer-demand coverage", score: demandMatch ? Math.min(80, 40 + Number(demandMatch.value ?? 0)) : 0, weight: 20, explanation: demandMatch ? "Derived from internal buyer activity in the property ZIP." : "No matching verified internal buyer-demand evidence.", evidenceIds: demandItems.map((item) => item.evidenceId), missingData: demandItems.length ? [] : ["buyer-demand evidence"] },
  ];
  const conflicts = [...identity.conflicts, ...sections.flatMap((item) => item.conflicts)];
  const missingInformation = [...new Set(sections.flatMap((item) => item.missingData))];
  const disposition: AcquisitionDisposition = identity.matchMethod === "insufficient_identity" ? "not_actionable_with_current_evidence" : conflicts.length ? "manager_review" : identity.confidence >= 80 && economicsReady ? "research_next" : "hold_missing_data";
  const inputSnapshotVersion = input.inputSnapshotVersion ?? input.lead.timestamp ?? "current";
  const briefId = `pwe-brief:${slug(`${input.lead.id}:${inputSnapshotVersion}`)}`;
  const generators = ["chief-property-intelligence-officer", "property-records-gis-analyst", "market-valuation-analyst", "investment-acquisition-analyst"];
  const qa = qualityReview({ briefId, identity, sections, evidence: allEvidence, generatedBy: generators, now });
  const finalSections = sections.map((item) => ({ ...item, qaStatus: qa.status === "certified_for_internal_executive_review" ? "passed" as const : "failed" as const }));
  const action = disposition === "research_next" ? "Manually verify parcel, public records, and economics before acquisition review." : disposition === "manager_review" ? "Resolve identity or evidence conflicts with the Property Intelligence manager." : disposition === "hold_missing_data" ? `Collect the highest-impact missing input: ${missingInformation[0] ?? "verified property evidence"}.` : "Do not advance until a usable property identity is established.";
  return { briefId, briefVersion: "1.0.0", inputSnapshotVersion, generatedAt: now, observationCutoff: now, propertyIdentity: identity, disposition, executiveSummary: `Advisory disposition: ${disposition}. Identity confidence ${identity.confidence}/100. ${missingInformation.length} visible data gap(s) and ${conflicts.length} conflict(s).`, sections: finalSections, evidence: allEvidence, sourceIndex: sourceIndex(allEvidence), readinessFactors: factors, scenarioSensitivity: { arv: clean(input.lead.analyzer.arv), repairs: clean(input.lead.analyzer.estimatedRepairs), desiredProfit: clean(input.lead.analyzer.desiredProfit), limitations: ["Operator-entered inputs are assumptions.", "This is not an appraisal, offer, or guarantee."] }, risks: [...new Set([...conflicts, ...(input.lead.doNotContact ? ["Do-not-contact status is active; this brief does not authorize outreach."] : []), ...(identity.confidence < 80 ? ["Property identity requires further verification."] : [])])], missingInformation, recommendedManualResearchAction: { action, ownerProfessionalId: disposition === "manager_review" ? "chief-property-intelligence-officer" : "property-records-gis-analyst", reason: `Selected from disposition ${disposition}; no task or external action was created.` }, professionalVersions: propertyIntelligenceProfessionalProfiles.map((item) => ({ professionalId: item.id, profileVersion: item.profileVersion })), sopVersions: propertyIntelligenceProfessionalProfiles.flatMap((item) => item.sopReferences.map((sop) => ({ sopId: sop.id, version: sop.version }))).filter((item, index, items) => items.findIndex((candidate) => candidate.sopId === item.sopId && candidate.version === item.version) === index), reportSchemaVersion: "acquisition-decision-brief-v1", scoringPolicyVersion: "acquisition-readiness-factors-v1", modelVersion: "deterministic-no-model-call-v1", promptVersion: null, qa, permittedUse: "internal_acquisition_review_only", advisoryOnly: true, requiresHumanReview: true, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false };
}

export type PilotComparisonRecord = { cohort: "calibration" | "validation"; briefId: string; baselineResearchMinutes: number; assistedResearchMinutes: number; usefulnessRating: 1 | 2 | 3 | 4 | 5; initialDecision: AcquisitionDisposition; finalDecision: AcquisitionDisposition; inventedFacts: number; crossPropertyLeaks: number; unauthorizedActions: number; seededIssues: number; detectedSeededIssues: number; falseHighPriorityIncrease: boolean };

export function evaluateProfessionalPilot(records: PilotComparisonRecord[]) {
  const validation = records.filter((item) => item.cohort === "validation");
  const improvements = validation.map((item) => item.baselineResearchMinutes > 0 ? ((item.baselineResearchMinutes - item.assistedResearchMinutes) / item.baselineResearchMinutes) * 100 : 0).sort((a, b) => a - b);
  const medianImprovementPercent = improvements.length ? improvements[Math.floor(improvements.length / 2)] : 0;
  const usefulPercent = validation.length ? (validation.filter((item) => item.usefulnessRating >= 4).length / validation.length) * 100 : 0;
  const seeded = records.reduce((sum, item) => sum + item.seededIssues, 0);
  const detected = records.reduce((sum, item) => sum + item.detectedSeededIssues, 0);
  const criteria = { calibrationAtLeast10: records.filter((item) => item.cohort === "calibration").length >= 10, validationAtLeast20: validation.length >= 20, zeroInventedFacts: records.every((item) => item.inventedFacts === 0), zeroCrossPropertyLeaks: records.every((item) => item.crossPropertyLeaks === 0), zeroUnauthorizedActions: records.every((item) => item.unauthorizedActions === 0), allSeededIssuesDetected: seeded > 0 && detected === seeded, medianResearchTimeImprovement: medianImprovementPercent >= 25, usefulnessThreshold: usefulPercent >= 80, noFalsePriorityIncrease: validation.every((item) => !item.falseHighPriorityIncrease) };
  return { status: Object.values(criteria).every(Boolean) ? "promotion_ready" as const : "calibration_required" as const, criteria, medianImprovementPercent: Math.round(medianImprovementPercent), usefulPercent: Math.round(usefulPercent), seededIssueDetectionPercent: seeded ? Math.round((detected / seeded) * 100) : 0, providerCalled: false, liveExecutionAllowed: false };
}

export type CandidatePropertySource = { id: string; decisionImpact: number; sectionCoverage: number; dataGapFrequency: number; authority: number; freshness: number; reuse: number; integrationCost: number; maintenanceCost: number; licensingRisk: number; privacyRisk: number };
export function scoreMarginalPropertySource(source: CandidatePropertySource) { const benefit = source.decisionImpact + source.sectionCoverage + source.dataGapFrequency + source.authority + source.freshness + source.reuse; const costRisk = source.integrationCost + source.maintenanceCost + source.licensingRisk + source.privacyRisk; const score = Math.max(0, Math.min(100, Math.round(benefit / 6 - costRisk / 8))); return { sourceId: source.id, score, decision: score >= 60 ? "prepare_ueip_intake" as const : score >= 40 ? "collect_more_evidence" as const : "defer" as const, providerCalled: false, liveExecutionAllowed: false }; }

export function createProfessionalWorkforceReport() { return { initiative: "Enterprise Professional Workforce Platform", primaryMetric: "acquisition decision quality per CEO research hour", architectureInventory: professionalArchitectureInventory, profiles: propertyIntelligenceProfessionalProfiles, profileCount: propertyIntelligenceProfessionalProfiles.length, authorizedOutput: "AcquisitionDecisionBriefV1", providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false }; }
