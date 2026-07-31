import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { db, isFirebaseReady } from "../lib/firebase";
import {
  seedHome, seedLessons, seedQuizzes, seedTeam, seedReferences,
} from "../data/seed";

const ContentCtx = createContext(null);
export const useContent = () => useContext(ContentCtx);

const LOCAL_KEY = "anba-content";

// حزمة المحتوى الكاملة للموقع
function defaultContent() {
  return {
    home: seedHome,
    lessons: seedLessons,
    quizzes: seedQuizzes,
    team: seedTeam,
    references: seedReferences,
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      // وضع Demo / محلي
      if (!isFirebaseReady) {
        let data;
        try {
          data = JSON.parse(localStorage.getItem(LOCAL_KEY));
        } catch { data = null; }
        setTimeout(() => {
          if (active) { setContent(data || defaultContent()); setLoading(false); }
        }, 400);
        return;
      }
      // وضع Firestore: مستند واحد يجمع محتوى الموقع (يقلّل عدد الطلبات)
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const ref = doc(db, "site", "content");
        const snap = await getDoc(ref);
        if (active) {
          setContent(snap.exists() ? snap.data() : defaultContent());
          setLoading(false);
        }
      } catch (e) {
        console.error("content load failed, using defaults", e);
        if (active) { setContent(defaultContent()); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // حفظ التعديلات (من لوحة الإدارة)
  const save = useCallback(async (next) => {
    setContent(next);
    if (!isFirebaseReady) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      return true;
    }
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "site", "content"), next);
      return true;
    } catch (e) {
      console.error("save failed", e);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); // نسخة احتياطية
      return false;
    }
  }, []);

  const value = { content, loading, save, isFirebaseReady };
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}
