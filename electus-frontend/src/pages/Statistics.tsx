import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
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

const dateRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];

const funnelData = [
  { stage: "Total Uploaded", value: 150, fill: "rgba(255,255,255,0.25)" },
  { stage: "Passed AI Screening", value: 84, fill: "rgba(255,255,255,0.18)" },
  { stage: "Reviewed", value: 42, fill: "hsl(168, 45%, 50%)" },
  { stage: "Interview Invited", value: 12, fill: "hsl(168, 52%, 45%)" },
];

const hollandData = [
  { name: "Realistic", value: 18, color: "#E74C3C" },
  { name: "Investigative", value: 28, color: "#3498DB" },
  { name: "Artistic", value: 14, color: "#9B59B6" },
  { name: "Social", value: 16, color: "#2ECC71" },
  { name: "Enterprising", value: 15, color: "#F39C12" },
  { name: "Conventional", value: 9, color: "#1ABC9C" },
];

const skillsData = [
  { skill: "React", count: 45 },
  { skill: "Python", count: 38 },
  { skill: "Agile", count: 30 },
  { skill: "System Design", count: 25 },
  { skill: "TypeScript", count: 22 },
  { skill: "AWS", count: 18 },
  { skill: "SQL", count: 15 },
];

const processingData = [
  { day: "Mon", time: 2.1 },
  { day: "Tue", time: 2.5 },
  { day: "Wed", time: 2.3 },
  { day: "Thu", time: 2.8 },
  { day: "Fri", time: 2.2 },
  { day: "Sat", time: 2.0 },
  { day: "Sun", time: 2.4 },
];

const GlassTooltipStyle = {
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  fontSize: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  backgroundColor: "hsl(220, 35%, 12%)",
  color: "rgba(255,255,255,0.8)",
};

const Statistics = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Recruitment Analytics
          </h1>
          <p className="mt-1 text-sm text-white/40">
            AI-driven insights from your candidate talent pool.
          </p>
        </div>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 text-sm font-medium glass-btn border-white/[0.1] text-white/80"
            >
              <Calendar className="h-4 w-4 text-primary" />
              {dateRange}
              <ChevronDown className="h-3.5 w-3.5 text-white/40" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1 glass-strong border-white/[0.1] bg-[hsl(220,35%,12%)]" align="end">
            {dateRanges.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDateRange(r);
                  setDateOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/[0.06] ${
                  r === dateRange
                    ? "bg-white/[0.08] font-medium text-white"
                    : "text-white/50"
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
            <h3 className="text-base font-semibold text-white">Hiring Pipeline</h3>
            <p className="text-xs text-white/40">Candidate drop-off through each stage</p>
          </div>
          <div className="px-6 pb-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={GlassTooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} formatter={(value: number) => [`${value} candidates`, "Count"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
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
            <h3 className="text-base font-semibold text-white">Overall Talent Personality (RIASEC)</h3>
            <p className="text-xs text-white/40">Holland Code distribution across all candidates</p>
          </div>
          <div className="px-6 pb-5 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={hollandData} cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                  {hollandData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip contentStyle={GlassTooltipStyle} formatter={(value: number, name: string) => [`${value}%`, name]} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs text-white/50 ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Skills */}
        <div className="glass glass-plasma rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-white">Most Common Skills Detected</h3>
            <p className="text-xs text-white/40">Top skills extracted by AI from all CVs</p>
          </div>
          <div className="px-6 pb-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={skillsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={GlassTooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} formatter={(value: number) => [`${value} mentions`, "Count"]} />
                <Bar dataKey="count" fill="hsl(168, 52%, 45%)" radius={[0, 6, 6, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Processing Time */}
        <div className="glass glass-plasma rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-white">AI Processing Time</h3>
            <p className="text-xs text-white/40">Average parsing speed per CV this week</p>
          </div>
          <div className="px-6 pb-5">
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">2.4s</span>
              <span className="text-sm text-white/40">avg. per CV</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={processingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} domain={[1.5, 3.5]} unit="s" />
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
