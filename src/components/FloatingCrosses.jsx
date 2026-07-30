import CopticCross from "./CopticCross";

// Ambient, very slow drifting crosses behind the content.
const spots = [
  { top: "12%", left: "6%", size: 70, delay: "0s" },
  { top: "38%", left: "88%", size: 54, delay: "3s" },
  { top: "64%", left: "10%", size: 60, delay: "6s" },
  { top: "82%", left: "80%", size: 46, delay: "2s" },
  { top: "50%", left: "48%", size: 90, delay: "8s" },
];

export default function FloatingCrosses() {
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
          }}
        >
          <CopticCross className="h-full w-full" stroke="#8B6F47" />
        </div>
      ))}
    </div>
  );
}
