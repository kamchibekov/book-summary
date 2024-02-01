import {
  ref,
  push,
  get,
  remove,
  getDatabase,
  query,
  limitToFirst,
  orderByKey,
  startAfter,
} from "firebase/database";
import { User } from "firebase/auth";
import { Highlight, BookHighlight } from "../types";

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
export const getHighlights = async (user: User | null, key: string | null) => {
  let groupedHighlights: BookHighlight[] = [];
  let isLastPage: string | boolean | undefined = false;

  if (user === null) {
    return { groupedHighlights, isLastPage };
  }

  const PAGE_SIZE = 50; // This needs to be set through settings. Example: Settings -> Highlights -> per page = 50

  // Initial page load
  const db = getDatabase();
  const highlightsRef = ref(db, `highlights/${user.uid}`);
  const highlightSnapshot =
    key === null
      ? await get(query(highlightsRef, limitToFirst(PAGE_SIZE)))
      : await get(
          query(
            highlightsRef,
            orderByKey(),
            startAfter(key),
            limitToFirst(PAGE_SIZE)
          )
        );

  const highlightsData: Record<string, Highlight> =
    highlightSnapshot.val() || {};

  const highlights: Highlight[] = Object.entries(highlightsData).map(
    ([id, data]) => ({ ...data, id })
  );

  // Check if this is the last page
  isLastPage =
    highlights.length < PAGE_SIZE ? true : highlights[highlights.length - 1].id;

  // Group highlights by book
  groupedHighlights = groupHighlights(highlights);

  return { groupedHighlights, isLastPage };
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

const groupHighlights = (data: Highlight[]) => {
  const groupedObject = {};
  for (let i = 0; i < data.length; i++) {
    const { book_id, book_title, book_author, book_image_url, id, text } =
      data[i];

    if (!groupedObject[book_id]) {
      groupedObject[book_id] = {
        book_id,
        book_title,
        book_author,
        book_image_url,
        highlights: [],
      };
    }

    groupedObject[book_id].highlights.push({ id, text });
  }
  return Object.values(groupedObject) as BookHighlight[];
};
