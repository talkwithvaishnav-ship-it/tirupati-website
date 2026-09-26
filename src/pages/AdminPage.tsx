import React, { useEffect, useState } from "react";
import { CheckCircle2, CloudUpload, Download, MessageCircle, RefreshCw, Save, Settings2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Seo } from "@/components/Seo";
import { ProjectAdmin } from "@/components/ProjectAdmin";
import { VideoAdmin } from "@/components/VideoAdmin";
import { TestimonialAdmin } from "@/components/TestimonialAdmin";
import { CloudinaryConfig, GitHubConfig, loadFromGitHub, saveToGitHub, serializeSiteData, siteData } from "@/lib/cms";
import { SiteData, SiteSettings } from "@/types";

const input = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-[#00BFFF]";
const CONFIG_KEY = "tic-admin-config";

interface AdminConfig { github: GitHubConfig; cloudinary: CloudinaryConfig }

const defaultConfig: AdminConfig = {
  github: {
    owner: process.env.REACT_APP_GITHUB_OWNER || "",
    repo: process.env.REACT_APP_GITHUB_REPO || "",
    branch: process.env.REACT_APP_GITHUB_BRANCH || "main",
    path: "src/data/site-data.json",
    token: "",
  },
  cloudinary: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: process.env.REACT_APP_CLOUDINARY_ADMIN_PRESET || "",
  },
};

function readConfig(): AdminConfig {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
    return { github: { ...defaultConfig.github, ...(saved.github || {}) }, cloudinary: { ...defaultConfig.cloudinary, ...(saved.cloudinary || {}) } };
  } catch {
    return defaultConfig;
  }
}

const clone = (data: SiteData): SiteData => JSON.parse(JSON.stringify(data));
const isGitHubReady = (g: GitHubConfig) => !!(g.owner && g.repo && g.branch && g.path && g.token);

export function AdminDashboardPage() {
  const [config, setConfig] = useState<AdminConfig>(readConfig);
  const [showConfig, setShowConfig] = useState(() => !isGitHubReady(readConfig().github));
  const [data, setData] = useState<SiteData>(() => clone(siteData));
  const [savedJson, setSavedJson] = useState(() => serializeSiteData(siteData));
  const [sha, setSha] = useState<string | undefined>();
  const [areas, setAreas] = useState(siteData.settings.service_areas.join(", "));
  const [busy, setBusy] = useState<"" | "load" | "save">("");

  const dirty = serializeSiteData(data) !== savedJson;
  const githubReady = isGitHubReady(config.github);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const applyLoaded = (incoming: SiteData, newSha?: string) => {
    const normalized: SiteData = { settings: { ...siteData.settings, ...(incoming.settings || {}) }, projects: incoming.projects || [], videos: incoming.videos || [], testimonials: incoming.testimonials || [] };
    setData(normalized); setSavedJson(serializeSiteData(normalized)); setSha(newSha); setAreas(normalized.settings.service_areas.join(", "));
  };

  const loadLatest = async (quiet = false) => {
    if (!githubReady) { if (!quiet) toast.error("Pehle GitHub connection settings bharo."); return; }
    if (dirty && !quiet && !window.confirm("Unsaved changes hata kar GitHub se latest data load karein?")) return;
    setBusy("load");
    try { const result = await loadFromGitHub(config.github); applyLoaded(result.data, result.sha); if (!quiet) toast.success("Latest data loaded from GitHub."); }
    catch (error: any) { toast.error(error.message); }
    finally { setBusy(""); }
  };

  // Admin page khulte hi GitHub se latest data le aao (agar connected hai).
  useEffect(() => { if (githubReady) loadLatest(true); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveConfig = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed: AdminConfig = {
      github: Object.fromEntries(Object.entries(config.github).map(([k, v]) => [k, String(v).trim()])) as unknown as GitHubConfig,
      cloudinary: { cloudName: config.cloudinary.cloudName.trim(), uploadPreset: config.cloudinary.uploadPreset.trim() },
    };
    setConfig(trimmed);
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(trimmed)); } catch { /* ignore */ }
    toast.success("Connection settings saved in this browser.");
    setShowConfig(false);
    if (isGitHubReady(trimmed.github) && !dirty) {
      setBusy("load");
      loadFromGitHub(trimmed.github).then((r) => applyLoaded(r.data, r.sha)).catch((e) => toast.error(e.message)).finally(() => setBusy(""));
    }
  };

  const publish = async () => {
    if (!githubReady) { toast.error("GitHub connect nahi hai. 'Download JSON' use karo ya settings bharo."); setShowConfig(true); return; }
    setBusy("save");
    try {
      let currentSha = sha;
      if (!currentSha) currentSha = (await loadFromGitHub(config.github)).sha;
      const newSha = await saveToGitHub(config.github, data, currentSha, `Website content update (${new Date().toLocaleString("en-IN")})`);
      setSha(newSha); setSavedJson(serializeSiteData(data));
      toast.success("Published! Vercel 1–2 minute me website update kar dega.");
    } catch (error: any) { toast.error(error.message); }
    finally { setBusy(""); }
  };

  const download = () => {
    const blob = new Blob([serializeSiteData(data)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = "site-data.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const settings = data.settings;
  const setSettings = (next: SiteSettings) => setData((current) => ({ ...current, settings: next }));
  const saveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    setSettings({ ...settings, service_areas: areas.split(",").map((item) => item.trim()).filter(Boolean) });
    toast.success("Settings updated. Click 'Publish to Website' to make it live.");
  };
  const setGh = (key: keyof GitHubConfig, value: string) => setConfig((c) => ({ ...c, github: { ...c.github, [key]: value } }));
  const setCld = (key: keyof CloudinaryConfig, value: string) => setConfig((c) => ({ ...c, cloudinary: { ...c.cloudinary, [key]: value } }));

  return <section data-testid="admin-dashboard" className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-12"><Seo title="Admin Dashboard" description="Tirupati Infracare content dashboard." path="/admin" />
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h1 className="font-heading text-4xl font-bold">Admin Dashboard</h1><p className="mt-2 text-slate-400">Add or edit projects, videos, reviews and contact settings. Media is stored on Cloudinary; changes go live after “Publish to Website”.</p></div>
      <div className="flex flex-wrap gap-3">
        <button data-testid="admin-config-btn" onClick={() => setShowConfig(!showConfig)} className="rounded-full border border-white/10 px-5 py-3"><Settings2 size={16} className="mr-2 inline" />Connection</button>
        <button data-testid="admin-refresh-btn" onClick={() => loadLatest()} disabled={busy !== ""} className="rounded-full border border-white/10 px-5 py-3 disabled:opacity-50"><RefreshCw size={16} className={`mr-2 inline ${busy === "load" ? "animate-spin" : ""}`} />Load latest</button>
        <button data-testid="admin-download-btn" onClick={download} className="rounded-full border border-white/10 px-5 py-3"><Download size={16} className="mr-2 inline" />Download JSON</button>
        <button data-testid="admin-publish-btn" onClick={publish} disabled={busy !== "" || !dirty} className="rounded-full bg-[#FF7A00] px-6 py-3 font-bold disabled:opacity-50"><CloudUpload size={16} className="mr-2 inline" />{busy === "save" ? "Publishing..." : "Publish to Website"}</button>
      </div>
    </div>

    <div data-testid="admin-status" className={`mb-8 flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-4 text-sm ${dirty ? "border-[#FF7A00]/40 bg-[#FF7A00]/10 text-orange-200" : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"}`}>
      {dirty ? <>● Unpublished changes — click <b>Publish to Website</b> to make them live.</> : <><CheckCircle2 size={16} /> Everything is saved.</>}
      <span className="ml-auto text-xs text-slate-400">GitHub: {githubReady ? `${config.github.owner}/${config.github.repo}` : "not connected"} • Cloudinary: {config.cloudinary.cloudName && config.cloudinary.uploadPreset ? config.cloudinary.cloudName : "not connected"}</span>
    </div>

    {showConfig && <form data-testid="admin-config-form" onSubmit={saveConfig} className="mb-10 rounded-[1.5rem] border border-[#00BFFF]/30 bg-white/[0.045] p-6">
      <h2 className="font-heading text-2xl font-bold">Connection Settings</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Ye details sirf is browser me save hoti hain, website par kisi ko nahi dikhti. Token ke bina koi bhi website ka data change nahi kar sakta.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <input data-testid="config-gh-owner" value={config.github.owner} onChange={(e) => setGh("owner", e.target.value)} className={input} placeholder="GitHub username (owner)" />
        <input data-testid="config-gh-repo" value={config.github.repo} onChange={(e) => setGh("repo", e.target.value)} className={input} placeholder="GitHub repo name" />
        <input data-testid="config-gh-branch" value={config.github.branch} onChange={(e) => setGh("branch", e.target.value)} className={input} placeholder="Branch (main)" />
        <input data-testid="config-gh-path" value={config.github.path} onChange={(e) => setGh("path", e.target.value)} className={input} placeholder="src/data/site-data.json" />
        <input data-testid="config-gh-token" type="password" autoComplete="off" value={config.github.token} onChange={(e) => setGh("token", e.target.value)} className={`${input} md:col-span-2`} placeholder="GitHub fine-grained token (Contents: Read and write)" />
        <input data-testid="config-cld-cloud" value={config.cloudinary.cloudName} onChange={(e) => setCld("cloudName", e.target.value)} className={input} placeholder="Cloudinary cloud name" />
        <input data-testid="config-cld-preset" value={config.cloudinary.uploadPreset} onChange={(e) => setCld("uploadPreset", e.target.value)} className={input} placeholder="Cloudinary unsigned upload preset" />
      </div>
      <button data-testid="config-save-btn" className="mt-5 rounded-xl bg-[#FF7A00] px-6 py-3 font-bold"><Save size={16} className="mr-2 inline" />Save Connection</button>
    </form>}

    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6"><h2 className="font-heading text-2xl font-bold">Leads</h2><p className="mt-3 text-sm leading-7 text-slate-300">Website ab bina backend ke chalti hai, isliye har inspection / estimate enquiry seedha aapke WhatsApp <b className="text-white">{settings.whatsapp_number || "(number set karo)"}</b> par aati hai — naam, mobile, city, service, area aur Lead ID ke saath. Agar Cloudinary lead preset set hai to customer ki leakage photos ke links bhi message me aate hain.</p><p className="mt-3 text-sm leading-7 text-slate-400">Tip: WhatsApp Business me “Labels” (New, Contacted, Inspection Scheduled, Quotation Sent, Converted, Closed) bana kar leads track karo.</p><MessageCircle className="mt-4 text-[#25D366]" /></div>
      <form data-testid="admin-settings-form" onSubmit={saveSettings} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6"><h2 className="font-heading text-2xl font-bold">Site Settings</h2><p className="mt-2 text-xs leading-6 text-slate-400">Blank values stay private and are not shown publicly.</p><div className="mt-5 grid gap-3"><input data-testid="settings-business-name" value={settings.business_name} onChange={(e) => setSettings({ ...settings, business_name: e.target.value })} className={input} placeholder="Business Name" /><input data-testid="settings-phone" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className={input} placeholder="Phone" /><input data-testid="settings-whatsapp" value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} className={input} placeholder="WhatsApp Number" /><input data-testid="settings-email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className={input} placeholder="Email" /><textarea data-testid="settings-address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className={input} placeholder="Address" /><input data-testid="settings-gbp" value={settings.google_business_profile_url} onChange={(e) => setSettings({ ...settings, google_business_profile_url: e.target.value })} className={input} placeholder="Google Business Profile URL" /><input data-testid="settings-hours" value={settings.opening_hours} onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })} className={input} placeholder="Opening Hours" /><input data-testid="settings-service-areas" value={areas} onChange={(e) => setAreas(e.target.value)} onBlur={() => setSettings({ ...settings, service_areas: areas.split(",").map((item) => item.trim()).filter(Boolean) })} className={input} placeholder="Service Areas, comma separated" /><button data-testid="settings-save-btn" className="rounded-xl bg-[#FF7A00] py-4 font-bold"><Save size={16} className="mr-2 inline" />Save Settings</button></div></form>
    </div>
    <ProjectAdmin projects={data.projects} onChange={(projects) => setData((current) => ({ ...current, projects }))} cloudinary={config.cloudinary} />
    <VideoAdmin videos={data.videos} onChange={(videos) => setData((current) => ({ ...current, videos }))} cloudinary={config.cloudinary} />
    <TestimonialAdmin items={data.testimonials} onChange={(testimonials) => setData((current) => ({ ...current, testimonials }))} cloudinary={config.cloudinary} />
  </section>;
}
