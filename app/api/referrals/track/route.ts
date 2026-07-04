import { NextResponse } from "next/server";

import { trackReferralEvent } from "@/lib/referrals";
import { referralTrackSchema } from "@/lib/validations/referrals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const parsed = referralTrackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const result = await trackReferralEvent({
    ...parsed.data,
    eventType: "click",
  });

  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    referralLinkFound: result.referralLinkFound,
    providerCalled: result.providerCalled,
    outreachSent: result.outreachSent,
    published: result.published,
    liveExecutionAllowed: result.liveExecutionAllowed,
  });
}
