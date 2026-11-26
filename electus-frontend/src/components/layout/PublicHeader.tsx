import { Link } from "react-router-dom";
import { LayoutDashboard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function PublicHeader() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <header className="public-header">
      <Link to="/" className="public-brand"><span className="brand-mark"><LayoutDashboard size={17} /></span>Electus</Link>
      <nav aria-label="Site navigation" className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
        <Button variant="outline" size="icon" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
          {dark ? <Sun /> : <Moon />}
        </Button>
      </nav>
    </header>
  );
}
