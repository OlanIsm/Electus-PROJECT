import { useState, useCallback, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CloudUpload,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

type FileStatus = "pending" | "extracting" | "vectorizing" | "completed" | "error";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  progress: number;
}

const statusConfig: Record<FileStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-white/[0.06] text-white/50 border-white/[0.1]",
  },
  extracting: {
    label: "Extracting Text & AI Summary...",
    className: "bg-amber/15 text-amber border-amber/30",
  },
  vectorizing: {
    label: "Generating Vectors (RAG)...",
    className: "bg-sky/15 text-sky border-sky/30",
  },
  completed: {
    label: "Completed",
    className: "bg-primary/15 text-primary border-primary/25",
  },
  error: {
    label: "Error",
    className: "bg-destructive/15 text-destructive border-destructive/25",
  },
};

const statusIcon: Record<FileStatus, React.ReactNode> = {
  pending: <AlertCircle className="h-3.5 w-3.5" />,
  extracting: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  vectorizing: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5" />,
  error: <AlertCircle className="h-3.5 w-3.5" />,
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

let fileIdCounter = 0;

export default function BatchUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadFile[] = Array.from(fileList)
      .filter(
        (f) =>
          f.type === "application/pdf" ||
          f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
      .map((f) => ({
        id: `file-${++fileIdCounter}`,
        name: f.name,
        size: f.size,
        status: "pending" as FileStatus,
        progress: 0,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const simulateProcessing = () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    pendingFiles.forEach((file, idx) => {
      const baseDelay = idx * 3500;

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "extracting", progress: 25 } : f
          )
        );
      }, baseDelay + 300);

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: 50 } : f
          )
        );
      }, baseDelay + 1200);

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "vectorizing", progress: 70 } : f
          )
        );
      }, baseDelay + 2000);

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: 90 } : f
          )
        );
      }, baseDelay + 2800);

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "completed", progress: 100 } : f
          )
        );
        if (idx === pendingFiles.length - 1) {
          setIsProcessing(false);
        }
      }, baseDelay + 3400);
    });
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Batch Upload Candidates
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Upload multiple PDF resumes. Our AI will automatically extract text,
          generate summaries, and vectorize them for semantic search.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="glass glass-plasma rounded-xl mb-8 animate-fade-in">
        <div className="p-8">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed 
              py-16 cursor-pointer transition-all duration-200
              ${
                isDragOver
                  ? "border-primary bg-primary/[0.06] scale-[1.01]"
                  : "border-white/[0.12] hover:border-primary/50 hover:bg-white/[0.02]"
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div
              className={`rounded-full p-4 transition-colors ${
                isDragOver ? "bg-primary/[0.12]" : "bg-white/[0.06]"
              }`}
            >
              <CloudUpload
                className={`h-8 w-8 transition-colors ${
                  isDragOver ? "text-primary" : "text-white/40"
                }`}
              />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-white">
                Click or drag to upload CVs
              </p>
              <p className="mt-1 text-sm text-white/35">
                Supports PDF, DOCX (Max 10MB per file)
              </p>
            </div>
          </div>

          {/* Start button */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-white/40">
              {files.length === 0
                ? "No files selected"
                : `${files.length} file${files.length > 1 ? "s" : ""} selected · ${pendingCount} pending`}
            </p>
            <Button
              onClick={simulateProcessing}
              disabled={pendingCount === 0 || isProcessing}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isProcessing ? "Processing..." : "Start AI Processing"}
            </Button>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      {files.length > 0 && (
        <div className="glass rounded-xl animate-fade-in">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-base font-semibold text-white">Processing Queue</h3>
          </div>
          <div className="px-0 pb-0">
            <div className="divide-y divide-white/[0.06]">
              {files.map((file) => {
                const config = statusConfig[file.status];
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08]">
                      <FileText className="h-5 w-5 text-white/50" />
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-white truncate">
                          {file.name}
                        </p>
                        <span className="text-xs text-white/30 shrink-0">
                          {formatSize(file.size)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1.5 bg-white/[0.06] [&>div]:bg-primary" />
                      </div>
                    </div>

                    {/* Status badge */}
                    <Badge
                      variant="outline"
                      className={`gap-1.5 shrink-0 font-medium ${config.className}`}
                    >
                      {statusIcon[file.status]}
                      {config.label}
                    </Badge>

                    {/* Delete */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="shrink-0 rounded-md p-1.5 text-white/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      disabled={
                        file.status === "extracting" ||
                        file.status === "vectorizing"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
