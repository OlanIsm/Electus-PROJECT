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
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  educationFilter,
  onEducationChange,
  experienceFilter,
  onExperienceChange,
}: SearchFilterBarProps) {
  return (
    <div className="dashboard-filters flex flex-wrap items-center gap-3">
      <div className="candidate-search relative flex-1 min-w-0 basis-56">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
        <Input
          aria-label="Search candidates by context, skills, or roles"
          placeholder="Search candidates by context, skills, or roles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 bg-background"
        />
      </div>

      <Select value={educationFilter} onValueChange={onEducationChange}>
        <SelectTrigger aria-label="Education" className="w-[160px] h-10 bg-background">
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
        <SelectTrigger aria-label="Experience" className="w-[160px] h-10 bg-background">
          <SelectValue placeholder="Experience Level" />
        </SelectTrigger>
        <SelectContent className="glass-strong border-foreground/[0.1] bg-popover">
          <SelectItem value="all">All Experience</SelectItem>
          <SelectItem value="Junior">Junior</SelectItem>
          <SelectItem value="Mid-level">Mid-level</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
        </SelectContent>
      </Select>

    </div>
  );
}
