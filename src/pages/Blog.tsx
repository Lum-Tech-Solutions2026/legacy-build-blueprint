import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getMediaUrl } from "@/lib/media";
import { Loader2, Calendar, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      const list = data ?? [];
      setPosts(list);
      const entries = await Promise.all(
        list.map(async (p) => [p.id, await getMediaUrl(p.cover_image_url)] as const)
      );
      setCovers(Object.fromEntries(entries));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Our Blog</h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-8" />
            <p className="text-xl font-open-sans text-gray-200">
              Insights, project stories, and construction tips from the Lum Tech Building Solutions team.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-500 font-open-sans py-20">No articles published yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border"
                  >
                    <div className="aspect-video bg-construction-light overflow-hidden">
                      {covers[post.id] ? (
                        <img src={covers[post.id]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-poppins">Lum Tech</div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-400 mb-3 gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.created_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                      <h2 className="text-xl font-poppins font-bold text-primary mb-2 group-hover:text-accent transition-colors">{post.title}</h2>
                      <p className="font-open-sans text-gray-600 line-clamp-3">{post.excerpt}</p>
                      <span className="inline-flex items-center text-accent font-poppins font-semibold mt-4">
                        Read more <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
