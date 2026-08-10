export type RequestSecurityResult<T = unknown> =
  | { ok: true; value: T }
  | { ok: false; status: 400 | 413 | 415; reason: "invalid_body" | "payload_too_large" | "unsupported_content_type" };

export async function readBoundedJsonBody(request: Request, maximumBytes: number): Promise<RequestSecurityResult> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { ok: false, status: 415, reason: "unsupported_content_type" };
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    return { ok: false, status: 413, reason: "payload_too_large" };
  }
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maximumBytes) {
    return { ok: false, status: 413, reason: "payload_too_large" };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400, reason: "invalid_body" };
  }
}

export function isSameOriginBrowserRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (fetchSite === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || request.headers.get("host")?.trim() || requestUrl.host;
    if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host)) return false;
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
    const protocol = forwardedProto === "http" || forwardedProto === "https"
      ? `${forwardedProto}:`
      : requestUrl.protocol;

    return new URL(origin).origin === `${protocol}//${host.toLowerCase()}`;
  } catch {
    return false;
  }
}

export function getRequestIp(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}
