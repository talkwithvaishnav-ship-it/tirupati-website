import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/MarketingSections";
import { getPublishedProjects, imageUrl } from "@/lib/cms";
import { Project } from "@/types";

const categories: Record<string, string> = {
  "terrace-waterproofing": "Terrace",
  "roof-waterproofing": "Roof",
  "bathroom-waterproofing": "Bathroom",
  "basement-waterproofing": "Basement",
  "wall-dampness-treatment": "Terrace",
  "crack-repair-sealing": "Terrace",
  "industrial-waterproofing": "Industrial",
  "commercial-waterproofing": "Commercial",
  "construction-waterproofing": "Commercial",
  "leakage-treatment": "Terrace",
  "new-construction-waterproofing": "Commercial",
  "repair-restoration": "Terrace",
};

export function RelatedProjects({ serviceSlug, city }: { serviceSlug?: string; city?: string }) {
  const projects = useMemo<Project[]>(() => {
    const category = serviceSlug ? categories[serviceSlug] : undefined;
    const data = getPublishedProjects(category);
    return city ? data.filter((project) => project.location.toLowerCase().includes(city.toLowerCase())) : data;
  }, [serviceSlug, city]);
  const loading = false;
  return <div><SectionHeading eyebrow="Projects" title={city ? `Verified projects in ${city}` : "Verified project examples"} text="Real project case studies appear here only after admin verification and publishing." />{loading ? <div className="rounded-[2rem] border border-white/10 p-8 text-slate-300">Loading projects...</div> : projects.length === 0 ? <div data-testid="related-projects-empty-state" className="rounded-[2rem] border border-dashed border-white/15 p-8 text-slate-300">Verified case studies for this page will appear here when available.</div> : <div className="grid gap-5 md:grid-cols-3">{projects.slice(0, 3).map((project) => <Link data-testid={`related-project-${project.slug}`} key={project.slug} to={`/projects/${project.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] transition-colors hover:border-[#00BFFF]/50"><img src={imageUrl(project.after_photo, 800)} alt={`${project.project_name} completed waterproofing`} loading="lazy" className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="p-5"><p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00BFFF]">{project.location}</p><h3 className="mt-2 font-heading text-xl font-bold">{project.project_name}</h3><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#00BFFF]">Read case study <ArrowRight size={15} /></span></div></Link>)}</div>}</div>;
}
