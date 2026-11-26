import { PublicHeader } from "@/components/layout/PublicHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Google Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edge")) return "Microsoft Edge";
    return "Browser Client";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const hashedPassword = await sha256(password);
      const deviceName = getDeviceName();

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          DeviceName: deviceName,
          Email: email,
          Password: hashedPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Invalid credentials");
      }
      const data = await res.json();
      localStorage.setItem("electus-token", data.access_token);
      localStorage.setItem("electus-user-name", data.user.fullName);
      localStorage.setItem("electus-user-email", data.user.email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Connection failed. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-shell">
      <PublicHeader />
      <div className="text-foreground flex justify-center px-4 py-10 sm:py-16">
      
      {/* Decorative Background */}

      <div className="w-full max-w-md ">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="rounded-xl border bg-card p-5 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center mb-5 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-foreground/[0.03] border-input text-foreground placeholder:text-muted-foreground"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-foreground/[0.03] border-input text-foreground placeholder:text-muted-foreground"
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full  mt-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button onClick={() => navigate('/signup')} className="text-primary hover:underline font-medium">
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
