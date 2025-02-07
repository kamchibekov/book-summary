import React, { useContext, useEffect, useState } from 'react';
import { Book } from '../config/types';
import { getLibraryBooks } from '../api/books.api';
import { DashboardContext } from '../contexts';
import Grid from '@mui/material/Grid2';
import BookCard from '../components/BookCard';
import SearchBox from '../components/SearchBox';

function LibraryPage() {
  const { user } = useContext(DashboardContext)

  // library fetch
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      const libraryBooksData = await getLibraryBooks(user);
      setBooks(libraryBooksData);
      setFilteredBooks(libraryBooksData);
      console.log("Library fetched")
    };
    fetchLibraryBooks();
  }, [user]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredBooks(books);
      return;
    }
    const filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredBooks(filteredBooks);
  }

  return (
    <Grid>
      <SearchBox onSearch={handleSearch} />
      {filteredBooks.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </Grid>
  );
}

export default LibraryPage;
