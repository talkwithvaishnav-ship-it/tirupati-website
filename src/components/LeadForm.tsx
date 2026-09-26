import React, { useState } from "react";
import { Camera, CheckCircle2, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { cities, services } from "@/data/content";
import { sendLeadToWhatsApp, trackEvent } from "@/lib/api";
import { newLeadId } from "@/lib/cms";
import { useSite } from "@/context/SiteContext";

const inputClass = "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#00BFFF]";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState({ name: "", phone: "", whatsapp_number: "", email: "", city: "Nagpur", service: services[0].title, property_type: "Residential", approximate_area: "", preferred_contact_time: "", preferred_inspection_date: "", problem_description: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const { settings, callHref, whatsappHref, openCall, openWhatsApp } = useSite();

  const update = (key: string, value: string) => {
    if (!started) {
      setStarted(true);
      trackEvent("inspection_form_started");
    }
    setForm((current) => ({ ...current, [key]: value }));
  };

  const buildWhatsAppMessage = (leadId: string) => [
    "Hello Tirupati Infracare,",
    "I would like to request a waterproofing inspection/estimate.",
    `Name: ${form.name}`,
    `Mobile: ${form.phone}`,
    form.whatsapp_number ? `WhatsApp Number: ${form.whatsapp_number}` : "",
    `City: ${form.city}`,
    `Property Type: ${form.property_type}`,
    `Service Required: ${form.service}`,
    form.approximate_area ? `Approx Area: ${form.approximate_area} sq ft` : "",
    `Requirement: ${form.problem_description || "Not provided"}`,
    form.preferred_contact_time ? `Preferred Contact Time: ${form.preferred_contact_time}` : "",
    form.preferred_inspection_date ? `Preferred Inspection Date: ${form.preferred_inspection_date}` : "",
    `Lead ID: ${leadId}`,
    "Please contact me regarding this requirement.",
    "Thank you.",
  ].filter(Boolean).join("\n");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!settings.whatsapp_number) {
      toast.info("WhatsApp contact is being configured. Please call us directly.");
      return;
    }
    setLoading(true);
    const leadId = newLeadId();
    trackEvent("inspection_form_submitted", { service: form.service, city: form.city });
    trackEvent("whatsapp_click", { source: "inspection-form" });
    toast.info("WhatsApp is opening with your enquiry details. Please tap Send to submit your enquiry.");
    try {
      const { photoError } = await sendLeadToWhatsApp({ whatsappNumber: settings.whatsapp_number, message: buildWhatsAppMessage(leadId), photos, leadId });
      if (photoError) toast.error("Photos could not be uploaded. Please attach them directly in the WhatsApp chat.");
      setSubmitted(leadId);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <div data-testid="lead-form-success" className="rounded-[2rem] border border-[#00BFFF]/30 bg-[#0B2255]/70 p-8 text-center"><CheckCircle2 className="mx-auto mb-4 text-[#00BFFF]" size={44} /><h3 className="font-heading text-2xl font-bold">WhatsApp is opening with your enquiry details.</h3><p className="mt-3 text-slate-300">Please tap Send in WhatsApp to submit your enquiry. Lead ID: <span className="font-mono text-white">{submitted}</span></p><p className="mt-2 text-sm text-slate-400">Final estimate will be provided after inspection.</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><button data-testid="lead-success-call-btn" onClick={() => callHref ? openCall("lead-success") : toast.info("Phone contact is being configured.")} className="rounded-2xl border border-white/10 px-4 py-3">Call Now</button><button data-testid="lead-success-whatsapp-btn" onClick={() => whatsappHref ? openWhatsApp("lead-success", `Hello Tirupati Infracare, my lead ID is ${submitted}.`) : toast.info("WhatsApp contact is being configured.")} className="rounded-2xl border border-white/10 px-4 py-3">WhatsApp</button><button data-testid="lead-success-new-request-btn" onClick={() => setSubmitted("")} className="rounded-2xl bg-[#FF7A00] px-4 py-3 font-bold">Book Inspection</button></div></div>;

  return <form data-testid="inspection-lead-form" onSubmit={submit} className="grid gap-4">
    <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}><input data-testid="lead-form-name-input" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full Name *" className={inputClass} /><input data-testid="lead-form-phone-input" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Mobile Number *" inputMode="tel" className={inputClass} /><input data-testid="lead-form-whatsapp-input" value={form.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} placeholder="WhatsApp Number (optional)" inputMode="tel" className={inputClass} /><input data-testid="lead-form-email-input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email (optional)" className={inputClass} /><select data-testid="lead-form-city-select" required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass}>{cities.map((city) => <option key={city.slug}>{city.name}</option>)}</select><select data-testid="lead-form-service-select" required value={form.service} onChange={(e) => update("service", e.target.value)} className={inputClass}>{[...services.map((service) => service.title), "Repair / Leakage Treatment", "Other"].filter((item, index, array) => array.indexOf(item) === index).map((service) => <option key={service}>{service}</option>)}</select><input data-testid="lead-form-area-input" value={form.approximate_area} onChange={(e) => update("approximate_area", e.target.value)} placeholder="Approx Area (Sq Ft)" inputMode="decimal" className={inputClass} /><input data-testid="lead-form-date-input" type="date" value={form.preferred_inspection_date} onChange={(e) => update("preferred_inspection_date", e.target.value)} className={inputClass} aria-label="Preferred inspection date" /><select data-testid="lead-form-property-select" value={form.property_type} onChange={(e) => update("property_type", e.target.value)} className={inputClass}>{["Residential", "Commercial", "Industrial", "Apartment/Society", "Other"].map((type) => <option key={type}>{type}</option>)}</select><input data-testid="lead-form-contact-time-input" value={form.preferred_contact_time} onChange={(e) => update("preferred_contact_time", e.target.value)} placeholder="Preferred Contact Time (optional)" className={inputClass} /></div>
    <textarea data-testid="lead-form-problem-textarea" value={form.problem_description} onChange={(e) => update("problem_description", e.target.value)} placeholder="Describe the leakage or dampness problem" className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[#00BFFF]" />
    <label data-testid="lead-form-photo-upload-label" className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#00BFFF]/40 bg-[#00BFFF]/5 p-5 text-sm text-slate-300 transition-colors hover:bg-[#00BFFF]/10"><Upload size={18} /> Upload leakage photos ({photos.length}/5)<input data-testid="lead-form-photo-input" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => setPhotos(Array.from(e.target.files || []).slice(0, 5))} /></label>
    {photos.length > 0 && <div data-testid="lead-form-photo-list" className="flex flex-wrap gap-2 text-xs text-slate-400">{photos.map((photo) => <span key={photo.name} className="rounded-full bg-white/10 px-3 py-1"><Camera size={12} className="mr-1 inline" />{photo.name}</span>)}</div>}
    <button data-testid="lead-form-submit-btn" disabled={loading} className="rounded-2xl bg-[#FF7A00] px-6 py-4 font-bold text-white shadow-xl shadow-[#FF7A00]/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60">{loading ? "Submitting..." : "BOOK FREE INSPECTION"}</button>
  </form>;
}
