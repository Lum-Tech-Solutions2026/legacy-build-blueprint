// Shared helpers used by lead-automation, quote-followup, and send-template
// edge functions: template variable substitution + WhatsApp/SMS (Twilio) +
// email (Resend) senders. Every sender fails soft (returns {ok:false, reason})
// instead of throwing, so a missing secret never breaks the pipeline.

export function renderTemplate(body: string, vars: Record<string, string | number | null | undefined>) {
  return body.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    const v = vars[key];
    return v === null || v === undefined ? "" : String(v);
  });
}

export async function sendWhatsApp(to: string, body: string) {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_WHATSAPP_FROM"); // e.g. "whatsapp:+14155238886"
  if (!sid || !token || !from) {
    return { ok: false, reason: "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM not configured" };
  }
  if (!to) return { ok: false, reason: "no destination phone number on record" };

  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${normalizePhone(to)}`;
  const params = new URLSearchParams({ To: toFormatted, From: from, Body: body });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, reason: `Twilio error ${res.status}: ${text.slice(0, 300)}` };
  }
  return { ok: true };
}

export async function sendEmail(to: string, subject: string, body: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("NOTIFY_FROM_EMAIL") || "Lum Tech Building Solutions <notifications@lumtechsolutions.co.za>";
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY not configured" };
  if (!to) return { ok: false, reason: "no destination email on record" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: body,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, reason: `Resend error ${res.status}: ${text.slice(0, 300)}` };
  }
  return { ok: true };
}

// Normalizes a South African-style local number (071..., 0821234567) to E.164 (+27...).
// Leaves already-international numbers (+..) untouched.
export function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+27${digits.slice(1)}`;
  if (digits.startsWith("27")) return `+${digits}`;
  return `+${digits}`;
}
