import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/lumtech-logo.png";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) navigate("/admin/blog");
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/blog`,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "You are now signed in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back" });
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin/blog` },
    });
    if (error) toast({ title: "Google sign-in error", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-construction-light px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Lum Tech Construction logo" className="h-14 w-auto" />
        </Link>
        <h1 className="text-2xl font-poppins font-bold text-primary text-center mb-1">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-center text-gray-500 font-open-sans text-sm mb-6">
          Admin access for blog & portfolio management
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
          )}
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
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">or</span></div>
        </div>

        <Button variant="outline" onClick={handleGoogle} className="w-full font-poppins">
          Continue with Google
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6 font-open-sans">
          {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-accent font-semibold hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
