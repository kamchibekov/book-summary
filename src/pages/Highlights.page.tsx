import React, { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import { HighlightInfo } from "../config/types";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getHighlights } from "../api/highlights.api";
import { DashboardContext } from "../contexts";
import Strings from "../config/strings";
import { useNavigate } from "react-router-dom";
import URL from "../config/routes";

const HighlightsPage = () => {

  const navigate = useNavigate();

  const { user, setHighlightInfo } = useContext(DashboardContext)
  const [books, setBooks] = useState<HighlightInfo[]>([]);
  const [currentKey, setCurrentKey] = useState<null | string>(null);
  const [isLastPage, setIsLastPage] = useState<string | boolean | undefined>(true);

  // get books
  useEffect(() => {
    const storage = getStorage();

    const fetchBooksWithHighlightsAndImages = async () => {
      const { booksWithHighlights, isLastPage } = await getHighlights(user, currentKey);

      // booksWithHighlightsAndImages is an array of objects with the book_image_url property
      const booksWithHighlightsAndImages = await Promise.all(
        booksWithHighlights.map(async (bookWithHighlights) => {
          const imageRef = ref(storage, bookWithHighlights.book_image_url);
          const url = await getDownloadURL(imageRef);
          return { ...bookWithHighlights, book_image_url: url };
        })
      );

      // Set last page or last highlight
      setIsLastPage(isLastPage);

      setBooks(booksWithHighlightsAndImages);

      console.log("highlights fetched", booksWithHighlightsAndImages, isLastPage)
    }

    fetchBooksWithHighlightsAndImages();
  }, [currentKey])

  const handleNextClick = () => {
    if (typeof isLastPage === 'string')
      setCurrentKey(isLastPage);
  };

  const handleHighlighInfoClick = (highlight: HighlightInfo) => {
    setHighlightInfo(highlight)
    navigate(URL.BookHighlights.replace(':bookId', highlight.book_id))
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} mt={2}>

        {books.length === 0 && <Typography variant="h6" align="center" color="text.secondary">{Strings.no_highlights}</Typography>}

        {books.map((book) => (
          <Grid key={book.book_id} md={2} sx={{ cursor: "pointer" }} onClick={() => handleHighlighInfoClick(book)}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={book.book_image_url}
                  alt={book.book_title}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {book.book_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.book_author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({Object.keys(book.highlights).length} Highlights)
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isLastPage !== true && (
        <Grid xs={12} sx={{ justifyContent: "space-evenly" }}>
          <Button variant="contained" onClick={handleNextClick}>
            Load more
          </Button>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default HighlightsPage;