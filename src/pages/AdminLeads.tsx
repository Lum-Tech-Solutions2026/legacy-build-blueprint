import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Phone, Mail, UserPlus, Search } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  project_type: string | null;
  message: string | null;
  source: string;
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  estimated_value: number | null;
  notes: string | null;
  client_id: string | null;
  created_at: string;
}

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;

const STATUS_BADGE: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  contacted: "bg-blue-100 text-blue-700",
  quoted: "bg-amber-100 text-amber-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [converting, setConverting] = useState<Lead | null>(null);
  const [convertBudget, setConvertBudget] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load leads", description: error.message, variant: "destructive" });
    } else {
      setLeads(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.project_type?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, filter, search]);

  const updateStatus = async (lead: Lead, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    const { error } = await supabase.from("leads").update({ status }).eq("id", lead.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
  };

  const remove = async (lead: Lead) => {
    if (!confirm(`Delete lead from ${lead.name}?`)) return;
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Lead deleted" });
    load();
  };

  const openConvert = (lead: Lead) => {
    setConverting(lead);
    setConvertBudget(lead.estimated_value ? String(lead.estimated_value) : "");
  };

  const doConvert = async () => {
    if (!converting) return;
    setSaving(true);
    try {
      const { data: client, error: clientErr } = await supabase
        .from("clients")
        .insert({ name: converting.name, email: converting.email, phone: converting.phone })
        .select()
        .single();
      if (clientErr) throw clientErr;

      const { error: projectErr } = await supabase.from("projects").insert({
        client_id: client.id,
        title: converting.project_type || "New Project",
        description: converting.message,
        status: "quoted",
        budget: convertBudget ? Number(convertBudget) : 0,
      });
      if (projectErr) throw projectErr;

      const { error: leadErr } = await supabase
        .from("leads")
        .update({ status: "won", client_id: client.id })
        .eq("id", converting.id);
      if (leadErr) throw leadErr;

      toast({ title: "Converted to client + project" });
      setConverting(null);
      load();
    } catch (err: any) {
      toast({ title: "Conversion failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Leads">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, project type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 font-open-sans text-center py-16">No leads match your filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg shadow p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-poppins font-semibold text-primary">{lead.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[lead.status]}`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-gray-400">via {lead.source}</span>
                  </div>
                  {lead.project_type && (
                    <p className="text-sm text-accent font-medium mt-1">{lead.project_type}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-accent">
                        <Phone className="h-3.5 w-3.5" /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-accent">
                        <Mail className="h-3.5 w-3.5" /> {lead.email}
                      </a>
                    )}
                  </div>
                  {lead.message && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{lead.message}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(lead.created_at).toLocaleString("en-ZA")}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <Select value={lead.status} onValueChange={(v) => updateStatus(lead, v as Lead["status"])}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    {!lead.client_id && (
                      <Button size="sm" variant="outline" onClick={() => openConvert(lead)} className="gap-1">
                        <UserPlus className="h-3.5 w-3.5" /> Convert
                      </Button>
                    )}
                    <Button size="icon" variant="outline" onClick={() => remove(lead)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!converting} onOpenChange={(open) => !open && setConverting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to client + project</DialogTitle>
          </DialogHeader>
          {converting && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This creates a client record for <strong>{converting.name}</strong> and a new project
                (<em>{converting.project_type || "New Project"}</em>), and marks the lead as won.
              </p>
              <div>
                <label className="text-sm font-medium">Estimated project budget (ZAR)</label>
                <Input
                  type="number"
                  value={convertBudget}
                  onChange={(e) => setConvertBudget(e.target.value)}
                  placeholder="e.g. 150000"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConverting(null)}>Cancel</Button>
            <Button onClick={doConvert} disabled={saving} className="bg-accent hover:bg-accent/90">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Convert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLeads;
