// Server-side only: reads secret environment variables. Never import from a client component.

export interface OutgoingEmail {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Lets Resend drop a repeated send of the same submission. */
  idempotencyKey?: string;
}

export function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO || "info@sorianogrupo.com";
  const from = process.env.CONTACT_EMAIL_FROM;
  return { apiKey, to, from, configured: Boolean(apiKey && from) };
}

/** Sends an email through the Resend HTTP API. Throws if it is not delivered to Resend. */
export async function sendEmail(email: OutgoingEmail) {
  const { apiKey, to, from, configured } = getEmailConfig();
  if (!configured) throw new Error("Email sending is not configured (RESEND_API_KEY / CONTACT_EMAIL_FROM).");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(email.idempotencyKey ? { "Idempotency-Key": email.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((item) => item.trim()).filter(Boolean),
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend error ${response.status}: ${detail.slice(0, 300)}`);
  }
}
