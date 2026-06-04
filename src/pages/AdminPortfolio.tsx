import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, deleteMedia, getMediaUrl } from "@/lib/media";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, LogOut } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/lumtech-logo.png";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  media_url: string;
  media_type: string;
}

const CATEGORIES = ["Residential", "Commercial", "Renovations", "Other"];
const empty = { title: "", description: "", category: "Residential" };

const AdminPortfolio = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("created_at", { ascending: false });
    const list = data ?? [];
    setItems(list);
    const entries = await Promise.all(list.map(async (i) => [i.id, await getMediaUrl(i.media_url)] as const));
    setThumbs(Object.fromEntries(entries));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast({ title: "Please choose an image or video", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const path = await uploadMedia(file);
      const media_type = file.type.startsWith("video") ? "video" : "image";
      const { error } = await supabase.from("portfolio_items").insert({
        title: form.title,
        description: form.description,
        category: form.category,
        media_url: path,
        media_type,
      });
      if (error) throw error;
      toast({ title: "Project added" });
      setForm(empty);
      setFile(null);
      (document.getElementById("media-file") as HTMLInputElement).value = "";
      load();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await deleteMedia(item.media_url);
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Project deleted" });
    load();
  };

  return (
    <div className="min-h-screen bg-construction-light">
      <header className="bg-primary text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/"><img src={logo} alt="logo" className="h-10 w-auto bg-white rounded p-1" /></Link>
          <nav className="flex items-center gap-4 font-poppins text-sm">
            <Link to="/admin/blog" className="hover:text-accent">Blog</Link>
            <Link to="/admin/portfolio" className="text-accent font-semibold">Portfolio</Link>
            <button onClick={signOut} className="flex items-center gap-1 hover:text-accent"><LogOut className="h-4 w-4" /> Sign out</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-6">Manage Portfolio</h1>

        <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4 mb-10">
          <h2 className="text-xl font-poppins font-semibold text-primary flex items-center gap-2">
            <Plus className="h-5 w-5 text-accent" /> Add Project
          </h2>
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image or Video</Label>
            <Input id="media-file" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
          </div>
          <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Project
          </Button>
        </form>

        <h2 className="text-xl font-poppins font-semibold text-primary mb-4">All Projects</h2>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        ) : items.length === 0 ? (
          <p className="text-gray-500 font-open-sans">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-video bg-construction-light">
                  {item.media_type === "video" ? (
                    <video src={thumbs[item.id]} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={thumbs[item.id]} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-poppins font-semibold text-primary">{item.title}</p>
                    <span className="text-xs text-accent uppercase">{item.category} · {item.media_type}</span>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => remove(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPortfolio;
