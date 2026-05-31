import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, UploadCloud } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { Candidate } from "@/types/candidate";

const API_URL = "http://localhost:3000";
const dateRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];

const GlassTooltipStyle = {
  borderRadius: "8px",
  border: "1px solid var(--glass-border)",
  fontSize: "12px",
  boxShadow: "var(--glass-shadow)",
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
};

const HOLLAND_COLORS: Record<string, string> = {
  Builder: "#E74C3C",      // Realistic
  Thinker: "#3498DB",      // Investigative
  Creator: "#9B59B6",      // Artistic
  Helper: "#2ECC71",       // Social
  Persuader: "#F39C12",    // Enterprising
  Organizer: "#1ABC9C",    // Conventional
};

const Statistics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [dateOpen, setDateOpen] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('electus-token');
    const headers = {
      ...(options.headers || {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('electus-token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return res;
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await authenticatedFetch(`${API_URL}/candidates`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const stats = useMemo(() => {
    if (!candidates.length) return null;

    const total = candidates.length;
    const reviewed = candidates.filter(c => c.reviewStatus === "reviewed").length;
    
    // Funnel
    const funnelData = [
      { stage: "Total Uploaded", value: total, fill: "rgba(43, 140, 126, 0.85)" }, // Teal
      { stage: "Passed AI Screening", value: total, fill: "rgba(59, 130, 246, 0.85)" }, // Blue
      { stage: "Reviewed", value: reviewed, fill: "rgba(139, 92, 246, 0.85)" }, // Purple
      { stage: "Interview Invited", value: 0, fill: "rgba(236, 72, 153, 0.85)" }, // Pink
    ];

    // Holland
    const hollandMap: Record<string, number> = {};
    candidates.forEach(c => {
      if (c.hollandCode?.label) {
        hollandMap[c.hollandCode.label] = (hollandMap[c.hollandCode.label] || 0) + 1;
      }
    });
    const hollandData = Object.entries(hollandMap).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100), // percentage
      color: HOLLAND_COLORS[name] || "#ccc",
    })).sort((a, b) => b.value - a.value);

    // Skills
    const skillsMap: Record<string, number> = {};
    candidates.forEach(c => {
      if (c.skills) {
        c.skills.forEach(s => {
          skillsMap[s] = (skillsMap[s] || 0) + 1;
        });
      }
    });
    const skillsData = Object.entries(skillsMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // Top 7

    return { funnelData, hollandData, skillsData };
  }, [candidates]);

  // Mock processing time data since we don't store it yet
  const processingData = [
    { day: "Mon", time: 2.1 },
    { day: "Tue", time: 2.5 },
    { day: "Wed", time: 2.3 },
    { day: "Thu", time: 2.8 },
    { day: "Fri", time: 2.2 },
    { day: "Sat", time: 2.0 },
    { day: "Sun", time: 2.4 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-foreground/40 text-sm">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || candidates.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-foreground/[0.03] border border-foreground/[0.08] flex items-center justify-center mb-6">
            <BarChart className="w-8 h-8 text-foreground/20" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No data available</h2>
          <p className="text-sm text-foreground/40 mb-8 max-w-sm">
            You have not submitted any CV yet. Start uploading candidate resumes to see AI-driven insights and analytics here.
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal px-6"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Start Uploading CV Now
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Recruitment Analytics
          </h1>
          <p className="mt-1 text-sm text-foreground/40">
            AI-driven insights from your candidate talent pool.
          </p>
        </div>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 text-sm font-medium glass-btn border-foreground/[0.1] text-foreground/80"
            >
              <Calendar className="h-4 w-4 text-primary" />
              {dateRange}
              <ChevronDown className="h-3.5 w-3.5 text-foreground/40" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1 glass-strong border-foreground/[0.1] bg-popover" align="end">
            {dateRanges.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDateRange(r);
                  setDateOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/[0.06] ${
                  r === dateRange
                    ? "bg-foreground/[0.08] font-medium text-foreground"
                    : "text-foreground/50"
                }`}
              >
                {r}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Hiring Pipeline Funnel */}
        <div className="glass glass-plasma rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-foreground">Hiring Pipeline</h3>
            <p className="text-xs text-foreground/40">Candidate drop-off through each stage</p>
          </div>
          <div className="px-6 pb-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={stats!.funnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={GlassTooltipStyle} cursor={{ fill: "hsl(var(--foreground) / 0.03)" }} formatter={(value: number) => [`${value} candidates`, "Count"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {stats!.funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holland Code Distribution */}
        <div className="glass glass-plasma rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-foreground">Overall Talent Personality (RIASEC)</h3>
            <p className="text-xs text-foreground/40">Holland Code distribution across all candidates</p>
          </div>
          <div className="px-6 pb-5 flex items-center justify-center">
            {stats!.hollandData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={stats!.hollandData} cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                    {stats!.hollandData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={GlassTooltipStyle} formatter={(value: number, name: string) => [`${value}%`, name]} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-foreground/50 ml-1">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center">
                <p className="text-sm text-foreground/30">Not enough data</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Skills */}
        <div className="glass glass-plasma rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-foreground">Most Common Skills Detected</h3>
            <p className="text-xs text-foreground/40">Top skills extracted by AI from all CVs</p>
          </div>
          <div className="px-6 pb-5">
            {stats!.skillsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats!.skillsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={GlassTooltipStyle} cursor={{ fill: "hsl(var(--foreground) / 0.03)" }} formatter={(value: number) => [`${value} mentions`, "Count"]} />
                  <Bar dataKey="count" fill="hsl(168, 52%, 45%)" radius={[0, 6, 6, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center">
                <p className="text-sm text-foreground/30">No skills data available</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Processing Time */}
        <div className="glass glass-plasma rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-foreground">AI Processing Time</h3>
            <p className="text-xs text-foreground/40">Average parsing speed per CV this week</p>
          </div>
          <div className="px-6 pb-5">
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">2.4s</span>
              <span className="text-sm text-foreground/40">avg. per CV</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={processingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[1.5, 3.5]} unit="s" />
                <Tooltip contentStyle={GlassTooltipStyle} formatter={(value: number) => [`${value}s`, "Parse Time"]} />
                <Line type="monotone" dataKey="time" stroke="hsl(168, 52%, 45%)" strokeWidth={2.5} dot={{ fill: "hsl(168, 52%, 45%)", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
