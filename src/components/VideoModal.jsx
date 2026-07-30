import { useEffect } from "react";
import { toDrivePreview } from "../hooks/useVideos";

// Fullscreen overlay player — adapts to portrait or landscape videos.
export default function VideoModal({ video, onClose }) {
  const previewUrl = toDrivePreview(video.driveUrl);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-burgundy text-parchment shadow-soft transition-colors hover:bg-[#571822]"
        aria-label="إغلاق"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Player frame — stops click from closing, sizes to viewport */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-gold/30 bg-black shadow-glow"
        style={{ maxWidth: "min(92vw, 900px)", height: "min(80vh, 720px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={previewUrl}
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>

      <p className="mt-4 max-w-md text-center font-display text-lg text-parchment">
        {video.title}
      </p>
    </div>
  );
}
