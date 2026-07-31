import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useContent } from "../../context/ContentContext";
import { Spinner } from "../../components/Spinner";
import {
  Save, Plus, Trash2, ArrowUp, ArrowDown, LogOut, Home as HomeIcon,
  BookOpen, HelpCircle, Users, Library, Check,
} from "lucide-react";

const TABS = [
  { key: "home", label: "الرئيسية", icon: HomeIcon },
  { key: "lessons", label: "الدروس", icon: BookOpen },
  { key: "quizzes", label: "الاختبارات", icon: HelpCircle },
  { key: "team", label: "من نحن", icon: Users },
  { key: "references", label: "المراجع", icon: Library },
];

export default function Admin() {
  const { isAdmin, adminLogout } = useAuth();
  const { content, loading, save } = useContent();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("home");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (content) setDraft(JSON.parse(JSON.stringify(content)));
  }, [content]);

  if (loading || !draft) return <Spinner />;

  const doSave = async () => {
    await save(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div className="min-h-screen bg-parchment">
      {/* شريط علوي */}
      <div className="sticky top-0 z-30 border-b border-gold/20 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-xl font-bold text-ink">لوحة الإدارة</h1>
          <div className="flex items-center gap-2">
            <button onClick={doSave}
              className="flex items-center gap-2 rounded-full bg-burgundy px-5 py-2 font-body text-sm font-medium text-parchment hover:bg-[#571822]">
              {saved ? <><Check size={16} /> تم الحفظ</> : <><Save size={16} /> حفظ</>}
            </button>
            <button onClick={() => { adminLogout(); navigate("/"); }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-burgundy hover:bg-sand">
              <LogOut size={16} />
            </button>
          </div>
        </div>
        {/* تبويبات */}
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 font-body text-sm transition-colors
                ${tab === t.key ? "bg-burgundy text-parchment" : "text-desert hover:bg-sand"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {tab === "home" && <HomeTab draft={draft} update={update} />}
        {tab === "lessons" && <LessonsTab draft={draft} setDraft={setDraft} />}
        {tab === "quizzes" && <QuizzesTab draft={draft} setDraft={setDraft} />}
        {tab === "team" && <TeamTab draft={draft} setDraft={setDraft} />}
        {tab === "references" && <ReferencesTab draft={draft} setDraft={setDraft} />}
      </div>

      <p className="pb-10 text-center font-body text-xs text-stone">
        كل التغييرات تُحفظ عند الضغط على «حفظ».
      </p>
    </div>
  );
}

// ---------- حقول مساعدة ----------
function Field({ label, value, onChange, textarea }) {
  return (
    <label className="block">
      <span className="font-body text-sm font-medium text-desert">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="mt-1 w-full rounded-xl border border-gold/30 bg-cream px-4 py-2.5 text-right font-body outline-none focus:border-gold" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gold/30 bg-cream px-4 py-2.5 text-right font-body outline-none focus:border-gold" />
      )}
    </label>
  );
}
function Card({ children }) {
  return <div className="rounded-2xl border border-gold/25 bg-cream p-5">{children}</div>;
}

// ---------- تبويب الرئيسية ----------
function HomeTab({ draft, update }) {
  const h = draft.home;
  const set = (k, v) => update({ home: { ...h, [k]: v } });
  return (
    <Card>
      <div className="space-y-4">
        <Field label="العنوان الرئيسي" value={h.title} onChange={(v) => set("title", v)} />
        <Field label="العنوان الفرعي" value={h.subtitle} onChange={(v) => set("subtitle", v)} textarea />
        <Field label="اسم الكنيسة" value={h.churchName} onChange={(v) => set("churchName", v)} />
        <Field label="نص زر البداية" value={h.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
      </div>
    </Card>
  );
}

// ---------- تبويب الدروس ----------
function LessonsTab({ draft, setDraft }) {
  const lessons = [...draft.lessons].sort((a, b) => a.order - b.order);

  const setLesson = (id, patch) =>
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

  const move = (id, dir) => {
    const arr = [...draft.lessons].sort((a, b) => a.order - b.order);
    const i = arr.findIndex((l) => l.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[i].order; arr[i].order = arr[j].order; arr[j].order = tmp;
    setDraft((d) => ({ ...d, lessons: arr }));
  };

  const addLesson = () => {
    const id = "lesson_" + Date.now();
    const order = draft.lessons.length;
    setDraft((d) => ({
      ...d,
      lessons: [...d.lessons, {
        id, order, stage: "مرحلة جديدة", title: "درس جديد",
        description: "", youtubeUrl: "", summary: "", pdfs: [], audios: [],
      }],
      quizzes: { ...d.quizzes, [id]: [] },
    }));
  };

  const removeLesson = (id) =>
    setDraft((d) => ({ ...d, lessons: d.lessons.filter((l) => l.id !== id) }));

  const addResource = (id, kind) => {
    const l = draft.lessons.find((x) => x.id === id);
    const list = [...(l[kind] || []), { name: "", url: "" }];
    setLesson(id, { [kind]: list });
  };
  const setResource = (id, kind, idx, patch) => {
    const l = draft.lessons.find((x) => x.id === id);
    const list = l[kind].map((r, i) => (i === idx ? { ...r, ...patch } : r));
    setLesson(id, { [kind]: list });
  };
  const removeResource = (id, kind, idx) => {
    const l = draft.lessons.find((x) => x.id === id);
    setLesson(id, { [kind]: l[kind].filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <button onClick={addLesson}
        className="flex items-center gap-2 rounded-full bg-burgundy px-5 py-2 font-body text-sm text-parchment hover:bg-[#571822]">
        <Plus size={16} /> إضافة درس
      </button>

      {lessons.map((l, idx) => (
        <Card key={l.id}>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-ink">
              {idx + 1}. {l.title}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(l.id, -1)} className="rounded-lg p-1.5 text-stone hover:bg-sand"><ArrowUp size={16} /></button>
              <button onClick={() => move(l.id, 1)} className="rounded-lg p-1.5 text-stone hover:bg-sand"><ArrowDown size={16} /></button>
              <button onClick={() => removeLesson(l.id)} className="rounded-lg p-1.5 text-burgundy hover:bg-burgundy/10"><Trash2 size={16} /></button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="اسم المرحلة" value={l.stage} onChange={(v) => setLesson(l.id, { stage: v })} />
            <Field label="عنوان الدرس" value={l.title} onChange={(v) => setLesson(l.id, { title: v })} />
          </div>
          <div className="mt-3">
            <Field label="الوصف" value={l.description} onChange={(v) => setLesson(l.id, { description: v })} />
          </div>
          <div className="mt-3">
            <Field label="رابط فيديو YouTube" value={l.youtubeUrl} onChange={(v) => setLesson(l.id, { youtubeUrl: v })} />
          </div>
          <div className="mt-3">
            <Field label="الملخص" value={l.summary} onChange={(v) => setLesson(l.id, { summary: v })} textarea />
          </div>

          {/* PDFs */}
          <ResourceList title="ملفات PDF (روابط Google Drive)" kind="pdfs"
            items={l.pdfs || []} lessonId={l.id}
            onAdd={addResource} onSet={setResource} onRemove={removeResource} />
          {/* Audios */}
          <ResourceList title="ملفات صوتية (روابط Google Drive)" kind="audios"
            items={l.audios || []} lessonId={l.id}
            onAdd={addResource} onSet={setResource} onRemove={removeResource} />
        </Card>
      ))}
    </div>
  );
}

function ResourceList({ title, kind, items, lessonId, onAdd, onSet, onRemove }) {
  return (
    <div className="mt-4 rounded-xl border border-gold/20 bg-parchment/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-body text-sm font-medium text-desert">{title}</span>
        <button onClick={() => onAdd(lessonId, kind)}
          className="flex items-center gap-1 rounded-full bg-stone/20 px-3 py-1 font-body text-xs text-desert hover:bg-stone/30">
          <Plus size={13} /> إضافة
        </button>
      </div>
      <div className="space-y-2">
        {items.map((r, i) => (
          <div key={i} className="flex gap-2">
            <input value={r.name} placeholder="الاسم"
              onChange={(e) => onSet(lessonId, kind, i, { name: e.target.value })}
              className="w-28 rounded-lg border border-gold/30 bg-cream px-3 py-1.5 text-right font-body text-sm outline-none" />
            <input value={r.url} placeholder="الرابط"
              onChange={(e) => onSet(lessonId, kind, i, { url: e.target.value })}
              className="flex-1 rounded-lg border border-gold/30 bg-cream px-3 py-1.5 text-right font-body text-sm outline-none" dir="ltr" />
            <button onClick={() => onRemove(lessonId, kind, i)}
              className="rounded-lg p-1.5 text-burgundy hover:bg-burgundy/10"><Trash2 size={15} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="font-body text-xs text-stone">لا توجد ملفات.</p>}
      </div>
    </div>
  );
}

// ---------- تبويب الاختبارات ----------
function QuizzesTab({ draft, setDraft }) {
  const lessons = [...draft.lessons].sort((a, b) => a.order - b.order);

  const setQ = (lessonId, list) =>
    setDraft((d) => ({ ...d, quizzes: { ...d.quizzes, [lessonId]: list } }));

  const addQ = (lessonId) => {
    const list = [...(draft.quizzes[lessonId] || []),
      { q: "سؤال جديد", options: ["", ""], correct: 0 }];
    setQ(lessonId, list);
  };
  const removeQ = (lessonId, qi) =>
    setQ(lessonId, draft.quizzes[lessonId].filter((_, i) => i !== qi));
  const editQ = (lessonId, qi, patch) =>
    setQ(lessonId, draft.quizzes[lessonId].map((q, i) => i === qi ? { ...q, ...patch } : q));

  return (
    <div className="space-y-4">
      {lessons.map((l) => {
        const qs = draft.quizzes[l.id] || [];
        return (
          <Card key={l.id}>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">{l.title}</span>
              <button onClick={() => addQ(l.id)}
                className="flex items-center gap-1 rounded-full bg-stone/20 px-3 py-1 font-body text-xs text-desert hover:bg-stone/30">
                <Plus size={13} /> سؤال
              </button>
            </div>
            <div className="space-y-4">
              {qs.map((q, qi) => (
                <div key={qi} className="rounded-xl border border-gold/20 bg-parchment/60 p-3">
                  <div className="flex gap-2">
                    <input value={q.q} onChange={(e) => editQ(l.id, qi, { q: e.target.value })}
                      className="flex-1 rounded-lg border border-gold/30 bg-cream px-3 py-1.5 text-right font-body text-sm outline-none" />
                    <button onClick={() => removeQ(l.id, qi)}
                      className="rounded-lg p-1.5 text-burgundy hover:bg-burgundy/10"><Trash2 size={15} /></button>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input type="radio" name={`c-${l.id}-${qi}`} checked={q.correct === oi}
                          onChange={() => editQ(l.id, qi, { correct: oi })}
                          className="accent-burgundy" title="الإجابة الصحيحة" />
                        <input value={opt}
                          onChange={(e) => editQ(l.id, qi, {
                            options: q.options.map((o, i) => i === oi ? e.target.value : o),
                          })}
                          placeholder={`خيار ${oi + 1}`}
                          className="flex-1 rounded-lg border border-gold/30 bg-cream px-3 py-1.5 text-right font-body text-sm outline-none" />
                        <button onClick={() => editQ(l.id, qi, {
                          options: q.options.filter((_, i) => i !== oi),
                          correct: q.correct >= q.options.length - 1 ? 0 : q.correct,
                        })}
                          className="rounded-lg p-1 text-stone hover:bg-sand"><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => editQ(l.id, qi, { options: [...q.options, ""] })}
                      className="mt-1 font-body text-xs text-burgundy hover:underline">+ خيار</button>
                  </div>
                </div>
              ))}
              {qs.length === 0 && <p className="font-body text-xs text-stone">لا توجد أسئلة.</p>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ---------- تبويب من نحن ----------
function TeamTab({ draft, setDraft }) {
  const t = draft.team;
  const setMembers = (members) => setDraft((d) => ({ ...d, team: { ...t, members } }));
  return (
    <Card>
      <Field label="عنوان الفريق" value={t.title}
        onChange={(v) => setDraft((d) => ({ ...d, team: { ...t, title: v } }))} />
      <div className="mt-4 space-y-2">
        {t.members.map((m, i) => (
          <div key={i} className="flex gap-2">
            <input value={m} onChange={(e) => setMembers(t.members.map((x, j) => j === i ? e.target.value : x))}
              className="flex-1 rounded-lg border border-gold/30 bg-cream px-3 py-2 text-right font-body outline-none" />
            <button onClick={() => setMembers(t.members.filter((_, j) => j !== i))}
              className="rounded-lg p-2 text-burgundy hover:bg-burgundy/10"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={() => setMembers([...t.members, ""])}
          className="flex items-center gap-1 rounded-full bg-stone/20 px-4 py-1.5 font-body text-sm text-desert hover:bg-stone/30">
          <Plus size={14} /> إضافة عضو
        </button>
      </div>
    </Card>
  );
}

// ---------- تبويب المراجع ----------
function ReferencesTab({ draft, setDraft }) {
  const refs = draft.references || [];
  const set = (r) => setDraft((d) => ({ ...d, references: r }));
  return (
    <Card>
      <div className="space-y-2">
        {refs.map((r, i) => (
          <div key={i} className="flex gap-2">
            <input value={r} onChange={(e) => set(refs.map((x, j) => j === i ? e.target.value : x))}
              className="flex-1 rounded-lg border border-gold/30 bg-cream px-3 py-2 text-right font-body outline-none" />
            <button onClick={() => set(refs.filter((_, j) => j !== i))}
              className="rounded-lg p-2 text-burgundy hover:bg-burgundy/10"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={() => set([...refs, ""])}
          className="flex items-center gap-1 rounded-full bg-stone/20 px-4 py-1.5 font-body text-sm text-desert hover:bg-stone/30">
          <Plus size={14} /> إضافة مرجع
        </button>
      </div>
    </Card>
  );
}
