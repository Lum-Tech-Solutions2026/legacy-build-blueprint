import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, FileDown, X } from "lucide-react";
import { generateDocumentPdf, type DocLineItem } from "@/lib/pdf/generateDocument";

interface Client { id: string; name: string; email: string | null; phone: string | null; address: string | null; }
interface Project { id: string; project_number: string | null; title: string; client_id: string; }
interface Invoice {
  id: string;
  project_id: string | null;
  invoice_number: string | null;
  amount: number | null;
  vat: number | null;
  status: string | null;
  due_date: string | null;
  created_at: string | null;
}
interface InvoiceItem { id: string; invoice_id: string; description: string; quantity: number; unit_price: number; }

const STATUSES = ["Pending", "Paid", "Overdue", "Cancelled"];
const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
  Cancelled: "bg-slate-100 text-slate-700",
};
const VAT_RATE = 0.15;

const currency = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

const emptyForm = { project_id: "", status: "Pending", due_date: "" };
const emptyLine = { description: "", quantity: "1", unit_price: "" };

const AdminInvoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [lines, setLines] = useState([{ ...emptyLine }]);
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [invRes, clientRes, projectRes, itemRes] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,name,email,phone,address"),
      supabase.from("projects").select("id,project_number,title,client_id"),
      supabase.from("invoice_items").select("*").order("sort_order"),
    ]);
    setInvoices(invRes.data ?? []);
    setClients(clientRes.data ?? []);
    setProjects(projectRes.data ?? []);
    setItems(itemRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const projectFor = (id: string | null) => projects.find((p) => p.id === id);
  const clientFor = (project: Project | undefined) => clients.find((c) => c.id === project?.client_id);
  const itemsFor = (invoiceId: string) => items.filter((i) => i.invoice_id === invoiceId);

  const lineSubtotal = useMemo(() => {
    return lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unit_price) || 0), 0);
  }, [lines]);
  const lineVat = lineSubtotal * VAT_RATE;

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }]);
  const removeLine = (idx: number) => setLines((prev) => prev.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: keyof typeof emptyLine, value: string) =>
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));

  const save = async () => {
    if (!form.project_id) { toast({ title: "Please select a project", variant: "destructive" }); return; }
    const validLines = lines.filter((l) => l.description.trim() && Number(l.unit_price) >= 0);
    if (validLines.length === 0) { toast({ title: "Add at least one line item", variant: "destructive" }); return; }

    setSaving(true);
    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        project_id: form.project_id,
        status: form.status,
        due_date: form.due_date || null,
        amount: lineSubtotal,
        vat: lineSubtotal * VAT_RATE,
      })
      .select()
      .single();

    if (error || !invoice) {
      toast({ title: "Save failed", description: error?.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    const { error: itemsError } = await supabase.from("invoice_items").insert(
      validLines.map((l, idx) => ({
        invoice_id: invoice.id,
        description: l.description,
        quantity: Number(l.quantity) || 1,
        unit_price: Number(l.unit_price) || 0,
        sort_order: idx,
      }))
    );

    if (itemsError) {
      toast({ title: "Invoice saved, but line items failed", description: itemsError.message, variant: "destructive" });
    } else {
      toast({ title: `Invoice ${invoice.invoice_number} created` });
    }
    setForm(emptyForm);
    setLines([{ ...emptyLine }]);
    setShowForm(false);
    setSaving(false);
    load();
  };

  const remove = async (invoice: Invoice) => {
    if (!confirm(`Delete invoice ${invoice.invoice_number}?`)) return;
    const { error } = await supabase.from("invoices").delete().eq("id", invoice.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Invoice deleted" });
    load();
  };

  const updateStatus = async (invoice: Invoice, status: string) => {
    setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? { ...i, status } : i)));
    await supabase.from("invoices").update({ status }).eq("id", invoice.id);
  };

  const download = async (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    try {
      const project = projectFor(invoice.project_id);
      const client = clientFor(project);
      const invoiceItems = itemsFor(invoice.id);
      const docItems: DocLineItem[] = invoiceItems.length > 0
        ? invoiceItems.map((i) => ({ description: i.description, quantity: Number(i.quantity), unit_price: Number(i.unit_price) }))
        : [{ description: project?.title || "Services rendered", quantity: 1, unit_price: Number(invoice.amount) || 0 }];

      const doc = await generateDocumentPdf({
        kind: "INVOICE",
        number: invoice.invoice_number || invoice.id.slice(0, 8).toUpperCase(),
        issueDate: new Date(invoice.created_at || Date.now()).toLocaleDateString("en-ZA"),
        dueOrExpiryLabel: "Due Date",
        dueOrExpiryDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-ZA") : null,
        status: invoice.status,
        client: {
          name: client?.name || "Client",
          email: client?.email,
          phone: client?.phone,
          address: client?.address,
        },
        project: project ? { project_number: project.project_number, title: project.title } : null,
        items: docItems,
      });
      doc.save(`${invoice.invoice_number || "invoice"}.pdf`);
    } catch (err) {
      toast({ title: "Failed to generate PDF", description: String(err), variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <AdminLayout title="Invoices">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)} className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="h-4 w-4" /> New Invoice
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project</Label>
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
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
              <Label>Due Date</Label>
              <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
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
            <div className="text-right mt-3 space-y-0.5">
              <p className="text-sm text-gray-500">Subtotal: {currency(lineSubtotal)}</p>
              <p className="text-sm text-gray-500">VAT (15%): {currency(lineVat)}</p>
              <p className="font-poppins font-semibold text-primary">Total: {currency(lineSubtotal + lineVat)}</p>
            </div>
          </div>

          <Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Invoice
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : invoices.length === 0 ? (
        <p className="text-gray-500 font-open-sans text-center py-16">No invoices yet.</p>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const project = projectFor(invoice.project_id);
            const client = clientFor(project);
            const total = Number(invoice.amount || 0) + Number(invoice.vat || 0);
            return (
              <div key={invoice.id} className="bg-white rounded-lg shadow p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-poppins font-semibold text-primary">{invoice.invoice_number}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[invoice.status || "Pending"]}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{client?.name ?? "—"} {project ? `• ${project.title}` : ""}</p>
                  <p className="font-semibold text-primary mt-1">{currency(total)} <span className="text-xs text-gray-400 font-normal">(incl. VAT)</span></p>
                </div>
                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <Select value={invoice.status || "Pending"} onValueChange={(v) => updateStatus(invoice, v)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => download(invoice)} disabled={downloadingId === invoice.id}>
                      {downloadingId === invoice.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                      PDF
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => remove(invoice)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInvoices;
