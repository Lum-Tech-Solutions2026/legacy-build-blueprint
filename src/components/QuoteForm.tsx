import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

const PROJECT_TYPES = [
  "New Home Construction",
  "Home Renovation",
  "Commercial Construction",
  "Roofing & Waterproofing",
  "Tiling & Painting",
  "Other",
];

interface QuoteFormProps {
  source: string;
  compact?: boolean;
  onSuccess?: () => void;
}

const QuoteForm = ({ source, compact = false, onSuccess }: QuoteFormProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", project_type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        project_type: form.project_type || null,
        message: form.message || null,
        source,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Quote request sent!", description: "We'll get back to you within 24 hours." });
      onSuccess?.();
    } catch (err: any) {
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
        <h3 className="font-poppins font-bold text-lg text-primary mb-2">Thank you, {form.name.split(" ")[0]}!</h3>
        <p className="text-gray-600 font-open-sans">
          Your quote request has been received. Our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <div className="space-y-1.5">
          <Label htmlFor="qf-name">Full Name</Label>
          <Input
            id="qf-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="qf-phone">Phone Number</Label>
          <Input
            id="qf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
      </div>
      {!compact && (
        <div className="space-y-1.5">
          <Label htmlFor="qf-email">Email Address</Label>
          <Input
            id="qf-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      )}
      <div className="space-y-1.5">
        <Label>Project Type</Label>
        <Select value={form.project_type} onValueChange={(v) => setForm({ ...form, project_type: v })}>
          <SelectTrigger><SelectValue placeholder="Select a project type" /></SelectTrigger>
          <SelectContent>
            {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {!compact && (
        <div className="space-y-1.5">
          <Label htmlFor="qf-message">Tell us about your project</Label>
          <Textarea
            id="qf-message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            placeholder="Timeline, budget range, location, any specific requirements…"
          />
        </div>
      )}
      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-accent hover:opacity-90 text-accent-foreground font-poppins font-semibold shadow-gold-glow"
      >
        {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
        Get My Free Quote
      </Button>
      <p className="text-xs text-gray-400 text-center font-open-sans">
        No obligation. We respond within 24 hours.
      </p>
    </form>
  );
};

export default QuoteForm;
