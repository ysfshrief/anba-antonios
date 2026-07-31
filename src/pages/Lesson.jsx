import { useCallback, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Spinner";
import YouTubePlayer from "../components/YouTubePlayer";
import Quiz from "../components/Quiz";
import { WATCH_THRESHOLD } from "../data/seed";
import { FileText, Music, ChevronRight, ChevronLeft, Lock } from "lucide-react";

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content, loading } = useContent();
  const { progress, setLessonWatched, user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);

  const ordered = useMemo(
    () => (content ? [...content.lessons].sort((a, b) => a.order - b.order) : []),
    [content]
  );
  const idx = ordered.findIndex((l) => l.id === id);
  const lesson = ordered[idx];

  const onProgress = useCallback(
    (ratio) => setLessonWatched(id, ratio),
    [id, setLessonWatched]
  );

  if (loading || !content) return <Spinner />;
  if (!lesson) return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="font-display text-2xl text-ink">الدرس غير موجود.</p>
      <Link to="/" className="mt-4 inline-block text-burgundy underline">العودة للرئيسية</Link>
    </div>
  );

  // بوابة القفل: لا يُفتح الدرس إلا إذا نجح في السابق
  const prev = ordered[idx - 1];
  const next = ordered[idx + 1];
  const locked = idx > 0 && !progress[prev?.id]?.passed;

  if (locked) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sand">
          <Lock className="text-stone" />
        </div>
        <p className="font-display text-2xl text-ink">هذا الدرس مقفل</p>
        <p className="mt-2 font-body text-desert/70">
          عليك إتمام درس «{prev?.stage}» واجتياز اختباره أولًا.
        </p>
        <Link to={`/lesson/${prev?.id}`}
          className="mt-6 inline-block rounded-full bg-burgundy px-6 py-2.5 font-body text-parchment hover:bg-[#571822]">
          الذهاب للدرس السابق
        </Link>
      </div>
    );
  }

  const watched = progress[id]?.watched || 0;
  const passed = progress[id]?.passed;
  const canQuiz = watched >= WATCH_THRESHOLD;
  const watchPct = Math.round(watched * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* شريط التقدم */}
      <div className="mb-4">
        <div className="flex items-center justify-between font-body text-xs text-stone">
          <span>المرحلة {idx + 1} من {ordered.length}</span>
          <span>{lesson.stage}</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sand">
          <div className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${((idx + (passed ? 1 : 0)) / ordered.length) * 100}%` }} />
        </div>
      </div>

      <h1 className="font-display text-3xl font-bold text-ink">{lesson.title}</h1>
      <p className="mt-2 font-body text-desert/80">{lesson.description}</p>

      {/* الفيديو */}
      <div className="mt-6">
        <YouTubePlayer url={lesson.youtubeUrl} onProgress={onProgress} />
        {/* مؤشر نسبة المشاهدة */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
            <div className="h-full rounded-full bg-burgundy transition-all"
              style={{ width: `${watchPct}%` }} />
          </div>
          <span className="font-body text-xs text-stone">
            {passed ? "مكتمل ✓" : canQuiz ? "جاهز للاختبار" : `المشاهدة ${watchPct}%`}
          </span>
        </div>
      </div>

      {/* الملخص */}
      {lesson.summary && (
        <div className="mt-6 rounded-2xl border border-gold/25 bg-cream p-5">
          <h3 className="font-display text-lg font-bold text-ink">الملخص</h3>
          <p className="mt-2 font-body leading-relaxed text-desert/85">{lesson.summary}</p>
        </div>
      )}

      {/* الموارد: PDF + صوتيات */}
      {(lesson.pdfs?.length > 0 || lesson.audios?.length > 0) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {lesson.pdfs?.map((p, i) => (
            <a key={`p${i}`} href={p.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gold/25 bg-parchment p-3 font-body text-sm text-desert transition-colors hover:bg-sand">
              <FileText size={18} className="text-burgundy" /> {p.name || `ملف ${i + 1}`}
            </a>
          ))}
          {lesson.audios?.map((a, i) => (
            <a key={`a${i}`} href={a.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gold/25 bg-parchment p-3 font-body text-sm text-desert transition-colors hover:bg-sand">
              <Music size={18} className="text-burgundy" /> {a.name || `تسجيل ${i + 1}`}
            </a>
          ))}
        </div>
      )}

      {/* الاختبار */}
      <div className="mt-8">
        {passed ? (
          <div className="rounded-2xl border border-[#6B7F4A]/40 bg-[#6B7F4A]/10 p-5 text-center">
            <p className="font-display text-lg text-[#4A5A32]">
              اجتزت اختبار هذه المرحلة ✓
            </p>
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-gold/30 bg-cream p-5 text-center font-body text-desert/80">
            سجّل دخولك أولًا ليُحفظ تقدّمك ونتيجتك.
          </div>
        ) : !canQuiz ? (
          <div className="rounded-2xl border border-gold/30 bg-cream p-5 text-center font-body text-desert/70">
            شاهد ٩٠٪ من الفيديو على الأقل لفتح الاختبار.
          </div>
        ) : !showQuiz ? (
          <button onClick={() => setShowQuiz(true)}
            className="w-full rounded-full bg-burgundy py-3.5 font-body text-lg font-medium text-parchment hover:bg-[#571822]">
            ابدأ اختبار المرحلة
          </button>
        ) : (
          <Quiz lessonId={id}
            onPassed={() => { setShowQuiz(false); }} />
        )}
      </div>

      {/* التنقل */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={() => next && navigate(`/lesson/${next.id}`)}
          disabled={!next || !passed}
          className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-parchment px-5 py-2.5 font-body text-sm text-desert transition-colors enabled:hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40">
          التالي <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => prev && navigate(`/lesson/${prev.id}`)}
          disabled={!prev}
          className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-parchment px-5 py-2.5 font-body text-sm text-desert transition-colors enabled:hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronRight size={16} /> السابق
        </button>
      </div>

      {!passed && next && (
        <p className="mt-3 text-center font-body text-xs text-stone">
          اجتز اختبار هذه المرحلة لفتح المرحلة التالية.
        </p>
      )}
    </div>
  );
}
