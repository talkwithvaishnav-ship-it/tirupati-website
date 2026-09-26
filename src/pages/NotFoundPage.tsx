import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";

export default function NotFoundPage() {
  return <section data-testid="not-found-page" className="flex min-h-screen items-center justify-center px-4 pt-20 text-center"><Seo title="Page Not Found" description="The requested Tirupati Infracare page could not be found." /><div><p className="font-mono text-sm tracking-[0.3em] text-[#00BFFF]">404</p><h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">This page is outside the protected area.</h1><p className="mx-auto mt-5 max-w-xl text-slate-300">The page may have moved, or the link may be incorrect. You can return home or request a waterproofing inspection.</p><Link data-testid="not-found-home-btn" to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-6 py-4 font-bold text-white"><ArrowLeft size={18} /> Return Home</Link></div></section>;
}
