import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  educationFilter: string;
  onEducationChange: (value: string) => void;
  experienceFilter: string;
  onExperienceChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  educationFilter,
  onEducationChange,
  experienceFilter,
  onExperienceChange,
  statusFilter,
  onStatusChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 animate-fade-in">
      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
        <Input
          placeholder="Search candidates by context, skills, or roles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 border border-primary/20 hover:border-primary/40 focus:border-primary/60 focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/30 bg-primary/[0.04] hover:bg-primary/[0.07] dark:bg-primary/[0.06] dark:hover:bg-primary/[0.09] text-foreground placeholder:text-foreground/45 transition-all duration-200 backdrop-blur-md"
        />
      </div>

      <Select value={educationFilter} onValueChange={onEducationChange}>
        <SelectTrigger className="w-[160px] h-10 border border-primary/20 hover:border-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 bg-primary/[0.04] hover:bg-primary/[0.07] dark:bg-primary/[0.06] dark:hover:bg-primary/[0.09] text-foreground/80 transition-all duration-200 backdrop-blur-md">
          <SelectValue placeholder="Education Level" />
        </SelectTrigger>
        <SelectContent className="glass-strong border-foreground/[0.1] bg-popover">
          <SelectItem value="all">All Education</SelectItem>
          <SelectItem value="Bachelor's">Bachelor's</SelectItem>
          <SelectItem value="Master's">Master's</SelectItem>
          <SelectItem value="PhD">PhD</SelectItem>
          <SelectItem value="MBA">MBA</SelectItem>
        </SelectContent>
      </Select>

      <Select value={experienceFilter} onValueChange={onExperienceChange}>
        <SelectTrigger className="w-[160px] h-10 border border-primary/20 hover:border-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 bg-primary/[0.04] hover:bg-primary/[0.07] dark:bg-primary/[0.06] dark:hover:bg-primary/[0.09] text-foreground/80 transition-all duration-200 backdrop-blur-md">
          <SelectValue placeholder="Experience Level" />
        </SelectTrigger>
        <SelectContent className="glass-strong border-foreground/[0.1] bg-popover">
          <SelectItem value="all">All Experience</SelectItem>
          <SelectItem value="Junior">Junior</SelectItem>
          <SelectItem value="Mid-level">Mid-level</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px] h-10 border border-primary/20 hover:border-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 bg-primary/[0.04] hover:bg-primary/[0.07] dark:bg-primary/[0.06] dark:hover:bg-primary/[0.09] text-foreground/80 transition-all duration-200 backdrop-blur-md">
          <SelectValue placeholder="Review Status" />
        </SelectTrigger>
        <SelectContent className="glass-strong border-foreground/[0.1] bg-popover">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="reviewed">Reviewed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
