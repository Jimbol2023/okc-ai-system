import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createReferralLink, listReferralLinks, referralSafetyFlags } from "@/lib/referrals";
import { referralLinkSchema } from "@/lib/validations/referrals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const links = await listReferralLinks();

  return NextResponse.json({
    ok: true,
    links,
    ...referralSafetyFlags,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json();
  const parsed = referralLinkSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const link = await createReferralLink(parsed.data);

  return NextResponse.json({
    ok: true,
    link,
    ...referralSafetyFlags,
  });
}
