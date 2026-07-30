import { useState } from "react";
import VideoModal from "./VideoModal";

export default function VideoCard({ video, index, watched, onWatch }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onWatch(video.id); // mark as watched when opened
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-3xl border border-gold/25 bg-parchment/80 shadow-card backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow">
        {/* Order seal */}
        <div className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-burgundy font-display text-lg font-bold text-goldlight shadow-soft">
          {video.order ?? index + 1}
        </div>

        {/* Watched badge */}
        {watched && (
          <div className="absolute left-5 top-5 z-10 rounded-full bg-stone/90 px-3 py-1 font-body text-xs font-medium text-parchment shadow-soft">
            تمت مشاهدة هذا الفيديو ✓
          </div>
        )}

        {/* Thumbnail (always clean 16:9 — video itself opens in overlay) */}
        <button
          onClick={handleOpen}
          className="relative block aspect-video w-full overflow-hidden bg-black"
          aria-label={`تشغيل: ${video.title}`}
        >
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, #6B4423, #3E2C1C 80%)",
              }}
            >
              <span className="font-display text-6xl text-gold/40">Ⲁ</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-desert/70 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-goldlight/60 bg-burgundy/85 shadow-glow transition-transform duration-300 group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#F5EFE1" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          {video.duration && (
            <span className="absolute bottom-3 left-3 rounded-md bg-desert/80 px-2 py-0.5 font-body text-xs text-parchment">
              {video.duration}
            </span>
          )}
        </button>

        {/* Text */}
        <div className="p-6 text-right">
          <h3 className="font-display text-2xl font-bold text-ink">
            {video.title}
          </h3>
          <p className="mt-2 font-body text-[15px] leading-relaxed text-desert/80">
            {video.description}
          </p>

          <button
            onClick={handleOpen}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-2.5 font-body text-sm font-medium text-parchment transition-colors duration-300 hover:bg-[#571822]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            مشاهدة الفيديو
          </button>
        </div>
      </article>

      {open && <VideoModal video={video} onClose={() => setOpen(false)} />}
    </>
  );
}
