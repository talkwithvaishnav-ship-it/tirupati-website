import React, { createContext, useContext, useMemo, useState } from "react";
import { trackEvent } from "@/lib/api";
import { getSettings } from "@/lib/cms";
import { toast } from "@/components/ui/sonner";
import { SiteSettings } from "@/types";

const emptySettings: SiteSettings = {
  business_name: "TIRUPATI INFRACARE",
  phone: "",
  whatsapp_number: "",
  email: "",
  address: "",
  google_business_profile_url: "",
  opening_hours: "",
  service_areas: ["Nagpur", "Pune", "Mumbai", "Thane", "Nashik", "Chhatrapati Sambhajinagar", "Amravati", "Akola", "Wardha", "Bhandara", "Chandrapur", "Indore", "Bhopal", "Jabalpur", "Chhindwara", "Ujjain", "Gwalior", "Sagar", "Seoni", "Betul"],
};

interface SiteContextValue {
  settings: SiteSettings;
  loading: boolean;
  callHref?: string;
  whatsappHref?: string;
  refreshSettings: () => Promise<void>;
  openCall: (source: string) => void;
  openWhatsApp: (source: string, message?: string) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Settings ab src/data/site-data.json se aati hain (koi backend nahi).
  const [settings, setSettings] = useState<SiteSettings>(() => ({ ...emptySettings, ...getSettings() }));
  const loading = false;

  const refreshSettings = async () => {
    setSettings({ ...emptySettings, ...getSettings() });
  };

  const callHref = settings.phone ? `tel:${settings.phone.replace(/\s+/g, "")}` : undefined;
  const whatsappHref = useMemo(() => {
    if (!settings.whatsapp_number) return undefined;
    const number = settings.whatsapp_number.replace(/\D/g, "");
    const message = encodeURIComponent("Hello Tirupati Infracare, I am interested in your waterproofing services. I would like to discuss my requirement and get an inspection/estimate.");
    return `https://wa.me/${number}?text=${message}`;
  }, [settings.whatsapp_number]);

  const openCall = (source: string) => {
    trackEvent("call_click", { source });
    if (!callHref) return;
    window.location.href = callHref;
    if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) toast.info(`Call Tirupati Infracare at ${settings.phone}`);
  };

  const openWhatsApp = (source: string, message?: string) => {
    trackEvent("whatsapp_click", { source });
    if (!settings.whatsapp_number) return;
    const number = settings.whatsapp_number.replace(/\D/g, "");
    const text = encodeURIComponent(message || "Hello Tirupati Infracare, I am interested in your waterproofing services. I would like to discuss my requirement and get an inspection/estimate.");
    window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return <SiteContext.Provider value={{ settings, loading, callHref, whatsappHref, refreshSettings, openCall, openWhatsApp }}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside SiteProvider");
  return context;
}
