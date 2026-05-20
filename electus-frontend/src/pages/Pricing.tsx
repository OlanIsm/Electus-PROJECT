import { useNavigate } from "react-router-dom";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { Check, Zap, Building2, Rocket, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Starter",
    tagline: "For individuals & small teams",
    price: 15,
    icon: Zap,
    popular: false,
    color: "teal",
    features: [
      "Up to 5 Job Postings",
      "Up to 500 Candidates",
      "CV Parsing (PDF & DOCX)",
      "AI Summary per Candidate",
      "Semantic Search",
      "Basic Analytics Dashboard",
      "Email Support",
    ],
    upcoming: [],
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    tagline: "For growing teams",
    price: 25,
    icon: Building2,
    popular: false,
    color: "cyan",
    features: [
      "Unlimited Job Postings",
      "Unlimited Candidates",
      "Everything in Starter",
      "Holland Code (RIASEC) Analysis",
      "Blind Screening Mode",
      "Batch CV Upload",
      "Advanced Statistics & Charts",
      "Priority Email Support",
    ],
    upcoming: [],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    tagline: "For industry leaders",
    price: 45,
    icon: Rocket,
    popular: true,
    color: "violet",
    features: [
      "Everything in Professional",
      "Unlimited Hiring Managers",
      "Workflow Automation",
      "Advanced Report Builder",
      "Single Sign On (SSO)",
    ],
    upcoming: [
      "AI Interview Q&A Generator",
      "LLM Integration (custom model)",
      "Open API Access",
      "User Groups & RBAC",
      "Dedicated Account Manager",
    ],
    cta: "Contact Sales",
  },
];

const colorMap: Record<string, { border: string; glow: string; badge: string; check: string; price: string; btn: string }> = {
  teal: {
    border: "rgba(45,212,191,0.18)",
    glow: "rgba(45,212,191,0.07)",
    badge: "rgba(45,212,191,0.12)",
    check: "#2dd4bf",
    price: "#2dd4bf",
    btn: "linear-gradient(135deg,#0d9488,#0891b2)",
  },
  cyan: {
    border: "rgba(34,211,238,0.18)",
    glow: "rgba(34,211,238,0.07)",
    badge: "rgba(34,211,238,0.12)",
    check: "#22d3ee",
    price: "#22d3ee",
    btn: "linear-gradient(135deg,#0891b2,#6366f1)",
  },
  violet: {
    border: "rgba(139,92,246,0.35)",
    glow: "rgba(139,92,246,0.12)",
    badge: "rgba(139,92,246,0.15)",
    check: "#a78bfa",
    price: "#c4b5fd",
    btn: "linear-gradient(135deg,#7c3aed,#6366f1)",
  },
};

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="dark bg-background text-foreground relative flex w-full min-h-screen flex-col items-center overflow-hidden">
      {/* WebGL Background */}
      <WebGLShader />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/[0.06]"
        style={{ background: "rgba(8,10,20,0.7)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Electus Logo" className="h-7 w-auto object-contain rounded-md" />
            <span className="text-lg font-bold tracking-tight text-foreground">ELECTUS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/50">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="/pricing" className="text-teal-400 transition-colors">Pricing</a>
            <a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-medium text-foreground border border-foreground/20 rounded-full px-5 py-2 hover:bg-foreground/10 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/70 transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs font-medium mb-6">
            <img src="/Logo.png" alt="" className="h-4 w-4 rounded-sm" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-4">
            Plans that scale with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              your team
            </span>
          </h1>
          <p className="text-foreground/50 text-lg max-w-xl mx-auto">
            Start free, upgrade when you need. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const c = colorMap[plan.color];
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className="relative rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 0 40px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                      ✦ Most Popular
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-lg" style={{ background: c.badge }}>
                      <Icon className="h-4 w-4" style={{ color: c.check }} />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{plan.name} Plan</h2>
                  </div>
                  <p className="text-sm text-foreground/40 mb-5 ml-[2.75rem]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter" style={{ color: c.price }}>
                        ${plan.price}
                      </span>
                      <span className="text-sm text-foreground/40 mb-2">/per user per month</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate(plan.name === "Enterprise" ? "/contact" : "/signup")}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white mb-7 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: c.btn }}
                  >
                    {plan.cta}
                  </button>

                  {/* Divider */}
                  <div className="border-t mb-6" style={{ borderColor: c.border }} />

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/70">
                        <span className="flex-shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full"
                          style={{ background: c.badge }}>
                          <Check className="h-2.5 w-2.5" style={{ color: c.check }} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}

                    {/* Upcoming Features */}
                    {plan.upcoming.length > 0 && (
                      <>
                        <li className="pt-3">
                          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.check, opacity: 0.7 }}>
                            ⚡ Coming Soon
                          </span>
                        </li>
                        {plan.upcoming.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-foreground/40">
                            <span className="flex-shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border"
                              style={{ borderColor: c.border }}>
                              <span className="h-1 w-1 rounded-full" style={{ background: c.check, opacity: 0.5 }} />
                            </span>
                            {f}
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-14 text-center">
          <p className="text-foreground/30 text-sm">
            All plans include a <span className="text-teal-400 font-medium">14-day free trial</span>. No credit card required.
          </p>
          <div className="mt-6 inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
            <p className="text-xs text-teal-400/70 font-medium">Powered by Local AI — Your data never leaves your server</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
