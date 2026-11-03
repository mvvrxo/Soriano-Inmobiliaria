import { valuationFieldLabels, type LeadSubmission, type LeadType, type ValuationField } from "../../types/lead";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_PATTERN = /^\+?[0-9 ().-]{6,20}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LEAD_TYPES: LeadType[] = ["contact", "property_info", "valuation"];

/** Forms submitted faster than this are almost always bots. */
export const MIN_FILL_TIME_MS = 3000;

export type CleanLead = Required<Pick<LeadSubmission, "submissionId" | "type" | "name" | "email">> & {
  lastName: string;
  phone: string;
  message: string;
  reason: string;
  propertyId: string | null;
  pagePath: string;
  details: Partial<Record<ValuationField, string>>;
};

export type ValidationResult =
  | { ok: true; lead: CleanLead }
  | { ok: false; spam: true }
  | { ok: false; spam: false; error: string };

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export function validateLead(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") return { ok: false, spam: false, error: "Solicitud no válida." };
  const body = input as Record<string, unknown>;

  // Anti-spam checks. Bots get a fake success so they do not retry.
  if (text(body.website, 200)) return { ok: false, spam: true };
  if (typeof body.elapsedMs === "number" && body.elapsedMs < MIN_FILL_TIME_MS) return { ok: false, spam: true };

  const type = body.type as LeadType;
  if (!LEAD_TYPES.includes(type)) return { ok: false, spam: false, error: "Tipo de formulario no válido." };

  const submissionId = text(body.submissionId, 36);
  if (!UUID_PATTERN.test(submissionId)) return { ok: false, spam: false, error: "Solicitud no válida." };

  const name = text(body.name, 120);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone, 20);
  const message = text(body.message, 4000);

  if (!name) return { ok: false, spam: false, error: "Escribe tu nombre." };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, spam: false, error: "Escribe un correo electrónico válido." };
  if (phone && !PHONE_PATTERN.test(phone)) return { ok: false, spam: false, error: "Escribe un teléfono válido." };
  if (type === "valuation" && !phone) return { ok: false, spam: false, error: "Indica un teléfono para poder contactarte." };
  if (body.privacy !== true) return { ok: false, spam: false, error: "Debes aceptar la política de privacidad." };
  if ((message.match(/https?:\/\//gi) || []).length > 3) return { ok: false, spam: true };

  const propertyId = text(body.propertyId, 36);
  if (type === "property_info" && !UUID_PATTERN.test(propertyId)) return { ok: false, spam: false, error: "No se ha encontrado la propiedad." };

  const details: Partial<Record<ValuationField, string>> = {};
  if (type === "valuation" && body.details && typeof body.details === "object") {
    for (const key of Object.keys(valuationFieldLabels) as ValuationField[]) {
      const value = text((body.details as Record<string, unknown>)[key], 200);
      if (value) details[key] = value;
    }
  }
  if (type === "valuation" && !details.location) return { ok: false, spam: false, error: "Indica la población o zona de la vivienda." };

  const pagePath = text(body.pagePath, 300);

  return {
    ok: true,
    lead: {
      submissionId,
      type,
      name,
      lastName: text(body.lastName, 120),
      email,
      phone,
      message,
      reason: type === "valuation" ? "" : text(body.reason, 80),
      propertyId: type === "property_info" ? propertyId : null,
      pagePath: pagePath.startsWith("/") ? pagePath : "",
      details,
    },
  };
}
