import { useRef } from "react";
import { useContent } from "../context/ContentContext";
import { Spinner } from "../components/Spinner";
import MonasteryMap from "../components/map/MonasteryMap";

export default function Home() {
  const { content, loading } = useContent();
  const mapRef = useRef(null);

  if (loading || !content) return <Spinner />;
  const { home, lessons } = content;

  const scrollToMap = () =>
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/monastery-hero.png" alt=""
            className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(42,29,18,0.9) 8%, rgba(42,29,18,0.35) 55%, rgba(42,29,18,0.5))" }} />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
          <img src="/assets/church-logo.png" alt="شعار الكنيسة"
            className="mb-6 h-24 w-24 object-contain drop-shadow-lg animate-fadeUp" />
          <h1 className="font-display text-4xl font-bold leading-tight text-parchment drop-shadow-md animate-fadeUp sm:text-6xl">
            {home.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-sand/90 animate-fadeUp sm:text-lg">
            {home.subtitle}
          </p>
          <button onClick={scrollToMap}
            className="mt-9 rounded-full border border-gold/60 bg-burgundy px-9 py-3.5 font-body text-lg font-medium text-parchment shadow-soft transition-all hover:bg-[#571822] hover:shadow-glow animate-fadeUp">
            {home.ctaLabel}
          </button>
        </div>
      </section>

      {/* Map */}
      <section ref={mapRef} className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 text-center">
          <p className="font-body text-sm tracking-widest text-stone">رحلة داخل الدير</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            محطات الرحلة
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-sm text-desert/70">
            اصعد من بوابة الدير محطةً محطة، حتى تبلغ القمة وتنال الشهادة.
          </p>
        </div>
        <MonasteryMap lessons={lessons} />
      </section>
    </div>
  );
}
