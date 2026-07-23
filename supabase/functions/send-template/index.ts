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

// Called from the Admin dashboard (via supabase.functions.invoke, so the
// signed-in admin's JWT is attached automatically) to manually fire a
// template at a lead/client — e.g. "mark inspection scheduled and notify",
// "send invoice reminder", "resend quote". verify_jwt is ON for this
// function; we additionally check the caller actually has the admin role.
//
// Body: {
//   template_key: string, channel: "whatsapp" | "email",
//   lead_id?: string, client_id?: string, quote_id?: string,
//   vars?: Record<string, string>   // extra template placeholders, e.g. inspection_date
// }

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: userErr } = await supabaseUser.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "forbidden: admin role required" }), { status: 403 });
    }

    const body = await req.json();
    const { template_key, channel, lead_id, client_id, quote_id, vars = {} } = body;
    if (!template_key || !channel) {
      return new Response(JSON.stringify({ error: "template_key and channel are required" }), { status: 400 });
    }

    const { data: template } = await admin
      .from("message_templates")
      .select("subject, body")
      .eq("key", template_key)
      .eq("channel", channel)
      .maybeSingle();
    if (!template) {
      return new Response(JSON.stringify({ error: `no ${channel} template found for key "${template_key}"` }), { status: 404 });
    }

    // Resolve recipient name/phone/email from a lead or client record
    let name = "", phone: string | null = null, email: string | null = null;
    if (lead_id) {
      const { data: lead } = await admin.from("leads").select("name, phone, email").eq("id", lead_id).maybeSingle();
      if (lead) { name = lead.name; phone = lead.phone; email = lead.email; }
    } else if (client_id) {
      const { data: client } = await admin.from("clients").select("name, phone, email").eq("id", client_id).maybeSingle();
      if (client) { name = client.name; phone = client.phone; email = client.email; }
    }

    const mergedVars = { name, ...vars };
    let result;
    if (channel === "whatsapp") {
      const msg = renderTemplate(template.body, mergedVars);
      result = await sendWhatsApp(phone || vars.phone, msg);
    } else {
      const subject = renderTemplate(template.subject || template_key, mergedVars);
      const msg = renderTemplate(template.body, mergedVars);
      result = await sendEmail(email || vars.email, subject, msg);
    }

    await admin.from("automation_log").insert({
      lead_id: lead_id || null,
      quote_id: quote_id || null,
      step: `manual:${template_key}`,
      channel,
      status: result.ok ? "sent" : "failed",
      detail: result.ok ? `to ${channel === "whatsapp" ? phone : email}` : result.reason,
    });

    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.reason }), { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
