import { LayoutDashboard, Search, Upload, BarChart3, User, LogOut } from "lucide-react";
import LiquidGlassExpandableSidebar from "@/components/ui/liquid-glass-expandable-sidebar";
import { useLocation, useNavigate } from "react-router-dom";
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
  { title: "Search", url: "/search", icon: Search },
  { title: "Batch Upload", url: "/upload", icon: Upload },
  { title: "Statistics", url: "/statistics", icon: BarChart3 },
  { title: "Account", url: "/account", icon: User },
];

const groups = [{
  label: "Workspace",
  items: navItems.map(({ title, url, icon: Icon }) => ({
    id: url, href: url, label: title, icon: <Icon />,
  })),
}];

export function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return false;
    return localStorage.getItem("electus-sidebar-expanded") !== "false";
  });
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
      <aside className="electus-sidebar">
        <LiquidGlassExpandableSidebar
          brand="Electus"
          brandIcon={<img src="/Logo.png" alt="" />}
          groups={groups}
          activeId={pathname.replace(/\/$/, "")}
          expanded={expanded}
          onExpandedChange={next => {
            setExpanded(next);
            if (!window.matchMedia("(max-width: 767px)").matches) {
              localStorage.setItem("electus-sidebar-expanded", String(next));
            }
          }}
          onNavigate={(item, event) => {
            event.preventDefault();
            navigate(item.href);
          }}
          footer={<button type="button" aria-label="Log out" title="Log out"
            onClick={() => setShowLogoutDialog(true)}>
            <LogOut aria-hidden="true" /> <span className="gn-sidebar-label">Log out</span>
          </button>}
        />
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
