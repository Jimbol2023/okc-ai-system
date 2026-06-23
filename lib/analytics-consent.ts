export const CONSENT_STORAGE_KEY = "jcapital_cookie_consent_v1";
export const CONSENT_CHANGE_EVENT = "jcapital-cookie-consent-change";

export type ConsentChoice = "accepted" | "declined";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getAnalyticsMeasurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
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
  return Boolean(getAnalyticsMeasurementId()) && getStoredConsentChoice() === "accepted";
}

export function trackAnalyticsEvent(eventName: string, params: Record<string, string | number | boolean | null> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) {
    return false;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return true;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...params });
  return true;
}
