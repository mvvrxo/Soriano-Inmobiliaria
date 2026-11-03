import { cache } from "react";
import { createClient } from "../lib/supabase/server";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { propertyFromRow, type Property } from "../types/property";

export async function getPublishedProperties(): Promise<Property[]> {
  // Without Supabase there is no catalogue: the site shows an empty state, never sample listings.
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").in("status", ["published", "reserved"]).order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map((row) => propertyFromRow(row));
}

// cache(): the detail page and its metadata share one query per request.
export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).in("status", ["published", "reserved"]).maybeSingle();
  if (error) { console.error(error); return null; }
  return data ? propertyFromRow(data) : null;
});
