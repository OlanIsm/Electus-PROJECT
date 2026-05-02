import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen blueprint-bg text-white selection:bg-teal-500/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#0A0F1C]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Electus Logo" className="h-8 w-auto object-contain rounded-md" />
            <span className="text-xl font-bold tracking-tight text-white">ELECTUS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#" className="text-white hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Service</a>
            <a href="#" className="hover:text-white transition-colors">Blogs</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal rounded-full px-6" onClick={() => navigate('/login')}>
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 lg:pt-48 lg:pb-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>AI-Powered ATS</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Get Expert AI Feedback on <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Candidates</span>, instantly.
          </h1>
          
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Our free AI-powered ATS system scores resumes on key criteria recruiters and hiring managers look for. Get actionable insights, automatically extract skills, and match the best talent faster than ever.
          </p>

          <div className="p-1 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-white/[0.08] max-w-md mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-[#0A0F1C] rounded-xl p-6 text-center border border-white/[0.05]">
              <div className="w-16 h-16 mx-auto bg-white/[0.03] rounded-full flex items-center justify-center mb-4 border border-white/[0.05]">
                <ShieldCheck className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready to transform your hiring?</h3>
              <p className="text-sm text-white/40 mb-6">Start managing candidates with the power of Gemma 3 AI.</p>
              
              <Button onClick={() => navigate('/login')} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-teal text-base font-medium rounded-lg">
                Try App <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-white/40 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Free 14-day trial</span>
          </div>
        </div>

        {/* Right Content - Abstract Dashboard Mockup */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative z-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Decorative blur blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="glass-strong rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden relative">
            {/* Mock Window Header */}
            <div className="h-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            {/* Mock Content */}
            <div className="p-6 bg-[#060a14]/60 backdrop-blur-xl flex flex-col gap-4">
              {/* Top Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-white/[0.05]" />
                    <div className="w-16 h-3 rounded-full bg-white/[0.1]" />
                  </div>
                ))}
              </div>
              
              {/* Main Chart Area */}
              <div className="h-48 rounded-xl bg-white/[0.03] border border-white/[0.05] p-5 flex items-end gap-3">
                {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-teal-500/40 to-cyan-400/10 rounded-t-sm border-t border-teal-400/50" style={{ height: `${h}%` }} />
                ))}
              </div>
              
              {/* Bottom List */}
              <div className="space-y-3 mt-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center px-4 gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/[0.1]" />
                    <div className="flex-1 space-y-2">
                      <div className="w-32 h-2.5 rounded-full bg-white/[0.2]" />
                      <div className="w-24 h-2 rounded-full bg-white/[0.1]" />
                    </div>
                    <div className="w-12 h-6 rounded-full bg-teal-500/20 border border-teal-500/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
