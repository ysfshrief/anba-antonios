import { useMemo, useState } from "react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { PASS_THRESHOLD } from "../data/seed";
import { Check, X } from "lucide-react";

// اختيار ٣ أسئلة عشوائية من بنك أسئلة الدرس
function pickThree(bank) {
  const arr = [...(bank || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

export default function Quiz({ lessonId, onPassed }) {
  const { content } = useContent();
  const { setLessonResult } = useAuth();
  const bank = content?.quizzes?.[lessonId] || [];
  const questions = useMemo(() => pickThree(bank), [lessonId]); // eslint-disable-line
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  const submit = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const score = questions.length ? correct / questions.length : 0;
    const passed = score >= PASS_THRESHOLD;
    setResult({ correct, total: questions.length, score, passed });
    setLessonResult(lessonId, passed, score);
    if (passed) onPassed?.();
  };

  const retry = () => { setAnswers({}); setResult(null); };

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-cream p-5 text-center font-body text-desert/70">
        لا توجد أسئلة لهذه المرحلة بعد.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/25 bg-cream p-5">
      <h3 className="font-display text-xl font-bold text-ink">اختبار المرحلة</h3>
      <p className="mt-1 font-body text-sm text-desert/60">أجب عن الأسئلة الثلاثة.</p>

      <div className="mt-5 space-y-6">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="font-body font-medium text-ink">{qi + 1}. {q.q}</p>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const showRight = result && oi === q.correct;
                const showWrong = result && chosen && oi !== q.correct;
                return (
                  <button key={oi}
                    disabled={!!result}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-right font-body text-sm transition-colors
                      ${showRight ? "border-[#6B7F4A] bg-[#6B7F4A]/15 text-[#3f5029]"
                        : showWrong ? "border-burgundy bg-burgundy/10 text-burgundy"
                        : chosen ? "border-gold bg-gold/15 text-ink"
                        : "border-gold/30 bg-parchment text-desert hover:bg-sand"}`}>
                    <span>{opt}</span>
                    {showRight && <Check size={16} />}
                    {showWrong && <X size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!result ? (
        <button onClick={submit} disabled={!allAnswered}
          className="mt-6 w-full rounded-full bg-burgundy py-3 font-body font-medium text-parchment transition-colors enabled:hover:bg-[#571822] disabled:cursor-not-allowed disabled:opacity-40">
          تسليم الإجابات
        </button>
      ) : (
        <div className="mt-6 text-center">
          <p className={`font-display text-2xl font-bold ${result.passed ? "text-[#4A5A32]" : "text-burgundy"}`}>
            {result.passed ? "أحسنت! لقد نجحت 🎉" : "لم تجتز الاختبار"}
          </p>
          <p className="mt-1 font-body text-desert/70">
            نتيجتك: {result.correct} من {result.total}
          </p>
          {!result.passed && (
            <button onClick={retry}
              className="mt-4 rounded-full bg-burgundy px-6 py-2.5 font-body text-parchment hover:bg-[#571822]">
              إعادة المحاولة
            </button>
          )}
        </div>
      )}
    </div>
  );
}
