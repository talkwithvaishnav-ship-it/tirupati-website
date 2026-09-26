import { useState } from "react";
import { Play, Video } from "lucide-react";
import { ContactActions } from "@/components/ContactActions";
import { SectionHeading } from "@/components/MarketingSections";
import { trackEvent } from "@/lib/api";
import { getActiveVideos, videoPosterUrl, videoUrl } from "@/lib/cms";
import { SITE_URL } from "@/data/content";
import { WorkVideo } from "@/types";


export function WorkVideosSection() {
  const [videos] = useState<WorkVideo[]>(() => getActiveVideos());
  const [activeId, setActiveId] = useState("");
  const loading = false;

  const schema = videos.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description,
        thumbnailUrl: videoPosterUrl(video) || undefined,
        contentUrl: videoUrl(video.video_asset),
        uploadDate: video.created_at,
      },
    })),
  } : null;

  return <section id="work-videos" data-testid="work-videos-section" className="relative overflow-hidden bg-[#081A38] py-20 sm:py-28">
    {schema && <script type="application/ld+json" data-video-schema="true" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
      <SectionHeading eyebrow="Our Work in Action" title="Waterproofing Work Videos" text="Real Tirupati Infracare site work and application videos appear here after they are uploaded and activated by the admin. Thumbnails load first; videos play only when selected." />
      {loading && <div data-testid="work-videos-loading" className="rounded-[2rem] border border-white/10 p-10 text-center text-slate-300">Loading work videos...</div>}
      {!loading && videos.length === 0 && <div data-testid="work-videos-empty-state" className="rounded-[2rem] border border-dashed border-[#00BFFF]/30 bg-white/[0.04] p-10 text-center"><Video className="mx-auto mb-4 text-[#00BFFF]" size={42} /><h3 className="font-heading text-2xl font-bold">Real work videos will be published here.</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">No stock footage is presented as company work. The first verified Tirupati Infracare video can be uploaded from the admin dashboard.</p></div>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{videos.map((video) => <article key={video.id} data-testid={`work-video-card-${video.id}`} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#06152F] shadow-2xl shadow-black/20 transition-[transform,border-color] hover:-translate-y-1 hover:border-[#00BFFF]/50">
        <div className="relative aspect-video bg-black">{activeId === video.id ? <video data-testid={`work-video-player-${video.id}`} src={videoUrl(video.video_asset)} poster={videoPosterUrl(video) || undefined} controls autoPlay muted playsInline preload="metadata" className="h-full w-full object-cover" /> : <button data-testid={`work-video-play-${video.id}`} onClick={() => { setActiveId(video.id); trackEvent("video_play", { video: video.title }); }} className="group relative h-full w-full" aria-label={`Play ${video.title}`}><img src={videoPosterUrl(video, 800)} alt={`${video.title} thumbnail`} loading="lazy" className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-gradient-to-t from-[#06152F]/80 to-transparent" /><span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF7A00] text-white shadow-2xl transition-transform group-hover:scale-110"><Play size={26} fill="currentColor" /></span></button>}</div>
        <div className="p-5"><div className="flex flex-wrap gap-2 text-xs text-slate-400">{video.service_category && <span className="rounded-full border border-white/10 px-3 py-1">{video.service_category}</span>}{video.location && <span className="rounded-full border border-white/10 px-3 py-1">{video.location}</span>}</div><h3 className="mt-3 font-heading text-xl font-bold text-white">{video.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{video.description}</p></div>
      </article>)}</div>
      <div className="mt-12 rounded-[2rem] border border-[#00BFFF]/20 bg-white/[0.04] p-6 sm:p-8"><h3 className="font-heading text-2xl font-bold">Want Similar Waterproofing Work?</h3><p className="mt-2 text-slate-300">Share your leakage or construction protection requirement and get an inspection-led recommendation.</p><div className="mt-6"><ContactActions source="work-videos" compact /></div></div>
    </div>
  </section>;
}
