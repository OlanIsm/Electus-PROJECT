import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const API_URL = "http://localhost:3000";

export type FileStatus = "pending" | "extracting" | "completed" | "error";

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  progress: number;
  file: File;
  errorMessage?: string;
}

interface UploadContextType {
  files: UploadFile[];
  isProcessing: boolean;
  addFiles: (fileList: FileList | null) => void;
  removeFile: (id: string) => void;
  startProcessing: (onComplete?: () => void) => Promise<void>;
  clearQueue: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

let fileIdCounter = 0;

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Keep a ref to the files state so startProcessing always has the latest array
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

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
        status: "pending",
        progress: 0,
        file: f,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setFiles([]);
  }, []);

  const startProcessing = useCallback(async (onComplete?: () => void) => {
    const pending = filesRef.current.filter((f) => f.status === "pending");
    if (pending.length === 0 || isProcessing) return;

    setIsProcessing(true);
    let completedAny = false;

    for (const uploadFile of pending) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "extracting", progress: 30 } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", uploadFile.file);

        const response = await fetch(`${API_URL}/candidates/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Upload failed");
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f
          )
        );
        completedAny = true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "error", progress: 0, errorMessage: message }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
    if (completedAny && onComplete) {
      onComplete();
    }
  }, [isProcessing]);

  return (
    <UploadContext.Provider
      value={{
        files,
        isProcessing,
        addFiles,
        removeFile,
        startProcessing,
        clearQueue,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};
