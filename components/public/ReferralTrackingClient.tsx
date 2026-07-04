"use client";

import { useEffect } from "react";

function safeParam(value: string | null, pattern: RegExp) {
  const text = value?.trim() ?? "";

  return pattern.test(text) ? text : "";
}

export function ReferralTrackingClient() {
  useEffect(() => {
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const ref = safeParam(searchParams.get("ref"), /^[a-z0-9_-]{2,48}$/i);
    const campaign = safeParam(searchParams.get("campaign"), /^[a-z0-9_-]{2,80}$/i);
    const source = safeParam(searchParams.get("source"), /^[a-z0-9_-]{2,60}$/i);

    if (!ref) return;

    const duplicateKey = `click:${ref}:${pathname}:${campaign || "no_campaign"}:${source || "unknown_source"}`;

    if (window.sessionStorage.getItem(duplicateKey) === "tracked") return;

    window.sessionStorage.setItem(duplicateKey, "tracked");
    void fetch("/api/referrals/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref,
        campaign,
        source,
        landingPage: pathname,
        duplicateKey,
      }),
    }).catch(() => null);
  }, []);

  return null;
}
