import { prisma } from "@/lib/prisma";
import type { AiDepartmentName } from "@/lib/company-orchestrator";
import { createDepartmentArtifact, type DepartmentArtifactType } from "@/lib/department-artifact-engine";
import { getLatestBusinessSnapshots, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";
import type { CompanyDraftDecisionInput, CompanyDraftEditInput } from "@/lib/validations/company-drafts";

const tenantId = "default";

export const draftWorkspaceSafetyFlags = {
  providerCalled: false,
  liveExecutionAllowed: false,
  published: false,
  sent: false,
  workflowStarted: false,
  externalExecutionAllowed: false,
  scrapingBlocked: true,
  outreachBlocked: true,
  adsBlocked: true,
  emailBlocked: true,
  smsBlocked: true,
  crmMutationBlocked: true,
  oauthWritesBlocked: true,
} as const;

export type DraftWorkspaceAction = "created" | "edited" | "approved" | "rejected" | "changes_requested" | "previewed";

export type DraftWorkspaceMetadata = {
  sourceLabel: string;
  directiveId: string;
  output: string;
  workItemType: string;
  department?: string;
  artifactType?: DepartmentArtifactType | string;
  sourceConnectors?: string[];
  sourceRecords?: string[];
  sourceSummaries?: string[];
  dataGaps?: string[];
  approvalRequired?: true;
  providerCalled?: false;
  liveExecutionAllowed?: false;
  rawMetadataNote?: string;
};

export type DraftKnowledgeTraceEntry = {
  type: "knowledge_pack" | "source_registry_entry" | "internal_standard";
  label: string;
  confidence: number;
};

export type DraftWorkspaceItem = {
  id: string;
  directiveId: string;
  title: string;
  body: string;
  messaging: string;
  cta: string;
  metadata: DraftWorkspaceMetadata;
  department: AiDepartmentName;
  output: string;
  status: string;
  priority: string;
  businessGoal: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string | null;
  lastModifiedAt: string | null;
  revisionCount: number;
  approvalStatus: string;
  approvalRequired: true;
  knowledgePacks: string[];
  sourceRegistryEntries: string[];
  confidence: number;
  assumptions: string[];
  executiveSummary: string;
  safetyFlags: typeof draftWorkspaceSafetyFlags;
  revisions: DraftWorkspaceRevision[];
};

export type DraftWorkspaceRevision = {
  id: string;
  action: DraftWorkspaceAction | string;
  note: string | null;
  reviewer: string | null;
  createdAt: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DraftWorkspaceDepartmentGroup = {
  department: AiDepartmentName;
  readyCount: number;
  pendingCount: number;
  drafts: DraftWorkspaceItem[];
};

export type CeoDraftWorkspaceReport = {
  ok: true;
  title: "CEO Draft Workspace";
  summary: string;
  totals: {
    departments: number;
    drafts: number;
    approved: number;
    rejected: number;
    changesRequested: number;
    pendingReview: number;
  };
  groups: DraftWorkspaceDepartmentGroup[];
  safetyFlags: typeof draftWorkspaceSafetyFlags;
};

type DirectiveRecord = {
  id?: string;
  title?: string | null;
  summary?: string | null;
  objective?: string | null;
  businessGoal?: string | null;
  expectedBusinessValue?: string | null;
};

type DraftRecord = {
  id: string;
  directiveId?: string | null;
  output?: string | null;
  ownerDepartment?: string | null;
  title?: string | null;
  body?: string | null;
  messaging?: string | null;
  cta?: string | null;
  metadata?: unknown;
  priority?: string | null;
  businessGoal?: string | null;
  executiveSummary?: string | null;
  knowledgeTrace?: unknown;
  assumptions?: unknown;
  confidence?: number | null;
  approvalStatus?: string | null;
  revisionCount?: number | null;
  status?: string | null;
  sourceLabel?: string | null;
  approvalRequired?: boolean | null;
  providerCalled?: boolean | null;
  sent?: boolean | null;
  published?: boolean | null;
  liveExecutionAllowed?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  lastModifiedBy?: string | null;
  lastModifiedAt?: Date | string | null;
  directive?: DirectiveRecord | null;
  revisions?: RevisionRecord[];
};

type RevisionRecord = {
  id: string;
  action?: string | null;
  note?: string | null;
  reviewer?: string | null;
  providerCalled?: boolean | null;
  liveExecutionAllowed?: boolean | null;
  createdAt?: Date | string | null;
};

export type DraftWorkspaceDb = typeof prisma & {
  aiCompanyDraftQueueItem: {
    findMany(args?: unknown): Promise<DraftRecord[]>;
    findUnique(args: unknown): Promise<DraftRecord | null>;
    update(args: unknown): Promise<DraftRecord>;
  };
  aiCompanyDraftRevision: {
    create(args: unknown): Promise<RevisionRecord>;
  };
  $transaction<TResult>(fn: (tx: DraftWorkspaceDb) => Promise<TResult>, options?: { maxWait?: number; timeout?: number }): Promise<TResult>;
};

let db = prisma as unknown as DraftWorkspaceDb;
const transactionOptions = { maxWait: 10_000, timeout: 30_000 } as const;

export function setCompanyDraftWorkspaceDbForTest(testDb: DraftWorkspaceDb) {
  db = testDb;

  return () => {
    db = prisma as unknown as DraftWorkspaceDb;
  };
}

function iso(value?: Date | string | null) {
  if (!value) return new Date(0).toISOString();
  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function asStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : fallback;
}

function asKnowledgeTrace(value: unknown, fallback: DraftKnowledgeTraceEntry[]) {
  if (!Array.isArray(value)) return fallback;

  return value
    .map((item) => item as Partial<DraftKnowledgeTraceEntry>)
    .filter((item): item is DraftKnowledgeTraceEntry => Boolean(item.label) && Boolean(item.type) && typeof item.confidence === "number");
}

function classifyWorkItemType(output: string) {
  const normalized = output.toLowerCase();
  if (normalized.includes("facebook") || normalized.includes("social")) return "marketing_draft";
  if (normalized.includes("seo") || normalized.includes("article")) return "seo_content";
  if (normalized.includes("video")) return "video_script";
  if (normalized.includes("brand") || normalized.includes("messaging")) return "brand_review";
  if (normalized.includes("lead")) return "lead_intelligence_report";
  if (normalized.includes("document")) return "document_package";

  return "department_work_item";
}

export function createInitialDraftWorkspaceFields({
  output,
  ownerDepartment,
  directive,
  sourceLabel,
}: {
  output: string;
  ownerDepartment: string;
  directive?: DirectiveRecord | null;
  sourceLabel: string;
}) {
  const directiveTitle = directive?.title || "approved Executive Directive";
  const businessGoal = directive?.businessGoal || "improve_executive_decisions";
  const confidence = 72;
  const artifact = createDepartmentArtifact({
    output,
    ownerDepartment,
    directiveTitle,
    businessGoal,
    expectedBusinessValue: directive?.expectedBusinessValue,
    sourceLabel,
  });
  const metadata: DraftWorkspaceMetadata = {
    sourceLabel,
    directiveId: directive?.id || "",
    output,
    workItemType: classifyWorkItemType(output),
    department: ownerDepartment,
    artifactType: artifact.artifactType,
    sourceConnectors: artifact.sourceConnectors,
    sourceRecords: artifact.sourceRecords,
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  const knowledgeTrace: DraftKnowledgeTraceEntry[] = [
    { type: "knowledge_pack", label: "Enterprise Knowledge Platform", confidence },
    { type: "source_registry_entry", label: sourceLabel, confidence },
    { type: "internal_standard", label: "AI Business Constitution v1", confidence },
  ];
  const assumptions = [
    ...artifact.assumptions,
  ];

  return {
    title: artifact.title,
    body: artifact.body,
    messaging: artifact.messaging || directive?.objective || directive?.summary || directive?.expectedBusinessValue || "Internal CEO review is required before this work can move forward.",
    cta: artifact.cta,
    metadata,
    priority: "normal",
    businessGoal,
    executiveSummary: artifact.executiveSummary,
    knowledgeTrace,
    assumptions,
    confidence: artifact.confidence,
    approvalStatus: "pending_ceo_review",
    revisionCount: 0,
  };
}

function getFallbackFields(record: DraftRecord) {
  const output = record.output || "Internal draft item";
  const sourceLabel = record.sourceLabel || `executive_directive:${record.directiveId || "unknown"}`;

  return createInitialDraftWorkspaceFields({
    output,
    ownerDepartment: record.ownerDepartment || "Executive AI",
    directive: record.directive,
    sourceLabel,
  });
}

function normalizeMetadata(value: unknown, fallback: DraftWorkspaceMetadata): DraftWorkspaceMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const candidate = value as Partial<DraftWorkspaceMetadata>;

  return {
    sourceLabel: typeof candidate.sourceLabel === "string" && candidate.sourceLabel ? candidate.sourceLabel : fallback.sourceLabel,
    directiveId: typeof candidate.directiveId === "string" ? candidate.directiveId : fallback.directiveId,
    output: typeof candidate.output === "string" && candidate.output ? candidate.output : fallback.output,
    workItemType: typeof candidate.workItemType === "string" && candidate.workItemType ? candidate.workItemType : fallback.workItemType,
    department: typeof candidate.department === "string" && candidate.department ? candidate.department : fallback.department,
    artifactType: typeof candidate.artifactType === "string" && candidate.artifactType ? candidate.artifactType : fallback.artifactType,
    sourceConnectors: asStringArray(candidate.sourceConnectors, fallback.sourceConnectors ?? []),
    sourceRecords: asStringArray(candidate.sourceRecords, fallback.sourceRecords ?? []),
    sourceSummaries: asStringArray(candidate.sourceSummaries, fallback.sourceSummaries ?? []),
    dataGaps: asStringArray(candidate.dataGaps, fallback.dataGaps ?? []),
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    rawMetadataNote: typeof candidate.rawMetadataNote === "string" && candidate.rawMetadataNote ? candidate.rawMetadataNote : fallback.rawMetadataNote,
  };
}

function snapshot(record: DraftRecord) {
  const item = toDraftWorkspaceItem(record);

  return {
    title: item.title,
    body: item.body,
    messaging: item.messaging,
    cta: item.cta,
    metadata: item.metadata,
    status: item.status,
    approvalStatus: item.approvalStatus,
    revisionCount: item.revisionCount,
    safetyFlags: item.safetyFlags,
  };
}

function contextForDraft(record: DraftRecord, snapshots: BusinessDataSnapshotRecord[] = []) {
  const fallback = getFallbackFields(record);
  const metadata = normalizeMetadata(record.metadata, fallback.metadata);
  const sourceConnectors = metadata.sourceConnectors ?? [];
  const related = snapshots.filter((snapshot) => sourceConnectors.includes(snapshot.connectorId)).slice(0, 6);

  return {
    sourceSummaries: related.map((snapshot) => `${snapshot.provider} ${snapshot.category}: ${snapshot.summary}`),
    sourceRecords: related.flatMap((snapshot) => [
      `${snapshot.connectorId}:${snapshot.category}:${snapshot.status}`,
      ...snapshot.records.slice(0, 2).map((item) => JSON.stringify(item).slice(0, 240)),
    ]),
    dataGaps: related.flatMap((snapshot) => snapshot.dataGaps.map((gap) => `${snapshot.provider} ${snapshot.category}: ${gap}`)),
  };
}

function toDraftWorkspaceItem(record: DraftRecord, snapshots: BusinessDataSnapshotRecord[] = []): DraftWorkspaceItem {
  const fallback = getFallbackFields(record);
  const knowledgeTrace = asKnowledgeTrace(record.knowledgeTrace, fallback.knowledgeTrace);
  const sourceRegistryEntries = knowledgeTrace.filter((entry) => entry.type === "source_registry_entry").map((entry) => entry.label);
  const knowledgePacks = knowledgeTrace.filter((entry) => entry.type === "knowledge_pack").map((entry) => entry.label);
  const baseMetadata = normalizeMetadata(record.metadata, fallback.metadata);
  const snapshotContext = contextForDraft(record, snapshots);
  const metadata: DraftWorkspaceMetadata = {
    ...baseMetadata,
    sourceRecords: [...new Set([...(baseMetadata.sourceRecords ?? []), ...snapshotContext.sourceRecords])].slice(0, 12),
    sourceSummaries: [...new Set([...(baseMetadata.sourceSummaries ?? []), ...snapshotContext.sourceSummaries])].slice(0, 8),
    dataGaps: [...new Set([...(baseMetadata.dataGaps ?? []), ...snapshotContext.dataGaps])].slice(0, 8),
  };

  return {
    id: record.id,
    directiveId: record.directiveId || fallback.metadata.directiveId,
    title: record.title?.trim() || fallback.title,
    body: record.body?.trim() || fallback.body,
    messaging: record.messaging?.trim() || fallback.messaging,
    cta: record.cta?.trim() || fallback.cta,
    metadata,
    department: (record.ownerDepartment || "Executive AI") as AiDepartmentName,
    output: record.output || fallback.metadata.output,
    status: record.status || "draft_required",
    priority: record.priority || fallback.priority,
    businessGoal: record.businessGoal || fallback.businessGoal,
    createdAt: iso(record.createdAt),
    updatedAt: iso(record.updatedAt),
    lastModifiedBy: record.lastModifiedBy || null,
    lastModifiedAt: record.lastModifiedAt ? iso(record.lastModifiedAt) : null,
    revisionCount: record.revisionCount ?? fallback.revisionCount,
    approvalStatus: record.approvalStatus || fallback.approvalStatus,
    approvalRequired: true,
    knowledgePacks,
    sourceRegistryEntries,
    confidence: record.confidence ?? fallback.confidence,
    assumptions: [
      ...asStringArray(record.assumptions, fallback.assumptions),
      ...(metadata.sourceSummaries?.map((summary) => `Live/internal source summary: ${summary}`) ?? []),
      ...(metadata.dataGaps?.map((gap) => `Data gap: ${gap}`) ?? []),
    ].slice(0, 12),
    executiveSummary: record.executiveSummary?.trim() || fallback.executiveSummary,
    safetyFlags: draftWorkspaceSafetyFlags,
    revisions: (record.revisions ?? []).map((revision) => ({
      id: revision.id,
      action: revision.action || "edited",
      note: revision.note || null,
      reviewer: revision.reviewer || null,
      createdAt: iso(revision.createdAt),
      providerCalled: false,
      liveExecutionAllowed: false,
    })),
  };
}

function groupDrafts(drafts: DraftWorkspaceItem[]): DraftWorkspaceDepartmentGroup[] {
  const groups = new Map<AiDepartmentName, DraftWorkspaceItem[]>();

  for (const draft of drafts) {
    groups.set(draft.department, [...(groups.get(draft.department) ?? []), draft]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([department, items]) => ({
      department,
      readyCount: items.filter((item) => item.approvalStatus === "approved_internal").length,
      pendingCount: items.filter((item) => item.approvalStatus === "pending_ceo_review").length,
      drafts: items.sort((a, b) => a.title.localeCompare(b.title)),
    }));
}

async function findDraftOrThrow(tx: DraftWorkspaceDb, draftId: string) {
  const draft = await tx.aiCompanyDraftQueueItem.findUnique({
    where: { id: draftId },
    include: {
      directive: true,
      revisions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!draft) throw new Error("Draft work item not found.");

  return draft;
}

async function createRevision(tx: DraftWorkspaceDb, record: DraftRecord, action: DraftWorkspaceAction, nextRecord: DraftRecord, note?: string, reviewer?: string) {
  await tx.aiCompanyDraftRevision.create({
    data: {
      tenantId,
      draftQueueItemId: record.id,
      directiveId: record.directiveId || "",
      action,
      note: note?.trim() || null,
      reviewer: reviewer || "CEO",
      previousSnapshot: snapshot(record),
      nextSnapshot: snapshot(nextRecord),
      safetyFlags: draftWorkspaceSafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      workflowStarted: false,
      liveExecutionAllowed: false,
    },
  });
}

export async function getCeoDraftWorkspaceReport(): Promise<CeoDraftWorkspaceReport> {
  const [records, snapshots] = await Promise.all([
    db.aiCompanyDraftQueueItem.findMany({
      where: { tenantId },
      include: {
        directive: true,
        revisions: { orderBy: { createdAt: "desc" } },
      },
      orderBy: [{ ownerDepartment: "asc" }, { createdAt: "asc" }],
    }),
    getLatestBusinessSnapshots(40).catch(() => []),
  ]);
  const drafts = records.map((record) => toDraftWorkspaceItem(record, snapshots));
  const groups = groupDrafts(drafts);

  return {
    ok: true,
    title: "CEO Draft Workspace",
    summary:
      drafts.length === 0
        ? "No department drafts are visible yet. Approve an Executive Directive to let the AI COO populate the internal draft queue."
        : `${drafts.length} internal department drafts are visible for CEO review. Execution remains blocked.`,
    totals: {
      departments: groups.length,
      drafts: drafts.length,
      approved: drafts.filter((draft) => draft.approvalStatus === "approved_internal").length,
      rejected: drafts.filter((draft) => draft.approvalStatus === "rejected_internal").length,
      changesRequested: drafts.filter((draft) => draft.approvalStatus === "changes_requested").length,
      pendingReview: drafts.filter((draft) => draft.approvalStatus === "pending_ceo_review").length,
    },
    groups,
    safetyFlags: draftWorkspaceSafetyFlags,
  };
}

export async function previewCeoDraft(draftId: string) {
  const [record, snapshots] = await Promise.all([findDraftOrThrow(db, draftId), getLatestBusinessSnapshots(40).catch(() => [])]);

  return {
    ok: true,
    draft: toDraftWorkspaceItem(record, snapshots),
    previewMode: "internal_only" as const,
    safetyFlags: draftWorkspaceSafetyFlags,
  };
}

export async function updateCeoDraft(draftId: string, input: CompanyDraftEditInput, reviewer = "CEO") {
  return db.$transaction(async (tx) => {
    const record = await findDraftOrThrow(tx, draftId);
    const fallback = getFallbackFields(record);
    const metadata: DraftWorkspaceMetadata = {
      ...normalizeMetadata(record.metadata, fallback.metadata),
      rawMetadataNote: input.metadata || undefined,
    } as DraftWorkspaceMetadata;
    const nextRevisionCount = (record.revisionCount ?? 0) + 1;
    const updated = await tx.aiCompanyDraftQueueItem.update({
      where: { id: draftId },
      data: {
        title: input.title,
        body: input.body,
        messaging: input.messaging || "",
        cta: input.cta || "",
        metadata,
        status: "draft_edited_pending_ceo_review",
        approvalStatus: "pending_ceo_review",
        revisionCount: nextRevisionCount,
        lastModifiedBy: reviewer,
        lastModifiedAt: new Date(),
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      include: {
        directive: true,
        revisions: { orderBy: { createdAt: "desc" } },
      },
    });

    await createRevision(tx, record, "edited", updated, input.note || "CEO edited draft.", reviewer);

    return {
      ok: true,
      draft: toDraftWorkspaceItem(updated),
      safetyFlags: draftWorkspaceSafetyFlags,
    };
  }, transactionOptions);
}

export async function decideCeoDraft(draftId: string, input: CompanyDraftDecisionInput, reviewer = "CEO") {
  if ((input.decision === "reject" || input.decision === "request_changes") && !input.note?.trim()) {
    throw new Error("A note is required to reject a draft or request changes.");
  }

  return db.$transaction(async (tx) => {
    const record = await findDraftOrThrow(tx, draftId);
    const action = input.decision === "approve" ? "approved" : input.decision === "reject" ? "rejected" : "changes_requested";
    const approvalStatus = input.decision === "approve" ? "approved_internal" : input.decision === "reject" ? "rejected_internal" : "changes_requested";
    const status = input.decision === "approve" ? "draft_approved_internal" : input.decision === "reject" ? "draft_rejected_internal" : "draft_changes_requested";
    const nextRevisionCount = (record.revisionCount ?? 0) + 1;
    const updated = await tx.aiCompanyDraftQueueItem.update({
      where: { id: draftId },
      data: {
        status,
        approvalStatus,
        revisionCount: nextRevisionCount,
        lastModifiedBy: reviewer,
        lastModifiedAt: new Date(),
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      include: {
        directive: true,
        revisions: { orderBy: { createdAt: "desc" } },
      },
    });

    await createRevision(tx, record, action, updated, input.note || `${action.replaceAll("_", " ")} by CEO.`, reviewer);

    return {
      ok: true,
      draft: toDraftWorkspaceItem(updated),
      decision: input.decision,
      safetyFlags: draftWorkspaceSafetyFlags,
    };
  }, transactionOptions);
}
