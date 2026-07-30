"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Eye, Focus, Minus, RotateCcw, Type, Underline, X, ZapOff } from "lucide-react";

type TextScale = "default" | "decrease" | "increase";

type AccessibilityPreferences = {
  textScale: TextScale;
  highContrast: boolean;
  reducedMotion: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  enhancedFocus: boolean;
};

const STORAGE_KEY = "jcapital.accessibility.preferences.v1";

const defaultPreferences: AccessibilityPreferences = {
  textScale: "default",
  highContrast: false,
  reducedMotion: false,
  underlineLinks: false,
  readableFont: false,
  enhancedFocus: false,
};

function readPreferences(): AccessibilityPreferences {
  if (typeof window === "undefined") return defaultPreferences;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPreferences;
    const parsed = JSON.parse(stored) as Partial<AccessibilityPreferences>;

    return {
      textScale: parsed.textScale === "decrease" || parsed.textScale === "increase" ? parsed.textScale : "default",
      highContrast: parsed.highContrast === true,
      reducedMotion: parsed.reducedMotion === true,
      underlineLinks: parsed.underlineLinks === true,
      readableFont: parsed.readableFont === true,
      enhancedFocus: parsed.enhancedFocus === true,
    };
  } catch {
    return defaultPreferences;
  }
}

function hasActivePreferences(preferences: AccessibilityPreferences) {
  return (
    preferences.textScale !== "default" ||
    preferences.highContrast ||
    preferences.reducedMotion ||
    preferences.underlineLinks ||
    preferences.readableFont ||
    preferences.enhancedFocus
  );
}

function applyPreferences(preferences: AccessibilityPreferences) {
  const root = document.documentElement;

  if (preferences.textScale === "default") {
    delete root.dataset.jcapitalA11yText;
  } else {
    root.dataset.jcapitalA11yText = preferences.textScale;
  }

  root.dataset.jcapitalA11yContrast = preferences.highContrast ? "true" : "false";
  root.dataset.jcapitalA11yMotion = preferences.reducedMotion ? "reduce" : "default";
  root.dataset.jcapitalA11yLinks = preferences.underlineLinks ? "underline" : "default";
  root.dataset.jcapitalA11yFont = preferences.readableFont ? "readable" : "default";
  root.dataset.jcapitalA11yFocus = preferences.enhancedFocus ? "enhanced" : "default";
}

function persistPreferences(preferences: AccessibilityPreferences) {
  if (typeof window === "undefined") return;

  try {
    if (!hasActivePreferences(preferences)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Browser storage can be unavailable in private or locked-down contexts.
  }
}

export function AccessibilityToolbar() {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => readPreferences());
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const closePanel = useCallback(({ restoreFocus }: { restoreFocus: boolean }) => {
    setIsOpen(false);
    setIsConfirmingReset(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    applyPreferences(preferences);
    persistPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePanel({ restoreFocus: true });
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      closePanel({ restoreFocus: false });
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closePanel, isOpen]);

  function updatePreference(nextPreferences: AccessibilityPreferences) {
    setIsConfirmingReset(false);
    setPreferences(nextPreferences);
  }

  function setTextScale(textScale: TextScale) {
    updatePreference({ ...preferences, textScale });
  }

  function togglePreference(key: Exclude<keyof AccessibilityPreferences, "textScale">) {
    updatePreference({ ...preferences, [key]: !preferences[key] });
  }

  function confirmResetPreferences() {
    updatePreference(defaultPreferences);
    closePanel({ restoreFocus: true });
  }

  return (
    <aside className="accessibility-toolbar" aria-label="Accessibility preference toolbar">
      <button
        ref={triggerRef}
        type="button"
        className="accessibility-toolbar__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "Close accessibility preferences" : "Open accessibility preferences"}
        onClick={() => {
          setIsConfirmingReset(false);
          setIsOpen((current) => !current);
        }}
      >
        {isOpen ? <X aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div ref={panelRef} id={panelId} className="accessibility-toolbar__panel" role="region" aria-label="Accessibility preferences">
          <div className="accessibility-toolbar__header">
            <div>
              <p className="accessibility-toolbar__eyebrow">Accessibility</p>
              <h2 className="accessibility-toolbar__title">Display preferences</h2>
            </div>
            <button type="button" className="accessibility-toolbar__icon-button" onClick={() => closePanel({ restoreFocus: true })} aria-label="Close accessibility preferences">
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="accessibility-toolbar__group" aria-label="Text size">
            <p className="accessibility-toolbar__group-label">Text size</p>
            <div className="accessibility-toolbar__segmented" role="group" aria-label="Choose text size">
              <button type="button" aria-pressed={preferences.textScale === "decrease"} onClick={() => setTextScale("decrease")}>
                <Minus aria-hidden="true" />
                Smaller
              </button>
              <button type="button" aria-pressed={preferences.textScale === "default"} onClick={() => setTextScale("default")}>
                Default
              </button>
              <button type="button" aria-pressed={preferences.textScale === "increase"} onClick={() => setTextScale("increase")}>
                <Type aria-hidden="true" />
                Larger
              </button>
            </div>
          </div>

          <div className="accessibility-toolbar__switches">
            <PreferenceButton label="High contrast" active={preferences.highContrast} onClick={() => togglePreference("highContrast")} icon={<Eye aria-hidden="true" />} />
            <PreferenceButton label="Reduced motion" active={preferences.reducedMotion} onClick={() => togglePreference("reducedMotion")} icon={<ZapOff aria-hidden="true" />} />
            <PreferenceButton label="Underline links" active={preferences.underlineLinks} onClick={() => togglePreference("underlineLinks")} icon={<Underline aria-hidden="true" />} />
            <PreferenceButton label="Readable font" active={preferences.readableFont} onClick={() => togglePreference("readableFont")} icon={<Type aria-hidden="true" />} />
            <PreferenceButton label="Enhanced focus" active={preferences.enhancedFocus} onClick={() => togglePreference("enhancedFocus")} icon={<Focus aria-hidden="true" />} />
          </div>

          {isConfirmingReset ? (
            <div className="accessibility-toolbar__confirm" role="group" aria-label="Confirm reset accessibility preferences">
              <p>Reset all saved accessibility preferences?</p>
              <div>
                <button type="button" onClick={confirmResetPreferences}>
                  Reset
                </button>
                <button type="button" onClick={() => setIsConfirmingReset(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="accessibility-toolbar__reset" onClick={() => setIsConfirmingReset(true)}>
              <RotateCcw aria-hidden="true" />
              Reset preferences
            </button>
          )}
        </div>
      ) : null}
    </aside>
  );
}

function PreferenceButton({
  label,
  active,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className="accessibility-toolbar__preference" aria-pressed={active} onClick={onClick}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
