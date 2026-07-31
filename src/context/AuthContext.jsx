import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const USER_KEY = "anba-user";
const PROGRESS_KEY = "anba-progress";
const ADMIN_KEY = "anba-admin";

// كلمة مرور لوحة الإدارة (حسب المتطلبات).
// ملاحظة أمنية: في تطبيق فرونت-إند فقط، لا يمكن إخفاؤها تمامًا؛
// الحماية الحقيقية للبيانات يجب أن تكون عبر Firestore Security Rules.
const ADMIN_PASSWORD = "01062432084";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
  });
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; }
  });
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === "1");

  useEffect(() => { localStorage.setItem(USER_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }, [progress]);

  // تسجيل دخول بسيط بالاسم (بدون كلمة مرور للمستخدم العادي)
  const login = useCallback((name) => {
    const clean = (name || "").trim();
    if (!clean) return false;
    setUser({ name: clean, since: Date.now() });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  // لوحة الإدارة
  const adminLogin = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, "1");
      return true;
    }
    return false;
  }, []);
  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  }, []);

  // ---- تتبّع التقدم ----
  // progress[lessonId] = { watched: 0..1, passed: bool, score: 0..1 }
  const setLessonWatched = useCallback((lessonId, ratio) => {
    setProgress((p) => {
      const cur = p[lessonId] || {};
      const watched = Math.max(cur.watched || 0, ratio);
      return { ...p, [lessonId]: { ...cur, watched } };
    });
  }, []);

  const setLessonResult = useCallback((lessonId, passed, score) => {
    setProgress((p) => ({
      ...p,
      [lessonId]: { ...(p[lessonId] || {}), passed, score },
    }));
  }, []);

  const value = {
    user, login, logout,
    isAdmin, adminLogin, adminLogout,
    progress, setLessonWatched, setLessonResult,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
