import { saveControlledFacebookDraftTest } from "@/lib/controlled-facebook-draft-test";
import { prisma } from "@/lib/prisma";

async function main() {
  const result = await saveControlledFacebookDraftTest();

  console.log(
    JSON.stringify(
      {
        ok: true,
        action: result.action,
        draftId: result.draft.id,
        channel: result.draft.channel,
        topic: result.draft.topic,
        sourceLabel: result.draft.sourceLabel,
        status: result.draft.status,
        providerCalled: result.providerCalled,
        published: result.published,
        scheduled: result.scheduled,
        approvalRequired: result.approvalRequired,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unable to create controlled Facebook draft test.",
        providerCalled: false,
        published: false,
        scheduled: false,
        approvalRequired: true,
      }),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
