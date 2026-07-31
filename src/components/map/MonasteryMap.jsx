import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ============================================================
//  خريطة الدير — مرسومة بالكامل بـ SVG (لا صور).
//  المحطات تُولّد ديناميكيًا حسب عدد الدروس + محطة نهائية (الشهادة).
//  المسار يتعرّج ويصعد من البوابة (أسفل) حتى القمة (أعلى).
//  الحالات: مقفول / متاح / مكتمل.
// ============================================================

export default function MonasteryMap({ lessons }) {
  const navigate = useNavigate();
  const { progress, user } = useAuth();

  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const total = ordered.length + 1; // +1 للمحطة النهائية

  // توليد إحداثيات متعرّجة تصعد لأعلى
  const W = 700;
  const topPad = 120, botPad = 700;
  const nodes = Array.from({ length: total }, (_, i) => {
    const t = total > 1 ? i / (total - 1) : 0;
    const y = botPad - t * (botPad - topPad);
    // تعرّج يمين/يسار
    const x = W / 2 + (i % 2 === 0 ? 1 : -1) * (i === total - 1 ? 0 : 150);
    const isFinal = i === ordered.length;
    return { x, y, isFinal, lesson: ordered[i], idx: i };
  });

  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    const prev = ordered[idx - 1];
    return Boolean(progress[prev?.id]?.passed);
  };
  const isDone = (id) => Boolean(progress[id]?.passed);
  const allDone = ordered.length > 0 && ordered.every((l) => progress[l.id]?.passed);

  const handleNode = (n) => {
    if (n.isFinal) { if (allDone) navigate("/certificate"); return; }
    if (isUnlocked(n.idx)) navigate(`/lesson/${n.lesson?.id}`);
  };

  const pathD = nodes.reduce((d, n, i) => {
    if (i === 0) return `M ${n.x} ${n.y}`;
    const prev = nodes[i - 1];
    const midY = (prev.y + n.y) / 2;
    return `${d} C ${prev.x} ${midY}, ${n.x} ${midY}, ${n.x} ${n.y}`;
  }, "");

  const viewH = 800;

  return (
    <div className="mx-auto w-full max-w-2xl px-2">
      <svg viewBox={`0 0 ${W} ${viewH}`} className="w-full" role="img" aria-label="خريطة رحلة الدير">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EBD9B8" />
            <stop offset="55%" stopColor="#F2E7D1" />
            <stop offset="100%" stopColor="#F7F1E4" />
          </linearGradient>
          <linearGradient id="mount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96A" /><stop offset="100%" stopColor="#A9834E" />
          </linearGradient>
          <linearGradient id="mount2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8945C" /><stop offset="100%" stopColor="#9A7B4F" />
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="1.1" /></filter>
        </defs>

        <rect width={W} height={viewH} fill="url(#sky)" />
        <path d="M0 300 L120 150 L240 260 L360 120 L480 240 L600 140 L700 250 L700 800 L0 800 Z" fill="url(#mount2)" opacity="0.5" />
        <path d="M0 380 L160 240 L300 360 L440 220 L580 340 L700 260 L700 800 L0 800 Z" fill="url(#mount)" opacity="0.8" />

        {/* صلبان القمة */}
        <g opacity="0.9">
          <line x1="330" y1="60" x2="330" y2="100" stroke="#6B1F2A" strokeWidth="4" />
          <line x1="315" y1="74" x2="345" y2="74" stroke="#6B1F2A" strokeWidth="4" />
          <line x1="400" y1="66" x2="400" y2="102" stroke="#6B1F2A" strokeWidth="3" />
          <line x1="388" y1="78" x2="412" y2="78" stroke="#6B1F2A" strokeWidth="3" />
          <line x1="465" y1="72" x2="465" y2="104" stroke="#6B1F2A" strokeWidth="3" />
          <line x1="454" y1="83" x2="476" y2="83" stroke="#6B1F2A" strokeWidth="3" />
        </g>

        <path d="M0 640 Q350 600 700 660 L700 800 L0 800 Z" fill="#E8D9BC" opacity="0.7" />

        {/* المسار */}
        <path d={pathD} fill="none" stroke="#8B6F47" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 16" opacity="0.5" />
        <path d={pathD} fill="none" stroke="#B08D3E" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 16" />

        {/* المحطات */}
        {nodes.map((n) => {
          const unlocked = n.isFinal ? allDone : isUnlocked(n.idx);
          const done = n.isFinal ? false : isDone(n.lesson?.id);
          const label = n.isFinal ? "الاختبار والشهادة" : n.lesson?.stage || "";
          const bg = n.isFinal ? "#B08D3E" : done ? "#6B7F4A" : unlocked ? "#6B1F2A" : "#B7A886";

          return (
            <g key={n.idx}
              className={unlocked ? "cursor-pointer" : "cursor-not-allowed"}
              onClick={() => handleNode(n)} role="button" aria-label={label}
              tabIndex={unlocked ? 0 : -1}
              onKeyDown={(e) => e.key === "Enter" && handleNode(n)}>
              {unlocked && !done && (
                <circle cx={n.x} cy={n.y} r="34" fill={bg} opacity="0.25">
                  <animate attributeName="r" values="30;40;30" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={n.x} cy={n.y} r="28" fill={bg} stroke="#B08D3E" strokeWidth="3" filter="url(#soft)" />
              <circle cx={n.x} cy={n.y} r="28" fill="none" stroke="#F7F1E4" strokeWidth="1.5" opacity="0.6" />

              <g transform={`translate(${n.x - 9}, ${n.y - 9})`} pointerEvents="none">
                {!unlocked ? <LockIcon /> : done ? <CheckIcon /> : <PlayIcon />}
              </g>

              {!n.isFinal && (
                <>
                  <circle cx={n.x + 22} cy={n.y - 22} r="11" fill="#F7F1E4" stroke="#B08D3E" strokeWidth="1.5" />
                  <text x={n.x + 22} y={n.y - 17} textAnchor="middle" fontFamily="Amiri, serif"
                    fontSize="13" fontWeight="700" fill="#6B1F2A" pointerEvents="none">{n.idx + 1}</text>
                </>
              )}

              <text x={n.x} y={n.y + 48} textAnchor="middle" fontFamily="Amiri, serif"
                fontSize="17" fontWeight="700" fill="#2A1D12" pointerEvents="none">{label}</text>
            </g>
          );
        })}
      </svg>

      {!user && (
        <p className="mt-4 text-center font-body text-sm text-stone">
          سجّل دخولك بالأعلى ليُحفظ تقدّمك في الرحلة.
        </p>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <g fill="none" stroke="#F7F1E4" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="8" width="12" height="9" rx="1.5" fill="#F7F1E4" stroke="none" />
      <path d="M5 8 V5.5 A4 4 0 0 1 13 5.5 V8" />
    </g>
  );
}
function CheckIcon() {
  return <path d="M3 9.5 L7 13.5 L15 4.5" fill="none" stroke="#F7F1E4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />;
}
function PlayIcon() {
  return <path d="M5 3 L15 9 L5 15 Z" fill="#F7F1E4" />;
}
