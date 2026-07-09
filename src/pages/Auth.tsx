import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import logo from "@/assets/lumtech-logo.png";

// Admin-only sign-in. There is intentionally no public sign-up here —
// admin accounts are created directly in Supabase (see ADMIN_SETUP.md).
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) navigate("/admin");
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back" });
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-construction-light px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Lum Tech Construction logo" className="h-14 w-auto" />
        </Link>
        <h1 className="text-2xl font-poppins font-bold text-primary text-center mb-1">
          Admin Sign In
        </h1>
        <p className="text-center text-gray-500 font-open-sans text-sm mb-6">
          Restricted access for authorized Lum Tech staff only
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 font-open-sans">
          Don't have access? Contact the site administrator.
        </p>
      </div>
    </div>
  );
};

export default Auth;
