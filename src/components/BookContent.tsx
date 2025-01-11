import React, { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../contexts';
import { Book, HighlightText, CustomSelection } from '../config/types';
import { useAlert } from '../providers/AlertProvider';
import { useParams, Navigate } from 'react-router-dom';
import RouteEnum from '../config/routes';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Strings from '../config/strings';
import { setBookFinished, checkTodaysBook, subscribeToBookChanges } from '../api/books.api';
import Box from '@mui/material/Box';
import { saveHighlight, subscribeToHighlightChanges } from "../api/highlights.api";
import TextSelection from "./TextSelection";
import Highlighter from "./Highlighter";

function BookContent() {
  const { user, readingBook } = useContext(DashboardContext)
  const { bookId } = useParams();

  const [book, setBook] = useState<Book | null>(readingBook);
  const { pushAlert } = useAlert();
  const [isTodaysBook, setIsTodaysBook] = useState<Boolean>(false);
  const [selection, setSelection] = useState<CustomSelection | null>(null);
  const [highlights, setHighlights] = useState<HighlightText[] | null>(null);

  if (!bookId) return <Navigate to={RouteEnum.NotFound} replace />

  useEffect(() => {
    if (!readingBook) {
      const unsubscribe = subscribeToBookChanges(bookId, setBook);
      console.log("Subscribed to book changes")

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    // Check if the book is todays book
    const fetchIsTodaysBook = async () => {
      const isTodaysBook = await checkTodaysBook(user, bookId);
      setIsTodaysBook(isTodaysBook);
    }
    fetchIsTodaysBook();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToHighlightChanges(user, bookId, setHighlights);

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, []);

  if (book === null) return '' //<Navigate to={RouteEnum.NotFound} replace />

  const data = JSON.parse(book['summary'])

  // Handle selected text on mouse up
  const handleMouseUp = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, chapter: string) => {
    const selection = window.getSelection();

    if (!selection?.toString().trim()) {
      setSelection(null);
      return;
    };

    const { anchorNode, focusNode } = selection;

    if (!e.currentTarget.contains(anchorNode) || !e.currentTarget.contains(focusNode)) return;

    const customSelection: CustomSelection = {
      selection,
      key: chapter,
      node: e.currentTarget,
    }
    setSelection(customSelection);
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
          <div onMouseUp={(e) => handleMouseUp(e, key)}>
            <Highlighter highlights={highlights} chapter={key} content={content as string} />
          </div>
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
          customSelection={selection}
          callback={handleSaveHighlight}
        />
      )}
      <br />
    </div>
  );
}

export default BookContent;