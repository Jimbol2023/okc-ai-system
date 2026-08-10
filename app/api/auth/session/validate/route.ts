import { verifySessionToken } from "@/lib/auth";
import { getRequestAuthToken } from "@/lib/auth-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return new Response(null, { status: await verifySessionToken(getRequestAuthToken(request)) ? 204 : 401 });
}
