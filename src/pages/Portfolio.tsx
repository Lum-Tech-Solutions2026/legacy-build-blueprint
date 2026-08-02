import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getMediaUrl } from "@/lib/media";
import { Loader2, Play, X, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

interface Project {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  services_completed: string | null;
  completion_year: number | null;
  category: string;
}
interface Media {
  id: string;
  project_id: string;
  media_url: string;
  media_type: string;
  phase: "before" | "progress" | "finished";
}

const CATEGORIES = ["All", "Residential", "Commercial", "Renovations", "Other"];
const PHASE_LABELS: Record<Media["phase"], string> = { before: "Before", progress: "Progress", finished: "Finished" };

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<{ url: string; type: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const [projRes, mediaRes] = await Promise.all([
        supabase.from("portfolio_projects").select("id, title, location, description, services_completed, completion_year, category").order("sort_order").order("created_at", { ascending: false }),
        supabase.from("portfolio_media").select("id, project_id, media_url, media_type, phase").order("sort_order"),
      ]);
      const projectList = projRes.data ?? [];
      const mediaList = (mediaRes.data ?? []) as Media[];
      setProjects(projectList);
      setMedia(mediaList);
      const entries = await Promise.all(mediaList.map(async (m) => [m.id, await getMediaUrl(m.media_url)] as const));
      setUrls(Object.fromEntries(entries));
      setLoading(false);
    };
    load();
  }, []);

  const mediaForProject = (projectId: string) => media.filter((m) => m.project_id === projectId);
  const coverFor = (projectId: string) => {
    const items = mediaForProject(projectId);
    const finished = items.find((m) => m.phase === "finished");
    return finished || items[0];
  };

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const servicesList = (services: string | null) =>
    (services ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen">
      <SEO
        title="Our Portfolio"
        description="Browse completed residential and commercial construction and renovation projects by Lum Tech Building Solutions in KZN."
        path="/portfolio"
      />
      <Header />
      <main>
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Our Work</h1>
            <div className="w-24 h-1 bg-construction-blue mx-auto mb-8" />
            <p className="text-xl font-open-sans text-gray-200">
              A showcase of completed projects across KwaZulu-Natal — built with quality and care.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full font-poppins font-medium text-sm transition-colors ${
                    filter === cat ? "bg-accent text-accent-foreground" : "bg-construction-light text-gray-600 hover:bg-accent/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-500 font-open-sans py-20">No projects to show yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project) => {
                  const cover = coverFor(project.id);
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelected(project)}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-construction-light text-left"
                    >
                      {cover?.media_type === "video" ? (
                        <>
                          <video src={urls[cover.id]} className="w-full h-full object-cover" muted preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </>
                      ) : cover ? (
                        <img src={urls[cover.id]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No photo yet</div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4">
                        <span className="text-xs text-accent font-poppins uppercase tracking-wide">{project.category}</span>
                        <h3 className="text-white font-poppins font-semibold">{project.title}</h3>
                        <div className="flex items-center gap-3 text-gray-300 text-xs mt-1">
                          {project.location && (
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span>
                          )}
                          {project.completion_year && (
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.completion_year}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-16">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold px-8 py-3">
                <Link to="/contact">Start Your Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto p-4" onClick={() => setSelected(null)}>
          <div className="max-w-4xl w-full mx-auto bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-accent font-poppins uppercase tracking-wide">{selected.category}</span>
                <h2 className="text-2xl font-poppins font-bold text-primary">{selected.title}</h2>
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  {selected.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{selected.location}</span>}
                  {selected.completion_year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{selected.completion_year}</span>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 shrink-0">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selected.description && (
                <p className="font-open-sans text-gray-600 leading-relaxed">{selected.description}</p>
              )}

              {servicesList(selected.services_completed).length > 0 && (
                <div>
                  <h3 className="font-poppins font-semibold text-primary mb-2">Services Completed</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {servicesList(selected.services_completed).map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                        <span className="font-open-sans text-gray-600 text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(["before", "progress", "finished"] as const).map((phase) => {
                const items = mediaForProject(selected.id).filter((m) => m.phase === phase);
                if (items.length === 0) return null;
                return (
                  <div key={phase}>
                    <h3 className="font-poppins font-semibold text-primary mb-2">{PHASE_LABELS[phase]}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {items.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setLightboxUrl({ url: urls[m.id], type: m.media_type })}
                          className="aspect-square rounded-lg overflow-hidden bg-construction-light"
                        >
                          {m.media_type === "video" ? (
                            <video src={urls[m.id]} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={urls[m.id]} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {mediaForProject(selected.id).length === 0 && (
                <p className="text-gray-400 text-sm">No photos uploaded for this project yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxUrl(null)}>
            <X className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightboxUrl.type === "video" ? (
              <video src={lightboxUrl.url} controls autoPlay className="w-full max-h-[85vh] rounded-lg" />
            ) : (
              <img src={lightboxUrl.url} className="w-full max-h-[85vh] object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
