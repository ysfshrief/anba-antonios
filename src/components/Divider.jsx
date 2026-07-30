import CopticCross from "./CopticCross";

// Illuminated-manuscript style separator between sections.
export default function Divider({ className = "" }) {
  return (
    <div className={`ornament-divider my-2 ${className}`}>
      <span className="text-gold/70">◆</span>
      <CopticCross className="h-6 w-6 shrink-0" stroke="#B08D3E" />
      <span className="text-gold/70">◆</span>
    </div>
  );
}
