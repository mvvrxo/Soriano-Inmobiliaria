export type LeadType = "contact" | "property_info" | "visit_request" | "valuation" | "sell_property" | "rent_property";

export interface Lead {
  id?: string;
  type: LeadType;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
  propertyId?: string;
  source: "website";
  contactType?: string;
  createdAt?: string;
  status?: "new" | "contacted" | "closed";
  metadata?: Record<string, string | number | undefined>;
}
