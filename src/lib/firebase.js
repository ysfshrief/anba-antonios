// ============================================================
//  إعداد Firebase
//  املأ القيم من إعدادات مشروعك، أو ضعها في ملف .env
//  إذا تُركت فارغة، يعمل الموقع ببيانات تجريبية محلية (Demo).
// ============================================================
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || "",
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FB_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID || "",
  appId: import.meta.env.VITE_FB_APP_ID || "",
};

export const isFirebaseReady = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;
if (isFirebaseReady) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}
export { db };
