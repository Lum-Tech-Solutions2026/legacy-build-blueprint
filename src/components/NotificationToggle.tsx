import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getPushSubscriptionState, isPushSupported, subscribeToPush, unsubscribeFromPush } from "@/lib/push";

const NotificationToggle = ({ compact = false }: { compact?: boolean }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<"loading" | "unsupported" | "denied" | "subscribed" | "unsubscribed">("loading");

  useEffect(() => {
    if (!isPushSupported()) { setState("unsupported"); return; }
    getPushSubscriptionState().then(setState);
  }, []);

  const toggle = async () => {
    if (!user) return;
    setState("loading");
    try {
      if (state === "subscribed") {
        await unsubscribeFromPush();
        setState("unsubscribed");
        toast({ title: "Notifications turned off" });
      } else {
        await subscribeToPush(user.id);
        setState("subscribed");
        toast({ title: "Notifications enabled", description: "You'll get a push alert the instant a new lead comes in." });
      }
    } catch (err: any) {
      setState(await getPushSubscriptionState());
      toast({ title: "Couldn't update notifications", description: err.message, variant: "destructive" });
    }
  };

  if (state === "unsupported") return null;

  const label =
    state === "loading" ? "Checking…" :
    state === "denied" ? "Notifications blocked" :
    state === "subscribed" ? "Notifications on" :
    "Enable notifications";

  return (
    <button
      onClick={toggle}
      disabled={state === "loading" || state === "denied"}
      title={state === "denied" ? "Notifications are blocked in your browser settings" : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-poppins text-sm transition-colors w-full ${
        compact ? "" : "text-gray-300 hover:bg-white/10 hover:text-white"
      } ${state === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "subscribed" ? (
        <Bell className="h-4 w-4 text-accent" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      {label}
    </button>
  );
};

export default NotificationToggle;
