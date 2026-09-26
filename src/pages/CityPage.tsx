import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/PageHero";
import { FAQSection, InspectionCTA, ProcessTimeline, SectionHeading, ServicesGrid } from "@/components/MarketingSections";
import { blogPosts, cities, faqs, images, SITE_URL } from "@/data/content";
import NotFoundPage from "@/pages/NotFoundPage";
import { RelatedProjects } from "@/components/RelatedProjects";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactActions } from "@/components/ContactActions";

export default function CityPage() {
  const { citySlug } = useParams();
  const city = cities.find((item) => item.slug === citySlug);
  if (!city) return <NotFoundPage />;
  const path = `/waterproofing/${city.slug}`;
  const cityFaqs = [{ question: `Do you provide waterproofing inspection in ${city.name}?`, answer: `Yes. Inspection requests for ${city.name} can be submitted through the website, and scheduling is confirmed by the team.` }, ...faqs.slice(0, 3)];
  return <>
    <Seo title={city.title} description={`${city.description} Services include terrace, roof, bathroom, basement, wall dampness, industrial and commercial waterproofing.`} path={path} image={images.modernHome} schema={[{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: city.title, item: `${SITE_URL}${path}` }] }]} />
    <section className="relative overflow-hidden pt-32"><img src={images.modernHome} alt={`Modern home representing waterproofing services in ${city.name}`} className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-b from-[#06152F]/80 to-[#06152F]" /><div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-12"><Breadcrumbs items={[{ label: "Locations" }, { label: city.name }]} /><p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#00BFFF]"><MapPin size={14} /> Local Waterproofing</p><h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold sm:text-5xl lg:text-6xl">{city.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{city.description}</p><div className="mt-8 max-w-5xl"><ContactActions source={`city-${city.slug}`} compact /></div></div></section>
    <section className="py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><SectionHeading eyebrow="Local Problems" title={`Common waterproofing concerns in ${city.name}`} /><div className="grid gap-4 md:grid-cols-3">{city.localProblems.map((problem) => <div key={problem} data-testid={`city-problem-${problem.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><CheckCircle2 className="mb-4 text-[#00BFFF]" /><h2 className="font-heading text-xl font-semibold">{problem}</h2><p className="mt-3 text-sm leading-7 text-slate-300">An on-site inspection confirms the exact source, affected area, repair scope and suitable waterproofing system.</p></div>)}</div></div></section>
    <section className="bg-[#081A38] py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><SectionHeading eyebrow="Services" title={`Waterproofing services available in ${city.name}`} text="Choose the affected area to understand symptoms, causes, recommended process, durability and warranty documentation." /><ServicesGrid /></div></section>
    <ProcessTimeline />
    <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><RelatedProjects city={city.name} /></div></section>
    <section className="pb-10"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12"><SectionHeading eyebrow="Guides" title="Helpful waterproofing resources" /><div className="grid gap-4 md:grid-cols-3">{blogPosts.slice(0, 3).map((post) => <Link data-testid={`city-blog-${post.slug}`} key={post.slug} to={`/blog/${post.slug}`} className="rounded-3xl border border-white/10 p-5 transition-colors hover:border-[#00BFFF]"><h3 className="font-heading text-lg font-semibold">{post.title}</h3><span className="mt-4 inline-flex items-center gap-2 text-sm text-[#00BFFF]">Read guide <ArrowRight size={15} /></span></Link>)}</div></div></section>
    <FAQSection items={cityFaqs} />
    <TestimonialsSection city={city.name} />
    <InspectionCTA />
  </>;
}
