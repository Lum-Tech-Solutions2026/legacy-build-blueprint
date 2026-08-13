// Sends a Web Push notification to admin devices subscribed via
// push_subscriptions. Called internally by other edge functions
// (e.g. lead-automation) with a service-role-style shared secret, OR
// directly by the admin dashboard with the caller's JWT for a test push.
//
// Body: { title: string, body: string, url?: string, userId?: string }
// If userId is omitted, sends to ALL admin subscriptions (broadcast).

import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const WEBHOOK_SECRET = Deno.env.get("AUTOMATION_WEBHOOK_SECRET");
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:projects@lumtechsolutions.co.za";

Deno.serve(async (req: Request) => {
  try {
    const internalSecret = req.headers.get("x-webhook-secret");
    const authHeader = req.headers.get("Authorization") ?? "";
    const isInternalCall = WEBHOOK_SECRET && internalSecret === WEBHOOK_SECRET;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (!isInternalCall) {
      // Not the internal pipeline calling us - require a real logged-in admin (test-send from dashboard)
      const supabaseUser = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: { user }, error: userErr } = await supabaseUser.auth.getUser();
      if (userErr || !user) {
        return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
      }
      const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "forbidden: admin role required" }), { status: 403 });
      }
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: "VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not configured" }), { status: 500 });
    }
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const { title, body, url, userId } = await req.json();
    if (!title || !body) {
      return new Response(JSON.stringify({ error: "title and body are required" }), { status: 400 });
    }

    let query = admin.from("push_subscriptions").select("*");
    if (userId) query = query.eq("user_id", userId);
    const { data: subs, error } = await query;
    if (error) throw error;

    const payload = JSON.stringify({ title, body, url: url || "/admin" });
    let sent = 0, failed = 0, removed = 0;

    await Promise.all((subs ?? []).map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload,
        );
        sent++;
      } catch (err: any) {
        failed++;
        // 404/410 means the subscription is gone (browser data cleared, etc.) - clean it up
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
          removed++;
        }
      }
    }));

    return new Response(JSON.stringify({ sent, failed, removed, total: subs?.length ?? 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
