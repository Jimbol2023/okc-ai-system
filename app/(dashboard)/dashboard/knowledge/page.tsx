import { KnowledgeHubClient } from "@/components/dashboard/knowledge-hub-client";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Knowledge Hub</p>
        <h1 className="break-words text-3xl font-semibold text-primary">Institutional knowledge base</h1>
        <p className="max-w-3xl break-words text-sm leading-6 text-muted">
          Store SOPs, sales scripts, marketing templates, AI prompts, Oklahoma-specific guidance, and lessons learned. Do not treat this as legal, tax, valuation, or title advice.
        </p>
      </div>
      <KnowledgeHubClient />
    </div>
  );
}
