export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gold/20 bg-parchment/60 shadow-soft">
      <div className="aspect-video w-full skeleton animate-shimmer" />
      <div className="space-y-3 p-6">
        <div className="h-6 w-2/3 rounded skeleton animate-shimmer" />
        <div className="h-4 w-full rounded skeleton animate-shimmer" />
        <div className="h-4 w-5/6 rounded skeleton animate-shimmer" />
        <div className="mt-4 h-9 w-36 rounded-full skeleton animate-shimmer" />
      </div>
    </div>
  );
}
