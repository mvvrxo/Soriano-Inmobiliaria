import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { createClient } from "../../lib/supabase/server";
import { propertyFromRow } from "../../types/property";
import { AdminDashboard, type AdminLead } from "./AdminDashboard";

export const metadata = { title: "Gestión" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <main className="admin-setup"><div><p className="eyebrow">CONFIGURACIÓN PENDIENTE</p><h1>Conecta Supabase</h1><p>Copia <code>.env.example</code> como <code>.env.local</code>, añade la URL y la clave publicable del proyecto y reinicia la web.</p></div></main>;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const email = String(claimsData?.claims?.email || "").toLowerCase();
  if (!email) redirect("/admin/login");

  const { data: access } = await supabase.from("admin_users").select("email").eq("email", email).maybeSingle();
  if (!access) redirect("/admin/login?error=unauthorized");

  const [{ data: propertyRows }, { data: leadRows }] = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  const leads: AdminLead[] = (leadRows || []).map((lead) => ({
    id: String(lead.id), name: String(lead.name), lastName: String(lead.last_name || ""), email: String(lead.email), phone: String(lead.phone || ""), message: String(lead.message || ""), type: String(lead.type), status: String(lead.status) as AdminLead["status"], createdAt: String(lead.created_at),
  }));

  return <AdminDashboard email={email} initialProperties={(propertyRows || []).map((row) => propertyFromRow(row))} initialLeads={leads} />;
}
