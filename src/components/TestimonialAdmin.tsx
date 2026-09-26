import React, { useState } from "react";
import { Edit3, MessageSquareQuote, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { MediaInput } from "@/components/MediaInput";
import { cities, services } from "@/data/content";
import { CloudinaryConfig, imageUrl, newId } from "@/lib/cms";
import { PhotoAsset, Testimonial } from "@/types";

const input = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-[#00BFFF]";
const propertyTypes = ["Residential", "Apartment", "Villa / Bungalow", "Commercial", "Industrial", "Institutional"];
const initialForm = { customer_name: "", city: "Nagpur", service: services[0].title, rating: "5", review_text: "", property_type: "Residential", published: true, display_order: "0" };

export function TestimonialAdmin({ items, onChange, cloudinary }: { items: Testimonial[]; onChange: (items: Testimonial[]) => void; cloudinary: CloudinaryConfig }) {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState<PhotoAsset | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => { setEditing(null); setForm(initialForm); setPhoto(null); };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const fields = { ...form, rating: Number(form.rating), display_order: Number(form.display_order) || 0, photo_asset: photo };
    if (editing) {
      onChange(items.map((item) => item.id === editing.id ? { ...item, ...fields, updated_at: now } : item));
      toast.success("Testimonial updated. Click 'Publish to Website' to make it live.");
    } else {
      onChange([...items, { id: newId(), ...fields, created_at: now, updated_at: now }]);
      toast.success("Testimonial added. Click 'Publish to Website' to make it live.");
    }
    reset();
  };

  const startEdit = (item: Testimonial) => {
    setEditing(item); setPhoto(item.photo_asset || null);
    setForm({ customer_name: item.customer_name, city: item.city, service: item.service, rating: String(item.rating), review_text: item.review_text, property_type: item.property_type || "Residential", published: item.published, display_order: String(item.display_order) });
    document.querySelector("[data-testid='testimonial-form']")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const remove = (item: Testimonial) => { if (window.confirm(`Delete the review from "${item.customer_name}"?`)) onChange(items.filter((entry) => entry.id !== item.id)); };

  return <section data-testid="testimonial-admin-section" className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6">
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-heading text-2xl font-bold">Customer Testimonials</h2><p className="mt-1 text-sm text-slate-400">Publish only verified customer reviews. Customer photo is optional; the city tag powers local landing pages.</p></div><span data-testid="testimonial-count" className="rounded-full border border-[#00BFFF]/30 px-4 py-2 text-xs text-[#00BFFF]">{items.length} reviews</span></div>
    <form data-testid="testimonial-form" onSubmit={submit} className="grid gap-3 lg:grid-cols-3">
      <input data-testid="testimonial-name-input" required minLength={2} value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} className={input} placeholder="Customer Name" />
      <select data-testid="testimonial-city-select" value={form.city} onChange={(e) => update("city", e.target.value)} className={input}>{cities.map((city) => <option key={city.slug}>{city.name}</option>)}</select>
      <select data-testid="testimonial-service-select" value={form.service} onChange={(e) => update("service", e.target.value)} className={input}>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select>
      <textarea data-testid="testimonial-review-input" required minLength={10} value={form.review_text} onChange={(e) => update("review_text", e.target.value)} className={`${input} min-h-28 lg:col-span-2`} placeholder="Customer review (in their own words)" />
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3"><select data-testid="testimonial-rating-select" value={form.rating} onChange={(e) => update("rating", e.target.value)} className={input}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{`${n} Star${n > 1 ? "s" : ""}`}</option>)}</select><select data-testid="testimonial-property-select" value={form.property_type} onChange={(e) => update("property_type", e.target.value)} className={input}>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3"><input data-testid="testimonial-order-input" type="number" value={form.display_order} onChange={(e) => update("display_order", e.target.value)} className={input} placeholder="Display order" /><label className="flex items-center gap-2 text-sm text-slate-300"><input data-testid="testimonial-published-checkbox" type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Published</label></div>
      </div>
      <MediaInput testId="testimonial-photo-upload" label="Customer photo (optional)" kind="image" value={photo} onChange={setPhoto} cloudinary={cloudinary} folder="tirupati-infracare/testimonials" className="lg:col-span-2" />
      <div className="flex gap-3"><button data-testid="testimonial-save-btn" className="flex-1 rounded-xl bg-[#FF7A00] py-4 font-bold">{editing ? <Edit3 size={16} className="mr-2 inline" /> : <Plus size={16} className="mr-2 inline" />}{editing ? "Save Review" : "Add Review"}</button>{editing && <button data-testid="testimonial-cancel-edit-btn" type="button" onClick={reset} className="rounded-xl border border-white/10 px-5">Cancel</button>}</div>
    </form>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <article key={item.id} data-testid={`admin-testimonial-${item.id}`} className="rounded-2xl border border-white/10 bg-[#06152F] p-5">
      <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3">{item.photo_asset?.url ? <img src={imageUrl(item.photo_asset, 120)} alt={item.customer_name} className="h-12 w-12 rounded-full object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00BFFF]/15 text-[#00BFFF]"><MessageSquareQuote size={20} /></span>}<div><h3 className="font-heading text-lg font-semibold">{item.customer_name}</h3><p className="text-xs text-slate-400">{item.city} • {item.service}</p></div></div><span className={`rounded-full px-3 py-1 text-xs ${item.published ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>{item.published ? "Published" : "Hidden"}</span></div>
      <div className="mt-3 flex gap-0.5 text-[#FF7A00]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "" : "text-slate-600"} />)}</div>
      <p className="mt-3 line-clamp-3 text-sm text-slate-300">{item.review_text}</p>
      <div className="mt-4 flex gap-2"><button data-testid={`admin-testimonial-edit-${item.id}`} onClick={() => startEdit(item)} className="rounded-full border border-white/10 px-4 py-2 text-sm"><Edit3 size={14} className="mr-2 inline" />Edit</button><button data-testid={`admin-testimonial-delete-${item.id}`} onClick={() => remove(item)} className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300"><Trash2 size={14} className="mr-2 inline" />Delete</button></div>
    </article>)}</div>
    {items.length === 0 && <p data-testid="admin-testimonials-empty" className="mt-6 text-center text-sm text-slate-400">No testimonials yet. Add the first verified customer review above.</p>}
  </section>;
}
