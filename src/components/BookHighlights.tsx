import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { HighlightInfo, HighlightText } from "../config/types";
import { DashboardContext } from "../contexts";
import IconButton from "@mui/material/IconButton";
import { deleteHighlight } from "../api/highlights.api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CopyAllTwoToneIcon from "@mui/icons-material/CopyAllTwoTone";
import { useAlert } from "../providers/AlertProvider";
import Close from "@mui/icons-material/Close";
import Strings from "../config/strings";

function BookHighlights() {

  const { highlightInfo, user } = useContext(DashboardContext)
  const { pushAlert } = useAlert();

  const [highlights, setHighlights] = useState<string[][]>([]);

  if (highlightInfo === null) return <></>

  const handleDelete = (id: string) => {
    if (window.confirm(Strings.highlight_delete_confirm)) {
      deleteHighlight(user, highlightInfo.book_id, id);
      // splice highlights array
      setHighlights(prevHighlights => prevHighlights.filter(([prevId]) => prevId !== id));
      pushAlert('success', Strings.highlight_deleted);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    pushAlert('success', Strings.highlight_copied);
  }

  useEffect(() => {
    const highlights = Object.entries(highlightInfo.highlights).map(([id, highlight]) => ([id, highlight.text]));
    setHighlights(highlights);
  }, [highlightInfo])

  return (
    <>
      <Grid container spacing={2} mt={2}>

        {/* Book Cover and Information */}
        <Grid xs={12} sm={4} md={3}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={highlightInfo.book_image_url}
              alt={highlightInfo.book_title}
              style={{ width: "100%", borderRadius: 8, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
            />
            {/* <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
              View Blink
            </Button> */}
          </Box>
        </Grid>

        <Grid xs={12} sm={8} md={9}>
          {/* Book Title, Author, and Highlights Count */}
          <Box sx={{ p: 1 }}>
            <Typography variant="h5" component="div">
              {highlightInfo.book_title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              by {highlightInfo.book_author}
            </Typography>
            <Typography variant="h6" color="text.secondary" mt={1}>
              Your Highlights
            </Typography>
          </Box>

          {/* Highlights List */}
          <Box>
            {highlights.map(([id, text]) => (
              <Grid key={id} mb={2}>
                <Card sx={{ display: "flex", alignItems: "center" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{text}</Typography>
                  </CardContent>
                  <CardActions sx={{ flexDirection: "column" }}>
                    <IconButton onClick={() => handleDelete(id)}>
                      <Close />
                    </IconButton>
                    <IconButton onClick={() => handleCopy(text)}>
                      <CopyAllTwoToneIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Box>
        </Grid>

      </Grid>

    </>
  );
}

export default BookHighlights;