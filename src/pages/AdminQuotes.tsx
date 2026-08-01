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
import { Loader2, Plus, Trash2, FileDown, X } from "lucide-react";
import { generateDocumentPdf, type DocLineItem } from "@/lib/pdf/generateDocument";

interface Client { id: string; name: string; email: string | null; phone: string | null; address: string | null; }
interface Project { id: string; project_number: string | null; title: string; client_id: string; }
interface Quote {
  id: string;
  client_id: string | null;
  project_id: string | null;
  quote_number: string | null;
  description: string | null;
  amount: number | null;
  status: string | null;
  expiry_date: string | null;
  created_at: string | null;
}
interface QuoteItem { id: string; quote_id: string; description: string; quantity: number; unit_price: number; }

const STATUSES = ["Draft", "Sent", "Accepted", "Rejected", "Expired"];
const STATUS_BADGE: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Sent: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Expired: "bg-amber-100 text-amber-700",
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

const emptyForm = {
  client_id: "",
  project_id: "",
  description: "",
  status: "Draft",
  expiry_date: "",
};

const emptyLine = { description: "", quantity: "1", unit_price: "" };

const AdminQuotes = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [lines, setLines] = useState([{ ...emptyLine }]);
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [quoteRes, clientRes, projectRes, itemRes] = await Promise.all([
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,name,email,phone,address"),
      supabase.from("projects").select("id,project_number,title,client_id"),
      supabase.from("quote_items").select("*").order("sort_order"),
    ]);
    setQuotes(quoteRes.data ?? []);
    setClients(clientRes.data ?? []);
    setProjects(projectRes.data ?? []);
    setItems(itemRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? "—";
  const projectsForClient = (clientId: string) => projects.filter((p) => p.client_id === clientId);
  const itemsFor = (quoteId: string) => items.filter((i) => i.quote_id === quoteId);

  const lineTotal = useMemo(() => {
    return lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unit_price) || 0), 0);
  }, [lines]);

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }]);
  const removeLine = (idx: number) => setLines((prev) => prev.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: keyof typeof emptyLine, value: string) =>
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));

  const save = async () => {
    if (!form.client_id) { toast({ title: "Please select a client", variant: "destructive" }); return; }
    const validLines = lines.filter((l) => l.description.trim() && Number(l.unit_price) >= 0);
    if (validLines.length === 0) { toast({ title: "Add at least one line item", variant: "destructive" }); return; }

    setSaving(true);
    const { data: quote, error } = await supabase
      .from("quotes")
      .insert({
        client_id: form.client_id,
        project_id: form.project_id || null,
        description: form.description || null,
        status: form.status,
        expiry_date: form.expiry_date || null,
        amount: lineTotal,
      })
      .select()
      .single();

    if (error || !quote) {
      toast({ title: "Save failed", description: error?.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    const { error: itemsError } = await supabase.from("quote_items").insert(
      validLines.map((l, idx) => ({
        quote_id: quote.id,
        description: l.description,
        quantity: Number(l.quantity) || 1,
        unit_price: Number(l.unit_price) || 0,
        sort_order: idx,
      }))
    );

    if (itemsError) {
      toast({ title: "Quote saved, but line items failed", description: itemsError.message, variant: "destructive" });
    } else {
      toast({ title: `Quote ${quote.quote_number} created` });
    }
    setForm(emptyForm);
    setLines([{ ...emptyLine }]);
    setShowForm(false);
    setSaving(false);
    load();
  };

  const remove = async (quote: Quote) => {
    if (!confirm(`Delete quote ${quote.quote_number}?`)) return;
    const { error } = await supabase.from("quotes").delete().eq("id", quote.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Quote deleted" });
    load();
  };

  const updateStatus = async (quote: Quote, status: string) => {
    setQuotes((prev) => prev.map((q) => (q.id === quote.id ? { ...q, status } : q)));
    await supabase.from("quotes").update({ status }).eq("id", quote.id);
  };

  const download = async (quote: Quote) => {
    setDownloadingId(quote.id);
    try {
      const client = clients.find((c) => c.id === quote.client_id);
      const project = projects.find((p) => p.id === quote.project_id);
      const quoteItems = itemsFor(quote.id);
      const docItems: DocLineItem[] = quoteItems.length > 0
        ? quoteItems.map((i) => ({ description: i.description, quantity: Number(i.quantity), unit_price: Number(i.unit_price) }))
        : [{ description: quote.description || "Services rendered", quantity: 1, unit_price: Number(quote.amount) || 0 }];

      const doc = await generateDocumentPdf({
        kind: "QUOTATION",
        number: quote.quote_number || quote.id.slice(0, 8).toUpperCase(),
        issueDate: new Date(quote.created_at || Date.now()).toLocaleDateString("en-ZA"),
        dueOrExpiryLabel: "Valid Until",
        dueOrExpiryDate: quote.expiry_date ? new Date(quote.expiry_date).toLocaleDateString("en-ZA") : null,
        status: quote.status,
        client: {
          name: client?.name || "Client",
          email: client?.email,
          phone: client?.phone,
          address: client?.address,
        },
        project: project ? { project_number: project.project_number, title: project.title } : null,
        items: docItems,
        notes: quote.description || undefined,
      });
      doc.save(`${quote.quote_number || "quote"}.pdf`);
    } catch (err) {
      toast({ title: "Failed to generate PDF", description: String(err), variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <AdminLayout title="Quotes">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)} className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="h-4 w-4" /> New Quote
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v, project_id: "" })}>
                <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project (optional)</Label>
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })} disabled={!form.client_id}>
                <SelectTrigger><SelectValue placeholder="Link to a project" /></SelectTrigger>
                <SelectContent>
                  {projectsForClient(form.client_id).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.project_number ? `${p.project_number} - ` : ""}{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valid Until</Label>
              <Input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Any notes to include on the quote" />
          </div>

          <div>
            <Label className="mb-2 block">Line Items</Label>
            <div className="space-y-2">
              {lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-6"
                    placeholder="Description"
                    value={line.description}
                    onChange={(e) => updateLine(idx, "description", e.target.value)}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Qty"
                    value={line.quantity}
                    onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                  />
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="Unit price (ZAR)"
                    value={line.unit_price}
                    onChange={(e) => updateLine(idx, "unit_price", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    className="col-span-1 flex justify-center text-gray-400 hover:text-destructive"
                    disabled={lines.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2 gap-1" onClick={addLine}>
              <Plus className="h-3.5 w-3.5" /> Add Line
            </Button>
            <p className="text-right font-poppins font-semibold text-primary mt-3">
              Subtotal: {currency(lineTotal)} (excl. VAT)
            </p>
          </div>

          <Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Quote
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : quotes.length === 0 ? (
        <p className="text-gray-500 font-open-sans text-center py-16">No quotes yet.</p>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-lg shadow p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-poppins font-semibold text-primary">{quote.quote_number}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[quote.status || "Draft"]}`}>
                    {quote.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{clientName(quote.client_id)}</p>
                <p className="font-semibold text-primary mt-1">{currency(Number(quote.amount) || 0)}</p>
              </div>
              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                <Select value={quote.status || "Draft"} onValueChange={(v) => updateStatus(quote, v)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => download(quote)} disabled={downloadingId === quote.id}>
                    {downloadingId === quote.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                    PDF
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => remove(quote)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminQuotes;
