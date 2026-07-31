import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Spinner";
import { Download, Lock } from "lucide-react";

export default function Certificate() {
  const { content, loading } = useContent();
  const { progress, user } = useAuth();
  const certRef = useRef(null);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [issued, setIssued] = useState(false);
  const [busy, setBusy] = useState(false);

  const ordered = useMemo(
    () => (content ? [...content.lessons].sort((a, b) => a.order - b.order) : []),
    [content]
  );

  if (loading || !content) return <Spinner />;

  const allDone = ordered.length > 0 && ordered.every((l) => progress[l.id]?.passed);
  const avg = ordered.length
    ? Math.round(
        (ordered.reduce((s, l) => s + (progress[l.id]?.score || 0), 0) / ordered.length) * 100
      )
    : 0;

  if (!allDone) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sand">
          <Lock className="text-stone" />
        </div>
        <p className="font-display text-2xl text-ink">الشهادة غير متاحة بعد</p>
        <p className="mt-2 font-body text-desert/70">
          أكمل جميع المراحل واجتز اختباراتها للحصول على الشهادة.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-burgundy px-6 py-2.5 font-body text-parchment hover:bg-[#571822]">
          العودة للرحلة
        </Link>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric",
  });

  // تحميل PDF أو PNG (تحميل المكتبات عند الحاجة فقط)
  const download = async (type) => {
    if (!certRef.current) return;
    setBusy(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#FBF6EC" });
      if (type === "png") {
        const link = document.createElement("a");
        link.download = `شهادة-${displayName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "landscape", unit: "px",
          format: [canvas.width, canvas.height] });
        pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`شهادة-${displayName}.pdf`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const churchName = content.home?.churchName || "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {!issued ? (
        <div className="mx-auto max-w-md rounded-2xl border border-gold/25 bg-cream p-6 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">تهانينا! 🎉</h1>
          <p className="mt-2 font-body text-desert/75">
            أتممت رحلة الأنبا أنطونيوس. اكتب اسمك كما تريده أن يظهر على الشهادة.
          </p>
          <input
            value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            placeholder="الاسم على الشهادة"
            className="mt-5 w-full rounded-xl border border-gold/40 bg-parchment px-4 py-3 text-center font-body outline-none focus:border-gold"
          />
          <button
            onClick={() => displayName.trim() && setIssued(true)}
            disabled={!displayName.trim()}
            className="mt-4 w-full rounded-full bg-burgundy py-3 font-body font-medium text-parchment enabled:hover:bg-[#571822] disabled:opacity-40">
            إصدار الشهادة
          </button>
        </div>
      ) : (
        <div>
          {/* الشهادة */}
          <div ref={certRef}
            className="relative mx-auto aspect-[1.414/1] w-full max-w-2xl overflow-hidden bg-cream p-8"
            style={{ boxShadow: "0 10px 40px -15px rgba(62,44,28,0.4)" }}>
            {/* إطار مزخرف */}
            <div className="absolute inset-3 rounded-lg border-2 border-gold" />
            <div className="absolute inset-4 rounded-md border border-gold/40" />

            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <img src="/assets/church-logo.png" alt="" className="h-16 w-16 object-contain" />
              <p className="mt-2 font-body text-xs text-stone">{churchName}</p>

              <p className="mt-4 font-body text-sm tracking-widest text-stone">شهادة إتمام</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-burgundy sm:text-3xl">
                رحلة مع القديس الأنبا أنطونيوس
              </h2>

              <p className="mt-5 font-body text-sm text-desert/70">تُمنح هذه الشهادة إلى</p>
              <p className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
                {displayName}
              </p>

              <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-desert/75">
                لإتمامه جميع مراحل الرحلة التعليمية بنجاح، ونيله نسبة {avg}٪.
              </p>

              <div className="mt-6 flex items-center gap-8 font-body text-xs text-stone">
                <span>التاريخ: {today}</span>
                <span>النسبة: {avg}٪</span>
              </div>
            </div>
          </div>

          {/* أزرار التحميل */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => download("pdf")} disabled={busy}
              className="flex items-center gap-2 rounded-full bg-burgundy px-6 py-2.5 font-body text-parchment enabled:hover:bg-[#571822] disabled:opacity-50">
              <Download size={16} /> تحميل PDF
            </button>
            <button onClick={() => download("png")} disabled={busy}
              className="flex items-center gap-2 rounded-full border border-gold/50 bg-parchment px-6 py-2.5 font-body text-desert enabled:hover:bg-sand disabled:opacity-50">
              <Download size={16} /> تحميل صورة PNG
            </button>
          </div>
          {busy && <p className="mt-3 text-center font-body text-sm text-stone">جارٍ التحضير…</p>}
        </div>
      )}
    </div>
  );
}
