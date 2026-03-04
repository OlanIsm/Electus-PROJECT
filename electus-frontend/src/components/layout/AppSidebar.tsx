import { LayoutDashboard, Upload, BarChart3, User, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Batch Upload", url: "/upload", icon: Upload },
  { title: "Statistics", url: "/statistics", icon: BarChart3 },
  { title: "Account", url: "/account", icon: User },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col glass-sidebar">
      {/* Logo */}
      <div className="flex flex-col gap-1 px-5 py-6 border-b border-white/[0.06]">
        <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-medium opacity-80" />
          ELECTUS
        </span>
        <span className="text-[11px] font-medium text-white/40 tracking-wide uppercase">
          AI-Powered ATS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/[0.06] hover:text-white/80"
            activeClassName="bg-white/[0.08] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] glow-teal"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-5 py-4">
        <p className="text-[11px] text-white/25">
          © 2026 Electus ATS
        </p>
      </div>
    </aside>
  );
}
