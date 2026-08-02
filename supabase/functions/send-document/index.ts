// Called from the Admin dashboard (AdminQuotes / AdminInvoices) via
// supabase.functions.invoke, so the signed-in admin's JWT is attached
// automatically. verify_jwt is ON; we additionally check the caller has
// the admin role.
//
// Body: {
//   kind: "quote" | "invoice",
//   id: string,               // quotes.id or invoices.id
//   channel: "whatsapp" | "email",
//   pdf_base64: string,       // the PDF generated client-side (jsPDF), base64 (no data: prefix)
//   filename: string,         // e.g. "QT-2026-0001.pdf"
// }
//
// Steps: verify admin -> upload PDF to the private 'documents' bucket ->
// stamp pdf_url/last_sent_at/last_sent_channel on the record -> send via
// Resend (email, PDF as attachment) or Twilio (WhatsApp, PDF as a signed
// media URL) -> log the outcome to automation_log regardless of result.

import { createClient } from "jsr:@supabase/supabase-js@2";

function renderTemplate(body: string, vars: Record<string, string | number | null | undefined>) {
  return body.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    const v = vars[key];
    return v === null || v === undefined ? "" : String(v);
  });
}

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+27${digits.slice(1)}`;
  if (digits.startsWith("27")) return `+${digits}`;
  return `+${digits}`;
}

async function sendWhatsAppWithMedia(to: string, body: string, mediaUrl?: string) {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_WHATSAPP_FROM");
  if (!sid || !token || !from) {
    return { ok: false, reason: "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM not configured" };
  }
  if (!to) return { ok: false, reason: "no destination phone number on record" };

  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${normalizePhone(to)}`;
  const params = new URLSearchParams({ To: toFormatted, From: from, Body: body });
  if (mediaUrl) params.set("MediaUrl", mediaUrl);

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

async function sendEmailWithAttachment(to: string, subject: string, body: string, attachment: { filename: string; contentBase64: string }) {
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
      attachments: [{ filename: attachment.filename, content: attachment.contentBase64 }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, reason: `Resend error ${res.status}: ${text.slice(0, 300)}` };
  }
  return { ok: true };
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

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

    const { kind, id, channel, pdf_base64, filename } = await req.json();
    if (!["quote", "invoice"].includes(kind) || !["whatsapp", "email"].includes(channel) || !id || !pdf_base64 || !filename) {
      return new Response(JSON.stringify({ error: "kind, id, channel, pdf_base64, and filename are required" }), { status: 400 });
    }

    const table = kind === "quote" ? "quotes" : "invoices";
    const numberField = kind === "quote" ? "quote_number" : "invoice_number";

    const { data: record } = await admin.from(table).select("*").eq("id", id).maybeSingle();
    if (!record) {
      return new Response(JSON.stringify({ error: `${kind} not found` }), { status: 404 });
    }

    // Resolve client contact details
    let client: { name: string; email: string | null; phone: string | null } | null = null;
    if (kind === "quote" && record.client_id) {
      const { data } = await admin.from("clients").select("name,email,phone").eq("id", record.client_id).maybeSingle();
      client = data;
    } else if (kind === "invoice" && record.project_id) {
      const { data: project } = await admin.from("projects").select("client_id").eq("id", record.project_id).maybeSingle();
      if (project?.client_id) {
        const { data } = await admin.from("clients").select("name,email,phone").eq("id", project.client_id).maybeSingle();
        client = data;
      }
    }
    if (!client) {
      return new Response(JSON.stringify({ error: "could not resolve client contact details" }), { status: 400 });
    }

    // Upload the PDF to the private documents bucket
    const path = `${kind}s/${filename}`;
    const bytes = base64ToUint8Array(pdf_base64);
    const { error: uploadError } = await admin.storage.from("documents").upload(path, bytes, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (uploadError) {
      return new Response(JSON.stringify({ error: `upload failed: ${uploadError.message}` }), { status: 500 });
    }

    const docNumber = record[numberField] || id.slice(0, 8).toUpperCase();
    let sendResult: { ok: boolean; reason?: string };

    if (channel === "email") {
      const subject = `Your ${kind === "quote" ? "Quotation" : "Invoice"} ${docNumber} - Lum Tech Building Solutions`;
      const body = renderTemplate(
        `Hi {{name}},\n\nPlease find attached your ${kind === "quote" ? "quotation" : "invoice"} ${docNumber} from Lum Tech Building Solutions.\n\nIf you have any questions, just reply to this email or give us a call.\n\nKind regards,\nLum Tech Building Solutions`,
        { name: client.name },
      );
      sendResult = await sendEmailWithAttachment(client.email!, subject, body, { filename, contentBase64: pdf_base64 });
    } else {
      const { data: signed } = await admin.storage.from("documents").createSignedUrl(path, 60 * 60 * 24);
      const body = renderTemplate(
        `Hi {{name}}, your ${kind === "quote" ? "quotation" : "invoice"} ${docNumber} from Lum Tech Building Solutions is ready. Tap the attachment to view it.`,
        { name: client.name },
      );
      sendResult = await sendWhatsAppWithMedia(client.phone!, body, signed?.signedUrl);
    }

    await admin.from(table).update({
      pdf_url: path,
      ...(sendResult.ok ? { last_sent_at: new Date().toISOString(), last_sent_channel: channel } : {}),
    }).eq("id", id);

    await admin.from("automation_log").insert({
      lead_id: null,
      quote_id: kind === "quote" ? id : null,
      step: `${kind}_sent`,
      channel,
      status: sendResult.ok ? "sent" : "failed",
      detail: sendResult.ok ? `to ${channel === "email" ? client.email : client.phone}` : sendResult.reason,
    });

    if (!sendResult.ok) {
      return new Response(JSON.stringify({ error: sendResult.reason }), { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
