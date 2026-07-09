import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Wallet, ChevronDown, ChevronUp } from "lucide-react";

interface Client { id: string; name: string; }
interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: "quoted" | "in_progress" | "completed" | "on_hold" | "cancelled";
  budget: number;
  start_date: string | null;
  end_date: string | null;
}
interface Payment {
  id: string;
  project_id: string;
  amount: number;
  type: string;
  paid_at: string;
}

const STATUSES = ["quoted", "in_progress", "completed", "on_hold", "cancelled"] as const;
const STATUS_BADGE: Record<string, string> = {
  quoted: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  on_hold: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

const emptyProject = { client_id: "", title: "", description: "", status: "quoted" as const, budget: "", start_date: "", end_date: "" };
const emptyPayment = { amount: "", type: "milestone", paid_at: new Date().toISOString().slice(0, 10), notes: "" };

const AdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paymentProject, setPaymentProject] = useState<Project | null>(null);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);

  const load = async () => {
    setLoading(true);
    const [projRes, clientRes, payRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,name"),
      supabase.from("payments").select("*").order("paid_at", { ascending: false }),
    ]);
    setProjects(projRes.data ?? []);
    setClients(clientRes.data ?? []);
    setPayments(payRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "Unknown client";

  const paymentsFor = (projectId: string) => payments.filter((p) => p.project_id === projectId);
  const spentFor = (projectId: string) => paymentsFor(projectId).reduce((sum, p) => sum + Number(p.amount), 0);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_id) { toast({ title: "Please select a client", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      ...form,
      budget: form.budget ? Number(form.budget) : 0,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project created" });
      setForm(emptyProject);
      setShowForm(false);
      load();
    }
    setSaving(false);
  };

  const updateStatus = async (project: Project, status: Project["status"]) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, status } : p)));
    await supabase.from("projects").update({ status }).eq("id", project.id);
  };

  const remove = async (project: Project) => {
    if (!confirm(`Delete project "${project.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Project deleted" });
    load();
  };

  const savePayment = async () => {
    if (!paymentProject || !paymentForm.amount) return;
    const { error } = await supabase.from("payments").insert({
      project_id: paymentProject.id,
      amount: Number(paymentForm.amount),
      type: paymentForm.type as any,
      paid_at: paymentForm.paid_at,
      notes: paymentForm.notes || null,
    });
    if (error) {
      toast({ title: "Failed to record payment", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment recorded" });
      setPaymentProject(null);
      setPaymentForm(emptyPayment);
      load();
    }
  };

  return (
    <AdminLayout title="Projects">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)} className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <Label>Budget (ZAR)</Label>
              <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Project
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 font-open-sans text-center py-16">No projects yet.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const spent = spentFor(project.id);
            const outstanding = Math.max(Number(project.budget) - spent, 0);
            const isOpen = expanded === project.id;
            return (
              <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-poppins font-semibold text-primary">{project.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[project.status]}`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{clientName(project.client_id)}</p>
                    <div className="flex gap-6 mt-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Budget</p>
                        <p className="font-semibold text-primary">{currency(Number(project.budget))}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Collected</p>
                        <p className="font-semibold text-green-600">{currency(spent)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Outstanding</p>
                        <p className="font-semibold text-amber-600">{currency(outstanding)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <Select value={project.status} onValueChange={(v) => updateStatus(project, v as Project["status"])}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setPaymentProject(project)}>
                        <Wallet className="h-3.5 w-3.5" /> Add Payment
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => remove(project)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(isOpen ? null : project.id)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-accent py-2 border-t"
                >
                  {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {paymentsFor(project.id).length} payment{paymentsFor(project.id).length === 1 ? "" : "s"}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    {paymentsFor(project.id).length === 0 ? (
                      <p className="text-sm text-gray-400">No payments recorded yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {paymentsFor(project.id).map((p) => (
                          <div key={p.id} className="flex justify-between text-sm bg-construction-light rounded px-3 py-2">
                            <span className="capitalize text-gray-600">{p.type}</span>
                            <span className="text-gray-500">{new Date(p.paid_at).toLocaleDateString("en-ZA")}</span>
                            <span className="font-semibold text-primary">{currency(Number(p.amount))}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!paymentProject} onOpenChange={(open) => !open && setPaymentProject(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record a payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (ZAR)</Label>
              <Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={paymentForm.type} onValueChange={(v) => setPaymentForm({ ...paymentForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Paid</Label>
              <Input type="date" value={paymentForm.paid_at} onChange={(e) => setPaymentForm({ ...paymentForm, paid_at: e.target.value })} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentProject(null)}>Cancel</Button>
            <Button onClick={savePayment} className="bg-accent hover:bg-accent/90">Save Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProjects;
