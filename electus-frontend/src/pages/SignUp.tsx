import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = await sha256(password);
      const deviceName = getDeviceName();

      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          DeviceName: deviceName,
          FullName: fullName,
          Email: email,
          Password: hashedPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Registration failed");
      }
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Connection failed. Is the backend server running?");
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-sm text-foreground/40">Get started with Electus ATS for free</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center mb-5 animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm p-3 rounded-lg text-center mb-5 animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-foreground/80">Full name</Label>
              <Input 
                id="fullname" 
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground placeholder:text-foreground/20 focus:border-teal-500/50"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground placeholder:text-foreground/20 focus:border-teal-500/50"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground placeholder:text-foreground/20 focus:border-teal-500/50"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground/80">Confirm password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-foreground/[0.03] border-foreground/[0.1] text-foreground placeholder:text-foreground/20 focus:border-teal-500/50"
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-medium shadow-[0_0_20px_rgba(20,184,166,0.3)] mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/40">
            Already have an account?{" "}
            <button onClick={() => navigate('/login')} className="text-teal-400 hover:text-teal-300 font-medium">
              Sign in
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SignUp;
