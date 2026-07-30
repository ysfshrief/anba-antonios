import { useEffect, useState } from "react";
import { videos as localVideos } from "../data/videos";
import { firebaseConfig, isFirebaseConfigured } from "../lib/firebase";

// Google Drive share link -> embeddable preview URL
export function toDrivePreview(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  const id = match ? match[1] : null;
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

/**
 * Loads the video list.
 * - If Firebase is configured -> read the `videos` collection from Firestore.
 * - Otherwise -> use the local src/data/videos.js list.
 * Always returns only visible videos, sorted by `order`.
 */
export function useVideos() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    videos: [],
  });

  useEffect(() => {
    let active = true;

    async function load() {
      // ---- Local fallback ----
      if (!isFirebaseConfigured) {
        const list = localVideos
          .filter((v) => v.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        // small delay so skeletons feel intentional, not jittery
        setTimeout(() => {
          if (active) setState({ loading: false, error: null, videos: list });
        }, 500);
        return;
      }

      // ---- Firestore ----
      try {
        const { initializeApp } = await import("firebase/app");
        const { getFirestore, collection, getDocs } = await import(
          "firebase/firestore"
        );
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const snap = await getDocs(collection(db, "videos"));
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((v) => v.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (active) setState({ loading: false, error: null, videos: list });
      } catch (err) {
        console.error("Firestore load failed, using local list:", err);
        const list = localVideos
          .filter((v) => v.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (active)
          setState({ loading: false, error: null, videos: list });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
