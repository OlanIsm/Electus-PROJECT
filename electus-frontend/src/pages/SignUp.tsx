import { PublicHeader } from "@/components/layout/PublicHeader";
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground">Get started with Electus ATS for free</p>
          </div>

          {error && (
            <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center mb-5 animate-fade-in">
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
                className="bg-foreground/[0.03] border-input text-foreground placeholder:text-muted-foreground"
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
                className="bg-foreground/[0.03] border-input text-foreground placeholder:text-muted-foreground"
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
                className="bg-foreground/[0.03] border-input text-foreground placeholder:text-muted-foreground"
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
                className="bg-foreground/[0.03] border-input text-foreground placeholder:text-muted-foreground"
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full  mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline font-medium">
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
