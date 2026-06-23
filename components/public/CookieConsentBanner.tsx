"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const CONSENT_STORAGE_KEY = "jcapital_cookie_consent_v1";
const CONSENT_CHANGE_EVENT = "jcapital-cookie-consent-change";

type ConsentChoice = "accepted" | "declined";

function getStoredChoice(): ConsentChoice | null {
  if (typeof window === "undefined") {
    return "accepted";
  }

  const savedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return savedChoice === "accepted" || savedChoice === "declined" ? savedChoice : null;
}

function subscribeToConsentChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

export function CookieConsentBanner() {
  const choice = useSyncExternalStore(subscribeToConsentChanges, getStoredChoice, () => "accepted");

  function saveChoice(nextChoice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextChoice);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  }

  if (choice) {
    return null;
  }

  return (
    <section
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-18px_45px_rgba(2,33,61,0.14)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="font-heading text-sm font-bold text-[#02213D]">Cookie and privacy notice</p>
          <p className="mt-1 text-sm leading-6 text-[#4B5563]">
            This site uses essential browser storage for preferences and form experience. We do not load advertising or
            analytics cookies unless they are added with consent controls.
          </p>
          <Link href="/privacy" className="mt-2 inline-flex text-sm font-semibold text-[#02213D] underline underline-offset-4">
            Read Privacy Policy
          </Link>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => saveChoice("declined")}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#02213D]/20 bg-white px-5 py-2.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#F2F4F7]"
          >
            Decline Optional
          </button>
          <button
            type="button"
            onClick={() => saveChoice("accepted")}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#D4A017] px-5 py-2.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e0af2e]"
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
