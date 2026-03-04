import { FileText, Clock, CheckCircle2, Send } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="glass glass-plasma rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-white/50">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-lg p-2.5 bg-white/[0.06] border border-white/[0.08]">
          <Icon className="h-5 w-5 text-white/70" />
        </div>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  totalCvs: number;
  pending: number;
  reviewed: number;
  interviewsSent: number;
}

export function StatsCards({ totalCvs, pending, reviewed, interviewsSent }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total CVs Uploaded" value={totalCvs} icon={FileText} />
      <StatCard label="Pending Review" value={pending} icon={Clock} />
      <StatCard label="Reviewed Candidates" value={reviewed} icon={CheckCircle2} />
      <StatCard label="Interviews Sent" value={interviewsSent} icon={Send} />
    </div>
  );
}
