import React, { useState } from "react";
import { Edit3, Plus, Trash2, Video } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { MediaInput } from "@/components/MediaInput";
import { cities, services } from "@/data/content";
import { CloudinaryConfig, newId, videoPosterUrl } from "@/lib/cms";
import { PhotoAsset, WorkVideo } from "@/types";

const input = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-[#00BFFF]";
const initialForm = { title: "", description: "", service_category: services[0].title, location: "Nagpur", active: true, display_order: "0" };

export function VideoAdmin({ videos, onChange, cloudinary }: { videos: WorkVideo[]; onChange: (videos: WorkVideo[]) => void; cloudinary: CloudinaryConfig }) {
  const [form, setForm] = useState(initialForm);
  const [videoFile, setVideoFile] = useState<PhotoAsset | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<PhotoAsset | null>(null);
  const [editing, setEditing] = useState<WorkVideo | null>(null);
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => { setEditing(null); setForm(initialForm); setVideoFile(null); setThumbnailFile(null); };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!videoFile?.url) { toast.error("Please upload a video (or paste its Cloudinary URL)."); return; }
    const now = new Date().toISOString();
    const fields = { ...form, display_order: Number(form.display_order) || 0, video_asset: videoFile, thumbnail_asset: thumbnailFile };
    if (editing) {
      onChange(videos.map((item) => item.id === editing.id ? { ...item, ...fields, updated_at: now } : item));
      toast.success("Video updated. Click 'Publish to Website' to make it live.");
    } else {
      onChange([...videos, { id: newId(), ...fields, created_at: now, updated_at: now }]);
      toast.success("Video added. Click 'Publish to Website' to make it live.");
    }
    reset();
  };

  const startEdit = (video: WorkVideo) => {
    setEditing(video);
    setForm({ title: video.title, description: video.description, service_category: video.service_category || services[0].title, location: video.location || "Nagpur", active: video.active, display_order: String(video.display_order) });
    setVideoFile(video.video_asset); setThumbnailFile(video.thumbnail_asset || null);
    document.querySelector("[data-testid='video-upload-form']")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const remove = (video: WorkVideo) => { if (window.confirm(`Delete "${video.title}" from the website?`)) onChange(videos.filter((item) => item.id !== video.id)); };

  return <section data-testid="video-admin-section" className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6">
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-heading text-2xl font-bold">Video Management</h2><p className="mt-1 text-sm text-slate-400">Upload only real Tirupati Infracare work videos (max 100 MB each). Thumbnail is optional — if left empty, it is generated automatically from the video.</p></div><span className="rounded-full border border-[#00BFFF]/30 px-4 py-2 text-xs text-[#00BFFF]">{videos.length} videos</span></div>
    <form data-testid="video-upload-form" onSubmit={submit} className="grid gap-3 lg:grid-cols-3">
      <input data-testid="video-title-input" required minLength={3} value={form.title} onChange={(e) => update("title", e.target.value)} className={input} placeholder="Video Title" />
      <select data-testid="video-category-select" value={form.service_category} onChange={(e) => update("service_category", e.target.value)} className={input}>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select>
      <select data-testid="video-location-select" value={form.location} onChange={(e) => update("location", e.target.value)} className={input}>{cities.map((city) => <option key={city.slug}>{city.name}</option>)}</select>
      <textarea data-testid="video-description-input" required minLength={10} value={form.description} onChange={(e) => update("description", e.target.value)} className={`${input} min-h-24 lg:col-span-2`} placeholder="Short description" />
      <div className="grid gap-3"><input data-testid="video-order-input" type="number" value={form.display_order} onChange={(e) => update("display_order", e.target.value)} className={input} placeholder="Display order" /><label className="flex items-center gap-2 text-sm text-slate-300"><input data-testid="video-active-checkbox" type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} /> Active</label></div>
      <MediaInput testId="video-file-upload" label="Video File" kind="video" value={videoFile} onChange={setVideoFile} cloudinary={cloudinary} folder="tirupati-infracare/videos" />
      <MediaInput testId="video-thumbnail-upload" label="Thumbnail (optional)" kind="image" value={thumbnailFile} onChange={setThumbnailFile} cloudinary={cloudinary} folder="tirupati-infracare/videos/thumbnails" />
      <div className="flex gap-3"><button data-testid="video-save-btn" className="flex-1 rounded-xl bg-[#FF7A00] py-4 font-bold">{editing ? <Edit3 size={16} className="mr-2 inline" /> : <Plus size={16} className="mr-2 inline" />}{editing ? "Save Video" : "Add Video"}</button>{editing && <button data-testid="video-cancel-edit-btn" type="button" onClick={reset} className="rounded-xl border border-white/10 px-5">Cancel</button>}</div>
    </form>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{videos.map((video) => { const poster = videoPosterUrl(video, 480); return <article key={video.id} data-testid={`admin-video-${video.id}`} className="rounded-2xl border border-white/10 bg-[#06152F] p-5">{poster ? <img src={poster} alt="" className="mb-3 aspect-video w-full rounded-lg object-cover" /> : <Video className="mb-3 text-[#00BFFF]" />}<div className="flex items-start justify-between gap-3"><div><h3 className="font-heading text-lg font-semibold">{video.title}</h3><p className="mt-1 text-xs text-slate-400">{video.location || "No location"} • Order {video.display_order}</p></div><span className={`rounded-full px-3 py-1 text-xs ${video.active ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>{video.active ? "Active" : "Inactive"}</span></div><p className="mt-3 line-clamp-2 text-sm text-slate-300">{video.description}</p><div className="mt-4 flex gap-4 text-xs"><a data-testid={`admin-video-file-${video.id}`} href={video.video_asset.url} target="_blank" rel="noreferrer" className="text-[#00BFFF] underline">Video file</a></div><div className="mt-4 flex gap-2"><button data-testid={`admin-video-edit-${video.id}`} onClick={() => startEdit(video)} className="rounded-full border border-white/10 px-4 py-2 text-sm"><Edit3 size={14} className="mr-2 inline" />Edit</button><button data-testid={`admin-video-delete-${video.id}`} onClick={() => remove(video)} className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300"><Trash2 size={14} className="mr-2 inline" />Delete</button></div></article>; })}</div>
  </section>;
}
