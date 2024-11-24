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
  set,
  child,
} from 'firebase/database';
import { User } from 'firebase/auth';
import { HighlightInfo, HighlightText, Book } from '../config/types';
import Strings from '../config/strings';

// save highlight
export const saveHighlight = async (
  user: User,
  highlightText: HighlightText,
  readingBook: Book
) => {
  const db = getDatabase();

  // Reference to the specific user's book highlights path
  const bookRef = ref(
    db,
    `${Strings.db_highlights}/${user.uid}/${readingBook.id}`
  );

  try {
    // Check if the book already exists in the user's highlights
    const snapshot = await get(bookRef);

    if (snapshot.exists()) {
      // If the book exists, push only the new highlight text to the existing highlights array
      const highlightsRef = child(bookRef, 'highlights');
      await push(highlightsRef, { text: highlightText.text });
      console.log('Added new highlight text to existing book.');
    } else {
      // If the book does not exist, create a new book entry and push the first highlight with an auto-generated ID
      const newBookData = {
        book_id: readingBook.id,
        book_title: readingBook.title,
        book_author: readingBook.author,
        book_image_url: readingBook.image_url,
        highlights: {}, // Initialize highlights as an object for pushing
      };
      await set(bookRef, newBookData);

      // Now push the first highlight
      const highlightsRef = child(bookRef, 'highlights');
      await push(highlightsRef, { text: highlightText.text });
      console.log('Created new book entry with initial highlight.');
    }
  } catch (error) {
    console.error('Error saving highlight:', error);
  }
};

// get all user highlights with pagination
export const getHighlights = async (user: User, key: string | null) => {
  let isLastPage: string | boolean | undefined = false;

  const PAGE_SIZE = 50; // This needs to be set through settings. Example: Settings -> Highlights -> per page = 50

  // Initial page load
  const db = getDatabase();
  const highlightsRef = ref(db, `${Strings.db_highlights}/${user.uid}`);
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

  const highlightsData: Record<string, HighlightInfo> =
    highlightSnapshot.val() || {};

  const booksWithHighlights: HighlightInfo[] = Object.entries(
    highlightsData
  ).map(([id, data]) => ({ ...data, id }));

  // Check if this is the last page
  isLastPage =
    booksWithHighlights.length < PAGE_SIZE
      ? true
      : booksWithHighlights[booksWithHighlights.length - 1].id;

  return { booksWithHighlights, isLastPage };
};

// delete highlight
export const deleteHighlight = (user: User, bookId: string, id: string) => {
  console.log('deleting highlight', bookId, id);
  const db = getDatabase();
  const highlightsRef = ref(
    db,
    `${Strings.db_highlights}/${user.uid}/${bookId}/highlights/${id}`
  );
  remove(highlightsRef);
};

// get book highlights by id
export const getHighlightsByBookId = async (user: User, bookId: string) => {
  const db = getDatabase();
  const highlightsRef = ref(
    db,
    `${Strings.db_highlights}/${user.uid}/${bookId}`
  );
  const highlightSnapshot = await get(highlightsRef);
  const highlightsData: Record<string, HighlightInfo> =
    highlightSnapshot.val() || {};

  const highlightInfo: HighlightInfo | null = highlightsData
    ? ({ ...highlightsData, id: bookId } as HighlightInfo)
    : null;

  return highlightInfo;
};
