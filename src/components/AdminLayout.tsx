import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  FolderKanban,
  Image as ImageIcon,
  Newspaper,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "@/assets/lumtech-logo-dark.png";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Leads", path: "/admin/leads", icon: Users },
  { name: "Clients", path: "/admin/clients", icon: UserSquare2 },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Portfolio", path: "/admin/portfolio", icon: ImageIcon },
  { name: "Blog", path: "/admin/blog", icon: Newspaper },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <img src={logo} alt="Lum Tech" className="h-11 w-auto" />
        <div>
          <p className="font-poppins font-bold text-sm leading-tight">Lum Tech</p>
          <p className="text-xs text-gray-400 leading-tight">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-poppins text-sm transition-colors ${
                isActive(item.path)
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        {user?.email && (
          <p className="px-3 pb-2 text-xs text-gray-400 truncate">{user.email}</p>
        )}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md font-poppins text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        <Link
          to="/"
          className="block px-3 pt-2 text-xs text-gray-500 hover:text-accent transition-colors"
        >
          ← Back to website
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-construction-light flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Lum Tech" className="h-9 w-auto" />
          <span className="font-poppins font-semibold text-sm">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute top-0 left-0 bottom-0 w-64 bg-primary text-white flex flex-col pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
