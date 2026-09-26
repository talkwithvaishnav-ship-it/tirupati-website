import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/MarketingSections";
import { getPublishedTestimonials, imageUrl } from "@/lib/cms";
import { Testimonial } from "@/types";

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");

export function TestimonialsSection({ city, service }: { city?: string; service?: string }) {
  const items = useMemo<Testimonial[]>(() => getPublishedTestimonials(city, service), [city, service]);
  const loading = false;

  const average = items.length ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1) : null;
  const schema = items.length ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "TIRUPATI INFRACARE",
    aggregateRating: { "@type": "AggregateRating", ratingValue: average, reviewCount: items.length, bestRating: 5, worstRating: 1 },
    review: items.map((item) => ({ "@type": "Review", author: { "@type": "Person", name: item.customer_name }, reviewRating: { "@type": "Rating", ratingValue: item.rating, bestRating: 5 }, reviewBody: item.review_text, datePublished: String(item.created_at || "").slice(0, 10) })),
  } : null;

  const heading = city ? `What ${city} customers say about Tirupati Infracare.` : "Verified customer reviews from Maharashtra & Madhya Pradesh.";

  return <section id="testimonials" data-testid="testimonials-section" className="bg-[#081A38] py-20 sm:py-28">
    {schema && <script type="application/ld+json" data-review-schema="true" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow="Testimonials" title={heading} text="Every review is added by the Tirupati Infracare team only after the work is completed and the customer has confirmed it. No invented ratings." />
        {average && <div data-testid="testimonials-summary" className="mb-10 flex items-center gap-4 rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 px-5 py-4"><span className="font-heading text-4xl font-bold text-white">{average}</span><div><div className="flex gap-0.5 text-[#FF7A00]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < Math.round(Number(average)) ? "currentColor" : "none"} />)}</div><p className="mt-1 text-xs text-slate-300">{items.length} verified review{items.length > 1 ? "s" : ""}</p></div></div>}
      </div>
      {loading && <div data-testid="testimonials-loading" className="rounded-[2rem] border border-white/10 p-8 text-center text-slate-300">Loading customer reviews...</div>}
      {!loading && items.length === 0 && <div data-testid="testimonials-empty-state" className="rounded-[2rem] border border-dashed border-white/15 p-8 text-center text-slate-300">{city ? `Verified reviews from ${city} customers will appear here after they are approved.` : "Verified customer testimonials will appear here after they are submitted and approved."}</div>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((item, index) => <motion.article key={item.id} data-testid={`testimonial-card-${item.id}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="relative flex flex-col rounded-[1.75rem] border border-white/10 bg-[#06152F] p-6 shadow-xl shadow-black/10 transition-[transform,border-color] hover:-translate-y-1 hover:border-[#00BFFF]/50">
        <Quote className="absolute right-6 top-6 text-[#00BFFF]/20" size={40} />
        <div className="flex gap-0.5 text-[#FF7A00]" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "" : "text-slate-600"} />)}</div>
        <p className="mt-4 flex-1 text-sm leading-7 text-slate-200">“{item.review_text}”</p>
        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
          {item.photo_asset ? <img data-testid={`testimonial-photo-${item.id}`} src={imageUrl(item.photo_asset, 160)} alt={`${item.customer_name}, ${item.city}`} loading="lazy" className="h-12 w-12 rounded-full border border-[#00BFFF]/40 object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00BFFF]/15 font-heading font-bold text-[#00BFFF]">{initials(item.customer_name)}</span>}
          <div className="min-w-0"><p className="truncate font-heading font-semibold text-white">{item.customer_name}</p><p className="truncate text-xs text-slate-400">{item.service}{item.property_type ? ` • ${item.property_type}` : ""}</p></div>
          <span data-testid={`testimonial-city-${item.id}`} className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/10 px-3 py-1 text-xs font-semibold text-[#00BFFF]"><MapPin size={12} /> {item.city}</span>
        </div>
      </motion.article>)}</div>
    </div>
  </section>;
}
