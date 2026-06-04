# Blog, Portfolio, Footer Links & Vision/Mission

## 1. Vision & Mission
- **About page**: Add a professional "Our Vision & Mission" section (two cards) styled with navy/gold accents, after the Our Story section.
- **Footer**: Add a concise one-line mission statement under the company description.

## 2. Footer & nav links
- Add **Blog** and **Portfolio** links to header navigation and footer Quick Links.
- Make footer "Our Services" list items link to `/services`.
- Verify all existing links resolve.

## 3. Authentication (shared by blog + portfolio admin)
- `/auth` page: email/password + Google sign-in/sign-up.
- `profiles` table (auto-created on signup), `user_roles` table with `app_role` enum (`admin`, `user`) + `has_role()` security-definer function. Roles kept separate to prevent privilege escalation.
- `ProtectedRoute` wrapper for admin pages (admin role required).
- First admin: after you sign up, I'll grant your account the `admin` role.

## 4. Blog (database-backed, admin managed)
### Routes
- `/blog` — public list of published posts.
- `/blog/:slug` — single post.
- `/admin/blog` — admin create / edit / publish / delete posts.
### Data
- `blog_posts` table: title, slug, excerpt, content, cover image URL, published, author id, timestamps.
- RLS: anyone reads published posts; only admins write/delete.
- Seed 2–3 professionally written sample posts.

## 5. Portfolio / Our Work (images + videos, admin managed)
### Routes
- `/portfolio` — public gallery grid of projects with photos and videos (filter by category, e.g. Residential, Commercial, Renovations).
- `/admin/portfolio` — admin add / delete portfolio items, upload images and videos.
### Data
- `portfolio_items` table: title, description, category, media URL, media type (image/video), thumbnail URL, sort order, timestamps.
- RLS: anyone can read; only admins write/delete.
### Storage
- A storage bucket for portfolio media (images + videos) and blog cover images, with admin-only upload/delete policies and public read.
- Gallery renders images in a lightbox and videos in an inline player.

## Technical notes
- Tech: React + react-router + Lovable Cloud (Supabase) already configured.
- Roles in dedicated `user_roles` table, checked via `has_role()` — never on profiles.
- New components/pages: `Auth`, `ProtectedRoute`, `Blog`, `BlogPost`, `AdminBlog`, `Portfolio`, `AdminPortfolio`.
- All styling uses existing semantic tokens (navy primary, gold accent), Poppins/Open Sans.
- Client-side + RLS validation; admin uploads validated for file type/size.

## Open follow-up
After build, sign up once so I can promote your account to admin; then you can manage blog posts and portfolio media.
