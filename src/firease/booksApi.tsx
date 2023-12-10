import { ref, get, query, limitToFirst, orderByKey, startAt, set } from 'firebase/database';
import { User } from 'firebase/auth';
import { Book } from '../types';
import { getDatabase } from 'firebase/database';

export const getUnfinishedBooks = async (user: User) => {
    const db = getDatabase();

    // Get finished book IDs for the user
    const userFinishedBooksRef = ref(db, `finished_books/${user.uid}`);
    const userFinishedBooksSnapshot = await get(userFinishedBooksRef);
    const currentBookId = userFinishedBooksSnapshot.child('current_book_id').val() || '';

    let allBooksQuery;

    if (currentBookId) {
        // If currentBookId is available, query for the next 3 books
        allBooksQuery = query(
            ref(db, 'books'),
            orderByKey(),
            startAt(currentBookId),
            limitToFirst(4) // Assuming you want the next 3 books after the current one
        );
    } else {
        // If currentBookId is undefined, query for the first 3 books
        allBooksQuery = query(
            ref(db, 'books'),
            orderByKey(),
            limitToFirst(3)
        );
    }

    const allBooksSnapshot = await get(allBooksQuery);

    const allBooks: Record<string, Book> = allBooksSnapshot.val() || {};
    const orderedBooks: Book[] = Object.entries(allBooks).map(([id, data]) => ({ ...data, id }));

    const lastBook = orderedBooks[orderedBooks.length - 1];

    // Get the ID of the last book
    const lastBookId = lastBook.id;

    // Update the 'current_book_id'
    if (lastBookId) {
        // If lastBookId is available, update it
        //set(userFinishedBooksRef, { current_book_id: lastBookId });
    } else {
        // Handle the case where lastBookId is undefined
        console.error('Last book ID is undefined');
    }

    return orderedBooks;
};
