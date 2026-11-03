/**
 * Company data used by the legal pages (Aviso legal, Privacidad, Cookies).
 * Leave a field as "" until the owner provides it: the pages then show it as pending.
 * Do NOT invent values here.
 */
export const legalConfig = {
  /** Razón social (if a company) or full name of the self-employed owner. */
  holderName: "",
  /** "sociedad" or "autonomo". Controls whether registry data is required. */
  holderKind: "" as "" | "sociedad" | "autonomo",
  /** NIF / CIF. */
  taxId: "",
  /** Registered or professional address, with postcode and town. */
  registeredAddress: "",
  /** Registro Mercantil details (tomo, folio, hoja). Only for companies. */
  mercantileRegistry: "",
  /** Número de inscripción en el Registre d'Agents Immobiliaris de Catalunya (AICAT). */
  aicatNumber: "",
  /** Email for privacy requests. */
  privacyEmail: "info@sorianogrupo.com",
  /** Date shown as "Última actualización" on the legal pages. */
  lastUpdated: "3 de noviembre de 2026",
} as const;

export const legalPendingFields = [
  ["holderName", "Razón social o nombre completo del titular"],
  ["holderKind", "Forma jurídica (sociedad o autónomo)"],
  ["taxId", "NIF / CIF"],
  ["registeredAddress", "Domicilio social completo (con código postal y municipio)"],
  ["aicatNumber", "Número de inscripción en el Registro de Agentes Inmobiliarios de Cataluña (AICAT)"],
] as const;
