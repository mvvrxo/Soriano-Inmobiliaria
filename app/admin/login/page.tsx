"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jonathan@sorianogrupo.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error && caught.message.includes("Falta configurar") ? "Primero debes configurar las variables de Supabase." : "El correo o la contraseña no son correctos.");
    } finally {
      setSending(false);
    }
  };

  return <main className="admin-login-page"><section className="admin-login-card">
    <p className="eyebrow">ÁREA PRIVADA</p><h1>Gestión de viviendas</h1><p>Acceso reservado al equipo de Soriano Grupo Inmobiliario.</p>
    <form onSubmit={submit}><label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="admin-error">{error}</p>}<button className="button-black" disabled={sending}>{sending ? "Entrando…" : "Entrar"} <span>→</span></button></form>
  </section></main>;
}
