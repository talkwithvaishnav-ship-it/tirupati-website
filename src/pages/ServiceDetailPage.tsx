import { TestimonialsSection } from "@/components/TestimonialsSection";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, FileCheck2, Layers } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs, PageHero } from "@/components/PageHero";
import { BeforeAfterSlider, FAQSection, InspectionCTA, ProcessTimeline, SectionHeading, ServicesGrid } from "@/components/MarketingSections";
import { cities, services, SITE_URL } from "@/data/content";
import NotFoundPage from "@/pages/NotFoundPage";
import { trackEvent } from "@/lib/api";
import { RelatedProjects } from "@/components/RelatedProjects";
import { ContactActions } from "@/components/ContactActions";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  useEffect(() => {
    if (service) trackEvent("service_viewed", { service: service.slug });
  }, [service]);
  if (!service) return <NotFoundPage />;
  const path = `/services/${service.slug}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: service.title, provider: { "@type": "Organization", name: "TIRUPATI INFRACARE" }, areaServed: cities.map((city) => city.name), url: `${SITE_URL}${path}`, description: service.short },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: service.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` }, { "@type": "ListItem", position: 3, name: service.title, item: `${SITE_URL}${path}` }] },
  ];
  return <>
    <Seo title={`${service.title} Services`} description={`${service.short} Inspection-led ${service.title.toLowerCase()} across Nagpur, Indore, Bhopal, Jabalpur and Chhindwara.`} path={path} image={service.image} schema={schema} />
    <section className="relative overflow-hidden pt-32"><img src={service.image} alt={`${service.title} service`} className="absolute inset-0 h-full w-full object-cover opacity-25" /><div className="absolute inset-0 bg-gradient-to-b from-[#06152F]/85 to-[#06152F]" /><div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-12"><Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.title }]} /><p className="font-mono text-xs uppercase tracking-[0.22em] text-[#00BFFF]">Professional Waterproofing</p><h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold sm:text-5xl lg:text-6xl">{service.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{service.short}</p><div className="mt-8 max-w-5xl"><ContactActions source={`service-${service.slug}`} compact /></div></div></section>
    <section className="py-14"><div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-12"><div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 lg:col-span-2"><h2 className="font-heading text-3xl font-bold">Understanding the Problem</h2><p className="mt-4 leading-8 text-slate-300">{service.problem}</p><div className="mt-8 grid gap-6 md:grid-cols-2"><div><h3 className="mb-4 font-heading text-xl font-semibold text-[#00BFFF]">Common Symptoms</h3><ul className="space-y-3 text-sm text-slate-300">{service.symptoms.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-[#00BFFF]" />{item}</li>)}</ul></div><div><h3 className="mb-4 font-heading text-xl font-semibold text-[#00BFFF]">Likely Causes</h3><ul className="space-y-3 text-sm text-slate-300">{service.causes.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-[#00BFFF]" />{item}</li>)}</ul></div></div></div><aside className="rounded-[2rem] border border-[#00BFFF]/25 bg-[#0B2255]/60 p-7"><h2 className="font-heading text-2xl font-bold">Recommended Solution</h2><p className="mt-4 text-sm leading-7 text-slate-300">{service.solution}</p><h3 className="mt-6 font-heading text-lg font-semibold text-[#00BFFF]">Key Benefits</h3><ul className="mt-3 space-y-2 text-sm text-slate-300">{service.benefits.map((benefit) => <li key={benefit} className="flex gap-2"><CheckCircle2 size={16} className="mt-1 shrink-0" />{benefit}</li>)}</ul><a data-testid="service-detail-inspection-btn" href="#inspection" className="mt-6 inline-flex rounded-full bg-[#FF7A00] px-6 py-3 font-bold">Book Free Inspection</a></aside></div></section>
    <section className="bg-[#081A38] py-16"><div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-12">{[{ icon: Layers, title: "Materials & Technology", items: service.materials }, { icon: Clock, title: "Expected Durability", items: [service.durability] }, { icon: FileCheck2, title: "Warranty Information", items: [service.warranty] }].map((card) => <article key={card.title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7"><card.icon className="mb-5 text-[#00BFFF]" size={28} /><h2 className="font-heading text-2xl font-bold">{card.title}</h2><ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">{card.items.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-[#00BFFF]" size={16} />{item}</li>)}</ul></article>)}</div></section>
    <ProcessTimeline /><BeforeAfterSlider />
    <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><RelatedProjects serviceSlug={service.slug} /></div></section>
    <FAQSection items={service.faqs} /><TestimonialsSection />
    <section className="pb-8"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><SectionHeading eyebrow="Local Service" title={`${service.title} near you`} /><div className="flex flex-wrap gap-3">{cities.map((city) => <Link data-testid={`service-city-${city.slug}`} key={city.slug} to={`/waterproofing/${city.slug}`} className="rounded-full border border-white/10 px-5 py-3 text-sm hover:border-[#00BFFF]">{city.name} <ArrowRight className="inline" size={14} /></Link>)}</div></div></section>
    <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><SectionHeading eyebrow="Related Services" title="Explore other protection systems" /><ServicesGrid limit={4} /></div></section>
    <InspectionCTA />
  </>;
}
