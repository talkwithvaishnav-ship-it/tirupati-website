import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { cities } from "@/data/content";
import { sendLeadToWhatsApp, trackEvent } from "@/lib/api";
import { newLeadId } from "@/lib/cms";
import { useSite } from "@/context/SiteContext";

const optionClass = "rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition-colors hover:border-[#00BFFF] hover:bg-[#1557E8]/20";
const inputClass = "h-13 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none placeholder:text-slate-500 focus:border-[#00BFFF]";
const steps = ["Need", "Area", "Property", "Location", "Name", "Mobile", "Photos"];

export function EstimateFunnel() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [form, setForm] = useState({ service: "Terrace Waterproofing", approximate_area: "", property_type: "Residential", city: "Nagpur", name: "", phone: "", whatsapp_number: "", preferred_contact_time: "", problem_description: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [leadId, setLeadId] = useState("");
  const [loading, setLoading] = useState(false);
  const { settings, callHref, whatsappHref, openCall, openWhatsApp } = useSite();
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const begin = () => { if (!started) { setStarted(true); trackEvent("estimate_started"); } };
  const next = () => { begin(); setStep(Math.min(step + 1, steps.length - 1)); };
  const canNext = step !== 1 || Number(form.approximate_area) > 0;

  const buildWhatsAppMessage = (id: string) => [
    "Hello Tirupati Infracare,",
    "I would like to request a waterproofing inspection/estimate.",
    `Name: ${form.name}`,
    `Mobile: ${form.phone}`,
    form.whatsapp_number ? `WhatsApp Number: ${form.whatsapp_number}` : "",
    `City: ${form.city}`,
    `Property Type: ${form.property_type}`,
    `Service Required: ${form.service}`,
    `Approx Area: ${form.approximate_area} sq ft`,
    `Requirement: ${form.problem_description || "Not provided"}`,
    form.preferred_contact_time ? `Preferred Contact Time: ${form.preferred_contact_time}` : "",
    `Lead ID: ${id}`,
    "Please contact me regarding this requirement.",
    "Thank you.",
  ].filter(Boolean).join("\n");

  const submit = async () => {
    if (!settings.whatsapp_number) { toast.info("WhatsApp contact is being configured. Please call us directly."); return; }
    setLoading(true);
    const id = newLeadId();
    trackEvent("whatsapp_click", { source: "estimate-form" });
    toast.info("WhatsApp is opening with your enquiry details. Please tap Send to submit your enquiry.");
    try {
      const { photoError } = await sendLeadToWhatsApp({ whatsappNumber: settings.whatsapp_number, message: buildWhatsAppMessage(id), photos, leadId: id });
      if (photoError) toast.error("Photos could not be uploaded. Please attach them directly in the WhatsApp chat.");
      setLeadId(id);
      trackEvent("estimate_completed", { service: form.service, city: form.city });
    } finally { setLoading(false); }
  };

  if (leadId) return <div data-testid="estimate-success" className="rounded-[2rem] border border-[#00BFFF]/30 bg-[#0B2255] p-8 text-center"><CheckCircle2 className="mx-auto mb-4 text-[#00BFFF]" size={48} /><h3 className="font-heading text-3xl font-bold">WhatsApp is opening with your enquiry details.</h3><p className="mt-3 text-slate-300">Please tap Send in WhatsApp to submit your enquiry. Lead ID: <span className="font-mono text-white">{leadId}</span></p><p className="mt-2 text-sm text-slate-400">Final estimate will be provided after inspection.</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><button data-testid="estimate-success-call" onClick={() => callHref ? openCall("estimate-success") : toast.info("Phone contact is being configured.")} className="rounded-2xl border border-white/10 py-3">Call Now</button><button data-testid="estimate-success-whatsapp" onClick={() => whatsappHref ? openWhatsApp("estimate-success", `Hello Tirupati Infracare, my estimate lead ID is ${leadId}.`) : toast.info("WhatsApp contact is being configured.")} className="rounded-2xl border border-white/10 py-3">WhatsApp</button><button data-testid="estimate-success-inspection" onClick={() => document.querySelector("#inspection")?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl bg-[#FF7A00] py-3 font-bold">Book Inspection</button></div></div>;

  return <div data-testid="estimate-funnel" className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-8">
    <div className="mb-6 flex items-center justify-between gap-3"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00BFFF]">Get Your Estimate</p><h3 className="mt-2 font-heading text-2xl font-bold">Step {step + 1}: {steps[step]}</h3></div><div className="h-2 w-28 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#00BFFF] transition-[width]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div></div>
    {step === 0 && <div data-testid="estimate-step-service" className="grid gap-3 sm:grid-cols-2">{["Terrace Waterproofing", "Roof Waterproofing", "Bathroom Waterproofing", "Basement Waterproofing", "Wall Dampness", "Industrial Waterproofing", "New Construction Waterproofing", "Repair / Leakage Treatment", "Other"].map((item) => <button key={item} data-testid={`estimate-service-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} onClick={() => { begin(); update("service", item); }} className={`${optionClass} ${form.service === item ? "border-[#00BFFF] bg-[#1557E8]/30" : ""}`}>{item}</button>)}</div>}
    {step === 1 && <input data-testid="estimate-area-input" value={form.approximate_area} onChange={(e) => update("approximate_area", e.target.value)} className={inputClass} placeholder="Approximate Area in Square Feet" inputMode="decimal" />}
    {step === 2 && <div data-testid="estimate-step-property" className="grid gap-3 sm:grid-cols-3">{["Residential", "Commercial", "Industrial", "Apartment/Society", "Other"].map((item) => <button key={item} data-testid={`estimate-property-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} onClick={() => update("property_type", item)} className={`${optionClass} ${form.property_type === item ? "border-[#00BFFF]" : ""}`}>{item}</button>)}</div>}
    {step === 3 && <select data-testid="estimate-city-select" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass}>{cities.map((city) => <option key={city.slug}>{city.name}</option>)}</select>}
    {step === 4 && <div className="grid gap-3"><input data-testid="estimate-name-input" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="Your Name *" /><input data-testid="estimate-whatsapp-input" value={form.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} className={inputClass} placeholder="WhatsApp Number (optional)" inputMode="tel" /></div>}
    {step === 5 && <div className="grid gap-3"><input data-testid="estimate-mobile-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="Mobile Number *" inputMode="tel" /><input data-testid="estimate-contact-time-input" value={form.preferred_contact_time} onChange={(e) => update("preferred_contact_time", e.target.value)} className={inputClass} placeholder="Preferred Contact Time (optional)" /></div>}
    {step === 6 && <div className="grid gap-4"><textarea data-testid="estimate-problem-textarea" value={form.problem_description} onChange={(e) => update("problem_description", e.target.value)} placeholder="Briefly describe the leakage problem" className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 outline-none focus:border-[#00BFFF]" /><label data-testid="estimate-photo-upload" className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#00BFFF]/40 p-5 text-slate-300"><Upload size={18} /> Upload Leakage Photos ({photos.length}/5)<input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setPhotos(Array.from(e.target.files || []).slice(0, 5))} /></label></div>}
    <div className="mt-6 flex justify-between"><button data-testid="estimate-back-btn" disabled={step === 0} onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 disabled:opacity-40"><ArrowLeft size={16} /> Back</button>{step < steps.length - 1 ? <button data-testid="estimate-next-btn" disabled={!canNext || (step === 4 && form.name.length < 2) || (step === 5 && form.phone.length < 8)} onClick={next} className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-5 py-3 font-bold disabled:opacity-40">Next <ArrowRight size={16} /></button> : <button data-testid="estimate-funnel-submit" disabled={loading || !form.name || form.phone.length < 8} onClick={submit} className="rounded-full bg-[#FF7A00] px-6 py-3 font-bold disabled:opacity-40">{loading ? "Submitting..." : "Submit Request"}</button>}</div>
  </div>;
}
