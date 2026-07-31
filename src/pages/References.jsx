import { useContent } from "../context/ContentContext";
import { Spinner } from "../components/Spinner";
import { BookOpen } from "lucide-react";

export default function References() {
  const { content, loading } = useContent();
  if (loading || !content) return <Spinner />;
  const refs = content.references || [];

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">المراجع</h1>
        <div className="mx-auto mt-3 h-0.5 w-24 bg-gold/50" />
      </div>
      <div className="mt-10 space-y-3">
        {refs.map((r, i) => (
          <div key={i}
            className="flex items-start gap-3 rounded-2xl border border-gold/25 bg-cream p-4">
            <BookOpen size={20} className="mt-0.5 shrink-0 text-burgundy" />
            <span className="font-body leading-relaxed text-desert/85">{r}</span>
          </div>
        ))}
        {refs.length === 0 && (
          <p className="text-center font-body text-desert/60">لا توجد مراجع بعد.</p>
        )}
      </div>
    </div>
  );
}
