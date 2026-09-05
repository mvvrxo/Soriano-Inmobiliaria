import type { Lead } from "../types/lead";
import { createClient } from "../lib/supabase/client";

export async function submitLead(lead: Lead): Promise<{ id: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.from("leads").insert({
    type: lead.type,
    name: lead.name,
    last_name: lead.lastName || "",
    email: lead.email,
    phone: lead.phone || "",
    message: lead.message || "",
    property_id: lead.propertyId || null,
    source: lead.source,
    contact_type: lead.contactType || "",
    metadata: lead.metadata || {},
  }).select("id").single();
  if (error) throw error;
  return { id: String(data.id) };
}
