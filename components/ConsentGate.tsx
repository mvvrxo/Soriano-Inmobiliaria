"use client";

import type { ReactNode } from "react";
import { useCookieConsent, type OptionalCategory } from "../lib/cookieConsent";

/**
 * Renders its children (e.g. an analytics <Script>, a map or a video embed)
 * only after the visitor has accepted that cookie category.
 * Not used yet: the site currently has no optional cookies.
 */
export function ConsentGate({ category, children, fallback = null }: { category: OptionalCategory; children: ReactNode; fallback?: ReactNode }) {
  const consent = useCookieConsent();
  return <>{consent?.[category] ? children : fallback}</>;
}
