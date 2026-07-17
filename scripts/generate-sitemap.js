// Runs before `vite build` to generate public/sitemap.xml.
// Includes all static pages plus published blog posts (portfolio items
// don't have individual detail pages today, so they aren't listed
// separately - the /portfolio page itself is included below).
import { writeFileSync } from "fs";

const SITE_URL = "https://building.lumtechsolutions.co.za";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.8", changefreq: "monthly" },
  { path: "/portfolio", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];

async function fetchPublishedSlugs() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Missing Supabase env vars - sitemap will only include static pages.");
    return [];
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,created_at&published=eq.true`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Could not fetch blog posts for sitemap:", err.message);
    return [];
  }
}

const posts = await fetchPublishedSlugs();

const urls = [
  ...staticPages.map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ),
  ...posts.map(
    (post) => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.created_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  ),
].join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml generated with ${staticPages.length} static pages + ${posts.length} blog posts.`);
