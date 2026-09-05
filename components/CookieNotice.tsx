"use client";

import { useSyncExternalStore } from "react";
import Link from "./Link";

const STORAGE_KEY = "soriano-cookie-notice-v1";
const CHANGE_EVENT = "soriano-cookie-preference-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function CookieNotice() {
  const acknowledged = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(STORAGE_KEY) === "acknowledged",
    () => true,
  );

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "acknowledged");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  if (acknowledged) return null;

  return <aside className="cookie-notice" aria-label="Aviso de cookies">
    <div>
      <strong>Tu privacidad importa</strong>
      <p>Esta web utiliza únicamente tecnologías técnicas necesarias para funcionar. No usamos cookies publicitarias ni de analítica.</p>
    </div>
    <div className="cookie-actions">
      <Link href="/cookies">Más información</Link>
      <button type="button" onClick={dismiss}>Entendido</button>
    </div>
  </aside>;
}
