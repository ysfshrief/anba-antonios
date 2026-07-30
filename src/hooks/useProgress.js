import { useCallback, useEffect, useState } from "react";

const KEY = "anba-antonios-progress";

// Tracks which videos have been watched + the last one opened.
export function useProgress() {
  const [watched, setWatched] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { done: [], last: null };
    } catch {
      return { done: [], last: null };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(watched));
    } catch {
      /* storage unavailable — degrade quietly */
    }
  }, [watched]);

  const markWatched = useCallback((id) => {
    setWatched((prev) =>
      prev.done.includes(id)
        ? { ...prev, last: id }
        : { done: [...prev.done, id], last: id }
    );
  }, []);

  const isWatched = useCallback((id) => watched.done.includes(id), [watched]);

  return { watched, markWatched, isWatched, lastId: watched.last };
}
