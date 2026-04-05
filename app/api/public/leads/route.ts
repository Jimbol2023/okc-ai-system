import { NextResponse } from "next/server";

import { createDbLeadFromIntake, parseLeadIntakePayload } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = parseLeadIntakePayload(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: result.error.flatten()
        },
        { status: 400 }
      );
    }

    const lead = await createDbLeadFromIntake(result.data);

    return NextResponse.json(
      {
        ok: true,
        lead: lead.lead,
        leadId: lead.lead.id,
        created: lead.created
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to submit the lead right now."
      },
      { status: 500 }
    );
  }
}
