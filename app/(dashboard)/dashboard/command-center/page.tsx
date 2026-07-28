import { AiWorkforceCommandCenter } from "@/components/dashboard/ai-workforce-command-center";
import { createAiWorkforceCommandCenter } from "@/lib/ai-collaboration-engine";

export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const report = await createAiWorkforceCommandCenter();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <AiWorkforceCommandCenter report={report} />
    </main>
  );
}
