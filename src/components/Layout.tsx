import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { LOGO_URL, cities, services } from "@/data/content";
import { useSite } from "@/context/SiteContext";
import { trackEvent } from "@/lib/api";

const navItems = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Solutions", "/#solutions"],
  ["Projects", "/projects"],
  ["About", "/about"],
  ["Resources", "/blog"],
  ["Contact", "/contact"],
];

function useContactActions() {
  const { callHref, whatsappHref, openCall, openWhatsApp } = useSite();
  const call = (source: string) => {
    if (!callHref) toast.info("Phone contact is being configured. Please submit an inspection request.");
    else openCall(source);
  };
  const whatsapp = (source: string) => {
    if (!whatsappHref) toast.info("WhatsApp contact is being configured. Please submit an inspection request.");
    else openWhatsApp(source);
  };
  return { call, whatsapp, callHref, whatsappHref };
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const actions = useContactActions();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" }), 100);
    else window.scrollTo({ top: 0 });
  }, [location]);

  const inspection = () => {
    trackEvent("cta_click", { cta: "free_inspection", source: "header" });
    if (location.pathname !== "/") navigate("/#inspection");
    else document.querySelector("#inspection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header data-testid="site-header" className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? "border-white/10 bg-[#06152F]/90 shadow-2xl shadow-black/20 backdrop-blur-xl" : "border-white/5 bg-[#06152F]/45 backdrop-blur-md"}`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12" aria-label="Main navigation">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF]">
          <img src={LOGO_URL} alt="Tirupati Infracare logo" className="h-12 w-12 rounded-xl object-cover" />
          <span className="hidden font-heading text-sm font-extrabold tracking-[0.18em] text-white sm:block">TIRUPATI<br /><span className="text-[#00BFFF]">INFRACARE</span></span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, href]) => href.includes("#") ? (
            <Link key={label} to={href} data-testid={`nav-${label.toLowerCase()}-link`} className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white">{label}</Link>
          ) : (
            <NavLink key={label} to={href} data-testid={`nav-${label.toLowerCase()}-link`} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{label}</NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <button data-testid="nav-call-button" onClick={() => actions.call("header")} className="rounded-full border border-white/15 p-3 text-white transition-colors hover:border-[#00BFFF] hover:text-[#00BFFF]" aria-label="Call Tirupati Infracare"><Phone size={18} /></button>
          <button data-testid="nav-whatsapp-button" onClick={() => actions.whatsapp("header")} className="rounded-full border border-white/15 p-3 text-white transition-colors hover:border-[#00BFFF] hover:text-[#00BFFF]" aria-label="WhatsApp Tirupati Infracare"><MessageCircle size={18} /></button>
          <button data-testid="nav-free-inspection-btn" onClick={inspection} className="rounded-full bg-[#FF7A00] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF7A00]/20 transition-transform hover:-translate-y-0.5">Get Free Inspection</button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button data-testid="mobile-call-button" onClick={() => actions.call("mobile-header")} className="rounded-full border border-white/15 p-3 text-white" aria-label="Call"><Phone size={18} /></button>
          <button data-testid="mobile-menu-button" onClick={() => setOpen(!open)} className="rounded-full border border-white/15 p-3 text-white" aria-label="Open menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="border-t border-white/10 bg-[#06152F] px-4 py-6 lg:hidden" data-testid="mobile-navigation-menu"><div className="grid gap-2">{navItems.map(([label, href]) => <Link key={label} to={href} data-testid={`mobile-nav-${label.toLowerCase()}-link`} className="rounded-2xl px-4 py-3 text-base font-semibold text-white hover:bg-white/10">{label}</Link>)}<button data-testid="mobile-free-inspection-btn" onClick={inspection} className="mt-3 rounded-2xl bg-[#FF7A00] px-4 py-4 font-bold text-white">Get Free Inspection</button></div></motion.div>}</AnimatePresence>
    </header>
  );
}

export function Footer() {
  const { settings, whatsappHref } = useSite();
  return (
    <footer data-testid="site-footer" className="border-t border-white/10 bg-[#030B1B] pb-24 pt-16 text-slate-300 md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-12">
        <div><img src={LOGO_URL} alt="Tirupati Infracare" className="mb-5 h-16 w-16 rounded-2xl" /><p className="text-sm leading-7">Professional waterproofing and construction protection solutions for residential, commercial and industrial properties.</p><p className="mt-4 text-xs text-slate-500">Official contact channels are managed centrally and kept consistent across the website.</p></div>
        <div><h3 className="mb-4 font-heading font-bold text-white">Services</h3><div className="grid gap-2">{services.map((service) => <Link data-testid={`footer-service-${service.slug}`} key={service.slug} to={`/services/${service.slug}`} className="text-sm hover:text-[#00BFFF]">{service.title}</Link>)}</div></div>
        <div><h3 className="mb-4 font-heading font-bold text-white">Locations</h3><div className="grid gap-2">{cities.map((city) => <Link data-testid={`footer-city-${city.slug}`} key={city.slug} to={`/waterproofing/${city.slug}`} className="text-sm hover:text-[#00BFFF]">{city.name}</Link>)}</div></div>
        <div><h3 className="mb-4 font-heading font-bold text-white">Resources</h3><div className="grid gap-2"><Link data-testid="footer-resources-blog" to="/blog" className="text-sm hover:text-[#00BFFF]">Waterproofing Guides</Link><Link data-testid="footer-resources-products" to="/products" className="text-sm hover:text-[#00BFFF]">Products & Materials</Link><Link data-testid="footer-resources-projects" to="/projects" className="text-sm hover:text-[#00BFFF]">Projects</Link><Link data-testid="footer-resources-about" to="/about" className="text-sm hover:text-[#00BFFF]">About Us</Link></div></div>
        <div><h3 className="mb-4 font-heading font-bold text-white">Contact</h3><div className="grid gap-3 text-sm">{settings.phone && <a data-testid="footer-phone-link" href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex gap-2 hover:text-white"><Phone size={16} /> {settings.phone}</a>}{whatsappHref && <a data-testid="footer-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-white"><MessageCircle size={16} /> WhatsApp</a>}{settings.email && <a data-testid="footer-email-link" href={`mailto:${settings.email}`} className="flex gap-2 hover:text-white"><Mail size={16} /> {settings.email}</a>}{settings.address && <p data-testid="footer-address" className="flex gap-2"><MapPin size={16} /> {settings.address}</p>}{settings.google_business_profile_url && <a data-testid="footer-google-business-link" href={settings.google_business_profile_url} target="_blank" rel="noreferrer" className="hover:text-white">Google Business Profile</a>}{settings.opening_hours && <p data-testid="footer-opening-hours" className="text-xs">{settings.opening_hours}</p>}<Link data-testid="footer-contact-link" to="/contact" className="font-semibold text-[#00BFFF]">Request an inspection</Link></div></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 pt-6 text-xs text-slate-500 sm:px-6 md:flex-row md:justify-between lg:px-12"><p>© {new Date().getFullYear()} TIRUPATI INFRACARE. All rights reserved.</p><div className="flex gap-4"><Link data-testid="footer-privacy-link" to="/privacy-policy">Privacy Policy</Link><Link data-testid="footer-terms-link" to="/terms">Terms</Link><Link data-testid="footer-disclaimer-link" to="/disclaimer">Disclaimer</Link></div></div>
    </footer>
  );
}

export function MobileStickyBar() {
  const actions = useContactActions();
  const navigate = useNavigate();
  return <div data-testid="mobile-sticky-cta-bar" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/10 bg-[#06152F]/95 backdrop-blur-xl md:hidden"><button data-testid="mobile-sticky-cta-call" onClick={() => actions.call("mobile-sticky")} className="flex flex-col items-center gap-1 py-3 text-xs font-bold text-white"><Phone size={18} />CALL</button><button data-testid="mobile-sticky-cta-whatsapp" onClick={() => actions.whatsapp("mobile-sticky")} className="flex flex-col items-center gap-1 border-x border-white/10 py-3 text-xs font-bold text-[#00BFFF]"><MessageCircle size={18} />WHATSAPP</button><button data-testid="mobile-sticky-cta-inspection" onClick={() => navigate("/#inspection")} className="flex flex-col items-center gap-1 bg-[#FF7A00] py-3 text-xs font-bold text-white"><CalendarCheck size={18} />INSPECTION</button></div>;
}

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>;
}

export function FloatingWhatsApp() {
  const actions = useContactActions();
  return <button data-testid="floating-whatsapp-button" onClick={() => actions.whatsapp("floating")} className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/30 transition-transform hover:-translate-y-1 md:flex" aria-label="Chat on WhatsApp"><WhatsAppIcon size={28} /></button>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen overflow-x-clip bg-[#06152F] font-body text-white"><Header /><main>{children}</main><Footer /><MobileStickyBar /><FloatingWhatsApp /></div>;
}
