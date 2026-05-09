import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle authentication here
    // For now, just navigate to the dashboard
    navigate('/dashboard');
  };

  return (
    <div className="dark">
      <div className="text-foreground min-h-screen blueprint-bg flex items-center justify-center p-6 selection:bg-teal-500/30">
      
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="glass-strong border border-foreground/[0.08] p-8 rounded-2xl shadow-2xl bg-background/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/Logo.png" alt="Electus Logo" className="h-10 w-auto object-contain rounded-md" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-sm text-foreground/40">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground placeholder:text-foreground/20 focus:border-teal-500/50"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <a href="#" className="text-xs text-teal-400 hover:text-teal-300 font-medium">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground placeholder:text-foreground/20 focus:border-teal-500/50"
                required 
              />
            </div>

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-white font-medium shadow-[0_0_20px_rgba(20,184,166,0.3)] mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/40">
            Don't have an account?{" "}
            <button onClick={() => navigate('/signup')} className="text-teal-400 hover:text-teal-300 font-medium">
              Sign up
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
