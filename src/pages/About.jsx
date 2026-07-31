import { useContent } from "../context/ContentContext";
import { Spinner } from "../components/Spinner";

export default function About() {
  const { content, loading } = useContent();
  if (loading || !content) return <Spinner />;
  const { team } = content;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{team.title}</h1>
        <div className="mx-auto mt-3 h-0.5 w-24 bg-gold/50" />
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {team.members.map((m, i) => (
          <div key={i}
            className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-cream p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy font-display text-lg font-bold text-parchment">
              {m.charAt(0)}
            </div>
            <span className="font-body font-medium text-ink">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
