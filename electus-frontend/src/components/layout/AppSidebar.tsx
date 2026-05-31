import { LayoutDashboard, Upload, BarChart3, User, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Batch Upload", url: "/upload", icon: Upload },
  { title: "Statistics", url: "/statistics", icon: BarChart3 },
  { title: "Account", url: "/account", icon: User },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("electus-token");
    if (token) {
      try {
        await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Failed to revoke session on backend", err);
      }
    }
    localStorage.removeItem("electus-token");
    localStorage.removeItem("electus-user-name");
    localStorage.removeItem("electus-user-email");
    navigate("/login");
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col glass-sidebar">
        {/* Logo */}
        <div className="flex flex-col gap-1 px-5 py-6 border-b border-foreground/[0.06]">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="Electus Logo" className="h-10 w-auto object-contain rounded-md" />
          </div>
          <span className="text-[11px] font-medium text-foreground/40 tracking-wide uppercase">
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/50 transition-all hover:bg-foreground/[0.06] hover:text-foreground/80"
              activeClassName="bg-foreground/[0.08] text-foreground font-semibold shadow-[inset_0_1px_0_var(--glass-border)] glow-teal"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-foreground/[0.06] px-3 py-4 flex flex-col gap-2">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
          <p className="text-[11px] text-foreground/40 px-3">
            © 2026 Electus ATS
          </p>
        </div>
      </aside>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="glass-strong border border-foreground/[0.08] bg-background/80 backdrop-blur-xl dark">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirm Log Out</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/60">
              Are you sure you want to log out? This will end your active session on this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground hover:bg-foreground/[0.08]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
