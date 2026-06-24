"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useSyncExternalStore } from "react";

import {
  getAnalyticsMeasurementId,
  getStoredConsentChoice,
  isProductionAnalyticsEnabled,
  subscribeToConsentChanges,
  trackPageView
} from "@/lib/analytics-consent";

const measurementId = getAnalyticsMeasurementId();

export function ConsentGatedAnalytics() {
  const consentChoice = useSyncExternalStore(subscribeToConsentChanges, getStoredConsentChoice, () => null);
  const shouldLoadAnalytics = isProductionAnalyticsEnabled() && consentChoice === "accepted";

  if (!shouldLoadAnalytics || !measurementId) {
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
            send_page_view: false
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageViews />
      </Suspense>
    </>
  );
}

function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    trackPageView(pagePath, window.location.href);
  }, [pathname, queryString]);

  return null;
}
