import { useEffect, useRef, useState } from "react";

// استخراج معرّف فيديو YouTube من أي صيغة رابط
export function ytId(url) {
  if (!url) return null;
  const m =
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/embed\/([^?]+)/);
  return m ? m[1] : null;
}

let apiPromise = null;
function loadYT() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return apiPromise;
}

/**
 * مشغّل YouTube يتتبّع نسبة المشاهدة ويستدعي onProgress(ratio).
 * يُحمّل فقط عند فتح الدرس (lazy).
 */
export default function YouTubePlayer({ url, onProgress }) {
  const holderRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(false);
  const id = ytId(url);

  useEffect(() => {
    if (!id) { setError(true); return; }
    let interval;
    let destroyed = false;

    loadYT().then((YT) => {
      if (destroyed || !holderRef.current) return;
      playerRef.current = new YT.Player(holderRef.current, {
        videoId: id,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => {
            interval = setInterval(() => {
              const p = playerRef.current;
              if (!p || !p.getDuration) return;
              const dur = p.getDuration();
              const cur = p.getCurrentTime();
              if (dur > 0) onProgress?.(Math.min(cur / dur, 1));
            }, 1000);
          },
        },
      });
    });

    return () => {
      destroyed = true;
      clearInterval(interval);
      try { playerRef.current?.destroy?.(); } catch { /* noop */ }
    };
  }, [id, onProgress]);

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-sand text-center">
        <p className="px-6 font-body text-desert/70">رابط الفيديو غير صالح.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gold/25 bg-black shadow-card">
      <div ref={holderRef} className="h-full w-full" />
    </div>
  );
}
