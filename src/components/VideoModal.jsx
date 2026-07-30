import { useEffect, useState } from "react";
import { drivePreviewUrl } from "../hooks/driveUrl";

// Custom-framed player around Drive's embed.
// - Branded church chrome around the video (fully ours).
// - Autoplay on open so Drive's paused scrim clears fast.
// - Closes on: Escape, backdrop tap, close button, or page scroll.
export default function VideoModal({ video, onClose }) {
  const previewUrl = drivePreviewUrl(video.driveUrl);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onScroll = () => onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-burgundy text-parchment shadow-soft transition-colors hover:bg-[#571822]"
        aria-label="إغلاق"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Branded player shell — this frame is fully ours */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border-2 border-gold/40 bg-black shadow-glow"
        style={{ maxWidth: "min(94vw, 880px)", height: "min(82vh, 700px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar (ours) */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-ink/90 to-transparent px-5 py-3">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="font-display text-sm text-parchment/90 sm:text-base">
            {video.title}
          </span>
        </div>

        {/* Loading state (ours) while the frame boots */}
        {!loaded && (
          <div className="absolute inset-0 z-[5] flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
              <span className="font-body text-sm text-sand/70">
                جارٍ تحميل الفيديو…
              </span>
            </div>
          </div>
        )}

        <iframe
          src={previewUrl}
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0"
        />
      </div>

      {/* Footer hint (ours) */}
      <p className="mt-4 font-body text-xs text-sand/50">
        مرّر الصفحة أو اضغط خارج الفيديو للإغلاق
      </p>
    </div>
  );
}
