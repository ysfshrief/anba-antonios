export function Spinner({ label = "جارٍ التحميل…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      <span className="font-body text-sm text-stone">{label}</span>
    </div>
  );
}
