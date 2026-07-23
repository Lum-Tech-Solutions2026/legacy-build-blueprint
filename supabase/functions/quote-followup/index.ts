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

// ---- function body below ----

// Runs on a schedule (see migration: cron job "quote-followup-hourly") to
// implement the last step of the pipeline:
//
//   (Automated Email Follow-up 48 hours after sending the quote)
//
// A quote is "eligible" once its status is Sent, it was created 48h+ ago,
// and it hasn't already received a quote_followup_48h email.

import { createClient } from "jsr:@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("AUTOMATION_WEBHOOK_SECRET");

Deno.serve(async (req: Request) => {
  try {
    if (WEBHOOK_SECRET) {
      const provided = req.headers.get("x-webhook-secret");
      if (provided !== WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: quotes, error } = await supabase
      .from("quotes")
      .select("id, amount, expiry_date, created_at, client_id, clients(name, email)")
      .ilike("status", "sent")
      .lte("created_at", cutoff);

    if (error) throw error;

    const { data: template } = await supabase
      .from("message_templates")
      .select("subject, body")
      .eq("key", "quote_followup_48h")
      .eq("channel", "email")
      .maybeSingle();

    let sent = 0, skipped = 0, failed = 0;

    for (const quote of quotes ?? []) {
      const { data: alreadySent } = await supabase
        .from("automation_log")
        .select("id")
        .eq("quote_id", quote.id)
        .eq("step", "quote_followup_48h")
        .eq("status", "sent")
        .maybeSingle();
      if (alreadySent) { skipped++; continue; }

      const client = (quote as any).clients;
      if (!template?.body || !client?.email) {
        await supabase.from("automation_log").insert({
          quote_id: quote.id, step: "quote_followup_48h", channel: "email",
          status: "skipped", detail: !template?.body ? "template missing" : "client has no email",
        });
        skipped++;
        continue;
      }

      const body = renderTemplate(template.body, { name: client.name });
      const subject = template.subject || "Following up on your quote";
      const result = await sendEmail(client.email, subject, body);

      await supabase.from("automation_log").insert({
        quote_id: quote.id, step: "quote_followup_48h", channel: "email",
        status: result.ok ? "sent" : "failed",
        detail: result.ok ? `to ${client.email}` : result.reason,
      });
      result.ok ? sent++ : failed++;
    }

    return new Response(JSON.stringify({ checked: quotes?.length ?? 0, sent, skipped, failed }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
