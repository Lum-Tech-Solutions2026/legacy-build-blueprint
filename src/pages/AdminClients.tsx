import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Plus, Phone, Mail, MapPin, FolderKanban } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

const empty = { name: "", email: "", phone: "", address: "", notes: "" };

const AdminClients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load clients", description: error.message, variant: "destructive" });
    } else {
      setClients(data ?? []);
      const { data: projects } = await supabase.from("projects").select("client_id");
      const counts: Record<string, number> = {};
      (projects ?? []).forEach((p) => { counts[p.client_id] = (counts[p.client_id] ?? 0) + 1; });
      setProjectCounts(counts);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("clients").insert(form);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Client added" });
      setForm(empty);
      setShowForm(false);
      load();
    }
    setSaving(false);
  };

  const remove = async (client: Client) => {
    if (!confirm(`Delete client "${client.name}"? This will also remove their projects.`)) return;
    const { error } = await supabase.from("clients").delete().eq("id", client.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Client deleted" });
    load();
  };

  return (
    <AdminLayout title="Clients">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)} className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
          </div>
          <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Client
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : clients.length === 0 ? (
        <p className="text-gray-500 font-open-sans text-center py-16">No clients yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex items-start justify-between">
                <p className="font-poppins font-semibold text-primary">{client.name}</p>
                <Button size="icon" variant="outline" onClick={() => remove(client)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-1.5 mt-3 text-sm text-gray-600">
                {client.phone && <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {client.phone}</p>}
                {client.email && <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {client.email}</p>}
                {client.address && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {client.address}</p>}
              </div>
              <Link
                to="/admin/projects"
                className="inline-flex items-center gap-1 mt-4 text-sm text-accent hover:underline"
              >
                <FolderKanban className="h-3.5 w-3.5" />
                {projectCounts[client.id] ?? 0} project{(projectCounts[client.id] ?? 0) === 1 ? "" : "s"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClients;
