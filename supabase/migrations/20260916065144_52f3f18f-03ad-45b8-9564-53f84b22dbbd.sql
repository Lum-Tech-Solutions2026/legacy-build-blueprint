
CREATE TABLE public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE SEQUENCE public.project_number_seq;
CREATE TABLE public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  project_number text default ('PRJ-' || lpad(nextval('public.project_number_seq')::text, 4, '0')),
  title text not null,
  description text,
  status text not null default 'quoted',
  budget numeric not null default 0,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  project_type text,
  message text,
  source text not null default 'website',
  status text not null default 'new',
  estimated_value numeric,
  notes text,
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.construction_payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  amount numeric not null default 0,
  type text not null default 'deposit',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

CREATE SEQUENCE public.quote_number_seq;
CREATE TABLE public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  quote_number text default ('QUO-' || lpad(nextval('public.quote_number_seq')::text, 4, '0')),
  description text,
  amount numeric default 0,
  status text default 'Draft',
  expiry_date date,
  pdf_url text,
  last_sent_at timestamptz,
  last_sent_channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null default '',
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

CREATE SEQUENCE public.invoice_number_seq;
CREATE TABLE public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  invoice_number text default ('INV-' || lpad(nextval('public.invoice_number_seq')::text, 4, '0')),
  amount numeric default 0,
  vat numeric default 0,
  status text default 'Pending',
  due_date date,
  pdf_url text,
  last_sent_at timestamptz,
  last_sent_channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null default '',
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

CREATE TABLE public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  description text,
  services_completed text,
  completion_year integer,
  category text not null default 'Residential',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.portfolio_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image',
  phase text not null default 'finished',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

CREATE TABLE public.tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  type text not null default 'general',
  title text not null,
  notes text,
  status text not null default 'open',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

CREATE TABLE public.automation_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete cascade,
  step text not null,
  channel text,
  status text not null,
  detail text,
  created_at timestamptz not null default now()
);

CREATE TABLE public.message_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  channel text not null,
  subject text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key, channel)
);

CREATE TABLE public.app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

CREATE TABLE public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients, public.projects, public.leads,
  public.construction_payments, public.quotes, public.quote_items, public.invoices,
  public.invoice_items, public.portfolio_projects, public.portfolio_media, public.tasks,
  public.automation_log, public.message_templates, public.app_settings, public.push_subscriptions
  TO authenticated;
GRANT ALL ON public.clients, public.projects, public.leads, public.construction_payments,
  public.quotes, public.quote_items, public.invoices, public.invoice_items,
  public.portfolio_projects, public.portfolio_media, public.tasks, public.automation_log,
  public.message_templates, public.app_settings, public.push_subscriptions TO service_role;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT ON public.portfolio_projects, public.portfolio_media TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.project_number_seq, public.quote_number_seq, public.invoice_number_seq TO authenticated, service_role, anon;

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage payments" ON public.construction_payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage quotes" ON public.quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage quote items" ON public.quote_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage invoice items" ON public.invoice_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view portfolio projects" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage portfolio projects" ON public.portfolio_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view portfolio media" ON public.portfolio_media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage portfolio media" ON public.portfolio_media FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage tasks" ON public.tasks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view automation log" ON public.automation_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage templates" ON public.message_templates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage settings" ON public.app_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users manage own push subscriptions" ON public.push_subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at triggers
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
