import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { uploadMedia, deleteMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Pencil, Plus, LogOut, Image as ImageIcon } from "lucide-react";
import logo from "@/assets/lumtech-logo.png";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const empty = { title: "", slug: "", excerpt: "", content: "", published: false, cover_image_url: "" };

const AdminBlog = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => { setForm(empty); setEditingId(null); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadMedia(file);
      setForm((f) => ({ ...f, cover_image_url: path }));
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      published: form.published,
      cover_image_url: form.cover_image_url || null,
      author_id: user?.id,
    };
    try {
      if (editingId) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Post updated" });
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast({ title: "Post created" });
      }
      reset();
      load();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const edit = (p: Post) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content,
      published: p.published,
      cover_image_url: p.cover_image_url ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (p: Post) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await deleteMedia(p.cover_image_url);
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Post deleted" });
    load();
  };

  return (
    <div className="min-h-screen bg-construction-light">
      <header className="bg-primary text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/"><img src={logo} alt="logo" className="h-10 w-auto bg-white rounded p-1" /></Link>
          <nav className="flex items-center gap-4 font-poppins text-sm">
            <Link to="/admin/blog" className="text-accent font-semibold">Blog</Link>
            <Link to="/admin/portfolio" className="hover:text-accent">Portfolio</Link>
            <button onClick={signOut} className="flex items-center gap-1 hover:text-accent"><LogOut className="h-4 w-4" /> Sign out</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-poppins font-bold text-primary mb-6">Manage Blog</h1>

        <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4 mb-10">
          <h2 className="text-xl font-poppins font-semibold text-primary flex items-center gap-2">
            <Plus className="h-5 w-5 text-accent" /> {editingId ? "Edit Post" : "New Post"}
          </h2>
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title) || "auto-generated"} />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required />
          </div>
          <div>
            <Label>Cover Image</Label>
            <div className="flex items-center gap-3">
              <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
              {uploading && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
              {form.cover_image_url && !uploading && <ImageIcon className="h-5 w-5 text-accent" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label>Published</Label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId && <Button type="button" variant="outline" onClick={reset}>Cancel</Button>}
          </div>
        </form>

        <h2 className="text-xl font-poppins font-semibold text-primary mb-4">All Posts</h2>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        ) : posts.length === 0 ? (
          <p className="text-gray-500 font-open-sans">No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-poppins font-semibold text-primary">{p.title}</p>
                  <span className={`text-xs font-medium ${p.published ? "text-accent" : "text-gray-400"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => edit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" onClick={() => remove(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBlog;
