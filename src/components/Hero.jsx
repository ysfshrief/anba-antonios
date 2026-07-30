import CopticCross from "./CopticCross";

export default function Hero({ onStart }) {
  return (
    <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 text-center">
      {/* Desert / monastery gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #2A1D12 0%, #3E2C1C 35%, #6B4423 70%, #8B6F47 100%)",
        }}
      />
      {/* Warm candle light pooling from above */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 8%, rgba(216,185,104,0.35), transparent 60%)",
        }}
      />
      {/* Faint horizon of dunes */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background:
            "linear-gradient(to top, rgba(228,213,183,0.22), transparent)",
        }}
      />
      {/* Manuscript grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl animate-fadeUp">
        {/* Illuminated logo seal */}
        <div className="mx-auto mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-goldlight/20 blur-xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold/50 bg-desert/40 p-3 shadow-glow backdrop-blur-sm sm:h-40 sm:w-40">
              <img
                src="/assets/church-logo.png"
                alt="شعار كنيسة رئيس الملائكة الجليل ميخائيل بدمنهور"
                className="h-full w-full object-contain drop-shadow-lg"
                loading="eager"
              />
            </div>
          </div>
        </div>

        <p className="mb-4 font-body text-sm tracking-wide text-goldlight/90 sm:text-base">
          كنيسة رئيس الملائكة الجليل ميخائيل بدمنهور
        </p>

        <h1 className="font-display text-4xl font-bold leading-tight text-parchment drop-shadow-md sm:text-6xl">
          رحلة مع القديس
          <br />
          <span className="text-goldlight">الأنبا أنطونيوس</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-sand/90 sm:text-lg">
          تعرّف على حياة وتعاليم أبي الرهبان من خلال مجموعة من الفيديوهات
          القصيرة.
        </p>

        <button
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-gold/70 bg-burgundy/90 px-9 py-3.5 font-body text-lg font-medium text-parchment shadow-soft backdrop-blur transition-all duration-300 hover:bg-burgundy hover:shadow-glow"
        >
          ابدأ المشاهدة
          <CopticCross className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" stroke="#D8B968" />
        </button>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 animate-bounce text-goldlight/70">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </header>
  );
}
