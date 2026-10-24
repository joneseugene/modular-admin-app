"use client";

import * as React from "react";
import { FileUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  value?: File[]; defaultValue?: File[]; onChange?: (files: File[]) => void; onBlur?: () => void;
  name?: string; id?: string; label?: string; description?: string; accept?: string; multiple?: boolean;
  maxFiles?: number; maxSizeMB?: number; disabled?: boolean; required?: boolean; error?: string; className?: string;
}

export function FileUpload({ value, defaultValue = [], onChange, onBlur, id, label = "Upload files", description, accept, multiple = false, maxFiles, maxSizeMB = 10, disabled = false, required = false, error, className }: FileUploadProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = React.useState<File[]>(defaultValue);
  const [localError, setLocalError] = React.useState("");
  const files = value ?? internalFiles;
  const limit = maxFiles ?? (multiple ? 5 : 1);
  const visibleError = error || localError;
  const errorId = `${inputId}-error`;

  const updateFiles = (next: File[]) => { if (value === undefined) setInternalFiles(next); onChange?.(next); };
  const handleSelection = (list: FileList | null) => {
    if (!list) return;
    const selected = Array.from(list);
    const combined = multiple ? [...files, ...selected] : selected.slice(0, 1);
    if (combined.length > limit) { setLocalError(`You can upload a maximum of ${limit} file${limit === 1 ? "" : "s"}.`); return; }
    const oversized = combined.find((file) => file.size > maxSizeMB * 1024 * 1024);
    if (oversized) { setLocalError(`${oversized.name} exceeds the ${maxSizeMB} MB file-size limit.`); return; }
    setLocalError("");
    updateFiles(combined);
    if (inputRef.current) inputRef.current.value = "";
  };
  const removeFile = (index: number) => { updateFiles(files.filter((_, fileIndex) => fileIndex !== index)); setLocalError(""); };

  return <div className={cn("space-y-2", className)}>
    {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>}
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <input ref={inputRef} id={inputId} type="file" accept={accept} multiple={multiple} disabled={disabled} required={required && files.length === 0} onChange={(event) => handleSelection(event.currentTarget.files)} onBlur={onBlur} aria-invalid={Boolean(visibleError)} aria-describedby={visibleError ? errorId : undefined} className="sr-only" />
    <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()} onBlur={onBlur} className={cn("flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-5 py-7 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", visibleError ? "border-red-400 bg-red-50/40" : "border-slate-300 bg-slate-50 hover:border-emerald-600 hover:bg-emerald-50/40")}>
      <span className="flex size-10 items-center justify-center rounded-full bg-white text-emerald-800 shadow-sm"><FileUp className="size-5" /></span>
      <span className="text-sm font-medium text-slate-900">Choose {multiple ? "files" : "a file"} or browse</span>
      <span className="text-xs text-slate-500">{accept ? `Accepted: ${accept}` : "Any file type"} · Max {maxSizeMB} MB each</span>
    </button>
    {files.length > 0 && <ul className="space-y-2">{files.map((file, index) => <li key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2">
      <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{file.name}</p><p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p></div>
      <button type="button" disabled={disabled} onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600 disabled:opacity-50"><X className="size-4" /></button>
    </li>)}</ul>}
    {visibleError && <p id={errorId} role="alert" className="text-sm text-red-600">{visibleError}</p>}
  </div>;
}
