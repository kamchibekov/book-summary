import React, { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../contexts';
import { Book, HighlightInfo, HighlightText, SelectionWithHighlight } from '../config/types';
import { useAlert } from '../providers/AlertProvider';
import { useParams, Navigate } from 'react-router-dom';
import RouteEnum from '../config/routes';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Strings from '../config/strings';
import { fetchBookById, setBookFinished, checkTodaysBook } from '../api/books.api';
import Box from '@mui/material/Box';
import { saveHighlight, getHighlightsByBookId, subscribeToHighlightChanges } from "../api/highlights.api";
import TextSelection from "./TextSelection";
import Highlighter from "./Highlighter";

function BookContent() {
  const { user, readingBook } = useContext(DashboardContext)
  const { bookId } = useParams();

  const [book, setBook] = useState<Book | null>(readingBook);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const { pushAlert } = useAlert();
  const [isTodaysBook, setIsTodaysBook] = useState<Boolean>(false);
  const [selection, setSelection] = useState<SelectionWithHighlight | null>(null);
  const [highlights, setHighlights] = useState<HighlightText[] | null>(null);

  if (!bookId) return <Navigate to={RouteEnum.NotFound} replace />

  useEffect(() => {
    const fetchBook = async () => {
      const fetchedBook = await fetchBookById(bookId);
      setBook(fetchedBook);
      setIsLoading(false);
    };
    if (!book) {
      setIsLoading(true);
      fetchBook();
    } else {
      setIsLoading(false);
    }

  }, []);

  useEffect(() => {
    // Check if the book is todays book
    const fetchIsTodaysBook = async () => {
      const isTodaysBook = await checkTodaysBook(user, bookId);
      setIsTodaysBook(isTodaysBook);
    }
    fetchIsTodaysBook();
  }, []);

  useEffect(() => {
    // const fetchHighlights = async () => {
    //   const highlightInfo = await getHighlightsByBookId(user, bookId);
    //   setHighlights(highlightInfo?.highlights ?? null);
    // }
    // fetchHighlights();

    const unsubscribe = subscribeToHighlightChanges(user, bookId, setHighlights);

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, []);

  if (isLoading) return <CircularProgress />

  if (book === null) return <Navigate to={RouteEnum.NotFound} replace />

  const data = JSON.parse(book['summary'])

  const handleMouseUp = (chapter: string, text: string) => {
    const selection = window.getSelection();
    const selected = selection?.toString().trim() || "";

    // Normalize strings by removing whitespace and non-printable characters
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    const normalizedSelected = selected.replace(/\s+/g, ' ').trim();

    if (selection && selected && normalizedText.includes(normalizedSelected)) {
      const start = normalizedText.indexOf(normalizedSelected);
      const end = start + normalizedSelected.length;

      const selectionWithHighlight: SelectionWithHighlight = {
        selection,
        highlightedText: {
          text: selected,
          start,
          end,
          color: 'rgb(254 220 134/1)',
          chapter
        }
      }
      setSelection(selectionWithHighlight);
    } else {
      setSelection(null);
    }
  };

  const handleSaveHighlight = (highlightedText: HighlightText) => {
    saveHighlight(user, highlightedText, book)
    setSelection(null)
    pushAlert('success', Strings.highlight_saved);
  }

  const handleFinishRead = () => {
    setBookFinished(user, book.id)
    pushAlert('success', Strings.marked_finished);
  }

  return (
    <div>
      <h1>{book.title}</h1>
      {Object.entries(data).map(([key, content]) => (
        <div key={key}>
          <h2>{key}</h2>
          <p onMouseUp={() => handleMouseUp(key, content as string)}>
            <Highlighter highlights={highlights} chapter={key} content={content as string} />
          </p>
        </div>
      ))}
      {isTodaysBook && (
        <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }} mt={4}>
          <Button variant="contained" onClick={handleFinishRead}>
            {Strings.set_finished}
          </Button>
        </Box>)}
      {selection && (
        <TextSelection
          selection={selection}
          callback={handleSaveHighlight}
        />
      )}
      <br />
    </div>
  );
}

export default BookContent;