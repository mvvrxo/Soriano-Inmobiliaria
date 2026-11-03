"use client";

import { openCookieSettings } from "../lib/cookieConsent";

export function CookieSettingsButton() {
  return <button type="button" className="footer-cookie-button" onClick={openCookieSettings}>Configurar cookies</button>;
}
