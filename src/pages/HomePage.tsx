import { TestimonialsSection } from "@/components/TestimonialsSection";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Seo } from "@/components/Seo";
import { EstimateFunnel } from "@/components/EstimateFunnel";
import { AreasWeServeSection, BeforeAfterSlider, FAQSection, InspectionCTA, ProblemSection, ProcessTimeline, ServicesSection, WhyUsSection } from "@/components/MarketingSections";
import { WorkVideosSection } from "@/components/WorkVideosSection";
import { images, LOGO_URL, SITE_URL } from "@/data/content";
import { useSite } from "@/context/SiteContext";
import { trackEvent } from "@/lib/api";

export default function HomePage() {
  const { callHref, whatsappHref, openCall, openWhatsApp } = useSite();
  const call = () => callHref ? openCall("hero") : toast.info("Phone contact is being configured. Please submit an inspection request.");
  const whatsapp = () => whatsappHref ? openWhatsApp("hero") : toast.info("WhatsApp contact is being configured. Please submit an inspection request.");
  return <>
    <Seo title="Waterproofing Services in Maharashtra & Madhya Pradesh" description="Tirupati Infracare provides inspection-led terrace, roof, bathroom, basement, wall dampness, industrial, construction and leakage treatment solutions across Maharashtra and Madhya Pradesh." image={images.hero} schema={[{ "@context": "https://schema.org", "@type": "WebSite", name: "TIRUPATI INFRACARE", url: SITE_URL }]} />
    <section data-testid="hero-section" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <img src={images.hero} alt="Luxury modern home at night with protective waterproofing concept" className="absolute inset-0 h-full w-full object-cover opacity-60" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06152F] via-[#06152F]/82 to-[#06152F]/25" />
      <div className="rain-layer" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#06152F] to-transparent" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div>
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex items-center gap-4 sm:mb-8"><img src={LOGO_URL} alt="Tirupati Infracare logo" className="h-12 w-12 rounded-2xl border border-white/10 object-cover shadow-2xl sm:h-16 sm:w-16" /><span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00BFFF]">Construction Protection</span></motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="max-w-4xl font-heading text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">Protect Your Property From <span className="text-[#00BFFF]">Water Damage.</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:mt-6 sm:text-lg sm:leading-8">Advanced Waterproofing Solutions Built for Long-Lasting Protection.</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-3 text-xs font-medium text-slate-300 sm:mt-4 sm:text-sm">Terrace • Roof • Bathroom • Basement • Wall Dampness • Industrial Waterproofing</motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:gap-3"><a data-testid="hero-free-inspection-btn" href="#inspection" onClick={() => trackEvent("cta_click", { cta: "book_free_inspection", source: "hero" })} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF7A00] px-5 py-3 sm:px-7 sm:py-4 font-bold text-white shadow-2xl shadow-[#FF7A00]/25 transition-transform hover:-translate-y-1">Book Free Inspection <ArrowRight size={18} /></a><button data-testid="hero-talk-expert-btn" data-phone-href={callHref || ""} onClick={call} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 sm:px-7 sm:py-4 font-bold text-white backdrop-blur transition-colors hover:border-[#00BFFF]"><Phone size={18} /> Talk to an Expert</button><button data-testid="hero-whatsapp-btn" onClick={whatsapp} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#00BFFF]/40 px-5 py-3 sm:px-7 sm:py-4 font-bold text-[#00BFFF] transition-colors hover:bg-[#00BFFF]/10"><MessageCircle size={18} /> WhatsApp Us</button></motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-6 grid max-w-2xl gap-2.5 text-sm text-slate-200 sm:mt-9 sm:grid-cols-2 sm:gap-3">{["Professional Inspection", "Quality Waterproofing Systems", "Experienced Team", "Warranty Support"].map((item) => <span key={item} className="flex items-center gap-3"><CheckCircle2 className="text-[#00BFFF]" size={18} />{item}</span>)}</motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.7 }} className="relative hidden lg:block" aria-hidden="true">
          <div className="shield-shell relative mx-auto aspect-square max-w-[520px] rounded-[4rem] border border-[#00BFFF]/25 bg-[#00BFFF]/5 p-10 backdrop-blur-sm"><div className="absolute inset-8 rounded-[3rem] border border-[#00BFFF]/20" /><div className="absolute inset-16 rounded-[2.5rem] bg-gradient-to-br from-[#1557E8]/25 to-[#00BFFF]/5" /><ShieldCheck className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-[#00BFFF]/70" strokeWidth={1} /><div className="water-ripple" /></div>
        </motion.div>
      </div>
    </section>
    <ProblemSection />
    <ServicesSection />
    <WhyUsSection />
    <ProcessTimeline />
    <BeforeAfterSlider />
    <WorkVideosSection />
    <AreasWeServeSection />
    <section data-testid="estimate-section" className="bg-[#030B1B] py-20"><div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-12"><div><p className="font-mono text-xs uppercase tracking-[0.22em] text-[#00BFFF]">Estimate Funnel</p><h2 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">Tell us what needs protection.</h2><p className="mt-5 leading-8 text-slate-300">Share the service, approximate area, property type, city, contact details and leakage photos. No fake instant price is shown — the final estimate follows inspection.</p><Link data-testid="estimate-services-link" to="/services" className="mt-6 inline-flex items-center gap-2 font-bold text-[#00BFFF]">Explore all services <ArrowRight size={16} /></Link></div><EstimateFunnel /></div></section>
    <TestimonialsSection />
    <FAQSection />
    <InspectionCTA />
  </>;
}
