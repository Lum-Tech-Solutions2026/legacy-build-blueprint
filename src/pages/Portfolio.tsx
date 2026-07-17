import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getMediaUrl } from "@/lib/media";
import { Loader2, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  media_url: string;
  media_type: string;
}

const CATEGORIES = ["All", "Residential", "Commercial", "Renovations", "Other"];

const Portfolio = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<Item | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("id, title, description, category, media_url, media_type")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      const list = data ?? [];
      setItems(list);
      const entries = await Promise.all(
        list.map(async (i) => [i.id, await getMediaUrl(i.media_url)] as const)
      );
      setUrls(Object.fromEntries(entries));
      setLoading(false);
    };
    load();
  }, []);

  const openLightbox = async (item: Item) => {
    setLightbox(item);
    setLightboxUrl(urls[item.id] || (await getMediaUrl(item.media_url)));
  };

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

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
            <div className="w-24 h-1 bg-accent mx-auto mb-8" />
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
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openLightbox(item)}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-construction-light text-left"
                  >
                    {item.media_type === "video" ? (
                      <>
                        <video src={urls[item.id]} className="w-full h-full object-cover" muted preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </>
                    ) : (
                      <img src={urls[item.id]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4">
                      <span className="text-xs text-accent font-poppins uppercase tracking-wide">{item.category}</span>
                      <h3 className="text-white font-poppins font-semibold">{item.title}</h3>
                    </div>
                  </button>
                ))}
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

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}>
            <X className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.media_type === "video" ? (
              <video src={lightboxUrl} controls autoPlay className="w-full max-h-[80vh] rounded-lg" />
            ) : (
              <img src={lightboxUrl} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
            )}
            <div className="text-center mt-4">
              <h3 className="text-white font-poppins font-bold text-xl">{lightbox.title}</h3>
              {lightbox.description && <p className="text-gray-300 font-open-sans mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
