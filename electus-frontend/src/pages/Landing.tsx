import { useNavigate } from "react-router-dom";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { useTheme } from "@/components/ThemeProvider";
import { Lightbulb } from "lucide-react";

import { flushSync } from "react-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Resolve system theme to dark or light
  const actualTheme = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  const toggleTheme = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const nextTheme = actualTheme === "dark" ? "light" : "dark";

    const doc = document as any;
    if (doc.startViewTransition) {
      // Calculate max radius to cover the entire viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Set CSS variables on the root element
      document.documentElement.style.setProperty("--theme-x", `${x}px`);
      document.documentElement.style.setProperty("--theme-y", `${y}px`);
      document.documentElement.style.setProperty("--theme-r", `${endRadius}px`);

      doc.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });
    } else {
      // Fallback for browsers that don't support View Transitions API
      setTheme(nextTheme);
    }
  };

  return (
    <div className={`${actualTheme === 'dark' ? 'dark' : 'light'} bg-background text-foreground relative flex w-full min-h-screen flex-col items-center justify-center overflow-hidden`}>
      {/* WebGL Animated Background */}
      <WebGLShader />

      {/* Top Navigation - Floating Glass Capsules */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-6 max-w-7xl mx-auto flex items-center justify-between w-full pointer-events-none">
        {/* Brand Capsule */}
        <div className="pointer-events-auto flex items-center gap-3 glass-strong border border-foreground/[0.08] dark:border-white/[0.08] px-5 py-2.5 rounded-full bg-background/40 dark:bg-background/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500">
          <img src="/Logo.png" alt="Electus Logo" className="h-7 w-auto object-contain rounded-md" />
          <span className="text-sm font-bold tracking-tight text-foreground transition-colors duration-500">ELECTUS</span>
        </div>

        {/* Links Capsule */}
        <div className="pointer-events-auto hidden md:flex items-center gap-6 glass-strong border border-foreground/[0.08] dark:border-white/[0.08] px-7 py-2.5 rounded-full bg-background/40 dark:bg-background/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-sm font-medium text-foreground/50 dark:text-foreground/60 transition-all duration-500">
          <a href="#" className="text-foreground transition-colors duration-500 hover:text-foreground/80">Home</a>
          <a href="#" className="hover:text-foreground transition-colors duration-500">Features</a>
          <a href="/pricing" className="hover:text-foreground transition-colors duration-500">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors duration-500">FAQ</a>
          
          {/* Lightbulb Theme Toggle Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-1.5 rounded-full hover:bg-foreground/[0.06] text-foreground/50 hover:text-foreground transition-all duration-500 ml-1 cursor-pointer"
            aria-label="Toggle Theme"
          >
            <Lightbulb className={`w-4 h-4 transition-all duration-500 ${actualTheme === 'light' ? 'text-amber-500 fill-amber-300' : 'text-foreground/50'}`} />
          </button>
        </div>

        {/* Auth Capsule */}
        <div className="pointer-events-auto flex items-center gap-2 glass-strong border border-foreground/[0.08] dark:border-white/[0.08] px-5 py-2.5 rounded-full bg-background/40 dark:bg-background/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500">
          <button
            onClick={() => navigate("/login")}
            className="text-xs text-foreground/70 hover:text-foreground transition-colors duration-500 px-3 py-1.5"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-xs font-semibold text-foreground border border-foreground/20 dark:border-white/20 rounded-full px-4 py-1.5 hover:bg-foreground/10 transition-all duration-500 bg-background/20"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative w-full mx-auto max-w-3xl z-10">
        <main className="relative py-16 overflow-hidden">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 dark:text-teal-300 text-teal-600 text-xs font-medium transition-all duration-500">
              <img src="/Logo.png" alt="" className="h-4 w-4 rounded-sm" />
              AI-Powered Applicant Tracking System
            </div>
          </div>

          <h1 className="mb-4 text-foreground text-center text-6xl font-extrabold tracking-tighter md:text-[clamp(2rem,8vw,6rem)] leading-[1.05] transition-colors duration-500">
            Hire Smarter with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-teal-400 dark:to-cyan-300 from-teal-600 to-cyan-500 transition-all duration-500">
              AI
            </span>
          </h1>

          <p className="text-foreground/50 px-6 text-center text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-500">
            Unleashing the power of AI to screen candidates, extract skills, and match the best talent — all in seconds.
          </p>

          {/* Status indicator */}
          <div className="my-8 flex items-center justify-center gap-1.5">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"></span>
            </span>
            <p className="text-xs dark:text-teal-400 text-teal-600 font-medium transition-colors duration-500">Powered by Local AI — Your data stays private</p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <LiquidButton
              className="text-foreground border border-foreground/20 dark:border-white/20 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500"
              size={"xl"}
              onClick={() => navigate("/login")}
            >
              Try App
            </LiquidButton>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 px-6">
            {[
              "CV Parsing",
              "Holland Code (RIASEC)",
              "Blind Screening",
              "Semantic Search",
              "AI Summary",
            ].map((feature) => (
              <span
                key={feature}
                className="text-[11px] text-foreground/40 border border-foreground/[0.08] rounded-full px-3 py-1.5 bg-foreground/[0.02] transition-colors duration-500"
              >
                {feature}
              </span>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
