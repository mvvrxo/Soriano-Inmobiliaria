import type { LeadSubmission } from "../types/lead";

/**
 * Sends a form to /api/contact. The server stores it in Supabase and emails it
 * to info@sorianogrupo.com. Resolves only when the email was handed to the provider.
 */
export async function submitLead(lead: LeadSubmission): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch {
    throw new Error("No hay conexión. Comprueba tu conexión a internet e inténtalo de nuevo.");
  }
  const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !data?.ok) throw new Error(data?.error || "No hemos podido enviar tu solicitud. Inténtalo de nuevo.");
}
