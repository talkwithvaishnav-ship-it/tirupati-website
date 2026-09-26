import { Link } from "react-router-dom";
import { CalendarCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useSite } from "@/context/SiteContext";
import { trackEvent } from "@/lib/api";

export function ContactActions({ source, compact = false }: { source: string; compact?: boolean }) {
  const { settings, callHref, whatsappHref, openCall, openWhatsApp } = useSite();
  const call = () => callHref ? openCall(source) : toast.info("Phone contact is being configured. Please submit an inspection request.");
  const whatsapp = () => whatsappHref ? openWhatsApp(source) : toast.info("WhatsApp contact is being configured. Please submit an inspection request.");
  return <div data-testid={`${source}-contact-actions`} className={`grid gap-3 ${compact ? "sm:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
    <button data-testid={`${source}-call-now-btn`} data-phone-href={callHref || ""} onClick={call} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 font-bold text-white transition-colors hover:border-[#00BFFF]"><Phone size={17} /> Call Now</button>
    <button data-testid={`${source}-whatsapp-us-btn`} onClick={whatsapp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 px-5 py-3 font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/10"><MessageCircle size={17} /> WhatsApp Us</button>
    {settings.email && <a data-testid={`${source}-email-us-btn`} href={`mailto:${settings.email}`} onClick={() => trackEvent("email_click", { source })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 font-bold text-white transition-colors hover:border-[#00BFFF]"><Mail size={17} /> Email Us</a>}
    <Link data-testid={`${source}-book-inspection-btn`} to="/#inspection" onClick={() => trackEvent("cta_click", { cta: "book_free_inspection", source })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FF7A00] px-5 py-3 font-bold text-white transition-transform hover:-translate-y-0.5"><CalendarCheck size={17} /> Book Free Inspection</Link>
  </div>;
}
