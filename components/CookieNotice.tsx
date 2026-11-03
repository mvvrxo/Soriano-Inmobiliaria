"use client";

import { useEffect, useState } from "react";
import Link from "./Link";
import { OPEN_SETTINGS_EVENT, saveConsent, useCookieConsent } from "../lib/cookieConsent";

/**
 * Cookie banner and settings panel. "Rechazar" and "Aceptar" have the same weight,
 * and the choice can be changed at any time from "Configurar cookies" in the footer.
 */
export function CookieNotice() {
  const consent = useCookieConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const open = () => { setAnalytics(Boolean(consent?.analytics)); setSettingsOpen(true); };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, [consent]);

  const choose = (choice: { analytics: boolean }) => { saveConsent({ analytics: choice.analytics, marketing: false }); setSettingsOpen(false); };

  // undefined = server render; an existing choice hides the banner unless settings were reopened.
  if (consent === undefined || (consent && !settingsOpen)) return null;

  return <aside className={settingsOpen ? "cookie-notice is-settings" : "cookie-notice"} aria-label="Preferencias de cookies" role="dialog" aria-modal="false">
    <div>
      <strong>{settingsOpen ? "Configurar cookies" : "Tu privacidad importa"}</strong>
      {settingsOpen ? <div className="cookie-categories">
        <label><input type="checkbox" checked disabled /> <span><b>Técnicas (siempre activas)</b> Necesarias para que la web funcione, recordar tu elección de cookies y proteger el área privada.</span></label>
        <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /> <span><b>Analítica</b> Nos ayudarían a saber cómo se usa la web. Ahora mismo no utilizamos ninguna herramienta de analítica: si la incorporamos, solo se activará con este permiso.</span></label>
      </div> : <p>Usamos únicamente cookies técnicas necesarias para que la web funcione. No usamos cookies publicitarias ni de analítica. Puedes aceptar, rechazar o configurar las cookies opcionales. <Link href="/cookies">Más información</Link>.</p>}
    </div>
    <div className="cookie-actions">
      {settingsOpen ? <>
        <button type="button" className="cookie-secondary" onClick={() => choose({ analytics: false })}>Rechazar todas</button>
        <button type="button" onClick={() => choose({ analytics })}>Guardar preferencias</button>
      </> : <>
        <button type="button" className="cookie-secondary" onClick={() => choose({ analytics: false })}>Rechazar</button>
        <button type="button" className="cookie-secondary" onClick={() => { setAnalytics(false); setSettingsOpen(true); }}>Configurar</button>
        <button type="button" onClick={() => choose({ analytics: true })}>Aceptar todas</button>
      </>}
    </div>
  </aside>;
}
