import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import { DashboardContext } from "../contexts";
import TextSelection from "./TextSelection";
import { saveHighlight } from "../api/highlights.api";
import { Book, HighlightText } from "../config/types";
import { useTheme } from "@mui/material/styles";
import { fetchBookById, setBookFinished } from "../api/books.api";
import Button from "@mui/material/Button";
import Strings from "../config/strings";
import { useAlert } from "../providers/AlertProvider";
import { useParams, Navigate } from "react-router-dom";
import RouteEnum from "../config/routes";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  showSaveButton?: boolean;
}

function MultiPageContent({ showSaveButton = true }: Props) {
  const theme = useTheme();
  const { user, readingBook } = useContext(DashboardContext)
  const { bookId } = useParams();

  const [book, setBook] = useState<Book | null>(readingBook);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { pushAlert } = useAlert();
  const [currentPage, setCurrentPage] = useState(0);
  const [selection, setSelection] = useState<Selection | null>(null);

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

  if (isLoading) return <CircularProgress />

  if (book === null) return <Navigate to={RouteEnum.NotFound} replace />

  const handleMouseUp = (text: string) => {
    const selection = window.getSelection();
    const selected = selection?.toString().trim() || "";

    // Normalize strings by removing whitespace and non-printable characters
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    const normalizedSelected = selected.replace(/\s+/g, ' ').trim();

    if (selected && normalizedText.includes(normalizedSelected)) {
      setSelection(selection);
    } else {
      setSelection(null);
    }
  };

  const handleSaveHighlight = (highlightText: HighlightText) => {
    saveHighlight(user, highlightText, book)
    setSelection(null)
  }

  const handleFinishRead = () => {
    setBookFinished(user, book.id)
    pushAlert('success', Strings.marked_finished);
  }

  const data = JSON.parse(book['summary'])
  const pages = Object.entries(data).map(([key, value]) => (
    <Box key={key} whiteSpace='pre-wrap'>
      <Typography variant="h6" align="center">{key}</Typography>
      <br />
      <Box
        onMouseUp={() => handleMouseUp(value as string)}
        sx={{ fontSize: '1.125rem', lineHeight: '1.625rem', color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : '#3a4649' }}
      >
        {value as React.ReactNode}
      </Box>
      {selection && (
        <TextSelection
          selection={selection}
          saveHighlight={handleSaveHighlight}
        />
      )}
    </Box>
  ));

  return (
    <Grid container mt={2} mb={2}>
      <Typography variant="h6" align="center" color="text.secondary" width="100%">
        {book.title}
      </Typography>
      {pages[currentPage]}
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }} mt={2}>
        {currentPage > 0 && (
          <IconButton aria-label="delete" onClick={() => setCurrentPage(currentPage - 1)}>
            <ChevronLeft fontSize="large" />
          </IconButton>
        )}
        {currentPage < pages.length - 1 && (
          <IconButton aria-label="delete" onClick={() => setCurrentPage(currentPage + 1)}>
            <ChevronRight fontSize="large" />
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }} mt={4}>
        <Typography variant="h6" color={theme.palette.text.secondary}>
          {currentPage + 1}/{pages.length}
        </Typography>
      </Box>
      {showSaveButton && currentPage === pages.length - 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }} mt={4}>
          <Button variant="contained" onClick={handleFinishRead}>
            {Strings.set_finished}
          </Button>
        </Box>
      )}
    </Grid>
  );
};

export default MultiPageContent;