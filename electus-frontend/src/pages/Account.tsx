import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Briefcase, Building2, CreditCard, Zap } from "lucide-react";
import { useState } from "react";

const themes = ["Light", "Dark", "System"] as const;

export default function Account() {
  const [selectedTheme, setSelectedTheme] = useState<string>("Dark");
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Manage your profile, preferences, and subscription plan.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Card 1: Profile & Organization */}
        <div className="glass glass-plasma rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
            <p className="text-sm text-white/40">Update your personal details and organization info.</p>
          </div>
          <div className="px-6 pb-6">
            <div className="flex gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <Avatar className="h-20 w-20 border-2 border-white/[0.1]">
                  <AvatarFallback className="bg-white/[0.06] text-white text-xl font-semibold">
                    SC
                  </AvatarFallback>
                </Avatar>
                <button className="text-xs font-medium text-primary hover:underline">
                  Change
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs text-white/40 flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Full Name
                  </Label>
                  <Input id="fullName" defaultValue="Sarah Chen" className="glass-input border-white/[0.08] bg-white/[0.04] text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-white/40 flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email Address
                  </Label>
                  <Input id="email" defaultValue="sarah.chen@electus.io" className="glass-input border-white/[0.08] bg-white/[0.04] text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs text-white/40 flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" /> Role
                  </Label>
                  <Input id="role" defaultValue="Head of Talent" className="glass-input border-white/[0.08] bg-white/[0.04] text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs text-white/40 flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" /> Company Name
                  </Label>
                  <Input id="company" defaultValue="Electus Corp." className="glass-input border-white/[0.08] bg-white/[0.04] text-white" />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Card 2: App Preferences */}
        <div className="glass glass-plasma rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-white">Preferences & Display</h3>
            <p className="text-sm text-white/40">Customize your experience and notification settings.</p>
          </div>
          <div className="px-6 pb-6 space-y-6">
            {/* Theme Selector */}
            <div className="space-y-2.5">
              <Label className="text-xs text-white/40">Theme</Label>
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1 gap-0.5">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      selectedTheme === theme
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-white/35">
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

        {/* Card 3: Subscription & Billing */}
        <div className="glass glass-plasma rounded-xl">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-lg font-semibold text-white">Current Plan & Usage</h3>
            <p className="text-sm text-white/40">View your subscription details and AI processing quota.</p>
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
                    <p className="text-sm font-semibold text-white">Electus Enterprise Plan</p>
                    <Badge className="bg-primary/20 text-primary border-0 text-[10px] font-semibold hover:bg-primary/20">
                      ACTIVE
                    </Badge>
                  </div>
                  <p className="text-xs text-white/35 mt-0.5">Billed monthly · Next invoice on Apr 1, 2026</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                $199<span className="text-sm font-normal text-white/40">/mo</span>
              </p>
            </div>

            {/* Usage Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-white/40 flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> AI Processing & RAG Search Quota
                </Label>
                <span className="text-xs font-semibold text-white">80%</span>
              </div>
              <Progress value={80} className="h-2.5 bg-white/[0.06] [&>div]:bg-primary" />
              <p className="text-xs text-white/40">
                <span className="font-medium text-white">8,000</span> / 10,000 AI tokens used this month.
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
