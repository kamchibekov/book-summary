import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { HighlightInfo, HighlightText } from "../config/types";
import { DashboardContext } from "../contexts";
import IconButton from "@mui/material/IconButton";
import { deleteHighlight, subscribeToHighlightInfo } from "../api/highlights.api";
import Box from "@mui/material/Box";
import CopyAllTwoToneIcon from "@mui/icons-material/CopyAllTwoTone";
import { useAlert } from "../providers/AlertProvider";
import Close from "@mui/icons-material/Close";
import Strings from "../config/strings";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import RouteEnum from "../config/routes";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function normalizeHighlights(highlights: HighlightText[]): [string, string][] {
  return Object.entries(highlights).map(([id, highlight]) => ([id, highlight.text]))
}

function BookHighlights() {

  const { user } = useContext(DashboardContext)
  const { pushAlert } = useAlert();
  const { bookId } = useParams<{ bookId: string }>();
  const [highlightInfo, setHighlightInfo] = useState<HighlightInfo | null>(null);
  const navigate = useNavigate();

  if (!bookId) return <Navigate to={RouteEnum.NotFound} replace />

  useEffect(() => {
    const unsubscribe = subscribeToHighlightInfo(user, bookId, setHighlightInfo);

    // Cleanup subscription on unmount
    return () => unsubscribe();

    // Change state when user changes
  }, [user]);

  if (!highlightInfo) return '' //<Navigate to={RouteEnum.NotFound} replace />


  const handleDelete = (id: string) => {
    if (window.confirm(Strings.highlight_delete_confirm)) {
      deleteHighlight(user, highlightInfo.book_id, id);
      // splice highlights array
      pushAlert('success', Strings.highlight_deleted);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    pushAlert('success', Strings.highlight_copied);
  }

  const handleViewBlink = () => {
    // open a new tab with the blink link
    navigate(RouteEnum.Book.replace(':bookId', highlightInfo.book_id))
  }

  return (
    <>
      <Grid container spacing={2} mt={2}>

        {/* Book Cover and Information */}
        <Grid size={{ xs: 12, md: 3, sm: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={highlightInfo.book_image_url}
              alt={highlightInfo.book_title}
              style={{ width: "100%", borderRadius: 8, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleViewBlink}>
              View Blink
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9, sm: 8 }}>
          {/* Book Title, Author, and Highlights Count */}
          <Box sx={{ p: 1 }}>
            <Typography variant="h5" component="div">
              {highlightInfo.book_title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              by {highlightInfo.book_author}
            </Typography>
            <Typography variant="h6" color="text.secondary" mt={1}>
              Your Highlights ({Object.keys(highlightInfo.highlights).length})
            </Typography>
          </Box>

          {/* Highlights List */}
          <Box>
            {normalizeHighlights(highlightInfo.highlights).map(([id, text]) => (
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