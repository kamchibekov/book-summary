import React, { useContext, useState } from 'react';
import { HighlightText } from '../config/types';
import { deleteHighlight } from '../api/highlights.api';
import { useParams } from 'react-router-dom';
import { DashboardContext } from '../contexts';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useAlert } from '../providers/AlertProvider';
import Typography from '@mui/material/Typography';

interface HighlighterProps {
  highlights: HighlightText[] | null;
  content: string;
  chapter: string;
}

function Highlighter({ chapter, highlights, content }: HighlighterProps) {
  // If highlights are not available, return the original text
  if (!highlights) return content;

  const { user } = useContext(DashboardContext)
  const { bookId } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentHighlight, setCurrentHighlight] = useState<HighlightText | null>(null);
  const { pushAlert } = useAlert();

  // find all highlights in this chapter
  const highlightsInChapter = highlights.filter(highlight => highlight.chapter === chapter);

  // if there are no highlights in this chapter, return the original text
  if (highlightsInChapter.length === 0) return content;

  const handleDelete = (key?: string) => {
    if (!bookId || !key) return;
    deleteHighlight(user, bookId, key);
    handleClosePopup();
  }

  const handleOpenPopup = (e: React.MouseEvent<HTMLElement>, highlight: HighlightText) => {
    setAnchorEl(e.currentTarget);
    setCurrentHighlight(highlight);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
    setCurrentHighlight(null);
  };

  const handleCopy = (text: string | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    handleClosePopup();
    pushAlert('success', 'Highlight copied to clipboard.');
  }

  function resolveHighlights(highlights: HighlightText[]): HighlightText[] {
    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    const adjusted: HighlightText[] = [];

    for (const highlight of highlights) {
      if (adjusted.length > 0) {
        const prev = adjusted[adjusted.length - 1];
        // If there's a conflict
        if (highlight.start <= prev.end) {
          // Adjust the start position of the current highlight
          highlight.start = prev.end + 1;

          // If start > end after adjustment, narrow the highlight
          if (highlight.start > highlight.end) {
            highlight.end = highlight.start;
          }
        }
      }
      adjusted.push({ ...highlight }); // Create a copy to avoid mutating the original object
    }

    return adjusted;
  }

  const renderHighlightedText = () => {

    const resolvedHighlights = resolveHighlights(highlightsInChapter);

    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    for (const highlight of resolvedHighlights) {
      const { start, end, color } = highlight;

      if (currentIndex < start) {
        parts.push(content.slice(currentIndex, start));
      }

      parts.push(
        <mark
          key={`${start}-${end}-${color}`}
          style={{ backgroundColor: color, cursor: 'pointer' }}
          onClick={(e: React.MouseEvent<HTMLElement>) => handleOpenPopup(e, highlight)}
        >
          {content.slice(start, end)}
        </mark>
      );

      currentIndex = Math.max(currentIndex, end);
    }

    if (currentIndex < content.length) {
      parts.push(content.slice(currentIndex));
    }

    return <Typography variant="body1">{parts}</Typography>; // Wrap in a React Fragment
  };

  return (
    <>
      {renderHighlightedText()}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        aria-hidden={false}
      >
        <ButtonGroup variant="contained" aria-label="Highlight options">
          <Button
            onClick={() => handleDelete(currentHighlight?.key)}
          >Unhighlight</Button>
          <Button
            onClick={() => handleCopy(currentHighlight?.text)}
          >Copy</Button>
        </ButtonGroup>
      </Popover>
    </>
  );
}
export default Highlighter;