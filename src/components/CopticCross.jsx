// Simple Coptic-style cross with flared arms.
export default function CopticCross({ className = "", stroke = "#B08D3E" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* vertical */}
      <path d="M50 10 V90" />
      {/* horizontal */}
      <path d="M18 42 H82" />
      {/* flared terminals */}
      <path d="M42 12 Q50 4 58 12" />
      <path d="M42 88 Q50 96 58 88" />
      <path d="M20 34 Q12 42 20 50" />
      <path d="M80 34 Q88 42 80 50" />
      <circle cx="50" cy="42" r="5" fill={stroke} stroke="none" opacity="0.5" />
    </svg>
  );
}
