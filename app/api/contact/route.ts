import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, getSupabaseConfig } from "../../../lib/supabase/config";
import { getEmailConfig, sendEmail } from "../../../lib/email/resend";
import { buildLeadEmail, type LeadProperty } from "../../../lib/leads/email";
import { validateLead } from "../../../lib/leads/validate";
import { leadFormNames } from "../../../types/lead";
import { formatPrice, propertyFromRow } from "../../../types/property";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic per-IP rate limit. Serverless instances do not share memory, so this
// only slows down bursts; the honeypot and timing checks do most of the work.
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentRequests.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  hits.push(now);
  recentRequests.set(ip, hits);
  if (recentRequests.size > 5000) recentRequests.clear();
  return hits.length > RATE_LIMIT;
}

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return fail(429, "Has enviado varias solicitudes seguidas. Espera unos minutos e inténtalo de nuevo.");

  let body: unknown;
  try { body = await request.json(); } catch { return fail(400, "Solicitud no válida."); }

  const result = validateLead(body);
  if (!result.ok) {
    if (result.spam) return NextResponse.json({ ok: true });
    return fail(400, result.error);
  }
  const lead = result.lead;

  if (!getEmailConfig().configured) {
    console.error("[contact] RESEND_API_KEY or CONTACT_EMAIL_FROM is missing; cannot deliver the enquiry by email.");
    return fail(503, "El envío de formularios no está disponible en este momento. Escríbenos a info@sorianogrupo.com o llámanos.");
  }

  let property: LeadProperty | null = null;

  if (isSupabaseConfigured()) {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

    if (lead.propertyId) {
      const { data } = await supabase.from("properties").select("*").eq("id", lead.propertyId).in("status", ["published", "reserved"]).maybeSingle();
      if (!data) return fail(400, "Esta propiedad ya no está disponible. Escríbenos desde la página de contacto.");
      const item = propertyFromRow(data);
      property = { title: item.title, reference: item.reference, slug: item.slug, location: item.location, price: formatPrice(item) };
    }

    // Keep a copy in Supabase so every enquiry also appears in /admin.
    // The id is the browser's submission id, so a retried submission is not stored twice.
    const { error } = await supabase.from("leads").insert({
      id: lead.submissionId,
      type: lead.type,
      name: lead.name,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      property_id: lead.propertyId,
      source: "website",
      contact_type: lead.reason,
      metadata: { form: leadFormNames[lead.type], page: lead.pagePath, ...lead.details },
    });
    if (error && error.code !== "23505") {
      console.error("[contact] Could not store lead", error);
      return fail(500, "No hemos podido registrar tu solicitud. Inténtalo de nuevo en unos minutos.");
    }
  } else if (lead.propertyId) {
    return fail(400, "Esta propiedad ya no está disponible.");
  }

  try {
    await sendEmail(buildLeadEmail(lead, property));
  } catch (error) {
    console.error("[contact] Could not send email", error);
    return fail(502, "No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos a info@sorianogrupo.com.");
  }

  return NextResponse.json({ ok: true });
}
