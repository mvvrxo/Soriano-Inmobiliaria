"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent stored in the browser (localStorage, never sent to a server).
 * "necessary" is always on. Optional categories stay off until the visitor accepts them.
 * Any future analytics or marketing script must check hasConsent() or use <ConsentGate>.
 */
export type OptionalCategory = "analytics" | "marketing";
export interface CookieConsent { version: 2; necessary: true; analytics: boolean; marketing: boolean; savedAt: string }

export const CONSENT_STORAGE_KEY = "soriano-cookie-consent-v2";
const CHANGE_EVENT = "soriano-cookie-consent-change";
export const OPEN_SETTINGS_EVENT = "soriano-cookie-settings-open";
/** Ask again after 12 months, as recommended by the Spanish data protection agency (AEPD). */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

let cachedRaw: string | null = null;
let cachedValue: CookieConsent | null = null;

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(CONSENT_STORAGE_KEY); } catch { return cachedValue; }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = null;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version === 2 && Date.now() - new Date(parsed.savedAt).getTime() < MAX_AGE_MS) cachedValue = parsed;
  } catch { /* invalid value: ask again */ }
  return cachedValue;
}

export function saveConsent(choice: Record<OptionalCategory, boolean>) {
  const value: CookieConsent = { version: 2, necessary: true, analytics: choice.analytics, marketing: choice.marketing, savedAt: new Date().toISOString() };
  try { window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value)); } catch { /* private mode: keep for this page only */ cachedRaw = JSON.stringify(value); cachedValue = value; }
  try { window.localStorage.removeItem("soriano-cookie-notice-v1"); } catch { /* old notice key */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function hasConsent(category: OptionalCategory) {
  return Boolean(readConsent()?.[category]);
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Returns undefined during server rendering, null when no choice has been made yet. */
export function useCookieConsent(): CookieConsent | null | undefined {
  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}
