import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FileUp, MoreHorizontal, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { CandidateList } from "@/components/dashboard/CandidateList";
import { CandidateDetailModal } from "@/components/dashboard/CandidateDetailModal";
import { useUpload } from "@/context/UploadContext";
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
  const [searchResults, setSearchResults] = useState<Candidate[]>([]);
  const [loadError, setLoadError] = useState(false);
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

  const { isProcessing } = useUpload();

  const hasProcessing = candidates.some(c => c.processingStatus === "processing");

  useEffect(() => {
    fetchCandidates();
  }, [isProcessing]);

  useEffect(() => {
    if (!hasProcessing) return;
    const interval = setInterval(fetchCandidates, 3000);
    return () => clearInterval(interval);
  }, [hasProcessing]);

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
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res;
  };

  const fetchCandidates = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/candidates`);
      const data = await res.json();
      setCandidates(data);
      setLoadError(false);
    } catch (err) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Debounced semantic search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await authenticatedFetch(`${API_URL}/candidates/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!controller.signal.aborted) setSearchResults(data);
      } catch {
        if (!controller.signal.aborted) toast.error("Search failed. Try another search.");
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  const searchActive = searchQuery.trim().length > 0;

  const filtered = useMemo(() => {
    return (searchActive ? searchResults : candidates).filter((c) => {
      if (educationFilter !== "all" && c.education !== educationFilter) return false;
      if (experienceFilter !== "all" && c.experience !== experienceFilter) return false;
      return true;
    });
  }, [candidates, searchResults, searchActive, educationFilter, experienceFilter]);

  // Toggle status via backend PATCH API
  const toggleStatus = async (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;

    const newStatus = candidate.reviewStatus === "pending" ? "reviewed" : "pending";

    try {
      await authenticatedFetch(`${API_URL}/candidates/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: newStatus }),
      });

      const updateReview = (candidate: Candidate): Candidate =>
        candidate.id === id ? { ...candidate, reviewStatus: newStatus } : candidate;
      setCandidates(prev => prev.map(updateReview));
      setSearchResults(prev => prev.map(updateReview));
      setSelectedCandidate(prev => prev && updateReview(prev));
    } catch {
      toast.error("Could not update review status.");
    }
  };

  const executeBulkAction = async () => {
    if (!confirmAction) return;
    setIsDeleting(true);
    try {
      if (confirmAction === 'all' || confirmAction === 'duplicates') {
        await authenticatedFetch(`${API_URL}/candidates/${confirmAction}`, { method: 'DELETE' });
      } else {
        await authenticatedFetch(`${API_URL}/candidates/status/${confirmAction}`, { method: 'DELETE' });
      }
      setSearchQuery("");
      setSearching(false);
      await fetchCandidates();
    } catch {
      toast.error("Could not delete candidates.");
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
      <header className="page-heading">
        <div>
          <h1>Recruitment overview</h1>
          <p>Track CV reviews and find candidates for your next shortlist.</p>
        </div>
        <Button asChild>
          <Link to="/upload"><FileUp /> Upload CVs</Link>
        </Button>
      </header>

      {loadError && (
        <div role="alert" className="mb-5 flex flex-wrap items-center gap-3 text-sm">
          Could not load the latest candidates.
          <Button variant="outline" size="sm" onClick={fetchCandidates}>Retry</Button>
        </div>
      )}

      <section className="review-overview" aria-label="Review progress">
        <dl>
          <div><dt>Total candidates</dt><dd>{candidates.length}</dd></div>
          <div><dt>Pending review</dt><dd>{pending}</dd></div>
          <div><dt>Reviewed</dt><dd>{reviewed}</dd></div>
        </dl>
        <div className="review-meter">
          <div><span>Review progress</span><strong>{candidates.length ? Math.round(reviewed / candidates.length * 100) : 0}%</strong></div>
          <progress value={reviewed} max={candidates.length || 1} aria-label="Candidates reviewed" />
        </div>
      </section>

      <section className="candidate-workspace" aria-labelledby="candidate-heading">
        <div className="candidate-toolbar">
          <div>
            <h2 id="candidate-heading">Candidates</h2>
            <p>{filtered.length} {filtered.length === 1 ? "candidate" : "candidates"}{searchActive ? " in search results" : " in this view"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Label htmlFor="blind-mode" className="flex cursor-pointer items-center gap-2">
              <ShieldCheck size={16} className="text-primary" /> Blind screening
            </Label>
            <Switch id="blind-mode" checked={blindMode} onCheckedChange={setBlindMode} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Candidate management"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setConfirmAction("duplicates")}>Remove duplicates</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setConfirmAction("pending")}>Delete pending candidates</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setConfirmAction("reviewed")}>Delete reviewed candidates</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onSelect={() => setConfirmAction("all")}>Delete all candidates</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={value => {
            setSearchQuery(value);
            setSearchResults([]);
            setSearching(Boolean(value.trim()));
          }}
          educationFilter={educationFilter}
          onEducationChange={setEducationFilter}
          experienceFilter={experienceFilter}
          onExperienceChange={setExperienceFilter}
        />
        {searching ? <p className="py-8 text-center text-sm text-muted-foreground" role="status">Searching candidates?</p> : (
          <CandidateList
            candidates={filtered}
            blindMode={blindMode}
            searchActive={searchActive}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onViewProfile={setSelectedCandidate}
            onToggleStatus={toggleStatus}
          />
        )}
      </section>

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
