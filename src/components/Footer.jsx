import Divider from "./Divider";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-desert px-5 py-14 text-center text-parchment">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(176,141,62,0.25), transparent 65%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-xl">
        <img
          src="/assets/church-logo.png"
          alt=""
          className="mx-auto mb-5 h-20 w-20 object-contain drop-shadow-md"
          loading="lazy"
        />
        <p className="font-display text-xl font-bold text-goldlight">
          كنيسة رئيس الملائكة الجليل ميخائيل بدمنهور
        </p>

        <Divider className="my-6 opacity-80" />

        <p className="font-display text-2xl text-parchment animate-flicker">
          بي نيشتي آڤا أنطوني <span className="text-burgundy">❤️</span>
        </p>

        <p className="mt-8 font-body text-xs text-sand/60">
          © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </p>
        <p className="mt-1 font-body text-xs text-sand/50">
          developed &amp; designed by: Youssef Shrief · Joe Industries
        </p>
      </div>
    </footer>
  );
}
