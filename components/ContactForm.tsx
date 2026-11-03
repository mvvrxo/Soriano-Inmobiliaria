"use client";
import { useEffect, useRef, useState } from "react";
import Link from "./Link";
import { submitLead } from "../services/contactService";
import { valuationFieldLabels, type LeadType, type ValuationField } from "../types/lead";
import { propertyTypes } from "../config/property";
import { EMAIL_PATTERN, PHONE_PATTERN } from "../lib/leads/validate";

interface ContactFormProps { type?: LeadType; propertyId?: string; propertyTitle?: string; title?: string; valuation?: boolean; }

const reasonsByType: Partial<Record<LeadType, string[]>> = {
  contact: ["Comprar vivienda", "Vender vivienda", "Solicitar valoración", "Otra consulta"],
  property_info: ["Solicitar más información", "Concertar una visita"],
};

export function ContactForm({ type = "contact", propertyId, propertyTitle, title = "Cuéntanos cómo podemos ayudarte", valuation = false }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const submissionId = useRef("");
  const shownAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const formType: LeadType = valuation ? "valuation" : type;
  const reasons = reasonsByType[formType];

  useEffect(() => { shownAt.current = Date.now(); }, []);
  useEffect(() => { if (status === "sent") statusRef.current?.focus(); }, [status]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const value = (key: string) => String(form.get(key) || "").trim();

    const name = value("name"), email = value("email"), phone = value("phone");
    if (!name || !email || (valuation && (!phone || !value("location")))) { setError("Completa los campos obligatorios marcados con *."); return; }
    if (!EMAIL_PATTERN.test(email)) { setError("Escribe un correo electrónico válido."); return; }
    if (phone && !PHONE_PATTERN.test(phone)) { setError("Escribe un teléfono válido."); return; }
    if (!form.get("privacy")) { setError("Debes aceptar la política de privacidad para enviar el formulario."); return; }

    // Same id for retries of this submission, so the server never stores or emails it twice.
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const details = valuation
      ? Object.fromEntries((Object.keys(valuationFieldLabels) as ValuationField[]).map((key) => [key, value(key)]).filter(([, item]) => item))
      : undefined;

    setError("");
    setStatus("sending");
    try {
      await submitLead({
        submissionId: submissionId.current,
        type: formType,
        propertyId,
        name,
        lastName: value("lastName"),
        email,
        phone,
        message: value("message"),
        reason: value("reason"),
        details,
        privacy: true,
        pagePath: window.location.pathname,
        website: value("website"),
        elapsedMs: shownAt.current ? Date.now() - shownAt.current : undefined,
      });
      formElement.reset();
      submissionId.current = "";
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No hemos podido enviar tu solicitud. Inténtalo de nuevo.");
      setStatus("idle");
    }
  };

  if (status === "sent") return <div className="form-success" role="status" tabIndex={-1} ref={statusRef}><span>✓</span><h3>Gracias por escribirnos</h3><p>Hemos recibido tu solicitud{propertyTitle ? ` sobre «${propertyTitle}»` : ""}. Te contactaremos muy pronto.</p><button type="button" onClick={() => { shownAt.current = Date.now(); setStatus("idle"); }}>Enviar otra consulta</button></div>;

  return <form className="contact-form" onSubmit={submit} noValidate aria-busy={status === "sending"}>
    <h2>{title}</h2>
    <div className="form-grid">
      <label>Nombre*<input name="name" autoComplete="given-name" maxLength={120} required /></label>
      <label>Apellidos<input name="lastName" autoComplete="family-name" maxLength={120} /></label>
      <label>Email*<input name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} required /></label>
      <label>Teléfono{valuation && "*"}<input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} required={valuation} /></label>
      {valuation && <>
        <label>Tipo de inmueble<select name="propertyType">{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Zona o población*<input name="location" autoComplete="address-level2" placeholder="Municipio o zona de Catalunya" maxLength={200} required /></label>
        <label className="full">Dirección aproximada<input name="address" autoComplete="street-address" placeholder="Calle y número (opcional)" maxLength={200} /></label>
        <label>Superficie aproximada<input name="surface" type="number" min="0" inputMode="numeric" placeholder="m²" /></label>
        <label>Habitaciones<select name="bedrooms" defaultValue=""><option value="">Sin indicar</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5 o más</option></select></label>
        <label>Baños<select name="bathrooms" defaultValue=""><option value="">Sin indicar</option><option>1</option><option>2</option><option>3 o más</option></select></label>
        <label>Estado<select name="condition" defaultValue=""><option value="">Sin indicar</option><option>A estrenar o reformado</option><option>Buen estado</option><option>Necesita reforma</option></select></label>
        <label className="full">¿Cuándo te gustaría vender?<select name="timeframe" defaultValue=""><option value="">Sin indicar</option><option>Lo antes posible</option><option>En los próximos 6 meses</option><option>Más adelante</option><option>Solo quiero conocer el valor</option></select></label>
      </>}
      {reasons && <label className="full">{formType === "property_info" ? "¿Qué necesitas?" : "Motivo"}<select name="reason">{reasons.map((item) => <option key={item}>{item}</option>)}</select></label>}
      <label className="full">Mensaje<textarea name="message" rows={4} maxLength={4000} placeholder={valuation ? "Explícanos tu situación. Por ejemplo: qué necesitas, qué tipo de propiedad es y cuándo te gustaría vender." : formType === "property_info" ? "Escribe aquí tu consulta sobre esta vivienda" : "Escribe aquí tu consulta"} /></label>
    </div>
    <div className="form-hp" aria-hidden="true"><label>No rellenes este campo<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="privacy"><input name="privacy" type="checkbox" required /> <span>He leído y acepto la <Link href="/privacidad" target="_blank">política de privacidad</Link>.* Usaremos tus datos solo para responder a esta solicitud.</span></label>
    <div aria-live="assertive">{error && <p className="form-error" role="alert">{error}</p>}</div>
    <button className="button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando..." : valuation ? "Solicitar valoración" : "Enviar consulta"} <span>→</span></button>
  </form>;
}
