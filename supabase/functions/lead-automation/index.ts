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

// Triggered by a Postgres webhook (see migration: trg_lead_automation) the
// instant a row is inserted into public.leads. Runs step 1 of the pipeline:
//
//   [Web Form Submission]
//          |
//          v
//   (Immediate Auto-WhatsApp/SMS acknowledgment to the client)
//          |
//          v
//   (Instant WhatsApp alert to the admin's phone)
//          |
//          v
//   (Site Inspection task created, due within 24h)
//
// Every step is logged to public.automation_log regardless of outcome, so
// the admin can always see what fired and why something didn't send.

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

    const payload = await req.json();
    const lead = payload.record;
    if (!lead || !lead.id) {
      return new Response(JSON.stringify({ error: "no lead record in payload" }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const log = async (step: string, channel: string | null, status: "sent" | "failed" | "skipped", detail: string) => {
      await supabase.from("automation_log").insert({ lead_id: lead.id, step, channel, status, detail });
    };

    // --- 1. Immediate WhatsApp/SMS acknowledgment to the client ---
    const { data: ackTemplate } = await supabase
      .from("message_templates")
      .select("body")
      .eq("key", "new_lead_ack")
      .eq("channel", "whatsapp")
      .maybeSingle();

    if (ackTemplate?.body && lead.phone) {
      const msg = renderTemplate(ackTemplate.body, {
        name: lead.name,
        project_type: lead.project_type || "your enquiry",
      });
      const result = await sendWhatsApp(lead.phone, msg);
      await log("new_lead_ack", "whatsapp", result.ok ? "sent" : "failed", result.ok ? `to ${lead.phone}` : result.reason!);
    } else {
      await log("new_lead_ack", "whatsapp", "skipped", "missing template or lead phone number");
    }

    // --- 2. Instant alert to the admin's own phone ---
    const { data: adminNumberRow } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "admin_alert_whatsapp_number")
      .maybeSingle();

    const adminNumber = Deno.env.get("ADMIN_ALERT_WHATSAPP") || adminNumberRow?.value;
    if (adminNumber) {
      const alertMsg = `New lead via ${lead.source || "website"}: ${lead.name}${lead.phone ? ` (${lead.phone})` : ""} — "${lead.project_type || "General enquiry"}". Check the CRM to respond.`;
      const result = await sendWhatsApp(adminNumber, alertMsg);
      await log("admin_alert", "whatsapp", result.ok ? "sent" : "failed", result.ok ? `to ${adminNumber}` : result.reason!);
    } else {
      await log("admin_alert", "whatsapp", "skipped", "no admin alert number configured in Settings");
    }

    // --- 3. Schedule a Site Inspection task within 24 hours ---
    const { error: taskError } = await supabase.from("tasks").insert({
      lead_id: lead.id,
      type: "site_inspection",
      title: `Site inspection - ${lead.name}`,
      due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      notes: lead.message || null,
    });
    await log("site_inspection_task", null, taskError ? "failed" : "sent", taskError ? taskError.message : "task created, due within 24h");

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
