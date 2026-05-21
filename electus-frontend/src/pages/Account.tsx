import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Briefcase, Building2, CreditCard, Zap, Sparkles } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

import { useTheme } from "@/components/ThemeProvider";

const themes = ["light", "dark", "system"] as const;

export default function Account() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [fullName, setFullName] = useState(() => localStorage.getItem('electus-user-name') || 'Sarah Chen');
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Manage your profile, preferences, and subscription plan.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Card 1: Profile & Organization */}
        <div className="glass glass-plasma rounded-xl">
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
                <button className="text-xs font-medium text-primary hover:underline">
                  Change
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-2 gap-4">
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
                  <Input id="email" defaultValue="sarah.chen@electus.io" className="glass-input border-foreground/[0.08] bg-foreground/[0.04] text-foreground" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" /> Role
                  </Label>
                  <Input id="role" defaultValue="Head of Talent" className="glass-input border-foreground/[0.08] bg-foreground/[0.04] text-foreground" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" /> Company Name
                  </Label>
                  <Input id="company" defaultValue="Electus Corp." className="glass-input border-foreground/[0.08] bg-foreground/[0.04] text-foreground" />
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
        <div className="glass glass-plasma rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-foreground">Preferences & Display</h3>
            <p className="text-sm text-foreground/60">Customize your experience and notification settings.</p>
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
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                      theme === t
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.05]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-foreground/40">
                  Receive alerts when batch AI processing is complete.
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        </div>

        {/* Card 2.5: Target Company Culture */}
        <div className="glass glass-plasma rounded-xl">
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
        <div className="glass glass-plasma rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-foreground">Current Plan & Usage</h3>
            <p className="text-sm text-foreground/60">View your subscription details and AI processing quota.</p>
          </div>
          <div className="px-6 pb-6 space-y-6">
            {/* Plan Badge */}
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/[0.06] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/[0.15]">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Professional Plan</p>
                    <Badge className="bg-primary/20 text-primary border-0 text-[10px] font-semibold hover:bg-primary/20">
                      ACTIVE
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/40 mt-0.5">Billed monthly · Next invoice on Apr 1, 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  $25
                </p>
                <p className="text-xs font-normal text-foreground/60">/per user per month</p>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-foreground/60 flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> AI Processing & RAG Search Quota
                </Label>
                <span className="text-xs font-semibold text-foreground">80%</span>
              </div>
              <Progress value={80} className="h-2.5 bg-foreground/[0.06] [&>div]:bg-primary" />
              <p className="text-xs text-foreground/60">
                <span className="font-medium text-foreground">8,000</span> / 10,000 AI tokens used this month.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-sm">
                Cancel Subscription
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Manage Billing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
