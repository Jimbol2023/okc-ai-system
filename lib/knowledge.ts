import { prisma } from "@/lib/prisma";
import type { CreateKnowledgeItemInput } from "@/lib/validations/knowledge";

export type KnowledgeItemRecord = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: unknown;
  status: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
};

export type KnowledgeDocReference = {
  title: string;
  category: string;
  path: string;
  summary: string;
};

type KnowledgeItemDelegate = {
  findMany(args?: unknown): Promise<KnowledgeItemRecord[]>;
  create(args: unknown): Promise<KnowledgeItemRecord>;
};

function getKnowledgeItemDelegate() {
  return (prisma as unknown as { knowledgeItem: KnowledgeItemDelegate }).knowledgeItem;
}

export const knowledgeDocReferences: KnowledgeDocReference[] = [
  {
    title: "Google Business Profile Readiness",
    category: "marketing_template",
    path: "docs/seo-market-launch/GOOGLE-BUSINESS-PROFILE-READINESS.md",
    summary: "Manual local visibility checklist for business profile readiness.",
  },
  {
    title: "Oklahoma Content Foundation",
    category: "oklahoma_guidance",
    path: "docs/seo-market-launch/OKLAHOMA-CONTENT-FOUNDATION.md",
    summary: "Oklahoma-specific public content foundation for property-owner education.",
  },
  {
    title: "Social Foundation Prep",
    category: "marketing_template",
    path: "docs/seo-market-launch/SOCIAL-FOUNDATION-PREP.md",
    summary: "Manual social setup guidance and publishing preparation.",
  },
  {
    title: "Provider Readiness Setup Report",
    category: "sop",
    path: "docs/provider-readiness-setup-report.md",
    summary: "Credential readiness and provider activation boundary documentation.",
  },
  {
    title: "Inherited Property Video Strategy",
    category: "marketing_template",
    path: "docs/video-production/inherited-property-video-strategy.md",
    summary: "Educational video planning notes for inherited property content.",
  },
];

export async function listKnowledgeItems() {
  return getKnowledgeItemDelegate().findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function createKnowledgeItem(input: CreateKnowledgeItemInput) {
  return getKnowledgeItemDelegate().create({
    data: {
      title: input.title,
      category: input.category,
      content: input.content,
      tags: input.tags ?? [],
      status: input.status,
      source: input.source,
    },
  });
}
