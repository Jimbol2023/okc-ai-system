import { createHash } from "node:crypto";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getLatestTenantBusinessSnapshots, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";
import { appendProfessionalContribution, claimProfessionalAssignment, createProfessionalCase, listProfessionalCases, requestProfessionalCaseQa, scheduledProfessionalCaseProductionCap } from "@/lib/professional-case-runtime";
import { assertTenantSearchMarketEvidence, createSearchMarketIntelligencePacket, evaluateSearchMarketMateriality, type SearchMarketIntelligencePacketV1 } from "@/lib/search-market-intelligence";

type Actor = { tenantId: string; actorId: string };
type PacketKind = "delta" | "monday";

function json(value: unknown) { return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonObject; }
function digest(value: string) { return createHash("sha256").update(value).digest("hex").slice(0, 48); }
function evidenceCohorts(snapshots: BusinessDataSnapshotRecord[]) {
  const orderedDates = [...new Set(snapshots.map((snapshot) => new Date(snapshot.snapshotDate).toISOString()))].sort().reverse();
  return { current: snapshots.filter((snapshot) => new Date(snapshot.snapshotDate).toISOString() === orderedDates[0]), previous: snapshots.filter((snapshot) => new Date(snapshot.snapshotDate).toISOString() === orderedDates[1]) };
}

function mondayStart(now: Date) {
  const value = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = value.getUTCDay(); value.setUTCDate(value.getUTCDate() - (day === 0 ? 6 : day - 1));
  return value.toISOString().slice(0, 10);
}

async function persistPacketCase(input: { actor: Actor; packet: SearchMarketIntelligencePacketV1; requestIdempotencyKey: string }) {
  if (!/^[A-Za-z0-9._:-]{12,120}$/.test(input.requestIdempotencyKey)) throw new Error("invalid_idempotency_key");
  const identityMaterial = input.packet.packetKind === "monday" ? `${input.actor.tenantId}:monday:${mondayStart(new Date(input.packet.evidenceCutoff))}` : `${input.actor.tenantId}:delta:${input.packet.evidenceHashes.sort().join(":")}`;
  const caseKey = `search-market:${input.packet.packetKind}:${digest(identityMaterial)}`;
  const record = await createProfessionalCase({ actor: input.actor, idempotencyKey: caseKey, caseType: input.packet.packetKind === "monday" ? "search_market_monday_packet" : "search_market_delta", title: input.packet.packetKind === "monday" ? "Monday Search and Market Intelligence Packet" : "Search and Market Intelligence Material Delta", objective: "Prepare source-qualified internal search decisions through independent QA without provider writes or external execution.", sourceLabel: "search_market_intelligence_runtime", sourceReference: `search-market:${input.packet.packetKind}:${input.packet.evidenceCutoff}`, leadProfessionalId: "marketing-intelligence-director", independentReviewerId: "marketing-quality-reviewer", department: "Search and Market Intelligence", businessModule: "ai-core", evidenceSnapshot: json({ packet: input.packet, requestIdempotencyDigest: digest(input.requestIdempotencyKey), immutableAtCaseCreation: true }), limitations: json({ items: input.packet.dataGaps }) });
  const lead = await prisma.professionalAssignment.findFirst({ where: { tenantId: input.actor.tenantId, caseId: record.id, assignmentRole: "lead" } });
  if (!lead) throw new Error("search_market_lead_assignment_missing");
  await claimProfessionalAssignment({ actor: input.actor, assignmentId: lead.id, idempotencyKey: `${caseKey}:claim` });
  for (const deliverable of input.packet.deliverables) {
    await appendProfessionalContribution({ actor: input.actor, caseId: record.id, idempotencyKey: `${caseKey}:${digest(deliverable.deliverableId)}`, professionalId: deliverable.responsibleProfessionalId, department: "Search and Market Intelligence", contributionType: deliverable.deliverableId, sourceLabel: "search_market_packet_assembly", sourceReferences: deliverable.sourceReferences, content: json(deliverable), limitations: json({ items: deliverable.missingData }), dataGap: deliverable.sourceReferences.length === 0 });
  }
  await requestProfessionalCaseQa({ actor: input.actor, caseId: record.id, idempotencyKey: `${caseKey}:qa` });
  return record;
}

export async function prepareSearchMarketIntelligence(input: { actor: Actor; packetKind: PacketKind; requestIdempotencyKey: string; now?: Date }) {
  const now = input.now ?? new Date();
  const snapshots = await getLatestTenantBusinessSnapshots(input.actor.tenantId, 200);
  const contracted = snapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
  const cohorts = evidenceCohorts(contracted);
  assertTenantSearchMarketEvidence(input.actor.tenantId, cohorts.current);
  const materiality = evaluateSearchMarketMateriality(cohorts.current, cohorts.previous);
  if (input.packetKind === "delta" && !materiality.material) return { created: false as const, reason: "no_material_change" as const, materiality, providerCalled: false as const, externalWritesAllowed: false as const, liveExecutionAllowed: false as const };
  const activeCases = await listProfessionalCases(input.actor.tenantId, 100);
  if (activeCases.filter((record) => record.status !== "closed").length >= scheduledProfessionalCaseProductionCap) throw new Error("scheduled_professional_case_cap_reached");
  const deterministicPacketTime = input.packetKind === "monday"
    ? new Date(`${mondayStart(now)}T12:00:00.000Z`)
    : new Date(Math.max(...cohorts.current.map((snapshot) => new Date(snapshot.snapshotDate).getTime())));
  const packet = createSearchMarketIntelligencePacket({ tenantId: input.actor.tenantId, packetKind: input.packetKind, snapshots: cohorts.current, now: deterministicPacketTime });
  const professionalCase = await persistPacketCase({ actor: input.actor, packet, requestIdempotencyKey: input.requestIdempotencyKey });
  return { created: true as const, caseId: professionalCase.id, status: "qa_required" as const, packet, materiality, providerCalled: false as const, externalWritesAllowed: false as const, liveExecutionAllowed: false as const };
}

export async function readSearchMarketIntelligence(tenantId: string) {
  const cases = (await listProfessionalCases(tenantId, 100)).filter((record) => record.caseType === "search_market_delta" || record.caseType === "search_market_monday_packet");
  const latestMonday = cases.find((record) => record.caseType === "search_market_monday_packet") ?? null;
  return { schemaVersion: "search-market-intelligence-read-v1" as const, tenantId, cases, latestMonday, summary: { active: cases.filter((record) => record.status !== "closed").length, qaRequired: cases.filter((record) => record.status === "qa_required").length, executiveReview: cases.filter((record) => record.status === "executive_review").length }, promotionState: "calibration_ready" as const, providerCalled: false as const, externalWritesAllowed: false as const, liveExecutionAllowed: false as const };
}
