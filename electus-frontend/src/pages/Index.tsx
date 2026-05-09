import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { CandidateList } from "@/components/dashboard/CandidateList";
import { CandidateDetailModal } from "@/components/dashboard/CandidateDetailModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Candidate } from "@/types/candidate";

const API_URL = "http://localhost:3000";

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [blindMode, setBlindMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [educationFilter, setEducationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [confirmAction, setConfirmAction] = useState<'all' | 'duplicates' | 'pending' | 'reviewed' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searching, setSearching] = useState(false);

  // Fetch candidates from backend API
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${API_URL}/candidates`);
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced semantic search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      // Reset to normal list when search is cleared
      fetchCandidates();
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API_URL}/candidates/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error("Semantic search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const searchActive = searchQuery.trim().length > 0;

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (educationFilter !== "all" && c.education !== educationFilter) return false;
      if (experienceFilter !== "all" && c.experience !== experienceFilter) return false;
      if (statusFilter !== "all" && c.reviewStatus !== statusFilter) return false;
      return true;
    });
  }, [candidates, educationFilter, experienceFilter, statusFilter]);

  // Toggle status via backend PATCH API
  const toggleStatus = async (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;

    const newStatus = candidate.reviewStatus === "pending" ? "reviewed" : "pending";

    try {
      await fetch(`${API_URL}/candidates/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: newStatus }),
      });

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, reviewStatus: newStatus } : c
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const executeBulkAction = async () => {
    if (!confirmAction) return;
    setIsDeleting(true);
    try {
      if (confirmAction === 'all' || confirmAction === 'duplicates') {
        await fetch(`${API_URL}/candidates/${confirmAction}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_URL}/candidates/status/${confirmAction}`, { method: 'DELETE' });
      }
      await fetchCandidates();
    } catch (err) {
      console.error(`Failed to delete ${confirmAction}:`, err);
    } finally {
      setIsDeleting(false);
      setConfirmAction(null);
    }
  };

  const pending = candidates.filter((c) => c.reviewStatus === "pending").length;
  const reviewed = candidates.filter((c) => c.reviewStatus === "reviewed").length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-foreground/40 text-sm">Loading candidates...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, HR Team</h1>
          <p className="mt-1 text-sm text-foreground/40">
            Manage your candidates and track hiring progress.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl glass px-4 py-3">
          <div className="text-right">
            <Label htmlFor="blind-mode" className="text-sm font-medium text-foreground/80 cursor-pointer">
              Blind Screening
            </Label>
            <p className="text-[11px] text-foreground/40 mt-0.5">Hide candidate names</p>
          </div>
          <Switch
            id="blind-mode"
            checked={blindMode}
            onCheckedChange={setBlindMode}
          />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          educationFilter={educationFilter}
          onEducationChange={setEducationFilter}
          experienceFilter={experienceFilter}
          onExperienceChange={setExperienceFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Bulk Actions */}
      <div className="mb-6 flex flex-wrap gap-2 animate-fade-in">
        <Button variant="outline" size="sm" onClick={() => setConfirmAction('duplicates')} className="h-8 text-xs border-foreground/[0.1] bg-foreground/[0.04] text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground">
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Duplicates
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmAction('pending')} className="h-8 text-xs border-foreground/[0.1] bg-foreground/[0.04] text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground">
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Pending
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmAction('reviewed')} className="h-8 text-xs border-foreground/[0.1] bg-foreground/[0.04] text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground">
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Reviewed
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmAction('all')} className="h-8 text-xs border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 ml-auto">
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete All
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsCards
          totalCvs={candidates.length}
          pending={pending}
          reviewed={reviewed}
          interviewsSent={0}
        />
      </div>

      {/* Candidate List */}
      <div>
        <CandidateList
          candidates={filtered}
          blindMode={blindMode}
          searchActive={searchActive}
          onViewProfile={setSelectedCandidate}
          onToggleStatus={toggleStatus}
        />
      </div>

      {/* Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        blindMode={blindMode}
        onMarkDone={toggleStatus}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && !isDeleting && setConfirmAction(null)}>
        <AlertDialogContent className="glass-strong border-foreground/[0.1] bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/60">
              {confirmAction === 'all' && "This will permanently delete ALL candidates from the database. This action cannot be undone."}
              {confirmAction === 'duplicates' && "This will remove all duplicate candidates, keeping only the most recently uploaded copy for each name."}
              {confirmAction === 'pending' && "This will permanently delete all candidates that are currently marked as 'Pending Review'."}
              {confirmAction === 'reviewed' && "This will permanently delete all candidates that have already been reviewed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-foreground/[0.04] border-foreground/[0.1] text-foreground hover:bg-foreground/[0.08] hover:text-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              disabled={isDeleting} 
              onClick={(e) => { 
                e.preventDefault(); 
                executeBulkAction(); 
              }} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Yes, I'm sure"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Index;
