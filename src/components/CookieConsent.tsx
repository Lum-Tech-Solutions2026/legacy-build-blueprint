import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "lumtech_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing etc.) - don't block the site over it
      setVisible(true);
    }
  }, []);

  const respond = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore storage failures, just dismiss the banner
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-primary border-t border-white/10 shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-4">
        <Cookie className="h-8 w-8 text-accent shrink-0 hidden md:block" />
        <p className="font-open-sans text-gray-200 text-sm text-center md:text-left flex-1">
          We use basic cookies to run this website and understand how visitors use it. By
          continuing to browse, you agree to our use of cookies as described in our{" "}
          <Link to="/privacy-policy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => respond("declined")}
            className="border-white/40 text-white hover:bg-white/10 font-poppins font-medium"
          >
            Decline
          </Button>
          <Button
            onClick={() => respond("accepted")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
