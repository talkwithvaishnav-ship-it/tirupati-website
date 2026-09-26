import rawData from "@/data/site-data.json";
import { PhotoAsset, Project, SiteData, SiteSettings, Testimonial, WorkVideo } from "@/types";

/* ------------------------------------------------------------------ */
/*  Website ka saara data: src/data/site-data.json                     */
/*  Koi backend / database nahi. JSON badlo -> GitHub par push -> Vercel */
/*  apne aap nayi website deploy kar deta hai.                          */
/* ------------------------------------------------------------------ */

export const siteData = rawData as unknown as SiteData;

const byOrderThenNewest = <T extends { display_order?: number; created_at?: string }>(a: T, b: T) =>
  (a.display_order ?? 0) - (b.display_order ?? 0) || String(b.created_at || "").localeCompare(String(a.created_at || ""));

export const getSettings = (): SiteSettings => siteData.settings;

export const getPublishedProjects = (category?: string): Project[] =>
  (siteData.projects || [])
    .filter((project) => project.published && (!category || project.category === category))
    .sort((a, b) => String(b.completion_date).localeCompare(String(a.completion_date)));

export const getProjectBySlug = (slug?: string): Project | undefined =>
  (siteData.projects || []).find((project) => project.slug === slug && project.published);

export const getActiveVideos = (): WorkVideo[] => (siteData.videos || []).filter((video) => video.active).sort(byOrderThenNewest);

export const getPublishedTestimonials = (city?: string, service?: string): Testimonial[] =>
  (siteData.testimonials || [])
    .filter((item) => item.published)
    .filter((item) => !city || item.city.toLowerCase() === city.toLowerCase())
    .filter((item) => !service || item.service.toLowerCase() === service.toLowerCase())
    .sort(byOrderThenNewest);

/* ------------------------------ Cloudinary ------------------------------ */

const CLD_UPLOAD = /\/(image|video)\/upload\//;
const isCloudinary = (url?: string) => !!url && url.includes("res.cloudinary.com") && CLD_UPLOAD.test(url);

/** Cloudinary image URL me auto-format / auto-quality / width jod deta hai (bandwidth bachti hai). */
export function imageUrl(asset?: PhotoAsset | null, width = 1200): string {
  const url = asset?.url || "";
  if (!isCloudinary(url) || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

/**
 * Video URL — original file hi chalate hain. (Cloudinary me video transformation
 * har second ke hisaab se free credits khata hai, isliye yahan koi transformation nahi.)
 */
export function videoUrl(asset?: PhotoAsset | null): string {
  return asset?.url || "";
}

/** Thumbnail: agar diya hai to wahi, warna Cloudinary video ke 1st second se apne aap JPG. */
export function videoPosterUrl(video: WorkVideo, width = 1280): string {
  if (video.thumbnail_asset?.url) return imageUrl(video.thumbnail_asset, width);
  const url = video.video_asset?.url || "";
  if (!isCloudinary(url) || !url.includes("/video/upload/")) return "";
  return url.replace("/video/upload/", `/video/upload/so_1,q_auto,c_limit,w_${width}/`).replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

/**
 * Browser se seedha Cloudinary par upload (unsigned upload preset).
 * Koi backend / secret key ki zarurat nahi.
 */
export function uploadToCloudinary(
  file: File,
  config: CloudinaryConfig,
  options: { folder?: string; resourceType?: "image" | "video" | "auto"; onProgress?: (percent: number) => void } = {},
): Promise<PhotoAsset> {
  const { folder, resourceType = "auto", onProgress } = options;
  return new Promise((resolve, reject) => {
    if (!config.cloudName || !config.uploadPreset) {
      reject(new Error("Cloudinary cloud name / upload preset set nahi hai."));
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", config.uploadPreset);
    if (folder) form.append("folder", folder);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/${resourceType}/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let body: any = {};
      try { body = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
        resolve({
          url: body.secure_url,
          public_id: body.public_id,
          original_filename: file.name,
          content_type: file.type,
          size: body.bytes ?? file.size,
        });
      } else {
        reject(new Error(body?.error?.message || `Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error — upload nahi ho paya."));
    xhr.send(form);
  });
}

/** Public forms (lead photos) ke liye Cloudinary config — Vercel env variables se. Optional. */
export const leadUploadConfig: CloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: process.env.REACT_APP_CLOUDINARY_LEAD_PRESET || "",
};
export const leadUploadsEnabled = !!(leadUploadConfig.cloudName && leadUploadConfig.uploadPreset);

/* -------------------------------- GitHub -------------------------------- */

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

const apiUrl = (cfg: GitHubConfig) =>
  `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split("/").map(encodeURIComponent).join("/")}`;

const headers = (cfg: GitHubConfig) => ({
  Authorization: `Bearer ${cfg.token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function githubError(response: Response, fallback: string): Promise<Error> {
  let message = fallback;
  try { const body = await response.json(); if (body?.message) message = body.message; } catch { /* ignore */ }
  if (response.status === 401) message = "GitHub token galat hai ya expire ho gaya hai.";
  if (response.status === 403) message = "GitHub token ko is repo par 'Contents: Read and write' permission chahiye.";
  if (response.status === 404) message = "Repo / branch / file path nahi mila. Owner, repo, branch aur path check karo.";
  if (response.status === 409) message = "File GitHub par kisi aur ne badal di hai. 'Load latest' dabakar dobara try karo.";
  return new Error(message);
}

export async function loadFromGitHub(cfg: GitHubConfig): Promise<{ data: SiteData; sha: string }> {
  const response = await fetch(`${apiUrl(cfg)}?ref=${encodeURIComponent(cfg.branch)}&t=${Date.now()}`, { headers: headers(cfg), cache: "no-store" });
  if (!response.ok) throw await githubError(response, "GitHub se data load nahi hua.");
  const body = await response.json();
  return { data: JSON.parse(base64ToUtf8(body.content)) as SiteData, sha: body.sha };
}

export async function saveToGitHub(cfg: GitHubConfig, data: SiteData, sha: string | undefined, message: string): Promise<string> {
  const response = await fetch(apiUrl(cfg), {
    method: "PUT",
    headers: { ...headers(cfg), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: utf8ToBase64(serializeSiteData(data)), sha, branch: cfg.branch }),
  });
  if (!response.ok) throw await githubError(response, "GitHub par save nahi hua.");
  const body = await response.json();
  return body.content.sha;
}

export const serializeSiteData = (data: SiteData) => `${JSON.stringify(data, null, 2)}\n`;

/* -------------------------------- Utils -------------------------------- */

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function projectSlug(value: string): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.slice(0, 90) || newId();
}

export function newLeadId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `TIC-${date}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}
