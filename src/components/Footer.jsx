import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [ask, setAsk] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);

  const churchName =
    content?.home?.churchName || "كنيسة رئيس الملائكة الجليل ميخائيل بدمنهور";

  const submit = () => {
    if (adminLogin(pwd)) {
      setAsk(false); setPwd(""); setErr(false);
      navigate("/admin");
    } else {
      setErr(true);
    }
  };

  return (
    <footer className="mt-20 border-t border-gold/20 bg-desert px-5 py-12 text-center text-parchment">
      <img src="/assets/church-logo.png" alt="" className="mx-auto mb-4 h-14 w-14 object-contain" />

      {/* اسم الكنيسة = بوابة لوحة الإدارة المخفية */}
      <button
        onClick={() => setAsk(true)}
        className="font-display text-lg font-bold text-goldlight transition-opacity hover:opacity-80"
        title="">
        {churchName}
      </button>

      <p className="mt-4 font-display text-xl">
        بي نيشتي آڤا أنطوني <span className="text-burgundy">❤️</span>
      </p>
      <p className="mt-6 font-body text-xs text-sand/50">
        © {new Date().getFullYear()} — جميع الحقوق محفوظة
      </p>
      <p className="mt-1 font-body text-xs text-sand/40">
        developed &amp; designed by: Youssef Shrief — Joe Industries
      </p>

      {/* نافذة كلمة المرور */}
      {ask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setAsk(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-gold/30 bg-cream p-6 text-right shadow-glow"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-ink">لوحة الإدارة</h3>
            <p className="mt-1 font-body text-sm text-desert/70">أدخل كلمة المرور للمتابعة.</p>
            <input
              type="password" autoFocus value={pwd}
              onChange={(e) => { setPwd(e.target.value); setErr(false); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="كلمة المرور"
              className="mt-4 w-full rounded-xl border border-gold/40 bg-parchment px-4 py-2.5 text-right font-body outline-none focus:border-gold"
            />
            {err && <p className="mt-2 font-body text-sm text-burgundy">كلمة المرور غير صحيحة.</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={submit}
                className="flex-1 rounded-xl bg-burgundy py-2.5 font-body font-medium text-parchment hover:bg-[#571822]">
                دخول
              </button>
              <button onClick={() => setAsk(false)}
                className="rounded-xl border border-gold/40 px-4 py-2.5 font-body text-desert hover:bg-sand">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
