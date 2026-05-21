import { FileText, Clock, CheckCircle2, Send } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  gradientClass: string;
  borderClass: string;
  glowColor: string;
  textClass: string;
}

function StatCard({ label, value, icon: Icon, gradientClass, borderClass, glowColor, textClass }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-5 border ${borderClass} bg-gradient-to-br ${gradientClass} shadow-sm dark:shadow-md animate-fade-in group transition-all duration-300`}>
      {/* Background Neon Glow */}
      <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-30 dark:opacity-20 group-hover:opacity-50 dark:group-hover:opacity-40 transition-opacity duration-300 ${glowColor}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 dark:text-foreground/40">{label}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${textClass}`}>{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 bg-foreground/[0.03] border border-foreground/[0.06] ${textClass} group-hover:bg-foreground/[0.06] transition-all duration-300`}>
          <Icon className="h-5 w-5" />
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
      <StatCard 
        label="Total CVs Uploaded" 
        value={totalCvs} 
        icon={FileText} 
        gradientClass="from-emerald-50 via-white to-white dark:from-emerald-950/20 dark:via-background/50 dark:to-background"
        borderClass="border-emerald-100 dark:border-emerald-500/20 hover:border-emerald-500/40"
        glowColor="bg-emerald-400 dark:bg-emerald-500"
        textClass="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard 
        label="Pending Review" 
        value={pending} 
        icon={Clock} 
        gradientClass="from-orange-50 via-white to-white dark:from-orange-950/20 dark:via-background/50 dark:to-background"
        borderClass="border-orange-100 dark:border-orange-500/20 hover:border-orange-500/40"
        glowColor="bg-orange-400 dark:bg-orange-500"
        textClass="text-orange-600 dark:text-orange-400"
      />
      <StatCard 
        label="Reviewed Candidates" 
        value={reviewed} 
        icon={CheckCircle2} 
        gradientClass="from-blue-50 via-white to-white dark:from-blue-950/20 dark:via-background/50 dark:to-background"
        borderClass="border-blue-100 dark:border-blue-500/20 hover:border-blue-500/40"
        glowColor="bg-blue-400 dark:bg-blue-500"
        textClass="text-blue-600 dark:text-blue-400"
      />
      <StatCard 
        label="Interviews Sent" 
        value={interviewsSent} 
        icon={Send} 
        gradientClass="from-purple-50 via-white to-white dark:from-purple-950/20 dark:via-background/50 dark:to-background"
        borderClass="border-purple-100 dark:border-purple-500/20 hover:border-purple-500/40"
        glowColor="bg-purple-400 dark:bg-purple-500"
        textClass="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}
