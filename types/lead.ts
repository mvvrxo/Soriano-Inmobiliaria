export type LeadType = "contact" | "property_info" | "valuation";

/** Human-readable name of each form, used in emails and in the admin panel. */
export const leadFormNames: Record<LeadType, string> = {
  contact: "Formulario de contacto",
  property_info: "Solicitud de información de una propiedad",
  valuation: "Vender tu vivienda (solicitud de valoración)",
};

/** Labels for the extra data collected by the sell/valuation form. */
export const valuationFieldLabels = {
  propertyType: "Tipo de inmueble",
  location: "Población o zona",
  address: "Dirección aproximada",
  surface: "Superficie aproximada (m²)",
  bedrooms: "Habitaciones",
  bathrooms: "Baños",
  condition: "Estado de la vivienda",
  timeframe: "Plazo previsto para vender",
} as const;

export type ValuationField = keyof typeof valuationFieldLabels;

/** What the browser sends to /api/contact. */
export interface LeadSubmission {
  submissionId: string;
  type: LeadType;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
  reason?: string;
  propertyId?: string;
  pagePath?: string;
  privacy: boolean;
  details?: Partial<Record<ValuationField, string>>;
  /** Anti-spam: hidden field that people never fill in. */
  website?: string;
  /** Anti-spam: milliseconds since the form was shown. */
  elapsedMs?: number;
}
