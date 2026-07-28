import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  decideCeoDraft,
  draftWorkspaceSafetyFlags,
  getCeoDraftWorkspaceReport,
  previewCeoDraft,
  setCompanyDraftWorkspaceDbForTest,
  updateCeoDraft,
  type DraftWorkspaceDb,
} from "./company-draft-workspace";

type MockDraft = {
  id: string;
  tenantId: string;
  directiveId: string;
  output: string;
  ownerDepartment: string;
  title: string;
  body: string;
  messaging: string;
  cta: string;
  metadata: unknown;
  priority: string;
  businessGoal: string;
  executiveSummary: string;
  knowledgeTrace: unknown;
  assumptions: unknown;
  confidence: number;
  approvalStatus: string;
  revisionCount: number;
  status: string;
  sourceLabel: string;
  approvalRequired: boolean;
  providerCalled: boolean;
  sent: boolean;
  published: boolean;
  liveExecutionAllowed: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: string | null;
  lastModifiedAt: Date | null;
  directive: {
    id: string;
    title: string;
    businessGoal: string;
  };
  revisions: MockRevision[];
};

type MockRevision = {
  id: string;
  tenantId: string;
  draftQueueItemId: string;
  directiveId: string;
  action: string;
  note: string | null;
  reviewer: string | null;
  previousSnapshot: unknown;
  nextSnapshot: unknown;
  safetyFlags: typeof draftWorkspaceSafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  workflowStarted: false;
  liveExecutionAllowed: false;
  createdAt: Date;
};

let restoreDb: (() => void) | undefined;
let drafts: MockDraft[];
let revisions: MockRevision[];

function cloneDraft(draft: MockDraft) {
  return {
    ...draft,
    directive: { ...draft.directive },
    revisions: revisions
      .filter((revision) => revision.draftQueueItemId === draft.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((revision) => ({ ...revision })),
  };
}

function createMockDb() {
  const mockDb = {
    aiCompanyDraftQueueItem: {
      async findMany() {
        return drafts.map(cloneDraft);
      },
      async findUnique(args: { where: { id: string } }) {
        const draft = drafts.find((item) => item.id === args.where.id);

        return draft ? cloneDraft(draft) : null;
      },
      async update(args: { where: { id: string }; data: Partial<MockDraft> }) {
        const index = drafts.findIndex((item) => item.id === args.where.id);
        if (index < 0) throw new Error("Draft not found.");
        drafts[index] = {
          ...drafts[index],
          ...args.data,
          updatedAt: new Date("2026-07-06T12:00:00.000Z"),
        };

        return cloneDraft(drafts[index]);
      },
    },
    aiCompanyDraftRevision: {
      async create(args: { data: Omit<MockRevision, "id" | "createdAt"> }) {
        const revision = {
          ...args.data,
          id: `revision-${revisions.length + 1}`,
          createdAt: new Date("2026-07-06T12:30:00.000Z"),
        };
        revisions.push(revision);

        return revision;
      },
    },
    async $transaction<TResult>(fn: (tx: unknown) => Promise<TResult>) {
      return fn(mockDb);
    },
  };

  return mockDb as unknown as DraftWorkspaceDb;
}

function createDraft(overrides: Partial<MockDraft>): MockDraft {
  const id = overrides.id ?? "draft-1";

  return {
    id,
    tenantId: "default",
    directiveId: "campaign-001",
    output: "Facebook Post",
    ownerDepartment: "Marketing",
    title: "Facebook Post",
    body: "Internal prepared draft body.",
    messaging: "Review seller-safe messaging.",
    cta: "CEO review required before external action.",
    metadata: {
      sourceLabel: "executive_directive:campaign-001",
      directiveId: "campaign-001",
      output: "Facebook Post",
      workItemType: "marketing_draft",
    },
    priority: "normal",
    businessGoal: "Prepare inherited property campaign safely.",
    executiveSummary: "Draft is ready for CEO review and blocked from execution.",
    knowledgeTrace: [
      { type: "knowledge_pack", label: "Enterprise Knowledge Platform", confidence: 72 },
      { type: "source_registry_entry", label: "executive_directive:campaign-001", confidence: 72 },
    ],
    assumptions: ["Draft approval is internal review only."],
    confidence: 72,
    approvalStatus: "pending_ceo_review",
    revisionCount: 0,
    status: "draft_required",
    sourceLabel: "executive_directive:campaign-001",
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    createdAt: new Date("2026-07-06T10:00:00.000Z"),
    updatedAt: new Date("2026-07-06T10:00:00.000Z"),
    lastModifiedBy: null,
    lastModifiedAt: null,
    directive: {
      id: "campaign-001",
      title: "Campaign 001",
      businessGoal: "Prepare inherited property campaign safely.",
    },
    revisions: [],
    ...overrides,
  };
}

beforeEach(() => {
  revisions = [];
  drafts = [
    createDraft({ id: "draft-marketing", ownerDepartment: "Marketing", title: "Facebook Post", output: "Facebook Post" }),
    createDraft({ id: "draft-seo", ownerDepartment: "SEO", title: "Educational Article", output: "Educational Article" }),
  ];
  restoreDb = setCompanyDraftWorkspaceDbForTest(createMockDb());
});

afterEach(() => {
  restoreDb?.();
});

describe("CEO Draft Workspace", () => {
  it("groups drafts by department with traceability and version metadata", async () => {
    const report = await getCeoDraftWorkspaceReport();

    assert.equal(report.title, "CEO Draft Workspace");
    assert.equal(report.totals.drafts, 2);
    assert.deepEqual(report.groups.map((group) => group.department), ["Marketing", "SEO"]);
    assert.equal(report.safetyFlags.providerCalled, false);
    assert.equal(report.safetyFlags.liveExecutionAllowed, false);
    assert.equal(report.safetyFlags.externalExecutionAllowed, false);

    const marketing = report.groups[0].drafts[0];
    assert.equal(marketing.approvalRequired, true);
    assert.deepEqual(marketing.knowledgePacks, ["Enterprise Knowledge Platform"]);
    assert.deepEqual(marketing.sourceRegistryEntries, ["executive_directive:campaign-001"]);
    assert.equal(marketing.revisionCount, 0);
    assert.equal(marketing.safetyFlags.providerCalled, false);
  });

  it("previews a draft without creating a revision", async () => {
    const preview = await previewCeoDraft("draft-marketing");

    assert.equal(preview.ok, true);
    assert.equal(preview.previewMode, "internal_only");
    assert.equal(preview.draft.title, "Facebook Post");
    assert.equal(revisions.length, 0);
    assert.equal(preview.safetyFlags.providerCalled, false);
  });

  it("edits a draft, creates version history, and preserves execution blocking flags", async () => {
    const result = await updateCeoDraft(
      "draft-marketing",
      {
        title: "Edited Facebook Post",
        body: "Edited internal-only body.",
        messaging: "Edited messaging.",
        cta: "Review internally.",
        metadata: "CEO metadata note.",
        note: "CEO edited draft.",
      },
      "ceo@example.com",
    );

    assert.equal(result.draft.title, "Edited Facebook Post");
    assert.equal(result.draft.approvalStatus, "pending_ceo_review");
    assert.equal(result.draft.revisionCount, 1);
    assert.equal(result.draft.safetyFlags.providerCalled, false);
    assert.equal(result.draft.safetyFlags.liveExecutionAllowed, false);
    assert.equal(result.draft.safetyFlags.externalExecutionAllowed, false);
    assert.equal(revisions.length, 1);
    assert.equal(revisions[0].action, "edited");
    assert.equal(revisions[0].providerCalled, false);
    assert.equal(revisions[0].published, false);
    assert.equal(revisions[0].sent, false);
    assert.equal(revisions[0].workflowStarted, false);
    assert.equal(revisions[0].liveExecutionAllowed, false);
  });

  it("records approve, reject, and request changes as internal decisions only", async () => {
    const approved = await decideCeoDraft("draft-marketing", { decision: "approve" }, "ceo@example.com");
    const rejected = await decideCeoDraft("draft-seo", { decision: "reject", note: "Not aligned." }, "ceo@example.com");
    const changes = await decideCeoDraft("draft-marketing", { decision: "request_changes", note: "Tighten claims." }, "ceo@example.com");

    assert.equal(approved.draft.approvalStatus, "approved_internal");
    assert.equal(rejected.draft.approvalStatus, "rejected_internal");
    assert.equal(changes.draft.approvalStatus, "changes_requested");
    assert.deepEqual(revisions.map((revision) => revision.action), ["approved", "rejected", "changes_requested"]);
    assert.ok(revisions.every((revision) => revision.providerCalled === false));
    assert.ok(revisions.every((revision) => revision.liveExecutionAllowed === false));
  });

  it("requires notes for rejection and requested changes", async () => {
    await assert.rejects(() => decideCeoDraft("draft-marketing", { decision: "reject" }, "ceo@example.com"), /note is required/i);
    await assert.rejects(() => decideCeoDraft("draft-marketing", { decision: "request_changes", note: " " }, "ceo@example.com"), /note is required/i);
  });
});
