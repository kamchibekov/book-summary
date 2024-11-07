import React, { useContext, useEffect, useState } from 'react';
import { Book } from '../config/types';
import { getLibraryBooks } from '../api/books.api';
import { DashboardContext } from '../contexts';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import BookCard from '../components/BookCard';
import URL from '../config/routes';

function LibraryPage() {
  const { user } = useContext(DashboardContext)

  // library fetch
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      const libraryBooksData = await getLibraryBooks(user);
      setBooks(libraryBooksData);
      console.log("Library fetched")
    };
    fetchLibraryBooks();
  }, [user]);

  return (
    <Grid>
      {books.map((book, index) => (
        <BookCard key={index} book={book} url={URL.LibraryBook} />
      ))}
    </Grid>
  );
}

export default LibraryPage;
