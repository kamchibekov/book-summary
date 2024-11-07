import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Bookmark from '@mui/icons-material/BookmarkOutlined';
import { DashboardContext } from '../contexts';
import { HighlightText } from '../config/types';
import { useAlert } from '../providers/AlertProvider';
import Strings from '../config/strings';

interface TextSelectionProps {
    selection: Selection;
    saveHighlight: (highlight: HighlightText) => void;
}

const TextSelection = ({ selection, saveHighlight }: TextSelectionProps) => {
    const { readingBook } = useContext(DashboardContext);
    const { pushAlert } = useAlert();

    if (!readingBook) return <></>

    const handleSaveHighlight = () => {
        const highlightText: HighlightText = {
            text: selection.toString()
        };
        saveHighlight(highlightText);
        pushAlert('success', 'Highlight saved!');
    };

    const positionIcon = () => {
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const iconTop = rect.top + window.scrollY - 30; // Adjust as needed
            const iconLeft = rect.left + window.scrollX + rect.width / 2 - 15; // Adjust as needed
            return { top: iconTop, left: iconLeft };
        }
    };

    return (
        <>
            <Box sx={{ position: 'absolute', ...positionIcon() }}>
                <Button variant='contained' startIcon={<Bookmark />} onClick={handleSaveHighlight} color='success'>
                    {Strings.highlight}
                </Button>
            </Box>
        </>
    );
};

export default TextSelection;