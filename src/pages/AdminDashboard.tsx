import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  TrendingUp,
  FolderKanban,
  Wallet,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Lead {
  id: string;
  status: string;
  created_at: string;
  estimated_value: number | null;
}
interface Project {
  id: string;
  status: string;
  budget: number;
}
interface Payment {
  id: string;
  amount: number;
  paid_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#94a3b8",
  contacted: "#60a5fa",
  quoted: "#fbbf24",
  won: "#22c55e",
  lost: "#ef4444",
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-start gap-4">
    <div className="bg-accent/10 text-accent rounded-lg p-3">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-open-sans">{label}</p>
      <p className="text-2xl font-poppins font-bold text-primary">{value}</p>
      {sub && <p className="text-xs text-gray-400 font-open-sans mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [leadsRes, projectsRes, paymentsRes] = await Promise.all([
        supabase.from("leads").select("id,status,created_at,estimated_value"),
        supabase.from("projects").select("id,status,budget"),
        supabase.from("payments").select("id,amount,paid_at"),
      ]);
      setLeads(leadsRes.data ?? []);
      setProjects(projectsRes.data ?? []);
      setPayments(paymentsRes.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;
    const won = leads.filter((l) => l.status === "won").length;
    const lost = leads.filter((l) => l.status === "lost").length;
    const decided = won + lost;
    const conversionRate = decided > 0 ? Math.round((won / decided) * 100) : 0;
    const activeProjects = projects.filter((p) => p.status === "in_progress").length;
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalBudget = projects
      .filter((p) => p.status !== "cancelled")
      .reduce((sum, p) => sum + Number(p.budget), 0);
    const outstanding = Math.max(totalBudget - totalRevenue, 0);
    return { totalLeads, newThisWeek, conversionRate, activeProjects, totalRevenue, outstanding };
  }, [leads, projects, payments]);

  const leadsOverTime = useMemo(() => {
    const days: Record<string, number> = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-ZA", { month: "short", day: "numeric" });
      days[key] = 0;
    }
    leads.forEach((l) => {
      const d = new Date(l.created_at);
      const key = d.toLocaleDateString("en-ZA", { month: "short", day: "numeric" });
      if (key in days) days[key] += 1;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [leads]);

  const leadsByStatus = useMemo(() => {
    const counts: Record<string, number> = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
    leads.forEach((l) => {
      if (l.status in counts) counts[l.status] += 1;
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([status, value]) => ({ name: status, value }));
  }, [leads]);

  const revenueByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
      months[key] = 0;
    }
    payments.forEach((p) => {
      const d = new Date(p.paid_at);
      const key = d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
      if (key in months) months[key] += Number(p.amount);
    });
    return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
  }, [payments]);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Leads" value={String(stats.totalLeads)} sub={`${stats.newThisWeek} new this week`} />
        <StatCard icon={TrendingUp} label="Conversion Rate" value={`${stats.conversionRate}%`} sub="Leads won vs. decided" />
        <StatCard icon={FolderKanban} label="Active Projects" value={String(stats.activeProjects)} sub={`${projects.length} total projects`} />
        <StatCard icon={Wallet} label="Revenue Collected" value={currency(stats.totalRevenue)} sub={`${currency(stats.outstanding)} outstanding`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
          <h2 className="font-poppins font-semibold text-primary mb-4">Leads — last 30 days</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(158 64% 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-poppins font-semibold text-primary mb-4">Leads by status</h2>
          {leadsByStatus.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No leads yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={leadsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {leadsByStatus.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] ?? "#94a3b8"} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5 lg:col-span-3">
          <h2 className="font-poppins font-semibold text-primary mb-4">Revenue — last 6 months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R${v / 1000}k`} />
              <Tooltip formatter={(v: number) => currency(v)} />
              <Bar dataKey="revenue" fill="hsl(214 70% 16%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
