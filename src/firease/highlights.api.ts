import { ref, push, get, remove, getDatabase } from "firebase/database";
import { User } from "firebase/auth";
import { Highlight } from "../types";

// save highlight
export const saveHighlight = (user: User | null, highlight: Highlight) => {
  if (highlight.text.trim().length === 0 || user === null) {
    return;
  }

  const db = getDatabase();
  const highlightsRef = ref(db, `highlights/${user.uid}`);
  push(highlightsRef, highlight);
};

// get all user highlights with pagination
export const getHighlights = async (user: User | null) => {
  if (user === null) {
    return [];
  }

  const db = getDatabase();
  const highlightsRef = ref(db, `highlights/${user.uid}`);
  const highlightsSnapshot = await get(highlightsRef);
  const highlightsData: Record<string, Highlight> =
    highlightsSnapshot.val() || {};
  const highlights: Highlight[] = Object.entries(highlightsData).map(
    ([id, data]) => ({ ...data, id })
  );

  return highlights;
};

// delete highlight
export const deleteHighlight = (user: User | null, id: string) => {
  if (user === null) {
    return;
  }

  const db = getDatabase();
  const highlightsRef = ref(db, `highlights/${user.uid}/${id}`);
  remove(highlightsRef);
};
