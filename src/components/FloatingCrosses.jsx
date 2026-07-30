import { useEffect, useState } from "react";
import CopticCross from "./CopticCross";

// Ambient, very slow drifting crosses behind the content.
// Fewer + lighter on mobile to keep scrolling smooth.
const desktopSpots = [
  { top: "12%", left: "6%", size: 70, delay: "0s" },
  { top: "38%", left: "88%", size: 54, delay: "3s" },
  { top: "64%", left: "10%", size: 60, delay: "6s" },
  { top: "82%", left: "80%", size: 46, delay: "2s" },
];

const mobileSpots = [
  { top: "18%", left: "8%", size: 52, delay: "0s" },
  { top: "70%", left: "78%", size: 44, delay: "4s" },
];

export default function FloatingCrosses() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // respect reduced motion: no floating crosses
    setSpots(isMobile ? mobileSpots : desktopSpots);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {spots.map((s, i) => (
        <div
          key={i}
          className="absolute animate-floatCross"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            willChange: "transform, opacity",
          }}
        >
          <CopticCross className="h-full w-full" stroke="#8B6F47" />
        </div>
      ))}
    </div>
  );
}
