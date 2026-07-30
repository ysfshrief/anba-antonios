import { forwardRef } from "react";
import VideoCard from "./VideoCard";
import SkeletonCard from "./SkeletonCard";
import Reveal from "./Reveal";
import Divider from "./Divider";

const VideoSection = forwardRef(function VideoSection(
  { loading, error, videos, isWatched, markWatched },
  ref
) {
  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-3xl px-5 py-20">
      <Reveal>
        <div className="mb-14 text-center">
          <p className="font-body text-sm tracking-widest text-stone">
            سلسلة تعليمية
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            محطات من حياة القديس
          </h2>
          <Divider className="mt-6" />
        </div>
      </Reveal>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-burgundy/30 bg-burgundy/5 p-8 text-center">
          <p className="font-body text-burgundy">
            تعذّر تحميل الفيديوهات. يرجى تحديث الصفحة والمحاولة مرة أخرى.
          </p>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div className="space-y-10">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && videos.length === 0 && (
        <div className="rounded-2xl border border-gold/30 bg-parchment/70 p-10 text-center">
          <p className="font-body text-desert/80">
            سيتم إضافة الفيديوهات قريباً. تابعونا.
          </p>
        </div>
      )}

      {/* The vertical scroll of videos */}
      {!loading && !error && videos.length > 0 && (
        <div className="space-y-12">
          {videos.map((video, i) => (
            <div key={video.id}>
              <Reveal delay={i === 0 ? 0 : 80}>
                <VideoCard
                  video={video}
                  index={i}
                  watched={isWatched(video.id)}
                  onWatch={markWatched}
                />
              </Reveal>
              {i < videos.length - 1 && <Divider className="mt-12 opacity-50" />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

export default VideoSection;
