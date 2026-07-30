// ============================================================
//  إعداد Firebase (اختياري)
//  إذا تركت القيم فارغة، سيستخدم الموقع ملف src/data/videos.js تلقائياً.
//  لتفعيل Firestore: املأ القيم أدناه من إعدادات مشروعك على Firebase.
// ============================================================

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// هل إعدادات Firebase مكتملة؟
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);
