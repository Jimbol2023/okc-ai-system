"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

import {
  getAnalyticsMeasurementId,
  getStoredConsentChoice,
  subscribeToConsentChanges,
  trackAnalyticsEvent
} from "@/lib/analytics-consent";

const measurementId = getAnalyticsMeasurementId();

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`;
}

function getSourceParam(url: string) {
  try {
    return new URL(url, window.location.origin).searchParams.get("source") ?? "";
  } catch {
    return "";
  }
}

export function ConsentGatedAnalytics() {
  const consentChoice = useSyncExternalStore(subscribeToConsentChanges, getStoredConsentChoice, () => null);
  const shouldLoadAnalytics = Boolean(measurementId) && consentChoice === "accepted";

  useEffect(() => {
    if (!shouldLoadAnalytics) {
      return;
    }

    if (window.location.pathname === "/thank-you") {
      trackAnalyticsEvent("thank_you_view", {
        page_path: getCurrentPath(),
        source: new URLSearchParams(window.location.search).get("source") ?? ""
      });
    }

    function handleClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      const source = getSourceParam(link.href);

      if (!source) {
        return;
      }

      trackAnalyticsEvent("cta_click", {
        page_path: getCurrentPath(),
        link_url: link.href,
        source
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [shouldLoadAnalytics]);

  if (!shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="jcapital-ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname + window.location.search
          });
        `}
      </Script>
    </>
  );
}
