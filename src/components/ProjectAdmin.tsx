import React, { useState } from "react";
import { Edit3, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { MediaInput } from "@/components/MediaInput";
import { cities, services } from "@/data/content";
import { CloudinaryConfig, imageUrl, newId, projectSlug } from "@/lib/cms";
import { PhotoAsset, Project } from "@/types";

const input = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-[#00BFFF]";
const initialForm = { project_name: "", location: "Nagpur", service: services[0].title, category: "Terrace", area: "", completion_date: "", description: "", problem: "", inspection: "", solution: "", result: "", published: true };

export function ProjectAdmin({ projects, onChange, cloudinary }: { projects: Project[]; onChange: (projects: Project[]) => void; cloudinary: CloudinaryConfig }) {
  const [form, setForm] = useState(initialForm);
  const [beforePhoto, setBeforePhoto] = useState<PhotoAsset | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<PhotoAsset | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => { setEditing(null); setForm(initialForm); setBeforePhoto(null); setAfterPhoto(null); };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!beforePhoto?.url || !afterPhoto?.url) { toast.error("Please add both before and after photos."); return; }
    if (Number(form.area) <= 0) { toast.error("Project area must be greater than zero."); return; }
    const now = new Date().toISOString();
    const fields = { ...form, area: Number(form.area), category: form.category as Project["category"], before_photo: beforePhoto, after_photo: afterPhoto };
    if (editing) {
      onChange(projects.map((item) => item.id === editing.id ? { ...item, ...fields, slug: item.slug } : item));
      toast.success("Project updated. Click 'Publish to Website' to make it live.");
    } else {
      const slug = projectSlug(form.project_name);
      if (projects.some((item) => item.slug === slug)) { toast.error("A project with a similar name already exists."); return; }
      onChange([{ id: newId(), slug, ...fields, created_at: now }, ...projects]);
      toast.success("Project added. Click 'Publish to Website' to make it live.");
    }
    reset();
  };

  const startEdit = (project: Project) => {
    setEditing(project);
    setForm({ project_name: project.project_name, location: project.location, service: project.service, category: project.category, area: String(project.area), completion_date: project.completion_date, description: project.description, problem: project.problem, inspection: project.inspection, solution: project.solution, result: project.result, published: project.published });
    setBeforePhoto(project.before_photo); setAfterPhoto(project.after_photo);
    document.querySelector("[data-testid='project-admin-form']")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const togglePublish = (project: Project) => onChange(projects.map((item) => item.id === project.id ? { ...item, published: !item.published } : item));
  const remove = (project: Project) => { if (window.confirm(`Delete "${project.project_name}" from the website?`)) onChange(projects.filter((item) => item.id !== project.id)); };

  return <section data-testid="project-admin-section" className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6">
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-heading text-2xl font-bold">Project Publishing</h2><p className="mt-1 text-sm text-slate-400">Add only verified projects with real before-and-after photos.</p></div><span className="rounded-full border border-[#00BFFF]/30 px-4 py-2 text-xs text-[#00BFFF]">{projects.length} projects</span></div>
    <form data-testid="project-admin-form" onSubmit={submit} className="grid gap-3 lg:grid-cols-3">
      <input data-testid="project-name-input" required minLength={3} value={form.project_name} onChange={(e) => update("project_name", e.target.value)} className={input} placeholder="Project Name" />
      <select data-testid="project-location-select" value={form.location} onChange={(e) => update("location", e.target.value)} className={input}>{cities.map((city) => <option key={city.slug}>{city.name}</option>)}</select>
      <select data-testid="project-service-select" value={form.service} onChange={(e) => update("service", e.target.value)} className={input}>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select>
      <select data-testid="project-category-select" value={form.category} onChange={(e) => update("category", e.target.value)} className={input}>{["Terrace", "Roof", "Bathroom", "Basement", "Commercial", "Industrial"].map((category) => <option key={category}>{category}</option>)}</select>
      <input data-testid="project-area-input" required type="number" min="1" value={form.area} onChange={(e) => update("area", e.target.value)} className={input} placeholder="Area in Sq Ft" />
      <input data-testid="project-date-input" required type="date" value={form.completion_date} onChange={(e) => update("completion_date", e.target.value)} className={input} aria-label="Completion date" />
      <textarea data-testid="project-description-input" required minLength={20} value={form.description} onChange={(e) => update("description", e.target.value)} className={`${input} min-h-24 lg:col-span-3`} placeholder="Project Description" />
      <textarea data-testid="project-problem-input" required value={form.problem} onChange={(e) => update("problem", e.target.value)} className={`${input} min-h-24`} placeholder="Problem" />
      <textarea data-testid="project-inspection-input" required value={form.inspection} onChange={(e) => update("inspection", e.target.value)} className={`${input} min-h-24`} placeholder="Inspection" />
      <textarea data-testid="project-solution-input" required value={form.solution} onChange={(e) => update("solution", e.target.value)} className={`${input} min-h-24`} placeholder="Solution" />
      <textarea data-testid="project-result-input" required value={form.result} onChange={(e) => update("result", e.target.value)} className={`${input} min-h-24 lg:col-span-3`} placeholder="Result" />
      <MediaInput testId="project-before-upload" label="Before Photo" kind="image" value={beforePhoto} onChange={setBeforePhoto} cloudinary={cloudinary} folder="tirupati-infracare/projects" />
      <MediaInput testId="project-after-upload" label="After Photo" kind="image" value={afterPhoto} onChange={setAfterPhoto} cloudinary={cloudinary} folder="tirupati-infracare/projects" />
      <div className="grid gap-3"><label className="flex items-center gap-2 text-sm text-slate-300"><input data-testid="project-published-checkbox" type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Published</label><div className="flex gap-3"><button data-testid="project-publish-btn" className="flex-1 rounded-xl bg-[#FF7A00] py-4 font-bold">{editing ? <Edit3 size={16} className="mr-2 inline" /> : <Plus size={16} className="mr-2 inline" />}{editing ? "Save Project" : "Add Project"}</button>{editing && <button type="button" onClick={reset} className="rounded-xl border border-white/10 px-5">Cancel</button>}</div></div>
    </form>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <article key={project.id} data-testid={`admin-project-${project.slug}`} className="rounded-2xl border border-white/10 bg-[#06152F] p-5"><div className="grid grid-cols-2 gap-2">{[project.before_photo, project.after_photo].map((photo, i) => <img key={i} src={imageUrl(photo, 300)} alt="" className="h-24 w-full rounded-lg object-cover" />)}</div><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="font-heading text-lg font-semibold">{project.project_name}</h3><p className="mt-1 text-xs text-slate-400">{project.location} • {project.category} • {project.area} sq ft</p></div><span className={`rounded-full px-3 py-1 text-xs ${project.published ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>{project.published ? "Published" : "Draft"}</span></div><p className="mt-3 line-clamp-2 text-sm text-slate-300">{project.description}</p><div className="mt-4 flex flex-wrap gap-2"><button data-testid={`admin-project-edit-${project.slug}`} onClick={() => startEdit(project)} className="rounded-full border border-white/10 px-4 py-2 text-sm"><Edit3 size={14} className="mr-2 inline" />Edit</button><button data-testid={`admin-project-toggle-${project.slug}`} onClick={() => togglePublish(project)} className="rounded-full border border-white/10 px-4 py-2 text-sm">{project.published ? <EyeOff size={14} className="mr-2 inline" /> : <Eye size={14} className="mr-2 inline" />}{project.published ? "Unpublish" : "Publish"}</button><button data-testid={`admin-project-delete-${project.slug}`} onClick={() => remove(project)} className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300"><Trash2 size={14} className="mr-2 inline" />Delete</button></div></article>)}</div>
  </section>;
}
