import React, { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { HighlightInfo } from "../config/types";
import { subscribeToBookHighlightsInfoChanges } from "../api/highlights.api";
import { DashboardContext } from "../contexts";
import Strings from "../config/strings";
import { useNavigate } from "react-router-dom";
import RuoteEnum from "../config/routes";

const HighlightsPage = () => {

  const navigate = useNavigate();
  const { user } = useContext(DashboardContext);

  const [books, setBooks] = useState<HighlightInfo[]>([]);

  // get books
  useEffect(() => {
    const unsubscribe = subscribeToBookHighlightsInfoChanges(user, setBooks);

    // Cleanup subscription on unmount
    return () => unsubscribe();

    // Change state when user changes
  }, [user])

  const handleHighlighInfoClick = (highlight: HighlightInfo) => {
    navigate(RuoteEnum.BookHighlights.replace(':bookId', highlight.book_id))
  }

  if (!books) return <React.Fragment>
    {Strings.no_highlights}
  </React.Fragment>

  return (
    <React.Fragment>
      <Grid container spacing={2} mt={2}>
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
    </React.Fragment>
  );
};

export default HighlightsPage;