import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, deleteMedia, getMediaUrl } from "@/lib/media";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  services_completed: string | null;
  completion_year: number | null;
  category: string;
  sort_order: number;
}
interface Media {
  id: string;
  project_id: string;
  media_url: string;
  media_type: string;
  phase: "before" | "progress" | "finished";
  sort_order: number;
}

const CATEGORIES = ["Residential", "Commercial", "Renovations", "Other"];
const PHASES: { key: Media["phase"]; label: string }[] = [
  { key: "before", label: "Before" },
  { key: "progress", label: "Progress" },
  { key: "finished", label: "Finished" },
];
const emptyForm = { title: "", location: "", description: "", services_completed: "", completion_year: "", category: "Residential" };

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [projRes, mediaRes] = await Promise.all([
      supabase.from("portfolio_projects").select("*").order("sort_order").order("created_at", { ascending: false }),
      supabase.from("portfolio_media").select("*").order("sort_order"),
    ]);
    const projectList = projRes.data ?? [];
    const mediaList = (mediaRes.data ?? []) as Media[];
    setProjects(projectList);
    setMedia(mediaList);
    const entries = await Promise.all(mediaList.map(async (m) => [m.id, await getMediaUrl(m.media_url)] as const));
    setUrls(Object.fromEntries(entries));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const mediaFor = (projectId: string, phase: Media["phase"]) =>
    media.filter((m) => m.project_id === projectId && m.phase === phase);

  const coverUrl = (projectId: string) => {
    const finished = mediaFor(projectId, "finished")[0];
    const any = finished || media.find((m) => m.project_id === projectId);
    return any ? urls[any.id] : "";
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast({ title: "Please enter a project title", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("portfolio_projects").insert({
      title: form.title,
      location: form.location || null,
      description: form.description || null,
      services_completed: form.services_completed || null,
      completion_year: form.completion_year ? Number(form.completion_year) : null,
      category: form.category,
    });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project added — now upload some photos below" });
      setForm(emptyForm);
      setShowForm(false);
      load();
    }
    setSaving(false);
  };

  const updateField = async (project: Project, field: keyof Project, value: string | number | null) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, [field]: value } : p)));
    await supabase.from("portfolio_projects").update({ [field]: value }).eq("id", project.id);
  };

  const removeProject = async (project: Project) => {
    if (!confirm(`Delete "${project.title}" and all its photos?`)) return;
    const photos = media.filter((m) => m.project_id === project.id);
    await Promise.all(photos.map((m) => deleteMedia(m.media_url)));
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", project.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Project deleted" });
    load();
  };

  const uploadPhoto = async (project: Project, phase: Media["phase"], file: File) => {
    const key = `${project.id}-${phase}`;
    setUploadingKey(key);
    try {
      const path = await uploadMedia(file);
      const media_type = file.type.startsWith("video") ? "video" : "image";
      const sortOrder = mediaFor(project.id, phase).length;
      const { error } = await supabase.from("portfolio_media").insert({
        project_id: project.id, media_url: path, media_type, phase, sort_order: sortOrder,
      });
      if (error) throw error;
      load();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingKey(null);
    }
  };

  const removePhoto = async (item: Media) => {
    await deleteMedia(item.media_url);
    const { error } = await supabase.from("portfolio_media").delete().eq("id", item.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  return (
    <AdminLayout title="Manage Portfolio">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)} className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {showForm && (
        <form onSubmit={createProject} className="bg-white rounded-lg shadow p-6 space-y-4 mb-10">
          <h2 className="text-xl font-poppins font-semibold text-primary">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="e.g. Hayfields, Pietermaritzburg" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
              <Label>Completion Year</Label>
              <Input type="number" placeholder="e.g. 2026" value={form.completion_year} onChange={(e) => setForm({ ...form, completion_year: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Services Completed</Label>
            <Textarea
              placeholder="Comma-separated, e.g. Foundation, Brickwork, Roofing, Plastering, Electrical, Plumbing"
              value={form.services_completed}
              onChange={(e) => setForm({ ...form, services_completed: e.target.value })}
              rows={2}
            />
          </div>
          <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Project
          </Button>
        </form>
      )}

      <h2 className="text-xl font-poppins font-semibold text-primary mb-4">All Projects ({projects.length})</h2>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      ) : projects.length === 0 ? (
        <p className="text-gray-500 font-open-sans">No projects yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const isOpen = expandedId === project.id;
            return (
              <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-construction-light shrink-0">
                    {coverUrl(project.id) ? (
                      <img src={coverUrl(project.id)} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No photos yet</div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-poppins font-semibold text-primary">{project.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {project.category}
                        {project.location ? ` • ${project.location}` : ""}
                        {project.completion_year ? ` • ${project.completion_year}` : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{media.filter((m) => m.project_id === project.id).length} photo(s)</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setExpandedId(isOpen ? null : project.id)}>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {isOpen ? "Close" : "Manage"}
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => removeProject(project)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t p-5 space-y-6 bg-construction-light/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input defaultValue={project.title} onBlur={(e) => updateField(project, "title", e.target.value)} />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input defaultValue={project.location ?? ""} onBlur={(e) => updateField(project, "location", e.target.value || null)} />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select value={project.category} onValueChange={(v) => updateField(project, "category", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Completion Year</Label>
                        <Input
                          type="number"
                          defaultValue={project.completion_year ?? ""}
                          onBlur={(e) => updateField(project, "completion_year", e.target.value ? Number(e.target.value) : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea defaultValue={project.description ?? ""} rows={3} onBlur={(e) => updateField(project, "description", e.target.value || null)} />
                    </div>
                    <div>
                      <Label>Services Completed (comma-separated)</Label>
                      <Textarea defaultValue={project.services_completed ?? ""} rows={2} onBlur={(e) => updateField(project, "services_completed", e.target.value || null)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PHASES.map((phase) => {
                        const photos = mediaFor(project.id, phase.key);
                        const key = `${project.id}-${phase.key}`;
                        return (
                          <div key={phase.key} className="bg-white rounded-lg p-3 border">
                            <p className="font-poppins font-semibold text-sm text-primary mb-2">{phase.label} Photos</p>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {photos.map((m) => (
                                <div key={m.id} className="relative aspect-square rounded overflow-hidden bg-construction-light group">
                                  {m.media_type === "video" ? (
                                    <video src={urls[m.id]} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={urls[m.id]} className="w-full h-full object-cover" />
                                  )}
                                  <button
                                    onClick={() => removePhoto(m)}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <label className="flex items-center justify-center gap-1 text-xs text-accent border border-dashed border-accent/50 rounded p-2 cursor-pointer hover:bg-accent/5">
                              {uploadingKey === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                              Add photo
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) uploadPhoto(project, phase.key, f);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPortfolio;
