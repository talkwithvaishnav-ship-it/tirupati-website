import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400" data-testid="breadcrumb-navigation"><Link data-testid="breadcrumb-home" to="/" className="hover:text-[#00BFFF]">Home</Link>{items.map((item) => <span key={item.label} className="flex items-center gap-2"><ChevronRight size={14} />{item.href ? <Link data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, "-")}`} to={item.href} className="hover:text-[#00BFFF]">{item.label}</Link> : <span className="text-white">{item.label}</span>}</span>)}</nav>;
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="relative overflow-hidden pb-16 pt-36 sm:pb-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(21,87,232,0.25),transparent_35%)]" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><p className="font-mono text-xs uppercase tracking-[0.22em] text-[#00BFFF]">{eyebrow}</p><h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{text}</p></div></section>;
}
