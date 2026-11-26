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
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true"><LayoutDashboard size={17} /></span>
          <span>Electus</span>
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation" className="sidebar-navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end
              title={item.title}
              className="sidebar-link"
              activeClassName="sidebar-link-active"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setShowLogoutDialog(true)} aria-label="Log out" className="sidebar-link">
            <LogOut className="h-4 w-4" /> <span>Log out</span>
          </button>
        </div>
      </aside>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="glass-strong border border-foreground/[0.08] bg-background backdrop-blur-xl">
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
