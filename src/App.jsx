import { useRef } from "react";
import Hero from "./components/Hero";
import VideoSection from "./components/VideoSection";
import Footer from "./components/Footer";
import FloatingCrosses from "./components/FloatingCrosses";
import { useVideos } from "./hooks/useVideos";
import { useProgress } from "./hooks/useProgress";

export default function App() {
  const videosRef = useRef(null);
  const { loading, error, videos } = useVideos();
  const { isWatched, markWatched } = useProgress();

  const scrollToVideos = () => {
    videosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div dir="rtl" lang="ar" className="relative min-h-screen">
      <FloatingCrosses />
      <Hero onStart={scrollToVideos} />
      <VideoSection
        ref={videosRef}
        loading={loading}
        error={error}
        videos={videos}
        isWatched={isWatched}
        markWatched={markWatched}
      />
      <Footer />
    </div>
  );
}
