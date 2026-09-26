import React, { useState } from "react";
import { ImagePlus, Link2, UploadCloud, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { CloudinaryConfig, imageUrl, uploadToCloudinary } from "@/lib/cms";
import { PhotoAsset } from "@/types";

const input = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none focus:border-[#00BFFF]";

interface MediaInputProps {
  testId: string;
  label: string;
  kind: "image" | "video";
  value: PhotoAsset | null | undefined;
  onChange: (asset: PhotoAsset | null) => void;
  cloudinary: CloudinaryConfig;
  folder: string;
  className?: string;
}

const LIMITS = { image: 10 * 1024 * 1024, video: 100 * 1024 * 1024 };
const ACCEPT = { image: "image/jpeg,image/png,image/webp", video: "video/mp4,video/webm,video/quicktime" };

/** Cloudinary par file upload karo — ya Cloudinary Media Library se URL copy karke paste karo. */
export function MediaInput({ testId, label, kind, value, onChange, cloudinary, folder, className = "" }: MediaInputProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const canUpload = !!(cloudinary.cloudName && cloudinary.uploadPreset);

  const pick = async (file?: File | null) => {
    if (!file) return;
    if (file.size > LIMITS[kind]) {
      toast.error(kind === "video" ? "Video 100 MB se chhota hona chahiye (Cloudinary free plan limit)." : "Photo 10 MB se chhoti honi chahiye.");
      return;
    }
    if (!canUpload) {
      toast.error("Pehle upar 'Connection Settings' me Cloudinary cloud name aur upload preset bharo.");
      return;
    }
    setProgress(0);
    try {
      const asset = await uploadToCloudinary(file, cloudinary, { folder, resourceType: kind, onProgress: setProgress });
      onChange(asset);
      toast.success(`${label} uploaded.`);
    } catch (error: any) {
      toast.error(error?.message || "Upload failed.");
    } finally {
      setProgress(null);
    }
  };

  const Icon = kind === "video" ? UploadCloud : ImagePlus;

  return <div data-testid={testId} className={`rounded-xl border border-dashed border-[#00BFFF]/40 p-3 text-sm text-slate-300 ${className}`}>
    <div className="flex items-center gap-3">
      {value?.url && kind === "image" && <img src={imageUrl(value, 160)} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
      <label className="flex flex-1 cursor-pointer items-center gap-2">
        <Icon size={18} className="shrink-0 text-[#00BFFF]" />
        <span className="min-w-0 truncate">{label} {value?.url ? `• ${value.original_filename || "added"}` : ""}</span>
        <input type="file" accept={ACCEPT[kind]} className="sr-only" disabled={progress !== null} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      </label>
      <button type="button" title="Paste URL" onClick={() => setShowUrl(!showUrl)} className="rounded-lg border border-white/10 p-2"><Link2 size={14} /></button>
      {value?.url && <button type="button" title="Remove" onClick={() => onChange(null)} className="rounded-lg border border-red-400/30 p-2 text-red-300"><X size={14} /></button>}
    </div>
    {progress !== null && <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#00BFFF] transition-[width]" style={{ width: `${progress}%` }} /></div>}
    {progress !== null && <p className="mt-1 text-xs text-slate-400">Uploading… {progress}%</p>}
    {showUrl && <input className={`${input} mt-2`} placeholder="https://res.cloudinary.com/..." value={value?.url || ""} onChange={(e) => onChange(e.target.value.trim() ? { ...(value || {}), url: e.target.value.trim(), original_filename: value?.original_filename || "link" } : null)} />}
    {value?.url && <a href={value.url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs text-[#00BFFF] underline">{value.url}</a>}
  </div>;
}
