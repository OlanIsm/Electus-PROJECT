import { useNavigate } from "react-router-dom";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";


const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex w-full min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* WebGL Animated Background */}
      <WebGLShader />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Electus Logo" className="h-7 w-auto object-contain rounded-md" />
            <span className="text-lg font-bold tracking-tight text-white">ELECTUS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#" className="text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Service</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-medium text-white border border-white/20 rounded-full px-5 py-2 hover:bg-white/10 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative w-full mx-auto max-w-3xl z-10">
        <main className="relative py-16 overflow-hidden">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs font-medium">
              <img src="/Logo.png" alt="" className="h-4 w-4 rounded-sm" />
              AI-Powered Applicant Tracking System
            </div>
          </div>

          <h1 className="mb-4 text-white text-center text-6xl font-extrabold tracking-tighter md:text-[clamp(2rem,8vw,6rem)] leading-[1.05]">
            Hire Smarter with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              AI
            </span>
          </h1>

          <p className="text-white/50 px-6 text-center text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Unleashing the power of Gemma AI to screen candidates, extract skills, and match the best talent — all in seconds.
          </p>

          {/* Status indicator */}
          <div className="my-8 flex items-center justify-center gap-1.5">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"></span>
            </span>
            <p className="text-xs text-teal-400 font-medium">Powered by Local AI — Your data stays private</p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <LiquidButton
              className="text-white border border-white/20 rounded-full"
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
                className="text-[11px] text-white/40 border border-white/[0.08] rounded-full px-3 py-1.5 bg-white/[0.02]"
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
