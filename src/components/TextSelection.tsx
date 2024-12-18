import React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Circle from '@mui/icons-material/Circle';
import { HighlightText, SelectionWithHighlight } from '../config/types';

interface TextSelectionProps {
  selection: SelectionWithHighlight;
  callback: (highlightedText: HighlightText) => void;
}

const TextSelection = ({ selection, callback }: TextSelectionProps) => {

  const positionIcon = () => {
    if (selection.selection.rangeCount > 0) {
      const range = selection.selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const iconTop = rect.top + window.scrollY - 30; // Adjust as needed
      const iconLeft = rect.left + window.scrollX + rect.width / 2 - 15; // Adjust as needed
      return { top: iconTop, left: iconLeft };
    }
  };

  const handleColorSelection = (color: string) => {
    callback({ ...selection.highlightedText, color })
  }

  return (
    <>
      <Box sx={{ position: 'absolute', ...positionIcon(), backgroundColor: '#505050', borderRadius: '5px' }}>
        <ButtonGroup variant="outlined" aria-label="Highlight color button group">
          <IconButton onClick={() => handleColorSelection('#ffa726')} color='warning'>
            <Circle />
          </IconButton>
          <IconButton onClick={() => handleColorSelection('#66bb6a')} color='success'>
            <Circle />
          </IconButton>
          <IconButton onClick={() => handleColorSelection('#2bb6f6')} color='info'>
            <Circle />
          </IconButton>
        </ButtonGroup>
      </Box>
    </>
  );
};

export default TextSelection;