import { ref, get, query, limitToFirst, orderByKey, set, endBefore, equalTo, startAfter } from 'firebase/database';
import { User } from 'firebase/auth';
import { Book } from '../types';
import { getDatabase } from 'firebase/database';

export const fetchBook = async (user: User) => {
    const db = getDatabase();

    // Get finished book IDs for the user
    const userFinishedBooksRef = ref(db, `finished_books/${user.uid}`);
    const userFinishedBooksSnapshot = await get(userFinishedBooksRef);
    const currentBookId = userFinishedBooksSnapshot.child('current_book_id').val() || '';

    if (currentBookId) {
        const currentBookQuery = query(
            ref(db, 'books'),
            orderByKey(),  // Add this line to specify ordering by key
            equalTo(currentBookId)
        );

        const currentBookSnapshot = await get(currentBookQuery);
        const [id, currentBookData] = Object.entries(currentBookSnapshot.val())[0] || [];

        if (currentBookData) {
            // Process the data as needed
            const currentBook = { ...currentBookData, id: id } as Book;
            return currentBook;
        } else {
            console.log("Error fetching todays book.");
            return null;
        }
    }

    // If currentBookId is undefined, query for the first book
    const firstBookQuery = query(
        ref(db, 'books'),
        orderByKey(),
        limitToFirst(1)
    );

    const firstBookSnapshot = await get(firstBookQuery);

    const [firstBookId, firstBookData] = Object.entries(firstBookSnapshot.val())[0] || [];

    if (!firstBookData) {
        console.error('No books available.');
        return null;
    }

    const firstBook = { ...firstBookData, id: firstBookId } as Book;

    // Update the 'current_book_id'
    await set(userFinishedBooksRef, { current_book_id: firstBookId });

    console.log("new book was fetched", firstBook)
    return firstBook;
};


export const setBookFinished = async (user: User, book: Book) => {
    console.log("setting book to finished", book.id);

    const db = getDatabase();

    // Update current book
    const nextBookQuery = query(
        ref(db, 'books'),
        orderByKey(),
        startAfter(book.id),
        limitToFirst(1)
    );

    const nextBookSnapshot = await get(nextBookQuery);

    const [id, nextBookData] = Object.entries(nextBookSnapshot.val())[0] || [];
    if (!nextBookData) {
        console.error('No books available.');
        return null;
    }

    const nextBook = { ...nextBookData, id: id } as Book;

    // Get finished book IDs for the user
    const userFinishedBooksRef = ref(db, `finished_books/${user.uid}`);

    // Update the 'current_book_id'
    await set(userFinishedBooksRef, { current_book_id: nextBook.id });

    console.log("new book was fetched:", nextBook)
    return nextBook;
};


export const getLibraryBooks = async (user: User) => {
    const db = getDatabase();

    // Get finished book IDs for the user
    const userFinishedBooksRef = ref(db, `finished_books/${user.uid}`);
    const userFinishedBooksSnapshot = await get(userFinishedBooksRef);
    const currentBookId = userFinishedBooksSnapshot.child('current_book_id').val() || null;

    if (!currentBookId) return []

    // If currentBookId is available, query for books
    const allBooksQuery = query(
        ref(db, 'books'),
        orderByKey(),
        endBefore(currentBookId) // books read to this boook
    );

    const allBooksSnapshot = await get(allBooksQuery);

    const allBooks: Record<string, Book> = allBooksSnapshot.val() || {};
    const orderedBooks: Book[] = Object.entries(allBooks).map(([id, data]) => ({ ...data, id }));

    return orderedBooks;
}