import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

import { useTheme } from "@/components/ThemeProvider";

const themes = ["light", "dark", "system"] as const;

export default function Account() {
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState(() => localStorage.getItem('electus-user-name') || '');
  const [saved, setSaved] = useState(false);

  const [cultureR, setCultureR] = useState(() => {
    const val = localStorage.getItem('electus-culture-R');
    return val ? parseInt(val) : 20;
  });
  const [cultureI, setCultureI] = useState(() => {
    const val = localStorage.getItem('electus-culture-I');
    return val ? parseInt(val) : 30;
  });
  const [cultureA, setCultureA] = useState(() => {
    const val = localStorage.getItem('electus-culture-A');
    return val ? parseInt(val) : 25;
  });
  const [cultureS, setCultureS] = useState(() => {
    const val = localStorage.getItem('electus-culture-S');
    return val ? parseInt(val) : 5;
  });
  const [cultureE, setCultureE] = useState(() => {
    const val = localStorage.getItem('electus-culture-E');
    return val ? parseInt(val) : 15;
  });
  const [cultureC, setCultureC] = useState(() => {
    const val = localStorage.getItem('electus-culture-C');
    return val ? parseInt(val) : 5;
  });

  const handleSave = () => {
    localStorage.setItem('electus-user-name', fullName);
    localStorage.setItem('electus-culture-R', cultureR.toString());
    localStorage.setItem('electus-culture-I', cultureI.toString());
    localStorage.setItem('electus-culture-A', cultureA.toString());
    localStorage.setItem('electus-culture-S', cultureS.toString());
    localStorage.setItem('electus-culture-E', cultureE.toString());
    localStorage.setItem('electus-culture-C', cultureC.toString());
    
    // Combine into target string
    const targetStr = `R:${cultureR},I:${cultureI},A:${cultureA},S:${cultureS},E:${cultureE},C:${cultureC}`;
    localStorage.setItem('electus-culture-target', targetStr);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetCultureToDefault = () => {
    setCultureR(20);
    setCultureI(30);
    setCultureA(25);
    setCultureS(5);
    setCultureE(15);
    setCultureC(5);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="workspace-title">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Manage your profile, display, and screening preferences.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Card 1: Profile & Organization */}
        <div className="border bg-card rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
            <p className="text-sm text-foreground/60">Update your personal details and organization info.</p>
          </div>
          <div className="px-6 pb-6">
            <div className="flex gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <Avatar className="h-20 w-20 border-2 border-foreground/[0.1]">
                  <AvatarFallback className="bg-foreground/[0.06] text-foreground text-xl font-semibold">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Fields */}
              <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Full Name
                  </Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="glass-input border-foreground/[0.08] bg-foreground/[0.04] text-foreground" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email Address
                  </Label>
                  <Input id="email" readOnly value={localStorage.getItem("electus-user-email") || ""} placeholder="Unavailable" className="glass-input border-foreground/[0.08] bg-foreground/[0.04] text-foreground" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              {saved && <span className="text-sm text-primary font-medium animate-fade-in">✓ Saved!</span>}
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Card 2: App Preferences */}
        <div className="border bg-card rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-foreground">Preferences & Display</h3>
            <p className="text-sm text-foreground/60">Choose a theme for this device.</p>
          </div>
          <div className="px-6 pb-6 space-y-6">
            {/* Theme Selector */}
            <div className="space-y-2.5">
              <Label className="text-xs text-foreground/60">Theme</Label>
              <div className="inline-flex rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-1 gap-0.5">
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    aria-pressed={theme === t}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                      theme === t
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground/70 hover:bg-foreground/[0.05]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Card 2.5: Target Company Culture */}
        <div className="border bg-card rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Target Company Culture</h3>
                <p className="text-sm text-foreground/60">Define the ideal RIASEC Holland Code distribution for culture fit assessment.</p>
              </div>
              <Button variant="outline" size="sm" onClick={resetCultureToDefault} className="text-xs glass-btn border-foreground/[0.08] hover:text-primary">
                <Sparkles className="h-3 w-3 mr-1" /> Reset to Default Startup Profile
              </Button>
            </div>
          </div>
          <div className="px-6 pb-6 space-y-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {/* R - Builder */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground/80">Builder (Realistic - R)</span>
                  <span className="text-primary">{cultureR}%</span>
                </div>
                <Slider value={[cultureR]} onValueChange={(val) => setCultureR(val[0])} max={100} step={5} className="py-2" />
              </div>

              {/* I - Thinker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground/80">Thinker (Investigative - I)</span>
                  <span className="text-primary">{cultureI}%</span>
                </div>
                <Slider value={[cultureI]} onValueChange={(val) => setCultureI(val[0])} max={100} step={5} className="py-2" />
              </div>

              {/* A - Creator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground/80">Creator (Artistic - A)</span>
                  <span className="text-primary">{cultureA}%</span>
                </div>
                <Slider value={[cultureA]} onValueChange={(val) => setCultureA(val[0])} max={100} step={5} className="py-2" />
              </div>

              {/* S - Helper */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground/80">Helper (Social - S)</span>
                  <span className="text-primary">{cultureS}%</span>
                </div>
                <Slider value={[cultureS]} onValueChange={(val) => setCultureS(val[0])} max={100} step={5} className="py-2" />
              </div>

              {/* E - Persuader */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground/80">Persuader (Enterprising - E)</span>
                  <span className="text-primary">{cultureE}%</span>
                </div>
                <Slider value={[cultureE]} onValueChange={(val) => setCultureE(val[0])} max={100} step={5} className="py-2" />
              </div>

              {/* C - Organizer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground/80">Organizer (Conventional - C)</span>
                  <span className="text-primary">{cultureC}%</span>
                </div>
                <Slider value={[cultureC]} onValueChange={(val) => setCultureC(val[0])} max={100} step={5} className="py-2" />
              </div>
            </div>

            <div className="flex justify-between items-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-4 py-2.5 mt-2">
              <span className="text-xs text-foreground/50">Total Weights Value: <strong className={cultureR + cultureI + cultureA + cultureS + cultureE + cultureC === 100 ? "text-primary" : "text-amber-500"}>{cultureR + cultureI + cultureA + cultureS + cultureE + cultureC}%</strong> (Ideally should equal 100%)</span>
              <div className="flex items-center gap-2">
                {saved && <span className="text-sm text-primary font-medium animate-fade-in">✓ Saved!</span>}
                <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-4">
                  Save Culture Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Subscription & Billing */}
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Plans and billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Billing details are unavailable in this workspace.</p>
          <Button variant="outline" asChild className="mt-4"><Link to="/pricing">View plans</Link></Button>
        </section>
      </div>
    </DashboardLayout>
  );
}
