import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LOGO_URL, SITE_URL } from "@/data/content";
import { useSite } from "@/context/SiteContext";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  schema?: Record<string, unknown>[];
}

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function Seo({ title, description, path, image, schema = [] }: SeoProps) {
  const location = useLocation();
  const { settings } = useSite();
  const currentPath = path || location.pathname;
  const canonical = `${SITE_URL}${currentPath}`;
  const imageUrl = image?.startsWith("http") ? image : `${SITE_URL}${image || LOGO_URL}`;

  useEffect(() => {
    document.title = `${title} | TIRUPATI INFRACARE`;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", `${title} | TIRUPATI INFRACARE`);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", `${title} | TIRUPATI INFRACARE`);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    document.querySelectorAll("script[data-seo-schema]").forEach((node) => node.remove());
    const organization: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.business_name,
      url: SITE_URL,
      logo: `${SITE_URL}${LOGO_URL}`,
      areaServed: settings.service_areas,
    };
    if (settings.phone) organization.telephone = settings.phone;
    if (settings.email) organization.email = settings.email;
    const schemas = [...schema, organization];
    if (settings.phone || settings.email) {
      const localBusiness: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: settings.business_name,
        url: SITE_URL,
        logo: `${SITE_URL}${LOGO_URL}`,
        areaServed: settings.service_areas,
      };
      if (settings.phone) localBusiness.telephone = settings.phone;
      if (settings.email) localBusiness.email = settings.email;
      schemas.push(localBusiness);
    }
    schemas.forEach((item) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoSchema = "true";
      script.text = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [title, description, canonical, imageUrl, schema, settings]);

  return null;
}
