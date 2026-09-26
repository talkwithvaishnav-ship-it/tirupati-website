import { leadUploadConfig, leadUploadsEnabled, uploadToCloudinary } from "@/lib/cms";

export function formatApiError(error: any): string {
  if (typeof error?.message === "string" && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

/**
 * Enquiry photos ko Cloudinary par upload karke unke links deta hai
 * (WhatsApp message me jodne ke liye). Cloudinary env set na ho to [] deta hai.
 */
export async function uploadLeadPhotos(photos: File[], leadId: string): Promise<string[]> {
  if (!leadUploadsEnabled || photos.length === 0) return [];
  const assets = await Promise.all(
    photos.slice(0, 5).map((photo) => uploadToCloudinary(photo, leadUploadConfig, { folder: `tirupati-infracare/leads/${leadId}`, resourceType: "image" })),
  );
  return assets.map((asset) => asset.url);
}

/** Form ke photos ko handle karke WhatsApp kholta hai (popup block na ho isliye tab pehle khulta hai). */
export async function sendLeadToWhatsApp(options: { whatsappNumber: string; message: string; photos: File[]; leadId: string }): Promise<{ photoLinks: string[]; photoError: boolean }> {
  const { whatsappNumber, photos, leadId } = options;
  const number = whatsappNumber.replace(/\D/g, "");
  const build = (text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  let message = options.message;
  let photoLinks: string[] = [];
  let photoError = false;

  if (photos.length && leadUploadsEnabled) {
    const win = window.open("", "_blank");
    try {
      photoLinks = await uploadLeadPhotos(photos, leadId);
    } catch {
      photoError = true;
    }
    message = photoLinks.length
      ? `${message}\n\nLeakage Photos:\n${photoLinks.join("\n")}`
      : `${message}\n\nI will share leakage photos in this chat.`;
    if (win) { win.opener = null; win.location.href = build(message); } else { window.location.href = build(message); }
  } else {
    if (photos.length) message = `${message}\n\nI will share leakage photos in this chat.`;
    window.open(build(message), "_blank", "noopener,noreferrer");
  }
  return { photoLinks, photoError };
}

export function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
  window.dataLayer?.push({ event: eventName, ...properties });
  window.gtag?.("event", eventName, properties);
  window.fbq?.("trackCustom", eventName, properties);
}
