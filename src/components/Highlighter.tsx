import React, { useContext, useState } from 'react';
import { HighlightText } from '../config/types';
import { deleteHighlight } from '../api/highlights.api';
import { useParams } from 'react-router-dom';
import { DashboardContext } from '../contexts';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useAlert } from '../providers/AlertProvider';

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

  // Sort highlights to ensure they are rendered in order
  const sortedHighlights = Object.values(highlights).sort((a, b) => a.start - b.start);

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

  const renderHighlightedText = () => {
    const parts = [];
    let currentIndex = 0;

    for (const sortedHighlight of sortedHighlights) {
      const { start, end, color } = sortedHighlight;
      // Skip highlights that are not in the current content
      if (chapter !== sortedHighlight.chapter) continue;

      // Add non-highlighted text before the current highlight
      if (currentIndex < start) {
        parts.push(content.slice(currentIndex, start));
      }

      // Add highlighted text
      parts.push(
        <mark
          key={sortedHighlight.key}
          style={{
            backgroundColor: color,
            padding: "0 2px",
            borderRadius: "2px",
            cursor: 'pointer'
          }}
          onClick={(e: React.MouseEvent<HTMLElement>) => handleOpenPopup(e, sortedHighlight)}
        >
          {content.slice(start, end)}
        </mark>
      );

      currentIndex = end; // Move the current index to the end of the highlight
    }

    // Add any remaining non-highlighted text
    if (currentIndex < content.length) {
      parts.push(content.slice(currentIndex));
    }

    return parts;
  };

  return (
    <>
      {renderHighlightedText()}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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