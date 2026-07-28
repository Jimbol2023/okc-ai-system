type TimedResponse = { status: number; durationMs: number; body: Record<string, unknown> | null };

export {};

async function main() {
const baseUrl = process.env.PRESSURE_BASE_URL;
const authCookie = process.env.PRESSURE_AUTH_COOKIE;
const target = process.env.PRESSURE_TARGET;
const confirmation = process.env.PRESSURE_CONFIRMATION;

if (!baseUrl || !authCookie) throw new Error("PRESSURE_BASE_URL_and_PRESSURE_AUTH_COOKIE_required");
if (target !== "development" && target !== "staging") throw new Error("PRESSURE_TARGET_must_be_development_or_staging");
if (confirmation !== "ISOLATED_NON_PRODUCTION_DATABASE") throw new Error("isolated_non_production_confirmation_required");
if (/prod|production/i.test(new URL(baseUrl).hostname)) throw new Error("production_pressure_target_blocked");

const endpoint = new URL("/api/admin/professional-cases", baseUrl).toString();
const searchEndpoint = new URL("/api/company/search-market-intelligence", baseUrl).toString();
const commonHeaders = { cookie: authCookie, "content-type": "application/json" };
const percentile = (values: number[], percentileValue: number) => [...values].sort((a, b) => a - b)[Math.max(0, Math.ceil(values.length * percentileValue) - 1)] ?? 0;

async function timedFetch(init?: RequestInit, targetEndpoint = endpoint): Promise<TimedResponse> {
  const startedAt = performance.now();
  const response = await fetch(targetEndpoint, { ...init, headers: { ...commonHeaders, ...init?.headers } });
  const body = await response.json().catch(() => null) as Record<string, unknown> | null;
  return { status: response.status, durationMs: performance.now() - startedAt, body };
}

async function concurrent<T>(count: number, operation: (index: number) => Promise<T>) {
  return Promise.all(Array.from({ length: count }, (_, index) => operation(index)));
}

const readResults = await concurrent(100, () => timedFetch());
const readFailures = readResults.filter((result) => result.status !== 200);
if (readFailures.length / readResults.length >= 0.01) throw new Error(`read_error_rate_gate_failed:${readFailures.length}`);
const readP95 = percentile(readResults.map((result) => result.durationMs), 0.95);
if (readP95 > Number(process.env.PRESSURE_READ_P95_MS ?? 8_000)) throw new Error(`read_p95_gate_failed:${Math.round(readP95)}`);

const runId = `pressure-${Date.now()}`;
const caseIdempotencyKey = `${runId}:case`;
const sourceReference = `isolated-pressure:${runId}`;
const createPayload = {
  confirmation: "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK",
  operation: "create_case",
  caseType: "pressure_validation",
  title: "Isolated professional case pressure validation",
  objective: "Verify idempotency and tenant-safe internal persistence without provider execution.",
  sourceLabel: "repository_local_pressure_harness",
  sourceReference,
  leadProfessionalId: "senior-seo-director",
  independentReviewerId: "marketing-quality-reviewer",
  department: "Marketing Intelligence",
  businessModule: "ai-core",
  evidenceSnapshot: { sourceReference, synthetic: true, productionData: false },
  limitations: { items: ["Synthetic isolated-database validation only."] },
};
const createResults = await concurrent(50, () => timedFetch({ method: "POST", headers: { "idempotency-key": caseIdempotencyKey }, body: JSON.stringify(createPayload) }));
if (createResults.some((result) => result.status !== 201)) {
  const failures = createResults.filter((result) => result.status !== 201).map((result) => `${result.status}:${String(result.body?.error ?? "unknown")}`);
  throw new Error(`idempotent_case_create_failed:${failures.join(",")}`);
}
if (createResults.some((result) => result.body?.providerCalled !== false || result.body?.externalActionsAllowed !== false)) throw new Error("provider_or_external_action_boundary_failed");

const view = await timedFetch();
if (view.status !== 200 || !Array.isArray(view.body?.records)) throw new Error("professional_case_readback_failed");
const matchingCases = (view.body.records as Array<Record<string, unknown>>).filter((record) => record.sourceReference === sourceReference);
if (matchingCases.length !== 1) throw new Error(`duplicate_professional_cases_detected:${matchingCases.length}`);
const assignments = matchingCases[0]?.assignments;
const professionalCaseId = matchingCases[0]?.id;
if (typeof professionalCaseId !== "string") throw new Error("professional_case_id_missing");
if (!Array.isArray(assignments)) throw new Error("professional_assignments_missing");
const leadAssignment = (assignments as Array<Record<string, unknown>>).find((assignment) => assignment.assignmentRole === "lead");
if (typeof leadAssignment?.id !== "string") throw new Error("lead_assignment_missing");

const claimResults = await concurrent(25, (index) => timedFetch({ method: "POST", headers: { "idempotency-key": `${runId}:claim:${index}` }, body: JSON.stringify({ confirmation: "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK", operation: "claim_assignment", assignmentId: leadAssignment.id }) }));
const successfulClaims = claimResults.filter((result) => result.status === 201);
const deliberateConflicts = claimResults.filter((result) => result.status === 409);
if (successfulClaims.length !== 1 || deliberateConflicts.length !== 24) throw new Error(`assignment_claim_contention_failed:success=${successfulClaims.length}:conflict=${deliberateConflicts.length}`);

const contribution = await timedFetch({ method: "POST", headers: { "idempotency-key": `${runId}:contribution` }, body: JSON.stringify({ confirmation: "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK", operation: "contribution", caseId: professionalCaseId, professionalId: "senior-seo-director", department: "Search and Market Intelligence", contributionType: "pressure_validation", sourceLabel: "repository_local_pressure_harness", sourceReferences: [sourceReference], content: { synthetic: true, providerCalled: false }, limitations: { items: ["Synthetic pressure evidence only."] } }) });
if (contribution.status !== 201) throw new Error(`pressure_contribution_failed:${contribution.status}:${String(contribution.body?.error ?? "unknown")}`);

const qaResults = await concurrent(25, (index) => timedFetch({ method: "POST", headers: { "idempotency-key": `${runId}:qa:${index}` }, body: JSON.stringify({ confirmation: "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK", operation: "request_qa", caseId: professionalCaseId }) }));
const successfulQaRequests = qaResults.filter((result) => result.status === 201);
const qaConflicts = qaResults.filter((result) => result.status === 409);
if (successfulQaRequests.length !== 1 || qaConflicts.length !== 24) throw new Error(`qa_contention_failed:success=${successfulQaRequests.length}:conflict=${qaConflicts.length}`);

const reviewResults = await concurrent(25, (index) => timedFetch({ method: "POST", headers: { "idempotency-key": `${runId}:review:${index}` }, body: JSON.stringify({ confirmation: "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK", operation: "review", caseId: professionalCaseId, deliverableId: "executive-seo-brief", generatorId: "senior-seo-director", reviewerId: "marketing-quality-reviewer", status: "passed", rubricVersion: "1.0.0", checks: { provenance: true, authority: true, synthetic: true }, blockingDefects: [], rationale: "Synthetic independent pressure review." }) }));
const successfulReviews = reviewResults.filter((result) => result.status === 201);
const reviewConflicts = reviewResults.filter((result) => result.status === 409);
if (successfulReviews.length !== 1 || reviewConflicts.length !== 24) throw new Error(`review_contention_failed:success=${successfulReviews.length}:conflict=${reviewConflicts.length}`);

const decisionResults = await concurrent(25, (index) => timedFetch({ method: "POST", headers: { "idempotency-key": `${runId}:decision:${index}` }, body: JSON.stringify({ confirmation: "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK", operation: "decision", caseId: professionalCaseId, decision: "retain_internal_only", rationale: "Synthetic pressure decision with no execution authority.", evidenceReferences: [sourceReference], executionAuthorized: false }) }));
const successfulDecisions = decisionResults.filter((result) => result.status === 201);
const decisionConflicts = decisionResults.filter((result) => result.status === 409);
if (successfulDecisions.length !== 1 || decisionConflicts.length !== 24) throw new Error(`decision_contention_failed:success=${successfulDecisions.length}:conflict=${decisionConflicts.length}`);

const mondayResults = await concurrent(25, () => timedFetch({ method: "POST", headers: { "idempotency-key": `${runId}:monday-packet` }, body: JSON.stringify({ confirmation: "PREPARE_INTERNAL_SEARCH_MARKET_INTELLIGENCE", operation: "prepare_monday_packet" }) }, searchEndpoint));
if (mondayResults.some((result) => result.status !== 201 || result.body?.providerCalled !== false || result.body?.externalWritesAllowed !== false || result.body?.liveExecutionAllowed !== false)) throw new Error(`search_monday_contention_failed:${mondayResults.filter((result) => result.status !== 201).map((result) => `${result.status}:${String(result.body?.error ?? "unknown")}`).join(",")}`);
const searchView = await timedFetch(undefined, searchEndpoint);
const searchCases = Array.isArray(searchView.body?.cases) ? searchView.body.cases as Array<Record<string, unknown>> : [];
if (searchCases.filter((record) => record.caseType === "search_market_monday_packet").length !== 1) throw new Error("duplicate_search_monday_packet_detected");

const successfulMutations = [...createResults, ...successfulClaims, contribution, ...successfulQaRequests, ...successfulReviews, ...successfulDecisions, ...mondayResults];
const mutationP95 = percentile(successfulMutations.map((result) => result.durationMs), 0.95);
const mutationMaximum = Math.max(...successfulMutations.map((result) => result.durationMs));
if (mutationMaximum > Number(process.env.PRESSURE_MUTATION_MAX_MS ?? 30_000)) throw new Error(`mutation_duration_gate_failed:${Math.round(mutationMaximum)}`);

process.stdout.write(`${JSON.stringify({ ok: true, target, syntheticOnly: true, readCount: readResults.length, readP95Ms: Math.round(readP95), duplicateCreateAttempts: createResults.length, persistedCaseCount: matchingCases.length, assignmentClaimAttempts: claimResults.length, successfulClaims: successfulClaims.length, deliberateConflicts: deliberateConflicts.length, qaAttempts: qaResults.length, successfulQaRequests: successfulQaRequests.length, reviewAttempts: reviewResults.length, successfulReviews: successfulReviews.length, decisionAttempts: decisionResults.length, successfulDecisions: successfulDecisions.length, mondayPacketAttempts: mondayResults.length, persistedMondayPacketCount: 1, mutationP95Ms: Math.round(mutationP95), mutationMaximumMs: Math.round(mutationMaximum), providerCalled: false, externalActionsAllowed: false }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "professional_case_pressure_failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
