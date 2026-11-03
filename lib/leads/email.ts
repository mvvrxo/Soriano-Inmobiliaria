import { leadFormNames, valuationFieldLabels, type ValuationField } from "../../types/lead";
import type { CleanLead } from "./validate";
import type { OutgoingEmail } from "../email/resend";

export interface LeadProperty { title: string; reference: string; slug: string; location: string; price: string }

const SITE_URL = "https://www.sorianogrupo.com";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);

export function buildLeadEmail(lead: CleanLead, property: LeadProperty | null, receivedAt = new Date()): OutgoingEmail {
  const formName = leadFormNames[lead.type];
  const fullName = [lead.name, lead.lastName].filter(Boolean).join(" ");
  const propertyLabel = property ? `${property.title}${property.reference ? ` (Ref. ${property.reference})` : ""}` : "";

  const subject = lead.type === "property_info"
    ? `[Web] Información sobre ${propertyLabel || "una propiedad"} · ${fullName}`
    : lead.type === "valuation"
      ? `[Web] Vender vivienda en ${lead.details.location || "zona sin indicar"} · ${fullName}`
      : `[Web] Contacto${lead.reason ? ` · ${lead.reason}` : ""} · ${fullName}`;

  const rows: [string, string][] = [
    ["Formulario", formName],
    ...(property ? [
      ["Propiedad", propertyLabel],
      ["Ubicación y precio", `${property.location} · ${property.price}`],
      ["Ficha", `${SITE_URL}/inmuebles/${property.slug}`],
    ] as [string, string][] : []),
    ["Nombre", fullName],
    ["Email", lead.email],
    ["Teléfono", lead.phone || "No indicado"],
    ...(lead.reason ? [["Motivo", lead.reason]] as [string, string][] : []),
    ...(Object.keys(valuationFieldLabels) as ValuationField[])
      .filter((key) => lead.details[key])
      .map((key) => [valuationFieldLabels[key], lead.details[key] as string] as [string, string]),
    ["Mensaje", lead.message || "Sin mensaje"],
    ["Página de envío", lead.pagePath ? `${SITE_URL}${lead.pagePath}` : "No disponible"],
    ["Recibido", receivedAt.toLocaleString("es-ES", { timeZone: "Europe/Madrid", dateStyle: "full", timeStyle: "short" })],
    ["Consentimiento de privacidad", "Aceptado"],
    ["Referencia de envío", lead.submissionId],
  ];

  const html = `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f4f0eb;font-family:Arial,sans-serif;color:#26201d">
<table role="presentation" style="max-width:640px;width:100%;margin:0 auto;background:#fffdfa;border:1px solid #171514;border-collapse:collapse">
<tr><td colspan="2" style="padding:20px 24px;background:#171514;color:#fffdfa"><strong style="font-size:16px">${escapeHtml(formName)}</strong><br><span style="font-size:12px;color:#ded0c4">Nueva solicitud desde sorianogrupo.com</span></td></tr>
${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px 24px;width:170px;font-size:12px;color:#5a3a2e;border-top:1px solid #ded0c4">${escapeHtml(label)}</th><td style="padding:10px 24px 10px 0;font-size:14px;line-height:1.5;border-top:1px solid #ded0c4;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("\n")}
</table>
<p style="max-width:640px;margin:14px auto 0;font-size:11px;color:#5a3a2e">Responde a este correo para contestar directamente a ${escapeHtml(fullName)}.</p>
</body></html>`;

  const text = `${formName}\nNueva solicitud desde sorianogrupo.com\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n`;

  return { subject: subject.slice(0, 200), html, text, replyTo: lead.email, idempotencyKey: `lead-${lead.submissionId}` };
}
