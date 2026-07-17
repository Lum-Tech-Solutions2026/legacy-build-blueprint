import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getMediaUrl } from "@/lib/media";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, content, cover_image_url, created_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost(data);
      if (data?.cover_image_url) setCover(await getMediaUrl(data.cover_image_url));
      setLoading(false);
    };
    load();
  }, [slug]);

  return (
    <div className="min-h-screen">
      {post ? (
        <SEO
          title={post.title}
          description={post.excerpt || post.content.slice(0, 155)}
          path={`/blog/${slug}`}
          image={cover || undefined}
        />
      ) : (
        <SEO title="Blog" description="Lum Tech Building Solutions blog" path={`/blog/${slug}`} noIndex />
      )}
      <Header />
      <main>
        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : !post ? (
          <div className="py-32 text-center">
            <h1 className="text-2xl font-poppins font-bold text-primary mb-4">Article not found</h1>
            <Link to="/blog" className="text-accent font-semibold hover:underline">Back to blog</Link>
          </div>
        ) : (
          <article className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <Link to="/blog" className="inline-flex items-center text-accent font-poppins font-semibold mb-6">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to blog
              </Link>
              <div className="flex items-center text-sm text-gray-400 mb-4 gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.created_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <h1 className="text-3xl md:text-5xl font-poppins font-bold text-primary mb-6">{post.title}</h1>
              {cover && <img src={cover} alt={post.title} className="w-full rounded-lg mb-8 aspect-video object-cover" />}
              <div className="prose max-w-none font-open-sans text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {post.content}
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
