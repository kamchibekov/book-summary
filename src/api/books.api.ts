import {
  ref,
  get,
  query,
  limitToFirst,
  orderByKey,
  set,
  endBefore,
  equalTo,
  startAfter,
  startAt,
  endAt,
  onValue,
  off,
} from 'firebase/database';
import { User } from 'firebase/auth';
import { Book } from '../config/types';
import { getDatabase } from 'firebase/database';
import Strings from '../config/strings';

export const fetchBook = async (user: User) => {
  const db = getDatabase();

  // Get finished book IDs for the user
  const userFinishedBooksRef = ref(
    db,
    `${Strings.db_finished_books}/${user.uid}`
  );
  const userFinishedBooksSnapshot = await get(userFinishedBooksRef);
  const currentBookId =
    userFinishedBooksSnapshot.child('current_book_id').val() || '';

  if (currentBookId) {
    const currentBookQuery = query(
      ref(db, Strings.db_books),
      orderByKey(), // Add this line to specify ordering by key
      equalTo(currentBookId)
    );

    const currentBookSnapshot = await get(currentBookQuery);
    const [id, currentBookData] =
      Object.entries(currentBookSnapshot.val())[0] || [];

    if (currentBookData) {
      // Process the data as needed
      const currentBook = { ...currentBookData, id: id } as Book;
      return currentBook;
    } else {
      console.log('Error fetching todays book.');
      return null;
    }
  }

  // If currentBookId is undefined, query for the first book
  const firstBookQuery = query(
    ref(db, Strings.db_books),
    orderByKey(),
    limitToFirst(1)
  );

  const firstBookSnapshot = await get(firstBookQuery);

  const [firstBookId, firstBookData] =
    Object.entries(firstBookSnapshot.val())[0] || [];

  if (!firstBookData) {
    console.error('No books available.');
    return null;
  }

  const firstBook = { ...firstBookData, id: firstBookId } as Book;

  // Update the 'current_book_id'
  await set(userFinishedBooksRef, { current_book_id: firstBookId });

  return firstBook;
};

export const setBookFinished = async (user: User, bookId: string) => {
  const db = getDatabase();

  // Update current book
  const nextBookQuery = query(
    ref(db, Strings.db_books),
    orderByKey(),
    startAt(bookId),
    limitToFirst(2)
  );

  const nextBookSnapshot = await get(nextBookQuery);

  const [id, nextBookData] = Object.entries(nextBookSnapshot.val())[1] || [];
  if (!nextBookData) {
    console.error('No books available.');
    return null;
  }

  const nextBook = { ...nextBookData, id: id } as Book;

  // Get finished book IDs for the user
  const userFinishedBooksRef = ref(
    db,
    `${Strings.db_finished_books}/${user.uid}`
  );

  // Update the 'current_book_id'
  await set(userFinishedBooksRef, { current_book_id: nextBook.id });

  console.log('new book was fetched:', nextBook);
  return nextBook;
};

export const getLibraryBooks = async (user: User) => {
  const db = getDatabase();

  // Get finished book IDs for the user
  const userFinishedBooksRef = ref(
    db,
    `${Strings.db_finished_books}/${user.uid}`
  );
  const userFinishedBooksSnapshot = await get(userFinishedBooksRef);
  const currentBookId =
    userFinishedBooksSnapshot.child('current_book_id').val() || null;

  if (!currentBookId) return [];

  // If currentBookId is available, query for books
  const allBooksQuery = query(
    ref(db, 'books'),
    orderByKey(),
    endBefore(currentBookId) // books read to this boook
  );

  const allBooksSnapshot = await get(allBooksQuery);

  const allBooks: Record<string, Book> = allBooksSnapshot.val() || {};
  const orderedBooks: Book[] = Object.entries(allBooks).map(([id, data]) => ({
    ...data,
    id,
  }));

  return orderedBooks;
};

export const fetchBookById = async (bookId: string) => {
  const db = getDatabase();
  const book = query(
    ref(db, 'books'),
    orderByKey(), // Add this line to specify ordering by key
    equalTo(bookId)
  );

  const bookSnapshot = await get(book);

  if (!bookSnapshot.exists()) return null;

  const [id, bookData] = Object.entries(bookSnapshot.val())[0] || [];

  if (bookData) {
    // Process the data as needed
    const fetchedBook = { ...bookData, id: id } as Book;
    return fetchedBook;
  }
  console.log('Error fetching a book.');
  return null;
};

export const checkTodaysBook = async (
  user: User,
  bookId: string
): Promise<Boolean> => {
  const db = getDatabase();
  // Check if the current book is todays book
  const bookQuery = query(
    ref(db, `${Strings.db_finished_books}/${user.uid}/current_book_id`)
  );

  const bookSnapshot = await get(bookQuery);

  return bookSnapshot.val() === bookId;
};

// Firebase subscription for book fetch
export const subscribeToBookChanges = (
  book_id: string,
  setBook: React.Dispatch<React.SetStateAction<Book | null>>
) => {
  const db = getDatabase();
  const bookRef = ref(db, `${Strings.db_books}/${book_id}`);

  const unsubscribe = onValue(bookRef, (snapshot) => {
    const data: Book = snapshot.val();

    if (data) {
      // Process the data as needed
      const fetchedBook = { ...data, id: book_id } as Book;
      setBook(fetchedBook);
    }
  });

  return () => off(bookRef, 'value', unsubscribe);
};
