import {
  ref,
  push,
  get,
  remove,
  getDatabase,
  set,
  child,
  onValue,
  off,
  serverTimestamp,
} from 'firebase/database';
import { User } from 'firebase/auth';
import { HighlightInfo, HighlightText, Book } from '../config/types';
import Strings from '../config/strings';
import { getCachedImageUrl } from './storage.api';

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
      await push(highlightsRef, highlightText);
      console.log('Added new highlight text to existing book.');
    } else {
      // If the book does not exist, create a new book entry and push the first highlight with an auto-generated ID
      const newBookData = {
        book_id: readingBook.id,
        book_title: readingBook.title,
        book_author: readingBook.author,
        book_image_url: readingBook.image_url,
        highlights: {}, // Initialize highlights as an object for pushing
        created_at: serverTimestamp(),
      };
      await set(bookRef, newBookData);

      // Now push the first highlight
      const highlightsRef = child(bookRef, 'highlights');
      await push(highlightsRef, highlightText);
      console.log('Created new book entry with initial highlight.');
    }
  } catch (error) {
    console.error('Error saving highlight:', error);
  }
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

// Firebase subscription for Highlight Changes
export const subscribeToHighlightChanges = (
  user: User,
  bookId: string,
  setHighlights: React.Dispatch<React.SetStateAction<HighlightText[] | null>>
) => {
  const db = getDatabase();
  const highlightsRef = ref(
    db,
    `${Strings.db_highlights}/${user.uid}/${bookId}/highlights`
  );

  const unsubscribe = onValue(highlightsRef, (snapshot) => {
    const data: object = snapshot.val();
    if (data) {
      // assign key to each highlight
      setHighlights(Object.entries(data).map(([key, h]) => ({ key, ...h })));
    } else {
      setHighlights(null);
    }
  });

  return () => off(highlightsRef, 'value', unsubscribe);
};

// Firebase subscription for book highlightsInfo changes
export const subscribeToBookHighlightsInfoChanges = (
  user: User,
  setBooks: React.Dispatch<React.SetStateAction<HighlightInfo[]>>
) => {
  const db = getDatabase();
  const highlightsRef = ref(db, `${Strings.db_highlights}/${user.uid}`);

  const unsubscribe = onValue(highlightsRef, (snapshot) => {
    const data: HighlightInfo[] | null = snapshot.val();
    if (data) {
      const promises = Object.entries(data).map(async ([key, h]) => {
        const imgUrl = await getCachedImageUrl(h.book_image_url);
        return { key, ...h, book_image_url: imgUrl };
      });

      Promise.all(promises).then((books) => {
        setBooks(books);
      });
    }
  });

  return () => off(highlightsRef, 'value', unsubscribe);
};

// Firebase subscription for fetching single book highlight info
export const subscribeToHighlightInfo = (
  user: User,
  bookId: string,
  setHighlightInfo: React.Dispatch<React.SetStateAction<HighlightInfo | null>>
) => {
  const db = getDatabase();
  const highlightsRef = ref(
    db,
    `${Strings.db_highlights}/${user.uid}/${bookId}`
  );

  const unsubscribe = onValue(highlightsRef, async (snapshot) => {
    const data: HighlightInfo = snapshot.val();
    if (data) {
      const imgUrl = await getCachedImageUrl(data.book_image_url);
      setHighlightInfo({ ...data, book_image_url: imgUrl });
    }
  });

  return () => off(highlightsRef, 'value', unsubscribe);
};
