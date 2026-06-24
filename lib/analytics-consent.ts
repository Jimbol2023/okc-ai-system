export const CONSENT_STORAGE_KEY = "jcapital_cookie_consent_v1";
export const CONSENT_CHANGE_EVENT = "jcapital-cookie-consent-change";

export type ConsentChoice = "accepted" | "declined";

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getAnalyticsMeasurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
}

export function isProductionAnalyticsEnabled() {
  return process.env.NODE_ENV === "production" && Boolean(getAnalyticsMeasurementId());
}

export function getStoredConsentChoice(): ConsentChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return savedChoice === "accepted" || savedChoice === "declined" ? savedChoice : null;
}

export function subscribeToConsentChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

export function saveConsentChoice(nextChoice: ConsentChoice) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, nextChoice);
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function hasAnalyticsConsent() {
  return isProductionAnalyticsEnabled() && getStoredConsentChoice() === "accepted";
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) {
    return false;
  }

  const cleanParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, cleanParams);
    return true;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...cleanParams });
  return true;
}

export function trackPageView(pagePath: string, pageLocation?: string) {
  return trackAnalyticsEvent("page_view", {
    page_path: pagePath,
    page_location: pageLocation
  });
}

export function trackGenerateLead(params: AnalyticsEventParams = {}) {
  return trackAnalyticsEvent("generate_lead", params);
}

export function trackContactFormSubmit(params: AnalyticsEventParams = {}) {
  return trackAnalyticsEvent("contact_form_submit", params);
}

export function trackPhoneClick(params: AnalyticsEventParams = {}) {
  return trackAnalyticsEvent("phone_click", params);
}

export function trackEmailClick(params: AnalyticsEventParams = {}) {
  return trackAnalyticsEvent("email_click", params);
}

export function trackVideoPlay(params: AnalyticsEventParams = {}) {
  return trackAnalyticsEvent("video_play", params);
}
