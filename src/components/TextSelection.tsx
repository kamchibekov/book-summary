import React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Circle from '@mui/icons-material/Circle';
import { HighlightText, CustomSelection, Color } from '../config/types';
import { serverTimestamp } from 'firebase/database';

interface TextSelectionProps {
  customSelection: CustomSelection;
  callback: (highlightedText: HighlightText) => void;
}

const TextSelection = ({ customSelection, callback }: TextSelectionProps) => {

  const positionIcon = () => {
    if (customSelection.selection.rangeCount > 0) {
      const range = customSelection.selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const iconTop = rect.top + window.scrollY - 30; // Adjust as needed
      const iconLeft = rect.left + window.scrollX + rect.width / 2 - 15; // Adjust as needed
      return { top: iconTop, left: iconLeft };
    }
  };

  const handleHighlight = (color: string) => {
    const { anchorNode, focusNode, anchorOffset, focusOffset } = customSelection.selection;
    // Determine the start node to calculate the start index
    let startNode = anchorNode;
    let start = anchorOffset;
    if (anchorOffset > focusOffset) {
      startNode = focusNode;
      start = focusOffset;
    }

    const bfs = (nodes: Node[], i = 0): undefined => {
      if (nodes[i] === startNode) return;

      console.log('node', nodes[i]);

      if (nodes[i].contains(startNode)) {
        for (let j = 0; j < nodes[i].childNodes.length; j++) {
          bfs(Array.from(nodes[i].childNodes), 0);
        }
        return;
      }

      start += nodes[i].textContent?.length || 0;
      bfs(Array.from(nodes), i + 1);
    }

    bfs(Array.from(customSelection.node.childNodes));

    // console.log('childNodes', customSelection.node.childNodes.length);
    // for (let i = 0; i < customSelection.node.childNodes.length; i++) {
    //   console.log('nodes', customSelection.node.childNodes[i]);
    //   if (customSelection.node.childNodes[i] === startNode) {
    //     break;
    //   }

    //   if (customSelection.node.childNodes[i].contains(startNode)) {
    //     start += startNode.textContent?.length || 0;
    //     break;
    //   }
    //   start += customSelection.node.childNodes[i].textContent?.length || 0;
    // };

    const highlightedText: HighlightText = {
      text: customSelection.selection.toString(),
      color,
      chapter: customSelection.key,
      start,
      end: start + customSelection.selection.toString().length,
      created_at: serverTimestamp(),
    };

    console.log(highlightedText);

    callback(highlightedText);
  };

  return (
    <>
      <Box sx={{ position: 'absolute', ...positionIcon(), backgroundColor: '#505050', borderRadius: '5px' }}>
        <ButtonGroup variant="outlined" aria-label="Highlight color button group">
          <IconButton onClick={() => handleHighlight(Color.orange)} color='warning'>
            <Circle />
          </IconButton>
          <IconButton onClick={() => handleHighlight(Color.green)} color='success'>
            <Circle />
          </IconButton>
          <IconButton onClick={() => handleHighlight(Color.blue)} color='info'>
            <Circle />
          </IconButton>
        </ButtonGroup>
      </Box>
    </>
  );
};

export default TextSelection;